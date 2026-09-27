"""
SmartBreadboard 3D — Transient Behavior & Waveform Metrics Extraction Engine
Extracts rigorous time-domain metrics, classifies circuit damping and first-order
characteristics from numerically solved waveforms.

Scientific Integrity:
- source: "transient_mna_simulation"
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


def extract_waveform_metrics(
    time: List[float],
    values: List[float],
    signal_name: str = "Signal",
    signal_type: str = "voltage"
) -> Dict[str, Any]:
    """
    Extracts time-domain characteristics (initial, final, peak, min, rise time,
    fall time, time constant tau, settling time, overshoot, oscillation) from
    a numerically solved time series.
    """
    if not time or not values or len(time) != len(values) or len(time) < 2:
        return {
            "initial_value": 0.0,
            "final_value": 0.0,
            "peak_value": 0.0,
            "min_value": 0.0,
            "rise_time": None,
            "fall_time": None,
            "tau": None,
            "settling_time": None,
            "overshoot_percent": 0.0,
            "damping": "UNKNOWN"
        }

    t_arr = np.array(time, dtype=np.float64)
    y_arr = np.array(values, dtype=np.float64)

    y_init = float(y_arr[0])
    y_final = float(y_arr[-1])
    y_peak = float(np.max(y_arr))
    y_min = float(np.min(y_arr))
    t_peak = float(t_arr[np.argmax(y_arr)])

    delta_y = y_final - y_init
    total_range = np.ptp(y_arr)

    # 1. Rise Time & Fall Time (10% to 90% and 90% to 10%)
    rise_time = None
    fall_time = None

    if abs(delta_y) > 1e-6:
        # Rising transition
        if y_final > y_init:
            val_10 = y_init + 0.10 * delta_y
            val_90 = y_init + 0.90 * delta_y
            idx_10 = np.where(y_arr >= val_10)[0]
            idx_90 = np.where(y_arr >= val_90)[0]
            if len(idx_10) > 0 and len(idx_90) > 0:
                t_10 = t_arr[idx_10[0]]
                t_90 = t_arr[idx_90[0]]
                if t_90 >= t_10:
                    rise_time = float(t_90 - t_10)
        # Falling transition
        elif y_final < y_init:
            val_90 = y_init + 0.10 * delta_y  # 90% of initial towards final
            val_10 = y_init + 0.90 * delta_y  # 10% remaining above final
            idx_90 = np.where(y_arr <= val_90)[0]
            idx_10 = np.where(y_arr <= val_10)[0]
            if len(idx_90) > 0 and len(idx_10) > 0:
                t_90 = t_arr[idx_90[0]]
                t_10 = t_arr[idx_10[0]]
                if t_10 >= t_90:
                    fall_time = float(t_10 - t_90)

    # 2. Time Constant (tau) from Solved Numerical Waveform
    # For rising: y(tau) = y_init + (1 - 1/e) * (y_final - y_init) ~ 63.21%
    # For falling: y(tau) = y_init + (1 - 1/e) * (y_final - y_init) ~ decayed 63.21%
    tau = None
    if abs(delta_y) > 1e-6:
        target_63 = y_init + (1.0 - np.exp(-1.0)) * delta_y
        if delta_y > 0:
            cross_idx = np.where(y_arr >= target_63)[0]
        else:
            cross_idx = np.where(y_arr <= target_63)[0]
        if len(cross_idx) > 0:
            tau = float(t_arr[cross_idx[0]] - t_arr[0])

    # 3. Overshoot / Undershoot
    overshoot_percent = 0.0
    undershoot_percent = 0.0
    if abs(delta_y) > 1e-6:
        if delta_y > 0:
            if y_peak > y_final:
                overshoot_percent = float(100.0 * (y_peak - y_final) / abs(delta_y))
            if y_min < y_init:
                undershoot_percent = float(100.0 * (y_init - y_min) / abs(delta_y))
        else:
            if y_min < y_final:
                overshoot_percent = float(100.0 * (y_final - y_min) / abs(delta_y))

    # 4. Settling Time (2% criterion: time after which signal remains within ±2% of delta_y from y_final)
    settling_time = None
    if abs(delta_y) > 1e-6:
        band = 0.02 * abs(delta_y)
        outside_indices = np.where(np.abs(y_arr - y_final) > band)[0]
        if len(outside_indices) > 0:
            last_outside_idx = outside_indices[-1]
            if last_outside_idx < len(t_arr) - 1:
                settling_time = float(t_arr[last_outside_idx + 1] - t_arr[0])
            else:
                settling_time = None  # Did not settle within simulation window
        else:
            settling_time = float(t_arr[0])

    # 5. Oscillation / Ringing Detection & Damping Classification
    # Count local extrema (peaks and valleys)
    d_y = np.diff(y_arr)
    sign_changes = np.where(np.diff(np.sign(d_y)))[0]
    num_extrema = len(sign_changes)

    oscillation_freq_hz = None
    damping = "FIRST_ORDER"

    if num_extrema >= 2 and overshoot_percent > 1.0:
        damping = "UNDERDAMPED"
        # Estimate damped frequency from peak-to-peak times
        peak_indices = [idx + 1 for idx in sign_changes if idx < len(d_y) - 1 and d_y[idx] > 0 and d_y[idx+1] < 0]
        if len(peak_indices) >= 2:
            period_samples = np.diff(t_arr[peak_indices])
            avg_period = float(np.mean(period_samples))
            if avg_period > 0:
                oscillation_freq_hz = float(1.0 / avg_period)
    elif overshoot_percent <= 0.5 and abs(delta_y) > 1e-6:
        # Check if 2nd order or first order
        damping = "OVERDAMPED" if num_extrema == 0 else "CRITICALLY_DAMPED"

    return {
        "signal_name": signal_name,
        "signal_type": signal_type,
        "initial_value": round(y_init, 6),
        "final_value": round(y_final, 6),
        "peak_value": round(y_peak, 6),
        "min_value": round(y_min, 6),
        "peak_time": round(t_peak, 6),
        "rise_time": round(rise_time, 6) if rise_time is not None else None,
        "fall_time": round(fall_time, 6) if fall_time is not None else None,
        "tau": round(tau, 6) if tau is not None else None,
        "settling_time": round(settling_time, 6) if settling_time is not None else None,
        "overshoot_percent": round(overshoot_percent, 2),
        "undershoot_percent": round(undershoot_percent, 2),
        "oscillation_freq_hz": round(oscillation_freq_hz, 2) if oscillation_freq_hz is not None else None,
        "damping": damping
    }


def classify_transient_topology(
    netlist: Dict[str, Any],
    source_config: Optional[Dict[str, Any]] = None,
    initial_conditions: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Validates circuit topology against canonical transient network patterns:
    - RC_CHARGING: Step source + R + C in series loop
    - RC_DISCHARGING: C (with initial charge) + R discharge path (no driving source or step to 0V)
    - RL_CURRENT_RISE: Step source + R + L in series loop
    - RL_CURRENT_DECAY: L (with initial current) + R discharge path
    - RLC_TRANSIENT: Series or parallel RLC network
    - GENERIC_TRANSIENT: Arbitrary connected reactive network
    - INVALID_TOPOLOGY: Disconnected, shorted, or floating network
    """
    components, sources, nodes_dict = parse_circuit_netlist(netlist)
    comps = netlist.get("components", [])
    
    resistors = [c for c in components if c.type.lower() in ["resistor", "res"]]
    capacitors = [c for c in components if c.type.lower() in ["capacitor", "cap"]]
    inductors = [c for c in components if c.type.lower() in ["inductor", "ind"]]

    # Inspect source excitation
    if source_config:
        src_dict = source_config
    elif sources:
        src_dict = sources[0]
    else:
        src_dict = {}

    src_type = str(src_dict.get("type", "step")).lower()
    v_init = float(src_dict.get("initial_value", src_dict.get("initialValue", 0.0)))
    v_final = float(src_dict.get("final_value", src_dict.get("finalValue", src_dict.get("voltage", 0.0 if initial_conditions else 5.0))))

    init_conds = initial_conditions or {}
    has_cap_init_voltage = any(float(v) > 0 for k, v in init_conds.items() if "c" in k.lower() or "v" in k.lower())
    has_ind_init_current = any(float(v) > 0 for k, v in init_conds.items() if "l" in k.lower() or "i" in k.lower())

    # Topology Pattern 1: RC Networks
    if len(capacitors) == 1 and len(resistors) >= 1 and len(inductors) == 0:
        c = capacitors[0]
        r = resistors[0]
        r_val = float(r.value)
        c_val = float(c.value)
        tau_theor = r_val * c_val

        # Check if discharging vs charging
        if (has_cap_init_voltage and v_final <= 0.0) or (v_final < v_init):
            v0 = float(init_conds.get(c.id, init_conds.get(f"V_{c.id}", init_conds.get("Vc", v_init))))
            return {
                "circuit_type": "RC_DISCHARGING",
                "display_name": "RC Discharging Circuit",
                "category": "transient",
                "verification_status": "VERIFIED",
                "primary_signal": f"V({c.id})",
                "governing_equation": "v_C(t) = V_0 * exp(-t / (R * C))",
                "theoretical_model": {
                    "tau_theoretical": tau_theor,
                    "r_equivalent": r_val,
                    "c_equivalent": c_val,
                    "initial_voltage": v0,
                    "final_voltage": 0.0
                }
            }
        elif (src_type in ["step", "dc"] and v_final > v_init) or (not has_cap_init_voltage and v_final > 0):
            return {
                "circuit_type": "RC_CHARGING",
                "display_name": "RC Charging Circuit",
                "category": "transient",
                "verification_status": "VERIFIED",
                "primary_signal": f"V({c.id})",
                "governing_equation": "v_C(t) = V_f + (V_0 - V_f) * exp(-t / (R * C))",
                "theoretical_model": {
                    "tau_theoretical": tau_theor,
                    "r_equivalent": r_val,
                    "c_equivalent": c_val,
                    "initial_voltage": v_init,
                    "final_voltage": v_final
                }
            }
        else:
            return {
                "circuit_type": "RC_CHARGING",
                "display_name": "RC First-Order Network",
                "category": "transient",
                "verification_status": "VERIFIED",
                "primary_signal": f"V({c.id})",
                "governing_equation": "v_C(t) = V_f + (V_0 - V_f) * exp(-t / (R * C))",
                "theoretical_model": {
                    "tau_theoretical": tau_theor,
                    "r_equivalent": r_val,
                    "c_equivalent": c_val
                }
            }

    # Topology Pattern 2: RL Networks
    elif len(inductors) == 1 and len(resistors) >= 1 and len(capacitors) == 0:
        l = inductors[0]
        r = resistors[0]
        r_val = float(r.value)
        l_val = float(l.value)
        tau_theor = l_val / max(r_val, 1e-6)

        if (has_ind_init_current and v_final <= 0.0) or (v_final < v_init):
            i0 = float(init_conds.get(l.id, init_conds.get(f"I_{l.id}", init_conds.get("Il", 0.0))))
            return {
                "circuit_type": "RL_CURRENT_DECAY",
                "display_name": "RL Current Decay Circuit",
                "category": "transient",
                "verification_status": "VERIFIED",
                "primary_signal": f"I({l.id})",
                "governing_equation": "i_L(t) = I_0 * exp(-t * R / L)",
                "theoretical_model": {
                    "tau_theoretical": tau_theor,
                    "r_equivalent": r_val,
                    "l_equivalent": l_val,
                    "initial_current": i0,
                    "final_current": 0.0
                }
            }
        elif (src_type in ["step", "dc"] and v_final > v_init) or (not has_ind_init_current and v_final > 0):
            i_final_theor = v_final / max(r_val, 1e-6)
            return {
                "circuit_type": "RL_CURRENT_RISE",
                "display_name": "RL Current Step Response",
                "category": "transient",
                "verification_status": "VERIFIED",
                "primary_signal": f"I({l.id})",
                "governing_equation": "i_L(t) = (V / R) * [ 1 - exp(-t * R / L) ]",
                "theoretical_model": {
                    "tau_theoretical": tau_theor,
                    "r_equivalent": r_val,
                    "l_equivalent": l_val,
                    "initial_current": 0.0,
                    "final_current": i_final_theor
                }
            }
        else:
            i0 = float(init_conds.get(l.id, init_conds.get(f"I_{l.id}", init_conds.get("Il", 0.0))))
            return {
                "circuit_type": "RL_CURRENT_DECAY",
                "display_name": "RL Current Decay Circuit",
                "category": "transient",
                "verification_status": "VERIFIED",
                "primary_signal": f"I({l.id})",
                "governing_equation": "i_L(t) = I_0 * exp(-t * R / L)",
                "theoretical_model": {
                    "tau_theoretical": tau_theor,
                    "r_equivalent": r_val,
                    "l_equivalent": l_val,
                    "initial_current": i0,
                    "final_current": 0.0
                }
            }


    # Topology Pattern 3: RLC Networks
    elif len(capacitors) >= 1 and len(inductors) >= 1 and len(resistors) >= 1:
        c = capacitors[0]
        l = inductors[0]
        r = resistors[0]
        r_val = float(r.value)
        l_val = float(l.value)
        c_val = float(c.value)

        # Theoretical series RLC damping factor and natural frequency
        omega_0 = 1.0 / np.sqrt(l_val * c_val)
        alpha = r_val / (2.0 * l_val)
        zeta = alpha / omega_0

        damping_theor = "CRITICALLY_DAMPED"
        if zeta < 0.98:
            damping_theor = "UNDERDAMPED"
        elif zeta > 1.02:
            damping_theor = "OVERDAMPED"

        return {
            "circuit_type": "RLC_TRANSIENT",
            "display_name": "Series RLC Transient Network",
            "category": "transient",
            "verification_status": "VERIFIED",
            "primary_signal": f"V({c.id})",
            "governing_equation": "d2v/dt2 + (R/L) dv/dt + (1/LC) v = 0",
            "theoretical_model": {
                "omega_0": omega_0,
                "alpha": alpha,
                "damping_ratio_zeta": zeta,
                "theoretical_damping": damping_theor,
                "r_val": r_val,
                "l_val": l_val,
                "c_val": c_val
            }
        }

    elif len(capacitors) > 0 or len(inductors) > 0:
        return {
            "circuit_type": "GENERIC_TRANSIENT",
            "display_name": "Multi-Reactive Transient Circuit",
            "category": "transient",
            "verification_status": "PARTIALLY_VERIFIED",
            "primary_signal": "V(node_1)" if nodes_dict else "V(out)",
            "governing_equation": "Numerical State-Space MNA Integration",
            "theoretical_model": None
        }

    else:
        return {
            "circuit_type": "UNSUPPORTED",
            "display_name": "Non-Reactive Network (No Transients)",
            "category": "basic",
            "verification_status": "UNSUPPORTED",
            "primary_signal": None,
            "governing_equation": "Pure DC / Algebraic Network",
            "theoretical_model": None
        }


