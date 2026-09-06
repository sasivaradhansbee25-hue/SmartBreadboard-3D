"""
Phase 4 — Visual Annotation Validation Script
Randomly selects representative images from each of the 6 classes,
draws bounding boxes with class labels, and saves overlay images to dataset_debug/.
"""

import os
import glob
import cv2
import random

PROCESSED_DIR = 'backend/dataset/processed_6class'
DEBUG_OUTPUT_DIR = 'dataset_debug'

CLASS_NAMES = {
    '0': 'resistor',
    '1': 'diode_rectifier',
    '2': 'ic_chip',
    '3': 'wire',
    '4': 'capacitor',
    '5': 'led'
}

CLASS_COLORS = {
    '0': (0, 165, 255),    # Orange for resistor
    '1': (255, 0, 255),    # Magenta for diode
    '2': (0, 255, 255),    # Yellow for IC
    '3': (255, 255, 0),    # Cyan for wire
    '4': (255, 0, 0),      # Blue for capacitor
    '5': (0, 255, 0)       # Green for LED
}

def visualize_samples():
    os.makedirs(DEBUG_OUTPUT_DIR, exist_ok=True)
    for c_name in CLASS_NAMES.values():
        os.makedirs(os.path.join(DEBUG_OUTPUT_DIR, c_name), exist_ok=True)

    img_dir = os.path.join(PROCESSED_DIR, 'images', 'train')
    lbl_dir = os.path.join(PROCESSED_DIR, 'labels', 'train')

    img_files = glob.glob(os.path.join(img_dir, '*.*'))

    sample_saved_per_class = {c_id: 0 for c_id in CLASS_NAMES.keys()}

    random.seed(42)
    random.shuffle(img_files)

    print("==========================================================================")
    print("      PHASE 4 -- VISUAL ANNOTATION VALIDATION OVERLAY GENERATOR            ")
    print("==========================================================================")

    for img_path in img_files:
        filename = os.path.basename(img_path)
        stem = os.path.splitext(filename)[0]
        lbl_path = os.path.join(lbl_dir, f"{stem}.txt")

        if not os.path.exists(lbl_path):
            continue

        with open(lbl_path, 'r') as f:
            lines = f.readlines()

        if not lines:
            continue

        img = cv2.imread(img_path)
        if img is None:
            continue

        h, w = img.shape[:2]
        annotated_img = img.copy()

        classes_in_image = set()

        for line in lines:
            parts = line.strip().split()
            if len(parts) != 5:
                continue

            cls_id, xc, yc, bw, bh = parts[0], float(parts[1]), float(parts[2]), float(parts[3]), float(parts[4])
            classes_in_image.add(cls_id)

            x1 = int((xc - bw / 2) * w)
            y1 = int((yc - bh / 2) * h)
            x2 = int((xc + bw / 2) * w)
            y2 = int((yc + bh / 2) * h)

            color = CLASS_COLORS.get(cls_id, (0, 255, 0))
            label = CLASS_NAMES.get(cls_id, f"cls_{cls_id}")

            cv2.rectangle(annotated_img, (x1, y1), (x2, y2), color, 2)
            cv2.putText(annotated_img, label, (x1, max(15, y1 - 5)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

        for cls_id in classes_in_image:
            if sample_saved_per_class[cls_id] < 3:
                cls_name = CLASS_NAMES[cls_id]
                out_path = os.path.join(DEBUG_OUTPUT_DIR, cls_name, f"sample_{sample_saved_per_class[cls_id] + 1}_{filename}")
                cv2.imwrite(out_path, annotated_img)
                sample_saved_per_class[cls_id] += 1
                print(f"[OK] Saved debug sample for class '{cls_name}' -> {out_path}")

    print("\nVisual annotation samples saved to dataset_debug/:")
    for cls_id, count in sample_saved_per_class.items():
        print(f"  - Class '{CLASS_NAMES[cls_id]}' (ID {cls_id}): {count} sample overlays generated")

if __name__ == '__main__':
    visualize_samples()
