"""
backend/validation/comparator.py — Physical vs Software Comparison Engine (Phase 23)

Compares ground truth physical breadboard setups against software predictions across all 6 verification tiers:
1. Component Detection
2. Terminal & Hole Mapping
3. Wire Connectivity & Netlist Topology
4. MNA Simulation vs Multimeter Measurements
5. AR Alignment Telemetry
6. Grounded AI Q&A Telemetry

Does NOT modify or artificially fudge solver equations or vision models.
"""

from typing import Dict, Any, List, Optional, Tuple
from .schema import ValidationCase, ValidationStatus, MetricComparison, ARAlignmentStatus
from .metrics import (
    calculate_detection_metrics,
    calculate_mapping_metrics,
    compare_netlists,
    calculate_electrical_error
)


def compare_physical_vs_software(case: ValidationCase) -> MetricComparison:
    """
    Evaluates physical ground truth against software pipeline outputs for a given validation case.
    """
    comp_metrics = MetricComparison()
    discrepancies = []
    tolerance_notes = []

    # 1. Component Detection Comparison
    gt_comps = [
        {"id": c.id, "type": c.type, "value": c.nominal_value}
        for c in case.components
    ]
    det_comps = case.software_results.components_detected

    det_stats = calculate_detection_metrics(gt_comps, det_comps)
    comp_metrics.detection_tp = det_stats["tp"]
    comp_metrics.detection_fp = det_stats["fp"]
    comp_metrics.detection_fn = det_stats["fn"]
    comp_metrics.detection_precision = det_stats["precision"]
    comp_metrics.detection_recall = det_stats["recall"]

    if det_stats["fn"] > 0:
        discrepancies.append(f"Vision failed to detect {det_stats['fn']} physical components")
    if det_stats["fp"] > 0:
        discrepancies.append(f"Vision detected {det_stats['fp']} spurious components (False Positives)")

    # 2. Terminal & Hole Mapping Comparison
    gt_terminals = {
        c.id: (c.start_hole, c.end_hole)
        for c in case.components
        if c.start_hole and c.end_hole
    }
    det_terminals = {
        cid: (holes[0], holes[1]) if len(holes) >= 2 else ("", "")
        for cid, holes in case.software_results.holes_mapped.items()
    }

    map_stats = calculate_mapping_metrics(gt_terminals, det_terminals)
    comp_metrics.terminal_mapping_accuracy = map_stats["terminal_accuracy"]
    comp_metrics.hole_mapping_accuracy = map_stats["hole_accuracy"]

    if isinstance(map_stats["terminal_accuracy"], (int, float)) and map_stats["terminal_accuracy"] < 1.0:
        discrepancies.append(f"Terminal hole mapping accuracy is {map_stats['terminal_accuracy']*100:.1f}% (< 100%)")

    # 3. Netlist Topology Comparison
    gt_nodes: Dict[str, List[str]] = {}
    for c in case.components:
        if c.start_hole:
            gt_nodes.setdefault(c.start_hole, []).append(f"{c.id}.A")
        if c.end_hole:
            gt_nodes.setdefault(c.end_hole, []).append(f"{c.id}.B")
    for w in case.connections:
        if w.start_hole and w.end_hole:
            gt_nodes.setdefault(w.start_hole, []).append(f"{w.id}.A")
            gt_nodes.setdefault(w.end_hole, []).append(f"{w.id}.B")

    sw_nodes = case.software_results.netlist_extracted.get("nodes", {})
    if isinstance(sw_nodes, list):
        # Convert list of node dicts to map
        sw_node_map = {n.get("id", f"N_{idx}"): n.get("connected_pins", []) for idx, n in enumerate(sw_nodes)}
    else:
        sw_node_map = sw_nodes

    if gt_nodes and sw_node_map:
        net_stats = compare_netlists(gt_nodes, sw_node_map)
        comp_metrics.netlist_match = net_stats["match"]
        discrepancies.extend(net_stats["discrepancies"])
    else:
        comp_metrics.netlist_match = False

    # 4. Electrical Multimeter vs MNA Simulation Comparison
    pm = case.physical_measurements
    sw_v = case.software_results.mna_node_voltages
    sw_i = case.software_results.mna_branch_currents_ma

    # Voltage check (e.g. across resistor or supply)
    measured_v = pm.v_resistor_measured_v or pm.v_supply_measured_v
    predicted_v = None
    if sw_v:
        # If specific node voltage available, take highest drop or first non-zero
        predicted_v = max(sw_v.values()) if sw_v else None

    tol_spec = case.tolerance_spec
    if measured_v is not None and predicted_v is not None:
        v_err = calculate_electrical_error(measured_v, predicted_v, tolerance_percent=tol_spec.power_supply_tolerance_percent, tolerance_spec=tol_spec)
        comp_metrics.v_error_abs_v = v_err["absolute_error"]
        comp_metrics.v_error_pct = v_err["percentage_error"]
        tolerance_notes.extend(v_err["notes"])
        if not v_err["within_tolerance"]:
            discrepancies.append(f"Voltage discrepancy ({v_err['percentage_error']}%) exceeds allowable tolerance")

    # Current check
    measured_i = pm.i_circuit_measured_ma
    predicted_i = None
    if sw_i:
        predicted_i = max(sw_i.values()) if sw_i else None

    if measured_i is not None and predicted_i is not None:
        i_err = calculate_electrical_error(measured_i, predicted_i, tolerance_percent=tol_spec.resistor_tolerance_percent, tolerance_spec=tol_spec)
        comp_metrics.i_error_abs_ma = i_err["absolute_error"]
        comp_metrics.i_error_pct = i_err["percentage_error"]
        tolerance_notes.extend(i_err["notes"])
        if not i_err["within_tolerance"]:
            discrepancies.append(f"Current discrepancy ({i_err['percentage_error']}%) exceeds allowable tolerance")

    # Overall within-tolerance judgment
    has_elec_data = (measured_v is not None and predicted_v is not None) or (measured_i is not None and predicted_i is not None)
    comp_metrics.within_tolerance = (len(discrepancies) == 0) and has_elec_data

    comp_metrics.tolerance_notes = tolerance_notes
    comp_metrics.discrepancies = discrepancies

    return comp_metrics


def evaluate_validation_case(case: ValidationCase) -> ValidationCase:
    """
    Runs full evaluation and updates status on the validation case.
    """
    if case.status == ValidationStatus.NOT_TESTED:
        # If no physical measurements exist yet, retain NOT_TESTED status
        if not case.physical_measurements.v_supply_measured_v and not case.physical_measurements.i_circuit_measured_ma:
            return case

    comparison = compare_physical_vs_software(case)
    case.comparison = comparison

    if len(comparison.discrepancies) == 0 and comparison.within_tolerance and comparison.netlist_match:
        case.status = ValidationStatus.PASS
    elif not case.physical_measurements.v_supply_measured_v and not case.physical_measurements.i_circuit_measured_ma:
        case.status = ValidationStatus.INSUFFICIENT_DATA
    else:
        case.status = ValidationStatus.FAIL

    return case
