"""
Creates a real test breadboard photo (1000x600 PNG) with realistic tie-points,
power rails, and skewed perspective for testing Phase 9 OpenCV preprocessing.
"""

import cv2
import numpy as np
import os

def generate_sample_breadboard():
    # 1. Create a 1000x600 canvas (dark background table surface)
    canvas = np.full((600, 1000, 3), (35, 30, 25), dtype=np.uint8)

    # 2. Draw straight top-down breadboard (white plastic body 800x240)
    bb_rect = np.full((240, 800, 3), (245, 245, 245), dtype=np.uint8)
    
    # Power rails (Red + & Blue -)
    cv2.line(bb_rect, (30, 20), (770, 20), (50, 50, 220), 2)  # Red VCC
    cv2.line(bb_rect, (30, 30), (770, 30), (220, 100, 50), 2)  # Blue GND
    cv2.line(bb_rect, (30, 210), (770, 210), (50, 50, 220), 2)
    cv2.line(bb_rect, (30, 220), (770, 220), (220, 100, 50), 2)

    # Center Divider Trough
    cv2.rectangle(bb_rect, (20, 115), (780, 125), (140, 140, 140), -1)

    # Tie-Point Sockets (Matrix holes)
    for col in range(15, 55):
        cx = col * 14
        for ry in [45, 57, 69, 81, 93, 145, 157, 169, 181, 193]:
            cv2.circle(bb_rect, (cx, ry), 3, (50, 50, 50), -1)

    # Draw Resistor (R1 across col 20)
    cv2.line(bb_rect, (280, 69), (420, 69), (180, 140, 60), 4)
    cv2.rectangle(bb_rect, (320, 60), (380, 78), (210, 180, 140), -1)
    cv2.rectangle(bb_rect, (320, 60), (380, 78), (80, 60, 40), 1)

    # 3. Apply skew homography transform to simulate perspective camera angle
    src_pts = np.array([[0, 0], [800, 0], [800, 240], [0, 240]], dtype=np.float32)
    dst_pts = np.array([[150, 120], [850, 90], [920, 480], [80, 450]], dtype=np.float32)

    M = cv2.getPerspectiveTransform(src_pts, dst_pts)
    warped_bb = cv2.warpPerspective(bb_rect, M, (1000, 600))

    # Composite breadboard onto canvas table
    mask = cv2.cvtColor(warped_bb, cv2.COLOR_BGR2GRAY) > 0
    canvas[mask] = warped_bb[mask]

    os.makedirs('e:/CIRCUIT STIMULATOR/backend/test_assets', exist_ok=True)
    out_path = 'e:/CIRCUIT STIMULATOR/backend/test_assets/sample_breadboard.png'
    cv2.imwrite(out_path, canvas)
    print(f"Sample breadboard photo saved to {out_path} ({canvas.shape[1]}x{canvas.shape[0]})")

if __name__ == "__main__":
    generate_sample_breadboard()
