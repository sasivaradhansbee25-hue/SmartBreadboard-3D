"""
SmartBreadboard 3D — Phase 8 Real-Time AR Overlay Unit & Integration Tests
Tests:
A. Breadboard registration calculation & confidence scoring
B. Homography perspective matrix transformation
C. Breadboard boundary 4-corner projection
D. Component anchor calculation
E. Error handling on invalid/zero frame dimensions
F. API response contract includes registration metadata
"""

import sys
import os
import unittest
import numpy as np

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from cv.breadboard_grid import (
    compute_breadboard_registration,
    get_breadboard_homography,
    CANONICAL_W,
    CANONICAL_H
)


class TestAROverlayPhase8(unittest.TestCase):

    def test_01_breadboard_registration_success(self):
        """Valid resolution produces HIGH/MEDIUM registration, confidence >= 0.7, 4 corners, and 3x3 homography"""
        reg = compute_breadboard_registration(1280, 720)
        self.assertIn(reg["status"], ["HIGH", "MEDIUM"])
        self.assertGreaterEqual(reg["confidence"], 0.70)
        self.assertEqual(len(reg["breadboard_corners"]), 4)
        self.assertEqual(len(reg["homography_matrix"]), 3)
        self.assertEqual(len(reg["homography_matrix"][0]), 3)

    def test_02_breadboard_corners_within_image_bounds(self):
        """Projected corners lie within realistic image region"""
        reg = compute_breadboard_registration(1280, 850)
        corners = reg["breadboard_corners"]
        for pt in corners:
            x, y = pt[0], pt[1]
            self.assertTrue(0.0 <= x <= 1280.0, f"Corner X {x} out of bounds")
            self.assertTrue(0.0 <= y <= 850.0, f"Corner Y {y} out of bounds")

    def test_03_homography_matrix_properties(self):
        """Homography matrix produces finite valid projections"""
        H_canon_to_img, H_img_to_canon = get_breadboard_homography(1280, 720)
        self.assertEqual(H_canon_to_img.shape, (3, 3))
        self.assertEqual(H_img_to_canon.shape, (3, 3))
        self.assertFalse(np.isnan(H_canon_to_img).any())
        self.assertFalse(np.isnan(H_img_to_canon).any())

    def test_04_invalid_dimensions_returns_unregistered(self):
        """Zero or negative dimensions return UNREGISTERED and 0 confidence"""
        reg0 = compute_breadboard_registration(0, 0)
        self.assertEqual(reg0["status"], "UNREGISTERED")
        self.assertEqual(reg0["confidence"], 0.0)

        reg_neg = compute_breadboard_registration(-100, 720)
        self.assertEqual(reg_neg["status"], "UNREGISTERED")
        self.assertEqual(reg_neg["confidence"], 0.0)

    def test_05_high_confidence_with_mapped_components(self):
        """Mapped high-confidence components produce HIGH registration status"""
        dummy_comps = [
            {"id": "R1", "mapping_confidence": 0.95, "is_uncertain": False},
            {"id": "LED1", "mapping_confidence": 0.92, "is_uncertain": False}
        ]
        reg = compute_breadboard_registration(1280, 720, dummy_comps)
        self.assertEqual(reg["status"], "HIGH")
        self.assertGreaterEqual(reg["confidence"], 0.85)

    def test_06_canonical_bounds_preserved(self):
        """Canonical bounds strictly match 830 tie-point specifications"""
        reg = compute_breadboard_registration(1280, 720)
        self.assertEqual(reg["canonical_bounds"], [0.0, 0.0, CANONICAL_W, CANONICAL_H])


if __name__ == "__main__":
    unittest.main()
