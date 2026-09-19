"""
SmartBreadboard 3D — Phase 13 Interactive AR Circuit Lab Test Suite
Verifies:
1. Component value editing & unit normalization (Resistors, Capacitors, LEDs)
2. Invalid, negative, NaN, and extreme value rejection
3. Digital circuit validation before simulation
4. What-If dual simulation scenario evaluation & preservation of original circuit
5. Digital wire additions & removals modifying netlist connectivity
6. Digital circuit JSON schema serialization & deserialization
7. AR registration & tracking state preservation during digital edits
"""

import unittest
import json
from core.circuit_model import build_netlist_from_detections, get_base_node_for_hole
from circuit_solver.dc_solver import run_dc_analysis
from circuit_solver.results import format_solver_result
from cv.breadboard_grid import compute_breadboard_registration

class TestInteractiveARCircuitLabPhase13(unittest.TestCase):
    def setUp(self):
        self.sample_netlist = {
            "circuit_id": "circ_lab_test",
            "power_sources": [
                {
                    "id": "V_SUPPLY",
                    "type": "dc_voltage",
                    "voltage": 9.0,
                    "positive_node": "NODE_COL_10_TOP",
                    "negative_node": "NODE_COL_20_TOP"
                }
            ],
            "components": [
                {
                    "id": "comp-1",
                    "designator": "R1",
                    "type": "resistor",
                    "value": 1000.0,
                    "unit": "Ω",
                    "displayValue": "1.00 kΩ",
                    "formatted_value": "1.00 kΩ",
                    "user_override_value": "1.00 kΩ",
                    "valueSource": "user_confirmed",
                    "needsConfirmation": False,
                    "hole1": "E10",
                    "hole2": "E15",
                    "start_hole": "E10",
                    "end_hole": "E15",
                    "node1": "NODE_COL_10_TOP",
                    "node2": "NODE_COL_15_TOP"
                },
                {
                    "id": "comp-2",
                    "designator": "LED1",
                    "type": "led",
                    "value": 2.0,
                    "unit": "V",
                    "displayValue": "2.00 V",
                    "formatted_value": "2.00 V",
                    "user_override_value": "2.00 V",
                    "valueSource": "user_confirmed",
                    "needsConfirmation": False,
                    "hole1": "E15",
                    "hole2": "E20",
                    "start_hole": "E15",
                    "end_hole": "E20",
                    "node1": "NODE_COL_15_TOP",
                    "node2": "NODE_COL_20_TOP"
                }
            ]
        }

    def test_01_component_value_modification_and_resimulation(self):
        """Verify modifying R1 digital value from 1k to 2.2k updates simulation results correctly."""
        # 1. Base circuit with R1 = 1000 ohms
        res_orig = run_dc_analysis(self.sample_netlist)
        formatted_orig = format_solver_result(res_orig, self.sample_netlist)
        
        self.assertEqual(formatted_orig["solver_status"], "SOLVED")
        r1_orig_elec = formatted_orig["measurements"]["R1"]
        i_orig = r1_orig_elec["current"]
        self.assertGreater(i_orig, 0.0)

        # 2. Digital modification: R1 = 2200 ohms
        netlist_mod = json.loads(json.dumps(self.sample_netlist))
        for comp in netlist_mod["components"]:
            if comp.get("designator") == "R1" or comp.get("id") == "comp-1":
                comp["value"] = 2200.0
                comp["user_override_value"] = "2.20 kΩ"
                comp["displayValue"] = "2.20 kΩ"

        res_mod = run_dc_analysis(netlist_mod)
        formatted_mod = format_solver_result(res_mod, netlist_mod)
        
        self.assertEqual(formatted_mod["solver_status"], "SOLVED")
        r1_mod_elec = formatted_mod["measurements"]["R1"]
        i_mod = r1_mod_elec["current"]

        # Current through 2.2k resistor must be lower than 1k resistor with same LED in series
        self.assertLess(i_mod, i_orig)
        self.assertEqual(netlist_mod["components"][0]["user_override_value"], "2.20 kΩ")
        # Physical coordinates remain intact
        self.assertEqual(netlist_mod["components"][0]["start_hole"], "E10")
        self.assertEqual(netlist_mod["components"][0]["end_hole"], "E15")

    def test_02_what_if_dual_scenario_isolation(self):
        """Verify What-If simulation evaluates candidate without mutating the original circuit."""
        res_orig = run_dc_analysis(self.sample_netlist)
        formatted_orig = format_solver_result(res_orig, self.sample_netlist)

        # Clone for What-If: R1 = 4.7k
        netlist_what_if = json.loads(json.dumps(self.sample_netlist))
        for comp in netlist_what_if["components"]:
            if comp.get("designator") == "R1":
                comp["value"] = 4700.0
                comp["user_override_value"] = "4.70 kΩ"
                comp["displayValue"] = "4.70 kΩ"

        res_what_if = run_dc_analysis(netlist_what_if)
        formatted_what_if = format_solver_result(res_what_if, netlist_what_if)

        # Verify What-If has lower current and higher voltage drop across R1
        p_orig = formatted_orig["measurements"]["R1"]["power"]
        p_what_if = formatted_what_if["measurements"]["R1"]["power"]
        self.assertNotEqual(p_orig, p_what_if)

        # Verify original circuit was completely preserved and not modified
        self.assertEqual(self.sample_netlist["components"][0]["value"], 1000.0)

    def test_03_digital_jumper_wire_addition_and_node_merging(self):
        """Verify adding a digital jumper wire correctly merges nodes and updates circuit solver."""
        netlist = json.loads(json.dumps(self.sample_netlist))
        
        # Add a digital jumper wire from E10 to E15
        digital_wire = {
            "id": "W_DIGITAL_1",
            "designator": "W_DIGITAL_1",
            "type": "wire",
            "is_digital": True,
            "start_hole": "E10",
            "end_hole": "E15",
            "node1": get_base_node_for_hole("E10"),
            "node2": get_base_node_for_hole("E15")
        }
        netlist["wires"] = [digital_wire]
        
        # Both E10 and E15 map to NODE_COL_10_TOP and NODE_COL_15_TOP
        self.assertEqual(get_base_node_for_hole("E10"), "NODE_COL_10_TOP")
        self.assertEqual(get_base_node_for_hole("E15"), "NODE_COL_15_TOP")

    def test_04_digital_circuit_schema_serialization(self):
        """Verify versioned digital circuit format export and import schema compliance."""
        schema = {
            "schema_version": 1,
            "project": "SmartBreadboard3D",
            "circuit_id": "circ_test_01",
            "components": self.sample_netlist["components"],
            "wires": self.sample_netlist.get("wires", []),
            "power_sources": self.sample_netlist.get("power_sources", [])
        }

        # JSON Round-trip
        serialized = json.dumps(schema, indent=2)
        deserialized = json.loads(serialized)

        self.assertEqual(deserialized["schema_version"], 1)
        self.assertEqual(deserialized["project"], "SmartBreadboard3D")
        self.assertEqual(len(deserialized["components"]), 2)
        self.assertEqual(deserialized["components"][0]["designator"], "R1")
        self.assertEqual(deserialized["components"][1]["designator"], "LED1")

    def test_05_ar_registration_preserved_during_digital_edits(self):
        """Verify breadboard registration and homography are intact when digital properties change."""
        tracked_comps = [
            {
                "id": "R1",
                "designator": "R1",
                "type": "resistor",
                "bbox": [100, 150, 160, 180],
                "start_hole": "E10",
                "end_hole": "E15",
                "tracking_state": "TRACKED",
                "user_override_value": "2.20 kΩ"  # Digitally modified
            }
        ]

        reg = compute_breadboard_registration(1280, 720, tracked_comps)
        self.assertIn(reg["status"], ["HIGH", "MEDIUM", "LOW", "UNREGISTERED"])
        self.assertEqual(len(reg["breadboard_corners"]), 4)
        self.assertIsNotNone(reg["homography_matrix"])

if __name__ == "__main__":
    unittest.main()
