"""
SmartBreadboard 3D — Live Camera Spatial Tracking & Change Detection Engine
Phase 7 Live Camera Tracking + Digital Twin Synchronization

Provides:
- Tracking State Machine: DETECTED, TRACKED, LOST, REACQUIRED
- Exponential Moving Average (EMA) Temporal Smoothing on Bounding Boxes & Centroids
- Deterministic Identity Preservation (R1 stays R1 across frames)
- Lost-frame tolerance (up to max_lost_frames before pruning)
- Breadboard hole stability preservation
- Physical circuit change event generation
"""

import math
import time
from typing import List, Dict, Any, Tuple, Optional


def calculate_bbox_iou(boxA: list, boxB: list) -> float:
    """Calculates Intersection over Union (IoU) between two bounding boxes [x1, y1, x2, y2]."""
    if not boxA or not boxB or len(boxA) < 4 or len(boxB) < 4:
        return 0.0

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


def calculate_centroid_distance(boxA: list, boxB: list) -> float:
    """Calculates Euclidean distance between centers of two bounding boxes."""
    if not boxA or not boxB or len(boxA) < 4 or len(boxB) < 4:
        return 9999.0

    cxA = (boxA[0] + boxA[2]) / 2.0
    cyA = (boxA[1] + boxA[3]) / 2.0
    cxB = (boxB[0] + boxB[2]) / 2.0
    cyB = (boxB[1] + boxB[3]) / 2.0

    return math.sqrt((cxA - cxB) ** 2 + (cyA - cyB) ** 2)


def smooth_bbox_ema(current_box: list, previous_box: list, alpha: float = 0.65) -> list:
    """Applies Exponential Moving Average (EMA) to bounding box coordinates."""
    if not previous_box or len(previous_box) < 4:
        return [int(round(x)) for x in current_box]
    
    smoothed = [
        int(round(alpha * current_box[i] + (1.0 - alpha) * previous_box[i]))
        for i in range(4)
    ]
    return smoothed


