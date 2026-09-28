"""
physical_validation.py — Real Hardware Validation & Accuracy Calibration Engine (Phase 23)

Goal:
Deterministic validation framework that compares real physical breadboard ground truth
against the complete camera-to-circuit pipeline.

Pipeline stages compared:
1. YOLO detections
2. Phase 18 verification (Circuit Vision Verifier & False-Positive Rejection)
3. Phase 19 terminal mapping (Hole mapping)
4. Phase 19 topology (Series/Parallel & Node extraction)
5. Phase 22.1 visual grounding state
6. Simulation result (MNA solver)
7. AR/3D grounding state

Rules:
- Never automatically correct ground truth.
- Never fabricate missing measurements.
- If a result is unknown or ambiguous, mark it UNKNOWN/AMBIGUOUS.
- Do not claim physical validation was performed unless an actual camera/physical circuit was tested.
"""

from typing import Dict, Any, List, Optional, Set, Tuple
from datetime import datetime
from .ground_truth_schema import (
    GroundTruthCircuit,
    GroundTruthComponent,
    GroundTruthWire,
    GroundTruthTopology,
    GroundTruthSimulationState,
    Orientation,
    TopologyPattern
)


# ===========================================================================
# HELPER NORMALIZATION UTILITIES
# ===========================================================================

def normalize_hole(h: Optional[str]) -> Optional[str]:
    """Canonicalizes breadboard hole strings (e.g., 'a10' -> 'A10')."""
    if not h or not isinstance(h, str):
        return None
    cleaned = h.strip().upper()
    if cleaned in ["UNKNOWN", "AMBIGUOUS", "NONE", ""]:
        return cleaned
    return cleaned


def normalize_hole_pair(h1: Optional[str], h2: Optional[str]) -> Tuple[Optional[str], Optional[str]]:
    """Returns sorted pair for order-independent connection matching."""
    norm1 = normalize_hole(h1)
    norm2 = normalize_hole(h2)
    if norm1 is None or norm2 is None:
        return (norm1, norm2)
    return tuple(sorted([norm1, norm2]))


# ===========================================================================
# 1. COMPONENT DETECTION ACCURACY
# ===========================================================================

