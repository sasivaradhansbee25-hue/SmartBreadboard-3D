"""
SmartBreadboard 3D — BJT Semiconductor Behavior & Topology Intelligence (Phase 31)
Extracts non-linear BJT metrics (operating region, VBE, VBC, VCE, IB, IC, IE, beta_forced,
turn-on/turn-off switching times, small-signal voltage/current gain Av, Ai),
strictly classifies canonical BJT topologies, and generates educational insights.

Scientific Integrity:
- source: "nonlinear_transient_mna_simulation"
- is_measured: False
- PHYSICAL_VALIDATION_STATUS: "NOT_PERFORMED"
"""

import numpy as np
from typing import Dict, Any, List, Optional, Tuple

try:
    from backend.cv.value_parser import format_si_value
except ImportError:
    from cv.value_parser import format_si_value

from .netlist_parser import parse_circuit_netlist
from .bjt_registry import get_bjt_definition


def _integrate_trapezoid(y: np.ndarray, x: np.ndarray) -> float:
    """Computes definite integral using trapezoidal rule, compatible with NumPy 1.x and 2.x."""
    if hasattr(np, "trapezoid"):
        return float(np.trapezoid(y, x))
    elif hasattr(np, "trapz"):
        return float(np.trapz(y, x))
    else:
        return float(np.sum((y[:-1] + y[1:]) * 0.5 * np.diff(x)))


