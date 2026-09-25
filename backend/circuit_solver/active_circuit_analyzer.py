"""
SmartBreadboard 3D — Active Circuit Intelligence & Analysis Engine (Phase 28)
Analyzes operational-amplifier based active circuits:
- IC identity and pin mapping verification
- Strict active topology recognition:
  1. OPAMP_NON_INVERTING
  2. OPAMP_INVERTING
  3. OPAMP_VOLTAGE_FOLLOWER
- Architecture placeholders (unsupported until verified):
  4. ACTIVE_LOW_PASS
  5. ACTIVE_HIGH_PASS
  6. SALLEN_KEY
- Complex MNA active solution with closed-loop gain & phase derivation
- Operating-state validation (LINEAR, SATURATED, INVALID_OPERATING_STATE, SOLVER_INVALID)
- Theoretical benchmark comparison (Av = 1 + Rf/Rg, Av = -Rf/Rin, Av = 1)
- Scientific measurement integrity: source = "mna_simulation", is_measured = False.
"""

import math
import cmath
import numpy as np
from typing import Dict, Any, List, Optional, Tuple

from .ic_registry import IC_REGISTRY, get_ic_definition, resolve_opamp_terminals, validate_opamp_supplies
from .complex_mna import solve_ac_frequency_point, parse_numeric
from .frequency_sweep import run_frequency_sweep
from .netlist_parser import parse_circuit_netlist


# Supported Active Topologies
ACTIVE_CIRCUIT_TYPES = {
    "OPAMP_NON_INVERTING": "OPAMP_NON_INVERTING",
    "OPAMP_INVERTING": "OPAMP_INVERTING",
    "OPAMP_VOLTAGE_FOLLOWER": "OPAMP_VOLTAGE_FOLLOWER",
    # Architecture Placeholders
    "ACTIVE_LOW_PASS": "ACTIVE_LOW_PASS",
    "ACTIVE_HIGH_PASS": "ACTIVE_HIGH_PASS",
    "SALLEN_KEY": "SALLEN_KEY",
    "UNKNOWN": "UNKNOWN",
    "UNSUPPORTED": "UNSUPPORTED",
    "INVALID_OPERATING_STATE": "INVALID_OPERATING_STATE",
    "SATURATED": "SATURATED",
    "SOLVER_INVALID": "SOLVER_INVALID"
}


