"""
Comprehensive Evaluation & Comparison Script:
CURRENT YOLOv8n vs IMPROVED YOLOv8n
Evaluates:
- Validation metrics on benchmark dataset (Precision, Recall, mAP50, mAP50-95, per-class metrics)
- Side-by-side inference on unseen real breadboard images
- Per-class counts and detection quality
- Generates side-by-side visual comparison images
"""

import os
import cv2
import json
import time
from pathlib import Path
import numpy as np
from ultralytics import YOLO

ROOT_DIR = Path(r"E:\CIRCUIT STIMULATOR")
DATA_YAML = ROOT_DIR / "backend" / "dataset" / "processed_6class" / "data.yaml"

CURRENT_MODEL_PATH = ROOT_DIR / "runs" / "detect" / "backend" / "cv" / "runs" / "breadboard_6class" / "weights" / "best.pt"
IMPROVED_MODEL_PATH = ROOT_DIR / "runs" / "detect" / "backend" / "cv" / "runs" / "breadboard_6class_improved" / "weights" / "best.pt"

OUTPUT_COMP_DIR = ROOT_DIR / "backend" / "dataset" / "improved_comparison"

TEST_IMAGES = [
    ROOT_DIR / "backend" / "dataset" / "processed" / "images" / "test" / "BreadboardWithResistor-s-18_png.rf.32e6868cac5db768530d99d2b5aea767.jpg",
    ROOT_DIR / "backend" / "dataset" / "processed" / "images" / "test" / "IMG_0800_png.rf.7a793caa0b233723f08a633b2cd7b664.jpg",
    ROOT_DIR / "backend" / "dataset" / "processed" / "images" / "test" / "IMG_0828_png.rf.61714770d7fe5e1b7d0db4958ebaa6e5.jpg",
    ROOT_DIR / "backend" / "dataset" / "processed" / "images" / "test" / "IMG_0850_png.rf.df4d2f77b3f83e5e2beec1efd78c412f.jpg",
    ROOT_DIR / "backend" / "dataset" / "processed" / "images" / "test" / "IMG_0864_png.rf.8bfe2c75318a387e671ed2b38af19a67.jpg",
    ROOT_DIR / "backend" / "test_assets" / "real_breadboard_photo.jpg"
]

CLASSES = ["resistor", "diode_rectifier", "ic_chip", "wire", "capacitor", "led"]
CLASS_COLORS = {
    'resistor': (0, 165, 255),        # Orange
    'diode_rectifier': (255, 0, 255), # Magenta
    'ic_chip': (0, 255, 255),         # Yellow
    'wire': (255, 255, 0),            # Cyan
    'capacitor': (255, 0, 0),         # Blue
    'led': (0, 255, 0)                # Green
}

