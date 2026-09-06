"""
SmartBreadboard 3D — OpenCV Preprocessing Module (Phase 9 Real CV Pipeline)
Performs image decoding, 4-corner detection, homography perspective transform,
CLAHE contrast enhancement, and output normalization.
"""

import cv2
import numpy as np
import base64

def order_points(pts: np.ndarray) -> np.ndarray:
    """
    Orders 4 coordinates as: top-left, top-right, bottom-right, bottom-left
    """
    rect = np.zeros((4, 2), dtype="float32")
    s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)] # Top-left has smallest sum
    rect[2] = pts[np.argmax(s)] # Bottom-right has largest sum

    diff = np.diff(pts, axis=1)
    rect[1] = pts[np.argmin(diff)] # Top-right has smallest difference
    rect[3] = pts[np.argmax(diff)] # Bottom-left has largest difference
    return rect

def find_breadboard_corners(cv_img: np.ndarray) -> tuple[np.ndarray | None, list]:
    """
    Detects outer rectangular contour of breadboard in image using edge & contour analysis.
    """
    gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # Canny edge detection & Dilate
    edged = cv2.Canny(blurred, 30, 150)
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    dilated = cv2.dilate(edged, kernel, iterations=1)

    contours, _ = cv2.findContours(dilated.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    if not contours:
        return None, []

    # Sort contours by area descending
    contours = sorted(contours, key=cv2.contourArea, reverse=True)

    img_area = cv_img.shape[0] * cv_img.shape[1]

    for c in contours[:5]:
        peri = cv2.arcLength(c, True)
        approx = cv2.approxPolyDP(c, 0.02 * peri, True)

        # Check if contour is a 4-sided convex polygon with sufficient area (> 15% of image)
        if len(approx) == 4 and cv2.contourArea(c) > (0.15 * img_area):
            pts = approx.reshape(4, 2)
            rect = order_points(pts)
            corners_list = [[float(p[0]), float(p[1])] for p in rect]
            return rect, corners_list

    return None, []

def warp_breadboard_perspective(cv_img: np.ndarray, rect: np.ndarray, target_w=800, target_h=300) -> np.ndarray:
    """
    Applies perspective transformation matrix (cv2.warpPerspective) to rectify skewed photos.
    """
    dst = np.array([
        [0, 0],
        [target_w - 1, 0],
        [target_w - 1, target_h - 1],
        [0, target_h - 1]
    ], dtype="float32")

    M = cv2.getPerspectiveTransform(rect, dst)
    warped = cv2.warpPerspective(cv_img, M, (target_w, target_h))
    return warped

def enhance_breadboard_contrast(cv_img: np.ndarray) -> np.ndarray:
    """
    Applies CLAHE (Contrast Limited Adaptive Histogram Equalization) for pin/lead visibility.
    """
    lab = cv2.cvtColor(cv_img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    cl = clahe.apply(l)
    limg = cv2.merge((cl, a, b))
    enhanced = cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)
    return enhanced

def preprocess_breadboard_image(image_input: bytes | str) -> dict:
    """
    Main entry point for Phase 9 OpenCV Preprocessing.
    Accepts image bytes or base64 data URL string.
    Returns normalized 800x300 image base64, status, dimensions, and corner metadata.
    """
    try:
        # Decode base64 or raw bytes
        if isinstance(image_input, str):
            if ',' in image_input:
                image_input = image_input.split(',')[1]
            image_bytes = base64.b64decode(image_input)
        else:
            image_bytes = image_input

        nparr = np.frombuffer(image_bytes, np.uint8)
        cv_img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if cv_img is None:
            return {
                "status": "error",
                "error": "Failed to decode image bytes into valid OpenCV image matrix.",
                "perspective_corrected": False
            }

        orig_h, orig_w = cv_img.shape[:2]

        # Step 1: Attempt 4-corner detection
        rect, corners_list = find_breadboard_corners(cv_img)

        perspective_corrected = False
        if rect is not None:
            # Step 2: Apply Homography perspective transform
            normalized_img = warp_breadboard_perspective(cv_img, rect, target_w=800, target_h=300)
            perspective_corrected = True
        else:
            # Fallback: Resize to normalized 800x300 if corners not isolated
            normalized_img = cv2.resize(cv_img, (800, 300), interpolation=cv2.INTER_AREA)

        # Step 3: Enhance contrast for lead/hole clarity
        enhanced_img = enhance_breadboard_contrast(normalized_img)

        # Step 4: Encode normalized result to JPEG Base64
        _, buffer = cv2.imencode('.jpg', enhanced_img, [int(cv2.IMWRITE_JPEG_QUALITY), 92])
        norm_b64 = base64.b64encode(buffer).decode('utf-8')

        norm_h, norm_w = enhanced_img.shape[:2]

        return {
            "status": "preprocessed",
            "perspective_corrected": perspective_corrected,
            "original_dimensions": {"width": orig_w, "height": orig_h},
            "normalized_dimensions": {"width": norm_w, "height": norm_h},
            "detected_corners": corners_list,
            "normalized_image_base64": f"data:image/jpeg;base64,{norm_b64}"
        }

    except Exception as e:
        return {
            "status": "error",
            "error": f"OpenCV processing failure: {str(e)}",
            "perspective_corrected": False
        }
