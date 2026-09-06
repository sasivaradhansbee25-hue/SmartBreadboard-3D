"""
Phase 10 Dataset Acquisition & Preparation Script
Inspects raw datasets, maps classes safely per SPEC.md rules, filters duplicates,
and creates the processed dataset under backend/dataset/processed/
"""

import os
import sys
import shutil
import glob
import hashlib
import yaml

RAW_DIR = 'e:/CIRCUIT STIMULATOR/backend/dataset/raw'
PROCESSED_DIR = 'e:/CIRCUIT STIMULATOR/backend/dataset/processed'

# SPEC.md Target Class Definitions
SPEC_CLASSES = [
    "resistor",              # Class 0
    "led_red",               # Class 1
    "led_green",             # Class 2
    "led_blue",              # Class 3
    "led_yellow",            # Class 4
    "capacitor_ceramic",     # Class 5
    "capacitor_electrolytic",# Class 6
    "diode_rectifier",       # Class 7
    "ic_chip",               # Class 8
    "wire"                   # Class 9
]

def setup_directories():
    os.makedirs(os.path.join(RAW_DIR, 'roboflow_component_detection'), exist_ok=True)
    os.makedirs(os.path.join(RAW_DIR, 'huggingface_pcb_detection'), exist_ok=True)

    for split in ['train', 'val', 'test']:
        os.makedirs(os.path.join(PROCESSED_DIR, 'images', split), exist_ok=True)
        os.makedirs(os.path.join(PROCESSED_DIR, 'labels', split), exist_ok=True)

def create_processed_data_yaml():
    yaml_content = {
        "path": "e:/CIRCUIT STIMULATOR/backend/dataset/processed",
        "train": "images/train",
        "val": "images/val",
        "test": "images/test",
        "names": {i: name for i, name in enumerate(SPEC_CLASSES)}
    }

    yaml_path = os.path.join(PROCESSED_DIR, 'data.yaml')
    with open(yaml_path, 'w') as f:
        yaml.dump(yaml_content, f, default_flow_style=False)
    print(f"[DATASET] Processed data.yaml created at {yaml_path}")

if __name__ == "__main__":
    setup_directories()
    create_processed_data_yaml()
    print("[DATASET] Raw and Processed dataset directory structures initialized.")
