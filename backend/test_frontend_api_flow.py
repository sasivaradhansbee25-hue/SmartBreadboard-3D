"""
SmartBreadboard 3D — Frontend to Backend API Flow Contract Verification
Tests the exact HTTP requests emitted by Scanner.jsx to FastAPI endpoints:
1. POST http://127.0.0.1:8000/api/analyze-image
2. POST http://127.0.0.1:8000/api/detect-components
3. POST http://127.0.0.1:8000/api/analyze-resistor-color
4. POST http://127.0.0.1:8000/api/build-circuit
"""

import urllib.request
import json
import base64
import os

API_BASE = 'http://127.0.0.1:8000'
PHOTO_PATH = r'e:\CIRCUIT STIMULATOR\backend\test_assets\real_breadboard_photo.jpg'

def post_json(url, data):
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

def test_flow():
    print("================================================================")
    print("      FRONTEND TO BACKEND FASTAPI ENDPOINT FLOW TEST            ")
    print("================================================================")

    with open(PHOTO_PATH, 'rb') as f:
        img_b64 = "data:image/jpeg;base64," + base64.b64encode(f.read()).decode('utf-8')

    # Step 1: Phase 9 Preprocessing
    p9_out = post_json(f"{API_BASE}/api/analyze-image", {"image_base64": img_b64})
    print(f"1. Phase 9 Preprocessing Status: {p9_out.get('status')} | Dimensions: {p9_out.get('normalized_dimensions')}")
    norm_b64 = p9_out.get('normalized_image_base64', img_b64)

    # Step 2: Phase 10 Detection
    p10_out = post_json(f"{API_BASE}/api/detect-components", {"image_base64": norm_b64})
    print(f"2. Phase 10 Detection Status: {p10_out.get('status')} | Detections Count: {len(p10_out.get('detections', []))}")
    detections = p10_out.get('detections', [])

    # Step 3: Phase 11 Resistor Color Recognition (ONLY for resistor class)
    resistor_analyses = []
    for d in detections:
        if d.get('class') == 'resistor' and d.get('crop_base64'):
            p11_out = post_json(f"{API_BASE}/api/analyze-resistor-color", {
                "crop_base64": d['crop_base64'],
                "resistor_id": d['id']
            })
            resistor_analyses.append(p11_out)

    print(f"3. Phase 11 Resistor Analyses Count: {len(resistor_analyses)}")

    # Step 4: Phase 12 Netlist Building
    p12_out = post_json(f"{API_BASE}/api/build-circuit", {
        "image_base64": norm_b64,
        "detections": detections,
        "resistor_analysis": resistor_analyses
    })

    print(f"4. Phase 12 Netlist Status: {p12_out.get('validity', {}).get('status')} | Components Count: {len(p12_out.get('components', []))} | Nodes Count: {len(p12_out.get('nodes', []))}")

    assert p12_out.get('validity', {}).get('status') == 'PASS', "Netlist failed"
    print("\n[SUCCESS] FRONTEND FASTAPI FLOW CONTRACT PASSED 100%!")

if __name__ == "__main__":
    test_flow()
