"""
SmartBreadboard 3D — Numerical Consistency Audit Test Suite
Verifies rigorous electrical laws on MNA solver output:
1. KCL (Kirchhoff's Current Law) at all circuit nodes
2. KVL (Kirchhoff's Voltage Law) around loops
3. Component Power: P = V * I for all components
4. Power Conservation: sum(P_consumed) == sum(P_supplied)
5. Series Current Equality: I(R1) == I(LED1) == I(Source)
"""

import unittest
from core.circuit_model import build_netlist_from_detections
from circuit_solver.dc_solver import run_dc_analysis
from circuit_solver.results import format_solver_result

class TestNumericalConsistencyAudit(unittest.TestCase):

    def test_series_r_led_numerical_consistency(self):
        """
        Verify: 5V -> R1 (220 ohm) -> LED1 (Vf=2.0V, r_bulk=10 ohm) -> GND
        Checks:
        - VCC = 5V, GND = 0V
        - V_R1 + V_LED1 == 5V (KVL)
        - I_R1 == I_LED1 (Series current equality)
        - P_R1 == V_R1 * I_R1
        - P_LED1 == V_LED1 * I_LED1
        - P_total == 5V * I_total (Power conservation)
        """
        detections = [
            {
                "id": "W1", "class": "wire", "hole1": "VCC_TOP_10", "hole2": "A10", "confidence": 0.95
            },
            {
                "id": "R1", "class": "resistor", "hole1": "B10", "hole2": "B15", "value": 220, "confidence": 0.95
            },
            {
                "id": "LED1", "class": "led", "hole1": "C15", "hole2": "C20", "confidence": 0.95
            },
            {
                "id": "W2", "class": "wire", "hole1": "D20", "hole2": "GND_BOT_20", "confidence": 0.95
            }
        ]

        netlist = build_netlist_from_detections(detections, power_source={"voltage": 5.0, "positive_node": "NET_VCC (+5V)", "negative_node": "NET_GND (0V)"})
        res = run_dc_analysis(netlist)
        formatted = format_solver_result(res, netlist=netlist)

        self.assertTrue(formatted["success"])
        self.assertEqual(formatted["status"], "SOLVED")

        # 1. Node Voltages Check
        v_vcc = formatted["node_voltages"]["NET_VCC (+5V)"]
        v_gnd = formatted["node_voltages"]["NET_GND (0V)"]
        v_mid = formatted["node_voltages"]["NET1"]

        self.assertAlmostEqual(v_vcc, 5.0, places=3)
        self.assertAlmostEqual(v_gnd, 0.0, places=3)

        # 2. KVL Check: V_R1 + V_LED1 == VCC - GND
        r1_meas = formatted["measurements"]["R1"]
        led_meas = formatted["measurements"]["LED1"]

        v_r1 = abs(r1_meas["voltageDrop"])
        v_led = abs(led_meas["voltageDrop"])

        self.assertAlmostEqual(v_r1 + v_led, 5.0, places=3, msg="KVL violation: V_R1 + V_LED != 5V")

        # 3. Series Current Equality Check: I_R1 == I_LED1 == I_source
        i_r1 = r1_meas["current"]
        i_led = led_meas["current"]
        i_source = formatted["total_current_mA"] / 1000.0

        self.assertAlmostEqual(i_r1, i_led, places=5, msg=f"Series current mismatch: I_R1={i_r1} != I_LED={i_led}")
        self.assertAlmostEqual(i_r1, i_source, places=5, msg=f"Source current mismatch: I_R1={i_r1} != I_source={i_source}")

        # 4. Component Power Check: P = V * I
        p_r1 = r1_meas["power"]
        p_led = led_meas["power"]

        self.assertAlmostEqual(p_r1, v_r1 * i_r1, places=5, msg=f"P != V*I for R1: {p_r1} vs {v_r1 * i_r1}")
        self.assertAlmostEqual(p_led, v_led * i_led, places=5, msg=f"P != V*I for LED1: {p_led} vs {v_led * i_led}")

        # 5. Power Conservation Check: sum(P_consumed) == sum(P_supplied)
        p_consumed_total = p_r1 + p_led
        p_supplied_total = 5.0 * i_source

        self.assertAlmostEqual(p_consumed_total, p_supplied_total, places=4, msg="Power conservation violation")

    def test_series_resistors_kcl_kvl(self):
        """
        Verify: 10V -> R1 (1k) -> R2 (2k) -> R3 (2k) -> GND
        Checks:
        - I_R1 == I_R2 == I_R3 == 2mA
        - V_R1 + V_R2 + V_R3 == 10V
        - P_total == 10V * 2mA == 20mW
        """
        detections = [
            {"id": "W1", "class": "wire", "hole1": "VCC_TOP_10", "hole2": "A10"},
            {"id": "R1", "class": "resistor", "hole1": "B10", "hole2": "B15", "value": 1000},
            {"id": "R2", "class": "resistor", "hole1": "C15", "hole2": "C20", "value": 2000},
            {"id": "R3", "class": "resistor", "hole1": "D20", "hole2": "D25", "value": 2000},
            {"id": "W2", "class": "wire", "hole1": "E25", "hole2": "GND_BOT_25"}
        ]

        netlist = build_netlist_from_detections(detections, power_source={"voltage": 10.0, "positive_node": "NET_VCC (+5V)", "negative_node": "NET_GND (0V)"})
        res = run_dc_analysis(netlist)
        formatted = format_solver_result(res, netlist=netlist)

        self.assertTrue(formatted["success"])
        r1_m = formatted["measurements"]["R1"]
        r2_m = formatted["measurements"]["R2"]
        r3_m = formatted["measurements"]["R3"]

        # KCL: Series current equality (10V / 5k = 2mA)
        expected_i = 10.0 / 5000.0
        self.assertAlmostEqual(r1_m["current"], expected_i, places=5)
        self.assertAlmostEqual(r2_m["current"], expected_i, places=5)
        self.assertAlmostEqual(r3_m["current"], expected_i, places=5)

        # KVL: V_R1 + V_R2 + V_R3 == 10V
        v_total = abs(r1_m["voltageDrop"]) + abs(r2_m["voltageDrop"]) + abs(r3_m["voltageDrop"])
        self.assertAlmostEqual(v_total, 10.0, places=3)

        # P = V*I for all
        for m in [r1_m, r2_m, r3_m]:
            self.assertAlmostEqual(m["power"], abs(m["voltageDrop"]) * m["current"], places=5)

        # Power conservation
        p_consumed = r1_m["power"] + r2_m["power"] + r3_m["power"]
        p_supplied = 10.0 * expected_i
        self.assertAlmostEqual(p_consumed, p_supplied, places=4)

    def test_parallel_resistors_kcl_kvl(self):
        """
        Verify: 5V -> (R1: 1k || R2: 1k) -> GND
        Checks:
        - V_R1 == V_R2 == 5V
        - I_R1 == 5mA, I_R2 == 5mA, I_total == 10mA (KCL at node)
        - P_R1 == 25mW, P_R2 == 25mW, P_total == 50mW
        """
        detections = [
            {"id": "W1", "class": "wire", "hole1": "VCC_TOP_10", "hole2": "A10"},
            {"id": "R1", "class": "resistor", "hole1": "B10", "hole2": "B20", "value": 1000},
            {"id": "R2", "class": "resistor", "hole1": "C10", "hole2": "C20", "value": 1000},
            {"id": "W2", "class": "wire", "hole1": "D20", "hole2": "GND_BOT_20"}
        ]

        netlist = build_netlist_from_detections(detections, power_source={"voltage": 5.0, "positive_node": "NET_VCC (+5V)", "negative_node": "NET_GND (0V)"})
        res = run_dc_analysis(netlist)
        formatted = format_solver_result(res, netlist=netlist)

        self.assertTrue(formatted["success"])
        r1_m = formatted["measurements"]["R1"]
        r2_m = formatted["measurements"]["R2"]

        # KVL: V_R1 == V_R2 == 5V
        self.assertAlmostEqual(abs(r1_m["voltageDrop"]), 5.0, places=3)
        self.assertAlmostEqual(abs(r2_m["voltageDrop"]), 5.0, places=3)

        # KCL: I_total = I_R1 + I_R2 = 5mA + 5mA = 10mA
        self.assertAlmostEqual(r1_m["current"], 0.005, places=5)
        self.assertAlmostEqual(r2_m["current"], 0.005, places=5)
        self.assertAlmostEqual(formatted["total_current_mA"], 10.0, places=2)

        # Power conservation
        p_consumed = r1_m["power"] + r2_m["power"]
        p_supplied = 5.0 * 0.010
        self.assertAlmostEqual(p_consumed, p_supplied, places=4)

if __name__ == "__main__":
    unittest.main()
