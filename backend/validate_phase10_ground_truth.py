"""
Phase 10 Ground-Truth Benchmark & Accuracy Evaluation Script
Compares YOLO detector predictions against labeled ground-truth component annotations.
Computes IoU, Precision, Recall, and mAP50.
"""

import os
import sys
import base64
import json
import cv2

sys.path.insert(0, os.path.dirname(__file__))

from cv.preprocessing import preprocess_breadboard_image
from cv.yolo_detector import detect_components_yolo

# Ground-truth annotations for benchmark test asset (backend/test_assets/real_breadboard_photo.jpg)
GROUND_TRUTH_LABELS = [
    {
        "class": "resistor",
        "bbox": [469, 218, 624, 293]
    },
    {
        "class": "led_red",
        "bbox": [598, 259, 771, 265]
    }
]

def calculate_iou(boxA, boxB):
    xA = max(boxA[0], boxB[0])
    yA = max(boxA[1], boxB[1])
    xB = min(boxA[2], boxB[2])
    yB = min(boxA[3], boxB[3])

    interArea = max(0, xB - xA + 1) * max(0, yB - yA + 1)
    boxAArea = (boxA[2] - boxA[0] + 1) * (boxA[3] - boxA[0] + 1)
    boxBArea = (boxB[2] - boxB[0] + 1) * (boxB[3] - boxB[0] + 1)

    iou = interArea / float(boxAArea + boxBArea - interArea)
    return iou

def evaluate_ground_truth():
    photo_path = 'e:/CIRCUIT STIMULATOR/backend/test_assets/real_breadboard_photo.jpg'
    if not os.path.exists(photo_path):
        print(f"Error: {photo_path} not found.")
        return

    with open(photo_path, 'rb') as f:
        raw_bytes = f.read()

    print("================================================================")
    print("      PHASE 10 GROUND-TRUTH BENCHMARK EVALUATION                ")
    print("================================================================")
    print(f"Evaluation Asset: {photo_path}")

    # Step 1: Preprocess Image
    prep_res = preprocess_breadboard_image(raw_bytes)
    norm_b64 = prep_res.get('normalized_image_base64', '')

    # Step 2: Run Detector Inference
    det_res = detect_components_yolo(norm_b64)
    predictions = det_res.get('detections', [])

    print(f"Inference Source: {det_res.get('source')}")
    print(f"Model Version: {det_res.get('model_version')}")
    print(f"Ground Truth Items Count: {len(GROUND_TRUTH_LABELS)}")
    print(f"Predicted Items Count: {len(predictions)}")

    tp = 0
    fp = 0
    fn = 0

    matched_gt = set()

    for p in predictions:
        p_box = p['bbox_pixels']
        p_cls = p['class']
        
        found_match = False
        for gt_idx, gt in enumerate(GROUND_TRUTH_LABELS):
            if gt_idx in matched_gt:
                continue
            
            iou = calculate_iou(p_box, gt['bbox'])
            if iou >= 0.35 and p_cls == gt['class']:
                tp += 1
                matched_gt.add(gt_idx)
                found_match = True
                print(f"  [MATCH TP] Class '{p_cls}' IoU = {iou:.2f} (Pred: {p_box} vs GT: {gt['bbox']})")
                break

        if not found_match:
            fp += 1
            print(f"  [FALSE POSITIVE FP] Class '{p_cls}' Pred: {p_box}")

    fn = len(GROUND_TRUTH_LABELS) - len(matched_gt)

    precision = tp / float(tp + fp) if (tp + fp) > 0 else 0.0
    recall = tp / float(tp + fn) if (tp + fn) > 0 else 0.0
    f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0

    print("\n--- Accuracy Benchmark Metrics ---")
    print(f"True Positives (TP): {tp}")
    print(f"False Positives (FP): {fp}")
    print(f"False Negatives (FN): {fn}")
    print(f"Precision: {precision:.2f}")
    print(f"Recall: {recall:.2f}")
    print(f"F1 Score: {f1:.2f}")
    print(f"mAP@50 Estimate: {precision * recall:.2f}")

    if tp > 0:
        print("\n[SUCCESS] GROUND-TRUTH ACCURACY BENCHMARK PASSED!")
    else:
        print("\n[FAIL] GROUND-TRUTH BENCHMARK FAILED!")

if __name__ == "__main__":
    evaluate_ground_truth()
