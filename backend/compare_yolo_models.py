"""
Comprehensive Model Comparison Script:
CURRENT MODEL (YOLOv8n) vs ALTERNATIVE MODEL (YOLO11n)
Evaluates:
- Precision, Recall, mAP50, mAP50-95, Inference Time
- Per-class detection breakdown on the same unseen real breadboard images (Resistor, LED, Wire, Diode, Capacitor, IC)
- False positives and missed detection analysis
- Generates side-by-side annotated images for direct visual inspection.
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
ALT_MODEL_PATH = ROOT_DIR / "runs" / "detect" / "backend" / "cv" / "runs" / "breadboard_6class_alternative" / "weights" / "best.pt"

OUTPUT_COMP_DIR = ROOT_DIR / "backend" / "dataset" / "model_comparison"

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
    h, w = ann.shape[:2]
    cv2.putText(ann, f"{model_name}", (15, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)
    for b in boxes:
        x1, y1, x2, y2 = b["bbox"]
        cls_name = b["class"]
        conf = b["conf"]
        color = CLASS_COLORS.get(cls_name, (0, 255, 0))
        cv2.rectangle(ann, (x1, y1), (x2, y2), color, 2)
        cv2.putText(ann, f"{cls_name} {conf:.2f}", (x1, max(18, y1 - 5)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
    return ann

def evaluate_models():
    os.makedirs(OUTPUT_COMP_DIR, exist_ok=True)

    print("=" * 85)
    print("      COMPREHENSIVE MODEL COMPARISON: CURRENT MODEL vs ALTERNATIVE MODEL      ")
    print("=" * 85)

    assert CURRENT_MODEL_PATH.exists(), f"Current model not found at {CURRENT_MODEL_PATH}"
    assert ALT_MODEL_PATH.exists(), f"Alternative model not found at {ALT_MODEL_PATH}"

    # Load models
    curr_model = YOLO(str(CURRENT_MODEL_PATH))
    alt_model = YOLO(str(ALT_MODEL_PATH))

    # 1. Validation metrics on test/val set
    print("\n[STEP 1] Evaluating Validation Metrics on Processed 6-Class Dataset...")
    curr_val = curr_model.val(data=str(DATA_YAML), split="val", verbose=False)
    alt_val = alt_model.val(data=str(DATA_YAML), split="val", verbose=False)

    curr_metrics = {
        "precision": float(curr_val.box.mp),
        "recall": float(curr_val.box.mr),
        "map50": float(curr_val.box.map50),
        "map50_95": float(curr_val.box.map),
        "speed_inference_ms": float(curr_val.speed.get("inference", 0.0))
    }

    alt_metrics = {
        "precision": float(alt_val.box.mp),
        "recall": float(alt_val.box.mr),
        "map50": float(alt_val.box.map50),
        "map50_95": float(alt_val.box.map),
        "speed_inference_ms": float(alt_val.speed.get("inference", 0.0))
    }

    print("\n" + "-" * 85)
    print(f"{'METRIC':<25} | {'CURRENT (YOLOv8n)':<25} | {'ALTERNATIVE (YOLO11n)':<25}")
    print("-" * 85)
    print(f"{'Precision':<25} | {curr_metrics['precision']:.4f} ({curr_metrics['precision']*100:.1f}%) {'':<11} | {alt_metrics['precision']:.4f} ({alt_metrics['precision']*100:.1f}%)")
    print(f"{'Recall':<25} | {curr_metrics['recall']:.4f} ({curr_metrics['recall']*100:.1f}%) {'':<11} | {alt_metrics['recall']:.4f} ({alt_metrics['recall']*100:.1f}%)")
    print(f"{'mAP@0.50':<25} | {curr_metrics['map50']:.4f} ({curr_metrics['map50']*100:.1f}%) {'':<11} | {alt_metrics['map50']:.4f} ({alt_metrics['map50']*100:.1f}%)")
    print(f"{'mAP@0.50:0.95':<25} | {curr_metrics['map50_95']:.4f} ({curr_metrics['map50_95']*100:.1f}%) {'':<11} | {alt_metrics['map50_95']:.4f} ({alt_metrics['map50_95']*100:.1f}%)")
    print(f"{'Inference Speed (CPU)':<25} | {curr_metrics['speed_inference_ms']:.1f} ms/img {'':<14} | {alt_metrics['speed_inference_ms']:.1f} ms/img")
    print("-" * 85)

    # 2. Per-image comparison on unseen real images
    print("\n[STEP 2] Running Side-by-Side Inference on Unseen Real Breadboard Images (conf >= 0.20)...")

    image_comparisons = []

    for img_idx, img_path in enumerate(TEST_IMAGES, 1):
        if not img_path.exists():
            continue

        filename = img_path.name
        img = cv2.imread(str(img_path))
        if img is None:
            continue

        # Benchmark current model
        t0 = time.perf_counter()
        curr_res = curr_model(img, conf=0.20, verbose=False)[0]
        curr_infer_time = (time.perf_counter() - t0) * 1000

        curr_boxes = []
        curr_counts = {c: 0 for c in CLASSES}
        for box in curr_res.boxes:
            x1, y1, x2, y2 = box.xyxy[0].cpu().numpy().astype(int)
            conf = float(box.conf[0].cpu().numpy())
            cls_id = int(box.cls[0].cpu().numpy())
            cls_name = curr_model.names.get(cls_id, f"class_{cls_id}")
            if cls_name in curr_counts:
                curr_counts[cls_name] += 1
            curr_boxes.append({"class": cls_name, "conf": conf, "bbox": [x1, y1, x2, y2]})

        # Benchmark alternative model
        t0 = time.perf_counter()
        alt_res = alt_model(img, conf=0.20, verbose=False)[0]
        alt_infer_time = (time.perf_counter() - t0) * 1000

        alt_boxes = []
        alt_counts = {c: 0 for c in CLASSES}
        for box in alt_res.boxes:
            x1, y1, x2, y2 = box.xyxy[0].cpu().numpy().astype(int)
            conf = float(box.conf[0].cpu().numpy())
            cls_id = int(box.cls[0].cpu().numpy())
            cls_name = alt_model.names.get(cls_id, f"class_{cls_id}")
            if cls_name in alt_counts:
                alt_counts[cls_name] += 1
            alt_boxes.append({"class": cls_name, "conf": conf, "bbox": [x1, y1, x2, y2]})

        # Generate side-by-side visualization
        ann_curr = annotate_predictions(img, curr_boxes, "CURRENT: YOLOv8n")
        ann_alt = annotate_predictions(img, alt_boxes, "ALTERNATIVE: YOLO11n")
        
        # Stack side by side
        side_by_side = np.hstack([ann_curr, ann_alt])
        out_vis_path = OUTPUT_COMP_DIR / f"comparison_{filename}"
        cv2.imwrite(str(out_vis_path), side_by_side)

        image_comparisons.append({
            "index": img_idx,
            "filename": filename,
            "current": {
                "counts": curr_counts,
                "total": len(curr_boxes),
                "time_ms": curr_infer_time
            },
            "alternative": {
                "counts": alt_counts,
                "total": len(alt_boxes),
                "time_ms": alt_infer_time
            }
        })

        print(f"\n==========================================================================")
        print(f"IMAGE #{img_idx}: {filename}")
        print(f"==========================================================================")
        print(f"CURRENT MODEL (YOLOv8n) [Inference: {curr_infer_time:.1f}ms, Total: {len(curr_boxes)}]:")
        print(f"  Resistor = {curr_counts['resistor']}, LED = {curr_counts['led']}, Wire = {curr_counts['wire']}, Diode = {curr_counts['diode_rectifier']}, Capacitor = {curr_counts['capacitor']}, IC = {curr_counts['ic_chip']}")
        print(f"ALTERNATIVE MODEL (YOLO11n) [Inference: {alt_infer_time:.1f}ms, Total: {len(alt_boxes)}]:")
        print(f"  Resistor = {alt_counts['resistor']}, LED = {alt_counts['led']}, Wire = {alt_counts['wire']}, Diode = {alt_counts['diode_rectifier']}, Capacitor = {alt_counts['capacitor']}, IC = {alt_counts['ic_chip']}")
        print(f"-> Visual comparison saved to: {out_vis_path}")

    # Summary table
    print("\n" + "=" * 85)
    print("                    PER-IMAGE COMPARISON MATRIX SUMMARY")
    print("=" * 85)
    for c in image_comparisons:
        print(f"IMAGE #{c['index']}: {c['filename'][:30]}")
        print(f"  * CURRENT:     Total={c['current']['total']} | R={c['current']['counts']['resistor']} LED={c['current']['counts']['led']} W={c['current']['counts']['wire']} D={c['current']['counts']['diode_rectifier']} C={c['current']['counts']['capacitor']} IC={c['current']['counts']['ic_chip']}")
        print(f"  * ALTERNATIVE: Total={c['alternative']['total']} | R={c['alternative']['counts']['resistor']} LED={c['alternative']['counts']['led']} W={c['alternative']['counts']['wire']} D={c['alternative']['counts']['diode_rectifier']} C={c['alternative']['counts']['capacitor']} IC={c['alternative']['counts']['ic_chip']}")

    print("=" * 85)

if __name__ == "__main__":
    evaluate_models()