def inspect_active_topology(netlist: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyzes netlist graph to verify IC identity, pin mapping, and active op-amp topology.
    """
    components, sources, _ = parse_circuit_netlist(netlist)
    raw_opamps = []
    for item in netlist.get("ics", []) + netlist.get("opamps", []):
        raw_opamps.append(item)
    for rc in netlist.get("components", []):
        ctype = str(rc.get("type", rc.get("class", ""))).lower()
        part = str(rc.get("model", rc.get("part_number", rc.get("value", "")))).upper()
        if "opamp" in ctype or "op_amp" in ctype or "ic" in ctype or any(k in part for k in ["LM741", "LM358", "TL072", "NE5532", "OP07"]):
            if rc not in raw_opamps:
                raw_opamps.append(rc)

    if not raw_opamps:
        return {
            "status": "UNKNOWN",
            "is_active_circuit": False,
            "error": "No operational amplifier or IC detected in netlist.",
            "topology_type": "UNKNOWN"
        }

    # Verify First Op-Amp
    raw_op = raw_opamps[0]
    term_res = resolve_opamp_terminals(raw_op)

    if not term_res.get("success"):
        st = term_res.get("status")
        mapped_status = "UNKNOWN" if st == "UNKNOWN_IC" else "UNSUPPORTED"
        return {
            "status": mapped_status,
            "is_active_circuit": True,
            "error": term_res.get("error", "Invalid IC pin configuration."),
            "topology_type": "UNKNOWN",
            "missing_pins": term_res.get("missing_pins", [])
        }

    ic_def = term_res["ic_definition"]
    terminals = term_res["terminals"]
    in_pos = terminals["in_pos"]
    in_neg = terminals["in_neg"]
    out_node = terminals["output"]
    v_plus = terminals.get("v_plus")
    v_minus = terminals.get("v_minus")

    # Determine ground and input nodes
    active_nodes = set()
    for comp in components:
        if comp.node1: active_nodes.add(comp.node1)
        if comp.node2: active_nodes.add(comp.node2)

    ground_node = None
    if sources:
        ground_node = sources[0].get("negative_node") or sources[0].get("node_neg")
    if not ground_node:
        for an in active_nodes:
            if "GND" in str(an).upper() or "GROUND" in str(an).upper() or str(an) == "0":
                ground_node = an
                break
    if not ground_node and active_nodes:
        ground_node = sorted(list(active_nodes))[-1]

    input_node = None
    if sources:
        input_node = sources[0].get("positive_node") or sources[0].get("node_pos")
    if not input_node and active_nodes:
        non_gnd = [n for n in sorted(list(active_nodes)) if n != ground_node]
        if non_gnd: input_node = non_gnd[0]

    # Collect resistors and wires
    resistors = [c for c in components if "resistor" in str(c.type).lower() or "res" in str(c.type).lower()]
    wires = [c for c in components if "wire" in str(c.type).lower() or "jumper" in str(c.type).lower()]
    capacitors = [c for c in components if "capacitor" in str(c.type).lower() or "cap" in str(c.type).lower()]

    # Helper to check connection between two nodes
    def find_resistor_between(node_a: str, node_b: str) -> Optional[Any]:
        for r in resistors:
            rn = {r.node1, r.node2}
            if node_a in rn and node_b in rn:
                return r
        return None

    def has_wire_or_short(node_a: str, node_b: str) -> bool:
        if node_a == node_b:
            return True
        for w in wires:
            wn = {w.node1, w.node2}
            if node_a in wn and node_b in wn:
                return True
        return False

    # Check for Sallen-Key or Active Filters (Placeholders - mark UNSUPPORTED per Section 15)
    if len(capacitors) > 0:
        return {
            "status": "UNSUPPORTED",
            "is_active_circuit": True,
            "topology_type": "ACTIVE_FILTER_PLACEHOLDER",
            "ic_definition": ic_def,
            "terminals": terminals,
            "error": "Active RC filter / Sallen-Key detected, but active frequency-shaping model is architectural placeholder (unsupported in this release per SPEC)."
        }

    # Supply Rail Validation Helper
    def check_supplies() -> Tuple[bool, str, Optional[str]]:
        return validate_opamp_supplies(ic_def, terminals, netlist)

    # 1. Voltage Follower Topology Check:
    # Direct short/wire between Vout and In(-) AND Input connected to In(+)
    is_follower_feedback = has_wire_or_short(out_node, in_neg)
    is_follower_input = (in_pos == input_node) or (input_node is None and in_pos != ground_node)

    if is_follower_feedback and is_follower_input:
        is_supp_ok, supp_status, supp_err = check_supplies()
        if not is_supp_ok:
            return {
                "status": supp_status,
                "is_active_circuit": True,
                "topology_type": "OPAMP_VOLTAGE_FOLLOWER",
                "ic_definition": ic_def,
                "terminals": terminals,
                "error": supp_err
            }
        return {
            "status": "VERIFIED",
            "is_active_circuit": True,
            "topology_type": "OPAMP_VOLTAGE_FOLLOWER",
            "display_name": "Op-Amp Voltage Follower (Buffer)",
            "ic_definition": ic_def,
            "terminals": terminals,
            "ground_node": ground_node,
            "input_node": in_pos,
            "output_node": out_node,
            "feedback_network": {
                "type": "DIRECT_WIRE",
                "from": out_node,
                "to": in_neg
            },
            "theoretical_gain": 1.0,
            "theoretical_gain_db": 0.0,
            "theoretical_phase_deg": 0.0
        }

    # 2. Non-Inverting Amplifier Topology Check:
    # Rf between Vout and In(-), Rg between In(-) and Ground, Input connected to In(+)
    rf_noninv = find_resistor_between(out_node, in_neg)
    rg_noninv = find_resistor_between(in_neg, ground_node) if ground_node else None

    if rf_noninv and rg_noninv and (in_pos == input_node or input_node is None):
        is_supp_ok, supp_status, supp_err = check_supplies()
        if not is_supp_ok:
            return {
                "status": supp_status,
                "is_active_circuit": True,
                "topology_type": "OPAMP_NON_INVERTING",
                "ic_definition": ic_def,
                "terminals": terminals,
                "error": supp_err
            }
        rf_val = parse_numeric(rf_noninv.value, 10000.0)
        rg_val = parse_numeric(rg_noninv.value, 10000.0)
        theo_gain = 1.0 + (rf_val / max(rg_val, 1e-6))
        theo_gain_db = 20.0 * math.log10(max(theo_gain, 1e-6))

        return {
            "status": "VERIFIED",
            "is_active_circuit": True,
            "topology_type": "OPAMP_NON_INVERTING",
            "display_name": "Non-Inverting Operational Amplifier",
            "ic_definition": ic_def,
            "terminals": terminals,
            "ground_node": ground_node,
            "input_node": in_pos,
            "output_node": out_node,
            "feedback_network": {
                "rf": {"id": rf_noninv.id, "value": rf_val, "nodes": [rf_noninv.node1, rf_noninv.node2]},
                "rg": {"id": rg_noninv.id, "value": rg_val, "nodes": [rg_noninv.node1, rg_noninv.node2]}
            },
            "theoretical_gain": round(theo_gain, 4),
            "theoretical_gain_db": round(theo_gain_db, 2),
            "theoretical_phase_deg": 0.0
        }

    # 3. Inverting Amplifier Topology Check:
    # Rf between Vout and In(-), Rin between Input and In(-), In(+) connected to Ground
    rf_inv = find_resistor_between(out_node, in_neg)
    rin_inv = find_resistor_between(input_node, in_neg) if input_node else None
    is_pos_gnd = has_wire_or_short(in_pos, ground_node)

    if rf_inv and rin_inv and is_pos_gnd:
        is_supp_ok, supp_status, supp_err = check_supplies()
        if not is_supp_ok:
            return {
                "status": supp_status,
                "is_active_circuit": True,
                "topology_type": "OPAMP_INVERTING",
                "ic_definition": ic_def,
                "terminals": terminals,
                "error": supp_err
            }
        rf_val = parse_numeric(rf_inv.value, 10000.0)
        rin_val = parse_numeric(rin_inv.value, 10000.0)
        theo_gain = -(rf_val / max(rin_val, 1e-6))
        theo_gain_mag = abs(theo_gain)
        theo_gain_db = 20.0 * math.log10(max(theo_gain_mag, 1e-6))

        return {
            "status": "VERIFIED",
            "is_active_circuit": True,
            "topology_type": "OPAMP_INVERTING",
            "display_name": "Inverting Operational Amplifier",
            "ic_definition": ic_def,
            "terminals": terminals,
            "ground_node": ground_node,
            "input_node": input_node,
            "output_node": out_node,
            "feedback_network": {
                "rf": {"id": rf_inv.id, "value": rf_val, "nodes": [rf_inv.node1, rf_inv.node2]},
                "rin": {"id": rin_inv.id, "value": rin_val, "nodes": [rin_inv.node1, rin_inv.node2]}
            },
            "theoretical_gain": round(theo_gain, 4),
            "theoretical_gain_magnitude": round(theo_gain_mag, 4),
            "theoretical_gain_db": round(theo_gain_db, 2),
            "theoretical_phase_deg": 180.0
        }

    # If op-amp is present but topology does not match canonical verified configurations
    return {
        "status": "UNSUPPORTED",
        "is_active_circuit": True,
        "topology_type": "UNKNOWN_ACTIVE_TOPOLOGY",
        "ic_definition": ic_def,
        "terminals": terminals,
        "error": "Op-Amp connections do not match verified Non-Inverting, Inverting, or Follower feedback topology."
    }


def analyze_active_circuit(
    netlist: Dict[str, Any],
    f_start: float = 10.0,
    f_stop: float = 1.0e6,
    num_points: int = 100
) -> Dict[str, Any]:
    """
    Executes complete active circuit intelligence analysis:
    - Verifies IC model and pin mappings
    - Verifies topology (Non-Inverting, Inverting, Follower)
    - Solves Complex MNA frequency points and sweep
    - Derives gain, phase, input/output voltage from actual electrical solution
    - Validates operating state (LINEAR, SATURATED, INVALID_OPERATING_STATE)
    - Generates educational explanations and AR visualization descriptors
    """
    topo_res = inspect_active_topology(netlist)

    if topo_res.get("status") != "VERIFIED":
        # Return structured unverified/unsupported result
        return {
            "success": False,
            "status": topo_res.get("status", "UNKNOWN"),
            "circuit_type": topo_res.get("topology_type", "UNKNOWN"),
            "display_name": topo_res.get("display_name", "Unrecognized Active Circuit"),
            "error": topo_res.get("error", "Active circuit topology verification failed."),
            "ic_model": topo_res.get("ic_definition", {}).get("ic_id") if topo_res.get("ic_definition") else None,
            "pin_mapping": topo_res.get("terminals"),
            "operating_state": "INVALID_OPERATING_STATE" if topo_res.get("status") == "INVALID_OPERATING_STATE" else "UNKNOWN",
            "source": "mna_simulation",
            "is_measured": False,
            "evidence": {
                "topology_match": False,
                "reason": topo_res.get("error")
            }
        }

    in_node = topo_res["input_node"]
    out_node = topo_res["output_node"]
    gnd_node = topo_res["ground_node"]
    ttype = topo_res["topology_type"]
    ic_def = topo_res["ic_definition"]
    terminals = topo_res["terminals"]
    in_neg = terminals.get("in_neg")

    # 1. Run Baseline Frequency Point (1 kHz test point)
    test_freq_hz = 1000.0
    pt_sol = solve_ac_frequency_point(netlist, frequency_hz=test_freq_hz)

    if not pt_sol.get("success"):
        return {
            "success": False,
            "status": "SOLVER_INVALID",
            "circuit_type": ttype,
            "ic_model": ic_def.get("ic_id"),
            "pin_mapping": topo_res["terminals"],
            "operating_state": "SOLVER_INVALID",
            "error": pt_sol.get("error", "MNA solver failed to find a valid solution."),
            "source": "mna_simulation",
            "is_measured": False
        }

    node_v = pt_sol.get("node_voltages", {})
    opamps_sol = pt_sol.get("opamps", {})

    v_in_data = node_v.get(in_node, {"magnitude": 1.0, "phase_deg": 0.0, "real": 1.0, "imag": 0.0})
    v_out_data = node_v.get(out_node, {"magnitude": 0.0, "phase_deg": 0.0, "real": 0.0, "imag": 0.0})

    v_in_c = complex(v_in_data["real"], v_in_data["imag"])
    v_out_c = complex(v_out_data["real"], v_out_data["imag"])

    # Derived Electrical Gain & Phase
    if abs(v_in_c) > 1e-12:
        h_c = v_out_c / v_in_c
        gain_mag = abs(h_c)
        gain_db = 20.0 * math.log10(max(gain_mag, 1e-6))
        phase_deg = math.degrees(cmath.phase(h_c))
    else:
        gain_mag = 0.0
        gain_db = -100.0
        phase_deg = 0.0

    # Determine Operating State
    op_record = list(opamps_sol.values())[0] if opamps_sol else {}
    operating_state = op_record.get("operating_state", "LINEAR")
    final_status = "SATURATED" if operating_state == "SATURATED" else "VERIFIED"

    # Feedback voltage at inverting node
    v_feedback_data = node_v.get(in_neg, {"magnitude": 0.0, "phase_deg": 0.0, "real": 0.0, "imag": 0.0})

    # 2. Run Active Frequency Sweep
    f_start_clamped = max(1.0, float(f_start))
    f_stop_clamped = max(f_start_clamped * 1.5, float(f_stop))
    n_pts = min(max(10, int(num_points)), 200)
    frequencies = np.logspace(math.log10(f_start_clamped), math.log10(f_stop_clamped), n_pts)

    freq_response_points = []
    for f in frequencies:
        pt_res = solve_ac_frequency_point(netlist, float(f))
        if pt_res.get("success"):
            pt_nv = pt_res.get("node_voltages", {})
            pt_vout_d = pt_nv.get(out_node, {"magnitude": 0.0, "phase_deg": 0.0})
            pt_vin_d = pt_nv.get(in_node, {"magnitude": 1.0, "phase_deg": 0.0})
            pt_vout = float(pt_vout_d["magnitude"])
            pt_vin = float(pt_vin_d["magnitude"])
            pt_h_mag = pt_vout / max(pt_vin, 1e-12)
            pt_phase = float(pt_vout_d["phase_deg"]) - float(pt_vin_d["phase_deg"])
            # Wrap phase to [-180, 180]
            pt_phase = (pt_phase + 180.0) % 360.0 - 180.0

            freq_response_points.append({
                "frequency_hz": round(float(f), 2),
                "gain_magnitude": round(float(pt_h_mag), 4),
                "gain_db": round(float(20.0 * math.log10(max(pt_h_mag, 1e-6))), 2),
                "phase_deg": round(float(pt_phase), 2),
                "vin_mag": round(float(pt_vin), 4),
                "vout_mag": round(float(pt_vout), 4)
            })

    # Educational Explanation Content
    educational = generate_active_explanation(
        topology_type=ttype,
        gain_mag=gain_mag,
        phase_deg=phase_deg,
        operating_state=operating_state,
        feedback_info=topo_res.get("feedback_network", {})
    )

    # Visualization Descriptor (Section 18 & 19: suppress normal amplifier animations if saturated)
    vis_state = {
        "mode": ttype,
        "overlays": {
            "signalFlow": (operating_state == "LINEAR"),
            "feedbackPath": True,
            "inputOutputWaveform": True,
            "gain": True,
            "phase": True,
            "operatingState": True
        },
        "highlight_nodes": [in_node, out_node, gnd_node],
        "in_phase": (abs(phase_deg) < 45.0),
        "is_inverted": (abs(phase_deg - 180.0) < 45.0 or abs(phase_deg + 180.0) < 45.0),
        "operatingState": operating_state
    }

    return {
        "success": True,
        "status": final_status,
        "circuit_type": ttype,
        "circuitType": ttype,
        "display_name": topo_res.get("display_name"),
        "ic_model": ic_def.get("ic_id"),
        "icModel": ic_def.get("ic_id"),
        "pin_mapping": topo_res["terminals"],
        "pinMapping": topo_res["terminals"],
        "operating_state": operating_state,
        "operatingState": operating_state,
        "linear_result_valid": (operating_state == "LINEAR"),
        "solved_at_freq_hz": test_freq_hz,
        "gain": {
            "magnitude": round(float(gain_mag), 4),
            "db": round(float(gain_db), 2),
            "theoretical_magnitude": topo_res.get("theoretical_gain_magnitude", topo_res.get("theoretical_gain")),
            "theoretical_db": topo_res.get("theoretical_gain_db")
        },
        "phase": {
            "degrees": round(float(phase_deg), 2),
            "theoretical_degrees": topo_res.get("theoretical_phase_deg", 0.0)
        },
        "voltages": {
            "vin": v_in_data,
            "vout": v_out_data,
            "vfeedback": v_feedback_data,
            "differential_input_v": op_record.get("differential_input_v", 0.0)
        },
        "transfer_function": {
            "gainMagnitude": round(float(gain_mag), 4),
            "gainDb": round(float(gain_db), 2),
            "phaseDeg": round(float(phase_deg), 2),
            "h_real": round(float(h_c.real), 4) if abs(v_in_c) > 1e-12 else 0.0,
            "h_imag": round(float(h_c.imag), 4) if abs(v_in_c) > 1e-12 else 0.0,
            "formatted": f"{gain_mag:.3f} ∠ {phase_deg:.1f}°"
        },
        "feedback_network": topo_res.get("feedback_network"),
        "frequency_response": freq_response_points,
        "educational_explanation": educational,
        "visualization_state": vis_state,
        "limitations": ic_def.get("limitations"),
        "source": "mna_simulation",
        "is_measured": False,
        "isMeasured": False,
        "evidence": {
            "topology_verified": (final_status == "VERIFIED"),
            "ic_verified": True,
            "pin_mapping_verified": True,
            "linear_solver_solved": True,
            "operating_state": operating_state
        }
    }


def generate_active_explanation(
    topology_type: str,
    gain_mag: float,
    phase_deg: float,
    operating_state: str,
    feedback_info: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Generates structured educational explanations for active circuits.
    """
    if topology_type == "OPAMP_NON_INVERTING":
        return {
            "summary": f"Non-inverting amplifier provides positive voltage gain (Av = +{gain_mag:.2f}) with zero phase shift.",
            "phase_concept": "The input signal enters the non-inverting (+) terminal directly, so the output voltage rises and falls in phase with Vin (0° phase shift).",
            "feedback_role": "Negative feedback through Rf to the inverting (-) terminal forces the differential input voltage (V+ - V-) to approximately 0V, establishing precise closed-loop gain 1 + Rf/Rg.",
            "gain_formula": "Av = 1 + (Rf / Rg)",
            "operating_state_note": f"Operating state is {operating_state}." if operating_state == "LINEAR" else f"WARNING: Amplifier is {operating_state}!"
        }
    elif topology_type == "OPAMP_INVERTING":
        return {
            "summary": f"Inverting amplifier provides negative/inverted voltage gain (Av = -{gain_mag:.2f}) with 180° phase inversion.",
            "phase_concept": "The input signal enters the inverting (-) terminal via Rin, causing the output voltage to swing in the opposite direction (180° phase shift).",
            "feedback_role": "Negative feedback creates a virtual ground (V- ≈ 0V) at the inverting node. The input current through Rin must flow entirely through Rf.",
            "gain_formula": "Av = - (Rf / Rin)",
            "operating_state_note": f"Operating state is {operating_state}." if operating_state == "LINEAR" else f"WARNING: Amplifier is {operating_state}!"
        }
    elif topology_type == "OPAMP_VOLTAGE_FOLLOWER":
        return {
            "summary": f"Voltage follower (buffer) provides unity gain (Av ≈ {gain_mag:.2f}) and impedance transformation.",
            "phase_concept": "Output is in phase with input (0° phase shift) with unity gain.",
            "feedback_role": "100% negative feedback (direct output-to-inverting connection) ensures Vout tracks Vin precisely while drawing virtually zero input current (near-infinite Zin, near-zero Zout).",
            "gain_formula": "Av ≈ 1.0",
            "operating_state_note": f"Operating state is {operating_state}." if operating_state == "LINEAR" else f"WARNING: Amplifier is {operating_state}!"
        }
    return {
        "summary": "Active operational amplifier circuit.",
        "phase_concept": "Determined by active feedback network.",
        "feedback_role": "Negative feedback linearizes transfer function.",
        "gain_formula": "Custom active transfer function.",
        "operating_state_note": f"Operating state is {operating_state}."
    }
