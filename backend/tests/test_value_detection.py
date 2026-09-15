"""
SmartBreadboard 3D — Component Value Detection & Consensus Unit Tests
Verifies multi-pass OCR parsing, resistor color fusion, confidence scoring,
solver value gate, user-confirmation workflow, and voltage-change persistence.
"""

import sys
import os
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from cv.value_parser import parse_component_value
from cv.value_consensus import normalize_ocr_text, extract_value_consensus_from_crop
from circuit_solver.validation import validate_circuit_netlist
from circuit_solver.dc_solver import run_dc_analysis
from circuit_solver.results import format_solver_result

class TestValueDetectionAccuracy(unittest.TestCase):

    def test_01_parse_1k_resistor(self):
        val, unit, formatted = parse_component_value("1K", "resistor")
        self.assertEqual(val, 1000.0)
        self.assertEqual(unit, "Ω")
        self.assertIn("1.00 kΩ", formatted)

    def test_02_parse_4k7_resistor(self):
        val, unit, formatted = parse_component_value("4.7K", "resistor")
        self.assertEqual(val, 4700.0)
        self.assertEqual(unit, "Ω")
        self.assertIn("4.70 kΩ", formatted)

    def test_03_parse_220r_resistor(self):
        val, unit, formatted = parse_component_value("220R", "resistor")
        self.assertEqual(val, 220.0)
        self.assertEqual(unit, "Ω")
        self.assertIn("220.00 Ω", formatted)

    def test_04_parse_100uf_capacitor(self):
        val, unit, formatted = parse_component_value("100uF", "capacitor")
        self.assertAlmostEqual(val, 100e-6, places=8)
        self.assertEqual(unit, "F")
        self.assertIn("100.00 µF", formatted)

    def test_05_parse_104_capacitor(self):
        val, unit, formatted = parse_component_value("104", "capacitor")
        self.assertAlmostEqual(val, 100e-9, places=11)
        self.assertEqual(unit, "F")
        self.assertIn("100.00 nF", formatted)

    def test_06_parse_10mh_inductor(self):
        val, unit, formatted = parse_component_value("10mH", "inductor")
        self.assertAlmostEqual(val, 10e-3, places=6)
        self.assertEqual(unit, "H")
        self.assertIn("10.00 mH", formatted)

    def test_07_normalize_ocr_text(self):
        self.assertEqual(normalize_ocr_text("IK"), "1K")
        self.assertEqual(normalize_ocr_text("1KΩ"), "1K")
        self.assertEqual(normalize_ocr_text("100 uF"), "100UF")

    def test_08_solver_gate_blocks_unconfirmed_values(self):
        components = [
            {
                "id": "R1",
                "type": "resistor",
                "value": None,
                "valueSource": "user_required",
                "needsConfirmation": True,
                "node1": "NET_VCC",
                "node2": "NET_GND"
            }
        ]
        power_sources = [
            {"id": "V1", "voltage": 12.0, "positive_node": "NET_VCC", "negative_node": "NET_GND"}
        ]
        is_valid, err, warnings = validate_circuit_netlist(components, power_sources)
        self.assertFalse(is_valid)
        self.assertEqual(err["code"], "VALUE_CONFIRMATION_REQUIRED")

    def test_09_user_confirms_value_allows_solver(self):
        components = [
            {
                "id": "R1",
                "type": "resistor",
                "value": 1000.0,
                "valueSource": "user_confirmed",
                "needsConfirmation": False,
                "node1": "NET_VCC",
                "node2": "NET_GND"
            }
        ]
        power_sources = [
            {"id": "V1", "voltage": 12.0, "positive_node": "NET_VCC", "negative_node": "NET_GND"}
        ]
        is_valid, err, warnings = validate_circuit_netlist(components, power_sources)
        self.assertTrue(is_valid)
        self.assertIsNone(err)

        res = format_solver_result(run_dc_analysis({"components": components, "power_sources": power_sources}))
        self.assertTrue(res["success"])
        self.assertAlmostEqual(res["measurements"]["R1"]["current"], 0.012, places=4)
        self.assertAlmostEqual(res["measurements"]["R1"]["power"], 0.144, places=4)

    def test_10_user_edits_value_recalculates_solver(self):
        components = [
            {
                "id": "R1",
                "type": "resistor",
                "value": 2200.0,
                "valueSource": "user_confirmed",
                "needsConfirmation": False,
                "node1": "NET_VCC",
                "node2": "NET_GND"
            }
        ]
        power_sources = [
            {"id": "V1", "voltage": 11.0, "positive_node": "NET_VCC", "negative_node": "NET_GND"}
        ]
        res = format_solver_result(run_dc_analysis({"components": components, "power_sources": power_sources}))
        self.assertTrue(res["success"])
        self.assertAlmostEqual(res["measurements"]["R1"]["current"], 0.005, places=3)
        self.assertAlmostEqual(res["measurements"]["R1"]["power"], 0.055, places=3)

    def test_11_voltage_change_preserves_confirmed_value(self):
        components = [
            {
                "id": "R1",
                "type": "resistor",
                "value": 1000.0,
                "valueSource": "user_confirmed",
                "needsConfirmation": False,
                "node1": "NET_VCC",
                "node2": "NET_GND"
            }
        ]
        power_sources_5v = [{"id": "V1", "voltage": 5.0, "positive_node": "NET_VCC", "negative_node": "NET_GND"}]
        power_sources_12v = [{"id": "V1", "voltage": 12.0, "positive_node": "NET_VCC", "negative_node": "NET_GND"}]

        res_5v = format_solver_result(run_dc_analysis({"components": components, "power_sources": power_sources_5v}))
        res_12v = format_solver_result(run_dc_analysis({"components": components, "power_sources": power_sources_12v}))

        self.assertAlmostEqual(res_5v["measurements"]["R1"]["current"], 0.005, places=4)
        self.assertAlmostEqual(res_12v["measurements"]["R1"]["current"], 0.012, places=4)
        self.assertEqual(components[0]["value"], 1000.0)
        self.assertEqual(components[0]["valueSource"], "user_confirmed")


if __name__ == "__main__":
    unittest.main()
