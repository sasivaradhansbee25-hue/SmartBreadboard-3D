from pathlib import Path
import shutil

ROOT = Path(r"E:\CIRCUIT STIMULATOR")

RAW = ROOT / "backend" / "dataset" / "raw" / "roboflow_component_detection"
OUT = ROOT / "backend" / "dataset" / "processed_6class"

CLASS_MAP = {
    7: 0,  # Resistor -> resistor
    3: 1,  # Diode -> diode_rectifier
    4: 2,  # IC -> ic_chip
    5: 3,  # Jumper -> wire
    1: 4,  # Capacitor -> capacitor
    6: 5,  # LED -> led
}

SPLITS = {
    "train": "train",
    "valid": "val",
    "test": "test",
}


def segmentation_to_bbox(parts):

    if len(parts) < 7:
        return None

    raw_id = int(parts[0])

    coords = [float(x) for x in parts[1:]]

    if len(coords) % 2 != 0:
        return None

    xs = coords[0::2]
    ys = coords[1::2]

    if not xs or not ys:
        return None

    x_min = min(xs)
    x_max = max(xs)
    y_min = min(ys)
    y_max = max(ys)

    x_center = (x_min + x_max) / 2
    y_center = (y_min + y_max) / 2

    width = x_max - x_min
    height = y_max - y_min

    return [
        str(CLASS_MAP[raw_id]),
        f"{x_center:.6f}",
        f"{y_center:.6f}",
        f"{width:.6f}",
        f"{height:.6f}",
    ]


for split in SPLITS.values():
    (OUT / "images" / split).mkdir(parents=True, exist_ok=True)
    (OUT / "labels" / split).mkdir(parents=True, exist_ok=True)


total_images = 0
total_annotations = 0

for raw_split, out_split in SPLITS.items():

    image_dir = RAW / raw_split / "images"
    label_dir = RAW / raw_split / "labels"

    out_image_dir = OUT / "images" / out_split
    out_label_dir = OUT / "labels" / out_split

    print(f"\nProcessing: {raw_split}")

    for img in image_dir.glob("*"):

        if not img.is_file():
            continue

        label = label_dir / f"{img.stem}.txt"

        if not label.exists():
            continue

        new_lines = []

        for line in label.read_text().splitlines():

            parts = line.split()

            if not parts:
                continue

            try:
                raw_id = int(parts[0])
            except ValueError:
                continue

            if raw_id not in CLASS_MAP:
                continue

            bbox = segmentation_to_bbox(parts)

            if bbox is not None:
                new_lines.append(" ".join(bbox))

        if new_lines:

            shutil.copy2(
                img,
                out_image_dir / img.name
            )

            (out_label_dir / label.name).write_text(
                "\n".join(new_lines) + "\n"
            )

            total_images += 1
            total_annotations += len(new_lines)

            print(
                f"OK: {img.name} -> "
                f"{len(new_lines)} annotations"
            )


print("\n========================================")
print("6-CLASS DATASET MAPPING COMPLETED")
print("========================================")
print(f"Images copied       : {total_images}")
print(f"Annotations created : {total_annotations}")
print(f"Output              : {OUT}")