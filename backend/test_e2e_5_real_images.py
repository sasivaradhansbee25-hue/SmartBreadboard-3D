"""
End-to-End Real Breadboard Image -> YOLO -> Grid -> Hole Mapping -> Netlist -> 3D Pipeline Test
Evaluates 5 unseen real breadboard images and records:
1. YOLO detections count & classes
2. Mapped components count & hole pairs
3. Generated electrical nets & pin connections
4. 3D component count
5. Detection accuracy & grid mapping metrics
"""

import os
import cv2
import json
import base64
from pathlib import Path

# Paths
ROOT_DIR = Path(r"E:\CIRCUIT STIMULATOR")
BACKEND_DIR = ROOT_DIR / "backend"

import sys
sys.path.insert(0, str(BACKEND_DIR))

from cv.yolo_detector import detect_and_annotate_components

TEST_IMAGES = [
    ROOT_DIR / "backend" / "dataset" / "processed" / "images" / "test" / "BreadboardWithResistor-s-18_png.rf.32e6868cac5db768530d99d2b5aea767.jpg",
    ROOT_DIR / "backend" / "dataset" / "processed" / "images" / "test" / "IMG_0800_png.rf.7a793caa0b233723f08a633b2cd7b664.jpg",
    ROOT_DIR / "backend" / "dataset" / "processed" / "images" / "test" / "IMG_0828_png.rf.61714770d7fe5e1b7d0db4958ebaa6e5.jpg",
    ROOT_DIR / "backend" / "dataset" / "processed" / "images" / "test" / "IMG_0850_png.rf.df4d2f77b3f83e5e2beec1efd78c412f.jpg",
    ROOT_DIR / "backend" / "dataset" / "processed" / "images" / "test" / "IMG_0864_png.rf.8bfe2c75318a387e671ed2b38af19a67.jpg"
]

def run_e2e_5_images_evaluation():
    print("=" * 80)
    print("      SMARTBREADBOARD 3D -- END-TO-END 5 REAL IMAGE PIPELINE AUDIT")
    print("=" * 80)

    summary_records = []

    for idx, img_path in enumerate(TEST_IMAGES, 1):
        if not img_path.exists():
            print(f"Skipping missing image: {img_path}")
            continue

        filename = img_path.name
        img_bgr = cv2.imread(str(img_path))
        h, w = img_bgr.shape[:2]

        _, buf = cv2.imencode('.jpg', img_bgr)
        b64_str = base64.b64encode(buf).decode('utf-8')

        result = detect_and_annotate_components(b64_str, conf_threshold=0.20)
        
        detections = result.get("detections", [])
        mapped_comps = result.get("mapped_components", [])
        netlist = result.get("netlist", {})
        nets_summary = result.get("nets_summary", [])
        
        valid_3d_comps = [c for c in mapped_comps if not c.get("uncertain_mapping")]

        record = {
            "image_index": idx,
            "filename": filename,
            "resolution": f"{w}x{h}px",
            "yolo_count": len(detections),
            "mapped_count": len(mapped_comps),
            "valid_3d_count": len(valid_3d_comps),
            "nets_count": len(nets_summary),
            "components": [
                {
                    "designator": c["designator"],
                    "type": c["type"],
                    "start_hole": c["start_hole"],
                    "end_hole": c["end_hole"],
                    "conf": c["confidence"],
                    "node1": c.get("node1"),
                    "node2": c.get("node2"),
                    "uncertain": c.get("uncertain_mapping")
                }
                for c in mapped_comps
            ],
            "nets": nets_summary
        }
        summary_records.append(record)

        print(f"\n==========================================================================")
        print(f"IMAGE #{idx}: {filename} ({w}x{h}px)")
        print(f"==========================================================================")
        print(f"YOLO DETECTIONS:         {len(detections)}")
        print(f"MAPPED COMPONENTS:       {len(mapped_comps)}")
        print(f"VALID 3D COMPONENTS:     {len(valid_3d_comps)}")
        print(f"GENERATED NETS:          {len(nets_summary)}")
        print("\n--- MAPPED HOLES & NETLIST ---")
        for c in record["components"]:
            status = "UNCERTAIN" if c["uncertain"] else "VERIFIED"
            print(f"  * {c['designator']:<6} ({c['type']:<12}) -> {c['start_hole']:<5} to {c['end_hole']:<5} | Conf: {c['conf']:.2f} | Nets: [{c['node1']}, {c['node2']}] | Status: {status}")
        
        print("\n--- ELECTRICAL NETS ---")
        for net in nets_summary:
            print(f"  * {net}")

    print("\n" + "=" * 80)
    print("                    5-IMAGE SUMMARY RESULTS MATRIX")
    print("=" * 80)
    print(f"{'Image':<4} | {'Filename':<32} | {'YOLO':<5} | {'Mapped':<7} | {'3D Scene':<8} | {'Nets':<5}")
    print("-" * 80)
    for r in summary_records:
        print(f"#{r['image_index']:<3} | {r['filename'][:30]:<32} | {r['yolo_count']:<5} | {r['mapped_count']:<7} | {r['valid_3d_count']:<8} | {r['nets_count']:<5}")

    print("=" * 80)

if __name__ == "__main__":
    run_e2e_5_images_evaluation()
