"""
SmartBreadboard 3D — Comprehensive Mapping & AI Electrical Simulation Pipeline Test Suite
Verifies the 7 benchmark test cases per Phase 11 requirements:
- TEST 1: 5V -> R -> LED -> GND (Valid netlist + MNA solution)
- TEST 2: Two resistors in series (Two resistor branches)
- TEST 3: Two resistors in parallel (Same node pair for both resistors)
- TEST 4: Open circuit (NETLIST_WARNING or unsolved state)
- TEST 5: VCC directly connected to GND (FAULT / direct short detection)
- TEST 6: Floating resistor (NETLIST_INVALID or warning)
- TEST 7: Wire joining two breadboard rows (One merged electrical net)
"""

import unittest
from cv.breadboard_grid import extract_component_lead_positions_verbose, calculate_lead_mapping_confidence
from core.circuit_model import build_netlist_from_detections
from core.wire_connectivity import build_electrical_connectivity
from core.circuit_validator import validate_circuit
from circuit_solver.dc_solver import run_dc_analysis
from circuit_solver.results import format_solver_result

class TestMappingAndSimulationPipeline(unittest.TestCase):

    def test_case_1_series_r_led_circuit(self):
        """TEST 1: 5V -> R -> LED -> GND -> valid netlist + MNA solution"""
        detections = [
            {
                "id": "W1", "class": "wire", "bbox": [100, 20, 200, 50],
                "hole1": "VCC_TOP_10", "hole2": "A10", "confidence": 0.95
            },
            {
                "id": "R1", "class": "resistor", "bbox": [200, 50, 300, 50],
                "hole1": "B10", "hole2": "B15", "value": 220, "confidence": 0.92
            },
            {
                "id": "LED1", "class": "led", "bbox": [300, 50, 400, 50],
                "hole1": "C15", "hole2": "C20", "confidence": 0.90
            },
            {
                "id": "W2", "class": "wire", "bbox": [400, 50, 500, 250],
                "hole1": "D20", "hole2": "GND_BOT_20", "confidence": 0.94
            }
        ]

        netlist = build_netlist_from_detections(detections, power_source={"voltage": 5.0, "positive_node": "NET_VCC (+5V)", "negative_node": "NET_GND (0V)"})
        self.assertIn("validity", netlist)
        self.assertIn(netlist["validity"]["netlist_status"], ["NETLIST_VALID", "NETLIST_WARNING"])

        res = run_dc_analysis(netlist)
        formatted = format_solver_result(res, netlist=netlist)

        self.assertTrue(formatted["success"])
        self.assertEqual(formatted["status"], "SOLVED")
        self.assertIn("R1", formatted["measurements"])
        self.assertIn("LED1", formatted["measurements"])
        self.assertGreater(formatted["measurements"]["R1"]["current"], 0.001)
        self.assertEqual(formatted["measurements"]["LED1"]["state"], "ON")

    def test_case_2_two_resistors_in_series(self):
        """TEST 2: Two resistors in series -> correct two resistor branches"""
        detections = [
            {
                "id": "R1", "class": "resistor", "bbox": [100, 50, 200, 50],
                "hole1": "A10", "hole2": "A15", "value": 1000, "confidence": 0.95
            },
            {
                "id": "R2", "class": "resistor", "bbox": [200, 50, 300, 50],
                "hole1": "B15", "hole2": "B20", "value": 1000, "confidence": 0.95
            },
            {
                "id": "W1", "class": "wire", "bbox": [50, 20, 100, 50],
                "hole1": "VCC_TOP_10", "hole2": "C10", "confidence": 0.95
            },
            {
                "id": "W2", "class": "wire", "bbox": [300, 50, 350, 250],
                "hole1": "C20", "hole2": "GND_BOT_20", "confidence": 0.95
            }
        ]

        netlist = build_netlist_from_detections(detections, power_source={"voltage": 10.0, "positive_node": "NET_VCC (+5V)", "negative_node": "NET_GND (0V)"})
        res = run_dc_analysis(netlist)
        formatted = format_solver_result(res, netlist=netlist)

        self.assertTrue(formatted["success"])
        v_r1 = abs(formatted["measurements"]["R1"]["voltageDrop"])
        v_r2 = abs(formatted["measurements"]["R2"]["voltageDrop"])
        self.assertAlmostEqual(v_r1, 5.0, places=1)
        self.assertAlmostEqual(v_r2, 5.0, places=1)

    def test_case_3_two_resistors_in_parallel(self):
        """TEST 3: Two resistors in parallel -> same node pair for both resistors"""
        detections = [
            {
                "id": "R1", "class": "resistor", "bbox": [100, 50, 200, 50],
                "hole1": "A10", "hole2": "A20", "value": 1000, "confidence": 0.95
            },
            {
                "id": "R2", "class": "resistor", "bbox": [100, 70, 200, 70],
                "hole1": "B10", "hole2": "B20", "value": 1000, "confidence": 0.95
            },
            {
                "id": "W1", "class": "wire", "bbox": [50, 20, 100, 50],
                "hole1": "VCC_TOP_10", "hole2": "C10", "confidence": 0.95
            },
            {
                "id": "W2", "class": "wire", "bbox": [200, 50, 250, 250],
                "hole1": "C20", "hole2": "GND_BOT_20", "confidence": 0.95
            }
        ]

        netlist = build_netlist_from_detections(detections, power_source={"voltage": 5.0, "positive_node": "NET_VCC (+5V)", "negative_node": "NET_GND (0V)"})
        res = run_dc_analysis(netlist)
        formatted = format_solver_result(res, netlist=netlist)

        self.assertTrue(formatted["success"])
        r1_comp = next(c for c in netlist["components"] if c["id"] == "R1")
        r2_comp = next(c for c in netlist["components"] if c["id"] == "R2")
        self.assertEqual(r1_comp["node1"], r2_comp["node1"])
        self.assertEqual(r1_comp["node2"], r2_comp["node2"])

        r1_meas = formatted["measurements"]["R1"]
        r2_meas = formatted["measurements"]["R2"]
        self.assertAlmostEqual(abs(r1_meas["voltageDrop"]), 5.0, places=1)
        self.assertAlmostEqual(abs(r2_meas["voltageDrop"]), 5.0, places=1)

    def test_case_4_open_circuit(self):
        """TEST 4: Open circuit -> NETLIST_WARNING or appropriate unsolved state"""
        detections = [
            {
                "id": "R1", "class": "resistor", "bbox": [100, 50, 200, 50],
                "hole1": "A10", "hole2": "A15", "value": 1000, "confidence": 0.95
            },
            {
                "id": "W1", "class": "wire", "bbox": [50, 20, 100, 50],
                "hole1": "VCC_TOP_10", "hole2": "B10", "confidence": 0.95
            }
        ]

        netlist = build_netlist_from_detections(detections, power_source={"voltage": 5.0, "positive_node": "NET_VCC (+5V)", "negative_node": "NET_GND (0V)"})
        val = validate_circuit(netlist)
        self.assertFalse(val["checks"]["closed_path"])
        self.assertEqual(val["solver_status"], "NOT_RUN")

    def test_case_5_vcc_direct_short_to_gnd(self):
        """TEST 5: VCC directly connected to GND -> direct short detection / FAULT"""
        detections = [
            {
                "id": "W_SHORT", "class": "wire", "bbox": [50, 20, 50, 250],
                "hole1": "VCC_TOP_10", "hole2": "GND_BOT_10", "confidence": 0.95
            }
        ]

        netlist = build_netlist_from_detections(detections, power_source={"voltage": 5.0, "positive_node": "NET_VCC (+5V)", "negative_node": "NET_GND (0V)"})
        val = validate_circuit(netlist)
        self.assertFalse(val["checks"]["no_short_circuit"])
        self.assertEqual(val["netlist_status"], "NETLIST_INVALID")

    def test_case_6_floating_resistor(self):
        """TEST 6: Floating resistor -> NETLIST_INVALID or warning with floating detection"""
        detections = [
            {
                "id": "R_FLOAT", "class": "resistor", "bbox": [100, 50, 200, 50],
                "hole1": "A30", "hole2": "A35", "value": 1000, "confidence": 0.95
            }
        ]

        netlist = build_netlist_from_detections(detections)
        val = validate_circuit(netlist)
        self.assertFalse(val["checks"]["no_floating_terminals"])
        self.assertFalse(val["checks"]["no_floating_components"])

    def test_case_7_wire_joining_two_breadboard_rows(self):
        """TEST 7: Wire joining two breadboard rows -> one merged electrical net"""
        components = [
            {"id": "W1", "type": "wire", "hole1": "A10", "hole2": "A20", "confidence": 0.95},
            {"id": "R1", "type": "resistor", "hole1": "B10", "hole2": "B30", "confidence": 0.95},
            {"id": "R2", "type": "resistor", "hole1": "B20", "hole2": "B40", "confidence": 0.95}
        ]

        conn = build_electrical_connectivity(components)
        r1 = next(c for c in conn["components"] if c["id"] == "R1")
        r2 = next(c for c in conn["components"] if c["id"] == "R2")

        # Col 10 and Col 20 merged by W1 -> R1 node1 and R2 node1 must match
        self.assertEqual(r1["node1"], r2["node1"])

if __name__ == "__main__":
    unittest.main()
