"""
SmartBreadboard 3D — Circuit Vision Verification & False-Positive Rejection Agent (Phase 18)
Validates YOLO candidate hypotheses through deterministic physical, geometric, ROI,
terminal-mapping, duplicate suppression, and temporal consistency checks.

Categorizes all raw hypotheses into:
- VERIFIED: Validated physical component -> automatic netlist, MNA, and 3D scene
- UNKNOWN: Ambiguous/low-confidence candidate -> Phase 17 manual component recovery
- REJECTED: False detection / duplicate / background -> strictly excluded from netlist and 3D
"""

import math
import cv2
import numpy as np
from typing import List, Dict, Any, Tuple, Optional
from cv.breadboard_grid import (
    get_breadboard_homography,
    ALL_CANONICAL_HOLES,
    CANONICAL_W,
    CANONICAL_H,
    extract_component_lead_positions_verbose
)

# Centralized, transparent configuration
VISION_VERIFY_CONFIG = {
    # Confidence thresholds
    "high_confidence": 0.65,
    "unknown_confidence": 0.35,
    "reject_confidence": 0.25,

    # Duplicate / IoU overlap thresholds
    "duplicate_iou_threshold": 0.40,
    "containment_threshold": 0.65,

    # Breadboard ROI margin ratio (percentage of breadboard dimensions)
    "roi_margin_ratio": 0.12,

    # Bounding box physical dimension constraints
    "min_bbox_area_px": 50,
    "min_bbox_dimension_px": 6,
    "max_bbox_area_ratio": 0.60, # Max fraction of breadboard area

    # Plausible aspect ratio ranges (max_dim / min_dim)
    "aspect_ratios": {
        "resistor": {"min_ratio": 1.20, "max_ratio": 20.0},
        "diode_rectifier": {"min_ratio": 1.15, "max_ratio": 20.0},
        "wire": {"min_ratio": 1.10, "max_ratio": 30.0},
        "led": {"min_ratio": 0.80, "max_ratio": 4.5},
        "ic_chip": {"min_ratio": 0.80, "max_ratio": 4.0},
        "capacitor": {"min_ratio": 0.80, "max_ratio": 4.5}
    },

    # Weights for transparent verification score (sums to 1.0)
    "weights": {
        "confidence": 0.25,
        "roi": 0.25,
        "geometry": 0.15,
        "terminal": 0.20,
        "temporal": 0.15
    },

    # Overall verification score thresholds
    "verified_score_threshold": 0.60,
    "unknown_score_threshold": 0.35
}


def calculate_box_iou(boxA: list, boxB: list) -> float:
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


def calculate_box_containment(boxA: list, boxB: list) -> float:
    """Calculates intersection area relative to smaller box area."""
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

    minArea = min(boxAArea, boxBArea)
    if minArea <= 0:
        return 0.0

    return float(interArea / minArea)


def get_breadboard_polygon_pixels(img_w: int = 1280, img_h: int = 850, margin_ratio: float = 0.12) -> np.ndarray:
    """
    Computes projected image coordinates of the breadboard outer polygon with optional margin.
    """
    H_canon_to_img, _ = get_breadboard_homography(img_w, img_h)

    # Expanded canonical coordinates
    margin_x = CANONICAL_W * margin_ratio
    margin_y = CANONICAL_H * margin_ratio

    canon_corners = np.array([
        [[-margin_x, -margin_y]],
        [[CANONICAL_W + margin_x, -margin_y]],
        [[CANONICAL_W + margin_x, CANONICAL_H + margin_y]],
        [[-margin_x, CANONICAL_H + margin_y]]
    ], dtype=np.float32)

    img_corners = cv2.perspectiveTransform(canon_corners, H_canon_to_img)
    pts = img_corners.reshape((-1, 2)).astype(np.int32)
    return pts


