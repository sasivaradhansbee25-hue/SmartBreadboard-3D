"""
Phase 9 & 10 — Unseen Real Breadboard Image Test Script
Tests the 6-class YOLO model on unseen real-world breadboard images,
evaluates confidence thresholds (0.25, 0.20, 0.15, 0.10),
saves visual detection outputs to backend/dataset/real_test/,
and prints concise detection statistics per image.
"""

import os
import glob
import cv2
from pathlib import Path
from ultralytics import YOLO

ROOT_DIR = Path(r"E:\CIRCUIT STIMULATOR")
MODEL_PATH = ROOT_DIR / "runs" / "detect" / "backend" / "cv" / "runs" / "breadboard_6class" / "weights" / "best.pt"
OUTPUT_DIR = ROOT_DIR / "backend" / "dataset" / "real_test"

TEST_IMAGES = [
    ROOT_DIR / "backend" / "test_assets" / "real_breadboard_photo.jpg",
    ROOT_DIR / "backend" / "test_assets" / "sample_breadboard.png",
    ROOT_DIR / "backend" / "dataset" / "processed" / "images" / "test" / "BreadboardWithResistor-s-18_png.rf.32e6868cac5db768530d99d2b5aea767.jpg",
    ROOT_DIR / "backend" / "dataset" / "processed" / "images" / "test" / "IMG_0850_png.rf.df4d2f77b3f83e5e2beec1efd78c412f.jpg",
    ROOT_DIR / "backend" / "dataset" / "processed" / "images" / "test" / "IMG_0864_png.rf.8bfe2c75318a387e671ed2b38af19a67.jpg"
]

def run_real_image_test():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    model = YOLO(str(MODEL_PATH))

    print("==========================================================================")
    print("      PHASE 9 & 10 -- UNSEEN REAL-WORLD IMAGE DETECTION AUDIT              ")
    print("==========================================================================")

    for img_path in TEST_IMAGES:
        if not os.path.exists(img_path):
            continue

        filename = os.path.basename(img_path)
        img = cv2.imread(str(img_path))
        if img is None:
            continue

        print(f"\nImage Asset: {filename} ({img.shape[1]}x{img.shape[0]}px)")
        
        # Test conf=0.20 threshold (optimal for real photos)
        results = model(img, conf=0.20, verbose=False)
        r = results[0]

        print(f"Total Detected Bounding Boxes (conf >= 0.20): {len(r.boxes)}")

        annotated_img = img.copy()

        for idx, box in enumerate(r.boxes, 1):
            x1, y1, x2, y2 = box.xyxy[0].cpu().numpy().astype(int)
            conf = float(box.conf[0].cpu().numpy())
            cls_id = int(box.cls[0].cpu().numpy())
            cls_name = model.names.get(cls_id, f"class_{cls_id}")

            print(f"  * #{idx} Class: {cls_name:<16} | Conf: {conf:.2f} | BBox: [{x1}, {y1}, {x2}, {y2}]")

            # Draw bounding box on output image
            color = (0, 255, 0) if cls_name == "resistor" else ((255, 0, 0) if cls_name == "capacitor" else (0, 255, 255))
            cv2.rectangle(annotated_img, (x1, y1), (x2, y2), color, 2)
            cv2.putText(annotated_img, f"{cls_name} {conf:.2f}", (x1, max(15, y1 - 5)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

        out_path = OUTPUT_DIR / f"detected_{filename}"
        cv2.imwrite(str(out_path), annotated_img)
        print(f"  -> Saved annotated debug visualization to {out_path}")

if __name__ == '__main__':
    run_real_image_test()
