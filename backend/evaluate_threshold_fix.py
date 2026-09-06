"""
SmartBreadboard 3D — Threshold Fix Evaluation (0.20 vs 0.45)
Evaluates the production YOLOv8n model on the real breadboard + Arduino image.
"""

import os
import cv2
import json
import numpy as np
from ultralytics import YOLO

BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
PROD_MODEL_PATH = os.path.abspath(os.path.join(BACKEND_DIR, "..", "runs", "detect", "backend", "cv", "runs", "breadboard_6class", "weights", "best.pt"))
IMG_PATH = os.path.join(BACKEND_DIR, "test_assets", "real_breadboard_photo.jpg")
OUTPUT_DIR = os.path.join(BACKEND_DIR, "test_outputs")
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

def evaluate_threshold(model, img, conf_threshold):
    h, w = img.shape[:2]
    res = model(img, conf=conf_threshold, verbose=False)[0]
    boxes = res.boxes
    
    detections = []
    vis_img = img.copy()
    counts = {c: 0 for c in CLASSES}
    
    for box in boxes:
        x1, y1, x2, y2 = [int(v) for v in box.xyxy[0].cpu().numpy()]
        score = float(box.conf[0].cpu().numpy())
        cls_id = int(box.cls[0].cpu().numpy())
        cls_name = CLASSES[cls_id] if cls_id < len(CLASSES) else f"cls_{cls_id}"
        counts[cls_name] += 1
        
        # Determine if detection is on breadboard or Arduino / PCB
        # In real_breadboard_photo.jpg, Arduino is on the left / bottom-left, breadboard is in the center/right
        center_x = (x1 + x2) / 2
        center_y = (y1 + y2) / 2
        
        # Real breadboard components in the photo:
        # 1. Real Resistor in center of breadboard
        # 2. Real LED inserted into breadboard
        # 3. Real Jumper Wires connecting Arduino to breadboard
        
        detections.append({
            "class": cls_name,
            "confidence": round(score, 3),
            "bbox": [x1, y1, x2, y2],
            "center": [round(center_x, 1), round(center_y, 1)],
            "width": x2 - x1,
            "height": y2 - y1
        })
        
        color = CLASS_COLORS.get(cls_name, (255, 255, 255))
        cv2.rectangle(vis_img, (x1, y1), (x2, y2), color, 2)
        label = f"{cls_name} {score:.2f}"
        cv2.putText(vis_img, label, (x1, max(18, y1 - 6)), cv2.FONT_HERSHEY_SIMPLEX, 0.55, color, 2)
        
    return detections, counts, vis_img

def main():
    print("=" * 70)
    print("EVALUATING YOLO INFERENCE THRESHOLD FIX (0.20 -> 0.45)")
    print(f"Production Model: {PROD_MODEL_PATH}")
    print(f"Image: {IMG_PATH}")
    print("=" * 70)
    
    assert os.path.exists(PROD_MODEL_PATH), f"Model not found: {PROD_MODEL_PATH}"
    assert os.path.exists(IMG_PATH), f"Image not found: {IMG_PATH}"
    
    model = YOLO(PROD_MODEL_PATH)
    img = cv2.imread(IMG_PATH)
    assert img is not None, "Failed to load image"
    
    # 1. Evaluate at conf=0.20
    det_020, counts_020, vis_020 = evaluate_threshold(model, img, 0.20)
    out_020_path = os.path.join(OUTPUT_DIR, "detection_conf_020.jpg")
    cv2.imwrite(out_020_path, vis_020)
    
    # 2. Evaluate at conf=0.45
    det_045, counts_045, vis_045 = evaluate_threshold(model, img, 0.45)
    out_045_path = os.path.join(OUTPUT_DIR, "detection_conf_045.jpg")
    cv2.imwrite(out_045_path, vis_045)
    
    print("\n[CONF = 0.20 RESULTS]")
    print(f"Total Detections: {len(det_020)}")
    print("Counts by class:", json.dumps(counts_020, indent=2))
    print("Detailed detections:")
    for i, d in enumerate(det_020, 1):
        print(f"  {i}. {d['class']:<16} conf={d['confidence']:.3f} bbox={d['bbox']} center={d['center']}")
        
    print("\n" + "-" * 50)
    print("\n[CONF = 0.45 RESULTS]")
    print(f"Total Detections: {len(det_045)}")
    print("Counts by class:", json.dumps(counts_045, indent=2))
    print("Detailed detections:")
    for i, d in enumerate(det_045, 1):
        print(f"  {i}. {d['class']:<16} conf={d['confidence']:.3f} bbox={d['bbox']} center={d['center']}")
        
    # Save JSON summary
    summary = {
        "model": PROD_MODEL_PATH,
        "image": IMG_PATH,
        "conf_0.20": {
            "total": len(det_020),
            "counts": counts_020,
            "detections": det_020
        },
        "conf_0.45": {
            "total": len(det_045),
            "counts": counts_045,
            "detections": det_045
        }
    }
    with open(os.path.join(OUTPUT_DIR, "threshold_comparison_results.json"), "w") as f:
        json.dump(summary, f, indent=2)
        
    print(f"\nSaved annotated images:\n  - {out_020_path}\n  - {out_045_path}")

if __name__ == "__main__":
    main()
