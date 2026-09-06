"""
SmartBreadboard 3D — YOLOv8 Component Fine-Tuning & ONNX Export Pipeline
Trains YOLOv8n on annotated breadboard dataset and exports to backend/cv/weights/yolov8n_breadboard.onnx
"""

import os
from ultralytics import YOLO

def train_and_export():
    dataset_yaml = 'e:/CIRCUIT STIMULATOR/backend/dataset/dataset.yaml'
    weights_dir = 'e:/CIRCUIT STIMULATOR/backend/cv/weights'
    os.makedirs(weights_dir, exist_ok=True)

    if not os.path.exists(dataset_yaml):
        print(f"[INFO] Dataset config {dataset_yaml} not found. Please provide labeled dataset.")
        return

    # Load COCO pretrained YOLOv8n
    model = YOLO('yolov8n.pt')

    # Fine-tune on breadboard dataset for 100 epochs
    results = model.train(
        data=dataset_yaml,
        epochs=100,
        imgsz=640,
        batch=16,
        name='yolov8n_breadboard',
        project='runs/detect'
    )

    # Export to ONNX format for high-speed CPU inference
    onnx_path = model.export(format='onnx', dynamic=True)
    target_onnx = os.path.join(weights_dir, 'yolov8n_breadboard.onnx')
    
    import shutil
    shutil.copy(onnx_path, target_onnx)
    print(f"[SUCCESS] Fine-tuned model exported to {target_onnx}")

if __name__ == "__main__":
    train_and_export()
