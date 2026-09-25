"""
SmartBreadboard 3D — Complex Modified Nodal Analysis (Complex MNA) Engine (Phase 26)
Solves AC frequency-domain circuits using complex admittance matrices:
[ Y(jω)   B ] [ V(jω) ] = [ I(jω) ]
[ B^T     D ] [ J(jω) ]   [ E(jω) ]

Component Admittances:
- Resistor:  Y_R = 1 / R
- Inductor:  Y_L = 1 / (jωL) = -j / (ωL)
- Capacitor: Y_C = jωC
- Wire:      Y_W = 1000.0 S (1 mΩ internal resistance)
"""

import math
import cmath
import numpy as np
from typing import Dict, Any, List, Tuple, Optional
from .netlist_parser import parse_circuit_netlist
from .validation import validate_circuit_netlist


def parse_numeric(val: Any, default: float = 1.0) -> float:
    """Extracts numeric float from raw string or number."""
    if isinstance(val, (int, float)):
        return float(val) if not math.isnan(val) else default
    if not val:
        return default
    try:
        import re
        s = str(val).lower()
        # Handle metric prefixes
        mult = 1.0
        if "k" in s: mult = 1e3
        elif "m" in s and "meg" not in s and "µ" not in s and "u" not in s and "mh" not in s and "mf" not in s: mult = 1e-3
        elif "meg" in s: mult = 1e6
        elif "u" in s or "µ" in s: mult = 1e-6
        elif "n" in s: mult = 1e-9
        elif "p" in s: mult = 1e-12

        nums = re.findall(r"[-+]?(?:\d*\.\d+|\d+)", s)
        if nums:
            return float(nums[0]) * mult
    except Exception:
        pass
    return default


