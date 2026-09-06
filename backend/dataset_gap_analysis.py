"""
Dataset Gap Analysis & Per-Class Failure Analysis for YOLOv8n Model
"""

import os
import glob
from collections import Counter
from pathlib import Path
from ultralytics import YOLO
import numpy as np

ROOT_DIR = Path(r"E:\CIRCUIT STIMULATOR")
DATA_YAML = ROOT_DIR / "backend" / "dataset" / "processed_6class" / "data.yaml"
MODEL_PATH = ROOT_DIR / "runs" / "detect" / "backend" / "cv" / "runs" / "breadboard_6class" / "weights" / "best.pt"

CLASSES = ["resistor", "diode_rectifier", "ic_chip", "wire", "capacitor", "led"]

def run_analysis():
    print("=" * 80)
    print("      DATASET GAP ANALYSIS & PER-CLASS ERROR AUDIT (YOLOv8n Baseline)      ")
    print("=" * 80)

    # 1. Count annotations across train, val, test splits
    train_files = glob.glob(str(ROOT_DIR / "backend" / "dataset" / "processed_6class" / "labels" / "train" / "*.txt"))
    val_files = glob.glob(str(ROOT_DIR / "backend" / "dataset" / "processed_6class" / "labels" / "val" / "*.txt"))
    test_files = glob.glob(str(ROOT_DIR / "backend" / "dataset" / "processed_6class" / "labels" / "test" / "*.txt"))

    def get_counts(file_list):
        c = Counter()
        for f in file_list:
            with open(f, 'r') as fp:
                for line in fp:
                    parts = line.strip().split()
                    if parts:
                        c[int(parts[0])] += 1
        return c

    c_train = get_counts(train_files)
    c_val = get_counts(val_files)
    c_test = get_counts(test_files)

    print("\n--- 1. CURRENT DATASET CLASS INSTANCE COUNTS ---")
    print(f"{'Class ID':<8} | {'Class Name':<16} | {'Train':<8} | {'Val':<8} | {'Test':<8} | {'Total Objects':<14}")
    print("-" * 75)
    for idx, name in enumerate(CLASSES):
        tot = c_train[idx] + c_val[idx] + c_test[idx]
        print(f"{idx:<8} | {name:<16} | {c_train[idx]:<8} | {c_val[idx]:<8} | {c_test[idx]:<8} | {tot:<14}")
    print("-" * 75)
    total_all = sum(c_train.values()) + sum(c_val.values()) + sum(c_test.values())
    print(f"{'TOTAL':<27} | {sum(c_train.values()):<8} | {sum(c_val.values()):<8} | {sum(c_test.values()):<8} | {total_all:<14}")

    # 2. Run detailed YOLOv8n validation on val & test splits
    model = YOLO(str(MODEL_PATH))
    val_results = model.val(data=str(DATA_YAML), split="val", verbose=False)
    
    # Per-class metrics
    print("\n--- 2. YOLOv8n PER-CLASS VALIDATION METRICS ---")
    print(f"{'Class':<16} | {'Instances':<10} | {'Precision':<10} | {'Recall':<10} | {'mAP50':<10} | {'mAP50-95':<10}")
    print("-" * 75)
    
    # Class map indices
    for i, c_name in enumerate(CLASSES):
        p = val_results.box.p[i] if i < len(val_results.box.p) else 0.0
        r = val_results.box.r[i] if i < len(val_results.box.r) else 0.0
        ap50 = val_results.box.ap50[i] if i < len(val_results.box.ap50) else 0.0
        ap = val_results.box.ap[i] if i < len(val_results.box.ap) else 0.0
        inst = c_val[i]
        print(f"{c_name:<16} | {inst:<10} | {p:<10.3f} | {r:<10.3f} | {ap50:<10.3f} | {ap:<10.3f}")
    print("-" * 75)
    print(f"{'ALL (Mean)':<16} | {sum(c_val.values()):<10} | {val_results.box.mp:<10.3f} | {val_results.box.mr:<10.3f} | {val_results.box.map50:<10.3f} | {val_results.box.map:<10.3f}")

if __name__ == '__main__':
    run_analysis()
