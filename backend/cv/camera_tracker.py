"""
SmartBreadboard 3D — Live Camera Spatial Tracking & Change Detection Engine
Provides IoU and centroid spatial matching across webcam frames to maintain stable component IDs,
temporal detection stability verification, and physical circuit change event detection.
"""

import math
from typing import List, Dict, Any, Tuple, Optional

def calculate_bbox_iou(boxA: list[int], boxB: list[int]) -> float:
    """Calculates Intersection over Union (IoU) between two bounding boxes [x1, y1, x2, y2]."""
    xA = max(boxA[0], boxB[0])
    yA = max(boxA[1], boxB[1])
    xB = min(boxA[2], boxB[2])
    yB = min(boxA[3], boxB[3])

    interArea = max(0, xB - xA + 1) * max(0, yB - yA + 1)
    if interArea == 0:
        return 0.0

    boxAArea = (boxA[2] - boxA[0] + 1) * (boxA[3] - boxA[1] + 1)
    boxBArea = (boxB[2] - boxB[0] + 1) * (boxB[3] - boxB[1] + 1)

    iou = interArea / float(boxAArea + boxBArea - interArea)
    return float(iou)


def calculate_centroid_distance(boxA: list[int], boxB: list[int]) -> float:
    """Calculates Euclidean distance between centers of two bounding boxes."""
    cxA = (boxA[0] + boxA[2]) / 2.0
    cyA = (boxA[1] + boxA[3]) / 2.0
    cxB = (boxB[0] + boxB[2]) / 2.0
    cyB = (boxB[1] + boxB[3]) / 2.0

    return math.sqrt((cxA - cxB) ** 2 + (cyA - cyB) ** 2)


def match_components_spatially(
    current_components: List[Dict[str, Any]],
    previous_components: List[Dict[str, Any]],
    distance_threshold: float = 120.0
) -> Tuple[List[Dict[str, Any]], List[str]]:
    """
    Matches current frame components with previous frame components.
    Preserves stable designator IDs (R1, LED1, W1) and detects change events.
    """
    if not previous_components:
        # First frame: keep generated IDs
        return current_components, ["Physical circuit scan initialized"]

    matched_current = []
    used_prev_ids = set()
    events = []

    # Map previous components by type
    prev_by_type: Dict[str, List[Dict[str, Any]]] = {}
    for p in previous_components:
        ptype = str(p.get("type", p.get("class", ""))).lower()
        if ptype not in prev_by_type:
            prev_by_type[ptype] = []
        prev_by_type[ptype].append(p)

    for c in current_components:
        ctype = str(c.get("type", c.get("class", ""))).lower()
        c_bbox = c.get("bbox") or c.get("bbox_pixels") or [0, 0, 10, 10]
        
        candidates = prev_by_type.get(ctype, [])
        best_match = None
        best_score = -1.0

        for p in candidates:
            pid = p.get("id") or p.get("designator")
            if pid in used_prev_ids:
                continue

            p_bbox = p.get("bbox") or p.get("bbox_pixels") or [0, 0, 10, 10]
            iou = calculate_bbox_iou(c_bbox, p_bbox)
            dist = calculate_centroid_distance(c_bbox, p_bbox)

            # Combined spatial matching score
            score = iou * 100.0 - (dist / 10.0)

            if dist <= distance_threshold and score > best_score:
                best_score = score
                best_match = p

        if best_match:
            pid = best_match.get("id") or best_match.get("designator")
            used_prev_ids.add(pid)

            # Copy stable ID and designator
            c_updated = dict(c)
            c_updated["id"] = pid
            c_updated["designator"] = best_match.get("designator", pid)

            # Preserve user confirmed value if present
            if best_match.get("valueSource") == "user_confirmed":
                c_updated["value"] = best_match.get("value")
                c_updated["unit"] = best_match.get("unit", "Ω")
                c_updated["displayValue"] = best_match.get("displayValue")
                c_updated["formatted_value"] = best_match.get("formatted_value")
                c_updated["valueSource"] = "user_confirmed"
                c_updated["needsConfirmation"] = False

            # Detect value change
            prev_val = best_match.get("displayValue") or best_match.get("formatted_value")
            curr_val = c_updated.get("displayValue") or c_updated.get("formatted_value")
            if prev_val and curr_val and prev_val != curr_val and best_match.get("valueSource") != "user_confirmed":
                events.append(f"{pid} value changed: {prev_val} → {curr_val}")

            # Detect topology/hole change
            prev_h1 = best_match.get("hole1") or best_match.get("start_hole")
            curr_h1 = c_updated.get("hole1") or c_updated.get("start_hole")
            if prev_h1 and curr_h1 and prev_h1 != curr_h1:
                events.append(f"{pid} terminal moved from {prev_h1} to {curr_h1}")

            matched_current.append(c_updated)
        else:
            # New component added
            matched_current.append(c)
            new_id = c.get("designator") or c.get("id") or "comp"
            events.append(f"New component {new_id} ({c.get('type')}) detected")

    # Detect removed components
    for p in previous_components:
        pid = p.get("id") or p.get("designator")
        if pid and pid not in used_prev_ids:
            events.append(f"Component {pid} ({p.get('type')}) removed")

    return matched_current, events
