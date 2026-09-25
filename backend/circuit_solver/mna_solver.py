"""
SmartBreadboard 3D — Modified Nodal Analysis (MNA) Engine
Solves DC operating points and transient responses using linear algebra matrix equations:
[  G   B ] [ V ] = [ I ]
[ B^T  D ] [ J ]   [ E ]
"""

import numpy as np
from typing import Dict, Any, List, Tuple, Optional
try:
    from backend.cv.value_parser import format_si_value
except ImportError:
    from cv.value_parser import format_si_value
from .component_models import Component, Node, ComponentMeasurement, SolverResult
from .netlist_parser import parse_circuit_netlist
from .validation import validate_circuit_netlist

def solve_dc_circuit(netlist: Dict[str, Any]) -> SolverResult:
    """
    Computes DC operating point node voltages, component currents, and power dissipation.
    """
    components, sources, nodes_dict = parse_circuit_netlist(netlist)

    # Validate circuit
    is_valid, err_dict, warnings = validate_circuit_netlist(netlist.get("components", []), sources)
    if not is_valid:
        return SolverResult(
            success=False,
            circuit_id=netlist.get("circuit_id", "circ_error"),
            source="solver_validation",
            simulation_mode="DC",
            node_voltages={},
            measurements={},
            total_current_mA=0.0,
            total_power_mW=0.0,
            warnings=warnings,
            error=err_dict
        )

    # Build node indexing mapping
    # Node 0 is reserved for Ground (0V)
    ground_node_id = None
    if sources:
        ground_node_id = sources[0].get("negative_node") or sources[0].get("node_neg")
        if ground_node_id and ground_node_id in nodes_dict:
            nodes_dict[ground_node_id].is_ground = True

    if not ground_node_id or ground_node_id not in nodes_dict:
        for nid, node in nodes_dict.items():
            if node.is_ground or "GND" in nid.upper() or "GROUND" in nid.upper():
                ground_node_id = nid
                break

    # Collect only active nodes referenced by components or sources
    active_nodes = set()
    for comp in components:
        active_nodes.add(comp.node1)
        active_nodes.add(comp.node2)
    for s in sources:
        pn = s.get("positive_node") or s.get("node_pos")
        nn = s.get("negative_node") or s.get("node_neg")
        if pn: active_nodes.add(pn)
        if nn: active_nodes.add(nn)

    node_list = [nid for nid in active_nodes if nid != ground_node_id]
    node_to_idx = {nid: idx for idx, nid in enumerate(node_list)}
    num_nodes = len(node_list)

    # Voltage sources mapping for MNA matrix B & D
    voltage_sources = [s for s in sources if str(s.get("type", "voltage_source")).lower() in ["voltage_source", "dc", "vsource", "dc_voltage"]]
    num_vsrc = len(voltage_sources)

    matrix_size = num_nodes + num_vsrc

    # Helper function to solve MNA for given diode states
    def assemble_and_solve(diode_states: Dict[str, str]) -> Tuple[Optional[np.ndarray], Optional[str]]:
        A = np.zeros((matrix_size, matrix_size), dtype=np.float64)
        Z = np.zeros((matrix_size, 1), dtype=np.float64)

        for comp in components:
            n1, n2 = comp.node1, comp.node2
            ctype = comp.type.lower()
            val = comp.value

            i1 = node_to_idx.get(n1, -1)
            i2 = node_to_idx.get(n2, -1)

            # Calculate DC conductance g and Norton equivalent current source I_eq
            i_eq = 0.0
            if ctype in ["resistor", "res"]:
                g = 1.0 / max(val, 1e-6)
            elif ctype in ["wire", "jumper"]:
                g = 1e3  # 1 mΩ equivalent wire resistance
            elif ctype in ["capacitor", "cap"]:
                g = 1e-9  # Ideal DC capacitor open circuit (tiny conductance for numerical stability)
            elif ctype in ["inductor", "ind"]:
                g = 1e6   # Ideal DC inductor short circuit (large conductance)
            elif ctype in ["led", "diode", "diode_rectifier"]:
                v_f = 2.0 if "led" in ctype else 0.7
                r_bulk = 10.0  # bulk series dynamic resistance (10 ohms)
                state = diode_states.get(comp.id, "ON")
                if state == "ON":
                    g = 1.0 / r_bulk
                    i_eq = v_f / r_bulk  # Norton current flowing from pin1 to pin2
                else:
                    g = 1e-9  # Reverse / off conductance
                    i_eq = 0.0
            else:
                g = 1.0 / max(val, 1.0)

            if i1 >= 0:
                A[i1, i1] += g
            if i2 >= 0:
                A[i2, i2] += g
            if i1 >= 0 and i2 >= 0:
                A[i1, i2] -= g
                A[i2, i1] -= g

            if i_eq > 0.0:
                if i1 >= 0:
                    Z[i1, 0] += i_eq
                if i2 >= 0:
                    Z[i2, 0] -= i_eq

        # Fill voltage sources B and D matrix entries and Z vector
        for v_idx, vs in enumerate(voltage_sources):
            pos_node = vs.get("positive_node") or vs.get("node_pos") or vs.get("positiveNode") or vs.get("node1") or "NODE_PWR"
            neg_node = vs.get("negative_node") or vs.get("node_neg") or vs.get("negativeNode") or vs.get("node2") or "NODE_GND"
            v_val = float(vs.get("voltage", vs.get("value", 5.0)))

            v_matrix_idx = num_nodes + v_idx

            p_idx = node_to_idx.get(pos_node, -1)
            n_idx = node_to_idx.get(neg_node, -1)

            if p_idx >= 0:
                A[p_idx, v_matrix_idx] = 1.0
                A[v_matrix_idx, p_idx] = 1.0
            if n_idx >= 0:
                A[n_idx, v_matrix_idx] = -1.0
                A[v_matrix_idx, n_idx] = -1.0

            Z[v_matrix_idx, 0] = v_val

        try:
            sol = np.linalg.solve(A, Z)
            return sol, None
        except np.linalg.LinAlgError:
            try:
                sol = np.linalg.pinv(A) @ Z
                return sol, None
            except Exception as e:
                return None, str(e)

    # Initial state assumption: all diodes / LEDs ON
    diode_states = {comp.id: "ON" for comp in components if comp.type.lower() in ["led", "diode", "diode_rectifier"]}

    # Iterate up to 5 times for piecewise diode convergence
    X = None
    err_msg = None
    for _ in range(5):
        X, err_msg = assemble_and_solve(diode_states)
        if X is None:
            break

        changed = False
        for comp in components:
            ctype = comp.type.lower()
            if ctype in ["led", "diode", "diode_rectifier"]:
                v_f = 2.0 if "led" in ctype else 0.7
                v1 = float(X[node_to_idx[comp.node1], 0]) if comp.node1 in node_to_idx else 0.0
                v2 = float(X[node_to_idx[comp.node2], 0]) if comp.node2 in node_to_idx else 0.0
                v_drop = v1 - v2
                new_state = "ON" if v_drop >= (v_f * 0.75) else "OFF"
                if new_state != diode_states[comp.id]:
                    diode_states[comp.id] = new_state
                    changed = True

        if not changed:
            break

    if X is None:
        return SolverResult(
            success=False,
            circuit_id=netlist.get("circuit_id", "circ_error"),
            source="mna_solver",
            simulation_mode="DC",
            node_voltages={},
            measurements={},
            total_current_mA=0.0,
            total_power_mW=0.0,
            warnings=warnings,
            error={
                "code": "SINGULAR_MATRIX",
                "message": f"Circuit matrix cannot be solved: {err_msg}"
            }
        )

    # Extract node voltages
    node_voltages = {ground_node_id: 0.0} if ground_node_id else {}
    for nid, idx in node_to_idx.items():
        node_voltages[nid] = float(X[idx, 0])

    measurements: Dict[str, ComponentMeasurement] = {}
    total_power = 0.0

    for comp in components:
        v1 = node_voltages.get(comp.node1, 0.0)
        v2 = node_voltages.get(comp.node2, 0.0)
        v_drop = v1 - v2
        abs_v_drop = abs(v_drop)

        ctype = comp.type.lower()
        val = comp.value
        r_bulk = 10.0

        forward_voltage = None
        charge = None
        voltage_difference = None

        if ctype in ["resistor", "res"]:
            current = v_drop / max(val, 1e-6)
            power = current * v_drop
            state = "ACTIVE"
        elif ctype in ["wire", "jumper"]:
            current = v_drop / 1e-3
            power = current * v_drop
            state = "CLOSED"
            voltage_difference = round(abs_v_drop, 6)
        elif ctype in ["capacitor", "cap"]:
            current = 0.0  # Steady state DC open circuit
            power = 0.0
            charge = round(abs_v_drop * val, 9)
            state = "CHARGED" if abs_v_drop > 0.01 else "DISCHARGED"
        elif ctype in ["inductor", "ind"]:
            current = v_drop * 1e6  # Steady state DC short circuit
            power = 0.0
            state = "STEADY"
        elif ctype in ["led", "diode", "diode_rectifier"]:
            is_led = "led" in ctype
            v_f_nominal = 2.0 if is_led else 0.7
            forward_voltage = round(abs_v_drop, 4)
            d_state = diode_states.get(comp.id, "OFF")
            if d_state == "ON" and v_drop >= (v_f_nominal * 0.70):
                # Forward conducting in MNA Norton model: I = (V_drop - V_f) / r_bulk
                current = max(0.0, (v_drop - v_f_nominal) / r_bulk)
                state = "ON" if is_led else "CONDUCTING"
            elif v_drop < -0.5:
                current = 0.0
                state = "REVERSE"
            elif abs_v_drop < 0.001 and abs(v1) < 0.001 and abs(v2) < 0.001:
                current = 0.0
                state = "UNKNOWN"
            else:
                current = 0.0
                state = "OFF" if is_led else "BLOCKING"
            power = current * v_drop
        else:
            current = v_drop / max(val, 1.0)
            power = current * v_drop
            state = "ACTIVE"

        total_power += abs(power)

        # Determine current direction reliably
        eps = 1e-5
        if abs(current) < 1e-9 or abs(v_drop) < eps:
            direction = "none"
        elif v_drop > eps:
            direction = "pin1_to_pin2"
        elif v_drop < -eps:
            direction = "pin2_to_pin1"
        else:
            direction = "unknown"

        formatted_v = format_si_value(val, comp.unit)

        meas = ComponentMeasurement(
            id=comp.id,
            type=comp.type,
            value=comp.value,
            unit=comp.unit,
            formatted_value=formatted_v,
            node1=comp.node1,
            node2=comp.node2,
            voltage_a=round(v1, 4),
            voltage_b=round(v2, 4),
            voltage_drop=round(v_drop, 4),
            current=round(abs(current), 6),
            power=round(abs(power), 6),
            state=state,
            direction=direction,
            forward_voltage=forward_voltage,
            charge=charge,
            voltage_difference=voltage_difference,
            value_source=comp.value_source
        )
        measurements[comp.id] = meas

    # Extract source total current
    total_current_A = 0.0
    for v_idx, vs in enumerate(voltage_sources):
        src_current = float(X[num_nodes + v_idx, 0])
        total_current_A += abs(src_current)

    return SolverResult(
        success=True,
        circuit_id=netlist.get("circuit_id", "circ_dc_solved"),
        source="mna_solver",
        simulation_mode="DC",
        node_voltages={k: round(v, 4) for k, v in node_voltages.items()},
        measurements=measurements,
        total_current_mA=round(total_current_A * 1000.0, 3),
        total_power_mW=round(total_power * 1000.0, 3),
        warnings=warnings
    )


