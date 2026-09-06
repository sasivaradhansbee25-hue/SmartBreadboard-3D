"""
Phase 5, 6 & 7 — YOLOv8 6-Class Retraining Script (breadboard_6class_v2)
Fine-tunes YOLOv8n on backend/dataset/processed_6class/data.yaml with realistic augmentation.
Saves model checkpoints, metrics CSV, confusion matrices, and PR curves to:
runs/detect/backend/cv/runs/breadboard_6class_v2
"""

import os
import sys
from pathlib import Path
import torch
from ultralytics import YOLO

ROOT_DIR = Path(r"E:\CIRCUIT STIMULATOR")
DATA_YAML = ROOT_DIR / "backend" / "dataset" / "processed_6class" / "data.yaml"
OUTPUT_PROJECT = ROOT_DIR / "runs" / "detect" / "backend" / "cv" / "runs"

def train():
    print("==========================================================================")
    print("      PHASE 7 -- YOLOV8 6-CLASS MODEL RETRAINING (v2)                      ")
    print("==========================================================================")

    # 1. Environment & CUDA verification
    cuda_available = torch.cuda.is_available()
    device = '0' if cuda_available else 'cpu'
    print(f"[OK] PyTorch Version: {torch.__version__}")
    print(f"[OK] CUDA Available: {cuda_available} (Device: {device})")
    if cuda_available:
        print(f"[OK] GPU Name: {torch.cuda.get_device_name(0)}")

    assert os.path.exists(DATA_YAML), f"Dataset yaml not found at {DATA_YAML}"
    print(f"[OK] Dataset YAML verified: {DATA_YAML}")

    # 2. Initialize YOLO model (pretrained yolov8n.pt)
    model = YOLO("yolov8n.pt")

    # 3. Execute training with realistic physical augmentations per Phase 6
    print("\nStarting YOLOv8 fine-tuning for 25 epochs...")
    results = model.train(
        data=str(DATA_YAML),
        epochs=25,
        imgsz=640,
        batch=8,
        device=device,
        project=str(OUTPUT_PROJECT),
        name="breadboard_6class_v2",
        exist_ok=True,
        pretrained=True,
        plots=True,
        val=True,
        # Augmentation hyperparameters tuned for realistic breadboard camera images
        hsv_h=0.015,
        hsv_s=0.7,
        hsv_v=0.4,
        degrees=10.0,
        translate=0.1,
        scale=0.5,
        fliplr=0.5,
        mosaic=1.0,
        close_mosaic=5
    )

    out_weights = OUTPUT_PROJECT / "breadboard_6class_v2" / "weights" / "best.pt"
    print("\n==========================================================================")
    print(f"[SUCCESS] RETRAINING COMPLETED! Best weights saved to:")
    print(f"          {out_weights}")
    print("==========================================================================")

if __name__ == '__main__':
    train()
