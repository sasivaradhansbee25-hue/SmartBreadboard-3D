"""
SmartBreadboard 3D — Active Circuit Intelligence Backend Tests (Phase 28)
Comprehensive deterministic test suite covering:
IC tests:
1. Known supported op-amp model
2. Unknown IC
3. Invalid pin mapping
4. Missing supply
5. Invalid pin connection
Non-Inverting:
6. Topology recognition
7. Gain
8. Gain dB
9. Phase
10. Output voltage
Inverting:
11. Topology recognition
12. Gain
13. Phase
14. Output voltage
Follower:
15. Topology recognition
16. Unity gain
17. Phase
Operating state:
18. Saturation
19. Invalid supply
20. Solver failure
AC:
21. Frequency response
22. Transfer function
23. Dynamic resistor change
24. Dynamic feedback change
"""

import unittest
import math
from backend.circuit_solver.ic_registry import (
    IC_REGISTRY,
    get_ic_definition,
    resolve_opamp_terminals,
    validate_opamp_supplies
)
from backend.circuit_solver.complex_mna import solve_ac_frequency_point
from backend.circuit_solver.active_circuit_analyzer import (
    inspect_active_topology,
    analyze_active_circuit
)


class TestPhase28ActiveCircuitIntelligence(unittest.TestCase):

    # -------------------------------------------------------------------------
    # IC TESTS (1-5)
    # -------------------------------------------------------------------------

    # 1. Known supported op-amp model
    def test_1_known_supported_models(self):
        models = ["LM741", "LM358", "TL072", "NE5532", "OP07", "IDEAL_OPAMP"]
        for m in models:
            defn = get_ic_definition(m)
            self.assertIsNotNone(defn, f"Model {m} must be in IC registry")
            self.assertIn("pinout", defn)
            self.assertIn("electrical_specs", defn)
            self.assertIn("model_type", defn)

    # 2. Unknown IC
    def test_2_unknown_ic_rejection(self):
        defn = get_ic_definition("UNKNOWN_CHIP_999")
        self.assertIsNone(defn, "Unknown IC part number must return None")

        comp = {"id": "U1", "model": "UNKNOWN_OPAMP_XYZ", "pins": {"3": "N1", "2": "N2", "6": "N3"}}
        res = resolve_opamp_terminals(comp)
        self.assertFalse(res["success"])
        self.assertEqual(res["status"], "UNKNOWN_IC")

    # 3. Invalid pin mapping
    def test_3_invalid_pin_mapping(self):
        # Missing inverting pin
        comp = {"id": "U1", "model": "LM741", "pins": {"3": "NODE_VIN", "6": "NODE_VOUT"}}
        res = resolve_opamp_terminals(comp)
        self.assertFalse(res["success"])
        self.assertEqual(res["status"], "INVALID_PIN_MAPPING")
        self.assertIn("inverting (-)", res["missing_pins"])

    # 4. Missing supply
    def test_4_missing_supply(self):
        # Real IC LM741 without supply rails connected
        netlist = {
            "components": [
                {"id": "R_F", "type": "resistor", "node1": "NODE_VOUT", "node2": "NODE_INV", "value": 10000.0},
                {"id": "R_G", "type": "resistor", "node1": "NODE_INV", "node2": "NODE_GND", "value": 10000.0}
            ],
            "ics": [
                {
                    "id": "U1",
                    "model": "LM741",
                    "terminals": {
                        "in_pos": "NODE_VIN",
                        "in_neg": "NODE_INV",
                        "output": "NODE_VOUT"
                        # v_plus and v_minus missing
                    }
                }
            ],
            "power_sources": [
                {"id": "V_IN", "type": "ac_voltage", "positive_node": "NODE_VIN", "negative_node": "NODE_GND", "voltage": 1.0}
            ]
        }
        res = inspect_active_topology(netlist)
        self.assertEqual(res["status"], "INVALID_OPERATING_STATE")
        self.assertIn("Supply pins (V+, V-) are missing", res["error"])

    # 5. Invalid pin connection
    def test_5_invalid_pin_connection(self):
        # Feedback resistor connected to non-inverting input (+) instead of inverting (-)
        netlist = {
            "components": [
                {"id": "R_F", "type": "resistor", "node1": "NODE_VOUT", "node2": "NODE_VIN", "value": 10000.0}
            ],
            "ics": [
                {
                    "id": "U1",
                    "model": "LM741",
                    "terminals": {
                        "in_pos": "NODE_VIN",
                        "in_neg": "NODE_INV",
                        "output": "NODE_VOUT",
                        "v_plus": "NODE_VCC",
                        "v_minus": "NODE_VEE"
                    }
                }
            ],
            "power_sources": [
                {"id": "V_IN", "type": "ac_voltage", "positive_node": "NODE_VIN", "negative_node": "NODE_GND", "voltage": 1.0},
                {"id": "V_CC", "type": "dc_voltage", "positive_node": "NODE_VCC", "negative_node": "NODE_GND", "voltage": 15.0},
                {"id": "V_EE", "type": "dc_voltage", "positive_node": "NODE_GND", "negative_node": "NODE_VEE", "voltage": 15.0}
            ]
        }
        res = inspect_active_topology(netlist)
        self.assertEqual(res["status"], "UNSUPPORTED")

    # -------------------------------------------------------------------------
    # NON-INVERTING OP-AMP TESTS (6-10)
    # -------------------------------------------------------------------------

    def _get_non_inverting_netlist(self, rf=10000.0, rg=10000.0, vin=1.0):
        return {
            "components": [
                {"id": "R_F", "type": "resistor", "node1": "NODE_VOUT", "node2": "NODE_INV", "value": rf},
                {"id": "R_G", "type": "resistor", "node1": "NODE_INV", "node2": "NODE_GND", "value": rg}
            ],
            "ics": [
                {
                    "id": "U1",
                    "model": "LM741",
                    "terminals": {
                        "in_pos": "NODE_VIN",
                        "in_neg": "NODE_INV",
                        "output": "NODE_VOUT",
                        "v_plus": "NODE_VCC",
                        "v_minus": "NODE_VEE"
                    }
                }
            ],
            "power_sources": [
                {"id": "V_IN", "type": "ac_voltage", "positive_node": "NODE_VIN", "negative_node": "NODE_GND", "voltage": vin},
                {"id": "V_CC", "type": "dc_voltage", "positive_node": "NODE_VCC", "negative_node": "NODE_GND", "voltage": 15.0},
                {"id": "V_EE", "type": "dc_voltage", "positive_node": "NODE_GND", "negative_node": "NODE_VEE", "voltage": 15.0}
            ]
        }

    # 6. Non-Inverting Topology recognition
    def test_6_non_inverting_topology_recognition(self):
        topo = inspect_active_topology(self._get_non_inverting_netlist())
        self.assertEqual(topo["status"], "VERIFIED")
        self.assertEqual(topo["topology_type"], "OPAMP_NON_INVERTING")

    # 7. Non-Inverting Gain
    def test_7_non_inverting_gain(self):
        res = analyze_active_circuit(self._get_non_inverting_netlist(rf=10000.0, rg=10000.0))
        self.assertTrue(res["success"])
        # Expected Av = 1 + 10k/10k = 2.0
        self.assertAlmostEqual(res["gain"]["magnitude"], 2.0, delta=0.02)

    # 8. Non-Inverting Gain dB
    def test_8_non_inverting_gain_db(self):
        res = analyze_active_circuit(self._get_non_inverting_netlist(rf=10000.0, rg=10000.0))
        # 20 * log10(2.0) = 6.02 dB
        self.assertAlmostEqual(res["gain"]["db"], 6.02, delta=0.05)

    # 9. Non-Inverting Phase
    def test_9_non_inverting_phase(self):
        res = analyze_active_circuit(self._get_non_inverting_netlist())
        self.assertAlmostEqual(res["phase"]["degrees"], 0.0, delta=1.0)

    # 10. Non-Inverting Output voltage
    def test_10_non_inverting_output_voltage(self):
        res = analyze_active_circuit(self._get_non_inverting_netlist(vin=1.5))
        # Vout = Vin * Av = 1.5 * 2.0 = 3.0V
        vout_mag = res["voltages"]["vout"]["magnitude"]
        self.assertAlmostEqual(vout_mag, 3.0, delta=0.03)

    # -------------------------------------------------------------------------
    # INVERTING OP-AMP TESTS (11-14)
    # -------------------------------------------------------------------------

    def _get_inverting_netlist(self, rf=10000.0, rin=10000.0, vin=1.0):
        return {
            "components": [
                {"id": "R_IN", "type": "resistor", "node1": "NODE_VIN", "node2": "NODE_INV", "value": rin},
                {"id": "R_F", "type": "resistor", "node1": "NODE_INV", "node2": "NODE_VOUT", "value": rf}
            ],
            "ics": [
                {
                    "id": "U1",
                    "model": "TL072",
                    "terminals": {
                        "in_pos": "NODE_GND",
                        "in_neg": "NODE_INV",
                        "output": "NODE_VOUT",
                        "v_plus": "NODE_VCC",
                        "v_minus": "NODE_VEE"
                    }
                }
            ],
            "power_sources": [
                {"id": "V_IN", "type": "ac_voltage", "positive_node": "NODE_VIN", "negative_node": "NODE_GND", "voltage": vin},
                {"id": "V_CC", "type": "dc_voltage", "positive_node": "NODE_VCC", "negative_node": "NODE_GND", "voltage": 15.0},
                {"id": "V_EE", "type": "dc_voltage", "positive_node": "NODE_GND", "negative_node": "NODE_VEE", "voltage": 15.0}
            ]
        }

    # 11. Inverting Topology recognition
    def test_11_inverting_topology_recognition(self):
        topo = inspect_active_topology(self._get_inverting_netlist())
        self.assertEqual(topo["status"], "VERIFIED")
        self.assertEqual(topo["topology_type"], "OPAMP_INVERTING")

    # 12. Inverting Gain
    def test_12_inverting_gain(self):
        res = analyze_active_circuit(self._get_inverting_netlist(rf=10000.0, rin=10000.0))
        self.assertTrue(res["success"])
        # Expected |Av| = 10k/10k = 1.0
        self.assertAlmostEqual(res["gain"]["magnitude"], 1.0, delta=0.02)

    # 13. Inverting Phase
    def test_13_inverting_phase(self):
        res = analyze_active_circuit(self._get_inverting_netlist())
        # Phase inversion: approximately 180° or -180°
        phase = res["phase"]["degrees"]
        self.assertTrue(abs(phase - 180.0) < 2.0 or abs(phase + 180.0) < 2.0)

    # 14. Inverting Output voltage
    def test_14_inverting_output_voltage(self):
        res = analyze_active_circuit(self._get_inverting_netlist(vin=2.0))
        # Vout mag = 2.0V
        vout_mag = res["voltages"]["vout"]["magnitude"]
        self.assertAlmostEqual(vout_mag, 2.0, delta=0.03)

    # -------------------------------------------------------------------------
    # VOLTAGE FOLLOWER TESTS (15-17)
    # -------------------------------------------------------------------------

    def _get_follower_netlist(self, vin=1.0):
        return {
            "components": [
                {"id": "W_FB", "type": "wire", "node1": "NODE_VOUT", "node2": "NODE_INV"}
            ],
            "ics": [
                {
                    "id": "U1",
                    "model": "LM358",
                    "terminals": {
                        "in_pos": "NODE_VIN",
                        "in_neg": "NODE_INV",
                        "output": "NODE_VOUT",
                        "v_plus": "NODE_VCC",
                        "v_minus": "NODE_VEE"
                    }
                }
            ],
            "power_sources": [
                {"id": "V_IN", "type": "ac_voltage", "positive_node": "NODE_VIN", "negative_node": "NODE_GND", "voltage": vin},
                {"id": "V_CC", "type": "dc_voltage", "positive_node": "NODE_VCC", "negative_node": "NODE_GND", "voltage": 15.0},
                {"id": "V_EE", "type": "dc_voltage", "positive_node": "NODE_GND", "negative_node": "NODE_VEE", "voltage": 15.0}
            ]
        }

    # 15. Follower Topology recognition
    def test_15_follower_topology_recognition(self):
        topo = inspect_active_topology(self._get_follower_netlist())
        self.assertEqual(topo["status"], "VERIFIED")
        self.assertEqual(topo["topology_type"], "OPAMP_VOLTAGE_FOLLOWER")

    # 16. Follower Unity gain
    def test_16_follower_unity_gain(self):
        res = analyze_active_circuit(self._get_follower_netlist())
        self.assertTrue(res["success"])
        self.assertAlmostEqual(res["gain"]["magnitude"], 1.0, delta=0.01)
        self.assertAlmostEqual(res["gain"]["db"], 0.0, delta=0.05)

    # 17. Follower Phase
    def test_17_follower_phase(self):
        res = analyze_active_circuit(self._get_follower_netlist())
        self.assertAlmostEqual(res["phase"]["degrees"], 0.0, delta=1.0)

    # -------------------------------------------------------------------------
    # OPERATING STATE TESTS (18-20)
    # -------------------------------------------------------------------------

    # 18. Saturation
    def test_18_saturation(self):
        # Non-inverting with Vin = 10V, Av = 3 -> Vout = 30V > 15V supply rail -> SATURATED
        netlist = self._get_non_inverting_netlist(rf=20000.0, rg=10000.0, vin=10.0)
        res = analyze_active_circuit(netlist)
        self.assertEqual(res["operating_state"], "SATURATED")
        self.assertEqual(res["status"], "SATURATED")
        self.assertFalse(res["linear_result_valid"])

    # 19. Invalid supply
    def test_19_invalid_supply(self):
        # Supply voltage below min_supply_v (LM741 min is 5V; provide only 2V)
        netlist = self._get_non_inverting_netlist()
        netlist["power_sources"][1]["voltage"] = 1.0  # V_CC = 1V
        netlist["power_sources"][2]["voltage"] = 1.0  # V_EE = 1V -> total 2V < 5V min
        res = inspect_active_topology(netlist)
        self.assertEqual(res["status"], "INVALID_OPERATING_STATE")
        self.assertIn("Insufficient supply voltage", res["error"])

    # 20. Solver failure
    def test_20_solver_failure(self):
        # Corrupted netlist with empty or singular nodes
        corrupted = {
            "components": [],
            "ics": [
                {
                    "id": "U1",
                    "model": "LM741",
                    "terminals": {"in_pos": "N1", "in_neg": "N2", "output": "N3", "v_plus": "VCC", "v_minus": "GND"}
                }
            ],
            "power_sources": []
        }
        res = analyze_active_circuit(corrupted)
        self.assertFalse(res["success"])
        self.assertIn(res["status"], ["SOLVER_INVALID", "UNSUPPORTED"])

    # -------------------------------------------------------------------------
    # AC & DYNAMIC TESTS (21-24)
    # -------------------------------------------------------------------------

    # 21. Frequency response
    def test_21_frequency_response(self):
        res = analyze_active_circuit(self._get_non_inverting_netlist(), f_start=100.0, f_stop=100000.0, num_points=20)
        self.assertTrue(res["success"])
        freq_resp = res.get("frequency_response", [])
        self.assertGreater(len(freq_resp), 5)
        pt = freq_resp[0]
        self.assertIn("frequency_hz", pt)
        self.assertIn("gain_magnitude", pt)
        self.assertIn("gain_db", pt)
        self.assertIn("phase_deg", pt)

    # 22. Transfer function
    def test_22_transfer_function(self):
        res = analyze_active_circuit(self._get_non_inverting_netlist())
        tf = res.get("transfer_function", {})
        self.assertIn("gainMagnitude", tf)
        self.assertIn("h_real", tf)
        self.assertIn("formatted", tf)
        self.assertAlmostEqual(tf["gainMagnitude"], 2.0, delta=0.02)

    # 23. Dynamic resistor change
    def test_23_dynamic_resistor_change(self):
        # Non-inverting benchmark: Rf: 10k -> 20k -> Av changes 2 -> 3
        netlist = self._get_non_inverting_netlist(rf=10000.0, rg=10000.0)
        res1 = analyze_active_circuit(netlist)
        self.assertAlmostEqual(res1["gain"]["magnitude"], 2.0, delta=0.02)

        netlist["components"][0]["value"] = 20000.0
        res2 = analyze_active_circuit(netlist)
        self.assertAlmostEqual(res2["gain"]["magnitude"], 3.0, delta=0.02)

    # 24. Dynamic feedback change
    def test_24_dynamic_feedback_change(self):
        # Inverting benchmark: Rf: 10k -> 20k -> |Av| changes 1 -> 2
        netlist = self._get_inverting_netlist(rf=10000.0, rin=10000.0)
        res1 = analyze_active_circuit(netlist)
        self.assertAlmostEqual(res1["gain"]["magnitude"], 1.0, delta=0.02)

        netlist["components"][1]["value"] = 20000.0
        res2 = analyze_active_circuit(netlist)
        self.assertAlmostEqual(res2["gain"]["magnitude"], 2.0, delta=0.02)


if __name__ == "__main__":
    unittest.main()
