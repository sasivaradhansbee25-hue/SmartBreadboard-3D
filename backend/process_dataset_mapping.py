"""
SmartBreadboard 3D — Processed Dataset Mapping Script (Supports Box & Polygon Coordinates)
Maps raw Roboflow component detection labels to allowed SPEC classes ONLY:
  Raw 7 (Resistor) -> 0 (resistor)
  Raw 3 (Diode)    -> 1 (diode_rectifier)
  Raw 4 (IC)       -> 2 (ic_chip)
  Raw 5 (Jumper)   -> 3 (wire)

Excludes: Breadboard (0), Capacitor (1), Component Leg (2), LED (6).
Converts polygon vertices to YOLO bounding boxes [x_center, y_center, w, h].
"""

import os
import sys
import glob
import shutil
import hashlib
import yaml

RAW_BASE = r'e:\CIRCUIT STIMULATOR\backend\dataset\raw\roboflow_component_detection'
PROCESSED_BASE = r'e:\CIRCUIT STIMULATOR\backend\dataset\processed'

RAW_MAPPING = {
    7: 0, # Resistor -> resistor
    3: 1, # Diode -> diode_rectifier
    4: 2, # IC -> ic_chip
    5: 3  # Jumper -> wire
}

PROCESSED_CLASSES = ['resistor', 'diode_rectifier', 'ic_chip', 'wire']

def get_file_hash(filepath):
    hasher = hashlib.sha256()
    with open(filepath, 'rb') as f:
        buf = f.read(65536)
        while len(buf) > 0:
            hasher.update(buf)
            buf = f.read(65536)
    return hasher.hexdigest()

