"""
SmartBreadboard 3D — Transient Modified Nodal Analysis (MNA) Engine
Solves dynamic time-domain electrical circuits using numerical integration
(Backward Euler and Trapezoidal methods) with dynamic companion models.

Scientific Integrity:
- source: "transient_mna_simulation"
- is_measured: False
- PHYSICAL_VALIDATION_STATUS: "NOT_PERFORMED"
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


class TransientSource:
    """Evaluates time-dependent voltage / current source values."""
    def __init__(self, source_dict: Dict[str, Any]):
        self.type = str(source_dict.get("type", "step")).lower()
        self.name = source_dict.get("id", source_dict.get("name", "V1"))
        self.positive_node = source_dict.get("positive_node") or source_dict.get("node_pos") or source_dict.get("positiveNode") or source_dict.get("node1")
        self.negative_node = source_dict.get("negative_node") or source_dict.get("node_neg") or source_dict.get("negativeNode") or source_dict.get("node2")
        
        # Step source parameters
        self.initial_value = float(source_dict.get("initial_value", source_dict.get("initialValue", 0.0)))
        self.final_value = float(source_dict.get("final_value", source_dict.get("finalValue", source_dict.get("voltage", source_dict.get("value", 5.0)))))
        self.step_time = float(source_dict.get("step_time", source_dict.get("stepTime", 0.0)))
        
        # Pulse source parameters
        self.v_low = float(source_dict.get("v_low", source_dict.get("low", 0.0)))
        self.v_high = float(source_dict.get("v_high", source_dict.get("high", source_dict.get("voltage", 5.0))))
        self.delay = float(source_dict.get("delay", 0.0))
        self.rise_time = float(source_dict.get("rise_time", source_dict.get("riseTime", 1e-6)))
        self.fall_time = float(source_dict.get("fall_time", source_dict.get("fallTime", 1e-6)))
        self.width = float(source_dict.get("width", 0.005))
        self.period = float(source_dict.get("period", 0.01))
        
        # Sinusoidal parameters
        self.offset = float(source_dict.get("offset", 0.0))
        self.amplitude = float(source_dict.get("amplitude", source_dict.get("voltage", 5.0)))
        self.frequency = float(source_dict.get("frequency", source_dict.get("freq", 1000.0)))
        self.phase_deg = float(source_dict.get("phase_deg", source_dict.get("phase", 0.0)))

    def evaluate(self, t: float) -> float:
        if self.type in ["step", "voltage_step", "dc_step"]:
            return self.final_value if t >= self.step_time else self.initial_value
        elif self.type in ["pulse", "voltage_pulse", "square"]:
            if self.period <= 0:
                return self.v_low
            t_rel = (t - self.delay) % self.period if t >= self.delay else -(self.delay - t)
            if t_rel < 0:
                return self.v_low
            elif t_rel < self.rise_time:
                return self.v_low + (self.v_high - self.v_low) * (t_rel / max(self.rise_time, 1e-12))
            elif t_rel < self.rise_time + self.width:
                return self.v_high
            elif t_rel < self.rise_time + self.width + self.fall_time:
                frac = (t_rel - (self.rise_time + self.width)) / max(self.fall_time, 1e-12)
                return self.v_high - (self.v_high - self.v_low) * frac
            else:
                return self.v_low
        elif self.type in ["sine", "ac", "sinusoidal"]:
            rad = 2.0 * np.pi * self.frequency * t + np.radians(self.phase_deg)
            return self.offset + self.amplitude * np.sin(rad)
        elif self.type in ["dc", "voltage_source", "vsource"]:
            return self.final_value
        else:
            return self.final_value if t >= self.step_time else self.initial_value


def solve_transient_mna(
    netlist: Dict[str, Any],
    t_start: float = 0.0,
    t_stop: float = 0.01,
    dt: float = 0.0001,
    method: str = "backward_euler",
    source_config: Optional[Dict[str, Any]] = None,
    initial_conditions: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Executes full multi-timestep Transient MNA with dynamic companion models.
    Supports Backward Euler ('backward_euler') and Trapezoidal ('trapezoidal') integration.
    """
    # 1. Parameter Validation & Convergence Safeguards
    if dt <= 0:
        return {
            "status": "ERROR",
            "error_code": "INVALID_TIMESTEP",
            "message": f"Time step dt must be strictly positive (got {dt}).",
            "source": "transient_mna_simulation",
            "is_measured": False
        }
    if t_stop <= t_start:
        return {
            "status": "ERROR",
            "error_code": "INVALID_TIME_INTERVAL",
            "message": f"t_stop ({t_stop}) must be greater than t_start ({t_start}).",
            "source": "transient_mna_simulation",
            "is_measured": False
        }
    
    num_steps = int(round((t_stop - t_start) / dt))
    MAX_POINTS = 50000
    if num_steps + 1 > MAX_POINTS:
        return {
            "status": "ERROR",
            "error_code": "EXCESSIVE_SIMULATION_POINTS",
            "message": f"Requested simulation contains {num_steps+1} points, exceeding maximum limit ({MAX_POINTS}). Please increase dt or reduce interval.",
            "source": "transient_mna_simulation",
            "is_measured": False
        }
    if num_steps < 1:
        return {
            "status": "ERROR",
            "error_code": "INSUFFICIENT_POINTS",
            "message": "Time interval and dt result in fewer than 2 simulation points.",
            "source": "transient_mna_simulation",
            "is_measured": False
        }

    # 2. Parse Netlist
    components, sources, nodes_dict = parse_circuit_netlist(netlist)
    sources_to_validate = list(sources)
    if not sources_to_validate and source_config:
        sources_to_validate = [source_config]

    is_valid, err_dict, warnings = validate_circuit_netlist(netlist.get("components", []), sources_to_validate)
    if not is_valid:
        return {
            "status": "ERROR",
            "error_code": "INVALID_NETLIST",
            "message": err_dict.get("message", "Circuit netlist validation failed"),
            "details": err_dict,
            "source": "transient_mna_simulation",
            "is_measured": False
        }

    # Identify ground node
    ground_node_id = None
    if sources_to_validate:
        ground_node_id = sources_to_validate[0].get("negative_node") or sources_to_validate[0].get("node_neg")
    if not ground_node_id or ground_node_id not in nodes_dict:
        for nid, node in nodes_dict.items():
            if getattr(node, "is_ground", False) or "GND" in str(nid).upper() or "GROUND" in str(nid).upper():
                ground_node_id = nid
                break
    if not ground_node_id and nodes_dict:
        ground_node_id = list(nodes_dict.keys())[-1]

    # Collect active non-ground nodes
    active_nodes = set()
    for comp in components:
        active_nodes.add(comp.node1)
        active_nodes.add(comp.node2)
    for s in sources_to_validate:
        pn = s.get("positive_node") or s.get("node_pos")
        nn = s.get("negative_node") or s.get("node_neg")
        if pn: active_nodes.add(pn)
        if nn: active_nodes.add(nn)

    node_list = [nid for nid in sorted(list(active_nodes)) if nid != ground_node_id]
    node_to_idx = {nid: idx for idx, nid in enumerate(node_list)}
    num_nodes = len(node_list)

    if num_nodes == 0:
        return {
            "status": "ERROR",
            "error_code": "NO_ACTIVE_NODES",
            "message": "Circuit contains no active non-ground nodes to solve.",
            "source": "transient_mna_simulation",
            "is_measured": False
        }

    # Configure Transient Voltage Sources
    transient_v_sources: List[TransientSource] = []
    if source_config:
        src_dict = dict(source_config)
        if "positive_node" not in src_dict and sources:
            src_dict["positive_node"] = sources[0].get("positive_node") or sources[0].get("node_pos")
        if "negative_node" not in src_dict and sources:
            src_dict["negative_node"] = sources[0].get("negative_node") or sources[0].get("node_neg")
        transient_v_sources.append(TransientSource(src_dict))
    elif sources:
        for s in sources:
            transient_v_sources.append(TransientSource(s))
    elif not initial_conditions:
        # Default step source only if no initial conditions
        default_pos = node_list[0] if node_list else "node_1"
        transient_v_sources.append(TransientSource({
            "id": "V1",
            "type": "step",
            "positive_node": default_pos,
            "negative_node": ground_node_id,
            "initial_value": 0.0,
            "final_value": 5.0,
            "step_time": 0.0
        }))


    num_vsrc = len(transient_v_sources)
    matrix_size = num_nodes + num_vsrc

    # Separate components by category
    resistors = []
    capacitors = []
    inductors = []

    for comp in components:
        ctype = comp.type.lower()
        if ctype in ["resistor", "res", "wire", "jumper"]:
            resistors.append(comp)
        elif ctype in ["capacitor", "cap"]:
            capacitors.append(comp)
        elif ctype in ["inductor", "ind"]:
            inductors.append(comp)
        else:
            resistors.append(comp)

    integration_method = method.lower()
    if integration_method not in ["backward_euler", "trapezoidal"]:
        integration_method = "backward_euler"

    init_conds = initial_conditions or {}
    
    cap_vc: Dict[str, float] = {}
    cap_ic: Dict[str, float] = {}
    for c in capacitors:
        v0 = float(init_conds.get(c.id, init_conds.get(f"V_{c.id}", init_conds.get("Vc", 0.0))))
        cap_vc[c.id] = v0
        cap_ic[c.id] = 0.0

    ind_vl: Dict[str, float] = {}
    ind_il: Dict[str, float] = {}
    for l in inductors:
        i0 = float(init_conds.get(l.id, init_conds.get(f"I_{l.id}", init_conds.get("Il", 0.0))))
        ind_il[l.id] = i0
        ind_vl[l.id] = 0.0

    # Base Matrix G Assembly
    G_static = np.zeros((matrix_size, matrix_size), dtype=np.float64)

    for r in resistors:
        ctype = r.type.lower()
        if ctype in ["wire", "jumper"]:
            g = 1e3
        else:
            val = max(float(r.value), 1e-9)
            g = 1.0 / val
        
        i1 = node_to_idx.get(r.node1, -1)
        i2 = node_to_idx.get(r.node2, -1)
        if i1 >= 0: G_static[i1, i1] += g
        if i2 >= 0: G_static[i2, i2] += g
        if i1 >= 0 and i2 >= 0:
            G_static[i1, i2] -= g
            G_static[i2, i1] -= g

    cap_g: Dict[str, float] = {}
    for c in capacitors:
        c_val = max(float(c.value), 1e-15)
        if integration_method == "backward_euler":
            g_c = c_val / dt
        else:  # trapezoidal
            g_c = (2.0 * c_val) / dt
        cap_g[c.id] = g_c

        i1 = node_to_idx.get(c.node1, -1)
        i2 = node_to_idx.get(c.node2, -1)
        if i1 >= 0: G_static[i1, i1] += g_c
        if i2 >= 0: G_static[i2, i2] += g_c
        if i1 >= 0 and i2 >= 0:
            G_static[i1, i2] -= g_c
            G_static[i2, i1] -= g_c

    ind_g: Dict[str, float] = {}
    for l in inductors:
        l_val = max(float(l.value), 1e-15)
        if integration_method == "backward_euler":
            g_l = dt / l_val
        else:  # trapezoidal
            g_l = dt / (2.0 * l_val)
        ind_g[l.id] = g_l

        i1 = node_to_idx.get(l.node1, -1)
        i2 = node_to_idx.get(l.node2, -1)
        if i1 >= 0: G_static[i1, i1] += g_l
        if i2 >= 0: G_static[i2, i2] += g_l
        if i1 >= 0 and i2 >= 0:
            G_static[i1, i2] -= g_l
            G_static[i2, i1] -= g_l

    for v_idx, vsrc in enumerate(transient_v_sources):
        row = num_nodes + v_idx
        pn_idx = node_to_idx.get(vsrc.positive_node, -1)
        nn_idx = node_to_idx.get(vsrc.negative_node, -1)
        if pn_idx >= 0:
            G_static[row, pn_idx] = 1.0
            G_static[pn_idx, row] = 1.0
        if nn_idx >= 0:
            G_static[row, nn_idx] = -1.0
            G_static[nn_idx, row] = -1.0

    # Numerical Singularity Check
    try:
        cond_num = np.linalg.cond(G_static)
        if np.isinf(cond_num) or np.isnan(cond_num) or cond_num > 1e16:
            for i in range(num_nodes):
                G_static[i, i] += 1e-9
            cond_num = np.linalg.cond(G_static)
            if np.isinf(cond_num) or np.isnan(cond_num) or cond_num > 1e16:
                return {
                    "status": "ERROR",
                    "error_code": "TRANSIENT_SOLVER_SINGULAR_MATRIX",
                    "message": "Transient MNA system matrix is singular or ill-conditioned. Floating nodes or disconnected paths detected.",
                    "source": "transient_mna_simulation",
                    "is_measured": False
                }
    except Exception as e:
        return {
            "status": "ERROR",
            "error_code": "TRANSIENT_SOLVER_MATRIX_ERROR",
            "message": f"Matrix condition check failed: {str(e)}",
            "source": "transient_mna_simulation",
            "is_measured": False
        }

    # Simulation Point Storage
    time_points: List[float] = [round(t_start, 9)]
    node_voltage_trajectories: Dict[str, List[float]] = {nid: [] for nid in node_list}
    node_voltage_trajectories[ground_node_id] = [0.0]
    
    cap_voltage_trajectories: Dict[str, List[float]] = {c.id: [cap_vc[c.id]] for c in capacitors}
    cap_current_trajectories: Dict[str, List[float]] = {c.id: [cap_ic[c.id]] for c in capacitors}
    ind_current_trajectories: Dict[str, List[float]] = {l.id: [ind_il[l.id]] for l in inductors}
    ind_voltage_trajectories: Dict[str, List[float]] = {l.id: [ind_vl[l.id]] for l in inductors}
    res_voltage_trajectories: Dict[str, List[float]] = {r.id: [] for r in resistors}
    res_current_trajectories: Dict[str, List[float]] = {r.id: [] for r in resistors}
    vsrc_current_trajectories: Dict[str, List[float]] = {vsrc.name: [] for vsrc in transient_v_sources}

    # Initial state (t = t_start) node voltages estimation
    # For initial point (t=0), compute initial resistive distribution
    init_v_dict = {ground_node_id: 0.0}
    for c in capacitors:
        if c.node1 != ground_node_id and c.node2 == ground_node_id:
            init_v_dict[c.node1] = cap_vc[c.id]
        elif c.node2 != ground_node_id and c.node1 == ground_node_id:
            init_v_dict[c.node2] = -cap_vc[c.id]
    for vsrc in transient_v_sources:
        v_at_0 = vsrc.evaluate(t_start)
        if vsrc.positive_node != ground_node_id and vsrc.negative_node == ground_node_id:
            init_v_dict[vsrc.positive_node] = v_at_0
    
    for nid in node_list:
        node_voltage_trajectories[nid].append(init_v_dict.get(nid, 0.0))

    for r in resistors:
        v1 = init_v_dict.get(r.node1, 0.0)
        v2 = init_v_dict.get(r.node2, 0.0)
        v_drop = v1 - v2
        r_val = max(float(r.value), 1e-6) if r.type.lower() not in ["wire", "jumper"] else 1e-3
        res_voltage_trajectories[r.id].append(v_drop)
        res_current_trajectories[r.id].append(v_drop / r_val)

    for vsrc in transient_v_sources:
        vsrc_current_trajectories[vsrc.name].append(0.0)

    # 4. Timestep Simulation Loop (from k = 1 to num_steps)
    for step_k in range(1, num_steps + 1):
        t = t_start + step_k * dt
        time_points.append(round(t, 9))

        Z = np.zeros((matrix_size, 1), dtype=np.float64)

        for c in capacitors:
            prev_vc = cap_vc[c.id]
            prev_ic = cap_ic[c.id]
            g_c = cap_g[c.id]

            if integration_method == "backward_euler":
                i_eq = g_c * prev_vc
            else:  # trapezoidal
                i_eq = g_c * prev_vc + prev_ic

            i1 = node_to_idx.get(c.node1, -1)
            i2 = node_to_idx.get(c.node2, -1)
            if i1 >= 0: Z[i1, 0] += i_eq
            if i2 >= 0: Z[i2, 0] -= i_eq

        for l in inductors:
            prev_il = ind_il[l.id]
            prev_vl = ind_vl[l.id]
            g_l = ind_g[l.id]

            if integration_method == "backward_euler":
                i_eq = prev_il
            else:  # trapezoidal
                i_eq = prev_il + g_l * prev_vl

            i1 = node_to_idx.get(l.node1, -1)
            i2 = node_to_idx.get(l.node2, -1)
            if i1 >= 0: Z[i1, 0] -= i_eq
            if i2 >= 0: Z[i2, 0] += i_eq

        for v_idx, vsrc in enumerate(transient_v_sources):
            row = num_nodes + v_idx
            v_val = vsrc.evaluate(t)
            Z[row, 0] = v_val

        try:
            X = np.linalg.solve(G_static, Z)
        except np.linalg.LinAlgError:
            return {
                "status": "ERROR",
                "error_code": "TRANSIENT_SOLVER_DIVERGENCE",
                "message": f"Transient solver failed to invert system matrix at timestep t={t}s.",
                "source": "transient_mna_simulation",
                "is_measured": False
            }

        if np.any(np.isnan(X)) or np.any(np.isinf(X)):
            return {
                "status": "ERROR",
                "error_code": "NUMERICAL_INSTABILITY",
                "message": f"Transient solver encountered NaN or Infinity at timestep t={t}s.",
                "source": "transient_mna_simulation",
                "is_measured": False
            }

        current_node_voltages: Dict[str, float] = {ground_node_id: 0.0}
        for nid, idx in node_to_idx.items():
            current_node_voltages[nid] = float(X[idx, 0])

        for nid in node_list:
            node_voltage_trajectories[nid].append(current_node_voltages[nid])
        node_voltage_trajectories[ground_node_id].append(0.0)

        for c in capacitors:
            v1 = current_node_voltages.get(c.node1, 0.0)
            v2 = current_node_voltages.get(c.node2, 0.0)
            v_cap_now = v1 - v2
            g_c = cap_g[c.id]
            prev_vc = cap_vc[c.id]
            prev_ic = cap_ic[c.id]

            if integration_method == "backward_euler":
                i_cap_now = g_c * (v_cap_now - prev_vc)
            else:  # trapezoidal
                i_cap_now = g_c * (v_cap_now - prev_vc) - prev_ic

            cap_vc[c.id] = v_cap_now
            cap_ic[c.id] = i_cap_now
            cap_voltage_trajectories[c.id].append(v_cap_now)
            cap_current_trajectories[c.id].append(i_cap_now)

        for l in inductors:
            v1 = current_node_voltages.get(l.node1, 0.0)
            v2 = current_node_voltages.get(l.node2, 0.0)
            v_ind_now = v1 - v2
            g_l = ind_g[l.id]
            prev_il = ind_il[l.id]
            prev_vl = ind_vl[l.id]

            if integration_method == "backward_euler":
                i_ind_now = prev_il + g_l * v_ind_now
            else:  # trapezoidal
                i_ind_now = prev_il + g_l * (v_ind_now + prev_vl)

            ind_vl[l.id] = v_ind_now
            ind_il[l.id] = i_ind_now
            ind_voltage_trajectories[l.id].append(v_ind_now)
            ind_current_trajectories[l.id].append(i_ind_now)

        for r in resistors:
            v1 = current_node_voltages.get(r.node1, 0.0)
            v2 = current_node_voltages.get(r.node2, 0.0)
            v_res_now = v1 - v2
            r_val = max(float(r.value), 1e-6) if r.type.lower() not in ["wire", "jumper"] else 1e-3
            i_res_now = v_res_now / r_val
            res_voltage_trajectories[r.id].append(v_res_now)
            res_current_trajectories[r.id].append(i_res_now)

        for v_idx, vsrc in enumerate(transient_v_sources):
            i_src = float(X[num_nodes + v_idx, 0])
            vsrc_current_trajectories[vsrc.name].append(i_src)

    # 5. Format Structured Multi-Signal Response
    signals: List[Dict[str, Any]] = []
    
    for nid in sorted(node_voltage_trajectories.keys()):
        signals.append({
            "name": f"V({nid})",
            "component_id": nid,
            "type": "voltage",
            "unit": "V",
            "values": [round(val, 6) for val in node_voltage_trajectories[nid]]
        })

    for c in capacitors:
        signals.append({
            "name": f"V({c.id})",
            "component_id": c.id,
            "type": "voltage",
            "unit": "V",
            "values": [round(val, 6) for val in cap_voltage_trajectories[c.id]]
        })
        signals.append({
            "name": f"I({c.id})",
            "component_id": c.id,
            "type": "current",
            "unit": "A",
            "values": [round(val, 8) for val in cap_current_trajectories[c.id]]
        })

    for l in inductors:
        signals.append({
            "name": f"I({l.id})",
            "component_id": l.id,
            "type": "current",
            "unit": "A",
            "values": [round(val, 8) for val in ind_current_trajectories[l.id]]
        })
        signals.append({
            "name": f"V({l.id})",
            "component_id": l.id,
            "type": "voltage",
            "unit": "V",
            "values": [round(val, 6) for val in ind_voltage_trajectories[l.id]]
        })

    for r in resistors:
        signals.append({
            "name": f"V({r.id})",
            "component_id": r.id,
            "type": "voltage",
            "unit": "V",
            "values": [round(val, 6) for val in res_voltage_trajectories[r.id]]
        })
        signals.append({
            "name": f"I({r.id})",
            "component_id": r.id,
            "type": "current",
            "unit": "A",
            "values": [round(val, 8) for val in res_current_trajectories[r.id]]
        })

    return {
        "status": "VERIFIED",
        "time": time_points,
        "signals": signals,
        "node_voltages": {k: [round(v, 6) for v in vals] for k, vals in node_voltage_trajectories.items()},
        "solver": {
            "method": integration_method,
            "t_start": t_start,
            "t_stop": t_stop,
            "dt": dt,
            "num_points": len(time_points),
            "convergence": "CONVERGED"
        },
        "source": "transient_mna_simulation",
        "is_measured": False,
        "physical_validation_status": "NOT_PERFORMED"
    }
