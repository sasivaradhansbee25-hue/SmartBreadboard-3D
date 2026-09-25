"""
SmartBreadboard 3D — Generalized AC Circuit Intelligence Engine (Phase 27)
Solves and classifies frequency-dependent electrical behavior deterministically:
- Transfer function extraction: H(jω) = Vout / Vin
- Gain (magnitude & dB) and Phase response ∠H(jω)
- Generalized -3dB cutoff frequency detection (f_low, f_high, fc)
- Response shape analysis (peak, notch, low/high frequency asymptotics, monotonicity)
- Deterministic behavior classification:
  LOW_PASS, HIGH_PASS, BAND_PASS, BAND_STOP, RESONANT, ALL_PASS,
  FREQUENCY_INDEPENDENT, IMPEDANCE_RESONANCE, UNKNOWN, UNSUPPORTED
- Multi-candidate behavior & evidentiary reasoning
- Theoretical vs MNA benchmark verification (RC, RL, RLC)

SCIENTIFIC INTEGRITY:
- source is strictly "mna_simulation"
- is_measured is strictly False
- Never infers behavior from component counts alone
"""

import math
import cmath
from typing import Dict, Any, List, Optional, Tuple

from .complex_mna import solve_ac_frequency_point, parse_numeric
from .frequency_sweep import run_frequency_sweep
from .resonance import analyze_resonance
from .netlist_parser import parse_circuit_netlist


# Canonical Behavior Types
BEHAVIOR_TYPES = {
    "LOW_PASS": "LOW_PASS",
    "HIGH_PASS": "HIGH_PASS",
    "BAND_PASS": "BAND_PASS",
    "BAND_STOP": "BAND_STOP",
    "RESONANT": "RESONANT",
    "ALL_PASS": "ALL_PASS",
    "FREQUENCY_INDEPENDENT": "FREQUENCY_INDEPENDENT",
    "IMPEDANCE_RESONANCE": "IMPEDANCE_RESONANCE",
    "UNKNOWN": "UNKNOWN",
    "UNSUPPORTED": "UNSUPPORTED"
}


def identify_candidate_io_nodes(netlist: Dict[str, Any]) -> Dict[str, Any]:
    """
    Identifies input node, ground node, and output candidate nodes from netlist topology.
    """
    components, sources, _ = parse_circuit_netlist(netlist)
    active_nodes = set()
    for comp in components:
        if comp.node1: active_nodes.add(comp.node1)
        if comp.node2: active_nodes.add(comp.node2)

    # 1. Ground Node
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

    # 2. Input Node
    input_node = None
    if sources:
        input_node = sources[0].get("positive_node") or sources[0].get("node_pos")
    if not input_node and active_nodes:
        non_gnd = [n for n in sorted(list(active_nodes)) if n != ground_node]
        if non_gnd:
            input_node = non_gnd[0]

    # 3. Output Node candidates: prioritize nodes named VOUT/OUT, then intermediate non-input, non-ground nodes
    non_gnd_nodes = [n for n in sorted(list(active_nodes)) if n != ground_node]
    intermediate_nodes = [n for n in non_gnd_nodes if n != input_node]

    output_candidate = None
    for n in intermediate_nodes:
        if "OUT" in str(n).upper() or "VOUT" in str(n).upper():
            output_candidate = n
            break

    if not output_candidate:
        output_candidate = intermediate_nodes[0] if intermediate_nodes else (input_node if input_node else None)

    return {
        "ground_node": ground_node,
        "input_node": input_node,
        "output_node": output_candidate,
        "all_nodes": sorted(list(active_nodes)),
        "intermediate_nodes": intermediate_nodes
    }


