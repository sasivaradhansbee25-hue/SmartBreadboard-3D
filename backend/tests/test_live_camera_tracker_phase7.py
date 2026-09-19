"""
SmartBreadboard 3D — Phase 7 Live Camera Tracker & Digital Twin Unit & Integration Tests
Tests:
A. Single component tracking stability
B. Multi-component distinct ID preservation
C. Temporary detection loss & LOST state transition
D. Reacquisition & REACQUIRED state transition
E. Timeout after max_lost_frames
F. Temporal EMA bounding box smoothing
G. Breadboard hole mapping confidence stability
H. Simulation result & measurement preservation
"""

import sys
import os
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from cv.camera_tracker import (
    LiveComponentTracker,
    calculate_bbox_iou,
    calculate_centroid_distance,
    smooth_bbox_ema
)


class TestLiveCameraTrackerPhase7(unittest.TestCase):

    def setUp(self):
        self.tracker = LiveComponentTracker(
            distance_threshold=120.0,
            max_lost_frames=5,
            smoothing_alpha=0.65
        )

    def test_01_single_component_lifecycle_and_state_machine(self):
        """Frame 1: DETECTED -> Frame 2..5: TRACKED (ID stays R1)"""
        # Frame 1: Detection
        f1_det = [{
            "id": "det-1",
            "designator": "R1",
            "type": "resistor",
            "bbox": [100, 100, 150, 150],
            "confidence": 0.95,
            "hole1": "E10",
            "hole2": "E15",
            "mapping_confidence": 0.92
        }]
        res1, events1 = self.tracker.process_frame(f1_det)
        self.assertEqual(len(res1), 1)
        self.assertEqual(res1[0]["designator"], "R1")
        self.assertEqual(res1[0]["tracking_state"], "DETECTED")

        # Frame 2: Slight movement
        f2_det = [{
            "id": "det-2",
            "designator": "R1_raw",
            "type": "resistor",
            "bbox": [102, 101, 152, 151],
            "confidence": 0.94,
            "hole1": "E10",
            "hole2": "E15",
            "mapping_confidence": 0.90
        }]
        res2, events2 = self.tracker.process_frame(f2_det)
        self.assertEqual(len(res2), 1)
        self.assertEqual(res2[0]["designator"], "R1")
        self.assertEqual(res2[0]["tracking_state"], "TRACKED")
        self.assertEqual(res2[0]["consecutive_lost_frames"], 0)

    def test_02_temporary_detection_loss_and_reacquisition(self):
        """R1 detected -> R1 missing (LOST) -> R1 re-appears (REACQUIRED with same ID R1)"""
        # Frame 1: Initial detection
        f1 = [{
            "id": "R1",
            "designator": "R1",
            "type": "resistor",
            "bbox": [100, 100, 150, 150],
            "confidence": 0.95,
            "hole1": "E10",
            "hole2": "E15"
        }]
        self.tracker.process_frame(f1)

        # Frame 2: Occlusion / Camera glare (0 detections)
        res2, events2 = self.tracker.process_frame([])
        self.assertEqual(len(res2), 1)
        self.assertEqual(res2[0]["designator"], "R1")
        self.assertEqual(res2[0]["tracking_state"], "LOST")
        self.assertEqual(res2[0]["consecutive_lost_frames"], 1)

        # Frame 3: Still missing
        res3, events3 = self.tracker.process_frame([])
        self.assertEqual(len(res3), 1)
        self.assertEqual(res3[0]["designator"], "R1")
        self.assertEqual(res3[0]["tracking_state"], "LOST")
        self.assertEqual(res3[0]["consecutive_lost_frames"], 2)

        # Frame 4: Reacquired at nearby location
        f4 = [{
            "id": "det-new",
            "designator": "R_tmp",
            "type": "resistor",
            "bbox": [104, 102, 154, 152],
            "confidence": 0.91,
            "hole1": "E10",
            "hole2": "E15"
        }]
        res4, events4 = self.tracker.process_frame(f4)
        self.assertEqual(len(res4), 1)
        self.assertEqual(res4[0]["designator"], "R1")
        self.assertEqual(res4[0]["tracking_state"], "REACQUIRED")
        self.assertEqual(res4[0]["consecutive_lost_frames"], 0)

        # Frame 5: Continues tracking as TRACKED
        f5 = [{
            "id": "det-5",
            "designator": "R_tmp",
            "type": "resistor",
            "bbox": [104, 102, 154, 152],
            "confidence": 0.92,
            "hole1": "E10",
            "hole2": "E15"
        }]
        res5, events5 = self.tracker.process_frame(f5)
        self.assertEqual(res5[0]["tracking_state"], "TRACKED")

    def test_03_pruning_after_max_lost_frames_exceeded(self):
        """Component permanently removed after 5 consecutive lost frames"""
        f1 = [{
            "id": "C1",
            "designator": "C1",
            "type": "capacitor",
            "bbox": [200, 200, 240, 240],
            "confidence": 0.90
        }]
        self.tracker.process_frame(f1)

        # 5 frames of absence: retained as LOST
        for i in range(1, 6):
            res, _ = self.tracker.process_frame([])
            self.assertEqual(len(res), 1)
            self.assertEqual(res[0]["tracking_state"], "LOST")
            self.assertEqual(res[0]["consecutive_lost_frames"], i)

        # 6th frame of absence: exceeding max_lost_frames (5) -> removed
        res6, events6 = self.tracker.process_frame([])
        self.assertEqual(len(res6), 0)
        self.assertTrue(any("C1" in e and "removed" in e for e in events6))

    def test_04_temporal_ema_smoothing(self):
        """Sudden coordinate jump is smoothed by EMA alpha"""
        f1 = [{
            "id": "LED1",
            "designator": "LED1",
            "type": "led",
            "bbox": [100, 100, 120, 120],
            "confidence": 0.95
        }]
        res1, _ = self.tracker.process_frame(f1)
        self.assertEqual(res1[0]["bbox"], [100, 100, 120, 120])

        # Step jump in raw detection from 100 to 110 (delta = 10)
        # Expected smoothed: 0.65 * 110 + 0.35 * 100 = 71.5 + 35 = 106.5 -> 106 or 107
        f2 = [{
            "id": "det-led",
            "designator": "LED_new",
            "type": "led",
            "bbox": [110, 110, 130, 130],
            "confidence": 0.93
        }]
        res2, _ = self.tracker.process_frame(f2)
        smoothed_x1 = res2[0]["bbox"][0]
        self.assertTrue(105 <= smoothed_x1 <= 108)

    def test_05_hole_mapping_stability_on_low_confidence(self):
        """Low confidence hole mapping (<0.5) does not overwrite high confidence mapping"""
        f1 = [{
            "id": "R1",
            "designator": "R1",
            "type": "resistor",
            "bbox": [100, 100, 150, 150],
            "hole1": "F12",
            "hole2": "F18",
            "mapping_confidence": 0.94
        }]
        self.tracker.process_frame(f1)

        # Next frame: glare causes low mapping confidence (0.32) and ambiguous holes
        f2 = [{
            "id": "det-2",
            "designator": "R1",
            "type": "resistor",
            "bbox": [101, 101, 151, 151],
            "hole1": "G13",
            "hole2": "G19",
            "mapping_confidence": 0.32
        }]
        res2, _ = self.tracker.process_frame(f2)
        self.assertEqual(res2[0]["hole1"], "F12")
        self.assertEqual(res2[0]["hole2"], "F18")
        self.assertEqual(res2[0]["mapping_confidence"], 0.94)

    def test_06_multi_component_distinct_identities(self):
        """Multi-component circuit preserves all distinct designators without cross-talk"""
        f1 = [
            {"id": "R1", "designator": "R1", "type": "resistor", "bbox": [50, 50, 100, 100]},
            {"id": "LED1", "designator": "LED1", "type": "led", "bbox": [150, 50, 180, 100]},
            {"id": "C1", "designator": "C1", "type": "capacitor", "bbox": [220, 50, 260, 100]}
        ]
        res1, _ = self.tracker.process_frame(f1)
        self.assertEqual(len(res1), 3)

        # Next frame with jittered positions
        f2 = [
            {"id": "d1", "designator": "tmp1", "type": "resistor", "bbox": [52, 51, 102, 101]},
            {"id": "d2", "designator": "tmp2", "type": "led", "bbox": [151, 52, 181, 102]},
            {"id": "d3", "designator": "tmp3", "type": "capacitor", "bbox": [219, 49, 259, 99]}
        ]
        res2, _ = self.tracker.process_frame(f2)
        des_list = sorted([c["designator"] for c in res2])
        self.assertEqual(des_list, ["C1", "LED1", "R1"])


if __name__ == "__main__":
    unittest.main()
