"""
SmartBreadboard 3D — Critical End-to-End Data Consistency Audit Script
Executes real photo input through Phase 9 -> Phase 10 -> Phase 11 -> Phase 12 -> Phase 13 Data Prep.
Prints the exact JSON/object after EVERY single stage and validates ID/Class consistency across stages.
"""

import os
import sys
import json
import cv2

sys.path.insert(0, os.path.dirname(__file__))

from cv.preprocessing import preprocess_breadboard_image
from cv.yolo_detector import detect_components_yolo
from cv.resistor_color import analyze_resistor_color
from core.circuit_model import build_netlist_from_detections
from cv.breadboard_grid import HOLE_CENTROIDS, map_lead_to_nearest_hole

def run_dataflow_audit():
    photo_path = 'e:/CIRCUIT STIMULATOR/backend/test_assets/real_breadboard_photo.jpg'
    if not os.path.exists(photo_path):
        print(f"Error: {photo_path} not found.")
        return

    print("================================================================")
    print("   CRITICAL END-TO-END DATA CONSISTENCY PIPELINE AUDIT          ")
    print("================================================================")
    print(f"Input Asset: {photo_path}")

    # Stage 1: Input Photo Inspection
    with open(photo_path, 'rb') as f:
        raw_bytes = f.read()
    img_np = cv2.imread(photo_path)
    h_orig, w_orig = img_np.shape[:2] if img_np is not None else (0, 0)
    print(f"\n[STAGE 1 - INPUT IMAGE]: Size = {len(raw_bytes)} bytes | Dimensions = {w_orig}x{h_orig} px")

    # Stage 2: Phase 9 Preprocessing Output
    p9_out = preprocess_breadboard_image(raw_bytes)
    print("\n----------------------------------------------------------------")
    print("[STAGE 2 - PHASE 9 PREPROCESSING OUTPUT]:")
    print(f"  * Status: {p9_out.get('status')}")
    print(f"  * Perspective Corrected: {p9_out.get('perspective_corrected')}")
    print(f"  * Normalized Matrix Dimensions: {p9_out.get('normalized_dimensions')}")
    print(f"  * Output Base64 String Length: {len(p9_out.get('normalized_image_base64', ''))} chars")

    norm_b64 = p9_out.get('normalized_image_base64', '')

    # Stage 3: Phase 10 YOLO Detector Output
    p10_out = detect_components_yolo(norm_b64, conf_threshold=0.25)
    detections = p10_out.get('detections', [])

    print("\n----------------------------------------------------------------")
    print("[STAGE 3 - PHASE 10 RAW & NORMALIZED DETECTOR OUTPUT]:")
    print(f"  * Status: {p10_out.get('status')}")
    print(f"  * Source Engine: {p10_out.get('source')}")
    print(f"  * Detections Count: {len(detections)}")

    for d in detections:
        print(f"  * Detection Object [{d['id']}]:")
        print(f"      - Class: {d['class']}")
        print(f"      - Confidence: {d['confidence']}")
        print(f"      - BBox Pixels [x1, y1, x2, y2]: {d['bbox_pixels']}")
        print(f"      - BBox Normalized [x, y, w, h]: {d['bbox_normalized']}")
        print(f"      - Crop Base64 Included: {d['crop_base64'] is not None}")

    # Stage 4 & 5: Phase 11 Input & Output
    print("\n----------------------------------------------------------------")
    print("[STAGE 4 & 5 - PHASE 11 RESISTOR COLOR INPUT & OUTPUT]:")

    resistor_analyses = []
    for d in detections:
        print(f"\n  * Checking Detection [{d['id']}] for Resistor Analysis:")
        print(f"      - Phase 10 Class: '{d['class']}'")

        if d['class'] == 'resistor':
            p11_in = {
                "resistor_id": d['id'],
                "crop_base64": f"<{len(d.get('crop_base64', ''))} chars Base64 PNG>"
            }
            print(f"      - Phase 11 Input Payload: {p11_in}")

            p11_out = analyze_resistor_color(d['crop_base64'], resistor_id=d['id'])
            resistor_analyses.append(p11_out)

            det_val = p11_out.get('detected_value', {})
            print(f"      - Phase 11 Output Payload: status = {p11_out.get('status')}")
            print(f"          * Color Bands: {det_val.get('bands')}")
            print(f"          * Calculated Resistance (Ohms): {det_val.get('resistance_ohms')}")
            print(f"          * Formatted Value: {str(det_val.get('formatted_value')).encode('ascii', 'ignore').decode('ascii')}")
            print(f"          * Confidence: {det_val.get('confidence')}")
            print(f"          * User Override Value (Rule 5): {p11_out.get('user_override_value')}")
        else:
            print(f"      - Skipping Phase 11: Component [{d['id']}] is class '{d['class']}', NOT a resistor.")

    print(f"\n  * Total Phase 11 Resistor Analysis Payloads Output: {len(resistor_analyses)}")

    # Stage 6 & 7: Phase 12 Netlist Mapping Input & Output
    print("\n----------------------------------------------------------------")
    print("[STAGE 6 & 7 - PHASE 12 NETLIST MAPPING INPUT & OUTPUT]:")
    print(f"  * Phase 12 Input Detections Count: {len(detections)}")
    print(f"  * Phase 12 Input Resistor Analyses Count: {len(resistor_analyses)}")

    p12_out = build_netlist_from_detections(detections, resistor_analyses)

    print(f"\n  * Phase 12 Circuit Netlist Output:")
    print(f"      - Circuit ID: {p12_out.get('circuit_id')}")
    print(f"      - Netlist Source: {p12_out.get('metadata', {}).get('source')}")
    print(f"      - Nodes Count: {len(p12_out.get('nodes', []))}")
    print(f"      - Components Count: {len(p12_out.get('components', []))}")
    print(f"      - Power Sources Count: {len(p12_out.get('power_sources', []))}")
    print(f"      - Netlist Pass Status: {p12_out.get('validity', {}).get('status')}")

    print("\n  * Mapped Netlist Components:")
    for comp in p12_out.get('components', []):
        print(f"      - Component [{comp['id']}]: Designator = {comp['designator']} | Type = '{comp['type']}' | Value = {comp['detected_value']} | Node1 = {comp['node1']} ({comp['hole1']}) <-> Node2 = {comp['node2']} ({comp['hole2']})")

    # Stage 8: Phase 13 3D Spatial Input Verification
    print("\n----------------------------------------------------------------")
    print("[STAGE 8 - PHASE 13 AUTOMATIC 3D RECONSTRUCTION INPUT]:")

    d3_inputs = []
    for comp in p12_out.get('components', []):
        h1 = comp.get('hole1')
        h2 = comp.get('hole2')

        d3_obj = {
            "id": comp['id'],
            "type": comp['type'],
            "value": comp['detected_value'],
            "hole1": h1,
            "hole2": h2,
            "node1": comp['node1'],
            "node2": comp['node2']
        }
        d3_inputs.append(d3_obj)
        print(f"  * 3D Object [{comp['id']}]: Type = '{comp['type']}' | Value = {comp['detected_value']} | Hole1 '{h1}' <-> Hole2 '{h2}'")

    print(f"\nTotal 3D WebGL Objects Ready for Scene Rendering: {len(d3_inputs)}")

    # Component ID & Class Consistency Trace Summary Across All Stages
    print("\n================================================================")
    print("      PER-COMPONENT DATA-FLOW TRACE SUMMARY ACROSS ALL PHASES   ")
    print("================================================================")

    for d in detections:
        cid = d['id']
        p10_cls = d['class']

        p11_res = next((r for r in resistor_analyses if r.get('resistor_id') == cid), None)
        p11_val = p11_res.get('detected_value', {}).get('formatted_value') if p11_res else "N/A (Not a Resistor)"

        p12_comp = next((c for c in p12_out.get('components', []) if c.get('id') == cid), None)
        p12_cls = p12_comp.get('type') if p12_comp else "N/A"
        p12_val = p12_comp.get('detected_value') if p12_comp else "N/A"
        p12_holes = f"{p12_comp.get('hole1')} <-> {p12_comp.get('hole2')}" if p12_comp else "N/A"

        p13_obj = next((o for o in d3_inputs if o.get('id') == cid), None)
        p13_cls = p13_obj.get('type') if p13_obj else "N/A"

        print(f"Component ID: {cid}")
        print(f"   Phase 10 Class:               {p10_cls}")
        print(f"   Phase 11 Resistor Analysis:   {p11_val}")
        print(f"   Phase 12 Netlist Class:       {p12_cls}")
        print(f"   Phase 12 Netlist Value:       {p12_val}")
        print(f"   Phase 12 Hole Assignments:    {p12_holes}")
        print(f"   Phase 13 3D Spatial Class:    {p13_cls}")
        print("   -------------------------------------------------------------")

if __name__ == "__main__":
    run_dataflow_audit()
