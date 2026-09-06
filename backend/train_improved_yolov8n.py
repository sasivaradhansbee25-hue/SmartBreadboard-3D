"""
Training Script: Improved YOLOv8n on Targeted 6-Class Dataset
Destination: runs/detect/backend/cv/runs/breadboard_6class_improved/weights/best.pt
"""

import os
import sys
from pathlib import Path
import torch
from ultralytics import YOLO

ROOT_DIR = Path(r"E:\CIRCUIT STIMULATOR")
DATA_YAML = ROOT_DIR / "backend" / "dataset" / "processed_6class_improved" / "data.yaml"
OUTPUT_PROJECT = ROOT_DIR / "runs" / "detect" / "backend" / "cv" / "runs"

def train_improved_yolo():
    print("=" * 80)
    print("      TRAINING IMPROVED YOLOV8n EXPERIMENT ON TARGETED DATASET         ")
    print("=" * 80)

    torch.set_num_threads(8)
    cuda_available = torch.cuda.is_available()
    device = '0' if cuda_available else 'cpu'
    print(f"[OK] Device: {device} | PyTorch: {torch.__version__} | Threads: {torch.get_num_threads()}")
    print(f"[OK] Dataset YAML: {DATA_YAML}")

    # Initialize from standard pretrained YOLOv8n
    model = YOLO("yolov8n.pt")

    print("\nStarting YOLOv8n training on improved 6-class dataset for 12 epochs...")
    results = model.train(
        data=str(DATA_YAML),
        epochs=12,
        imgsz=512,
        batch=32,
        device=device,
        project=str(OUTPUT_PROJECT),
        name="breadboard_6class_improved",
        exist_ok=True,
        pretrained=True,
        plots=True,
        val=True,
        workers=0,
        # Tuned augmentations
        hsv_h=0.015,
        hsv_s=0.7,
        hsv_v=0.4,
        degrees=10.0,
        translate=0.1,
        scale=0.5,
        fliplr=0.5,
        mosaic=1.0,
        close_mosaic=3
    )

    out_weights = OUTPUT_PROJECT / "breadboard_6class_improved" / "weights" / "best.pt"
    print("\n" + "=" * 80)
    print(f"[SUCCESS] IMPROVED YOLOV8n TRAINING COMPLETE!")
    print(f"Weights saved to: {out_weights}")
    print("=" * 80)

if __name__ == '__main__':
    train_improved_yolo()
