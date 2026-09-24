"""
SmartBreadboard 3D — AC Frequency Sweep Engine (Phase 26)
Executes linear or logarithmic frequency sweeps across complex MNA solver:
Generates frequency responses, Bode magnitude/phase points, impedance spectra, and branch currents.
"""

import math
import numpy as np
from typing import Dict, Any, List, Optional
from .complex_mna import solve_ac_frequency_point


def run_frequency_sweep(
    netlist: Dict[str, Any],
    start_freq_hz: float = 10.0,
    stop_freq_hz: float = 100000.0,
    num_points: int = 100,
    sweep_type: str = "log"
) -> Dict[str, Any]:
    """
    Executes a frequency sweep across the requested band.
    Returns structured spectrum datasets including Bode plots, impedance, and current responses.
    """
    # Validation & Guards
    start_f = max(0.1, float(start_freq_hz))
    stop_f = max(start_f * 1.05, float(stop_freq_hz))
    n_pts = min(max(10, int(num_points)), 500)

    # Generate Frequency Points
    if str(sweep_type).lower() == "log":
        frequencies = np.logspace(math.log10(start_f), math.log10(stop_f), n_pts)
    else:
        frequencies = np.linspace(start_f, stop_f, n_pts)

    sweep_points = []
    failed_points = 0

    for f in frequencies:
        pt_res = solve_ac_frequency_point(netlist, float(f))
        if not pt_res.get("success", False):
            failed_points += 1
            continue

        z_in = pt_res.get("input_impedance") or {}
        i_src = pt_res.get("source_current") or {}

        # First active node voltage for transfer response
        node_v_map = pt_res.get("node_voltages", {})
        non_gnd_nodes = [nid for nid, nv in node_v_map.items() if nv.get("magnitude", 0) > 0]
        primary_node_v = node_v_map[non_gnd_nodes[0]] if non_gnd_nodes else {"magnitude": 1.0, "phase_deg": 0.0}

        mag_v = primary_node_v.get("magnitude", 1.0)
        mag_db = round(20.0 * math.log10(max(mag_v, 1e-9)), 2)

        sweep_points.append({
            "frequency_hz": round(float(f), 2),
            "omega_rad_s": round(float(2.0 * math.pi * f), 2),
            "magnitude_v": round(float(mag_v), 4),
            "magnitude_db": mag_db,
            "phase_deg": round(float(primary_node_v.get("phase_deg", 0.0)), 2),
            "impedance_magnitude_ohms": z_in.get("magnitude_ohms", 0.0),
            "impedance_phase_deg": z_in.get("phase_deg", 0.0),
            "reactance_ohms": z_in.get("imag_reactance_ohms", 0.0),
            "current_magnitude_mA": i_src.get("magnitude_mA", 0.0),
            "current_phase_deg": i_src.get("phase_deg", 0.0)
        })

    if not sweep_points:
        return {
            "success": False,
            "error": "All frequency sweep points failed to solve.",
            "points": []
        }

    return {
        "success": True,
        "sweep_type": sweep_type,
        "start_frequency_hz": start_f,
        "stop_frequency_hz": stop_f,
        "total_points": len(sweep_points),
        "failed_points": failed_points,
        "points": sweep_points,
        "source": "mna_simulation",
        "is_measured": False
    }
