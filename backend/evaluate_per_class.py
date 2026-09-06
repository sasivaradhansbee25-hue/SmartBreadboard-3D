"""
Phase 8 & 10 — Per-Class Metric & Multi-Threshold Evaluation Script
Evaluates YOLOv8 6-class model per class (Precision, Recall, mAP50, mAP50-95)
and tests multiple confidence thresholds (0.25, 0.20, 0.15, 0.10, 0.05).
"""

import os
import sys
from pathlib import Path
from ultralytics import YOLO

ROOT_DIR = Path(r"E:\CIRCUIT STIMULATOR")
DATA_YAML = ROOT_DIR / "backend" / "dataset" / "processed_6class" / "data.yaml"

# Check available weights
WEIGHTS_V2 = ROOT_DIR / "runs" / "detect" / "backend" / "cv" / "runs" / "breadboard_6class_v2" / "weights" / "best.pt"
WEIGHTS_V1 = ROOT_DIR / "runs" / "detect" / "backend" / "cv" / "runs" / "breadboard_6class" / "weights" / "best.pt"
WEIGHTS_CV = ROOT_DIR / "backend" / "cv" / "weights" / "yolov8n_breadboard.pt"

if os.path.exists(WEIGHTS_V2):
    MODEL_PATH = WEIGHTS_V2
elif os.path.exists(WEIGHTS_V1):
    MODEL_PATH = WEIGHTS_V1
else:
    MODEL_PATH = WEIGHTS_CV

CLASS_NAMES = ["resistor", "diode_rectifier", "ic_chip", "wire", "capacitor", "led"]

def run_per_class_evaluation():
    print("==========================================================================")
    print("   PHASE 8 & 10 -- PER-CLASS EVALUATION & MULTI-THRESHOLD ANALYZER        ")
    print("==========================================================================")
    print(f"Target Model Weights: {MODEL_PATH}")
    print(f"Dataset Config: {DATA_YAML}\n")

    model = YOLO(str(MODEL_PATH))

    # 1. Evaluate on test split at default threshold (conf=0.25)
    print("--- 1. Per-Class Metrics at Default Threshold (conf=0.25) ---")
    val_results = model.val(data=str(DATA_YAML), split="test", conf=0.25, verbose=False)

    print(f"\nOverall Metrics:")
    print(f"  * mAP50    : {val_results.box.map50:.4f}")
    print(f"  * mAP50-95 : {val_results.box.map:.4f}")
    print(f"  * Precision: {val_results.box.mp:.4f}")
    print(f"  * Recall   : {val_results.box.mr:.4f}\n")

    print("--------------------------------------------------------------------------")
    print("CLASS              | PRECISION | RECALL    | mAP50     | mAP50-95 ")
    print("--------------------------------------------------------------------------")
    
    ap50_vals = val_results.box.ap50
    ap_vals = val_results.box.ap
    p_vals = val_results.box.p
    r_vals = val_results.box.r
    class_indices = val_results.box.ap_class_index

    # Map class indices back to CLASS_NAMES
    for idx_in_results, cls_idx in enumerate(class_indices):
        c_name = CLASS_NAMES[cls_idx] if cls_idx < len(CLASS_NAMES) else f"class_{cls_idx}"
        p_val = p_vals[idx_in_results]
        r_val = r_vals[idx_in_results]
        map50_val = ap50_vals[idx_in_results]
        map95_val = ap_vals[idx_in_results]
        print(f"{c_name:<18} | {p_val:<9.4f} | {r_val:<9.4f} | {map50_val:<9.4f} | {map95_val:<9.4f}")
    print("--------------------------------------------------------------------------")

    # 2. Multi-Threshold Sensitivity Analysis (Phase 10)
    print("\n--- 2. Phase 10 Multi-Threshold Sensitivity Analysis ---")
    thresholds = [0.25, 0.20, 0.15, 0.10, 0.05]
    
    print("CONF_THRESH | MEAN PRECISION | MEAN RECALL | mAP50     | RECALL IMPROVEMENT")
    print("--------------------------------------------------------------------------")
    base_recall = None
    for conf in thresholds:
        res = model.val(data=str(DATA_YAML), split="test", conf=conf, verbose=False)
        mp = res.box.mp
        mr = res.box.mr
        m50 = res.box.map50
        if base_recall is None:
            base_recall = mr
            imp_str = "Baseline (0.25)"
        else:
            diff = (mr - base_recall) * 100
            imp_str = f"+{diff:.1f}% Recall" if diff >= 0 else f"{diff:.1f}% Recall"
        print(f"{conf:<11.2f} | {mp:<14.4f} | {mr:<11.4f} | {m50:<9.4f} | {imp_str}")
    print("--------------------------------------------------------------------------")

if __name__ == "__main__":
    run_per_class_evaluation()
