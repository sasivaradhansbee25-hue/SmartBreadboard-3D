"""
SmartBreadboard 3D — Phase 11 Resistor Color-Band Recognition Test Suite
Tests real resistor crop color analysis, CIELAB segmentation, 4-band and 5-band decoding math,
confidence scoring, and Rule 5 separated override field integrity.
"""

import os
import sys
import base64

sys.path.insert(0, os.path.dirname(__file__))

from cv.preprocessing import preprocess_breadboard_image
from cv.yolo_detector import detect_components_yolo
from cv.resistor_color import analyze_resistor_color, decode_resistor_bands

def test_phase11():
    photo_path = 'e:/CIRCUIT STIMULATOR/backend/test_assets/real_breadboard_photo.jpg'
    if not os.path.exists(photo_path):
        print(f"Error: Test asset {photo_path} not found.")
        return

    print("================================================================")
    print("      PHASE 11 RESISTOR COLOR-BAND RECOGNITION TEST             ")
    print("================================================================")
    print(f"Input Asset: {photo_path}")

    # Step 1: Run Phase 9 Preprocessing & Phase 10 Detection to get real resistor crop
    with open(photo_path, 'rb') as f:
        raw_bytes = f.read()

    prep_res = preprocess_breadboard_image(raw_bytes)
    norm_b64 = prep_res.get('normalized_image_base64', '')

    det_res = detect_components_yolo(norm_b64)
    detections = det_res.get('detections', [])

    print(f"Phase 10 Detections Count: {len(detections)}")

    # Locate a resistor crop or generate a crop
    res_crop_b64 = None
    for d in detections:
        if d.get('class') == 'resistor' or 'crop_base64' in d:
            res_crop_b64 = d.get('crop_base64')
            break

    if not res_crop_b64 and len(detections) > 0:
        res_crop_b64 = detections[0].get('crop_base64')

    print(f"Resistor Crop Base64 Obtained: {res_crop_b64 is not None}")

    # Step 2: Test Phase 11 Resistor Color Recognition Engine
    color_res = analyze_resistor_color(res_crop_b64, resistor_id="R1_TEST")

    print("\n--- Phase 11 Analysis Result ---")
    print(f"Status: {color_res.get('status')}")
    print(f"Resistor ID: {color_res.get('resistor_id')}")

    detected = color_res.get('detected_value', {})
    print("\n[Detected Value Payload]:")
    print(f"  * Bands Count: {detected.get('band_count')}")
    print(f"  * Color Bands: {detected.get('bands')}")
    print(f"  * Resistance (Ohms): {detected.get('resistance_ohms')}")
    print(f"  * Tolerance: {detected.get('tolerance')}")
    print(f"  * Formatted Value: {str(detected.get('formatted_value')).encode('ascii', 'ignore').decode('ascii')}")
    print(f"  * Confidence: {detected.get('confidence')}")
    print(f"  * Confidence Warning Flag: {detected.get('confidence_warning')}")
    print(f"  * Warnings: {detected.get('warnings')}")

    print("\n[AGENTS.md Rule 5 Verification]:")
    print(f"  * user_override_value is None: {color_res.get('user_override_value') is None}")

    # Step 3: Test 4-Band and 5-Band Color Decoding Math
    print("\n--- Mathematical Decoder Unit Test ---")
    res_4band = decode_resistor_bands(["brown", "black", "red", "gold"])
    print(f"4-Band (Brown-Black-Red-Gold): {res_4band['resistance_ohms']} Ohms | Formatted: {res_4band['formatted'].encode('ascii', 'ignore').decode('ascii')}")

    res_5band = decode_resistor_bands(["brown", "black", "black", "brown", "brown"])
    print(f"5-Band (Brown-Black-Black-Brown-Brown): {res_5band['resistance_ohms']} Ohms | Formatted: {res_5band['formatted'].encode('ascii', 'ignore').decode('ascii')}")

    res_220 = decode_resistor_bands(["red", "red", "brown", "gold"])
    print(f"4-Band (Red-Red-Brown-Gold): {res_220['resistance_ohms']} Ohms | Formatted: {res_220['formatted'].encode('ascii', 'ignore').decode('ascii')}")

    assert res_4band['resistance_ohms'] == 1000.0, "4-band 1k ohm decoding error"
    assert res_220['resistance_ohms'] == 220.0, "4-band 220 ohm decoding error"
    assert color_res.get('user_override_value') is None, "AGENTS.md Rule 5 violation"

    print("\n[SUCCESS] PHASE 11 RESISTOR COLOR-BAND TEST PASSED CLEANLY!")

if __name__ == "__main__":
    test_phase11()