def analyze_transient_circuit(
    netlist: Dict[str, Any],
    source_config: Optional[Dict[str, Any]] = None,
    simulation_config: Optional[Dict[str, Any]] = None,
    initial_conditions: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    High-level orchestrator:
    1. Validates topology and classifies transient candidate
    2. Runs Transient MNA numerical integration
    3. Extracts waveform metrics from solved signals
    4. Attaches educational intelligence and visualization states
    """
    from .transient_mna import solve_transient_mna

    sim_cfg = simulation_config or {}
    t_start = float(sim_cfg.get("t_start", sim_cfg.get("tStart", 0.0)))
    t_stop = float(sim_cfg.get("t_stop", sim_cfg.get("tStop", 0.01)))
    dt = float(sim_cfg.get("dt", sim_cfg.get("timeStep", 0.0001)))
    method = str(sim_cfg.get("method", "backward_euler"))

    # 1. Topology Classification
    topo_res = classify_transient_topology(netlist, source_config, initial_conditions)
    circuit_type = topo_res.get("circuit_type", "UNSUPPORTED")

    # If unsupported / invalid, safely return without fabricating waveforms
    if circuit_type in ["UNSUPPORTED", "UNKNOWN"]:
        return {
            "status": "UNSUPPORTED",
            "circuit_type": circuit_type,
            "display_name": topo_res.get("display_name", "Unsupported Transient Circuit"),
            "verification_status": "UNSUPPORTED",
            "message": "Circuit does not contain reactive components (capacitors or inductors) for transient analysis.",
            "source": "transient_mna_simulation",
            "is_measured": False,
            "physical_validation_status": "NOT_PERFORMED"
        }

    # 2. Run Numerical MNA Simulation
    solver_res = solve_transient_mna(
        netlist=netlist,
        t_start=t_start,
        t_stop=t_stop,
        dt=dt,
        method=method,
        source_config=source_config,
        initial_conditions=initial_conditions
    )

    if solver_res.get("status") != "VERIFIED":
        return solver_res

    # 3. Waveform Metrics Extraction
    time = solver_res.get("time", [])
    signals = solver_res.get("signals", [])
    primary_sig_name = topo_res.get("primary_signal")

    primary_signal_obj = None
    if primary_sig_name:
        for s in signals:
            if s.get("name") == primary_sig_name:
                primary_signal_obj = s
                break
    if not primary_signal_obj and len(signals) > 0:
        # Fallback to first non-ground voltage or current signal
        for s in signals:
            if not s.get("name", "").startswith("V(node_gnd") and not s.get("name", "").startswith("V(0"):
                primary_signal_obj = s
                break
        if not primary_signal_obj:
            primary_signal_obj = signals[0]

    primary_metrics = {}
    if primary_signal_obj:
        primary_metrics = extract_waveform_metrics(
            time=time,
            values=primary_signal_obj.get("values", []),
            signal_name=primary_signal_obj.get("name", "V_primary"),
            signal_type=primary_signal_obj.get("type", "voltage")
        )

    # 4. Educational Explanation
    explanation = _generate_transient_explanation(circuit_type, primary_metrics, topo_res.get("theoretical_model"))

    # 5. Visualization State Mapping
    vis_state = _determine_transient_vis_state(circuit_type, primary_metrics)

    return {
        "status": "VERIFIED",
        "circuit_type": circuit_type,
        "circuitType": circuit_type,
        "display_name": topo_res.get("display_name"),
        "verification_status": topo_res.get("verification_status"),
        "primary_signal": primary_signal_obj.get("name") if primary_signal_obj else None,
        "governing_equation": topo_res.get("governing_equation"),
        "theoretical_model": topo_res.get("theoretical_model"),
        "solver": solver_res.get("solver"),
        "time": time,
        "signals": signals,
        "node_voltages": solver_res.get("node_voltages"),
        "metrics": primary_metrics,
        "educational_explanation": explanation,
        "visualization_state": vis_state,
        "source": "transient_mna_simulation",
        "is_measured": False,
        "physical_validation_status": "NOT_PERFORMED"
    }


def _generate_transient_explanation(
    circuit_type: str,
    metrics: Dict[str, Any],
    theoretical: Optional[Dict[str, Any]]
) -> Dict[str, Any]:
    """Generates structured educational insights strictly based on solved numerical results."""
    tau_solved = metrics.get("tau")
    tau_str = f"{tau_solved:.4f} s" if tau_solved is not None else "N/A"
    v_init = metrics.get("initial_value", 0.0)
    v_final = metrics.get("final_value", 0.0)
    v_init_val = v_init if v_init is not None else 0.0
    v_final_val = v_final if v_final is not None else 0.0
    damping = metrics.get("damping", "FIRST_ORDER") or "FIRST_ORDER"
    overshoot = metrics.get("overshoot_percent", 0.0) or 0.0

    if circuit_type == "RC_CHARGING":
        text = (
            f"Simulation shows the capacitor charging from an initial voltage of {v_init_val:.2f} V "
            f"towards a steady-state value of {v_final_val:.2f} V. "
            f"The numerical solution yields a time constant τ ≈ {tau_str} (where charge reaches ~63.2%). "
            f"At t=0, the capacitor acts as a low impedance, drawing peak current, which exponentially decays to zero as charge accumulates."
        )
    elif circuit_type == "RC_DISCHARGING":
        text = (
            f"Simulation shows stored electrostatic energy dissipating through the resistor. "
            f"Capacitor voltage decays from {v_init_val:.2f} V towards {v_final_val:.2f} V with a solved time constant τ ≈ {tau_str}."
        )
    elif circuit_type in ["RL_CURRENT_RISE", "RL_CURRENT_DECAY"]:
        text = (
            f"Simulation shows inductor current transitioning from {v_init_val:.4f} A to a steady-state current of {v_final_val:.4f} A. "
            f"The back-EMF opposes instantaneous current changes, resulting in a smooth inductive current trajectory with τ ≈ {tau_str}."
        )
    elif circuit_type == "RLC_TRANSIENT":
        text = (
            f"Simulation indicates a 2nd-order RLC response exhibiting {damping.lower()} characteristics "
            f"with {overshoot:.1f}% peak overshoot. Magnetic energy in the inductor and electric energy in the capacitor exchange through the resistive damping element."
        )
    else:
        text = (
            f"Simulation shows a multi-reactive transient progression with initial value {v_init_val:.2f} and settling towards {v_final_val:.2f}."
        )

    return {
        "summary": text,
        "circuit_type": circuit_type,
        "solved_tau": tau_solved,
        "damping": damping,
        "scientific_note": "Values derived from numerical transient MNA integration. Physical validation not performed."
    }



def _determine_transient_vis_state(circuit_type: str, metrics: Dict[str, Any]) -> str:
    """Selects corresponding visualization state for 3D/AR renders."""
    if circuit_type == "RC_CHARGING":
        return "TRANSIENT_CHARGING"
    elif circuit_type == "RC_DISCHARGING":
        return "TRANSIENT_DISCHARGING"
    elif circuit_type in ["RL_CURRENT_RISE", "RL_CURRENT_DECAY"]:
        return "TRANSIENT_SETTLING"
    elif circuit_type == "RLC_TRANSIENT":
        return "TRANSIENT_OSCILLATING" if metrics.get("damping") == "UNDERDAMPED" else "TRANSIENT_SETTLING"
    else:
        return "TRANSIENT_ANALYSIS"
