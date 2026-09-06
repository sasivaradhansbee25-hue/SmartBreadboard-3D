"""
Alternative YOLO Model Training Script: YOLO11n on 6-class Breadboard Dataset
Dataset: backend/dataset/processed_6class/data.yaml
Classes (6):
  0: resistor
  1: diode_rectifier
  2: ic_chip
  3: wire
  4: capacitor
  5: led
Destination: runs/detect/backend/cv/runs/breadboard_6class_alternative/weights/best.pt
"""

import os
import sys
from pathlib import Path
import torch
from ultralytics import YOLO

ROOT_DIR = Path(r"E:\CIRCUIT STIMULATOR")
DATA_YAML = ROOT_DIR / "backend" / "dataset" / "processed_6class" / "data.yaml"
OUTPUT_PROJECT = ROOT_DIR / "runs" / "detect" / "backend" / "cv" / "runs"

def train_alternative():
    print("=" * 80)
    print("      TRAINING ALTERNATIVE MODEL: YOLO11n (2.6M params, Attention C2PSA)      ")
    print("=" * 80)

    torch.set_num_threads(8)
    cuda_available = torch.cuda.is_available()
    device = '0' if cuda_available else 'cpu'
    print(f"[OK] Device: {device} | PyTorch: {torch.__version__} | Threads: {torch.get_num_threads()}")
    print(f"[OK] Dataset YAML: {DATA_YAML}")

    model = YOLO("yolo11n.pt")

    print("\nStarting YOLO11n fine-tuning on 6-class dataset for 10 epochs...")
    results = model.train(
        data=str(DATA_YAML),
        epochs=10,
        imgsz=512,
        batch=32,
        device=device,
        project=str(OUTPUT_PROJECT),
        name="breadboard_6class_alternative",
        exist_ok=True,
        pretrained=True,
        plots=True,
        val=True,
        workers=0,
        # Standard tuned augmentations
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

    out_weights = OUTPUT_PROJECT / "breadboard_6class_alternative" / "weights" / "best.pt"
    print("\n" + "=" * 80)
    print(f"[SUCCESS] ALTERNATIVE MODEL TRAINING COMPLETE!")
    print(f"Weights saved to: {out_weights}")
    print("=" * 80)

if __name__ == '__main__':
    train_alternative()
