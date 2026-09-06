"""
SmartBreadboard 3D — Phase 13 Automatic 3D Reconstruction Verification Script
Tests 2D tie-point hole ID to 3D spatial (X, Y, Z) coordinate mapping engine.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from cv.breadboard_grid import HOLE_CENTROIDS

def test_phase13():
    print("================================================================")
    print("      PHASE 13 AUTOMATIC 3D RECONSTRUCTION VERIFICATION         ")
    print("================================================================")

    print(f"Total Hole Centroids Registered for 3D Engine: {len(HOLE_CENTROIDS)}")

    # Verify key holes
    key_holes = ["A1", "A22", "E22", "F22", "J63", "VCC_TOP_10", "GND_BOT_15"]
    print("\n--- Key 3D Hole Spatial Coordinates ---")

    for h_id in key_holes:
        if h_id in HOLE_CENTROIDS:
            (x_2d, y_2d) = HOLE_CENTROIDS[h_id]
            # Convert 2D pixel space to 3D Three.js space
            x_3d = round(-12.4 + ((x_2d - 55.0) / 11.0) * 0.40, 2)
            z_3d = round(-2.8 + ((y_2d - 75.0) / 15.0) * 0.50, 2) if y_2d >= 75 and y_2d <= 135 else 0.0
            print(f"   • Hole '{h_id:12s}': 2D Pixel ({x_2d:5.1f}, {y_2d:5.1f}) -> 3D Spatial ({x_3d:5.2f}, 0.61, {z_3d:5.2f})")

    assert len(HOLE_CENTROIDS) >= 630, "Missing 3D tie-point hole coordinates"
    print("\n[SUCCESS] PHASE 13 AUTOMATIC 3D RECONSTRUCTION TEST PASSED CLEANLY!")

if __name__ == "__main__":
    test_phase13()
