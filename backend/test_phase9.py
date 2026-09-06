"""
Automated Verification Script for Phase 9 OpenCV Preprocessing Engine
Tests real image input, corner detection, perspective warping, and image normalization.
"""

import os
import sys
import base64
import cv2

# Add backend directory to path
sys.path.insert(0, os.path.dirname(__file__))

from cv.preprocessing import preprocess_breadboard_image
from create_test_image import generate_sample_breadboard

def run_test():
    test_img_path = 'e:/CIRCUIT STIMULATOR/backend/test_assets/sample_breadboard.png'
    if not os.path.exists(test_img_path):
        generate_sample_breadboard()

    # Read original image bytes
    with open(test_img_path, 'rb') as f:
        img_bytes = f.read()

    orig_img = cv2.imread(test_img_path)
    orig_h, orig_w = orig_img.shape[:2]

    print("==================================================")
    print("      PHASE 9 OPENCV PREPROCESSING TEST          ")
    print("==================================================")
    print(f"Test Input Asset: {test_img_path}")
    print(f"Original Input Dimensions: {orig_w} x {orig_h} pixels")

    # Run Real OpenCV Preprocessing
    result = preprocess_breadboard_image(img_bytes)

    print("\n--- OpenCV Processing Results ---")
    print(f"Status: {result.get('status')}")
    print(f"Perspective Corrected: {result.get('perspective_corrected')}")
    print(f"Original Dimensions: {result.get('original_dimensions')}")
    print(f"Normalized Dimensions: {result.get('normalized_dimensions')}")
    print(f"Detected Corners Count: {len(result.get('detected_corners', []))}")
    if result.get('detected_corners'):
        print(f"Corner Coordinates: {result.get('detected_corners')}")

    has_base64 = bool(result.get('normalized_image_base64', '').startswith('data:image/jpeg;base64,'))
    print(f"Normalized JPEG Base64 Output Generated: {has_base64}")

    if result.get('status') == 'preprocessed' and has_base64:
        print("\n[SUCCESS] PHASE 9 OPENCV PREPROCESSING TEST PASSED CLEANLY!")
    else:
        print("\n[FAIL] PHASE 9 TEST FAILED!")

if __name__ == "__main__":
    run_test()
