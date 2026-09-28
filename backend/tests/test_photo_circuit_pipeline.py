"""
backend/tests/test_photo_circuit_pipeline.py — Unit Tests for Phase 24.1 Photo-to-Circuit Mapping

Validates:
1. Single resistor photo mapping
2. Resistor + LED series
3. Resistor + LED parallel
4. RLC circuit mapping
5. Ambiguous terminal
6. Unknown component
7. Invalid/no breadboard image
8. Jumper wire node merge
9. Deterministic circuit signature
10. Simulation readiness gate
"""

import sys
import os
import unittest
import numpy as np
import cv2

# Set path to backend root
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.photo_circuit_pipeline import (
    map_photo_to_circuit,
    decode_image_input,
    extract_component_terminals_mvp,
    compute_deterministic_circuit_signature,
    SUPPORTED_COMPONENTS
)


class TestPhotoCircuitPipeline(unittest.TestCase):

    def setUp(self):
        # Create a standard synthetic breadboard test image (1280x850 BGR)
        self.test_img = np.full((850, 1280, 3), 240, dtype=np.uint8)
        # Add grid texture so std > 3.0
        cv2.rectangle(self.test_img, (200, 150), (1100, 700), (220, 220, 220), -1)
        for r in range(160, 690, 25):
            for c in range(210, 1090, 25):
                cv2.circle(self.test_img, (c, r), 3, (50, 50, 50), -1)

    # 1. Single resistor photo mapping
    def test_01_single_resistor_mapping(self):
        mock_candidates = [
            {
                "id": "R1",
                "type": "resistor",
                "confidence": 0.95,
                "bbox": [300, 200, 450, 250],
                "start_hole": "A10",
                "end_hole": "A15",
                "source": "AI"
            }
        ]

        result = map_photo_to_circuit(self.test_img, mock_detections=mock_candidates)

        self.assertEqual(result["status"], "READY")
        self.assertEqual(len(result["components"]), 1)
        comp = result["components"][0]
        self.assertEqual(comp["id"], "R1")
        self.assertEqual(comp["type"], "resistor")
        self.assertEqual(len(comp["terminals"]), 2)
        self.assertEqual(comp["terminals"][0]["terminal"], "terminal_a")
        self.assertEqual(comp["terminals"][0]["hole"], "A10")
        self.assertEqual(comp["terminals"][1]["terminal"], "terminal_b")
        self.assertEqual(comp["terminals"][1]["hole"], "A15")

        # In breadboard, column 10 and column 15 are separate nodes
        self.assertEqual(len(result["nodes"]), 2)
        self.assertIn("R1.terminal_a", result["nodes"][0]["members"] + result["nodes"][1]["members"])
        self.assertIn("R1.terminal_b", result["nodes"][0]["members"] + result["nodes"][1]["members"])
        self.assertEqual(len(result["connections"]), 2)

    # 2. Resistor + LED series
    def test_02_resistor_led_series_mapping(self):
        # R1: A10 -> E15, LED1: C15 -> E20 (Sharing column 15 top -> same electrical node)
        mock_candidates = [
            {
                "id": "R1",
                "type": "resistor",
                "confidence": 0.94,
                "bbox": [300, 200, 450, 250],
                "start_hole": "A10",
                "end_hole": "E15"
            },
            {
                "id": "LED1",
                "type": "led",
                "confidence": 0.91,
                "bbox": [450, 200, 600, 250],
                "start_hole": "C15",
                "end_hole": "E20"
            }
        ]

        result = map_photo_to_circuit(self.test_img, mock_detections=mock_candidates)

        self.assertEqual(result["status"], "READY")
        self.assertEqual(len(result["components"]), 2)

        # Check terminal naming: R1 has terminal_a/b, LED1 has anode/cathode
        r1 = next(c for c in result["components"] if c["id"] == "R1")
        led1 = next(c for c in result["components"] if c["id"] == "LED1")
        self.assertEqual([t["terminal"] for t in r1["terminals"]], ["terminal_a", "terminal_b"])
        self.assertEqual([t["terminal"] for t in led1["terminals"]], ["anode", "cathode"])

        # Check node sharing on Column 15 (E15 and C15 both map to NODE_COL_15_TOP)
        mid_node = next(n for n in result["nodes"] if "R1.terminal_b" in n["members"])
        self.assertIn("LED1.anode", mid_node["members"])
        # Total distinct nodes: Column 10, Column 15, Column 20 = 3 nodes
        self.assertEqual(len(result["nodes"]), 3)

    # 3. Resistor + LED parallel
    def test_03_resistor_led_parallel_mapping(self):
        # R1: A10 -> A15, LED1: C10 -> C15 (Both connect between col 10 top and col 15 top)
        mock_candidates = [
            {
                "id": "R1",
                "type": "resistor",
                "confidence": 0.96,
                "bbox": [300, 180, 450, 210],
                "start_hole": "A10",
                "end_hole": "A15"
            },
            {
                "id": "LED1",
                "type": "led",
                "confidence": 0.92,
                "bbox": [300, 230, 450, 260],
                "start_hole": "C10",
                "end_hole": "C15"
            }
        ]

        result = map_photo_to_circuit(self.test_img, mock_detections=mock_candidates)

        self.assertEqual(result["status"], "READY")
        # Should resolve exactly 2 electrical nodes
        self.assertEqual(len(result["nodes"]), 2)

        node_a = next(n for n in result["nodes"] if "R1.terminal_a" in n["members"])
        node_b = next(n for n in result["nodes"] if "R1.terminal_b" in n["members"])

        self.assertIn("LED1.anode", node_a["members"])
        self.assertIn("LED1.cathode", node_b["members"])

    # 4. RLC circuit mapping (Resistor, Inductor, Capacitor)
    def test_04_rlc_circuit_mapping(self):
        mock_candidates = [
            {
                "id": "R1",
                "type": "resistor",
                "confidence": 0.95,
                "bbox": [200, 200, 320, 230],
                "start_hole": "A10",
                "end_hole": "B15"
            },
            {
                "id": "L1",
                "type": "inductor",
                "confidence": 0.89,
                "bbox": [340, 200, 460, 230],
                "start_hole": "C15",
                "end_hole": "D20"
            },
            {
                "id": "C1",
                "type": "capacitor",
                "confidence": 0.93,
                "bbox": [480, 200, 600, 230],
                "start_hole": "E20",
                "end_hole": "A25"
            }
        ]

        result = map_photo_to_circuit(self.test_img, mock_detections=mock_candidates)

        self.assertEqual(result["status"], "READY")
        self.assertEqual(len(result["components"]), 3)
        self.assertEqual({c["type"] for c in result["components"]}, {"resistor", "inductor", "capacitor"})

        # R1 and L1 share col 15 (B15 and C15)
        node_rl = next(n for n in result["nodes"] if "R1.terminal_b" in n["members"])
        self.assertIn("L1.terminal_a", node_rl["members"])

        # L1 and C1 share col 20 (D20 and E20)
        node_lc = next(n for n in result["nodes"] if "L1.terminal_b" in n["members"])
        self.assertIn("C1.terminal_a", node_lc["members"])

    # 5. Ambiguous terminal detection
    def test_05_ambiguous_terminal(self):
        mock_candidates = [
            {
                "id": "R1",
                "type": "resistor",
                "confidence": 0.88,
                "bbox": [300, 200, 450, 250],
                "start_hole": "A10",
                "end_hole": "E15",
                "status": "AMBIGUOUS",
                "ambiguous_terminal": "terminal_b",
                "possible_holes": ["E15", "E16"]
            }
        ]

        result = map_photo_to_circuit(self.test_img, mock_detections=mock_candidates)

        self.assertEqual(result["status"], "AMBIGUOUS")
        comp = result["components"][0]
        self.assertEqual(comp["status"], "AMBIGUOUS")
        tb = next(t for t in comp["terminals"] if t["terminal"] == "terminal_b")
        self.assertEqual(tb["status"], "AMBIGUOUS")
        self.assertEqual(tb["alternate_holes"], ["E15", "E16"])
        self.assertFalse(result["simulation_ready"])
        self.assertEqual(result["simulation_readiness_reason"], "AMBIGUOUS_TERMINAL_MAPPING")

    # 6. Unknown / unsupported component
    def test_06_unknown_component(self):
        mock_candidates = [
            {
                "id": "R1",
                "type": "resistor",
                "confidence": 0.95,
                "bbox": [300, 200, 450, 250],
                "start_hole": "A10",
                "end_hole": "A15"
            },
            {
                "id": "U1",
                "type": "unknown_sensor",
                "confidence": 0.70,
                "bbox": [500, 200, 650, 280]
            }
        ]

        result = map_photo_to_circuit(self.test_img, mock_detections=mock_candidates)

        self.assertEqual(result["status"], "PARTIAL")
        self.assertFalse(result["simulation_ready"])
        self.assertEqual(result["simulation_readiness_reason"], "UNSUPPORTED_OR_UNKNOWN_COMPONENTS")
        unkn = next(c for c in result["components"] if c["id"] == "U1")
        self.assertEqual(unkn["status"], "UNKNOWN")

    # 7. Invalid / blank / no breadboard image
    def test_07_invalid_or_no_breadboard_image(self):
        # 7a: None / unreadable
        res_none = map_photo_to_circuit(None)
        self.assertEqual(res_none["status"], "BLOCKED")
        self.assertEqual(res_none["simulation_readiness_reason"], "INVALID_IMAGE")

        # 7b: Solid blank image (std < 3.0)
        solid_img = np.zeros((800, 1200, 3), dtype=np.uint8)
        res_solid = map_photo_to_circuit(solid_img)
        self.assertEqual(res_solid["status"], "BLOCKED")
        self.assertEqual(res_solid["simulation_readiness_reason"], "BLANK_IMAGE")

        # 7c: Valid image but 0 components detected
        res_empty = map_photo_to_circuit(self.test_img, mock_detections=[])
        self.assertEqual(res_empty["status"], "BLOCKED")
        self.assertEqual(res_empty["simulation_readiness_reason"], "NO_COMPONENTS_DETECTED")

    # 8. Jumper wire node merge
    def test_08_jumper_wire_node_merge(self):
        # R1 on Col 10 to Col 15; Jumper W1 connects Col 15 to Col 25; R2 on Col 25 to Col 30
        mock_candidates = [
            {
                "id": "R1",
                "type": "resistor",
                "confidence": 0.95,
                "bbox": [200, 200, 300, 230],
                "start_hole": "A10",
                "end_hole": "A15"
            },
            {
                "id": "W1",
                "type": "wire",
                "confidence": 0.98,
                "bbox": [320, 200, 500, 230],
                "start_hole": "E15",
                "end_hole": "E25"
            },
            {
                "id": "R2",
                "type": "resistor",
                "confidence": 0.94,
                "bbox": [520, 200, 620, 230],
                "start_hole": "A25",
                "end_hole": "A30"
            }
        ]

        result = map_photo_to_circuit(self.test_img, mock_detections=mock_candidates)

        self.assertEqual(result["status"], "READY")
        # Col 15 top and Col 25 top must be merged into the exact same electrical node
        r1 = next(c for c in result["components"] if c["id"] == "R1")
        w1 = next(c for c in result["components"] if c["id"] == "W1")
        r2 = next(c for c in result["components"] if c["id"] == "R2")

        # Wire terminals must be named start & end per SPEC
        self.assertEqual([t["terminal"] for t in w1["terminals"]], ["start", "end"])

        r1_t2_node = r1["terminals"][1]["node"]
        w1_t1_node = w1["terminals"][0]["node"]
        w1_t2_node = w1["terminals"][1]["node"]
        r2_t1_node = r2["terminals"][0]["node"]

        self.assertEqual(r1_t2_node, w1_t1_node)
        self.assertEqual(w1_t1_node, w1_t2_node)
        self.assertEqual(w1_t2_node, r2_t1_node)

        # The merged node must list members from R1, W1, and R2
        merged_node = next(n for n in result["nodes"] if n["node_id"] == r1_t2_node)
        self.assertIn("R1.terminal_b", merged_node["members"])
        self.assertIn("W1.start", merged_node["members"])
        self.assertIn("W1.end", merged_node["members"])
        self.assertIn("R2.terminal_a", merged_node["members"])

    # 9. Deterministic circuit signature
    def test_09_deterministic_circuit_signature(self):
        cands_order1 = [
            {"id": "R1", "type": "resistor", "bbox": [100, 100, 200, 120], "start_hole": "A10", "end_hole": "A15"},
            {"id": "LED1", "type": "led", "bbox": [200, 100, 300, 120], "start_hole": "C15", "end_hole": "C20"}
        ]
        cands_order2 = [
            {"id": "LED1", "type": "led", "bbox": [200, 100, 300, 120], "start_hole": "C15", "end_hole": "C20"},
            {"id": "R1", "type": "resistor", "bbox": [100, 100, 200, 120], "start_hole": "A10", "end_hole": "A15"}
        ]

        res1 = map_photo_to_circuit(self.test_img, mock_detections=cands_order1)
        res2 = map_photo_to_circuit(self.test_img, mock_detections=cands_order2)

        self.assertTrue(res1["circuit_signature"])
        self.assertEqual(res1["circuit_signature"], res2["circuit_signature"])

    # 10. Simulation readiness gate (Phase 24.1 vs Phase 24.2)
    def test_10_simulation_readiness_gate(self):
        # A fully verified circuit in Phase 24.1 is NOT simulation ready until supply configuration
        mock_candidates = [
            {"id": "R1", "type": "resistor", "bbox": [100, 100, 200, 120], "start_hole": "A10", "end_hole": "A15"}
        ]

        result = map_photo_to_circuit(self.test_img, mock_detections=mock_candidates)

        self.assertEqual(result["status"], "READY")
        # Must be False because power supply configuration is deferred to Phase 24.2
        self.assertFalse(result["simulation_ready"])
        self.assertEqual(result["simulation_readiness_reason"], "SUPPLY_CONFIGURATION_REQUIRED")


if __name__ == "__main__":
    unittest.main()