class CircuitVisionVerifier:
    """
    Deterministic Verification & False-Positive Rejection Agent.
    Evaluates candidate hypotheses from YOLO before they reach the netlist or 3D engine.
    """

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or VISION_VERIFY_CONFIG

    def check_breadboard_roi(
        self,
        bbox: List[int],
        img_w: int,
        img_h: int,
        breadboard_poly: Optional[np.ndarray] = None
    ) -> Tuple[bool, float, str]:
        """
        Check 1: BREADBOARD ROI CHECK
        Rejects detections clearly outside the physical breadboard boundaries.
        Returns: (is_inside, roi_score, reason)
        """
        if breadboard_poly is None:
            breadboard_poly = get_breadboard_polygon_pixels(img_w, img_h, self.config.get("roi_margin_ratio", 0.12))

        x1, y1, x2, y2 = bbox
        cx = (x1 + x2) / 2.0
        cy = (y1 + y2) / 2.0

        # Point in polygon test on candidate center
        dist_center = cv2.pointPolygonTest(breadboard_poly, (float(cx), float(cy)), measureDist=True)
        
        # Test all 4 corners
        corners = [(x1, y1), (x2, y1), (x2, y2), (x1, y2)]
        inside_corners = sum(1 for (px, py) in corners if cv2.pointPolygonTest(breadboard_poly, (float(px), float(py)), False) >= 0)

        if dist_center >= 0:
            roi_score = 1.0 if inside_corners >= 3 else 0.80
            return True, roi_score, "inside_breadboard_roi"
        elif dist_center >= -15.0: # Near margin boundary
            roi_score = 0.50
            return True, roi_score, "near_breadboard_boundary"
        else:
            return False, 0.0, "outside_breadboard_roi"

    def check_geometry_and_size(
        self,
        bbox: List[int],
        cls_name: str,
        img_w: int,
        img_h: int
    ) -> Tuple[bool, float, List[str]]:
        """
        Check 3 & 6: GEOMETRY & COMPONENT SIZE SANITY
        Validates aspect ratio, minimum size, and maximum size for predicted class.
        Returns: (is_valid, geo_score, reasons)
        """
        x1, y1, x2, y2 = bbox
        bw = max(0, x2 - x1)
        bh = max(0, y2 - y1)
        area = bw * bh

        reasons = []
        min_dim = self.config.get("min_bbox_dimension_px", 6)
        min_area = self.config.get("min_bbox_area_px", 50)

        # 1. Degenerate size check
        if bw < min_dim or bh < min_dim or area < min_area:
            return False, 0.0, ["degenerate_bbox_size"]

        # 2. Oversized bounding box check
        max_ratio = self.config.get("max_bbox_area_ratio", 0.60)
        total_img_area = max(1, img_w * img_h)
        if (area / total_img_area) > max_ratio:
            return False, 0.0, ["oversized_bbox"]

        # 3. Aspect ratio check
        c_norm = cls_name.lower()
        if "resistor" in c_norm:
            c_key = "resistor"
        elif "diode" in c_norm:
            c_key = "diode_rectifier"
        elif "wire" in c_norm or "jumper" in c_norm:
            c_key = "wire"
        elif "led" in c_norm:
            c_key = "led"
        elif "ic" in c_norm or "chip" in c_norm:
            c_key = "ic_chip"
        elif "cap" in c_norm:
            c_key = "capacitor"
        else:
            c_key = "resistor"

        aspect_cfg = self.config.get("aspect_ratios", {}).get(c_key, {"min_ratio": 1.0, "max_ratio": 20.0})
        major_dim = max(bw, bh)
        minor_dim = max(1, min(bw, bh))
        aspect_ratio = major_dim / float(minor_dim)

        geo_score = 1.0
        if aspect_ratio < aspect_cfg["min_ratio"]:
            # Too squarish for an elongated component
            geo_score = max(0.4, 1.0 - (aspect_cfg["min_ratio"] - aspect_ratio) * 0.5)
            reasons.append("unusual_aspect_ratio")
        elif aspect_ratio > aspect_cfg["max_ratio"]:
            geo_score = max(0.3, 1.0 - (aspect_ratio - aspect_cfg["max_ratio"]) * 0.1)
            reasons.append("extreme_aspect_ratio")
        else:
            reasons.append("valid_geometry")

        return (geo_score >= 0.4), round(geo_score, 2), reasons

    def check_terminal_mapping(
        self,
        bbox: List[int],
        cls_name: str,
        img_w: int,
        img_h: int
    ) -> Tuple[bool, float, Dict[str, Any], List[str]]:
        """
        Check 4: BREADBOARD HOLE / TERMINAL CHECK
        Maps candidate terminals to canonical breadboard holes.
        Returns: (is_valid, terminal_score, lead_info, reasons)
        """
        lead_info = extract_component_lead_positions_verbose(bbox, cls_name, img_w=img_w, img_h=img_h)
        map_conf = lead_info.get("mapping_confidence", 0.0)
        is_uncertain = lead_info.get("is_uncertain", False)
        dist1 = lead_info.get("dist1_mm", 999.0)
        dist2 = lead_info.get("dist2_mm", 999.0)
        h1 = lead_info.get("hole1", "")
        h2 = lead_info.get("hole2", "")

        reasons = []
        if h1 in ALL_CANONICAL_HOLES and h2 in ALL_CANONICAL_HOLES and dist1 <= 20.0 and dist2 <= 20.0:
            terminal_score = max(0.70, map_conf)
            reasons.append("valid_terminal_mapping")
            return True, round(terminal_score, 2), lead_info, reasons
        elif h1 in ALL_CANONICAL_HOLES and h2 in ALL_CANONICAL_HOLES and (dist1 <= 28.0 or dist2 <= 28.0):
            terminal_score = max(0.40, map_conf)
            reasons.append("marginal_terminal_mapping")
            return True, round(terminal_score, 2), lead_info, reasons
        else:
            reasons.append("terminals_outside_breadboard_grid")
            return False, 0.20, lead_info, reasons

    def check_temporal_consistency(
        self,
        candidate_bbox: List[int],
        cls_name: str,
        previous_tracking: Optional[List[Dict[str, Any]]] = None
    ) -> Tuple[float, List[str]]:
        """
        Check 7: TEMPORAL CONSISTENCY
        Integrates with previous tracking state.
        Returns: (temporal_score, reasons)
        """
        if not previous_tracking:
            return 0.70, ["initial_frame_detection"]

        c_cx = (candidate_bbox[0] + candidate_bbox[2]) / 2.0
        c_cy = (candidate_bbox[1] + candidate_bbox[3]) / 2.0

        for prev in previous_tracking:
            p_bbox = prev.get("bbox") or prev.get("bbox_pixels") or [0, 0, 10, 10]
            p_cx = (p_bbox[0] + p_bbox[2]) / 2.0
            p_cy = (p_bbox[1] + p_bbox[3]) / 2.0
            p_type = str(prev.get("type") or prev.get("class") or "").lower()

            dist = math.sqrt((c_cx - p_cx) ** 2 + (c_cy - p_cy) ** 2)
            iou = calculate_box_iou(candidate_bbox, p_bbox)

            if dist < 80.0 or iou > 0.30:
                if p_type == cls_name.lower():
                    # Consistently observed component
                    state = prev.get("tracking_state", "TRACKED")
                    if state in ["TRACKED", "REACQUIRED"]:
                        return 1.0, ["temporally_stable_and_tracked"]
                    return 0.85, ["temporally_consistent"]
                else:
                    # Class unstable across frames
                    return 0.35, ["class_flip_detected"]

        # New candidate in this frame
        return 0.65, ["new_frame_candidate"]

    def suppress_duplicates(
        self,
        evaluated_candidates: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Check 5: DUPLICATE / OVERLAP CHECK
        Eliminates duplicate overlapping bounding boxes across classes.
        Retains the candidate with the highest verification score / confidence.
        Marks duplicate candidates as REJECTED with explainable reason.
        """
        if not evaluated_candidates:
            return []

        # Sort descending by tentative verification score and confidence
        sorted_cands = sorted(
            evaluated_candidates,
            key=lambda c: (c.get("verification_score", 0.0), c.get("confidence", 0.0)),
            reverse=True
        )

        iou_thresh = self.config.get("duplicate_iou_threshold", 0.40)
        contain_thresh = self.config.get("containment_threshold", 0.65)

        accepted_boxes: List[Dict[str, Any]] = []

        for cand in sorted_cands:
            c_box = cand["bbox"]
            is_dup = False
            dup_target = None

            for acc in accepted_boxes:
                # If already rejected by previous checks (e.g. outside ROI), do not block other candidates
                if acc.get("verification") == "REJECTED":
                    continue

                acc_box = acc["bbox"]
                iou = calculate_box_iou(c_box, acc_box)
                containment = calculate_box_containment(c_box, acc_box)

                if iou >= iou_thresh or containment >= contain_thresh:
                    is_dup = True
                    dup_target = acc.get("detection_id") or acc.get("id")
                    break

            if is_dup:
                cand["verification"] = "REJECTED"
                cand["reasons"].append(f"duplicate_overlap_with_{dup_target}")
                cand["is_duplicate"] = True
                cand["verification_score"] = round(cand.get("verification_score", 0.0) * 0.3, 2)
            else:
                cand["is_duplicate"] = False

            accepted_boxes.append(cand)

        return accepted_boxes

    def verify_candidates(
        self,
        raw_detections: List[Dict[str, Any]],
        img_w: int = 1280,
        img_h: int = 850,
        previous_tracking: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """
        Main entry point for Circuit Vision Verification.
        Processes raw YOLO detections through multi-stage deterministic checks.
        Returns:
            - verified: List of VERIFIED components
            - unknown: List of UNKNOWN components (for Phase 17 manual recovery)
            - rejected: List of REJECTED false positives
            - all_candidates: Full audited candidate list with verification metrics
            - summary: Metric counts (raw_count, verified_count, unknown_count, rejected_count)
        """
        weights = self.config.get("weights", VISION_VERIFY_CONFIG["weights"])
        breadboard_poly = get_breadboard_polygon_pixels(img_w, img_h, self.config.get("roi_margin_ratio", 0.12))

        evaluated = []

        for idx, det in enumerate(raw_detections, 1):
            det_id = det.get("id") or f"det_{idx:03d}"
            cls_name = det.get("class") or det.get("class_name") or "resistor"
            conf = float(det.get("confidence", 0.50))
            bbox = det.get("bbox_pixels") or det.get("bbox") or [0, 0, 10, 10]
            crop_b64 = det.get("crop_base64") or det.get("crop_b64")

            reasons: List[str] = []

            # 1. Breadboard ROI Check
            roi_ok, roi_score, roi_reason = self.check_breadboard_roi(bbox, img_w, img_h, breadboard_poly)
            reasons.append(roi_reason)

            # 2. Geometry & Size Check
            geo_ok, geo_score, geo_reasons = self.check_geometry_and_size(bbox, cls_name, img_w, img_h)
            reasons.extend(geo_reasons)

            # 3. Terminal & Lead Mapping Check
            term_ok, term_score, lead_info, term_reasons = self.check_terminal_mapping(bbox, cls_name, img_w, img_h)
            reasons.extend(term_reasons)

            # 4. Temporal Consistency Check
            temp_score, temp_reasons = self.check_temporal_consistency(bbox, cls_name, previous_tracking)
            reasons.extend(temp_reasons)

            # 5. Calculate Weighted Verification Score
            conf_score = min(1.0, conf)
            weighted_score = (
                weights["confidence"] * conf_score +
                weights["roi"] * roi_score +
                weights["geometry"] * geo_score +
                weights["terminal"] * term_score +
                weights["temporal"] * temp_score
            )
            weighted_score = round(weighted_score, 3)

            # Check for class flipping / temporal instability
            is_class_flipped = "class_flip_detected" in temp_reasons

            # Determine Verification State
            # Fatal rejection conditions
            if not roi_ok:
                verification = "REJECTED"
                reasons.append("rejection:outside_breadboard_boundary")
            elif not geo_ok:
                verification = "REJECTED"
                reasons.append("rejection:invalid_geometry_or_size")
            elif conf < self.config.get("reject_confidence", 0.25):
                verification = "REJECTED"
                reasons.append("rejection:below_minimum_confidence")
            elif is_class_flipped:
                verification = "UNKNOWN"
                reasons.append("unknown:temporal_class_instability")
            elif not term_ok:
                if conf >= self.config.get("high_confidence", 0.65):
                    verification = "UNKNOWN"
                    reasons.append("unknown:unresolved_terminals")
                else:
                    verification = "REJECTED"
                    reasons.append("rejection:unresolved_terminals_and_low_confidence")
            elif conf < self.config.get("unknown_confidence", 0.35):
                verification = "UNKNOWN"
                reasons.append("unknown:marginal_confidence")
            elif conf < self.config.get("high_confidence", 0.65) and temp_score < 0.80:
                verification = "UNKNOWN"
                reasons.append("unknown:moderate_confidence_requires_confirmation")
            elif weighted_score >= self.config.get("verified_score_threshold", 0.60) and conf >= self.config.get("high_confidence", 0.65):
                verification = "VERIFIED"
                reasons.append("verified:passed_all_vision_checks")
            elif weighted_score >= self.config.get("verified_score_threshold", 0.60) and temp_score >= 0.85:
                verification = "VERIFIED"
                reasons.append("verified:temporally_confirmed_tracking")
            elif weighted_score >= self.config.get("unknown_score_threshold", 0.35):
                verification = "UNKNOWN"
                reasons.append("unknown:requires_user_confirmation")
            else:
                verification = "REJECTED"
                reasons.append("rejection:low_composite_verification_score")

            cand_obj = {
                "detection_id": det_id,
                "id": det_id,
                "class": cls_name,
                "class_name": cls_name,
                "type": cls_name,
                "confidence": round(conf, 2),
                "bbox": bbox,
                "bbox_pixels": bbox,
                "crop_base64": crop_b64,
                "lead_info": lead_info,
                "hole1": lead_info.get("hole1", "A1"),
                "hole2": lead_info.get("hole2", "A2"),
                "start_hole": lead_info.get("hole1", "A1"),
                "end_hole": lead_info.get("hole2", "A2"),
                "mapping_confidence": lead_info.get("mapping_confidence", 0.0),
                "is_uncertain": lead_info.get("is_uncertain", False),
                "sub_scores": {
                    "roi_score": roi_score,
                    "geometry_score": geo_score,
                    "terminal_score": term_score,
                    "temporal_score": temp_score,
                    "confidence_score": conf_score
                },
                "verification_score": weighted_score,
                "verification": verification,
                "reasons": reasons
            }
            evaluated.append(cand_obj)

        # 6. Apply Duplicate / Cross-Class Overlap Suppression
        deduped_candidates = self.suppress_duplicates(evaluated)

        verified_list = [c for c in deduped_candidates if c["verification"] == "VERIFIED"]
        unknown_list = [c for c in deduped_candidates if c["verification"] == "UNKNOWN"]
        rejected_list = [c for c in deduped_candidates if c["verification"] == "REJECTED"]

        return {
            "status": "success",
            "raw_yolo_count": len(raw_detections),
            "verified_count": len(verified_list),
            "unknown_count": len(unknown_list),
            "rejected_count": len(rejected_list),
            "verified": verified_list,
            "unknown": unknown_list,
            "rejected": rejected_list,
            "all_candidates": deduped_candidates,
            "summary": {
                "raw_count": len(raw_detections),
                "verified_count": len(verified_list),
                "unknown_count": len(unknown_list),
                "rejected_count": len(rejected_list)
            }
        }


# Global singleton instance
_global_verifier = CircuitVisionVerifier()


def verify_circuit_vision_candidates(
    raw_detections: List[Dict[str, Any]],
    img_w: int = 1280,
    img_h: int = 850,
    previous_tracking: Optional[List[Dict[str, Any]]] = None
) -> Dict[str, Any]:
    """
    Standard functional API for Circuit Vision Verification Agent.
    """
    return _global_verifier.verify_candidates(
        raw_detections=raw_detections,
        img_w=img_w,
        img_h=img_h,
        previous_tracking=previous_tracking
    )
