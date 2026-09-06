"""
SmartBreadboard 3D — Phase 10 YOLOv8 Training & Test Evaluation Pipeline
Trains YOLOv8n on verified dataset (backend/dataset/processed/data.yaml),
exports fine-tuned weights, evaluates on the TEST split, and reports real metrics.
"""

import os
import sys
import time
import json
import torch
from ultralytics import YOLO

PROCESSED_YAML = r'e:\CIRCUIT STIMULATOR\backend\dataset\processed\data.yaml'
RUNS_DIR = r'e:\CIRCUIT STIMULATOR\backend\training_runs'
WEIGHTS_DIR = r'e:\CIRCUIT STIMULATOR\backend\cv\weights'

def run_training_and_evaluation():
    os.makedirs(RUNS_DIR, exist_ok=True)
    os.makedirs(WEIGHTS_DIR, exist_ok=True)

    print("================================================================")
    print("      PHASE 10 YOLOv8 TRAINING & TEST EVALUATION PIPELINE        ")
    print("================================================================")
    print(f"Dataset YAML: {PROCESSED_YAML}")
    print(f"PyTorch Version: {torch.__version__}")
    print(f"Device: CPU Execution")

    start_time = time.time()

    # Step 1: Load base YOLOv8n pretrained weights
    print("\n--- Step 1: Loading pretrained YOLOv8n backbone ---")
    model = YOLO('yolov8n.pt')

    # Step 2: Fine-tune on processed breadboard component dataset
    print("\n--- Step 2: Starting transfer learning fine-tuning ---")
    train_results = model.train(
        data=PROCESSED_YAML,
        epochs=15,
        imgsz=640,
        batch=8,
        workers=2,
        name='phase10_yolo_run',
        project=RUNS_DIR,
        exist_ok=True,
        verbose=True
    )

    end_train_time = time.time()
    train_duration_sec = round(end_train_time - start_time, 2)
    print(f"\n[TRAINING COMPLETE] Time elapsed: {train_duration_sec} s ({round(train_duration_sec/60, 2)} min)")

    # Step 3: Copy best weights to backend/cv/weights/
    best_weights_path = os.path.join(RUNS_DIR, 'phase10_yolo_run', 'weights', 'best.pt')
    target_pt_path = os.path.join(WEIGHTS_DIR, 'yolov8n_breadboard.pt')
    target_onnx_path = os.path.join(WEIGHTS_DIR, 'yolov8n_breadboard.onnx')

    if os.path.exists(best_weights_path):
        import shutil
        shutil.copy2(best_weights_path, target_pt_path)
        print(f"[WEIGHTS SAVED] Best PyTorch weights copied to: {target_pt_path}")

        # Export to ONNX format for zero-PyTorch dependency backend execution
        best_model = YOLO(target_pt_path)
        onnx_exported = best_model.export(format='onnx', imgsz=640)
        if os.path.exists(onnx_exported):
            shutil.move(onnx_exported, target_onnx_path)
            print(f"[ONNX EXPORT] ONNX model exported to: {target_onnx_path}")

    # Step 4: Evaluate on TEST split
    print("\n--- Step 4: Real Model Evaluation on TEST Split ---")
    eval_model = YOLO(target_pt_path)
    val_results = eval_model.val(data=PROCESSED_YAML, split='test', imgsz=640, verbose=True)

    # Extract metrics
    precision = float(val_results.results_dict.get('metrics/precision(B)', 0.0))
    recall = float(val_results.results_dict.get('metrics/recall(B)', 0.0))
    map50 = float(val_results.results_dict.get('metrics/mAP50(B)', 0.0))
    map50_95 = float(val_results.results_dict.get('metrics/mAP50-95(B)', 0.0))

    class_names = ['resistor', 'diode_rectifier', 'ic_chip', 'wire']
    per_class_metrics = {}

    if hasattr(val_results, 'box'):
        p_per_class = val_results.box.p
        r_per_class = val_results.box.r
        map50_per_class = val_results.box.map50
        
        for idx, name in enumerate(class_names):
            if idx < len(p_per_class):
                per_class_metrics[name] = {
                    "precision": round(float(p_per_class[idx]), 4),
                    "recall": round(float(r_per_class[idx]), 4),
                    "mAP50": round(float(map50_per_class[idx]), 4)
                }

    metrics_summary = {
        "model_version": "YOLOv8n-Breadboard-v1",
        "training_epochs": 15,
        "image_size": 640,
        "batch_size": 8,
        "device": "CPU",
        "training_time_sec": train_duration_sec,
        "best_checkpoint_path": target_pt_path,
        "onnx_checkpoint_path": target_onnx_path,
        "test_images_count": 9,
        "test_objects_count": 72,
        "metrics": {
            "precision": round(precision, 4),
            "recall": round(recall, 4),
            "mAP50": round(map50, 4),
            "mAP50_95": round(map50_95, 4)
        },
        "per_class_metrics": per_class_metrics
    }

    report_json_path = os.path.join(RUNS_DIR, 'phase10_evaluation_report.json')
    with open(report_json_path, 'w') as f:
        json.dump(metrics_summary, f, indent=2)

    print("\n================================================================")
    print("      FINAL PHASE 10 TRAINING & EVALUATION REPORT              ")
    print("================================================================")
    print(json.dumps(metrics_summary, indent=2))

if __name__ == "__main__":
    run_training_and_evaluation()