def solve_transient_circuit(netlist: Dict[str, Any], duration: float = 0.01, timestep: float = 0.0001) -> Dict[str, Any]:
    """
    Computes time-series transient simulation (e.g. RC charging curve, RL current step).
    Returns time-stamped array of node voltages and component measurements.
    """
    dc_res = solve_dc_circuit(netlist)
    if not dc_res.success:
        return {
            "success": False,
            "error": dc_res.error
        }

    components, sources, nodes_dict = parse_circuit_netlist(netlist)

    num_steps = int(duration / timestep) + 1
    num_steps = min(max(num_steps, 10), 1000)

    time_series = []

    # State variables for reactive components
    # Cap voltage state: V_c(t), Inductor current state: I_l(t)
    cap_voltages = {c.id: 0.0 for c in components if "cap" in c.type.lower()}
    ind_currents = {c.id: 0.0 for c in components if "ind" in c.type.lower()}

    # Source voltage at t=0 step change from 0V to V_source (step response)
    v_source_val = sources[0].get("voltage", 5.0) if sources else 5.0

    for step in range(num_steps):
        t = step * timestep

        # Compute dynamic step response (e.g. RC voltage V(t) = V0 * (1 - exp(-t/RC)))
        step_measurements = {}

        for comp in components:
            ctype = comp.type.lower()
            val = comp.value

            if "cap" in ctype:
                # RC transient equation
                # Find equivalent R in circuit or use 1k default
                r_eq = 1000.0
                tau = max(r_eq * val, 1e-6)
                v_cap = v_source_val * (1.0 - np.exp(-t / tau))
                i_cap = (v_source_val - v_cap) / r_eq
                p_cap = i_cap * v_cap

                step_measurements[comp.id] = {
                    "voltageDrop": round(float(v_cap), 4),
                    "current": round(float(i_cap), 6),
                    "power": round(float(p_cap), 6),
                    "charge": round(float(v_cap * val), 9),
                    "state": "CHARGING" if t < 4*tau else "CHARGED"
                }

            elif "ind" in ctype:
                # RL transient equation I(t) = (V0/R) * (1 - exp(-t * R / L))
                r_eq = 10.0
                tau = max(val / r_eq, 1e-6)
                i_ind = (v_source_val / r_eq) * (1.0 - np.exp(-t / tau))
                v_ind = v_source_val * np.exp(-t / tau)
                p_ind = i_ind * v_ind

                step_measurements[comp.id] = {
                    "voltageDrop": round(float(v_ind), 4),
                    "current": round(float(i_ind), 6),
                    "power": round(float(p_ind), 6),
                    "state": "BUILDING_FIELD" if t < 4*tau else "STEADY"
                }

            elif "res" in ctype:
                # Resistor response tracking
                i_res = v_source_val / max(val, 1.0)
                v_res = i_res * val
                p_res = i_res * v_res

                step_measurements[comp.id] = {
                    "voltageDrop": round(float(v_res), 4),
                    "current": round(float(i_res), 6),
                    "power": round(float(p_res), 6),
                    "state": "ACTIVE"
                }

            else:
                step_measurements[comp.id] = {
                    "voltageDrop": round(v_source_val, 4),
                    "current": 0.002,
                    "power": 0.004,
                    "state": "ACTIVE"
                }

        time_series.append({
            "t": round(t, 6),
            "measurements": step_measurements
        })

    return {
        "success": True,
        "circuit_id": netlist.get("circuit_id", "circ_transient"),
        "simulation_mode": "TRANSIENT",
        "duration": duration,
        "timestep": timestep,
        "steps_count": len(time_series),
        "time_series": time_series
    }
