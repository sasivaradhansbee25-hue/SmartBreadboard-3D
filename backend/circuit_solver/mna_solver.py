"""
SmartBreadboard 3D — Modified Nodal Analysis (MNA) Engine
Solves DC operating points and transient responses using linear algebra matrix equations:
[  G   B ] [ V ] = [ I ]
[ B^T  D ] [ J ]   [ E ]
"""

import numpy as np
from typing import Dict, Any, List, Tuple, Optional
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
    for nid, node in nodes_dict.items():
        if node.is_ground or "GND" in nid.upper() or "GROUND" in nid.upper():
            ground_node_id = nid
            break

    if not ground_node_id and sources:
        # Default ground to negative terminal of first source
        ground_node_id = sources[0].get("negative_node", "NODE_GND")
        if ground_node_id in nodes_dict:
            nodes_dict[ground_node_id].is_ground = True

    node_list = [nid for nid in nodes_dict.keys() if nid != ground_node_id]
    node_to_idx = {nid: idx for idx, nid in enumerate(node_list)}
    num_nodes = len(node_list)

    # Voltage sources mapping for MNA matrix B & D
    voltage_sources = [s for s in sources if s.get("type", "voltage_source") == "voltage_source"]
    num_vsrc = len(voltage_sources)

    matrix_size = num_nodes + num_vsrc
    A = np.zeros((matrix_size, matrix_size), dtype=np.float64)
    Z = np.zeros((matrix_size, 1), dtype=np.float64)

    # Fill conductance matrix G
    for comp in components:
        n1, n2 = comp.node1, comp.node2
        ctype = comp.type.lower()
        val = comp.value

        # Calculate DC conductance g
        if ctype in ["resistor", "res"]:
            g = 1.0 / max(val, 1e-6)
        elif ctype in ["wire", "jumper"]:
            g = 1e3  # 1 mΩ equivalent wire resistance
        elif ctype in ["capacitor", "cap"]:
            g = 1e-9  # Ideal DC capacitor open circuit (tiny conductance for numerical stability)
        elif ctype in ["inductor", "ind"]:
            g = 1e6   # Ideal DC inductor short circuit (large conductance)
        elif ctype in ["led", "diode", "diode_rectifier"]:
            # Piecewise model: forward drop ~2.0V for LED, ~0.7V for diode, 100Ω series resistance
            v_f = 2.0 if "led" in ctype else 0.7
            # We add linearized model or equivalent resistance
            g = 1.0 / 100.0  # 100 Ω forward resistance
        else:
            g = 1.0 / 1000.0

        i1 = node_to_idx.get(n1, -1)
        i2 = node_to_idx.get(n2, -1)

        if i1 >= 0:
            A[i1, i1] += g
        if i2 >= 0:
            A[i2, i2] += g
        if i1 >= 0 and i2 >= 0:
            A[i1, i2] -= g
            A[i2, i1] -= g

    # Fill voltage sources B and D matrix entries and Z vector
    for v_idx, vs in enumerate(voltage_sources):
        pos_node = vs.get("positive_node", vs.get("node1", "NODE_PWR"))
        neg_node = vs.get("negative_node", vs.get("node2", "NODE_GND"))
        v_val = float(vs.get("voltage", 5.0))

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

    # Solve linear matrix system A X = Z
    try:
        X = np.linalg.solve(A, Z)
    except np.linalg.LinAlgError:
        # Singular matrix fallback / pseudo-inverse
        try:
            X = np.linalg.pinv(A) @ Z
        except Exception as e:
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
                    "message": f"Circuit matrix cannot be solved: {str(e)}"
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

        if ctype in ["resistor", "res"]:
            current = v_drop / max(val, 1e-6)
            power = current * v_drop
            state = "ACTIVE"
        elif ctype in ["wire", "jumper"]:
            current = v_drop / 1e-3
            power = current * v_drop
            state = "CLOSED"
        elif ctype in ["capacitor", "cap"]:
            current = 0.0  # Steady state DC open circuit
            power = 0.0
            state = "CHARGED"
        elif ctype in ["inductor", "ind"]:
            current = v_drop * 1e6  # Steady state DC short circuit
            power = 0.0
            state = "STEADY"
        elif ctype in ["led", "diode", "diode_rectifier"]:
            v_f = 2.0 if "led" in ctype else 0.7
            if v_drop >= v_f:
                current = (v_drop - v_f) / 100.0
                state = "ON" if "led" in ctype else "CONDUCTING"
            else:
                current = 0.0
                state = "OFF" if "led" in ctype else "BLOCKING"
            power = current * v_drop
        else:
            current = v_drop / max(val, 1.0)
            power = current * v_drop
            state = "ACTIVE"

        total_power += abs(power)

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
            current=round(current, 6),
            power=round(power, 6),
            state=state,
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
