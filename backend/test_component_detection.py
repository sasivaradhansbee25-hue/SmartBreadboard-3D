"""
SmartBreadboard 3D — Standalone Real Component Detection Test Script
Accepts an image path, runs YOLO (6-class model), tests confidence thresholds,
saves annotated images to backend/test_outputs/, and prints detection statistics.
"""

import os
import sys
from pathlib import Path
import cv2
from ultralytics import YOLO

ROOT_DIR = Path(r"E:\CIRCUIT STIMULATOR")
MODEL_PATH = ROOT_DIR / "runs" / "detect" / "backend" / "cv" / "runs" / "breadboard_6class" / "weights" / "best.pt"
OUTPUT_DIR = ROOT_DIR / "backend" / "test_outputs"

CLASS_NAMES = {
    0: 'resistor',
    1: 'diode_rectifier',
    2: 'ic_chip',
    3: 'wire',
    4: 'capacitor',
    5: 'led'
}

CLASS_COLORS = {
    'resistor': (0, 165, 255),      # Orange
    'diode_rectifier': (255, 0, 255), # Magenta
    'ic_chip': (0, 255, 255),       # Yellow
    'wire': (255, 255, 0),          # Cyan
    'capacitor': (255, 0, 0),       # Blue
    'led': (0, 255, 0)              # Green
}

def run_detection(image_path, conf_threshold=0.20):
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print("==========================================================================")
    print("      REAL COMPONENT DETECTION TEST (YOLO 6-CLASS)                        ")
    print("==========================================================================")
    print(f"IMAGE: {image_path}")
    print(f"MODEL: {MODEL_PATH}")

    if not os.path.exists(MODEL_PATH):
        print(f"[ERROR] Model weights file not found at {MODEL_PATH}")
        sys.exit(1)

    model = YOLO(str(MODEL_PATH))

    # Step 4: Verify Model Class Mapping
    print("\nMODEL CLASSES VERIFICATION:")
    print(model.names)
    for idx, expected_name in CLASS_NAMES.items():
        actual_name = model.names.get(idx)
        if actual_name != expected_name:
            print(f"[WARNING] Class mismatch for index {idx}: expected '{expected_name}', got '{actual_name}'")

    if not os.path.exists(image_path):
        print(f"[ERROR] Image path not found: {image_path}")
        sys.exit(1)

    img = cv2.imread(image_path)
    if img is None:
        print(f"[ERROR] Failed to read image with OpenCV from {image_path}")
        sys.exit(1)

    # Step 3: Test Multiple Confidence Values
    print("\n--------------------------------------------------------------------------")
    print("CONFIDENCE SENSITIVITY TEST:")
    print("--------------------------------------------------------------------------")
    for c_val in [0.50, 0.30, 0.20, 0.10]:
        res_temp = model(img, conf=c_val, verbose=False)[0]
        print(f"CONF {c_val:.2f} -> {len(res_temp.boxes)} detections")

    # Step 2: Run inference at selected threshold and save annotated image
    print(f"\nRUNNING INFERENCE AT SELECTED CONFIDENCE THRESHOLD = {conf_threshold:.2f}...")
    results = model(img, conf=conf_threshold, verbose=False)[0]

    annotated_img = img.copy()
    counts = {name: 0 for name in CLASS_NAMES.values()}
    detections_list = []

    print("\nDETECTIONS:")
    for idx, box in enumerate(results.boxes, 1):
        x1, y1, x2, y2 = box.xyxy[0].cpu().numpy().astype(int)
        conf = float(box.conf[0].cpu().numpy())
        cls_id = int(box.cls[0].cpu().numpy())
        cls_name = model.names.get(cls_id, f"class_{cls_id}")

        if cls_name in counts:
            counts[cls_name] += 1

        detections_list.append({
            "id": idx,
            "class": cls_name,
            "confidence": conf,
            "bbox": [int(x1), int(y1), int(x2), int(y2)]
        })

        color = CLASS_COLORS.get(cls_name, (0, 255, 0))
        cv2.rectangle(annotated_img, (x1, y1), (x2, y2), color, 2)
        label_text = f"{cls_name} {conf:.2f}"
        cv2.putText(annotated_img, label_text, (x1, max(18, y1 - 6)), cv2.FONT_HERSHEY_SIMPLEX, 0.55, color, 2)

        print(f"  * #{idx} {cls_name.capitalize()}: confidence={conf:.2f} | BBox=[{x1}, {y1}, {x2}, {y2}]")

    print("\nSUMMARY COUNTS:")
    for c_name, c_cnt in counts.items():
        print(f"  - {c_name.capitalize():<18}: {c_cnt}")
    print(f"Total Detections: {len(results.boxes)}")

    filename = os.path.basename(image_path)
    stem = os.path.splitext(filename)[0]
    out_filename = f"annotated_{stem}.jpg"
    out_path = OUTPUT_DIR / out_filename
    cv2.imwrite(str(out_path), annotated_img)
    print(f"\n[OK] Annotated output image saved to: {out_path}")
    return counts, detections_list, out_path

if __name__ == '__main__':
    if len(sys.argv) > 1:
        target_img = sys.argv[1]
    else:
        target_img = r"backend\test_assets\real_breadboard_photo.jpg"
    run_detection(target_img, conf_threshold=0.20)
