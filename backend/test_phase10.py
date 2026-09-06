"""
Phase 10 Component Detection Verification Script
Tests real image input, Phase 9 normalized stream integration, component localization,
bounding box coordinates, confidence scoring, confidence warning flags, and image crop extraction.
"""

import os
import sys
import base64
import cv2

sys.path.insert(0, os.path.dirname(__file__))

from cv.preprocessing import preprocess_breadboard_image
from cv.yolo_detector import detect_components_yolo

def test_phase10():
    photo_path = 'e:/CIRCUIT STIMULATOR/backend/test_assets/real_breadboard_photo.jpg'
    if not os.path.exists(photo_path):
        print(f"Error: {photo_path} not found.")
        return

    with open(photo_path, 'rb') as f:
        raw_bytes = f.read()

    print("================================================================")
    print("           PHASE 10 COMPONENT DETECTION TEST                    ")
    print("================================================================")
    print(f"Input Asset: {photo_path}")

    # Step 1: Run Phase 9 Preprocessing
    prep_res = preprocess_breadboard_image(raw_bytes)
    print(f"Phase 9 Preprocessing Status: {prep_res.get('status')}")
    print(f"Perspective Corrected: {prep_res.get('perspective_corrected')}")

    norm_b64 = prep_res.get('normalized_image_base64')
    if not norm_b64:
        print("❌ Failed to get Phase 9 preprocessed Base64 stream.")
        return

    # Step 2: Run Phase 10 Component Detection on Normalized Image Stream
    det_res = detect_components_yolo(norm_b64)

    print("\n--- Phase 10 Detection Results ---")
    print(f"Status: {det_res.get('status')}")
    print(f"Model Source: {det_res.get('source')}")
    print(f"Model Version: {det_res.get('model_version')}")
    print(f"Detections Count: {det_res.get('detections_count')}")

    detections = det_res.get('detections', [])
    for idx, d in enumerate(detections, 1):
        print(f"\nComponent #{idx}:")
        print(f"  • ID: {d.get('id')}")
        print(f"  • Class: {d.get('class')}")
        print(f"  • Confidence: {d.get('confidence')}")
        print(f"  • Confidence Warning Flag: {d.get('confidence_warning')}")
        print(f"  • Bounding Box (Pixels): {d.get('bbox_pixels')}")
        print(f"  • Bounding Box (Normalized): {d.get('bbox_normalized')}")
        has_crop = bool(d.get('crop_base64', '').startswith('data:image/png;base64,'))
        print(f"  • Crop Base64 Generated: {has_crop}")

    if det_res.get('status') == 'detected' and len(detections) > 0:
        print("\n[SUCCESS] PHASE 10 COMPONENT DETECTION TEST PASSED CLEANLY!")
    else:
        print("\n[FAIL] PHASE 10 COMPONENT DETECTION TEST FAILED!")

if __name__ == "__main__":
    test_phase10()
