"""
Batch 5 Real Images Detection Test Script
Runs YOLO 6-class model across 5 real breadboard images and generates a concise summary table.
"""

from pathlib import Path
from test_component_detection import run_detection

ROOT_DIR = Path(r"E:\CIRCUIT STIMULATOR")

IMAGES = [
    ROOT_DIR / "backend" / "test_assets" / "real_breadboard_photo.jpg",
    ROOT_DIR / "backend" / "test_assets" / "sample_breadboard.png",
    ROOT_DIR / "backend" / "dataset" / "processed" / "images" / "test" / "BreadboardWithResistor-s-18_png.rf.32e6868cac5db768530d99d2b5aea767.jpg",
    ROOT_DIR / "backend" / "dataset" / "processed" / "images" / "test" / "IMG_0850_png.rf.df4d2f77b3f83e5e2beec1efd78c412f.jpg",
    ROOT_DIR / "backend" / "dataset" / "processed" / "images" / "test" / "IMG_0864_png.rf.8bfe2c75318a387e671ed2b38af19a67.jpg"
]

def main():
    records = []
    for img_p in IMAGES:
        if not img_p.exists():
            continue
        counts, dets, out_path = run_detection(str(img_p), conf_threshold=0.20)
        records.append({
            "image": img_p.name,
            "resistor": counts.get("resistor", 0),
            "diode": counts.get("diode_rectifier", 0),
            "ic": counts.get("ic_chip", 0),
            "wire": counts.get("wire", 0),
            "capacitor": counts.get("capacitor", 0),
            "led": counts.get("led", 0),
            "total": len(dets),
            "out": out_path.name
        })

    print("\n" + "="*85)
    print("      5 REAL BREADBOARD IMAGES DETECTION SUMMARY TABLE (conf=0.20)")
    print("="*85)
    print(f"{'IMAGE':<35} | {'RES':<4} | {'DIO':<4} | {'IC':<4} | {'WIR':<4} | {'CAP':<4} | {'LED':<4} | {'TOTAL':<5}")
    print("-" * 85)
    for r in records:
        print(f"{r['image'][:35]:<35} | {r['resistor']:<4} | {r['diode']:<4} | {r['ic']:<4} | {r['wire']:<4} | {r['capacitor']:<4} | {r['led']:<4} | {r['total']:<5}")
    print("="*85)

if __name__ == '__main__':
    main()
