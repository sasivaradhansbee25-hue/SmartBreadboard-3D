"""
backend/validation/metrics.py — Statistical, Topological & Electrical Error Metrics (Phase 23)

Implements rigorous mathematical formulas for:
1. Component Detection (TP, FP, FN, Precision, Recall)
2. Terminal & Hole Mapping Accuracy
3. Netlist & Graph Topology Comparison
4. Electrical Measurement Errors (Absolute, Percentage, Zero-Division Safety, Tolerance Bounds)
"""

import math
from typing import Dict, Any, List, Optional, Tuple, Union
from .schema import ToleranceSpec


def calculate_detection_metrics(
    ground_truth_components: List[Dict[str, Any]],
    detected_components: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Calculates True Positives (TP), False Positives (FP), False Negatives (FN), Precision, and Recall.
    
    A detected component is considered a True Positive if its component type matches
    an expected ground truth component.
    """
    gt_pool = [dict(c) for c in ground_truth_components]
    det_pool = [dict(d) for d in detected_components]

    if not gt_pool and not det_pool:
        return {
            "tp": 0,
            "fp": 0,
            "fn": 0,
            "precision": "INSUFFICIENT_DATA",
            "recall": "INSUFFICIENT_DATA"
        }

    tp = 0
    fp = 0
    matched_gt_indices = set()

    for det in det_pool:
        det_type = str(det.get("type", "")).lower()
        matched = False
        for idx, gt in enumerate(gt_pool):
            if idx in matched_gt_indices:
                continue
            gt_type = str(gt.get("type", "")).lower()
            if det_type == gt_type:
                tp += 1
                matched_gt_indices.add(idx)
                matched = True
                break
        if not matched:
            fp += 1

    fn = len(gt_pool) - len(matched_gt_indices)

    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0

    return {
        "tp": tp,
        "fp": fp,
        "fn": fn,
        "precision": round(precision, 4),
        "recall": round(recall, 4)
    }


def calculate_mapping_metrics(
    ground_truth_terminals: Dict[str, Tuple[str, str]],
    detected_terminals: Dict[str, Tuple[str, str]]
) -> Dict[str, Any]:
    """
    Calculates hole and terminal assignment accuracy.
    
    ground_truth_terminals: {"R1": ("E10", "E15"), "LED1": ("E15", "E20")}
    detected_terminals: {"R1": ("E10", "E15"), "LED1": ("E15", "E20")}
    """
    if not ground_truth_terminals:
        return {
            "terminal_accuracy": "INSUFFICIENT_DATA",
            "hole_accuracy": "INSUFFICIENT_DATA",
            "total_terminals": 0,
            "correct_terminals": 0
        }

    total_holes = len(ground_truth_terminals) * 2
    correct_holes = 0
    correct_components = 0

    for cid, (gt_h1, gt_h2) in ground_truth_terminals.items():
        det = detected_terminals.get(cid)
        if not det:
            continue
        det_h1, det_h2 = det
        
        # Check matching hole set (order-independent for 2-terminal passive components)
        gt_set = {str(gt_h1).upper(), str(gt_h2).upper()}
        det_set = {str(det_h1).upper(), str(det_h2).upper()}
        
        # Count individual hole matches
        h_matches = len(gt_set.intersection(det_set))
        correct_holes += h_matches
        
        if gt_set == det_set:
            correct_components += 1

    terminal_acc = correct_components / len(ground_truth_terminals) if ground_truth_terminals else 0.0
    hole_acc = correct_holes / total_holes if total_holes > 0 else 0.0

    return {
        "terminal_accuracy": round(terminal_acc, 4),
        "hole_accuracy": round(hole_acc, 4),
        "total_terminals": total_holes,
        "correct_terminals": correct_holes
    }


def compare_netlists(
    ground_truth_netlist: Dict[str, List[str]],
    software_netlist: Dict[str, List[str]]
) -> Dict[str, Any]:
    """
    Compares expected physical electrical nodes vs software generated netlist.
    
    Example node map:
    ground_truth: {"NODE_1": ["R1.A", "VCC"], "NODE_2": ["R1.B", "LED1.A"], "NODE_GND": ["LED1.B", "GND"]}
    software: {"NODE_1": ["R1.A", "VCC"], "NODE_2": ["R1.B", "LED1.A"], "NODE_GND": ["LED1.B", "GND"]}
    """
    if not ground_truth_netlist or not software_netlist:
        return {
            "match": False,
            "discrepancies": ["Missing netlist data on physical or software tier"]
        }

    discrepancies = []

    # Check that each expected connection exists
    gt_pairs = set()
    for nid, pins in ground_truth_netlist.items():
        sorted_pins = sorted(pins)
        for i in range(len(sorted_pins)):
            for j in range(i + 1, len(sorted_pins)):
                gt_pairs.add((sorted_pins[i], sorted_pins[j]))

    sw_pairs = set()
    for nid, pins in software_netlist.items():
        sorted_pins = sorted(pins)
        for i in range(len(sorted_pins)):
            for j in range(i + 1, len(sorted_pins)):
                sw_pairs.add((sorted_pins[i], sorted_pins[j]))

    missing = gt_pairs - sw_pairs
    extra = sw_pairs - gt_pairs

    for m in missing:
        discrepancies.append(f"Missing electrical connection between {m[0]} and {m[1]}")
    for e in extra:
        discrepancies.append(f"Unexpected electrical connection between {e[0]} and {e[1]}")

    return {
        "match": len(discrepancies) == 0,
        "discrepancies": discrepancies,
        "missing_connections": list(missing),
        "extra_connections": list(extra)
    }


def calculate_electrical_error(
    measured: Optional[float],
    predicted: Optional[float],
    tolerance_percent: float = 5.0,
    tolerance_spec: Optional[ToleranceSpec] = None
) -> Dict[str, Any]:
    """
    Calculates absolute error, percentage error (with zero-division protection), and tolerance compliance.
    
    Formula:
    absolute_error = abs(measured - predicted)
    percentage_error = abs(measured - predicted) / abs(predicted) * 100  (or NOT_APPLICABLE if predicted == 0)
    """
    if measured is None or predicted is None:
        return {
            "absolute_error": None,
            "percentage_error": "NOT_APPLICABLE",
            "within_tolerance": False,
            "notes": ["Measurement or prediction unavailable"]
        }

    abs_err = abs(measured - predicted)
    
    # Division by zero safety
    if abs(predicted) < 1e-9:
        pct_err: Union[float, str] = "NOT_APPLICABLE"
        # If both measured and predicted are near zero, consider it within tolerance
        within_tol = abs_err < 0.05
    else:
        pct_err_val = (abs_err / abs(predicted)) * 100.0
        pct_err = round(pct_err_val, 3)
        within_tol = pct_err_val <= tolerance_percent

    notes = []
    if not within_tol:
        notes.append(f"Discrepancy exceeds {tolerance_percent}% allowable limit")
    else:
        notes.append(f"Within allowable tolerance envelope ({tolerance_percent}%)")

    return {
        "absolute_error": round(abs_err, 4),
        "percentage_error": pct_err,
        "within_tolerance": within_tol,
        "notes": notes
    }
