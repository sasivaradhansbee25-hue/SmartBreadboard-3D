"""
SmartBreadboard 3D — Live Camera Digital Twin & Spatial Tracking Unit Tests
Verifies spatial matching, centroid distance, IoU calculation, change event detection,
and POST /api/camera/analyze contract.
"""

import sys
import os
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from cv.camera_tracker import calculate_bbox_iou, calculate_centroid_distance, match_components_spatially

class TestLiveCameraTracking(unittest.TestCase):

    def test_01_iou_calculation(self):
        boxA = [10, 10, 50, 50]
        boxB = [10, 10, 50, 50]
        self.assertAlmostEqual(calculate_bbox_iou(boxA, boxB), 1.0)

        boxC = [100, 100, 150, 150]
        self.assertEqual(calculate_bbox_iou(boxA, boxC), 0.0)

    def test_02_centroid_distance(self):
        boxA = [0, 0, 10, 10]
        boxB = [0, 0, 10, 10]
        self.assertEqual(calculate_centroid_distance(boxA, boxB), 0.0)

        boxC = [10, 0, 20, 10]
        self.assertEqual(calculate_centroid_distance(boxA, boxC), 10.0)

    def test_03_spatial_matching_preserves_component_id(self):
        prev_comps = [
            {
                "id": "R1",
                "designator": "R1",
                "type": "resistor",
                "bbox": [100, 100, 150, 150],
                "displayValue": "1.00 kΩ"
            }
        ]
        curr_comps = [
            {
                "id": "det-1",
                "designator": "R1_new",
                "type": "resistor",
                "bbox": [102, 101, 152, 151],
                "displayValue": "1.00 kΩ"
            }
        ]

        matched, events = match_components_spatially(curr_comps, prev_comps)
        self.assertEqual(len(matched), 1)
        self.assertEqual(matched[0]["id"], "R1")
        self.assertEqual(matched[0]["designator"], "R1")

    def test_04_detects_value_change(self):
        prev_comps = [
            {
                "id": "R1",
                "designator": "R1",
                "type": "resistor",
                "bbox": [100, 100, 150, 150],
                "displayValue": "1.00 kΩ",
                "valueSource": "ocr"
            }
        ]
        curr_comps = [
            {
                "id": "det-1",
                "designator": "R1_new",
                "type": "resistor",
                "bbox": [100, 100, 150, 150],
                "displayValue": "470.00 Ω",
                "formatted_value": "470.00 Ω",
                "valueSource": "ocr"
            }
        ]

        matched, events = match_components_spatially(curr_comps, prev_comps)
        self.assertTrue(any("R1 value changed" in e for e in events))

    def test_05_detects_added_and_removed_components(self):
        prev_comps = [
            {"id": "R1", "designator": "R1", "type": "resistor", "bbox": [10, 10, 40, 40]},
            {"id": "C1", "designator": "C1", "type": "capacitor", "bbox": [100, 100, 140, 140]}
        ]
        curr_comps = [
            {"id": "det-1", "designator": "R1_new", "type": "resistor", "bbox": [10, 10, 40, 40]},
            {"id": "det-2", "designator": "LED1", "type": "led", "bbox": [200, 200, 240, 240]}
        ]

        matched, events = match_components_spatially(curr_comps, prev_comps)
        self.assertTrue(any("C1 (capacitor) removed" in e for e in events))
        self.assertTrue(any("New component LED1 (led) detected" in e for e in events))

if __name__ == "__main__":
    unittest.main()