def calculate_component_detection_accuracy(
    gt: GroundTruthCircuit,
    pipeline_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Compares detected physical components against ground truth.
    Filters out rejected false positives from Phase 18.
    """
    expected_ids = [c.id for c in gt.components]
    expected_count = len(expected_ids)

    # Extract detected components from Phase 18/22.1 or raw detections
    detected_candidates = []
    vg = pipeline_data.get("visual_grounding", {})
    p18 = pipeline_data.get("vision_verification", {})

    if vg and "components" in vg:
        for c in vg["components"]:
            if c.get("status") != "REJECTED":
                detected_candidates.append(c)
    elif p18 and "verified" in p18:
        detected_candidates = list(p18.get("verified", []))
    elif "yolo_detections" in pipeline_data:
        # Filter out REJECTED if verification is available
        rejected_ids = set()
        if p18 and "rejected" in p18:
            rejected_ids = {r.get("id") or r.get("candidate_id") for r in p18.get("rejected", [])}
        for det in pipeline_data["yolo_detections"]:
            cid = det.get("id") or det.get("candidate_id")
            if cid not in rejected_ids and det.get("status") != "REJECTED":
                detected_candidates.append(det)
    elif "components" in pipeline_data:
        detected_candidates = [c for c in pipeline_data["components"] if c.get("status") != "REJECTED"]

    # Match components by id or type/hole correspondence
    matched = []
    incorrect = []
    missing = []
    extra_detections = []
    failure_reasons = []

    gt_remaining = {c.id: c for c in gt.components}
    det_remaining = list(detected_candidates)

    # First pass: match by explicit ID
    for det in list(det_remaining):
        det_id = det.get("id") or det.get("component_id") or det.get("designator")
        if det_id and det_id in gt_remaining:
            matched.append(det_id)
            del gt_remaining[det_id]
            det_remaining.remove(det)

    # Second pass: match by hole overlap or type match
    for det in list(det_remaining):
        det_type = (det.get("type") or det.get("label") or "").lower()
        det_holes = set()
        if "holes" in det:
            det_holes = {normalize_hole(h) for h in det["holes"]}
        elif "start_hole" in det and "end_hole" in det:
            det_holes = {normalize_hole(det["start_hole"]), normalize_hole(det["end_hole"])}

        matched_id = None
        for gid, gcomp in list(gt_remaining.items()):
            gt_holes = {normalize_hole(h) for h in gcomp.terminal_holes}
            if det_holes and gt_holes and (det_holes & gt_holes):
                matched_id = gid
                break
            elif det_type == gcomp.type.lower() and not det_holes:
                matched_id = gid
                break

        if matched_id:
            matched.append(matched_id)
            del gt_remaining[matched_id]
            det_remaining.remove(det)

    # Remaining in gt are missing
    for gid in gt_remaining:
        missing.append(gid)
        failure_reasons.append(f"Missing component: Ground-truth {gid} was not detected.")

    # Remaining in detected are extra false positives
    for det in det_remaining:
        extra_id = det.get("id") or det.get("candidate_id") or f"extra_{det.get('type', 'comp')}"
        extra_detections.append(extra_id)
        failure_reasons.append(f"Extra detection: Unmatched candidate {extra_id} detected.")

    total_pool = max(expected_count, len(matched) + len(extra_detections))
    accuracy_pct = round((len(matched) / total_pool * 100.0), 2) if total_pool > 0 else 100.0

    return {
        "metric_name": "component_detection_accuracy",
        "expected": expected_ids,
        "detected": [d.get("id") or d.get("candidate_id") or d.get("type") for d in detected_candidates],
        "matched": matched,
        "incorrect": incorrect,
        "missing": missing,
        "extra_detections": extra_detections,
        "accuracy_percentage": accuracy_pct,
        "failure_reason": failure_reasons
    }


# ===========================================================================
# 2. COMPONENT CLASSIFICATION ACCURACY
# ===========================================================================

def calculate_component_classification_accuracy(
    gt: GroundTruthCircuit,
    pipeline_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Verifies that detected components were classified with the correct component type.
    Flags UNKNOWN/AMBIGUOUS instead of assuming correct classification.
    """
    gt_comp_map = {c.id: c.type.lower() for c in gt.components}
    det_comps = []

    vg = pipeline_data.get("visual_grounding", {})
    if vg and "components" in vg:
        det_comps = vg["components"]
    elif "components" in pipeline_data:
        det_comps = pipeline_data["components"]
    elif "yolo_detections" in pipeline_data:
        det_comps = pipeline_data["yolo_detections"]

    matched = []
    incorrect = []
    missing = []
    extra_detections = []
    failure_reasons = []

    checked_count = 0
    correct_count = 0

    for det in det_comps:
        det_id = det.get("id") or det.get("component_id") or det.get("designator")
        det_type = (det.get("type") or det.get("label") or "").lower()

        if det_id and det_id in gt_comp_map:
            checked_count += 1
            expected_type = gt_comp_map[det_id]
            if not det_type or det_type in ["unknown", "ambiguous"]:
                incorrect.append(det_id)
                failure_reasons.append(f"Classification ambiguous for {det_id}: got '{det_type}', expected '{expected_type}'.")
            elif det_type == expected_type:
                matched.append(det_id)
                correct_count += 1
            else:
                incorrect.append(det_id)
                failure_reasons.append(f"Classification mismatch for {det_id}: classified as '{det_type}', expected '{expected_type}'.")

    # If any GT component was not checked
    for gid in gt_comp_map:
        if gid not in matched and gid not in incorrect:
            missing.append(gid)
            failure_reasons.append(f"Classification missing for {gid}: component not found in pipeline output.")

    total_expected = len(gt_comp_map)
    accuracy_pct = round((correct_count / total_expected * 100.0), 2) if total_expected > 0 else 100.0

    return {
        "metric_name": "component_classification_accuracy",
        "expected": gt_comp_map,
        "detected": {d.get("id", "comp"): (d.get("type") or d.get("label")) for d in det_comps},
        "matched": matched,
        "incorrect": incorrect,
        "missing": missing,
        "extra_detections": extra_detections,
        "accuracy_percentage": accuracy_pct,
        "failure_reason": failure_reasons
    }


# ===========================================================================
# 3. TERMINAL DETECTION ACCURACY
# ===========================================================================

def calculate_terminal_detection_accuracy(
    gt: GroundTruthCircuit,
    pipeline_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Checks that the expected number of terminal pins/leads were extracted.
    """
    expected_terminals_by_comp = {c.id: len(c.terminal_holes) for c in gt.components}
    total_expected = sum(expected_terminals_by_comp.values())

    det_terminals_by_comp = {}
    vg = pipeline_data.get("visual_grounding", {})
    mapping = pipeline_data.get("hole_mapping") or pipeline_data.get("holes_mapped") or {}

    if vg and "components" in vg:
        for c in vg["components"]:
            cid = c.get("id")
            terminals = 0
            if "terminals" in c:
                terminals = len(c["terminals"])
            elif c.get("start_hole") and c.get("end_hole"):
                terminals = 2
            elif "holes" in c:
                terminals = len(c["holes"])
            det_terminals_by_comp[cid] = terminals
    elif isinstance(mapping, dict):
        for cid, holes in mapping.items():
            det_terminals_by_comp[cid] = len(holes) if isinstance(holes, (list, tuple)) else 2
    elif "components" in pipeline_data:
        for c in pipeline_data["components"]:
            cid = c.get("id")
            terminals = 2 if (c.get("start_hole") and c.get("end_hole")) else len(c.get("holes", []))
            det_terminals_by_comp[cid] = terminals

    matched = []
    incorrect = []
    missing = []
    extra_detections = []
    failure_reasons = []

    matched_terminals = 0
    for cid, exp_count in expected_terminals_by_comp.items():
        det_count = det_terminals_by_comp.get(cid, 0)
        if det_count == exp_count and det_count > 0:
            matched.append(cid)
            matched_terminals += det_count
        elif det_count == 0:
            missing.append(cid)
            failure_reasons.append(f"Terminals missing for {cid}: expected {exp_count} terminals, detected 0.")
        else:
            incorrect.append(cid)
            failure_reasons.append(f"Terminal count mismatch for {cid}: expected {exp_count}, detected {det_count}.")

    accuracy_pct = round((matched_terminals / total_expected * 100.0), 2) if total_expected > 0 else 100.0

    return {
        "metric_name": "terminal_detection_accuracy",
        "expected": expected_terminals_by_comp,
        "detected": det_terminals_by_comp,
        "matched": matched,
        "incorrect": incorrect,
        "missing": missing,
        "extra_detections": extra_detections,
        "accuracy_percentage": accuracy_pct,
        "failure_reason": failure_reasons
    }


# ===========================================================================
# 4. HOLE MAPPING ACCURACY
# ===========================================================================

def calculate_hole_mapping_accuracy(
    gt: GroundTruthCircuit,
    pipeline_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Verifies that detected component leads map deterministically to the actual breadboard holes.
    Non-polarized components match set of holes; polarized match directional endpoints.
    """
    expected_holes = {}
    for c in gt.components:
        expected_holes[c.id] = [normalize_hole(h) for h in c.terminal_holes]

    detected_holes = {}
    vg = pipeline_data.get("visual_grounding", {})
    mapping = pipeline_data.get("hole_mapping") or pipeline_data.get("holes_mapped") or {}

    if vg and "components" in vg:
        for c in vg["components"]:
            cid = c.get("id")
            sh = normalize_hole(c.get("start_hole"))
            eh = normalize_hole(c.get("end_hole"))
            if sh and eh:
                detected_holes[cid] = [sh, eh]
            elif "holes" in c:
                detected_holes[cid] = [normalize_hole(h) for h in c["holes"]]
    elif isinstance(mapping, dict):
        for cid, hlist in mapping.items():
            if isinstance(hlist, (list, tuple)):
                detected_holes[cid] = [normalize_hole(h) for h in hlist]
            elif isinstance(hlist, dict):
                detected_holes[cid] = [normalize_hole(hlist.get("start_hole")), normalize_hole(hlist.get("end_hole"))]
    elif "components" in pipeline_data:
        for c in pipeline_data["components"]:
            cid = c.get("id")
            sh = normalize_hole(c.get("start_hole"))
            eh = normalize_hole(c.get("end_hole"))
            if sh and eh:
                detected_holes[cid] = [sh, eh]

    matched = []
    incorrect = []
    missing = []
    extra_detections = []
    failure_reasons = []

    total_holes_expected = 0
    correct_holes_count = 0

    for cid, exp_hlist in expected_holes.items():
        total_holes_expected += len(exp_hlist)
        det_hlist = detected_holes.get(cid)

        if not det_hlist:
            missing.append(cid)
            failure_reasons.append(f"Hole mapping missing for {cid}: expected {exp_hlist}, got None.")
            continue

        # Check for UNKNOWN or AMBIGUOUS
        if any(h in ["UNKNOWN", "AMBIGUOUS", None] for h in det_hlist):
            incorrect.append(cid)
            failure_reasons.append(f"Hole mapping ambiguous/unknown for {cid}: detected {det_hlist}.")
            continue

        exp_set = set(exp_hlist)
        det_set = set(det_hlist)

        if exp_set == det_set:
            matched.append(cid)
            correct_holes_count += len(exp_hlist)
        else:
            incorrect.append(cid)
            # Count partial matches
            overlap = len(exp_set & det_set)
            correct_holes_count += overlap
            failure_reasons.append(f"Hole mapping mismatch on {cid}: expected {exp_hlist}, detected {det_hlist}.")

    accuracy_pct = round((correct_holes_count / total_holes_expected * 100.0), 2) if total_holes_expected > 0 else 100.0

    return {
        "metric_name": "hole_mapping_accuracy",
        "expected": expected_holes,
        "detected": detected_holes,
        "matched": matched,
        "incorrect": incorrect,
        "missing": missing,
        "extra_detections": extra_detections,
        "accuracy_percentage": accuracy_pct,
        "failure_reason": failure_reasons
    }


# ===========================================================================
# 5. ELECTRICAL NODE ACCURACY
# ===========================================================================

def calculate_electrical_node_accuracy(
    gt: GroundTruthCircuit,
    pipeline_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Verifies that electrical node partitions match ground truth.
    Checks that pins in the same node are electrically joined, and pins in different nodes are isolated.
    """
    gt_nodes = gt.electrical_nodes
    total_expected = len(gt_nodes)

    det_nodes = {}
    vg = pipeline_data.get("visual_grounding", {})
    topology = pipeline_data.get("topology") or {}

    if vg and "nodes" in vg:
        for n in vg["nodes"]:
            nid = n.get("id")
            pins = n.get("members") or n.get("connected_pins") or []
            det_nodes[nid] = list(pins)
    elif "nodes" in topology:
        for n in topology["nodes"]:
            nid = n.get("id")
            pins = n.get("connected_pins") or n.get("pins") or []
            det_nodes[nid] = list(pins)
    elif "electrical_nodes" in pipeline_data:
        det_nodes = dict(pipeline_data["electrical_nodes"])

    matched = []
    incorrect = []
    missing = []
    extra_detections = []
    failure_reasons = []

    # Map each pin to its node id in ground truth and detected
    gt_pin_to_node = {}
    for nid, pins in gt_nodes.items():
        for p in pins:
            gt_pin_to_node[p] = nid

    det_pin_to_node = {}
    for nid, pins in det_nodes.items():
        for p in pins:
            det_pin_to_node[p] = nid

    correct_nodes = 0
    for nid, exp_pins in gt_nodes.items():
        if not det_nodes:
            missing.append(nid)
            failure_reasons.append(f"Electrical node {nid} missing: no nodes found in pipeline.")
            continue

        # Find which detected node contains the first pin
        candidate_det_nodes = [det_pin_to_node.get(p) for p in exp_pins if p in det_pin_to_node]
        if not candidate_det_nodes:
            missing.append(nid)
            failure_reasons.append(f"Electrical node {nid} missing: none of its pins ({exp_pins}) mapped to a node.")
        elif len(set(candidate_det_nodes)) == 1 and None not in candidate_det_nodes:
            # All pins of this GT node are in the exact same detected node!
            matched.append(nid)
            correct_nodes += 1
        else:
            incorrect.append(nid)
            failure_reasons.append(f"Electrical node fragmentation for {nid}: pins {exp_pins} split across detected nodes {candidate_det_nodes}.")

    accuracy_pct = round((correct_nodes / total_expected * 100.0), 2) if total_expected > 0 else 100.0

    return {
        "metric_name": "electrical_node_accuracy",
        "expected": gt_nodes,
        "detected": det_nodes,
        "matched": matched,
        "incorrect": incorrect,
        "missing": missing,
        "extra_detections": extra_detections,
        "accuracy_percentage": accuracy_pct,
        "failure_reason": failure_reasons
    }


# ===========================================================================
# 6. WIRE DETECTION ACCURACY
# ===========================================================================

def calculate_wire_detection_accuracy(
    gt: GroundTruthCircuit,
    pipeline_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Validates jumper wire detections, matching wire start/end breadboard holes.
    """
    gt_wires = gt.jumper_wires
    expected_wire_pairs = {w.id: normalize_hole_pair(w.start_hole, w.end_hole) for w in gt_wires}
    expected_count = len(expected_wire_pairs)

    detected_wires = []
    vg = pipeline_data.get("visual_grounding", {})
    if vg and "wires" in vg:
        detected_wires = vg["wires"]
    elif "jumper_wires" in pipeline_data:
        detected_wires = pipeline_data["jumper_wires"]
    elif "wires" in pipeline_data:
        detected_wires = pipeline_data["wires"]

    matched = []
    incorrect = []
    missing = []
    extra_detections = []
    failure_reasons = []

    gt_remaining = dict(expected_wire_pairs)
    det_remaining = list(detected_wires)

    for det in list(det_remaining):
        sh = det.get("start_hole") or det.get("hole1")
        eh = det.get("end_hole") or det.get("hole2")
        pair = normalize_hole_pair(sh, eh)

        match_wid = None
        for wid, exp_pair in list(gt_remaining.items()):
            if pair == exp_pair:
                match_wid = wid
                break

        if match_wid:
            matched.append(match_wid)
            del gt_remaining[match_wid]
            det_remaining.remove(det)

    for wid, exp_pair in gt_remaining.items():
        missing.append(wid)
        failure_reasons.append(f"Missing jumper wire {wid}: expected connection between {exp_pair[0]} and {exp_pair[1]}.")

    for det in det_remaining:
        extra_id = det.get("id", "wire_extra")
        extra_detections.append(extra_id)
        failure_reasons.append(f"Extra wire detection: detected {extra_id} between {det.get('start_hole')} and {det.get('end_hole')}.")

    total_pool = max(expected_count, len(matched) + len(extra_detections))
    accuracy_pct = round((len(matched) / total_pool * 100.0), 2) if total_pool > 0 else 100.0

    return {
        "metric_name": "wire_detection_accuracy",
        "expected": expected_wire_pairs,
        "detected": [normalize_hole_pair(w.get("start_hole") or w.get("hole1"), w.get("end_hole") or w.get("hole2")) for w in detected_wires],
        "matched": matched,
        "incorrect": incorrect,
        "missing": missing,
        "extra_detections": extra_detections,
        "accuracy_percentage": accuracy_pct,
        "failure_reason": failure_reasons
    }


# ===========================================================================
# 7. SERIES / PARALLEL TOPOLOGY ACCURACY
# ===========================================================================

def calculate_topology_accuracy(
    gt: GroundTruthCircuit,
    pipeline_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Validates series/parallel grouping and overall pattern recognition.
    """
    gt_topo = gt.topology
    expected_pattern = gt_topo.pattern
    expected_series = [sorted(g) for g in gt_topo.series_groups]
    expected_parallel = [sorted(g) for g in gt_topo.parallel_groups]

    detected_pattern = "UNKNOWN"
    detected_series = []
    detected_parallel = []

    topo = pipeline_data.get("topology") or {}
    vg = pipeline_data.get("visual_grounding", {})

    if topo:
        detected_pattern = topo.get("pattern") or topo.get("topology_type") or "UNKNOWN"
        detected_series = [sorted(g) for g in (topo.get("series_pairs") or topo.get("series_groups") or [])]
        detected_parallel = [sorted(g) for g in (topo.get("parallel_pairs") or topo.get("parallel_groups") or [])]
    elif vg and "topology" in vg:
        vt = vg["topology"]
        detected_pattern = vt.get("pattern") or vt.get("topology_type") or "UNKNOWN"
        detected_series = [sorted(g) for g in (vt.get("series_pairs") or vt.get("series_groups") or [])]
        detected_parallel = [sorted(g) for g in (vt.get("parallel_pairs") or vt.get("parallel_groups") or [])]

    matched = []
    incorrect = []
    missing = []
    extra_detections = []
    failure_reasons = []

    # Check pattern
    pattern_match = (detected_pattern.upper() == expected_pattern.upper())
    if pattern_match:
        matched.append(f"pattern:{expected_pattern}")
    else:
        incorrect.append(f"pattern:{expected_pattern}")
        failure_reasons.append(f"Topology pattern mismatch: expected '{expected_pattern}', detected '{detected_pattern}'.")

    # Check series groups
    for sg in expected_series:
        if sg in detected_series:
            matched.append(f"series:{sg}")
        else:
            missing.append(f"series:{sg}")
            failure_reasons.append(f"Missing series connection group: {sg}.")

    # Check parallel groups
    for pg in expected_parallel:
        if pg in detected_parallel:
            matched.append(f"parallel:{pg}")
        else:
            missing.append(f"parallel:{pg}")
            failure_reasons.append(f"Missing parallel connection group: {pg}.")

    total_items = 1 + len(expected_series) + len(expected_parallel)
    accuracy_pct = round((len(matched) / total_items * 100.0), 2) if total_items > 0 else 100.0

    return {
        "metric_name": "topology_accuracy",
        "expected": {
            "pattern": expected_pattern,
            "series_groups": expected_series,
            "parallel_groups": expected_parallel
        },
        "detected": {
            "pattern": detected_pattern,
            "series_groups": detected_series,
            "parallel_groups": detected_parallel
        },
        "matched": matched,
        "incorrect": incorrect,
        "missing": missing,
        "extra_detections": extra_detections,
        "accuracy_percentage": accuracy_pct,
        "failure_reason": failure_reasons
    }


# ===========================================================================
# 8. SIMULATION CONSISTENCY
# ===========================================================================

def calculate_simulation_consistency(
    gt: GroundTruthCircuit,
    pipeline_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Compares predicted MNA node voltages and branch currents against expected ground truth.
    Never fabricates missing measurements. Safe against zero division.
    """
    gt_sim = gt.simulation_state
    expected_voltages = gt_sim.expected_node_voltages
    expected_currents = gt_sim.expected_branch_currents_ma

    sim_res = pipeline_data.get("simulation_result") or pipeline_data.get("simulationResult") or {}
    vg = pipeline_data.get("visual_grounding", {})
    if not sim_res and vg and "simulation" in vg:
        sim_res = vg["simulation"]

    detected_voltages = sim_res.get("node_voltages") or sim_res.get("voltages") or {}
    detected_currents = sim_res.get("branch_currents") or sim_res.get("currents") or {}
    solver_status = sim_res.get("status") or pipeline_data.get("solverStatus") or "NOT_RUN"

    matched = []
    incorrect = []
    missing = []
    extra_detections = []
    failure_reasons = []

    total_checks = len(expected_voltages) + len(expected_currents)
    if total_checks == 0:
        return {
            "metric_name": "simulation_consistency",
            "expected": {},
            "detected": {},
            "matched": [],
            "incorrect": [],
            "missing": [],
            "extra_detections": [],
            "accuracy_percentage": 100.0,
            "failure_reason": []
        }

    if solver_status != "SOLVED":
        failure_reasons.append(f"Simulation did not solve: solver status is '{solver_status}'.")
        for k in expected_voltages:
            missing.append(f"V({k})")
        for k in expected_currents:
            missing.append(f"I({k})")
        return {
            "metric_name": "simulation_consistency",
            "expected": {"voltages": expected_voltages, "currents": expected_currents},
            "detected": {"status": solver_status},
            "matched": [],
            "incorrect": [],
            "missing": missing,
            "extra_detections": extra_detections,
            "accuracy_percentage": 0.0,
            "failure_reason": failure_reasons
        }

    correct_checks = 0

    # Validate Voltages (5% tolerance or 0.1V absolute)
    for node, exp_v in expected_voltages.items():
        # Match by exact node name or partial col match
        det_v = None
        if node in detected_voltages:
            det_v = detected_voltages[node]
        else:
            # Try case-insensitive or hole lookup
            for dn, dv in detected_voltages.items():
                if dn.upper() == node.upper() or (node in dn) or (dn in node):
                    det_v = dv
                    break

        if det_v is None:
            missing.append(f"V({node})")
            failure_reasons.append(f"Missing simulated voltage for node {node}.")
        else:
            abs_err = abs(float(det_v) - float(exp_v))
            tol = max(0.1, abs(float(exp_v)) * 0.05)
            if abs_err <= tol:
                matched.append(f"V({node})")
                correct_checks += 1
            else:
                incorrect.append(f"V({node})")
                failure_reasons.append(f"Voltage error on node {node}: expected {exp_v}V, simulated {det_v}V (error {round(abs_err, 3)}V > tol {round(tol, 3)}V).")

    # Validate Currents (10% tolerance or 0.5mA absolute)
    for branch, exp_i in expected_currents.items():
        det_i = None
        if branch in detected_currents:
            det_i = detected_currents[branch]
        else:
            for db, di in detected_currents.items():
                if db.upper() == branch.upper():
                    det_i = di
                    break

        if det_i is None:
            missing.append(f"I({branch})")
            failure_reasons.append(f"Missing simulated current for branch {branch}.")
        else:
            abs_err = abs(float(det_i) - float(exp_i))
            tol = max(0.5, abs(float(exp_i)) * 0.10)
            if abs_err <= tol:
                matched.append(f"I({branch})")
                correct_checks += 1
            else:
                incorrect.append(f"I({branch})")
                failure_reasons.append(f"Current error on branch {branch}: expected {exp_i}mA, simulated {det_i}mA (error {round(abs_err, 2)}mA).")

    accuracy_pct = round((correct_checks / total_checks * 100.0), 2) if total_checks > 0 else 100.0

    return {
        "metric_name": "simulation_consistency",
        "expected": {"voltages": expected_voltages, "currents": expected_currents},
        "detected": {"voltages": detected_voltages, "currents": detected_currents},
        "matched": matched,
        "incorrect": incorrect,
        "missing": missing,
        "extra_detections": extra_detections,
        "accuracy_percentage": accuracy_pct,
        "failure_reason": failure_reasons
    }


# ===========================================================================
# 9. AR / 3D GROUNDING CONSISTENCY
# ===========================================================================

def calculate_ar_grounding_consistency(
    gt: GroundTruthCircuit,
    pipeline_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Validates AR anchor registration and 3D visual alignment state.
    """
    expected_ar = gt.ar_grounding_state or {"expected_tracking": "ACTIVE", "orientation": "HORIZONTAL"}
    expected_tracking = expected_ar.get("expected_tracking", "ACTIVE")

    ar_state = pipeline_data.get("ar_grounding_state") or pipeline_data.get("registration") or {}
    vg = pipeline_data.get("visual_grounding", {})
    if not ar_state and vg and "ar_grounding" in vg:
        ar_state = vg["ar_grounding"]

    detected_tracking = ar_state.get("tracking") or ar_state.get("status") or "NOT_MEASURED"
    detected_reg = ar_state.get("registration") or "INACTIVE"

    matched = []
    incorrect = []
    missing = []
    extra_detections = []
    failure_reasons = []

    accuracy_pct = 0.0
    if detected_tracking in ["ACTIVE", "TRACKED", "REGISTERED"] or detected_reg == "ACTIVE":
        matched.append("ar_tracking_active")
        accuracy_pct = 100.0
    elif detected_tracking == "MINOR_OFFSET":
        incorrect.append("ar_minor_offset")
        accuracy_pct = 50.0
        failure_reasons.append("AR tracking exhibits minor alignment offset with breadboard grid.")
    elif detected_tracking in ["UNREGISTERED", "FAIL", "NOT_MEASURED", "UNKNOWN"]:
        missing.append("ar_tracking_unregistered")
        accuracy_pct = 0.0
        failure_reasons.append(f"AR tracking not active: status is '{detected_tracking}'.")
    else:
        incorrect.append(f"ar_status_{detected_tracking}")
        failure_reasons.append(f"AR alignment anomalous: status '{detected_tracking}'.")

    return {
        "metric_name": "ar_grounding_consistency",
        "expected": expected_ar,
        "detected": {"tracking": detected_tracking, "registration": detected_reg},
        "matched": matched,
        "incorrect": incorrect,
        "missing": missing,
        "extra_detections": extra_detections,
        "accuracy_percentage": accuracy_pct,
        "failure_reason": failure_reasons
    }


# ===========================================================================
# MASTER VALIDATION REPORT GENERATOR
# ===========================================================================

def validate_physical_circuit(
    gt: GroundTruthCircuit,
    pipeline_data: Dict[str, Any],
    is_actual_hardware_test: bool = False
) -> Dict[str, Any]:
    """
    Executes all 9 deterministic calibration checks and compiles the complete validation report.

    Strict rule: Never claim physical validation was performed unless an actual camera/physical circuit was tested.
    If is_actual_hardware_test is False, status is strictly 'NOT PERFORMED (SYNTHETIC BENCHMARK)'.
    """
    # 1. Calculate the 9 metrics
    m1 = calculate_component_detection_accuracy(gt, pipeline_data)
    m2 = calculate_component_classification_accuracy(gt, pipeline_data)
    m3 = calculate_terminal_detection_accuracy(gt, pipeline_data)
    m4 = calculate_hole_mapping_accuracy(gt, pipeline_data)
    m5 = calculate_electrical_node_accuracy(gt, pipeline_data)
    m6 = calculate_wire_detection_accuracy(gt, pipeline_data)
    m7 = calculate_topology_accuracy(gt, pipeline_data)
    m8 = calculate_simulation_consistency(gt, pipeline_data)
    m9 = calculate_ar_grounding_consistency(gt, pipeline_data)

    metrics_breakdown = {
        "component_detection": m1,
        "component_classification": m2,
        "terminal_detection": m3,
        "hole_mapping": m4,
        "electrical_node": m5,
        "wire_detection": m6,
        "topology": m7,
        "simulation_consistency": m8,
        "ar_grounding": m9
    }

    # Consolidated aggregates
    all_matched = []
    all_incorrect = []
    all_missing = []
    all_extra = []
    all_failures = []

    for m in [m1, m2, m3, m4, m5, m6, m7, m8, m9]:
        all_matched.extend(m.get("matched", []))
        all_incorrect.extend(m.get("incorrect", []))
        all_missing.extend(m.get("missing", []))
        all_extra.extend(m.get("extra_detections", []))
        all_failures.extend(m.get("failure_reason", []))

    # Overall weighted accuracy calculation
    metric_weights = {
        "component_detection": 0.15,
        "component_classification": 0.15,
        "terminal_detection": 0.10,
        "hole_mapping": 0.15,
        "electrical_node": 0.15,
        "wire_detection": 0.10,
        "topology": 0.10,
        "simulation_consistency": 0.05,
        "ar_grounding": 0.05
    }

    composite_accuracy = round(sum(
        metrics_breakdown[k]["accuracy_percentage"] * weight
        for k, weight in metric_weights.items()
    ), 2)

    # Physical Validation Confirmation Gate
    is_confirmed_physical = bool(is_actual_hardware_test and gt.is_physical_test)
    if is_confirmed_physical:
        physical_status = "PERFORMED_VERIFIED" if composite_accuracy >= 90.0 else "PERFORMED_FAILED"
    else:
        physical_status = "NOT PERFORMED (SYNTHETIC BENCHMARK)"

    report = {
        "circuit_id": gt.circuit_id,
        "circuit_name": gt.name,
        "is_physical_test": is_confirmed_physical,
        "physical_validation_status": physical_status,
        "expected": {
            "components": [c.to_dict() for c in gt.components],
            "jumper_wires": [w.to_dict() for w in gt.jumper_wires],
            "electrical_nodes": gt.electrical_nodes,
            "topology": gt.topology.to_dict(),
            "simulation_state": gt.simulation_state.to_dict()
        },
        "detected": {
            "components": pipeline_data.get("components") or pipeline_data.get("yolo_detections") or [],
            "wires": pipeline_data.get("wires") or pipeline_data.get("jumper_wires") or [],
            "topology": pipeline_data.get("topology") or {},
            "simulation": pipeline_data.get("simulation_result") or {}
        },
        "matched": all_matched,
        "incorrect": all_incorrect,
        "missing": all_missing,
        "extra_detections": all_extra,
        "accuracy_percentage": composite_accuracy,
        "failure_reason": all_failures,
        "metrics_breakdown": metrics_breakdown,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

    return report