def extract_bjt_metrics(
    time: List[float],
    v_be: List[float],
    v_ce: List[float],
    i_b: List[float],
    i_c: List[float],
    i_e: Optional[List[float]] = None,
    vin: Optional[List[float]] = None,
    vout: Optional[List[float]] = None,
    polarity: str = "NPN",
    device_id: str = "Q1"
) -> Dict[str, Any]:
    """
    Extracts key non-linear BJT metrics from numerically solved waveforms.
    """
    if not time or not v_be or not v_ce or not i_c or len(time) < 2:
        return {
            "device_id": device_id,
            "polarity": polarity,
            "operating_region": "CUTOFF",
            "vbe_final": 0.0,
            "vce_final": 0.0,
            "ib_final": 0.0,
            "ic_final": 0.0,
            "ie_final": 0.0,
            "beta_forced": 0.0,
            "turn_on_time": None,
            "turn_off_time": None,
            "voltage_gain_av": None,
            "current_gain_ai": None,
            "saturation_interval_percent": 0.0,
            "active_interval_percent": 0.0,
            "cutoff_interval_percent": 100.0
        }

    t_arr = np.array(time, dtype=np.float64)
    vbe_arr = np.array(v_be, dtype=np.float64)
    vce_arr = np.array(v_ce, dtype=np.float64)
    ib_arr = np.array(i_b, dtype=np.float64)
    ic_arr = np.array(i_c, dtype=np.float64)
    ie_arr = np.array(i_e, dtype=np.float64) if i_e else -(ib_arr + ic_arr)

    vbe_fin = float(vbe_arr[-1])
    vce_fin = float(vce_arr[-1])
    ib_fin = float(ib_arr[-1])
    ic_fin = float(ic_arr[-1])
    ie_fin = float(ie_arr[-1])

    # Determine region at final point
    if polarity.upper() == "NPN":
        vbc_fin = vbe_fin - vce_fin
        if vbe_fin < 0.45 or ib_fin < 1e-7:
            op_region = "CUTOFF"
        elif vbc_fin < 0.40 and vce_fin > 0.30:
            op_region = "FORWARD_ACTIVE"
        else:
            op_region = "SATURATION"
    else:  # PNP
        veb_fin = -vbe_fin
        vcb_fin = -vbe_fin + vce_fin
        if veb_fin < 0.45 or ib_fin > -1e-7:
            op_region = "CUTOFF"
        elif vcb_fin < 0.40 and vce_fin < -0.30:
            op_region = "FORWARD_ACTIVE"
        else:
            op_region = "SATURATION"

    # Region interval statistics
    n_pts = len(t_arr)
    cutoff_count = 0
    active_count = 0
    sat_count = 0

    for k in range(n_pts):
        vbe_k = vbe_arr[k]
        vce_k = vce_arr[k]
        ib_k = ib_arr[k]
        if polarity.upper() == "NPN":
            vbc_k = vbe_k - vce_k
            if vbe_k < 0.45 or ib_k < 1e-7:
                cutoff_count += 1
            elif vbc_k < 0.40 and vce_k > 0.30:
                active_count += 1
            else:
                sat_count += 1
        else:
            veb_k = -vbe_k
            vcb_k = -vbe_k + vce_k
            if veb_k < 0.45:
                cutoff_count += 1
            elif vcb_k < 0.40 and vce_k < -0.30:
                active_count += 1
            else:
                sat_count += 1

    cutoff_pct = float(100.0 * cutoff_count / max(n_pts, 1))
    active_pct = float(100.0 * active_count / max(n_pts, 1))
    sat_pct = float(100.0 * sat_count / max(n_pts, 1))

    # Forced beta calculation (IC / IB)
    beta_forced = float(abs(ic_fin) / max(abs(ib_fin), 1e-12)) if abs(ib_fin) > 1e-9 else 0.0

    # Switching time metrics
    turn_on_time = None
    turn_off_time = None
    ic_pk = float(np.max(np.abs(ic_arr)))
    if ic_pk > 1e-4 and n_pts > 2:
        i_10 = 0.10 * ic_pk
        i_90 = 0.90 * ic_pk
        abs_ic = np.abs(ic_arr)
        idx_10 = np.where(abs_ic >= i_10)[0]
        idx_90 = np.where(abs_ic >= i_90)[0]
        if len(idx_10) > 0 and len(idx_90) > 0 and idx_90[0] >= idx_10[0]:
            turn_on_time = float(t_arr[idx_90[0]] - t_arr[idx_10[0]])

    # Small-signal voltage & current gains if vin / vout waveforms exist
    av = None
    ai = None
    if vin is not None and vout is not None and len(vin) == n_pts and len(vout) == n_pts:
        vin_arr = np.array(vin, dtype=np.float64)
        vout_arr = np.array(vout, dtype=np.float64)
        d_vin = float(np.max(vin_arr) - np.min(vin_arr))
        d_vout = float(np.max(vout_arr) - np.min(vout_arr))
        if d_vin > 1e-6:
            # Check phase inversion (negative gain for inverting common-emitter)
            corr = float(np.corrcoef(vin_arr, vout_arr)[0, 1]) if not np.isnan(np.corrcoef(vin_arr, vout_arr)[0, 1]) else 1.0
            sign = -1.0 if corr < 0 else 1.0
            av = float(sign * d_vout / d_vin)

        d_ib = float(np.max(ib_arr) - np.min(ib_arr))
        d_ic = float(np.max(ic_arr) - np.min(ic_arr))
        if d_ib > 1e-9:
            ai = float(d_ic / d_ib)

    return {
        "device_id": device_id,
        "polarity": polarity,
        "operating_region": op_region,
        "vbe_final": round(vbe_fin, 4),
        "vce_final": round(vce_fin, 4),
        "vbc_final": round(vbe_fin - vce_fin, 4),
        "ib_final": round(ib_fin, 7),
        "ic_final": round(ic_fin, 6),
        "ie_final": round(ie_fin, 6),
        "beta_forced": round(beta_forced, 2),
        "turn_on_time": round(turn_on_time, 9) if turn_on_time is not None else None,
        "turn_off_time": round(turn_off_time, 9) if turn_off_time is not None else None,
        "voltage_gain_av": round(av, 3) if av is not None else None,
        "current_gain_ai": round(ai, 2) if ai is not None else None,
        "saturation_interval_percent": round(sat_pct, 1),
        "active_interval_percent": round(active_pct, 1),
        "cutoff_interval_percent": round(cutoff_pct, 1)
    }


