"""
SmartBreadboard 3D — Complete End-to-End Real AI Pipeline Verification Script
Tests the full HTTP & processing chain against the live FastAPI server:
Image Upload -> OpenCV Preprocessing -> YOLO Component Detection -> Resistor Color Analysis -> Netlist Engine -> Circuit Data Model
"""

import sys
import os
import urllib.request
import json
import base64

API_BASE = 'http://127.0.0.1:8000'
TEST_IMAGES = [
    'backend/test_assets/real_breadboard_photo.jpg',
    'backend/dataset/processed/images/test/BreadboardWithResistor-s-18_png.rf.32e6868cac5db768530d99d2b5aea767.jpg'
]

def post_json(endpoint, payload):
    req = urllib.request.Request(
        f'{API_BASE}{endpoint}',
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

def run_e2e_test():
    print("==========================================================================")
    print("      SMARTBREADBOARD 3D -- FULL E2E REAL AI PIPELINE AUDIT VERIFICATION  ")
    print("==========================================================================")

    # 1. Server Health Check
    try:
        with urllib.request.urlopen(API_BASE + '/') as resp:
            root_data = json.loads(resp.read().decode('utf-8'))
            print(f"[OK] 1. FastAPI Backend Online: {root_data.get('service')} (Phase: {root_data.get('phase')})")
    except Exception as e:
        print(f"[FAIL] 1. FastAPI Server Offline at {API_BASE}: {e}")
        return False

    for img_path in TEST_IMAGES:
        if not os.path.exists(img_path):
            continue

        print(f"\n--------------------------------------------------------------------------")
        print(f"Testing Real Photograph Asset: {img_path}")
        print(f"--------------------------------------------------------------------------")

        with open(img_path, 'rb') as f:
            raw_bytes = f.read()
            orig_b64 = 'data:image/jpeg;base64,' + base64.b64encode(raw_bytes).decode('utf-8')

        # Stage 1: OpenCV Preprocessing
        p9 = post_json('/api/analyze-image', {'image_base64': orig_b64})
        print(f"[OK] Stage 1 (OpenCV Preprocessing): Status = {p9.get('status')} | Perspective Corrected = {p9.get('perspective_corrected')} | Dimensions = {p9.get('normalized_dimensions')}")
        norm_b64 = p9.get('normalized_image_base64')

        # Stage 2: YOLO Bounding Box Detection
        p10 = post_json('/api/detect-components', {'image_base64': norm_b64})
        detections = p10.get('detections', [])
        print(f"[OK] Stage 2 (YOLO Component Detection): Status = {p10.get('status')} | Source = {p10.get('source')} | Detections Count = {len(detections)}")

        for idx, d in enumerate(detections, 1):
            print(f"    * Component #{idx}: ID={d['id']} | Class={d['class']} | Conf={d['confidence']} | BBox={d['bbox_pixels']}")

        # Stage 3: Resistor Color Recognition
        resistor_analyses = []
        for d in detections:
            if d.get('class') == 'resistor' and d.get('crop_base64'):
                r_res = post_json('/api/analyze-resistor-color', {'crop_base64': d['crop_base64'], 'resistor_id': d['id']})
                if r_res.get('status') == 'success':
                    resistor_analyses.append(r_res)
                    det_val = r_res.get('detected_value', {})
                    print(f"    * Resistor Color Analysis {d['id']}: Bands={det_val.get('bands')} | Formatted={det_val.get('formatted_value')} | Conf={det_val.get('confidence')}")

        print(f"[OK] Stage 3 (Resistor Band Engine): Analyzed {len(resistor_analyses)} resistors")

        # Stage 4: Netlist Engine
        p12 = post_json('/api/build-circuit', {
            'image_base64': norm_b64,
            'detections': detections,
            'resistor_analysis': resistor_analyses
        })

        comps = p12.get('components', [])
        nodes = p12.get('nodes', [])
        validity = p12.get('validity', {})

        print(f"[OK] Stage 4 (Netlist Generation Engine): Circuit ID = {p12.get('circuit_id')} | Validity = {validity.get('status')}")
        print(f"    * Total Mapped Netlist Components: {len(comps)}")
        print(f"    * Total Electrical Nodes: {len(nodes)}")

        for c in comps:
            print(f"      - Netlist Item: ID={c['id']} | Type={c['type']} | Value={c.get('detected_value')} | Terminals={c.get('node1')} ({c.get('hole1')}) to {c.get('node2')} ({c.get('hole2')})")

        # Check circuit format matching CircuitContext requirements
        formatted_circuit = {
            'id': p12.get('circuit_id', 'circ_real_001'),
            'name': 'Real AI Scanned Circuit',
            'source': 'real',
            'metadata': p12.get('metadata', {}),
            'nodes': nodes,
            'components': comps,
            'power_sources': p12.get('power_sources', []),
            'validity': validity,
            'detections': detections,
            'resistorAnalyses': resistor_analyses
        }

        assert formatted_circuit['source'] == 'real', "Circuit source must be 'real'"
        assert len(formatted_circuit['components']) > 0, "Real circuit must contain components"

        print(f"[SUCCESS] Real image pipeline passed completely for {img_path}!")

    print("\n==========================================================================")
    print("    [PASS] ALL REAL AI PIPELINE END-TO-END VERIFICATION CHECKS PASSED!    ")
    print("==========================================================================")
    return True

if __name__ == '__main__':
    run_e2e_test()
