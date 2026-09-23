"""
SmartBreadboard 3D — Phase 18 Real Breadboard Image Verification & Audit
Evaluates the Circuit Vision Verification Agent on real breadboard benchmark images.
Reports:
- Raw YOLO detections
- Verified detections
- Unknown detections
- Rejected detections
- Mapped components
- Netlist components
- Rejection reasons
"""

import os
import sys
import cv2
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from cv.yolo_detector import detect_and_annotate_components, detect_components_yolo
from cv.circuit_vision_verifier import verify_circuit_vision_candidates

TEST_IMAGES = [
    os.path.join(BASE_DIR, "test_assets", "real_breadboard_photo.jpg"),
    os.path.join(BASE_DIR, "test_assets", "sample_breadboard.png")
]

def run_real_image_audit():
    print("=" * 70)
    print("      SMARTBREADBOARD 3D — PHASE 18 REAL IMAGE VERIFICATION AUDIT")
    print("=" * 70)

    for img_path in TEST_IMAGES:
        if not os.path.exists(img_path):
            print(f"[SKIP] Asset not found: {img_path}")
            continue

        print(f"\nEvaluating Image: {os.path.basename(img_path)}")
        print("-" * 50)

        with open(img_path, "rb") as f:
            img_bytes = f.read()

        cv_img = cv2.imread(img_path)
        h, w = cv_img.shape[:2]
        print(f"Dimensions: {w}x{h} px")

        # Run Phase 18 Pipeline
        res = detect_and_annotate_components(img_bytes, conf_threshold=0.35)
        
        vv = res.get("vision_verification", {})
        raw_count = vv.get("raw_count", 0)
        ver_count = vv.get("verified_count", 0)
        unk_count = vv.get("unknown_count", 0)
        rej_count = vv.get("rejected_count", 0)

        mapped_comps = res.get("mapped_components", [])
        netlist_comps = res.get("netlist", {}).get("components", []) if res.get("netlist") else []

        print(f"Raw YOLO Hypotheses:     {raw_count}")
        print(f"Verified Detections:     {ver_count}")
        print(f"Unknown (Manual Rec):    {unk_count}")
        print(f"Rejected False Positives: {rej_count}")
        print(f"Total Mapped Components:  {len(mapped_comps)}")
        print(f"Netlist Validated Comps: {len(netlist_comps)}")

        print("\nCandidate Breakdown:")
        for cand in vv.get("all_candidates", []):
            cid = cand.get("detection_id") or cand.get("id")
            cls = cand.get("class")
            conf = cand.get("confidence")
            v_state = cand.get("verification")
            reasons = cand.get("reasons", [])
            print(f"  [{v_state:8s}] {cid:8s} | {cls:16s} | conf: {conf:.2f} | reasons: {', '.join(reasons)}")

        print("\nMapped Components entering Digital Twin / Netlist:")
        for comp in mapped_comps:
            des = comp.get("designator")
            ctype = comp.get("type")
            h1 = comp.get("start_hole")
            h2 = comp.get("end_hole")
            v_state = comp.get("verification", "VERIFIED")
            src = comp.get("source", "detected")
            print(f"  {des:8s} | Type: {ctype:14s} | Holes: {h1}..{h2} | Verification: {v_state} | Source: {src}")

    print("\n" + "=" * 70)
    print("PHASE 18 REAL IMAGE AUDIT COMPLETED")
    print("=" * 70)

if __name__ == "__main__":
    run_real_image_audit()