def solve_ac_frequency_point(netlist: Dict[str, Any], frequency_hz: float) -> Dict[str, Any]:
    """
    Solves AC steady-state complex node voltages and branch currents at a specific frequency f.
    Returns complex node voltages, magnitudes, phases, branch currents, and input impedance.
    """
    if frequency_hz <= 0:
        return {
            "success": False,
            "error": "Frequency must be strictly positive (f > 0 Hz)",
            "frequency": frequency_hz
        }

    omega = 2.0 * math.pi * frequency_hz
    components, sources, nodes_dict = parse_circuit_netlist(netlist)

    if not components:
        return {
            "success": False,
            "error": "Circuit contains no components for AC analysis.",
            "frequency": frequency_hz
        }

    # If power sources are explicitly provided, validate with standard netlist validator
    if sources:
        is_valid, err_dict, warnings = validate_circuit_netlist(netlist.get("components", []), sources)
        if not is_valid:
            return {
                "success": False,
                "error": err_dict or "Invalid circuit netlist",
                "warnings": warnings,
                "frequency": frequency_hz
            }

    # Import IC registry for op-amp terminal resolution
    try:
        from .ic_registry import resolve_opamp_terminals, get_ic_definition
    except ImportError:
        resolve_opamp_terminals = None
        get_ic_definition = None

    # Collect op-amp components from netlist
    raw_opamps = []
    for item in netlist.get("ics", []) + netlist.get("opamps", []):
        raw_opamps.append(item)
    for rc in netlist.get("components", []):
        ctype = str(rc.get("type", rc.get("class", ""))).lower()
        part = str(rc.get("model", rc.get("part_number", rc.get("value", "")))).upper()
        if "opamp" in ctype or "op_amp" in ctype or "ic" in ctype or any(k in part for k in ["LM741", "LM358", "TL072", "NE5532", "OP07"]):
            if rc not in raw_opamps:
                raw_opamps.append(rc)

    # Resolve Op-Amp Terminals and Models
    opamps = []
    opamp_errors = []
    if resolve_opamp_terminals:
        for idx, ro in enumerate(raw_opamps):
            res = resolve_opamp_terminals(ro)
            if res.get("success"):
                opamps.append({
                    "id": ro.get("id", f"U{idx+1}"),
                    "raw": ro,
                    "terminals": res["terminals"],
                    "ic_definition": res["ic_definition"]
                })
            else:
                opamp_errors.append(res.get("error", "Invalid op-amp pin configuration"))

    # Collect active nodes directly from components, sources, and op-amps
    active_nodes = set()
    for comp in components:
        if comp.node1: active_nodes.add(comp.node1)
        if comp.node2: active_nodes.add(comp.node2)
    for s in sources:
        pn = s.get("positive_node") or s.get("node_pos")
        nn = s.get("negative_node") or s.get("node_neg")
        if pn: active_nodes.add(pn)
        if nn: active_nodes.add(nn)
    for op in opamps:
        t = op["terminals"]
        for k in ["in_pos", "in_neg", "output", "v_plus", "v_minus"]:
            if t.get(k):
                active_nodes.add(t[k])

    # Find ground among active nodes
    ground_node_id = None
    if sources:
        ground_candidate = sources[0].get("negative_node") or sources[0].get("node_neg")
        if ground_candidate in active_nodes:
            ground_node_id = ground_candidate

    if not ground_node_id:
        for an in active_nodes:
            if "GND" in str(an).upper() or "GROUND" in str(an).upper() or str(an) == "0":
                ground_node_id = an
                break

    if not ground_node_id and active_nodes:
        # Fallback to the last node
        ground_node_id = sorted(list(active_nodes))[-1]

    node_list = [nid for nid in sorted(list(active_nodes)) if nid != ground_node_id]
    node_to_idx = {nid: idx for idx, nid in enumerate(node_list)}
    num_nodes = len(node_list)

    # Voltage Sources
    voltage_sources = []
    for s in sources:
        stype = str(s.get("type", "voltage_source")).lower()
        if "voltage" in stype or "ac" in stype or "dc" in stype or "source" in stype:
            voltage_sources.append(s)

    # If no sources in netlist, supply a default 1V AC source between input node and GND
    if not voltage_sources and num_nodes > 0:
        pos_node = None
        # Prioritize op-amp in_pos or general VIN
        for op in opamps:
            if op["terminals"].get("in_pos") and op["terminals"]["in_pos"] != ground_node_id:
                pos_node = op["terminals"]["in_pos"]
                break
        if not pos_node:
            for n in node_list:
                if "VIN" in str(n).upper() or "VCC" in str(n).upper() or "PWR" in str(n).upper() or "IN" in str(n).upper():
                    pos_node = n
                    break
        if not pos_node:
            pos_node = node_list[0]

        voltage_sources.append({
            "id": "V_AC_TEST",
            "type": "ac_voltage",
            "voltage": 1.0,
            "positive_node": pos_node,
            "negative_node": ground_node_id,
            "phase_deg": 0.0
        })

    num_vsrc = len(voltage_sources)
    num_opamps = len(opamps)
    matrix_size = num_nodes + num_vsrc + num_opamps

    if matrix_size == 0:
        return {
            "success": False,
            "error": "Empty circuit matrix",
            "frequency": frequency_hz
        }

    # Initialize Complex MNA Matrix A and RHS Vector Z
    A = np.zeros((matrix_size, matrix_size), dtype=np.complex128)
    Z = np.zeros((matrix_size, 1), dtype=np.complex128)

    # 1. Stamp Passive Components into Admittance Matrix Y
    for comp in components:
        n1, n2 = comp.node1, comp.node2
        ctype = str(comp.type).lower()
        val = parse_numeric(comp.value, 1.0)

        # Skip opamp component if it's in components list (handled via opamp stamping)
        if "opamp" in ctype or "op_amp" in ctype or "ic" in ctype:
            continue

        i1 = node_to_idx.get(n1, -1)
        i2 = node_to_idx.get(n2, -1)

        # Compute complex admittance Y = G + jB
        if "resistor" in ctype or "res" in ctype:
            r = max(val, 1e-6)
            y_comp = complex(1.0 / r, 0.0)
        elif "inductor" in ctype or "ind" in ctype:
            l = max(val, 1e-12)
            xl = omega * l
            y_comp = complex(0.0, -1.0 / max(xl, 1e-12))
        elif "capacitor" in ctype or "cap" in ctype:
            c = max(val, 1e-15)
            # If capacitance is > 1 without unit, assume microfarads
            if c > 1.0: c = c * 1e-6
            xc = omega * c
            y_comp = complex(0.0, xc)
        elif "wire" in ctype or "jumper" in ctype:
            y_comp = complex(1000.0, 0.0) # 1 mΩ equivalent
        else:
            # Default small leakage admittance
            y_comp = complex(1e-6, 0.0)

        # Stamp into Y sub-matrix
        if i1 >= 0:
            A[i1, i1] += y_comp
        if i2 >= 0:
            A[i2, i2] += y_comp
        if i1 >= 0 and i2 >= 0:
            A[i1, i2] -= y_comp
            A[i2, i1] -= y_comp

    # 2. Stamp Voltage Sources into B, B^T, D and Z
    for v_idx, vsrc in enumerate(voltage_sources):
        pos_node = vsrc.get("positive_node") or vsrc.get("node_pos")
        neg_node = vsrc.get("negative_node") or vsrc.get("node_neg")
        v_mag = parse_numeric(vsrc.get("voltage") or vsrc.get("nominal_voltage_v") or 1.0, 1.0)
        v_phase_deg = parse_numeric(vsrc.get("phase_deg") or 0.0, 0.0)
        v_phase_rad = math.radians(v_phase_deg)

        # Complex phasor V = V_mag * e^(j*phase)
        v_phasor = cmath.rect(v_mag, v_phase_rad)

        row_idx = num_nodes + v_idx

        i_pos = node_to_idx.get(pos_node, -1)
        i_neg = node_to_idx.get(neg_node, -1)

        if i_pos >= 0:
            A[i_pos, row_idx] += 1.0
            A[row_idx, i_pos] += 1.0
        if i_neg >= 0:
            A[i_neg, row_idx] -= 1.0
            A[row_idx, i_neg] -= 1.0

        Z[row_idx, 0] = v_phasor

    # 3. Stamp Op-Amps into MNA Matrix
    # For each op-amp k:
    # Column/Row idx = num_nodes + num_vsrc + k
    # Output current I_out enters node output: A[idx_out, col] += 1.0
    # Linear op-amp characteristic: V_+ - V_- - (1 / A_OL(jω)) * V_out = 0
    # Finite input impedance Rin: stamp 1/Rin between in_pos and in_neg
    for op_idx, op in enumerate(opamps):
        col_idx = num_nodes + num_vsrc + op_idx
        row_idx = num_nodes + num_vsrc + op_idx
        t = op["terminals"]
        defn = op.get("ic_definition", {})
        specs = defn.get("electrical_specs", {})

        in_pos = t.get("in_pos")
        in_neg = t.get("in_neg")
        out_node = t.get("output")

        i_pos = node_to_idx.get(in_pos, -1)
        i_neg = node_to_idx.get(in_neg, -1)
        i_out = node_to_idx.get(out_node, -1)

        # Calculate complex open-loop gain A_OL(jω)
        a_ol_0 = float(specs.get("open_loop_gain", 1.0e6))
        gbwp = float(specs.get("gbwp_hz", 1.0e6))
        f_pole = gbwp / max(a_ol_0, 1.0)
        a_ol_jw = complex(a_ol_0, 0.0) / complex(1.0, frequency_hz / max(f_pole, 1e-6))
        inv_gain = 1.0 / a_ol_jw

        # Stamp output current into KCL at out_node
        if i_out >= 0:
            A[i_out, col_idx] += 1.0

        # Stamp transfer equation into row_idx
        if i_pos >= 0:
            A[row_idx, i_pos] += 1.0
        if i_neg >= 0:
            A[row_idx, i_neg] -= 1.0
        if i_out >= 0:
            A[row_idx, i_out] -= inv_gain

        Z[row_idx, 0] = complex(0.0, 0.0)

        # Finite input impedance Rin if present
        r_in = float(specs.get("input_resistance_ohms", 0.0))
        if r_in > 10.0:
            y_in = complex(1.0 / r_in, 0.0)
            if i_pos >= 0: A[i_pos, i_pos] += y_in
            if i_neg >= 0: A[i_neg, i_neg] += y_in
            if i_pos >= 0 and i_neg >= 0:
                A[i_pos, i_neg] -= y_in
                A[i_neg, i_pos] -= y_in

    # Solve Complex Linear System A * X = Z
    try:
        X = np.linalg.solve(A, Z)
    except np.linalg.LinAlgError:
        # Regularization for singular floating nodes
        try:
            A_reg = A + np.eye(matrix_size) * complex(1e-9, 1e-9)
            X = np.linalg.solve(A_reg, Z)
        except Exception as e:
            return {
                "success": False,
                "error": f"Singular AC matrix at f={frequency_hz}Hz: {str(e)}",
                "frequency": frequency_hz
            }

    # Extract Complex Node Voltages
    complex_node_voltages = {ground_node_id: complex(0.0, 0.0)}
    node_voltage_results = {
        ground_node_id: {
            "magnitude": 0.0,
            "phase_deg": 0.0,
            "real": 0.0,
            "imag": 0.0,
            "formatted": "0.00 V ∠ 0.0°"
        }
    }

    for nid, idx in node_to_idx.items():
        v_c = complex(X[idx, 0])
        mag = abs(v_c)
        phase_deg = math.degrees(cmath.phase(v_c))
        complex_node_voltages[nid] = v_c
        node_voltage_results[nid] = {
            "magnitude": round(float(mag), 4),
            "phase_deg": round(float(phase_deg), 2),
            "real": round(float(v_c.real), 4),
            "imag": round(float(v_c.imag), 4),
            "formatted": f"{mag:.3f} V ∠ {phase_deg:.1f}°"
        }

    # Extract Branch / Component Currents
    component_results = {}
    for comp in components:
        n1, n2 = comp.node1, comp.node2
        v1 = complex_node_voltages.get(n1, complex(0, 0))
        v2 = complex_node_voltages.get(n2, complex(0, 0))
        v_drop = v1 - v2
        ctype = str(comp.type).lower()
        val = parse_numeric(comp.value, 1.0)

        # Admittance
        if "resistor" in ctype or "res" in ctype:
            y_comp = complex(1.0 / max(val, 1e-6), 0.0)
        elif "inductor" in ctype or "ind" in ctype:
            y_comp = complex(0.0, -1.0 / max(omega * max(val, 1e-12), 1e-12))
        elif "capacitor" in ctype or "cap" in ctype:
            c = val if val < 1.0 else val * 1e-6
            y_comp = complex(0.0, omega * c)
        else:
            y_comp = complex(1000.0, 0.0)

        i_comp = v_drop * y_comp
        i_mag = abs(i_comp)
        i_phase_deg = math.degrees(cmath.phase(i_comp))

        component_results[comp.id] = {
            "id": comp.id,
            "type": comp.type,
            "voltage_magnitude": round(float(abs(v_drop)), 4),
            "voltage_phase_deg": round(float(math.degrees(cmath.phase(v_drop))), 2),
            "current_magnitude_mA": round(float(i_mag * 1000.0), 4),
            "current_phase_deg": round(float(i_phase_deg), 2),
            "complex_voltage": {"real": round(float(v_drop.real), 4), "imag": round(float(v_drop.imag), 4)},
            "complex_current_A": {"real": round(float(i_comp.real), 6), "imag": round(float(i_comp.imag), 6)}
        }

    # Input Impedance Z_in = V_src / I_src
    z_in_val = None
    source_current_mag_mA = 0.0
    source_current_phase_deg = 0.0

    if num_vsrc > 0:
        i_src_c = -complex(X[num_nodes, 0]) # Current leaving positive terminal
        v_src_c = complex(Z[num_nodes, 0])
        source_current_mag_mA = round(float(abs(i_src_c) * 1000.0), 4)
        source_current_phase_deg = round(float(math.degrees(cmath.phase(i_src_c))), 2)

        if abs(i_src_c) > 1e-12:
            z_in_c = v_src_c / i_src_c
            z_in_val = {
                "magnitude_ohms": round(float(abs(z_in_c)), 3),
                "phase_deg": round(float(math.degrees(cmath.phase(z_in_c))), 2),
                "real_resistance_ohms": round(float(z_in_c.real), 3),
                "imag_reactance_ohms": round(float(z_in_c.imag), 3),
                "formatted": f"{abs(z_in_c):.2f} Ω ∠ {math.degrees(cmath.phase(z_in_c)):.1f}°"
            }

    # Extract Op-Amp Operating Results
    opamp_results = {}
    for op_idx, op in enumerate(opamps):
        col_idx = num_nodes + num_vsrc + op_idx
        i_out_c = complex(X[col_idx, 0])
        t = op["terminals"]
        out_node = t.get("output")
        in_pos = t.get("in_pos")
        in_neg = t.get("in_neg")

        v_out_c = complex_node_voltages.get(out_node, complex(0, 0))
        v_pos_c = complex_node_voltages.get(in_pos, complex(0, 0))
        v_neg_c = complex_node_voltages.get(in_neg, complex(0, 0))
        v_diff_c = v_pos_c - v_neg_c

        defn = op.get("ic_definition", {})
        specs = defn.get("electrical_specs", {})
        headroom = float(specs.get("output_headroom_v", 1.5))

        v_out_mag = abs(v_out_c)
        v_plus_node = t.get("v_plus")
        v_minus_node = t.get("v_minus")

        # Supply voltage limit checks
        max_swing = 15.0 - headroom  # default ±15V assumption if not explicitly connected
        if v_plus_node and v_plus_node in complex_node_voltages:
            v_p = abs(complex_node_voltages[v_plus_node])
            if v_p > 0.1:
                max_swing = max(v_p - headroom, 0.5)

        op_state = "LINEAR"
        if v_out_mag > max_swing + 1e-4:
            op_state = "SATURATED"

        opamp_results[op["id"]] = {
            "id": op["id"],
            "model": defn.get("ic_id", "IDEAL_OPAMP"),
            "display_name": defn.get("display_name", "Operational Amplifier"),
            "operating_state": op_state,
            "terminals": t,
            "output_voltage_mag": round(float(v_out_mag), 4),
            "output_voltage_phase_deg": round(float(math.degrees(cmath.phase(v_out_c))), 2),
            "differential_input_v": round(float(abs(v_diff_c)), 6),
            "output_current_mA": round(float(abs(i_out_c) * 1000.0), 4),
            "is_saturated": (op_state == "SATURATED")
        }

    return {
        "success": True,
        "frequency_hz": frequency_hz,
        "omega_rad_s": round(omega, 2),
        "node_voltages": node_voltage_results,
        "components": component_results,
        "opamps": opamp_results,
        "input_impedance": z_in_val,
        "source_current": {
            "magnitude_mA": source_current_mag_mA,
            "phase_deg": source_current_phase_deg
        },
        "source": "mna_simulation",
        "is_measured": False
    }