def process_dataset():
    # Setup processed directories
    for split_target in ['train', 'val', 'test']:
        os.makedirs(os.path.join(PROCESSED_BASE, 'images', split_target), exist_ok=True)
        os.makedirs(os.path.join(PROCESSED_BASE, 'labels', split_target), exist_ok=True)

    # Track metrics
    seen_hashes = {}
    duplicate_count = 0
    original_images_count = 0
    original_annotations_count = 0
    processed_images_count = 0
    filtered_annotations_count = 0
    removed_images_count = 0
    invalid_annotations_count = 0

    class_counts_before = {i: 0 for i in range(8)}
    class_counts_after = {i: 0 for i in range(4)}

    split_metrics = {
        'train': {'images': 0, 'labels': 0},
        'val': {'images': 0, 'labels': 0},
        'test': {'images': 0, 'labels': 0}
    }

    # Map split names: 'train' -> 'train', 'valid' -> 'val', 'test' -> 'test'
    split_map = {
        'train': 'train',
        'valid': 'val',
        'test': 'test'
    }

    for raw_split, target_split in split_map.items():
        img_dir = os.path.join(RAW_BASE, raw_split, 'images')
        lbl_dir = os.path.join(RAW_BASE, raw_split, 'labels')

        img_files = glob.glob(os.path.join(img_dir, '*.jpg')) + \
                    glob.glob(os.path.join(img_dir, '*.jpeg')) + \
                    glob.glob(os.path.join(img_dir, '*.png'))

        original_images_count += len(img_files)

        for img_path in img_files:
            img_name = os.path.basename(img_path)
            base_name = os.path.splitext(img_name)[0]
            lbl_path = os.path.join(lbl_dir, base_name + '.txt')

            # Hash check for duplicate image
            img_hash = get_file_hash(img_path)
            if img_hash in seen_hashes:
                duplicate_count += 1
                continue
            seen_hashes[img_hash] = target_split

            # Read raw annotations
            new_lines = []
            if os.path.exists(lbl_path):
                with open(lbl_path, 'r') as f:
                    lines = f.readlines()
                    original_annotations_count += len(lines)

                    for line in lines:
                        parts = line.strip().split()
                        if not parts:
                            continue
                        try:
                            raw_cls = int(parts[0])
                            coords = [float(x) for x in parts[1:]]
                            class_counts_before[raw_cls] += 1

                            if raw_cls in RAW_MAPPING:
                                proc_cls = RAW_MAPPING[raw_cls]

                                if len(coords) == 4:
                                    # Standard YOLO bounding box [xc, yc, w, h]
                                    xc, yc, bw, bh = coords
                                elif len(coords) >= 6 and len(coords) % 2 == 0:
                                    # Polygon vertices [x1, y1, x2, y2, ...] -> calculate bounding box
                                    xs = coords[0::2]
                                    ys = coords[1::2]
                                    xmin, xmax = min(xs), max(xs)
                                    ymin, ymax = min(ys), max(ys)

                                    xc = (xmin + xmax) / 2.0
                                    yc = (ymin + ymax) / 2.0
                                    bw = xmax - xmin
                                    bh = ymax - ymin
                                else:
                                    invalid_annotations_count += 1
                                    continue

                                # Validate bounding box coordinates are within 0.0 to 1.0
                                if 0.0 <= xc <= 1.0 and 0.0 <= yc <= 1.0 and 0.0 < bw <= 1.0 and 0.0 < bh <= 1.0:
                                    class_counts_after[proc_cls] += 1
                                    new_line = f"{proc_cls} {xc:.6f} {yc:.6f} {bw:.6f} {bh:.6f}\n"
                                    new_lines.append(new_line)
                                else:
                                    invalid_annotations_count += 1

                        except Exception as e:
                            invalid_annotations_count += 1

            # Only copy image and save label if there are allowed-class annotations
            if new_lines:
                dest_img_path = os.path.join(PROCESSED_BASE, 'images', target_split, img_name)
                dest_lbl_path = os.path.join(PROCESSED_BASE, 'labels', target_split, base_name + '.txt')

                shutil.copy2(img_path, dest_img_path)
                with open(dest_lbl_path, 'w') as f:
                    f.writelines(new_lines)

                processed_images_count += 1
                filtered_annotations_count += len(new_lines)

                split_metrics[target_split]['images'] += 1
                split_metrics[target_split]['labels'] += len(new_lines)
            else:
                removed_images_count += 1

    # Create processed data.yaml
    data_yaml_content = {
        "path": "e:/CIRCUIT STIMULATOR/backend/dataset/processed",
        "train": "images/train",
        "val": "images/val",
        "test": "images/test",
        "nc": 4,
        "names": {i: name for i, name in enumerate(PROCESSED_CLASSES)}
    }

    data_yaml_path = os.path.join(PROCESSED_BASE, 'data.yaml')
    with open(data_yaml_path, 'w') as f:
        yaml.dump(data_yaml_content, f, default_flow_style=False)

    print("================================================================")
    print("      PROCESSED DATASET MAPPING & VERIFICATION REPORT          ")
    print("================================================================")
    print(f"Original Image Count: {original_images_count}")
    print(f"Processed Image Count: {processed_images_count}")
    print(f"Images Removed (No Allowed Classes): {removed_images_count}")
    print(f"Duplicate Images Across Splits: {duplicate_count}")
    print(f"Invalid Coordinate Annotations: {invalid_annotations_count}")

    print(f"\nAnnotations Count Before Filtering: {original_annotations_count}")
    print(f"Annotations Count After Filtering: {filtered_annotations_count}")

    print("\nProcessed Objects per Class:")
    for cls_id, cls_name in enumerate(PROCESSED_CLASSES):
        print(f"   • Class {cls_id} ({cls_name}): {class_counts_after[cls_id]} instances")

    print("\nTrain/Val/Test Image & Annotation Counts:")
    for split in ['train', 'val', 'test']:
        print(f"   • {split.capitalize()} Split: {split_metrics[split]['images']} images, {split_metrics[split]['labels']} annotations")

    print("\nFinal data.yaml Contents:")
    with open(data_yaml_path, 'r') as f:
        print(f.read())

if __name__ == "__main__":
    process_dataset()
