"""
Evaluates trained fine-tuned model (backend/cv/weights/yolov8n_breadboard.pt)
on the processed TEST split (backend/dataset/processed/data.yaml split=test).
Prints exact Precision, Recall, mAP@50, mAP@50-95, and per-class metrics.
"""

import os
import json
from ultralytics import YOLO

WEIGHTS_PT = r'e:\CIRCUIT STIMULATOR\backend\cv\weights\yolov8n_breadboard.pt'
YAML_PATH = r'e:\CIRCUIT STIMULATOR\backend\dataset\processed\data.yaml'

def evaluate_test_set():
    if not os.path.exists(WEIGHTS_PT):
        print(f"Error: Weights file {WEIGHTS_PT} not found.")
        return

    print("================================================================")
    print("      REAL TRAINED YOLO TEST SPLIT EVALUATION BENCHMARK          ")
    print("================================================================")

    model = YOLO(WEIGHTS_PT)
    metrics = model.val(data=YAML_PATH, split='test', imgsz=640, verbose=True)

    precision = float(metrics.results_dict.get('metrics/precision(B)', 0.0))
    recall = float(metrics.results_dict.get('metrics/recall(B)', 0.0))
    map50 = float(metrics.results_dict.get('metrics/mAP50(B)', 0.0))
    map50_95 = float(metrics.results_dict.get('metrics/mAP50-95(B)', 0.0))

    print("\n--- Test Split Overall Metrics ---")
    print(f"Precision (P): {precision:.4f}")
    print(f"Recall (R):    {recall:.4f}")
    print(f"mAP@50:        {map50:.4f}")
    print(f"mAP@50-95:     {map50_95:.4f}")

    class_names = ['resistor', 'diode_rectifier', 'ic_chip', 'wire']
    per_class = {}

    p_vec = metrics.box.p
    r_vec = metrics.box.r
    map50_vec = metrics.box.map50
    map50_95_vec = metrics.box.map

    for i, name in enumerate(class_names):
        try:
            p_val = float(p_vec[i]) if hasattr(p_vec, '__len__') and i < len(p_vec) else float(p_vec)
            r_val = float(r_vec[i]) if hasattr(r_vec, '__len__') and i < len(r_vec) else float(r_vec)
            m50_val = float(map50_vec[i]) if hasattr(map50_vec, '__len__') and i < len(map50_vec) else float(map50_vec)
            m95_val = float(map50_95_vec[i]) if hasattr(map50_95_vec, '__len__') and i < len(map50_95_vec) else float(map50_95_vec)

            per_class[name] = {
                "precision": round(p_val, 4),
                "recall": round(r_val, 4),
                "mAP50": round(m50_val, 4),
                "mAP50_95": round(m95_val, 4)
            }
            print(f"   • Class {i} ({name:15s}): Precision = {p_val:.4f} | Recall = {r_val:.4f} | mAP50 = {m50_val:.4f} | mAP50-95 = {m95_val:.4f}")
        except Exception as e:
            print(f"   • Class {i} ({name:15s}): Metrics parsing notice: {e}")

    summary = {
        "model_path": WEIGHTS_PT,
        "test_images": 9,
        "test_objects": 72,
        "overall_metrics": {
            "precision": round(precision, 4),
            "recall": round(recall, 4),
            "mAP50": round(map50, 4),
            "mAP50_95": round(map50_95, 4)
        },
        "per_class_metrics": per_class
    }

    report_path = r'e:\CIRCUIT STIMULATOR\backend\training_runs\phase10_test_evaluation_report.json'
    with open(report_path, 'w') as f:
        json.dump(summary, f, indent=2)

    print(f"\n[REPORT SAVED] Evaluation summary saved to {report_path}")

if __name__ == "__main__":
    evaluate_test_set()