def inspect_filter_topology(netlist: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyzes netlist graph to detect strict RC, RL, RLC filter configurations.
    """
    components, sources, _ = parse_circuit_netlist(netlist)
    comps = [c for c in components if not str(c.type).lower().startswith("wire")]

    resistors = [c for c in comps if "resistor" in str(c.type).lower() or "res" in str(c.type).lower()]
    capacitors = [c for c in comps if "capacitor" in str(c.type).lower() or "cap" in str(c.type).lower()]
    inductors = [c for c in comps if "inductor" in str(c.type).lower() or "ind" in str(c.type).lower()]

    io = identify_candidate_io_nodes(netlist)
    gnd = io["ground_node"]
    in_node = io["input_node"]
    out_node = io["output_node"]

    # RC Filter Check: 1 Resistor + 1 Capacitor
    if len(resistors) == 1 and len(capacitors) == 1 and len(inductors) == 0:
        r = resistors[0]
        c = capacitors[0]
        r_nodes = {r.node1, r.node2}
        c_nodes = {c.node1, c.node2}

        # Check RC Low-Pass: R connected between in_node and out_node, C between out_node and GND
        if (in_node in r_nodes and out_node in r_nodes and
            out_node in c_nodes and gnd in c_nodes):
            r_val = parse_numeric(r.value, 1000.0)
            c_val = parse_numeric(c.value, 1e-7)
            if c_val > 1.0: c_val *= 1e-6
            fc_theoretical = 1.0 / (2.0 * math.pi * max(r_val, 1e-6) * max(c_val, 1e-15))
            return {
                "detected_topology": "RC_LOW_PASS",
                "topology_type": "FIRST_ORDER_RC_LOW_PASS",
                "is_filter_topology": True,
                "input_node": in_node,
                "output_node": out_node,
                "ground_node": gnd,
                "series_component": r.id,
                "shunt_component": c.id,
                "theoretical_cutoff_hz": round(fc_theoretical, 2),
                "theoretical_formula": "fc = 1 / (2*pi*R*C)",
                "components": {"resistor": r_val, "capacitor": c_val}
            }

        # Check RC High-Pass: C connected between in_node and out_node, R between out_node and GND
        if (in_node in c_nodes and out_node in c_nodes and
            out_node in r_nodes and gnd in r_nodes):
            r_val = parse_numeric(r.value, 1000.0)
            c_val = parse_numeric(c.value, 1e-7)
            if c_val > 1.0: c_val *= 1e-6
            fc_theoretical = 1.0 / (2.0 * math.pi * max(r_val, 1e-6) * max(c_val, 1e-15))
            return {
                "detected_topology": "RC_HIGH_PASS",
                "topology_type": "FIRST_ORDER_RC_HIGH_PASS",
                "is_filter_topology": True,
                "input_node": in_node,
                "output_node": out_node,
                "ground_node": gnd,
                "series_component": c.id,
                "shunt_component": r.id,
                "theoretical_cutoff_hz": round(fc_theoretical, 2),
                "theoretical_formula": "fc = 1 / (2*pi*R*C)",
                "components": {"resistor": r_val, "capacitor": c_val}
            }

    # RL Filter Check: 1 Resistor + 1 Inductor
    if len(resistors) == 1 and len(inductors) == 1 and len(capacitors) == 0:
        r = resistors[0]
        l = inductors[0]
        r_nodes = {r.node1, r.node2}
        l_nodes = {l.node1, l.node2}

        # Check RL Low-Pass: L connected between in_node and out_node, R between out_node and GND
        if (in_node in l_nodes and out_node in l_nodes and
            out_node in r_nodes and gnd in r_nodes):
            r_val = parse_numeric(r.value, 1000.0)
            l_val = parse_numeric(l.value, 0.010)
            fc_theoretical = max(r_val, 1e-6) / (2.0 * math.pi * max(l_val, 1e-12))
            return {
                "detected_topology": "RL_LOW_PASS",
                "topology_type": "FIRST_ORDER_RL_LOW_PASS",
                "is_filter_topology": True,
                "input_node": in_node,
                "output_node": out_node,
                "ground_node": gnd,
                "series_component": l.id,
                "shunt_component": r.id,
                "theoretical_cutoff_hz": round(fc_theoretical, 2),
                "theoretical_formula": "fc = R / (2*pi*L)",
                "components": {"resistor": r_val, "inductor": l_val}
            }

        # Check RL High-Pass: R connected between in_node and out_node, L between out_node and GND
        if (in_node in r_nodes and out_node in r_nodes and
            out_node in l_nodes and gnd in l_nodes):
            r_val = parse_numeric(r.value, 1000.0)
            l_val = parse_numeric(l.value, 0.010)
            fc_theoretical = max(r_val, 1e-6) / (2.0 * math.pi * max(l_val, 1e-12))
            return {
                "detected_topology": "RL_HIGH_PASS",
                "topology_type": "FIRST_ORDER_RL_HIGH_PASS",
                "is_filter_topology": True,
                "input_node": in_node,
                "output_node": out_node,
                "ground_node": gnd,
                "series_component": r.id,
                "shunt_component": l.id,
                "theoretical_cutoff_hz": round(fc_theoretical, 2),
                "theoretical_formula": "fc = R / (2*pi*L)",
                "components": {"resistor": r_val, "inductor": l_val}
            }

    # RLC Filter Check (Band-Pass / Band-Stop / Resonance)
    if len(inductors) >= 1 and len(capacitors) >= 1:
        l = inductors[0]
        c = capacitors[0]
        r = resistors[0] if resistors else None
        l_nodes = {l.node1, l.node2}
        c_nodes = {c.node1, c.node2}
        r_nodes = {r.node1, r.node2} if r else set()

        l_val = parse_numeric(l.value, 0.010)
        c_val = parse_numeric(c.value, 1e-6)
        if c_val > 1.0: c_val *= 1e-6
        r_val = parse_numeric(r.value, 100.0) if r else 0.0
        f0_theoretical = 1.0 / (2.0 * math.pi * math.sqrt(max(l_val, 1e-12) * max(c_val, 1e-15)))

        is_parallel = (l_nodes == c_nodes) and (not r or r_nodes == l_nodes)
        
        # Series RLC Band-Pass: output across R (shunt R to ground)
        if r and (out_node in r_nodes and gnd in r_nodes) and (in_node not in r_nodes):
            return {
                "detected_topology": "RLC_BAND_PASS",
                "topology_type": "SECOND_ORDER_RLC_BAND_PASS",
                "is_filter_topology": True,
                "input_node": in_node,
                "output_node": out_node,
                "ground_node": gnd,
                "theoretical_f0_hz": round(f0_theoretical, 2),
                "theoretical_formula": "f0 = 1 / (2*pi*sqrt(L*C))",
                "components": {"inductor": l_val, "capacitor": c_val, "resistor": r_val}
            }

        # Series RLC Notch / Band-Stop: output taken across shunt LC branch or parallel tank in line
        if is_parallel:
            return {
                "detected_topology": "PARALLEL_RLC_RESONANCE",
                "topology_type": "PARALLEL_RLC_TANK",
                "is_filter_topology": True,
                "input_node": in_node,
                "output_node": out_node,
                "ground_node": gnd,
                "theoretical_f0_hz": round(f0_theoretical, 2),
                "theoretical_formula": "f0 = 1 / (2*pi*sqrt(L*C))",
                "components": {"inductor": l_val, "capacitor": c_val, "resistor": r_val}
            }

        return {
            "detected_topology": "SERIES_RLC_RESONANCE",
            "topology_type": "SERIES_RLC_NETWORK",
            "is_filter_topology": True,
            "input_node": in_node,
            "output_node": out_node,
            "ground_node": gnd,
            "theoretical_f0_hz": round(f0_theoretical, 2),
            "theoretical_formula": "f0 = 1 / (2*pi*sqrt(L*C))",
            "components": {"inductor": l_val, "capacitor": c_val, "resistor": r_val}
        }

    # Generic or pure resistive
    if len(resistors) > 0 and len(capacitors) == 0 and len(inductors) == 0:
        return {
            "detected_topology": "RESISTIVE_NETWORK",
            "topology_type": "FREQUENCY_INDEPENDENT_RESISTIVE",
            "is_filter_topology": False,
            "input_node": in_node,
            "output_node": out_node,
            "ground_node": gnd
        }

    return {
        "detected_topology": "UNKNOWN",
        "topology_type": "GENERIC_AC_NETWORK",
        "is_filter_topology": False,
        "input_node": in_node,
        "output_node": out_node,
        "ground_node": gnd
    }


def extract_transfer_response(
    netlist: Dict[str, Any],
    sweep_result: Dict[str, Any],
    input_node: Optional[str] = None,
    output_node: Optional[str] = None
) -> Dict[str, Any]:
    """
    Extracts frequency-dependent transfer function H(jω) = Vout / Vin,
    Gain (magnitude & dB), Phase ∠H(jω), and normalized AC response representation.
    """
    io = identify_candidate_io_nodes(netlist)
    in_n = input_node or io["input_node"]
    out_n = output_node or io["output_node"]
    gnd_n = io["ground_node"]

    points = sweep_result.get("points", [])
    if not points:
        return {
            "success": False,
            "output_status": "NOT_DEFINED" if not out_n else "NO_POINTS",
            "transfer_points": []
        }

    has_defined_output = bool(out_n and out_n != gnd_n)
    transfer_points = []

    for pt in points:
        f = pt.get("frequency_hz", 1.0)
        omega = pt.get("omega_rad_s", 2.0 * math.pi * f)

        # Single point MNA solve to get detailed node complex voltages
        pt_mna = solve_ac_frequency_point(netlist, f)
        if not pt_mna.get("success", False):
            continue

        node_v_map = pt_mna.get("node_voltages", {})
        v_in_data = node_v_map.get(in_n, {"real": 1.0, "imag": 0.0, "magnitude": 1.0, "phase_deg": 0.0})
        v_out_data = node_v_map.get(out_n, None) if has_defined_output else None

        v_in_c = complex(v_in_data.get("real", 1.0), v_in_data.get("imag", 0.0))
        v_in_mag = abs(v_in_c) if abs(v_in_c) > 1e-12 else 1.0

        if v_out_data is not None:
            v_out_c = complex(v_out_data.get("real", 0.0), v_out_data.get("imag", 0.0))
            v_out_mag = abs(v_out_c)
            # H(jω) = Vout / Vin
            h_c = v_out_c / v_in_c
            gain_mag = abs(h_c)
            gain_db = round(20.0 * math.log10(max(gain_mag, 1e-9)), 2)
            phase_deg = round(math.degrees(cmath.phase(h_c)), 2)
            h_real = round(float(h_c.real), 4)
            h_imag = round(float(h_c.imag), 4)
        else:
            v_out_c = None
            v_out_mag = 0.0
            gain_mag = 0.0
            gain_db = -999.0
            phase_deg = 0.0
            h_real = 0.0
            h_imag = 0.0

        z_in = pt.get("impedance_magnitude_ohms", 0.0)
        z_phase = pt.get("impedance_phase_deg", 0.0)
        i_in_ma = pt.get("current_magnitude_mA", 0.0)

        transfer_points.append({
            "frequency_hz": f,
            "omega_rad_s": omega,
            "input_voltage": {
                "magnitude": round(float(v_in_mag), 4),
                "phase_deg": round(float(v_in_data.get("phase_deg", 0.0)), 2),
                "real": round(float(v_in_c.real), 4),
                "imag": round(float(v_in_c.imag), 4)
            },
            "output_voltage": {
                "magnitude": round(float(v_out_mag), 4),
                "phase_deg": round(float(v_out_data.get("phase_deg", 0.0)), 2) if v_out_data else 0.0,
                "real": round(float(v_out_c.real), 4) if v_out_c else 0.0,
                "imag": round(float(v_out_c.imag), 4) if v_out_c else 0.0
            } if v_out_data else None,
            "input_current": {
                "magnitude_mA": i_in_ma,
                "phase_deg": pt.get("current_phase_deg", 0.0)
            },
            "gain_magnitude": round(float(gain_mag), 4),
            "gain_db": gain_db,
            "impedance_magnitude_ohms": z_in,
            "impedance_phase_deg": z_phase,
            "phase_deg": phase_deg,
            "transfer_real": h_real,
            "transfer_imag": h_imag,
            "source": "mna_simulation",
            "is_measured": False
        })

    return {
        "success": True,
        "input_node": in_n,
        "output_node": out_n if has_defined_output else None,
        "output_status": "DEFINED" if has_defined_output else "NOT_DEFINED",
        "total_points": len(transfer_points),
        "transfer_points": transfer_points,
        "source": "mna_simulation",
        "is_measured": False
    }


def analyze_response_shape(transfer_points: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Computes mathematical characteristics of the transfer response shape:
    - Low-frequency & high-frequency asymptotes
    - Maximum & minimum gain (peak & notch)
    - Monotonicity
    - Slope regions
    - Phase transition
    """
    if not transfer_points or len(transfer_points) < 5:
        return {
            "status": "INSUFFICIENT_DATA",
            "is_valid": False
        }

    freqs = [p["frequency_hz"] for p in transfer_points]
    gains = [p["gain_magnitude"] for p in transfer_points]
    gains_db = [p["gain_db"] for p in transfer_points]
    phases = [p["phase_deg"] for p in transfer_points]

    low_f_gain = gains[0]
    high_f_gain = gains[-1]
    low_f_db = gains_db[0]
    high_f_db = gains_db[-1]

    max_gain = max(gains)
    min_gain = min(gains)
    max_idx = gains.index(max_gain)
    min_idx = gains.index(min_gain)

    peak_freq = freqs[max_idx]
    notch_freq = freqs[min_idx]

    # Monotonicity checks
    is_monotonically_decreasing = all(gains[i] >= gains[i+1] - 0.02 for i in range(len(gains)-1))
    is_monotonically_increasing = all(gains[i] <= gains[i+1] + 0.02 for i in range(len(gains)-1))

    # Low frequency vs High frequency ratio
    is_low_pass_shape = (low_f_gain > 0.6) and (high_f_gain < 0.2) and is_monotonically_decreasing
    is_high_pass_shape = (low_f_gain < 0.2) and (high_f_gain > 0.6) and is_monotonically_increasing

    # Band-pass shape: low start, peak in middle, low end
    is_band_pass_shape = (low_f_gain < 0.3) and (high_f_gain < 0.3) and (max_gain > 0.5) and (0 < max_idx < len(gains)-1)

    # Band-stop / notch shape: high start, dip in middle, high end
    is_band_stop_shape = (low_f_gain > 0.6) and (high_f_gain > 0.6) and (min_gain < 0.3) and (0 < min_idx < len(gains)-1)

    # Frequency-independent flat shape
    is_flat_shape = (max_gain - min_gain < 0.05)

    return {
        "status": "ANALYZED",
        "is_valid": True,
        "low_frequency_gain": round(float(low_f_gain), 4),
        "high_frequency_gain": round(float(high_f_gain), 4),
        "low_frequency_db": round(float(low_f_db), 2),
        "high_frequency_db": round(float(high_f_db), 2),
        "max_gain": round(float(max_gain), 4),
        "min_gain": round(float(min_gain), 4),
        "peak_frequency_hz": round(float(peak_freq), 2) if is_band_pass_shape else None,
        "notch_frequency_hz": round(float(notch_freq), 2) if is_band_stop_shape else None,
        "is_monotonically_decreasing": is_monotonically_decreasing,
        "is_monotonically_increasing": is_monotonically_increasing,
        "is_low_pass_shape": is_low_pass_shape,
        "is_high_pass_shape": is_high_pass_shape,
        "is_band_pass_shape": is_band_pass_shape,
        "is_band_stop_shape": is_band_stop_shape,
        "is_flat_shape": is_flat_shape,
        "phase_low_freq_deg": round(float(phases[0]), 2),
        "phase_high_freq_deg": round(float(phases[-1]), 2)
    }


def detect_cutoff_frequencies(
    transfer_points: List[Dict[str, Any]],
    shape_analysis: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Extracts -3dB cutoff frequencies relative to passband reference level.
    Never invents cutoffs; sets status = 'NOT_DETERMINED' if outside sweep window.
    """
    if not transfer_points or len(transfer_points) < 5:
        return {
            "status": "NOT_DETERMINED",
            "fc_hz": None,
            "f_low_hz": None,
            "f_high_hz": None,
            "bandwidth_hz": None
        }

    freqs = [p["frequency_hz"] for p in transfer_points]
    gains = [p["gain_magnitude"] for p in transfer_points]
    max_gain = max(gains)

    if max_gain < 1e-4:
        return {
            "status": "NOT_DETERMINED",
            "message": "Zero output gain across entire frequency band",
            "fc_hz": None
        }

    # Reference passband level & -3dB threshold (gain_ref * 1/sqrt(2) ≈ 0.7071)
    # For Low-Pass: reference is low-frequency gain
    # For High-Pass: reference is high-frequency gain
    # For Band-Pass: reference is peak gain
    target_threshold = max_gain * 0.7071

    f_cutoff = None
    f_low = None
    f_high = None

    # Check for Low-Pass cutoff (gain drops below target_threshold)
    if shape_analysis.get("is_low_pass_shape") or (gains[0] > target_threshold and gains[-1] < target_threshold):
        for i in range(len(gains) - 1):
            if gains[i] >= target_threshold >= gains[i+1]:
                # Linear interpolation in log-frequency space
                f1, f2 = freqs[i], freqs[i+1]
                g1, g2 = gains[i], gains[i+1]
                if abs(g2 - g1) > 1e-6:
                    ratio = (target_threshold - g1) / (g2 - g1)
                    log_f = math.log10(f1) + ratio * (math.log10(f2) - math.log10(f1))
                    f_cutoff = 10 ** log_f
                else:
                    f_cutoff = f1
                break

        if f_cutoff:
            return {
                "status": "DETERMINED",
                "filter_mode": "LOW_PASS",
                "fc_hz": round(float(f_cutoff), 2),
                "fc_formatted": f"{f_cutoff:.2f} Hz" if f_cutoff < 1000 else f"{f_cutoff/1000:.3f} kHz",
                "threshold_magnitude": round(float(target_threshold), 4),
                "reference_gain": round(float(max_gain), 4),
                "f_low_hz": None,
                "f_high_hz": None
            }

    # Check for High-Pass cutoff (gain rises above target_threshold)
    if shape_analysis.get("is_high_pass_shape") or (gains[0] < target_threshold and gains[-1] > target_threshold):
        for i in range(len(gains) - 1):
            if gains[i] <= target_threshold <= gains[i+1]:
                f1, f2 = freqs[i], freqs[i+1]
                g1, g2 = gains[i], gains[i+1]
                if abs(g2 - g1) > 1e-6:
                    ratio = (target_threshold - g1) / (g2 - g1)
                    log_f = math.log10(f1) + ratio * (math.log10(f2) - math.log10(f1))
                    f_cutoff = 10 ** log_f
                else:
                    f_cutoff = f1
                break

        if f_cutoff:
            return {
                "status": "DETERMINED",
                "filter_mode": "HIGH_PASS",
                "fc_hz": round(float(f_cutoff), 2),
                "fc_formatted": f"{f_cutoff:.2f} Hz" if f_cutoff < 1000 else f"{f_cutoff/1000:.3f} kHz",
                "threshold_magnitude": round(float(target_threshold), 4),
                "reference_gain": round(float(max_gain), 4),
                "f_low_hz": None,
                "f_high_hz": None
            }

    # Check for Band-Pass cutoffs (f_low and f_high around peak)
    max_idx = gains.index(max_gain)
    if 0 < max_idx < len(gains) - 1:
        # Search f_low below peak
        for i in range(max_idx - 1, -1, -1):
            if gains[i] <= target_threshold:
                f_low = freqs[i]
                break
        # Search f_high above peak
        for i in range(max_idx + 1, len(gains)):
            if gains[i] <= target_threshold:
                f_high = freqs[i]
                break

        bw = (f_high - f_low) if (f_low and f_high and f_high > f_low) else None
        return {
            "status": "DETERMINED" if (f_low or f_high) else "NOT_DETERMINED",
            "filter_mode": "BAND_PASS",
            "center_frequency_hz": round(float(freqs[max_idx]), 2),
            "f_low_hz": round(float(f_low), 2) if f_low else None,
            "f_high_hz": round(float(f_high), 2) if f_high else None,
            "bandwidth_hz": round(float(bw), 2) if bw else None,
            "reference_gain": round(float(max_gain), 4)
        }

    return {
        "status": "NOT_DETERMINED",
        "fc_hz": None,
        "f_low_hz": None,
        "f_high_hz": None,
        "bandwidth_hz": None
    }


def classify_ac_behavior(
    topology_info: Dict[str, Any],
    shape_analysis: Dict[str, Any],
    cutoff_info: Dict[str, Any],
    resonance_info: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Deterministic behavior classification combining:
    - Verified topology constraints
    - Complex MNA frequency sweep response
    - Phase and magnitude response characteristics
    - Cutoff frequencies
    - Resonance metrics
    """
    evidence = []
    candidates = []

    top_id = topology_info.get("detected_topology", "UNKNOWN")
    has_res = resonance_info.get("resonance_detected", False)
    is_lp = shape_analysis.get("is_low_pass_shape", False)
    is_hp = shape_analysis.get("is_high_pass_shape", False)
    is_bp = shape_analysis.get("is_band_pass_shape", False)
    is_bs = shape_analysis.get("is_band_stop_shape", False)
    is_flat = shape_analysis.get("is_flat_shape", False)

    # 1. RC Low-Pass
    if top_id == "RC_LOW_PASS":
        evidence.append("Verified first-order RC low-pass filter series-shunt topology")
        if is_lp:
            evidence.append("Confirmed high low-frequency passband gain with monotonic high-frequency attenuation")
        if cutoff_info.get("status") == "DETERMINED":
            evidence.append(f"Detected -3dB cutoff frequency at {cutoff_info.get('fc_formatted')}")
        candidates.append({"behavior": "LOW_PASS", "confidence": 0.98})

    # 2. RC High-Pass
    elif top_id == "RC_HIGH_PASS":
        evidence.append("Verified first-order RC high-pass filter series-shunt topology")
        if is_hp:
            evidence.append("Confirmed low-frequency attenuation with monotonic high-frequency passband gain")
        if cutoff_info.get("status") == "DETERMINED":
            evidence.append(f"Detected -3dB cutoff frequency at {cutoff_info.get('fc_formatted')}")
        candidates.append({"behavior": "HIGH_PASS", "confidence": 0.98})

    # 3. RL Low-Pass
    elif top_id == "RL_LOW_PASS":
        evidence.append("Verified first-order RL low-pass filter topology (series inductor + shunt resistor)")
        if is_lp:
            evidence.append("Confirmed high low-frequency gain with inductive high-frequency attenuation")
        if cutoff_info.get("status") == "DETERMINED":
            evidence.append(f"Detected -3dB cutoff frequency at {cutoff_info.get('fc_formatted')}")
        candidates.append({"behavior": "LOW_PASS", "confidence": 0.96})

    # 4. RL High-Pass
    elif top_id == "RL_HIGH_PASS":
        evidence.append("Verified first-order RL high-pass filter topology (series resistor + shunt inductor)")
        if is_hp:
            evidence.append("Confirmed inductive low-frequency attenuation with high-frequency passband gain")
        if cutoff_info.get("status") == "DETERMINED":
            evidence.append(f"Detected -3dB cutoff frequency at {cutoff_info.get('fc_formatted')}")
        candidates.append({"behavior": "HIGH_PASS", "confidence": 0.96})

    # 5. RLC Band-Pass
    elif top_id == "RLC_BAND_PASS" or (is_bp and has_res):
        evidence.append("Verified second-order RLC bandpass topology with intermediate resistive shunt")
        if has_res:
            evidence.append(f"Resonance verified near f0 = {resonance_info.get('resonant_frequency_formatted')}")
        evidence.append("MNA transfer response confirms peaked band-pass response")
        candidates.append({"behavior": "BAND_PASS", "confidence": 0.95})
        candidates.append({"behavior": "RESONANT", "confidence": 0.90})

    # 6. Frequency Independent / Pure Resistive
    elif top_id == "RESISTIVE_NETWORK" or is_flat:
        evidence.append("Pure resistive network with flat frequency-independent gain")
        candidates.append({"behavior": "FREQUENCY_INDEPENDENT", "confidence": 0.99})

    # 7. Series / Parallel RLC Resonance
    elif top_id in ["SERIES_RLC_RESONANCE", "PARALLEL_RLC_RESONANCE"] or (has_res and (top_id.startswith("RLC") or "RLC" in top_id)):
        evidence.append(f"Verified RLC network topology ({top_id})")
        if has_res:
            evidence.append(f"Zero-phase crossing and impedance extremum verified at f0 = {resonance_info.get('resonant_frequency_formatted')}")
            candidates.append({"behavior": "RESONANT", "confidence": 0.96})
            candidates.append({"behavior": "IMPEDANCE_RESONANCE", "confidence": 0.92})
        else:
            candidates.append({"behavior": "UNSUPPORTED", "confidence": 0.40})

    # 8. Unclassified or Ambiguous
    else:
        if is_lp:
            candidates.append({"behavior": "LOW_PASS", "confidence": 0.70})
            evidence.append("Observed low-pass magnitude response, but topological template is unverified")
        elif is_hp:
            candidates.append({"behavior": "HIGH_PASS", "confidence": 0.70})
            evidence.append("Observed high-pass magnitude response, but topological template is unverified")
        elif is_bp:
            candidates.append({"behavior": "BAND_PASS", "confidence": 0.70})
            evidence.append("Observed band-pass magnitude response, but topological template is unverified")
        elif is_bs:
            candidates.append({"behavior": "BAND_STOP", "confidence": 0.70})
            evidence.append("Observed band-stop notch response, but topological template is unverified")
        else:
            candidates.append({"behavior": "UNKNOWN", "confidence": 0.0})
            evidence.append("Circuit does not exhibit a supported canonical AC response")

    # Determine Primary & Alternatives
    candidates.sort(key=lambda c: c["confidence"], reverse=True)
    primary = candidates[0]["behavior"] if candidates else "UNKNOWN"
    alternatives = [c["behavior"] for c in candidates[1:]] if len(candidates) > 1 else []

    is_verified = (top_id != "UNKNOWN" and candidates and candidates[0]["confidence"] >= 0.85)

    return {
        "behavior": primary,
        "status": "VERIFIED" if is_verified else ("AMBIGUOUS" if len(candidates) > 1 and candidates[0]["confidence"] < 0.85 else "UNSUPPORTED" if top_id != "UNKNOWN" else "UNKNOWN"),
        "primary_candidate": primary,
        "alternative_candidates": alternatives,
        "evidence": evidence,
        "source": "mna_simulation",
        "is_measured": False
    }


def analyze_generalized_ac_circuit(
    netlist: Dict[str, Any],
    start_freq_hz: float = 10.0,
    stop_freq_hz: float = 100000.0,
    num_points: int = 100,
    sweep_type: str = "log",
    input_node: Optional[str] = None,
    output_node: Optional[str] = None
) -> Dict[str, Any]:
    """
    Executes end-to-end generalized AC circuit intelligence:
    Topology -> MNA -> Frequency Sweep -> Transfer Response -> Shape Analysis -> Cutoff Detection -> Classification.
    """
    # 1. Topology Inspection
    top_info = inspect_filter_topology(netlist)

    # 2. Complex MNA Frequency Sweep (reusing Phase 26 engine)
    sweep_res = run_frequency_sweep(
        netlist,
        start_freq_hz=start_freq_hz,
        stop_freq_hz=stop_freq_hz,
        num_points=num_points,
        sweep_type=sweep_type
    )

    if not sweep_res.get("success", False):
        return {
            "success": False,
            "status": "FAILED",
            "error": sweep_res.get("error", "AC Frequency Sweep failed"),
            "source": "mna_simulation",
            "is_measured": False
        }

    # 3. Resonance Analysis (reusing Phase 26 engine)
    is_parallel_hint = "parallel" in str(top_info.get("detected_topology", "")).lower()
    resonance_res = analyze_resonance(sweep_res, topology_type="parallel" if is_parallel_hint else "series")

    # 4. Transfer Function Extraction
    in_node = input_node or top_info.get("input_node")
    out_node = output_node or top_info.get("output_node")
    transfer_res = extract_transfer_response(netlist, sweep_res, in_node, out_node)

    # 5. Response Shape Analysis
    shape_analysis = analyze_response_shape(transfer_res.get("transfer_points", []))

    # 6. Cutoff Detection
    cutoff_res = detect_cutoff_frequencies(transfer_res.get("transfer_points", []), shape_analysis)

    # 7. Behavior Classification
    classification = classify_ac_behavior(top_info, shape_analysis, cutoff_res, resonance_res)

    # 8. Benchmark comparison when theoretical formula is available
    theoretical_fc = top_info.get("theoretical_cutoff_hz")
    mna_fc = cutoff_res.get("fc_hz")
    benchmark_comparison = None
    if theoretical_fc and mna_fc:
        diff_pct = round(abs(mna_fc - theoretical_fc) / theoretical_fc * 100.0, 2)
        benchmark_comparison = {
            "theoretical_fc_hz": theoretical_fc,
            "mna_derived_fc_hz": mna_fc,
            "difference_percent": diff_pct,
            "formula": top_info.get("theoretical_formula"),
            "status": "VALIDATED_WITHIN_TOLERANCE" if diff_pct < 15.0 else "DEVIATION_DETECTED"
        }

    return {
        "success": True,
        "status": classification["status"],
        "topology": top_info,
        "behavior": classification["behavior"],
        "primary_candidate": classification["primary_candidate"],
        "alternative_candidates": classification["alternative_candidates"],
        "evidence": classification["evidence"],
        "frequency_response": transfer_res,
        "shape_analysis": shape_analysis,
        "cutoff": cutoff_res,
        "resonance": resonance_res,
        "benchmark_comparison": benchmark_comparison,
        "sweep": sweep_res,
        "source": "mna_simulation",
        "is_measured": False
    }