def annotate_predictions(img, boxes, model_name):
    ann = img.copy()
    cv2.putText(ann, f"{model_name}", (15, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.75, (0, 255, 255), 2)
    for b in boxes:
        x1, y1, x2, y2 = b["bbox"]
        cls_name = b["class"]
        conf = b["conf"]
        color = CLASS_COLORS.get(cls_name, (0, 255, 0))
        cv2.rectangle(ann, (x1, y1), (x2, y2), color, 2)
        cv2.putText(ann, f"{cls_name} {conf:.2f}", (x1, max(18, y1 - 5)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
    return ann

def compare_models():
    os.makedirs(OUTPUT_COMP_DIR, exist_ok=True)

    print("=" * 85)
    print("      BENCHMARK: CURRENT YOLOv8n vs IMPROVED TARGETED YOLOv8n          ")
    print("=" * 85)

    curr_model = YOLO(str(CURRENT_MODEL_PATH))
    imp_model = YOLO(str(IMPROVED_MODEL_PATH))

    # 1. Validation metrics
    print("\n--- 1. OVERALL VALIDATION METRICS ---")
    curr_val = curr_model.val(data=str(DATA_YAML), split="val", verbose=False)
    imp_val = imp_model.val(data=str(DATA_YAML), split="val", verbose=False)

    print(f"{'METRIC':<22} | {'CURRENT YOLOv8n':<22} | {'IMPROVED YOLOv8n':<22} | {'DIFF':<12}")
    print("-" * 85)
    
    p_curr, p_imp = float(curr_val.box.mp), float(imp_val.box.mp)
    r_curr, r_imp = float(curr_val.box.mr), float(imp_val.box.mr)
    map50_curr, map50_imp = float(curr_val.box.map50), float(imp_val.box.map50)
    map_curr, map_imp = float(curr_val.box.map), float(imp_val.box.map)

    print(f"{'Precision':<22} | {p_curr*100:<20.2f}% | {p_imp*100:<20.2f}% | {(p_imp-p_curr)*100:+.2f}%")
    print(f"{'Recall':<22} | {r_curr*100:<20.2f}% | {r_imp*100:<20.2f}% | {(r_imp-r_curr)*100:+.2f}%")
    print(f"{'mAP@0.50':<22} | {map50_curr*100:<20.2f}% | {map50_imp*100:<20.2f}% | {(map50_imp-map50_curr)*100:+.2f}%")
    print(f"{'mAP@0.50:0.95':<22} | {map_curr*100:<20.2f}% | {map_imp*100:<20.2f}% | {(map_imp-map_curr)*100:+.2f}%")
    print("-" * 85)

    # 2. Per-class metrics
    print("\n--- 2. PER-CLASS METRIC BREAKDOWN (Precision / Recall / mAP50 / mAP50-95) ---")
    print(f"{'CLASS':<16} | {'CURRENT (P / R / mAP50)':<30} | {'IMPROVED (P / R / mAP50)':<30}")
    print("-" * 85)
    for i, name in enumerate(CLASSES):
        p1 = curr_val.box.p[i] if i < len(curr_val.box.p) else 0
        r1 = curr_val.box.r[i] if i < len(curr_val.box.r) else 0
        m1 = curr_val.box.ap50[i] if i < len(curr_val.box.ap50) else 0

        p2 = imp_val.box.p[i] if i < len(imp_val.box.p) else 0
        r2 = imp_val.box.r[i] if i < len(imp_val.box.r) else 0
        m2 = imp_val.box.ap50[i] if i < len(imp_val.box.ap50) else 0

        print(f"{name:<16} | {p1:.3f} / {r1:.3f} / {m1:.3f} {'':<8} | {p2:.3f} / {r2:.3f} / {m2:.3f}")
    print("-" * 85)

    # 3. Real unseen breadboard test images
    print("\n--- 3. UNSEEN REAL BREADBOARD IMAGES DETECTION EVALUATION ---")
    for idx, img_p in enumerate(TEST_IMAGES, 1):
        if not img_p.exists():
            continue
        filename = img_p.name
        img = cv2.imread(str(img_p))
        if img is None:
            continue

        c_res = curr_model(img, conf=0.20, verbose=False)[0]
        i_res = imp_model(img, conf=0.20, verbose=False)[0]

        def get_box_info(res, m):
            boxes = []
            counts = {c: 0 for c in CLASSES}
            for b in res.boxes:
                x1, y1, x2, y2 = b.xyxy[0].cpu().numpy().astype(int)
                conf = float(b.conf[0].cpu().numpy())
                cls_id = int(b.cls[0].cpu().numpy())
                cls_name = m.names.get(cls_id, f"class_{cls_id}")
                if cls_name in counts:
                    counts[cls_name] += 1
                boxes.append({"class": cls_name, "conf": conf, "bbox": [x1, y1, x2, y2]})
            return boxes, counts

        c_boxes, c_counts = get_box_info(c_res, curr_model)
        i_boxes, i_counts = get_box_info(i_res, imp_model)

        ann1 = annotate_predictions(img, c_boxes, "CURRENT YOLOv8n")
        ann2 = annotate_predictions(img, i_boxes, "IMPROVED YOLOv8n")
        stacked = np.hstack([ann1, ann2])
        out_path = OUTPUT_COMP_DIR / f"eval_{filename}"
        cv2.imwrite(str(out_path), stacked)

        print(f"\n==========================================================================")
        print(f"IMAGE #{idx}: {filename}")
        print(f"==========================================================================")
        print(f"CURRENT MODEL (Total: {len(c_boxes)}):")
        print(f"  Resistor = {c_counts['resistor']}, LED = {c_counts['led']}, Wire = {c_counts['wire']}, Diode = {c_counts['diode_rectifier']}, IC = {c_counts['ic_chip']}, Capacitor = {c_counts['capacitor']}")
        print(f"IMPROVED MODEL (Total: {len(i_boxes)}):")
        print(f"  Resistor = {i_counts['resistor']}, LED = {i_counts['led']}, Wire = {i_counts['wire']}, Diode = {i_counts['diode_rectifier']}, IC = {i_counts['ic_chip']}, Capacitor = {i_counts['capacitor']}")
        print(f"-> Annotated side-by-side saved: {out_path}")

if __name__ == '__main__':
    compare_models()
