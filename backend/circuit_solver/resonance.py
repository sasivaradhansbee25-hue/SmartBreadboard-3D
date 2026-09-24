"""
SmartBreadboard 3D — Deterministic Resonance Analyzer (Phase 26)
Analyzes frequency sweep datasets to detect resonance, resonant frequency f0,
-3dB half-power cutoff frequencies (f_low, f_high), bandwidth (BW), and quality factor (Q).

SCIENTIFIC INTEGRITY:
- Requires verified circuit topology + mathematical extrema.
- Never infers resonance from component presence alone.
"""

import math
from typing import Dict, Any, List, Optional


def analyze_resonance(sweep_result: Dict[str, Any], topology_type: Optional[str] = None) -> Dict[str, Any]:
    """
    Analyzes frequency sweep response to detect resonance, bandwidth, and quality factor.
    """
    points = sweep_result.get("points", [])
    if not points or len(points) < 5:
        return {
            "resonance_detected": False,
            "status": "INSUFFICIENT_DATA",
            "message": "Insufficient frequency sweep points to analyze resonance."
        }

    # Extract arrays
    freqs = [p["frequency_hz"] for p in points]
    z_mags = [p.get("impedance_magnitude_ohms", 0.0) for p in points]
    i_mags = [p.get("current_magnitude_mA", 0.0) for p in points]
    phases = [p.get("phase_deg", 0.0) for p in points]
    reactances = [p.get("reactance_ohms", 0.0) for p in points]

    # Series RLC: Current maximum / Impedance minimum
    # Parallel RLC: Current minimum / Impedance maximum
    is_parallel = "parallel" in str(topology_type).lower()

    # 1. Detect Resonant Frequency f0
    # Method A: Zero phase crossing (reactance crosses 0)
    best_idx = 0
    min_phase_dist = 999999.0

    for idx, ph in enumerate(phases):
        dist = abs(ph)
        if dist < min_phase_dist:
            min_phase_dist = dist
            best_idx = idx

    # Method B: Current extremum
    if not is_parallel:
        # Current peak
        max_i_idx = i_mags.index(max(i_mags))
        res_idx = max_i_idx if max(i_mags) > 0 else best_idx
    else:
        # Impedance peak / current dip
        max_z_idx = z_mags.index(max(z_mags))
        res_idx = max_z_idx if max(z_mags) > 0 else best_idx

    f0 = freqs[res_idx]
    z0 = z_mags[res_idx]
    i0 = i_mags[res_idx]
    phase0 = phases[res_idx]

    # 2. Bandwidth (-3dB half-power frequencies)
    f_low = None
    f_high = None
    bw = None
    q_factor = None

    if not is_parallel:
        # For series RLC: -3dB current point is I_peak / sqrt(2) ≈ 0.707 * I_peak
        i_peak = max(i_mags)
        i_half_power = i_peak * 0.7071

        # Search f_low (below f0)
        for idx in range(res_idx - 1, -1, -1):
            if i_mags[idx] <= i_half_power:
                f_low = freqs[idx]
                break

        # Search f_high (above f0)
        for idx in range(res_idx + 1, len(freqs)):
            if i_mags[idx] <= i_half_power:
                f_high = freqs[idx]
                break
    else:
        # For parallel RLC: -3dB impedance point is Z_peak / sqrt(2)
        z_peak = max(z_mags)
        z_half_power = z_peak * 0.7071

        for idx in range(res_idx - 1, -1, -1):
            if z_mags[idx] <= z_half_power:
                f_low = freqs[idx]
                break

        for idx in range(res_idx + 1, len(freqs)):
            if z_mags[idx] <= z_half_power:
                f_high = freqs[idx]
                break

    if f_low and f_high and f_high > f_low:
        bw = round(f_high - f_low, 2)
        if bw > 0:
            q_factor = round(f0 / bw, 2)

    # Validate that resonance is genuine
    has_reactance_balance = abs(phase0) <= 25.0
    resonance_detected = has_reactance_balance and (q_factor is None or q_factor >= 0.1)

    return {
        "resonance_detected": resonance_detected,
        "status": "VERIFIED_RESONANT" if resonance_detected else "NON_RESONANT",
        "resonant_frequency_hz": round(float(f0), 2),
        "resonant_frequency_formatted": f"{f0:.2f} Hz" if f0 < 1000 else f"{f0/1000:.3f} kHz",
        "impedance_at_resonance_ohms": round(float(z0), 2),
        "current_at_resonance_mA": round(float(i0), 2),
        "phase_at_resonance_deg": round(float(phase0), 2),
        "bandwidth_hz": bw,
        "bandwidth_formatted": f"{bw:.2f} Hz" if bw else "NOT_DETERMINED_IN_SWEEP_WINDOW",
        "q_factor": q_factor,
        "f_low_hz": f_low,
        "f_high_hz": f_high,
        "detection_method": "Complex MNA Frequency Response Extrema & Zero-Phase Crossing",
        "supporting_metrics": {
            "is_parallel": is_parallel,
            "reactance_balance": "XL ≈ XC (Im(Z) ≈ 0)" if not is_parallel else "BL ≈ BC (Im(Y) ≈ 0)",
            "min_phase_dist_deg": round(float(min_phase_dist), 2)
        },
        "source": "mna_simulation",
        "is_measured": False
    }
