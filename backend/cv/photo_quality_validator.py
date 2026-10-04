"""
SmartBreadboard 3D — Single-Photo Top-Angle & Image Quality Validator (Scanner Phase)
Evaluates:
- Image brightness & exposure
- Image sharpness & blur
- Image contrast
- Breadboard / circuit framing & coverage
- Perspective & top-down viewing angle
- Detectable circuit evidence

Returns:
{
    "valid": bool,
    "score": int (0-100),
    "reasons": list[str],
    "recommendations": list[str],
    "metrics": {
        "top_angle": "GOOD" | "POOR",
        "circuit_visibility": "GOOD" | "POOR",
        "image_quality": "GOOD" | "POOR"
    }
}
"""

import cv2
import numpy as np
from typing import Dict, Any, List

def validate_photo_quality(img: np.ndarray, expected_view: str = "top") -> Dict[str, Any]:
    """
    Validates a captured or uploaded single circuit image against practical top-angle,
    framing, sharpness, brightness, and circuit-evidence criteria.
    """
    if img is None or not isinstance(img, np.ndarray) or img.size == 0:
        return {
            "valid": False,
            "score": 0,
            "reasons": ["Invalid or missing image data."],
            "recommendations": ["Please capture or upload a clear circuit photo."],
            "metrics": {
                "top_angle": "POOR",
                "circuit_visibility": "POOR",
                "image_quality": "POOR",
                "sharpness": 0.0,
                "brightness": 0.0,
                "contrast": 0.0
            },
            "ready": False,
            "board_detected": False,
            "suggested_guidance": "Please present a clear view of the circuit to the camera."
        }

    h, w = img.shape[:2]
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) if len(img.shape) == 3 else img

    reasons: List[str] = []
    recommendations: List[str] = []

    # 1. Brightness & Exposure check
    mean_brightness = float(np.mean(gray))
    if mean_brightness < 40.0:
        reasons.append("Lighting is too dark to clearly see circuit components.")
        recommendations.append("Increase lighting or move to a brighter area.")
    elif mean_brightness > 230.0:
        reasons.append("Image is overexposed or washed out.")
        recommendations.append("Reduce harsh glare or diffuse the light source.")

    # 2. Sharpness & Blur check (Laplacian variance)
    sharpness = float(cv2.Laplacian(gray, cv2.CV_64F).var())
    if sharpness < 22.0:
        reasons.append("Image is too blurry for reliable circuit detection.")
        recommendations.append("Hold the camera steady and tap to focus directly on the breadboard.")

    # 3. Contrast check
    contrast = float(np.std(gray))
    if contrast < 16.0:
        reasons.append("Insufficient contrast between circuit and background.")
        recommendations.append("Ensure the circuit is placed on a contrasting surface.")

    # 4. Circuit Evidence & Edge Density
    edges = cv2.Canny(gray, 40, 140)
    edge_density = float(np.count_nonzero(edges)) / float(gray.size)

    # 5. Breadboard / Circuit Geometry, Framing, and Top-Angle Skew
    from cv.preprocessing import find_breadboard_corners

    rect, corners_list = find_breadboard_corners(img)

    if rect is not None:
        pts = rect # [tl, tr, br, bl]
        # Top width vs Bottom width
        w_top = float(np.linalg.norm(pts[1] - pts[0]))
        w_bot = float(np.linalg.norm(pts[2] - pts[3]))
        h_left = float(np.linalg.norm(pts[3] - pts[0]))
        h_right = float(np.linalg.norm(pts[2] - pts[1]))

        max_w = max(w_top, w_bot)
        min_w = min(w_top, w_bot)
        max_h = max(h_left, h_right)
        min_h = min(h_left, h_right)

        w_ratio = min_w / max_w if max_w > 0 else 1.0
        h_ratio = min_h / max_h if max_h > 0 else 1.0
        perspective_ratio = min(w_ratio, h_ratio)

        # Side angle / tilt threshold (reject severe trapezoidal skew)
        if perspective_ratio < 0.55:
            reasons.append("Circuit is viewed from a strong side angle.")
            recommendations.append("Move the camera directly above the circuit (top-down view).")

        # Framing / Margin check (corners close to boundary)
        margin_x = 8
        margin_y = 8
        min_x = float(np.min(pts[:, 0]))
        max_x = float(np.max(pts[:, 0]))
        min_y = float(np.min(pts[:, 1]))
        max_y = float(np.max(pts[:, 1]))

        if min_x < margin_x or min_y < margin_y or max_x > (w - margin_x) or max_y > (h - margin_y):
            reasons.append("Circuit is partially outside the frame or heavily cropped.")
            recommendations.append("Keep the complete circuit inside the frame with some margin around the edges.")

        # Breadboard Coverage check
        bb_area = float(cv2.contourArea(pts.astype(np.int32)))
        area_ratio = bb_area / float(w * h)
        if area_ratio < 0.10:
            reasons.append("Circuit occupies too small a portion of the frame.")
            recommendations.append("Move the camera closer so the circuit fills more of the frame.")
    else:
        # If no strict 4-corner breadboard is detected, check general contours and edge density
        if edge_density < 0.012:
            reasons.append("No recognizable circuit or breadboard detected in the photo.")
            recommendations.append("Ensure the circuit is clearly visible in the center of the camera.")
        else:
            # Check bounding contour of prominent features
            contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            if contours:
                large_contours = [c for c in contours if cv2.contourArea(c) > (0.04 * w * h)]
                if large_contours:
                    all_pts = np.vstack(large_contours)
                    bx, by, bw, bh = cv2.boundingRect(all_pts)
                    if bx < 6 or by < 6 or (bx + bw) > (w - 6) or (by + bh) > (h - 6):
                        reasons.append("Circuit is partially outside the frame.")
                        recommendations.append("Center the circuit inside the camera frame.")
                else:
                    reasons.append("Circuit features are too faint or small.")
                    recommendations.append("Bring the camera closer and center the circuit.")
            else:
                reasons.append("No recognizable circuit or breadboard detected in the photo.")
                recommendations.append("Ensure the circuit is clearly visible in the center of the camera.")

    # Calculate overall validity and score
    valid = len(reasons) == 0

    if valid:
        # High quality score between 75 and 96
        base_score = 78
        sharp_bonus = min(10, int(sharpness / 12.0))
        contrast_bonus = min(8, int(contrast / 10.0))
        score = min(96, base_score + sharp_bonus + contrast_bonus)
    else:
        # Penalty score based on severity
        score = max(15, min(52, 60 - len(reasons) * 15))

    top_angle_status = "POOR" if any("angle" in r or "perspective" in r for r in reasons) else "GOOD"
    circuit_vis_status = "POOR" if any("outside" in r or "cropped" in r or "small" in r or "No recognizable" in r or "faint" in r for r in reasons) else "GOOD"
    image_qual_status = "POOR" if any("blurry" in r or "dark" in r or "overexposed" in r or "contrast" in r for r in reasons) else "GOOD"

    return {
        "valid": valid,
        "score": score,
        "reasons": reasons,
        "recommendations": recommendations,
        "metrics": {
            "top_angle": top_angle_status,
            "circuit_visibility": circuit_vis_status,
            "image_quality": image_qual_status,
            "sharpness": round(sharpness, 1),
            "brightness": round(mean_brightness, 1),
            "contrast": round(contrast, 1)
        },
        "ready": valid,
        "board_detected": valid or ("No recognizable circuit" not in " ".join(reasons)),
        "angle_valid": top_angle_status == "GOOD",
        "framing_valid": circuit_vis_status == "GOOD",
        "sharpness_valid": sharpness >= 22.0,
        "lighting_valid": 40.0 <= mean_brightness <= 230.0,
        "suggested_guidance": recommendations[0] if recommendations else "Circuit view accepted."
    }
