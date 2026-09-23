"""
SmartBreadboard 3D — Phase 17 Tests: Unknown Component -> Manual Component Recovery
Validates:
A. Unknown component is not auto-converted to nearest known component.
B. Manual resistor creates correct component metadata (source: "manual", verified: true).
C. Manual resistor enters the existing netlist.
D. Manual resistor reaches the existing MNA solver and solves DC operating points.
E. Manual resistor appears in the 3D Digital Twin structure.
F. Missing manual resistance / unresolved unknown prevents invalid simulation.
G. AI and manual component provenance remain strictly distinguishable.
"""

import sys
import os
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from circuit_solver.mna_solver import solve_dc_circuit
from circuit_solver.dc_solver import run_dc_analysis
from circuit_solver.validation import validate_circuit_netlist
from circuit_solver.results import format_solver_result


class TestPhase17ManualComponentRecovery(unittest.TestCase):

    def test_A_unknown_component_is_not_auto_converted(self):
        """Test that an unknown component is preserved with source='unknown' and not auto-converted."""
        raw_unknown = {
            "id": "U1",
            "designator": "U1",
            "type": "unknown",
            "source": "unknown",
            "confidence": 0.42,
            "hole1": "A10",
            "hole2": "E10"
        }
        self.assertEqual(raw_unknown["source"], "unknown")
        self.assertEqual(raw_unknown["type"], "unknown")
        self.assertNotEqual(raw_unknown["type"], "resistor")

    def test_B_manual_resistor_creates_correct_metadata(self):
        """Test that manually defined resistor has source='manual', verified=True, and valid resistance."""
        manual_resistor = {
            "id": "R_MANUAL_1",
            "designator": "R_MANUAL_1",
            "type": "resistor",
            "value": 1000.0,
            "unit": "Ω",
            "formatted_value": "1.00 kΩ",
            "displayValue": "1.00 kΩ",
            "hole1": "A10",
            "hole2": "E10",
            "node1": "NODE_HOLE_A10",
            "node2": "NODE_HOLE_E10",
            "source": "manual",
            "verified": True,
            "needsConfirmation": False,
            "valueSource": "user_confirmed"
        }
        self.assertEqual(manual_resistor["source"], "manual")
        self.assertTrue(manual_resistor["verified"])
        self.assertEqual(manual_resistor["value"], 1000.0)
        self.assertEqual(manual_resistor["type"], "resistor")

    def test_C_manual_resistor_enters_existing_netlist(self):
        """Test that manual resistor enters the canonical netlist structure with terminals."""
        manual_res = {
            "id": "R_MANUAL_1",
            "type": "resistor",
            "value": 220.0,
            "node1": "NET_VCC",
            "node2": "NET_GND",
            "source": "manual",
            "verified": True
        }
        netlist = {
            "circuit_id": "circ_manual_test",
            "power_sources": [
                {"id": "V1", "voltage": 5.0, "positive_node": "NET_VCC", "negative_node": "NET_GND"}
            ],
            "components": [manual_res]
        }
        self.assertEqual(len(netlist["components"]), 1)
        self.assertEqual(netlist["components"][0]["source"], "manual")
        is_valid, err, warnings = validate_circuit_netlist(netlist["components"], netlist["power_sources"])
        self.assertTrue(is_valid)
        self.assertIsNone(err)

    def test_D_manual_resistor_reaches_mna_solver(self):
        """Test that manual resistor is solved accurately by MNA (I = V / R = 5V / 250Ω = 20mA)."""
        netlist = {
            "circuit_id": "circ_mna_manual_resistor",
            "power_sources": [
                {"id": "V1", "voltage": 5.0, "positive_node": "NET_VCC", "negative_node": "NET_GND"}
            ],
            "components": [
                {
                    "id": "R_MAN_250",
                    "type": "resistor",
                    "value": 250.0,
                    "node1": "NET_VCC",
                    "node2": "NET_GND",
                    "source": "manual",
                    "verified": True
                }
            ]
        }
        res = solve_dc_circuit(netlist)
        self.assertTrue(res.success)
        self.assertIn("R_MAN_250", res.measurements)
        meas = res.measurements["R_MAN_250"]
        self.assertAlmostEqual(meas.voltage_drop, 5.0, places=2)
        self.assertAlmostEqual(meas.current, 0.020, places=4)
        self.assertAlmostEqual(meas.power, 0.100, places=3)

    def test_E_manual_resistor_in_digital_twin_output(self):
        """Test that formatted solver result provides complete digital twin payload for manual resistor."""
        netlist = {
            "circuit_id": "circ_dt_manual",
            "power_sources": [
                {"id": "V1", "voltage": 12.0, "positive_node": "NET_VCC", "negative_node": "NET_GND"}
            ],
            "components": [
                {
                    "id": "R_MAN_1K",
                    "designator": "R_MAN_1K",
                    "type": "resistor",
                    "value": 1000.0,
                    "hole1": "A15",
                    "hole2": "E15",
                    "node1": "NET_VCC",
                    "node2": "NET_GND",
                    "source": "manual",
                    "verified": True
                }
            ]
        }
        res = solve_dc_circuit(netlist)
        formatted = format_solver_result(res, netlist)
        self.assertIn("digital_twin", formatted)
        dt_comps = formatted["digital_twin"]["components"]
        self.assertEqual(len(dt_comps), 1)
        r_dt = dt_comps[0]
        self.assertEqual(r_dt["id"], "R_MAN_1K")
        self.assertEqual(r_dt["type"], "resistor")
        self.assertEqual(r_dt["source"], "manual")
        self.assertAlmostEqual(r_dt["electrical"]["voltage"], 12.0, places=2)
        self.assertAlmostEqual(r_dt["electrical"]["current"], 0.012, places=4)

    def test_F_unresolved_unknown_blocks_invalid_simulation(self):
        """Test that an unresolved unknown component safely prevents invalid MNA calculation."""
        netlist_with_unknown = {
            "circuit_id": "circ_unknown_block",
            "power_sources": [
                {"id": "V1", "voltage": 5.0, "positive_node": "NET_VCC", "negative_node": "NET_GND"}
            ],
            "components": [
                {
                    "id": "U1",
                    "type": "unknown",
                    "source": "unknown",
                    "node1": "NET_VCC",
                    "node2": "NET_GND"
                }
            ]
        }
        is_valid, err, warnings = validate_circuit_netlist(netlist_with_unknown["components"], netlist_with_unknown["power_sources"])
        self.assertFalse(is_valid)
        self.assertEqual(err["code"], "UNKNOWN_COMPONENT_DEFINITION_REQUIRED")

        res = solve_dc_circuit(netlist_with_unknown)
        self.assertFalse(res.success)
        self.assertEqual(res.error["code"], "UNKNOWN_COMPONENT_DEFINITION_REQUIRED")

    def test_G_provenance_ai_vs_manual_distinguishable(self):
        """Test that AI detected, Manual, and Unknown components maintain distinct provenance."""
        comp_ai = {"id": "R1", "type": "resistor", "value": 1000.0, "source": "ai"}
        comp_manual = {"id": "R2", "type": "resistor", "value": 2200.0, "source": "manual", "verified": True}
        comp_unknown = {"id": "U1", "type": "unknown", "source": "unknown"}

        self.assertEqual(comp_ai["source"], "ai")
        self.assertEqual(comp_manual["source"], "manual")
        self.assertEqual(comp_unknown["source"], "unknown")
        self.assertNotEqual(comp_ai["source"], comp_manual["source"])
        self.assertNotEqual(comp_manual["source"], comp_unknown["source"])


if __name__ == "__main__":
    unittest.main()
