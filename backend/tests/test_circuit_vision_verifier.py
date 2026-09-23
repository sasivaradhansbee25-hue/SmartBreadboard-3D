"""
Unit & Integration Tests for Circuit Vision Verification & False-Positive Rejection Agent (Phase 18)
Verifies tests A through L:
A. High-confidence valid resistor -> VERIFIED
B. Low-confidence detection -> UNKNOWN
C. Detection outside breadboard ROI -> REJECTED
D. Invalid terminal mapping -> UNKNOWN/REJECTED
E. Duplicate detections -> one retained, duplicate rejected
F. Stable multi-frame detection -> verification improves
G. Unstable multi-frame detection -> not VERIFIED
H. Rejected component never enters netlist
I. Unknown component reaches Phase 17 manual recovery path
J. Verified component reaches existing mapping/netlist pipeline
K. No fabricated component values
L. Existing Phase 17 manual resistor still works
"""

import unittest
import sys
import os

# Add backend directory to sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from cv.circuit_vision_verifier import CircuitVisionVerifier, verify_circuit_vision_candidates, VISION_VERIFY_CONFIG
from core.circuit_model import build_netlist_from_detections
from cv.breadboard_grid import get_breadboard_homography


class TestCircuitVisionVerifier(unittest.TestCase):
    def setUp(self):
        self.verifier = CircuitVisionVerifier()
        self.img_w = 1280
        self.img_h = 850

    def test_A_high_confidence_valid_resistor_verified(self):
        """Test A: High-confidence resistor with valid geometry and terminals within breadboard -> VERIFIED."""
        raw_candidates = [
            {
                "id": "det_res_1",
                "class": "resistor",
                "confidence": 0.88,
                "bbox": [400, 300, 520, 340]
            }
        ]
        res = self.verifier.verify_candidates(raw_candidates, self.img_w, self.img_h)
        self.assertEqual(res["verified_count"], 1)
        self.assertEqual(res["rejected_count"], 0)
        self.assertEqual(res["verified"][0]["verification"], "VERIFIED")
        self.assertGreaterEqual(res["verified"][0]["verification_score"], 0.60)
        self.assertIn("inside_breadboard_roi", res["verified"][0]["reasons"])

    def test_B_low_confidence_detection_unknown(self):
        """Test B: Low/marginal-confidence detection inside breadboard -> UNKNOWN."""
        raw_candidates = [
            {
                "id": "det_unk_1",
                "class": "resistor",
                "confidence": 0.32,
                "bbox": [400, 300, 520, 340]
            }
        ]
        res = self.verifier.verify_candidates(raw_candidates, self.img_w, self.img_h)
        self.assertEqual(res["unknown_count"], 1)
        self.assertEqual(res["verified_count"], 0)
        self.assertEqual(res["unknown"][0]["verification"], "UNKNOWN")

    def test_C_outside_breadboard_roi_rejected(self):
        """Test C: Detection clearly outside breadboard ROI (e.g. laptop keyboard / desk) -> REJECTED."""
        raw_candidates = [
            {
                "id": "det_outside_1",
                "class": "ic_chip",
                "confidence": 0.92,
                "bbox": [10, 10, 60, 60]  # Far top-left corner outside breadboard
            }
        ]
        res = self.verifier.verify_candidates(raw_candidates, self.img_w, self.img_h)
        self.assertEqual(res["rejected_count"], 1)
        self.assertEqual(res["verified_count"], 0)
        self.assertEqual(res["rejected"][0]["verification"], "REJECTED")
        self.assertIn("outside_breadboard_roi", res["rejected"][0]["reasons"])

    def test_D_invalid_terminal_mapping_unknown_or_rejected(self):
        """Test D: Implausible terminal mapping coordinates -> UNKNOWN or REJECTED."""
        raw_candidates = [
            {
                "id": "det_bad_leads",
                "class": "resistor",
                "confidence": 0.40,
                "bbox": [50, 50, 70, 70] # Tiny box at extreme edge
            }
        ]
        res = self.verifier.verify_candidates(raw_candidates, self.img_w, self.img_h)
        self.assertEqual(res["verified_count"], 0)
        cand = res["all_candidates"][0]
        self.assertIn(cand["verification"], ["UNKNOWN", "REJECTED"])

    def test_E_duplicate_detections_one_retained_duplicate_rejected(self):
        """Test E: Two overlapping candidates on the same component -> highest retained, duplicate REJECTED."""
        raw_candidates = [
            {
                "id": "det_res_primary",
                "class": "resistor",
                "confidence": 0.88,
                "bbox": [450, 320, 560, 360]
            },
            {
                "id": "det_res_dup",
                "class": "wire",  # Overlapping false wire detection
                "confidence": 0.55,
                "bbox": [452, 322, 558, 358]  # Almost identical bounding box
            }
        ]
        res = self.verifier.verify_candidates(raw_candidates, self.img_w, self.img_h)
        self.assertEqual(res["raw_yolo_count"], 2)
        self.assertEqual(res["verified_count"], 1)
        self.assertEqual(res["rejected_count"], 1)
        self.assertEqual(res["verified"][0]["id"], "det_res_primary")
        self.assertEqual(res["rejected"][0]["id"], "det_res_dup")
        self.assertTrue(res["rejected"][0]["is_duplicate"])

    def test_F_stable_multi_frame_detection_verification_improves(self):
        """Test F: Stable tracking history improves temporal score."""
        prev_tracking = [
            {
                "id": "R1",
                "designator": "R1",
                "class": "resistor",
                "type": "resistor",
                "tracking_state": "TRACKED",
                "bbox": [400, 300, 520, 340]
            }
        ]
        raw_candidates = [
            {
                "id": "det_1",
                "class": "resistor",
                "confidence": 0.70,
                "bbox": [402, 301, 519, 339]
            }
        ]
        res = self.verifier.verify_candidates(raw_candidates, self.img_w, self.img_h, previous_tracking=prev_tracking)
        self.assertEqual(res["verified_count"], 1)
        self.assertEqual(res["verified"][0]["sub_scores"]["temporal_score"], 1.0)
        self.assertIn("temporally_stable_and_tracked", res["verified"][0]["reasons"])

    def test_G_unstable_multi_frame_detection_class_flip(self):
        """Test G: Candidate rapidly flipping class across frames receives lower verification."""
        prev_tracking = [
            {
                "id": "R1",
                "type": "ic_chip",
                "tracking_state": "TRACKED",
                "bbox": [400, 300, 520, 340]
            }
        ]
        raw_candidates = [
            {
                "id": "det_flip",
                "class": "wire",
                "confidence": 0.40,
                "bbox": [402, 301, 519, 339]
            }
        ]
        res = self.verifier.verify_candidates(raw_candidates, self.img_w, self.img_h, previous_tracking=prev_tracking)
        self.assertEqual(res["verified_count"], 0)
        self.assertIn("class_flip_detected", res["all_candidates"][0]["reasons"])

    def test_H_rejected_component_never_enters_netlist(self):
        """Test H: REJECTED component is excluded from netlist generation and MNA."""
        rejected_candidate = {
            "id": "det_bad",
            "class": "resistor",
            "verification": "REJECTED",
            "is_duplicate": False,
            "bbox": [10, 10, 20, 20]
        }
        verified_candidate = {
            "id": "det_good",
            "class": "resistor",
            "verification": "VERIFIED",
            "confidence": 0.85,
            "bbox": [400, 300, 520, 340],
            "hole1": "A10",
            "hole2": "A15"
        }
        netlist = build_netlist_from_detections([rejected_candidate, verified_candidate])
        comps = netlist.get("components", [])
        self.assertEqual(len(comps), 1)
        self.assertEqual(comps[0]["id"], "det_good")
        self.assertNotIn("det_bad", [c["id"] for c in comps])

    def test_I_unknown_component_reaches_phase17_manual_recovery_path(self):
        """Test I: Low-confidence/ambiguous detection produces UNKNOWN candidate for Phase 17 modal."""
        raw_candidates = [
            {
                "id": "det_unk_lead",
                "class": "resistor",
                "confidence": 0.38,
                "bbox": [400, 300, 520, 340]
            }
        ]
        res = verify_circuit_vision_candidates(raw_candidates, self.img_w, self.img_h)
        self.assertEqual(res["unknown_count"], 1)
        unk = res["unknown"][0]
        self.assertEqual(unk["verification"], "UNKNOWN")
        self.assertTrue(len(unk["reasons"]) > 0)

    def test_J_verified_component_reaches_netlist(self):
        """Test J: VERIFIED candidate successfully builds netlist and connectivity."""
        raw_candidates = [
            {
                "id": "det_res1",
                "class": "resistor",
                "confidence": 0.85,
                "bbox": [400, 300, 520, 340]
            }
        ]
        ver_res = verify_circuit_vision_candidates(raw_candidates, self.img_w, self.img_h)
        self.assertEqual(ver_res["verified_count"], 1)

        netlist = build_netlist_from_detections(ver_res["verified"])
        self.assertEqual(len(netlist.get("components", [])), 1)
        self.assertEqual(netlist["components"][0]["type"], "resistor")

    def test_K_no_fabricated_component_values(self):
        """Test K: Verifier does not fabricate values or modify detected_value / user_override_value."""
        raw_candidates = [
            {
                "id": "det_res1",
                "class": "resistor",
                "confidence": 0.85,
                "bbox": [400, 300, 520, 340]
            }
        ]
        ver_res = verify_circuit_vision_candidates(raw_candidates, self.img_w, self.img_h)
        v = ver_res["verified"][0]
        # Verifier must NOT inject hardcoded electrical values
        self.assertNotIn("resistance_ohms", v)

    def test_L_phase17_manual_resistor_compatibility(self):
        """Test L: Phase 17 manual resistor definition remains completely functional."""
        manual_component = {
            "id": "R_MANUAL_1",
            "designator": "R_MANUAL_1",
            "type": "resistor",
            "source": "user_override",
            "user_override_value": 220.0,
            "value": 220.0,
            "unit": "Ω",
            "start_hole": "A10",
            "end_hole": "A15",
            "hole1": "A10",
            "hole2": "A15",
            "confidence": 1.0,
            "verification": "VERIFIED"
        }
        netlist = build_netlist_from_detections([manual_component])
        self.assertEqual(len(netlist.get("components", [])), 1)
        comp = netlist["components"][0]
        self.assertEqual(comp["value"], 220.0)
        self.assertEqual(comp["valueSource"], "user_override")


if __name__ == '__main__':
    unittest.main()
