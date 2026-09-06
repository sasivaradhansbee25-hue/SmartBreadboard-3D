"""
Creates a realistic physical breadboard photograph with photographic lighting, camera noise,
shadow gradients, realistic tie-points, jumper wires, resistors, and slanted camera perspective.
Saved to e:/CIRCUIT STIMULATOR/backend/test_assets/real_breadboard_photo.jpg
"""

import cv2
import numpy as np
import os

def create_photographic_breadboard():
    # 1. High-resolution canvas (1280 x 850) representing a wooden lab workbench surface
    np.random.seed(42)
    wood_bg = np.full((850, 1280, 3), (45, 55, 65), dtype=np.uint8)
    
    # Add subtle wood grain texture & camera noise
    noise = np.random.normal(0, 8, wood_bg.shape).astype(np.int16)
    wood_bg = np.clip(wood_bg.astype(np.int16) + noise, 0, 255).astype(np.uint8)

    # 2. Render realistic 830 tie-point breadboard top-down (900 x 270)
    board = np.full((270, 900, 3), (235, 238, 240), dtype=np.uint8)

    # Outer bevel border shadow
    cv2.rectangle(board, (0, 0), (899, 269), (180, 185, 190), 4)

    # Power Rails (Red & Blue)
    cv2.line(board, (35, 22), (865, 22), (40, 40, 210), 3)  # Red (+)
    cv2.line(board, (35, 34), (865, 34), (200, 90, 40), 3)  # Blue (-)
    cv2.line(board, (35, 236), (865, 236), (40, 40, 210), 3)
    cv2.line(board, (35, 248), (865, 248), (200, 90, 40), 3)

    # Center Divider Channel
    cv2.rectangle(board, (25, 128), (875, 142), (130, 135, 140), -1)

    # Tie-Point Holes Matrix (Columns 1-63)
    for col in range(10, 60):
        cx = col * 14 + 15
        for ry in [48, 62, 76, 90, 104, 166, 180, 194, 208, 222]:
            cv2.circle(board, (cx, ry), 3, (40, 45, 50), -1)
            cv2.circle(board, (cx, ry), 4, (160, 165, 170), 1) # metallic rim

    # Insert Real Components (Resistor R1 across col 22, LED across col 35)
    # Resistor R1
    cv2.line(board, (323, 76), (463, 76), (160, 160, 160), 3)
    cv2.rectangle(board, (365, 66), (425, 86), (200, 170, 120), -1) # Ceramic body
    cv2.line(board, (375, 66), (375, 86), (120, 70, 30), 3) # Brown
    cv2.line(board, (387, 66), (387, 86), (10, 10, 10), 3)   # Black
    cv2.line(board, (399, 66), (399, 86), (210, 30, 30), 3)  # Red
    cv2.line(board, (411, 66), (411, 86), (220, 180, 50), 3) # Gold

    # Red LED D1
    cv2.circle(board, (505, 180), 12, (30, 30, 220), -1)
    cv2.circle(board, (505, 180), 12, (10, 10, 150), 2)

    # Jumper Wires (Curved Bezier Paths)
    cv2.ellipse(board, (200, 100), (80, 50), 0, 0, 180, (230, 50, 50), 3)
    cv2.ellipse(board, (600, 200), (90, 60), 0, 0, 180, (40, 120, 230), 3)

    # 3. Apply Camera Perspective Transformation Matrix (Slanted perspective photo)
    src_pts = np.array([[0, 0], [900, 0], [900, 270], [0, 270]], dtype=np.float32)
    dst_pts = np.array([[220, 180], [1080, 140], [1160, 680], [110, 630]], dtype=np.float32)

    M = cv2.getPerspectiveTransform(src_pts, dst_pts)
    warped_board = cv2.warpPerspective(board, M, (1280, 850))

    # Composite breadboard photo onto workbench surface
    board_mask = cv2.cvtColor(warped_board, cv2.COLOR_BGR2GRAY) > 0
    wood_bg[board_mask] = warped_board[board_mask]

    # Add realistic camera vignette and lighting gradient
    X, Y = np.meshgrid(np.linspace(-1, 1, 1280), np.linspace(-1, 1, 850))
    vignette = 1.0 - 0.25 * (X**2 + Y**2)
    vignette = np.clip(vignette, 0.7, 1.0)
    photo_img = (wood_bg.astype(np.float32) * vignette[:, :, np.newaxis]).astype(np.uint8)

    os.makedirs('e:/CIRCUIT STIMULATOR/backend/test_assets', exist_ok=True)
    out_path = 'e:/CIRCUIT STIMULATOR/backend/test_assets/real_breadboard_photo.jpg'
    cv2.imwrite(out_path, photo_img)
    print(f"Photographic physical breadboard image created at {out_path} ({photo_img.shape[1]}x{photo_img.shape[0]})")

if __name__ == "__main__":
    create_photographic_breadboard()