class LiveComponentTracker:
    """
    Stateful multi-frame component tracker for live camera streams.
    Maintains persistent component identities, tracks states (DETECTED, TRACKED, LOST, REACQUIRED),
    and applies temporal smoothing to eliminate visual jitter.
    """

    def __init__(self, distance_threshold: float = 120.0, max_lost_frames: int = 5, smoothing_alpha: float = 0.65):
        self.distance_threshold = distance_threshold
        self.max_lost_frames = max_lost_frames
        self.smoothing_alpha = smoothing_alpha
        self.frame_count = 0
        self.tracked_memory: Dict[str, Dict[str, Any]] = {}

    def reset(self):
        """Resets tracker memory for a fresh session."""
        self.frame_count = 0
        self.tracked_memory.clear()

    def process_frame(
        self,
        current_detections: List[Dict[str, Any]],
        previous_state: Optional[Dict[str, Any]] = None
    ) -> Tuple[List[Dict[str, Any]], List[str]]:
        """
        Processes a new video frame against tracker memory.
        Returns:
            tracked_components: List of components with stable IDs, smoothed bboxes, and explicit tracking_state.
            events: List of detected change events (added, removed, value changed, moved, reacquired).
        """
        self.frame_count += 1
        events: List[str] = []
        now = time.time()

        # If previous_state was passed and tracker memory is empty, initialize from previous_state
        if not self.tracked_memory and previous_state and "components" in previous_state:
            for p in previous_state["components"]:
                pid = p.get("id") or p.get("designator")
                if pid:
                    self.tracked_memory[pid] = dict(p)
                    self.tracked_memory[pid].setdefault("consecutive_lost_frames", 0)
                    self.tracked_memory[pid].setdefault("tracking_state", "TRACKED")
                    self.tracked_memory[pid].setdefault("last_seen_frame", self.frame_count - 1)

        # Capture existing memory IDs prior to matching
        existing_memory_ids = set(self.tracked_memory.keys())
        matched_prev_ids = set()
        matched_results: List[Dict[str, Any]] = []
        newly_detected_comps: List[Dict[str, Any]] = []

        # Group existing memory by component type
        memory_by_type: Dict[str, List[Dict[str, Any]]] = {}
        for pid, p in self.tracked_memory.items():
            ptype = str(p.get("type", p.get("class", ""))).lower()
            if ptype not in memory_by_type:
                memory_by_type[ptype] = []
            memory_by_type[ptype].append(p)

        # Match incoming detections against existing memory
        for det in current_detections:
            ctype = str(det.get("type", det.get("class", ""))).lower()
            c_bbox = det.get("bbox") or det.get("bbox_pixels") or [0, 0, 10, 10]

            candidates = memory_by_type.get(ctype, [])
            best_match = None
            best_score = -1.0

            for p in candidates:
                pid = p.get("id") or p.get("designator")
                if pid in matched_prev_ids:
                    continue

                p_bbox = p.get("bbox") or p.get("bbox_pixels") or [0, 0, 10, 10]
                iou = calculate_bbox_iou(c_bbox, p_bbox)
                dist = calculate_centroid_distance(c_bbox, p_bbox)

                # Matching score favoring high IoU and low Euclidean distance
                score = (iou * 100.0) - (dist / 10.0)
                if dist <= self.distance_threshold and score > best_score:
                    best_score = score
                    best_match = p

            if best_match:
                pid = best_match.get("id") or best_match.get("designator")
                matched_prev_ids.add(pid)
                prev_state = best_match.get("tracking_state", "TRACKED")

                # State Transition
                if prev_state == "LOST":
                    new_state = "REACQUIRED"
                    events.append(f"{pid} ({ctype}) reacquired after temporary loss")
                elif prev_state == "DETECTED":
                    new_state = "TRACKED"
                else:
                    new_state = "TRACKED"

                # Apply Temporal EMA Smoothing to Bounding Box
                prev_bbox = best_match.get("bbox") or best_match.get("bbox_pixels") or c_bbox
                smoothed_box = smooth_bbox_ema(c_bbox, prev_bbox, self.smoothing_alpha)

                updated = dict(det)
                updated["id"] = pid
                updated["designator"] = best_match.get("designator", pid)
                updated["bbox"] = smoothed_box
                updated["bbox_pixels"] = smoothed_box
                updated["center_x"] = (smoothed_box[0] + smoothed_box[2]) / 2.0
                updated["center_y"] = (smoothed_box[1] + smoothed_box[3]) / 2.0
                updated["tracking_state"] = new_state
                updated["tracking_confidence"] = det.get("confidence", 0.9)
                updated["last_seen_frame"] = self.frame_count
                updated["consecutive_lost_frames"] = 0
                updated["timestamp"] = now

                # Preserve High-Confidence Hole Mapping if new frame hole confidence is low
                new_h1 = updated.get("hole1") or updated.get("start_hole")
                new_h2 = updated.get("hole2") or updated.get("end_hole")
                new_map_conf = updated.get("mapping_confidence", 0.0)

                prev_h1 = best_match.get("hole1") or best_match.get("start_hole")
                prev_h2 = best_match.get("hole2") or best_match.get("end_hole")
                prev_map_conf = best_match.get("mapping_confidence", 0.9)

                if prev_h1 and prev_h2 and (not new_h1 or not new_h2 or new_map_conf < 0.5):
                    updated["hole1"] = prev_h1
                    updated["start_hole"] = prev_h1
                    updated["hole2"] = prev_h2
                    updated["end_hole"] = prev_h2
                    updated["mapping_confidence"] = prev_map_conf
                    updated["node1"] = best_match.get("node1", updated.get("node1"))
                    updated["node2"] = best_match.get("node2", updated.get("node2"))

                # Preserve user confirmed value
                if best_match.get("valueSource") == "user_confirmed":
                    updated["value"] = best_match.get("value")
                    updated["unit"] = best_match.get("unit", "Ω")
                    updated["displayValue"] = best_match.get("displayValue")
                    updated["formatted_value"] = best_match.get("formatted_value")
                    updated["valueSource"] = "user_confirmed"
                    updated["needsConfirmation"] = False

                # Detect Value Changes
                prev_val = best_match.get("displayValue") or best_match.get("formatted_value")
                curr_val = updated.get("displayValue") or updated.get("formatted_value")
                if prev_val and curr_val and prev_val != curr_val and best_match.get("valueSource") != "user_confirmed":
                    events.append(f"{pid} value changed: {prev_val} → {curr_val}")

                # Detect Hole Topology Changes
                if prev_h1 and new_h1 and prev_h1 != new_h1 and new_map_conf >= 0.7:
                    events.append(f"{pid} terminal moved from {prev_h1} to {new_h1}")

                # Update memory
                self.tracked_memory[pid] = updated
                matched_results.append(updated)

            else:
                # Newly detected component
                new_id = det.get("designator") or det.get("id") or f"comp_{self.frame_count}_{len(matched_results)}"
                
                # Check for ID conflict in memory
                if new_id in self.tracked_memory:
                    prefix = new_id[0] if new_id[0].isalpha() else "C"
                    max_num = 1
                    for k in self.tracked_memory.keys():
                        if k.startswith(prefix):
                            try:
                                num = int(k[len(prefix):])
                                if num >= max_num:
                                    max_num = num + 1
                            except ValueError:
                                pass
                    new_id = f"{prefix}{max_num}"

                c_box = [int(round(x)) for x in c_bbox]
                new_comp = dict(det)
                new_comp["id"] = new_id
                new_comp["designator"] = new_id
                new_comp["bbox"] = c_box
                new_comp["bbox_pixels"] = c_box
                new_comp["center_x"] = (c_box[0] + c_box[2]) / 2.0
                new_comp["center_y"] = (c_box[1] + c_box[3]) / 2.0
                new_comp["tracking_state"] = "DETECTED"
                new_comp["tracking_confidence"] = det.get("confidence", 0.9)
                new_comp["last_seen_frame"] = self.frame_count
                new_comp["consecutive_lost_frames"] = 0
                new_comp["timestamp"] = now

                newly_detected_comps.append(new_comp)
                matched_results.append(new_comp)
                events.append(f"New component {new_id} ({ctype}) detected")

        # Add newly detected components to tracked_memory
        for nc in newly_detected_comps:
            self.tracked_memory[nc["id"]] = nc

        # Check for components in existing memory that were not detected in this frame
        unmatched_ids = [pid for pid in existing_memory_ids if pid not in matched_prev_ids]
        for pid in unmatched_ids:
            p = self.tracked_memory[pid]
            lost_count = p.get("consecutive_lost_frames", 0) + 1
            p["consecutive_lost_frames"] = lost_count

            if lost_count <= self.max_lost_frames:
                # Retain in memory as LOST state (do not delete yet)
                p["tracking_state"] = "LOST"
                matched_results.append(p)
                if lost_count == 1:
                    events.append(f"Component {pid} ({p.get('type')}) removed / temporarily lost")
            else:
                # Timeout exceeded: permanently remove from tracking memory
                events.append(f"Component {pid} ({p.get('type')}) removed")
                del self.tracked_memory[pid]

        if not events and self.frame_count == 1:
            events.append("Physical circuit scan initialized")

        return matched_results, events


# Global singleton instance for session-less calls
_global_tracker = LiveComponentTracker()


def match_components_spatially(
    current_components: List[Dict[str, Any]],
    previous_components: List[Dict[str, Any]],
    distance_threshold: float = 120.0
) -> Tuple[List[Dict[str, Any]], List[str]]:
    """
    Backward-compatible functional API wrapping LiveComponentTracker.
    Preserves stable designator IDs (R1, LED1, W1) and detects change events.
    """
    tracker = LiveComponentTracker(distance_threshold=distance_threshold)
    prev_state = {"components": previous_components} if previous_components else None
    return tracker.process_frame(current_components, prev_state)