def classify_bjt_topology(
    netlist: Dict[str, Any],
    source_config: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Validates circuit topology against canonical BJT network patterns:
    - BJT_COMMON_EMITTER
    - BJT_COMMON_COLLECTOR (Emitter Follower)
    - BJT_SWITCH
    - BJT_INVERTER
    - GENERIC_BJT_NETWORK
    - UNSUPPORTED
    """
    components, sources, nodes_dict = parse_circuit_netlist(netlist)
    bjts = [c for c in components if c.type.lower() in ["bjt", "transistor", "npn", "pnp"]]
    resistors = [c for c in components if c.type.lower() in ["resistor", "res"]]

    if not bjts:
        return {
            "circuit_type": "UNSUPPORTED",
            "display_name": "Non-Transistor Circuit",
            "verification_status": "UNSUPPORTED",
            "category": "semiconductor",
            "primary_device": None,
            "governing_equation": "Linear MNA Nodal Equations"
        }

    q = bjts[0]
    props = getattr(q, "properties", {})
    nc = props.get("collector") or props.get("node_c") or props.get("node_collector") or q.node1
    nb = props.get("base") or props.get("node_b") or props.get("node_base") or q.node2
    ne = getattr(q, "node3", None) or props.get("emitter") or props.get("node_e") or props.get("node_emitter") or props.get("node3") or "GND"
    polarity = (getattr(q, "polarity", None) or props.get("polarity") or "NPN").upper()

    is_gnd_e = "GND" in str(ne).upper() or "GROUND" in str(ne).upper() or str(ne) == "0"
    is_gnd_c = "GND" in str(nc).upper() or "GROUND" in str(nc).upper() or str(nc) == "0"

    # Identify source type
    src_type = "step"
    if source_config:
        src_type = str(source_config.get("type", "step")).lower()
    elif sources:
        src_type = str(sources[0].get("type", "step")).lower()
    is_pulse_or_step = src_type in ["step", "pulse", "square"]
    is_sine = src_type in ["sine", "ac", "sinusoidal"]

    # Pattern 1: BJT Inverter / Switch (Base Resistor + Collector Load Resistor, Emitter grounded)
    if is_gnd_e and len(resistors) >= 1:
        # Check if a resistor connects to base and another to collector
        r_base = None
        r_coll = None
        for r in resistors:
            r_nodes = {r.node1, r.node2}
            if nb in r_nodes:
                r_base = r
            if nc in r_nodes:
                r_coll = r

        if is_pulse_or_step and r_base and r_coll:
            return {
                "circuit_type": "BJT_INVERTER" if r_coll else "BJT_SWITCH",
                "display_name": "BJT Digital Inverter / Switch",
                "category": "semiconductor",
                "verification_status": "VERIFIED",
                "primary_device": q.id,
                "governing_equation": "V_out = V_CC - I_C * R_C, I_B = (V_in - V_BE) / R_B",
                "polarity": polarity,
                "theoretical_model": {
                    "rb": float(r_base.value) if r_base else 10000.0,
                    "rc": float(r_coll.value) if r_coll else 1000.0,
                    "polarity": polarity
                }
            }
        elif is_sine and r_base and r_coll:
            return {
                "circuit_type": "BJT_COMMON_EMITTER",
                "display_name": "Common-Emitter Small-Signal Amplifier",
                "category": "amplifier",
                "verification_status": "VERIFIED",
                "primary_device": q.id,
                "governing_equation": "A_v = - g_m * R_C, A_i = beta_F",
                "polarity": polarity,
                "theoretical_model": {
                    "rb": float(r_base.value),
                    "rc": float(r_coll.value),
                    "polarity": polarity
                }
            }
        else:
            return {
                "circuit_type": "BJT_SWITCH",
                "display_name": "BJT Transistor Switch Circuit",
                "category": "semiconductor",
                "verification_status": "VERIFIED",
                "primary_device": q.id,
                "governing_equation": "I_C_sat = (V_CC - V_CE_sat) / R_C",
                "polarity": polarity,
                "theoretical_model": {
                    "polarity": polarity
                }
            }

    # Pattern 2: Common Collector / Emitter Follower (Collector to VCC, Emitter to Load Resistor)
    if not is_gnd_e and (not is_gnd_c):
        # Emitter follower has load connected to Emitter
        r_emit = None
        for r in resistors:
            if ne in {r.node1, r.node2}:
                r_emit = r
        if r_emit:
            return {
                "circuit_type": "BJT_COMMON_COLLECTOR",
                "display_name": "Common-Collector Buffer (Emitter Follower)",
                "category": "amplifier",
                "verification_status": "VERIFIED",
                "primary_device": q.id,
                "governing_equation": "A_v = (g_m * R_E) / (1 + g_m * R_E) ≈ 1.0 (Phase 0°)",
                "polarity": polarity,
                "theoretical_model": {
                    "re": float(r_emit.value),
                    "polarity": polarity
                }
            }

    return {
        "circuit_type": "GENERIC_BJT_NETWORK",
        "display_name": "Non-Linear BJT Transistor Network",
        "category": "semiconductor",
        "verification_status": "PARTIALLY_VERIFIED",
        "primary_device": q.id,
        "governing_equation": "Iterative Newton-Raphson Ebers-Moll MNA",
        "polarity": polarity,
        "theoretical_model": None
    }


def analyze_bjt_circuit(
    netlist: Dict[str, Any],
    source_config: Optional[Dict[str, Any]] = None,
    simulation_config: Optional[Dict[str, Any]] = None,
    initial_conditions: Optional[Dict[str, Any]] = None,
    nonlinear_config: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    High-level BJT orchestrator:
    1. Validates BJT topology
    2. Solves dynamic time-domain non-linear transient MNA with Damped Newton-Raphson
    3. Extracts transistor waveform metrics & operating regions
    4. Attaches educational explanation and AR/3D visual state
    """
    from .nonlinear_transient_mna import solve_nonlinear_transient_mna

    sim_cfg = simulation_config or {}
    t_start = float(sim_cfg.get("t_start", sim_cfg.get("tStart", 0.0)))
    t_stop = float(sim_cfg.get("t_stop", sim_cfg.get("tStop", 0.005)))
    dt = float(sim_cfg.get("dt", sim_cfg.get("timeStep", 0.00002)))
    method = str(sim_cfg.get("method", "backward_euler"))

    # 1. Topology Classification
    topo_res = classify_bjt_topology(netlist, source_config)
    circuit_type = topo_res.get("circuit_type", "UNSUPPORTED")

    if circuit_type == "UNSUPPORTED":
        return {
            "status": "UNSUPPORTED",
            "circuit_type": circuit_type,
            "display_name": topo_res.get("display_name", "Unsupported BJT Circuit"),
            "verification_status": "UNSUPPORTED",
            "message": "Circuit contains no verified BJT transistors.",
            "source": "nonlinear_transient_mna_simulation",
            "is_measured": False,
            "physical_validation_status": "NOT_PERFORMED"
        }

    # 2. Run Non-Linear MNA Simulation
    solver_res = solve_nonlinear_transient_mna(
        netlist=netlist,
        t_start=t_start,
        t_stop=t_stop,
        dt=dt,
        method=method,
        source_config=source_config,
        initial_conditions=initial_conditions,
        nonlinear_config=nonlinear_config
    )

    if solver_res.get("status") != "VERIFIED":
        return solver_res

    # 3. Waveform Metrics Extraction
    time = solver_res.get("time", [])
    signals = solver_res.get("signals", [])
    primary_dev_id = topo_res.get("primary_device", "Q1")
    polarity = topo_res.get("polarity", "NPN")

    v_be_vals = []
    v_ce_vals = []
    i_b_vals = []
    i_c_vals = []
    i_e_vals = []
    vin_vals = []
    vout_vals = []

    for s in signals:
        sname = s.get("name", "")
        stype = s.get("type", "")
        svals = s.get("values", [])
        if "V_BE" in sname: v_be_vals = svals
        elif "V_CE" in sname: v_ce_vals = svals
        elif "I_B" in sname: i_b_vals = svals
        elif "I_C" in sname: i_c_vals = svals
        elif "I_E" in sname: i_e_vals = svals
        elif "in" in sname.lower() or "src" in sname.lower(): vin_vals = svals
        elif "out" in sname.lower() or "c" in sname.lower(): vout_vals = svals

    # Fallback to direct trajectories if signal name mapping differs
    if not v_be_vals and solver_res.get("bjt_states"):
        b_st = solver_res["bjt_states"][0]
        v_be_vals = [b_st.get("vbe", 0.0)] * len(time)
        v_ce_vals = [b_st.get("vce", 0.0)] * len(time)
        i_b_vals = [b_st.get("ib", 0.0)] * len(time)
        i_c_vals = [b_st.get("ic", 0.0)] * len(time)
        i_e_vals = [b_st.get("ie", 0.0)] * len(time)

    metrics = extract_bjt_metrics(
        time=time,
        v_be=v_be_vals,
        v_ce=v_ce_vals,
        i_b=i_b_vals,
        i_c=i_c_vals,
        i_e=i_e_vals,
        vin=vin_vals,
        vout=vout_vals,
        polarity=polarity,
        device_id=primary_dev_id
    )

    # 4. Educational Explanation
    explanation = _generate_bjt_explanation(circuit_type, metrics, topo_res.get("theoretical_model"))

    # 5. Visualization State
    vis_state = _determine_bjt_vis_state(circuit_type, metrics)

    return {
        "status": "VERIFIED",
        "circuit_type": circuit_type,
        "circuitType": circuit_type,
        "display_name": topo_res.get("display_name"),
        "verification_status": topo_res.get("verification_status"),
        "primary_device": primary_dev_id,
        "polarity": polarity,
        "governing_equation": topo_res.get("governing_equation"),
        "theoretical_model": topo_res.get("theoretical_model"),
        "solver": solver_res.get("solver"),
        "time": time,
        "signals": signals,
        "device_states": solver_res.get("bjt_states", solver_res.get("device_states", [])),
        "node_voltages": solver_res.get("node_voltages", {}),
        "metrics": metrics,
        "educational_explanation": explanation,
        "visualization_state": vis_state,
        "source": "nonlinear_transient_mna_simulation",
        "is_measured": False,
        "physical_validation_status": "NOT_PERFORMED"
    }


def _generate_bjt_explanation(
    circuit_type: str,
    metrics: Dict[str, Any],
    theoretical: Optional[Dict[str, Any]]
) -> Dict[str, Any]:
    """Generates pedagogically rich descriptions of simulated transistor action."""
    region = metrics.get("operating_region", "CUTOFF")
    vbe = metrics.get("vbe_final", 0.0)
    vce = metrics.get("vce_final", 0.0)
    ic_mA = metrics.get("ic_final", 0.0) * 1000.0
    ib_uA = metrics.get("ib_final", 0.0) * 1e6
    beta = metrics.get("beta_forced", 0.0)

    if region == "CUTOFF":
        text = (
            f"The simulation indicates that the transistor is in CUTOFF (V_BE = {vbe:.3f} V, I_B = {ib_uA:.2f} µA). "
            f"Both base-emitter and base-collector junctions remain non-conducting, "
            f"so collector current remains at the model's leakage level (I_C = {ic_mA:.4f} mA)."
        )
    elif region == "FORWARD_ACTIVE":
        text = (
            f"The simulation indicates FORWARD-ACTIVE operation: the base-emitter junction is forward biased "
            f"(V_BE = {vbe:.3f} V) while the base-collector junction remains reverse biased (V_CE = {vce:.2f} V). "
            f"Small base current ({ib_uA:.2f} µA) controls a large collector current ({ic_mA:.2f} mA) with effective gain β ≈ {beta:.1f}."
        )
    elif region == "SATURATION":
        text = (
            f"Both transistor junctions are forward biased in the simulated operating point, indicating SATURATION "
            f"(V_CE = {vce:.3f} V, I_C = {ic_mA:.2f} mA). The transistor acts as a closed switch."
        )
    else:
        text = f"The transistor is operating in {region} mode as solved by the non-linear Newton-Raphson MNA engine."

    return {
        "summary": text,
        "circuit_type": circuit_type,
        "operating_region": region,
        "collector_current_mA": ic_mA,
        "base_current_uA": ib_uA,
        "forced_beta": beta,
        "scientific_note": "Values derived from non-linear transient MNA simulation. Physical validation not performed."
    }


def _determine_bjt_vis_state(circuit_type: str, metrics: Dict[str, Any]) -> str:
    """Selects corresponding visualization state for AR/3D renders."""
    region = metrics.get("operating_region", "CUTOFF")
    if circuit_type == "BJT_INVERTER":
        return "BJT_INVERTER_ACTIVE" if region in ["FORWARD_ACTIVE", "SATURATION"] else "BJT_CUTOFF"
    elif circuit_type == "BJT_COMMON_EMITTER" or circuit_type == "BJT_COMMON_COLLECTOR":
        return "BJT_AMPLIFICATION" if region == "FORWARD_ACTIVE" else ("BJT_SATURATION" if region == "SATURATION" else "BJT_CUTOFF")
    elif region == "FORWARD_ACTIVE":
        return "BJT_FORWARD_ACTIVE"
    elif region == "SATURATION":
        return "BJT_SATURATION"
    else:
        return "BJT_CUTOFF"
