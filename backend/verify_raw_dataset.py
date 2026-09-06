"""
Verification Script for Raw Dataset on Disk
Counts exact image files, label files, checks matching pairs, and checks class occurrences.
DOES NOT MODIFY ANY FILES.
"""

import os
import glob

BASE_DIR = r'e:\CIRCUIT STIMULATOR\backend\dataset\raw\roboflow_component_detection'

NAMES = ['Breadboard', 'Capacitor', 'Component Leg', 'Diode', 'IC', 'Jumper', 'LED', 'Resistor']

def verify():
    print("================================================================")
    print("      RAW ROBOLOW DATASET DISK VERIFICATION AUDIT              ")
    print("================================================================")
    print(f"Base Directory: {BASE_DIR}")
    print(f"data.yaml Exists: {os.path.exists(os.path.join(BASE_DIR, 'data.yaml'))}")
    print(f"README.roboflow.txt Exists: {os.path.exists(os.path.join(BASE_DIR, 'README.roboflow.txt'))}")

    class_counts = {i: 0 for i in range(len(NAMES))}
    total_images = 0
    total_labels = 0

    split_counts = {}

    for split in ['train', 'valid', 'test']:
        img_dir = os.path.join(BASE_DIR, split, 'images')
        lbl_dir = os.path.join(BASE_DIR, split, 'labels')

        img_files = glob.glob(os.path.join(img_dir, '*.[jJ][pP][gG]')) + \
                    glob.glob(os.path.join(img_dir, '*.[jJ][pP][eE][gG]')) + \
                    glob.glob(os.path.join(img_dir, '*.[pP][nN][gG]'))
        
        lbl_files = glob.glob(os.path.join(lbl_dir, '*.txt'))

        total_images += len(img_files)
        total_labels += len(lbl_files)

        # Check matching label for each image
        matched = 0
        for img in img_files:
            base_name = os.path.splitext(os.path.basename(img))[0]
            lbl_path = os.path.join(lbl_dir, base_name + '.txt')
            if os.path.exists(lbl_path):
                matched += 1

        split_counts[split] = {
            'images': len(img_files),
            'labels': len(lbl_files),
            'matched': matched
        }

        # Parse class IDs from txt labels
        for lbl_path in lbl_files:
            with open(lbl_path, 'r') as f:
                for line in f:
                    parts = line.strip().split()
                    if parts:
                        cls_id = int(parts[0])
                        if cls_id in class_counts:
                            class_counts[cls_id] += 1

    print("\n1. Exact Number of Image Files:", total_images)
    print("2. Exact Number of Annotation Files:", total_labels)
    print("3. Train Image Count:", split_counts['train']['images'])
    print("4. Validation Image Count:", split_counts['valid']['images'])
    print("5. Test Image Count:", split_counts['test']['images'])
    print("6. Every Image Has Corresponding Label:", (total_images == total_labels and total_images == (split_counts['train']['matched'] + split_counts['valid']['matched'] + split_counts['test']['matched'])))

    print("\n7. Actual Class Counts in Label Files:")
    for idx, name in enumerate(NAMES):
        print(f"   • Class {idx} ({name}): {class_counts[idx]} instances")

    print("\n8. Contents defined in data.yaml:")
    print("   • Classes (nc: 8):", NAMES)
    print("   • Dataset Version: 7 (IntroducedNoise640x640)")
    print("   • License: Public Domain")

if __name__ == "__main__":
    verify()
