"""
SmartBreadboard 3D — Real-World YOLO Failure Diagnosis & Threshold Sweep
Analyzes false positives, PCB/microcontroller interference, class confusion,
and training dataset domain gaps on the production model.
"""

import os
import sys
import cv2
import numpy as np
import json
from ultralytics import YOLO

BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
PROD_MODEL = os.path.abspath(os.path.join(BACKEND_DIR, "..", "runs", "detect", "backend", "cv", "runs", "breadboard_6class", "weights", "best.pt"))
OUTPUT_DIR = os.path.join(BACKEND_DIR, "dataset", "failure_diagnosis")
os.makedirs(OUTPUT_DIR, exist_ok=True)

CLASSES = ["resistor", "diode_rectifier", "ic_chip", "wire", "capacitor", "led"]
CLASS_COLORS = {
    'resistor': (0, 165, 255),        # Orange
    'diode_rectifier': (255, 0, 255), # Magenta
    'ic_chip': (0, 255, 255),         # Yellow
    'wire': (255, 255, 0),            # Cyan
    'capacitor': (255, 0, 0),         # Blue
    'led': (0, 255, 0)                # Green
}

print("=" * 70)
print("YOLO FAILURE DIAGNOSIS & THRESHOLD SWEEP")
print(f"Model: {PROD_MODEL}")
print("=" * 70)

model = YOLO(PROD_MODEL)

# 1. Test image with Arduino / real setup
real_img_path = os.path.join(BACKEND_DIR, "test_assets", "real_breadboard_photo.jpg")
cv_img = cv2.imread(real_img_path)
assert cv_img is not None, f"Could not load {real_img_path}"
h, w = cv_img.shape[:2]

thresholds = [0.70, 0.60, 0.50, 0.40, 0.30, 0.25, 0.20, 0.15, 0.10]
sweep_results = {}

print("\n--- 1. CONFIDENCE THRESHOLD SWEEP ON REAL ARDUINO + BREADBOARD PHOTO ---")
for conf in thresholds:
    res = model(cv_img, conf=conf, verbose=False)[0]
    boxes = res.boxes
    det_list = []
    
    vis_img = cv_img.copy()
    counts = {c: 0 for c in CLASSES}
    
    for box in boxes:
        x1, y1, x2, y2 = [int(v) for v in box.xyxy[0].cpu().numpy()]
        score = float(box.conf[0].cpu().numpy())
        cls_id = int(box.cls[0].cpu().numpy())
        cls_name = CLASSES[cls_id] if cls_id < len(CLASSES) else f"cls_{cls_id}"
        counts[cls_name] += 1
        
        det_list.append({
            "class": cls_name,
            "confidence": round(score, 3),
            "bbox": [x1, y1, x2, y2]
        })
        
        color = CLASS_COLORS.get(cls_name, (255, 255, 255))
        cv2.rectangle(vis_img, (x1, y1), (x2, y2), color, 2)
        label = f"{cls_name} {score:.2f}"
        cv2.putText(vis_img, label, (x1, max(18, y1 - 6)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
        
    out_img_name = f"real_photo_conf_{int(conf*100):02d}.jpg"
    cv2.imwrite(os.path.join(OUTPUT_DIR, out_img_name), vis_img)
    
    sweep_results[conf] = {
        "count": len(det_list),
        "counts_by_class": counts,
        "detections": det_list
    }
    
    print(f"Conf >= {conf:.2f} | Total: {len(det_list):2d} | R: {counts['resistor']}, LED: {counts['led']}, Wire: {counts['wire']}, Diode: {counts['diode_rectifier']}, IC: {counts['ic_chip']}, Cap: {counts['capacitor']}")

# Print detailed detections at conf=0.15 (capturing all raw proposals)
print("\n--- 2. ALL DETECTIONS AT CONF=0.15 (RAW PROPOSALS) ---")
for idx, d in enumerate(sweep_results[0.15]["detections"], 1):
    x1, y1, x2, y2 = d["bbox"]
    box_w = x2 - x1
    box_h = y2 - y1
    print(f"[{idx}] {d['class']:<16} conf: {d['confidence']:.3f} | bbox: [{x1}, {y1}, {x2}, {y2}] (w={box_w}, h={box_h})")

# 2. Domain comparison: A: breadboard-only, B: breadboard + Arduino, C: dense breadboard
print("\n--- 3. DOMAIN COMPARISON TEST ---")
domain_images = {
    "Domain A (Breadboard-Only)": os.path.join(BACKEND_DIR, "dataset", "processed_6class", "images", "val", "BreadboardWithResistor-s-12_png.rf.b80cf316cd70d22b8af68b1c9ec5222f.jpg"),
    "Domain B (Breadboard + Arduino PCB)": real_img_path,
    "Domain C (Dense Multi-Component Breadboard)": os.path.join(BACKEND_DIR, "dataset", "processed_6class", "images", "val", "IMG_0809_png.rf.2a295a8022cf4bb212838c0699796127.jpg")
}

for domain_name, img_p in domain_images.items():
    if not os.path.exists(img_p):
        continue
    d_img = cv2.imread(img_p)
    d_res = model(d_img, conf=0.25, verbose=False)[0]
    d_counts = {c: 0 for c in CLASSES}
    for box in d_res.boxes:
        c_id = int(box.cls[0].cpu().numpy())
        c_name = CLASSES[c_id]
        d_counts[c_name] += 1
    print(f"\n{domain_name}:")
    print(f"  Total Detections (conf>=0.25): {len(d_res.boxes)}")
    for c, cnt in d_counts.items():
        if cnt > 0:
            print(f"    - {c}: {cnt}")

# 3. Training dataset inspection for background / PCB objects
print("\n--- 4. TRAINING DATASET BACKGROUND & DOMAIN INSPECTION ---")
train_labels_dir = os.path.join(BACKEND_DIR, "dataset", "processed_6class", "labels", "train")
num_label_files = len([f for f in os.listdir(train_labels_dir) if f.endswith('.txt')])
print(f"Total training image label files: {num_label_files}")

empty_background_images = 0
total_objects = 0
class_dist = {i: 0 for i in range(6)}

for lf in os.listdir(train_labels_dir):
    if not lf.endswith('.txt'):
        continue
    lp = os.path.join(train_labels_dir, lf)
    with open(lp, 'r') as f:
        lines = f.readlines()
    if len(lines) == 0:
        empty_background_images += 1
    for line in lines:
        parts = line.strip().split()
        if parts:
            cid = int(parts[0])
            class_dist[cid] += 1
            total_objects += 1

print(f"Images with 0 annotations (Pure background negatives): {empty_background_images} / {num_label_files} ({empty_background_images/num_label_files*100:.1f}%)")
print("Training class object counts:")
for cid, cnt in class_dist.items():
    print(f"  Class {cid} ({CLASSES[cid]}): {cnt} ({cnt/total_objects*100:.1f}%)")

print("\nDIAGNOSIS COMPLETE. Saved threshold images to backend/dataset/failure_diagnosis/")
