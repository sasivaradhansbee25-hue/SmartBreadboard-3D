"""
SmartBreadboard 3D — Full End-to-End Pipeline Audit Script
Executes real photo input through Phase 9 -> Phase 10 -> Phase 11 -> Phase 12 -> Phase 13 Data Prep.
Prints exact empirical output metrics at every single stage of the pipeline.
"""

import os
import sys
import json
import time
import cv2

sys.path.insert(0, os.path.dirname(__file__))

from cv.preprocessing import preprocess_breadboard_image
from cv.yolo_detector import detect_components_yolo, MODEL_PATH_PT, MODEL_PATH_ONNX
from cv.resistor_color import analyze_resistor_color
from core.circuit_model import build_netlist_from_detections

def run_full_pipeline_audit():
    photo_path = 'e:/CIRCUIT STIMULATOR/backend/test_assets/real_breadboard_photo.jpg'
    if not os.path.exists(photo_path):
        print(f"Error: {photo_path} not found.")
        return

    print("================================================================")
    print("      FULL END-TO-END PIPELINE INTEGRATION AUDIT                ")
    print("================================================================")
    print(f"Input Real Photograph Asset: {photo_path}")

    # Step 1: Input Image Inspection
    with open(photo_path, 'rb') as f:
        raw_bytes = f.read()

    img_np = cv2.imread(photo_path)
    orig_h, orig_w = img_np.shape[:2] if img_np is not None else (0, 0)

    print("\n--- 1. Input Image Verification ---")
    print(f"File Path: {photo_path}")
    print(f"Raw Image File Size: {len(raw_bytes)} bytes")
    print(f"Original Image Dimensions: {orig_w} x {orig_h} pixels")

    # Step 2: Phase 9 Preprocessing Verification
    start_p9 = time.time()
    p9_res = preprocess_breadboard_image(raw_bytes)
    end_p9 = time.time()

    norm_b64 = p9_res.get('normalized_image_base64', '')
    print("\n--- 2. Phase 9 OpenCV Preprocessing Verification ---")
    print(f"Status: {p9_res.get('status')}")
    print(f"Perspective Corrected: {p9_res.get('perspective_corrected')}")
    print(f"Normalized Dimensions: {p9_res.get('normalized_dimensions')}")
    print(f"Base64 Image Output Length: {len(norm_b64)} chars")
    print(f"Phase 9 Latency: {round((end_p9 - start_p9)*1000, 2)} ms")

    # Step 3: Phase 10 YOLO Component Detection Verification
    start_p10 = time.time()
    p10_res = detect_components_yolo(norm_b64)
    end_p10 = time.time()

    detections = p10_res.get('detections', [])
    print("\n--- 3. Phase 10 YOLO Component Detection Verification ---")
    print(f"Status: {p10_res.get('status')}")
    print(f"Inference Source Engine: {p10_res.get('source')}")
    print(f"Weights Loaded Status: {p10_res.get('weights_loaded')}")
    print(f"PyTorch Weights File Exists (.pt): {os.path.exists(MODEL_PATH_PT)} ({os.path.getsize(MODEL_PATH_PT) if os.path.exists(MODEL_PATH_PT) else 0} bytes)")
    print(f"ONNX Weights File Exists (.onnx): {os.path.exists(MODEL_PATH_ONNX)} ({os.path.getsize(MODEL_PATH_ONNX) if os.path.exists(MODEL_PATH_ONNX) else 0} bytes)")
    print(f"Number of Detected Components: {len(detections)}")
    print(f"Phase 10 Latency: {round((end_p10 - start_p10)*1000, 2)} ms")

    print("\nDetected Component Details:")
    for d in detections:
        print(f"   * ID: {d.get('id')} | Class: {d.get('class')} | Conf: {d.get('confidence')} | BBox Pixels: {d.get('bbox_pixels')} | BBox Norm: {d.get('bbox_normalized')}")

    # Step 4: Phase 11 Resistor Color Recognition Verification
    start_p11 = time.time()
    resistor_analyses = []
    print("\n--- 4. Phase 11 Resistor Color-Band Recognition Verification ---")

    for d in detections:
        if d.get('class') == 'resistor' or 'crop_base64' in d:
            r_crop = d.get('crop_base64')
            if r_crop:
                r_res = analyze_resistor_color(r_crop, resistor_id=d['id'])
                resistor_analyses.append(r_res)
                det_val = r_res.get('detected_value', {})
                print(f"   * Resistor {d['id']}: Bands = {det_val.get('bands')} | Ohms = {det_val.get('resistance_ohms')} | Formatted = {str(det_val.get('formatted_value')).encode('ascii', 'ignore').decode('ascii')} | Conf = {det_val.get('confidence')}")

    end_p11 = time.time()
    print(f"Phase 11 Resistor Analyses Count: {len(resistor_analyses)}")
    print(f"Phase 11 Latency: {round((end_p11 - start_p11)*1000, 2)} ms")

    # Step 5: Phase 12 Breadboard Netlist Mapping Verification
    start_p12 = time.time()
    p12_netlist = build_netlist_from_detections(detections, resistor_analyses)
    end_p12 = time.time()

    nodes = p12_netlist.get('nodes', [])
    components = p12_netlist.get('components', [])
    power_sources = p12_netlist.get('power_sources', [])
    validity = p12_netlist.get('validity', {})

    print("\n--- 5. Phase 12 Breadboard Netlist Mapping Verification ---")
    print(f"Circuit ID: {p12_netlist.get('circuit_id')}")
    print(f"Netlist Source: {p12_netlist.get('metadata', {}).get('source')}")
    print(f"Number of Mapped Components: {len(components)}")
    print(f"Number of Electrical Nodes: {len(nodes)}")
    print(f"Number of Power Sources: {len(power_sources)}")
    print(f"Netlist Pass Status: {validity.get('status')}")
    print(f"Phase 12 Latency: {round((end_p12 - start_p12)*1000, 2)} ms")

    print("\nMapped Component Details (Node & Hole Assignments):")
    for comp in components:
        print(f"   * {comp['id']} ({comp['type']}): Node1 = {comp['node1']} ({comp['hole1']}) <-> Node2 = {comp['node2']} ({comp['hole2']}) | Val = {comp['detected_value']}")

    # Step 6: Phase 13 3D Spatial Data Preparation Verification
    print("\n--- 6. Phase 13 Automatic 3D Spatial Data Preparation Verification ---")
    d3_objects = []
    for comp in components:
        h1 = comp.get('hole1', 'A22')
        h2 = comp.get('hole2', 'E22')
        d3_objects.append({
            "id": comp['id'],
            "type": comp['type'],
            "hole1": h1,
            "hole2": h2,
            "node1": comp['node1'],
            "node2": comp['node2']
        })
        print(f"   * 3D Component Object {comp['id']} ({comp['type']}): Hole1 '{h1}' <-> Hole2 '{h2}'")

    print(f"Total 3D Component Objects Prepared for WebGL Scene: {len(d3_objects)}")

    # Total Pipeline Metrics Summary
    total_latency_ms = round((end_p12 - start_p9) * 1000, 2)
    print("\n================================================================")
    print("           PIPELINE AUDIT SUMMARY METRICS                       ")
    print("================================================================")
    print(f"1. Input Image Dimensions: {orig_w} x {orig_h}")
    print(f"2. Preprocessed Image Dimensions: {p9_res.get('normalized_dimensions')}")
    print(f"3. Number of YOLO Detections: {len(detections)}")
    print(f"4. Detected Classes: {[d.get('class') for d in detections]}")
    print(f"5. Resistor Detected Value: {[r.get('detected_value', {}).get('formatted_value') for r in resistor_analyses]}")
    print(f"6. Number of Mapped Component Leads: {len(components) * 2}")
    print(f"7. Number of Electrical Nodes: {len(nodes)}")
    print(f"8. Number of Components: {len(components)}")
    print(f"9. Number of Power Sources: {len(power_sources)}")
    print(f"10. Final 3D Components Generated: {len(d3_objects)}")
    print(f"11. Total Pipeline End-to-End Latency: {total_latency_ms} ms")

if __name__ == "__main__":
    run_full_pipeline_audit()
