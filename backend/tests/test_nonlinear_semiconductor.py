"""
Tests for Phase 30: Non-Linear Semiconductor & Diode Dynamic Transient Modeling.
Verifies Shockley diode equations, derivative linearization, Newton-Raphson solver,
convergence failure handling, forward/reverse bias, LED limiter, half/full-wave rectifiers,
dynamic capacitance, overflow protection, and scientific metadata integrity.
"""

import unittest
import numpy as np
from typing import Dict, Any

from backend.circuit_solver.semiconductor_registry import (
    get_semiconductor_definition,
    SEMICONDUCTOR_REGISTRY,
    THERMAL_VOLTAGE_300K
)
from backend.circuit_solver.nonlinear_transient_mna import (
    DiodeNonlinearModel,
    solve_nonlinear_transient_mna
)
from backend.circuit_solver.semiconductor_behavior import (
    classify_semiconductor_topology,
    extract_semiconductor_metrics,
    analyze_semiconductor_circuit
)
from backend.circuit_solver.transient_behavior import analyze_transient_circuit


class TestNonlinearSemiconductor(unittest.TestCase):
    def setUp(self):
        self.default_diode = DiodeNonlinearModel(
            device_id="D1",
            anode_node="NODE_1",
            cathode_node="GND",
            model_name="1N4148",
            custom_params={"is_sat": 2.52e-9, "n": 1.752, "temperature": 300.0}
        )

    # TEST 1: Shockley diode current calculation
    def test_01_shockley_current(self):
        # At zero voltage, current should be 0.0
        i_0 = self.default_diode.evaluate_current(0.0)
        self.assertAlmostEqual(i_0, 0.0, places=9)

        # Under forward bias (0.6V), current should be positive and realistic (~mA range for 1N4148)
        i_fwd = self.default_diode.evaluate_current(0.65)
        self.assertGreater(i_fwd, 0.0001)
        self.assertLess(i_fwd, 1.0)

        # Under reverse bias (-2.0V), current should approach -Is
        i_rev = self.default_diode.evaluate_current(-2.0)
        self.assertLess(i_rev, 0.0)
        self.assertGreater(i_rev, -1e-7)

    # TEST 2: Diode derivative / conductance calculation
    def test_02_conductance_derivative(self):
        vd = 0.6
        g_d = self.default_diode.evaluate_conductance(vd)
        self.assertGreater(g_d, 0.0)

        # Numerical finite-difference check
        eps = 1e-6
        i_plus = self.default_diode.evaluate_current(vd + eps)
        i_minus = self.default_diode.evaluate_current(vd - eps)
        g_num = (i_plus - i_minus) / (2 * eps)
        self.assertAlmostEqual(g_d, g_num, delta=g_num * 0.01)

    # TEST 3: Newton-Raphson convergence
    def test_03_newton_raphson_convergence(self):
        # 5V step -> 1k resistor -> Diode -> GND
        netlist = {
            "nodes": [
                {"id": "NODE_PWR", "label": "VCC"},
                {"id": "NODE_DIODE", "label": "Anode"},
                {"id": "GND", "label": "GND"}
            ],
            "components": [
                {"id": "R1", "type": "resistor", "value": 1000.0, "node1": "NODE_PWR", "node2": "NODE_DIODE"},
                {"id": "D1", "type": "diode", "model": "1N4148", "node1": "NODE_DIODE", "node2": "GND"}
            ]
        }
        res = solve_nonlinear_transient_mna(
            netlist=netlist,
            t_start=0.0,
            t_stop=0.001,
            dt=0.0001,
            source_config={"type": "step", "final_value": 5.0, "step_time": 0.0, "node_pos": "NODE_PWR", "node_neg": "GND"}
        )
        self.assertEqual(res["status"], "VERIFIED")
        self.assertTrue(res["solver"]["converged"])
        self.assertLessEqual(res["solver"]["max_iterations_used"], 50)

    # TEST 4: Newton-Raphson convergence failure handling
    def test_04_newton_raphson_failure(self):
        netlist = {
            "nodes": [
                {"id": "NODE_PWR", "label": "VCC"},
                {"id": "NODE_DIODE", "label": "Anode"},
                {"id": "GND", "label": "GND"}
            ],
            "components": [
                {"id": "R1", "type": "resistor", "value": 1.0, "node1": "NODE_PWR", "node2": "NODE_DIODE"},
                {"id": "D1", "type": "diode", "model": "1N4148", "node1": "NODE_DIODE", "node2": "GND"}
            ]
        }
        # Force failure with max_iterations=1 and tight tolerance
        res = solve_nonlinear_transient_mna(
            netlist=netlist,
            t_start=0.0,
            t_stop=0.001,
            dt=0.0001,
            source_config={"type": "step", "final_value": 20.0, "step_time": 0.0, "node_pos": "NODE_PWR", "node_neg": "GND"},
            nonlinear_config={"max_iterations": 1, "voltage_tolerance": 1e-12, "damping_factor": 1.0}
        )
        self.assertEqual(res["status"], "ERROR")
        self.assertEqual(res["error_code"], "NONLINEAR_CONVERGENCE_FAILED")
        self.assertFalse(res["solver"]["converged"])

    # TEST 5: Forward-biased diode circuit
    def test_05_forward_biased_diode(self):
        netlist = {
            "nodes": [
                {"id": "NODE_PWR", "label": "VCC"},
                {"id": "NODE_DIODE", "label": "Anode"},
                {"id": "GND", "label": "GND"}
            ],
            "components": [
                {"id": "R1", "type": "resistor", "value": 1000.0, "node1": "NODE_PWR", "node2": "NODE_DIODE"},
                {"id": "D1", "type": "diode", "model": "1N4148", "node1": "NODE_DIODE", "node2": "GND"}
            ]
        }
        res = analyze_semiconductor_circuit(
            netlist=netlist,
            source_config={"type": "step", "final_value": 5.0, "step_time": 0.0, "node_pos": "NODE_PWR", "node_neg": "GND"},
            simulation_config={"t_stop": 0.002, "dt": 0.0001}
        )
        self.assertEqual(res["status"], "VERIFIED")
        self.assertEqual(res["circuit_type"], "DIODE_FORWARD_BIAS")
        self.assertEqual(res["metrics"]["operating_state"], "FORWARD_CONDUCTING")
        # Diode forward drop should be in 0.5V - 0.8V range
        self.assertGreater(res["metrics"]["peak_forward_voltage"], 0.5)
        self.assertLess(res["metrics"]["peak_forward_voltage"], 0.85)

    # TEST 6: Reverse-biased diode
    def test_06_reverse_biased_diode(self):
        netlist = {
            "nodes": [
                {"id": "NODE_PWR", "label": "VCC"},
                {"id": "NODE_DIODE", "label": "Cathode"},
                {"id": "GND", "label": "GND"}
            ],
            "components": [
                {"id": "R1", "type": "resistor", "value": 1000.0, "node1": "NODE_PWR", "node2": "NODE_DIODE"},
                # Cathode is NODE_PWR side, Anode is GND -> reverse biased when PWR is +5V
                {"id": "D1", "type": "diode", "model": "1N4148", "node1": "GND", "node2": "NODE_DIODE"}
            ]
        }
        res = analyze_semiconductor_circuit(
            netlist=netlist,
            source_config={"type": "step", "final_value": 5.0, "step_time": 0.0, "node_pos": "NODE_PWR", "node_neg": "GND"},
            simulation_config={"t_stop": 0.002, "dt": 0.0001}
        )
        self.assertEqual(res["status"], "VERIFIED")
        self.assertIn(res["circuit_type"], ["DIODE_REVERSE_BIAS", "DIODE_FORWARD_BIAS", "GENERIC_NONLINEAR_CIRCUIT"])
        self.assertEqual(res["metrics"]["operating_state"], "REVERSE_BIASED")
        # Current should be negligible (< 1 uA)
        self.assertLess(abs(res["metrics"]["peak_forward_current"]), 1e-6)

    # TEST 7: LED current-limiter
    def test_07_led_current_limiter(self):
        netlist = {
            "nodes": [
                {"id": "NODE_PWR", "label": "VCC"},
                {"id": "NODE_LED", "label": "LED_A"},
                {"id": "GND", "label": "GND"}
            ],
            "components": [
                {"id": "R1", "type": "resistor", "value": 330.0, "node1": "NODE_PWR", "node2": "NODE_LED"},
                {"id": "LED1", "type": "led", "model": "LED_RED", "node1": "NODE_LED", "node2": "GND"}
            ]
        }
        res = analyze_semiconductor_circuit(
            netlist=netlist,
            source_config={"type": "step", "final_value": 5.0, "step_time": 0.0, "node_pos": "NODE_PWR", "node_neg": "GND"},
            simulation_config={"t_stop": 0.002, "dt": 0.0001}
        )
        self.assertEqual(res["status"], "VERIFIED")
        self.assertEqual(res["circuit_type"], "LED_CURRENT_LIMITER")
        self.assertEqual(res["metrics"]["operating_state"], "FORWARD_CONDUCTING")
        self.assertEqual(res["visualization_state"], "LED_CONDUCTION")
        # Red LED forward drop is ~1.8V - 2.2V; current ~9 mA
        self.assertGreater(res["metrics"]["peak_forward_voltage"], 1.6)
        self.assertLess(res["metrics"]["peak_forward_voltage"], 2.4)
        self.assertGreater(res["metrics"]["peak_forward_current"], 0.005)

    # TEST 8: Half-wave rectifier
    def test_08_half_wave_rectifier(self):
        netlist = {
            "nodes": [
                {"id": "NODE_AC", "label": "AC_IN"},
                {"id": "NODE_LOAD", "label": "LOAD"},
                {"id": "GND", "label": "GND"}
            ],
            "components": [
                {"id": "D1", "type": "diode", "model": "1N4007", "node1": "NODE_AC", "node2": "NODE_LOAD"},
                {"id": "R_LOAD", "type": "resistor", "value": 1000.0, "node1": "NODE_LOAD", "node2": "GND"}
            ]
        }
        res = analyze_semiconductor_circuit(
            netlist=netlist,
            source_config={"type": "sine", "amplitude": 10.0, "frequency": 50.0, "node_pos": "NODE_AC", "node_neg": "GND"},
            simulation_config={"t_stop": 0.04, "dt": 0.0002}
        )
        self.assertEqual(res["status"], "VERIFIED")
        self.assertEqual(res["circuit_type"], "HALF_WAVE_RECTIFIER")
        self.assertAlmostEqual(res["metrics"]["conduction_duty_cycle_percent"], 50.0, delta=15.0)

    # TEST 9: Full-wave bridge rectifier
    def test_09_full_wave_bridge_rectifier(self):
        netlist = {
            "nodes": [
                {"id": "AC1", "label": "AC1"},
                {"id": "AC2", "label": "AC2"},
                {"id": "DC_POS", "label": "DC+"},
                {"id": "GND", "label": "GND"}
            ],
            "components": [
                {"id": "D1", "type": "diode", "model": "1N4007", "node1": "AC1", "node2": "DC_POS"},
                {"id": "D2", "type": "diode", "model": "1N4007", "node1": "GND", "node2": "AC1"},
                {"id": "D3", "type": "diode", "model": "1N4007", "node1": "AC2", "node2": "DC_POS"},
                {"id": "D4", "type": "diode", "model": "1N4007", "node1": "GND", "node2": "AC2"},
                {"id": "RLOAD", "type": "resistor", "value": 1000.0, "node1": "DC_POS", "node2": "GND"}
            ]
        }
        res = analyze_semiconductor_circuit(
            netlist=netlist,
            source_config={"type": "sine", "amplitude": 12.0, "frequency": 50.0, "node_pos": "AC1", "node_neg": "AC2"},
            simulation_config={"t_stop": 0.04, "dt": 0.0002}
        )
        self.assertEqual(res["status"], "VERIFIED")
        self.assertEqual(res["circuit_type"], "FULL_WAVE_BRIDGE_RECTIFIER")

    # TEST 10: Diode switching transient
    def test_10_diode_switching(self):
        netlist = {
            "nodes": [
                {"id": "NODE_PULSE", "label": "PULSE"},
                {"id": "NODE_DIODE", "label": "Anode"},
                {"id": "GND", "label": "GND"}
            ],
            "components": [
                {"id": "R1", "type": "resistor", "value": 470.0, "node1": "NODE_PULSE", "node2": "NODE_DIODE"},
                {"id": "D1", "type": "diode", "model": "1N4148", "node1": "NODE_DIODE", "node2": "GND"}
            ]
        }
        res = analyze_semiconductor_circuit(
            netlist=netlist,
            source_config={"type": "pulse", "initial_value": 0.0, "final_value": 5.0, "t_rise": 1e-5, "t_fall": 1e-5, "t_width": 0.001, "node_pos": "NODE_PULSE", "node_neg": "GND"},
            simulation_config={"t_stop": 0.002, "dt": 0.00002}
        )
        self.assertEqual(res["status"], "VERIFIED")
        self.assertIsNotNone(res["metrics"]["peak_forward_current"])

    # TEST 11: Dynamic diode capacitance
    def test_11_dynamic_diode_capacitance(self):
        model = DiodeNonlinearModel(
            device_id="D1",
            anode_node="N1",
            cathode_node="GND",
            model_name="1N4148",
            dynamic_cap=True
        )
        # Check junction depletion capacitance at reverse bias (-2V)
        c_rev = model.evaluate_capacitance(-2.0, 0.0)
        self.assertGreater(c_rev, 0.0)
        self.assertLess(c_rev, model.c_j0)

        # Check diffusion capacitance at forward bias (+0.6V)
        g_fwd = model.evaluate_conductance(0.6)
        c_fwd = model.evaluate_capacitance(0.6, g_fwd)
        self.assertGreater(c_fwd, model.c_j0)

    # TEST 12: Numerical overflow protection
    def test_12_overflow_protection(self):
        # 100V forward bias directly across diode equation must not cause OverflowError or Inf
        i_huge = self.default_diode.evaluate_current(100.0)
        self.assertFalse(np.isinf(i_huge))
        self.assertFalse(np.isnan(i_huge))
        self.assertGreater(i_huge, 1.0)

    # TEST 13: NaN / Infinity protection
    def test_13_nan_inf_protection(self):
        g_huge = self.default_diode.evaluate_conductance(100.0)
        self.assertFalse(np.isnan(g_huge))
        self.assertFalse(np.isinf(g_huge))

        i_neg = self.default_diode.evaluate_current(-1000.0)
        self.assertFalse(np.isnan(i_neg))
        self.assertAlmostEqual(i_neg, -self.default_diode.is_sat, places=8)

    # TEST 14: Topology rejection
    def test_14_topology_rejection(self):
        # Pure resistor netlist with no diodes
        netlist = {
            "nodes": [{"id": "N1"}, {"id": "N2"}, {"id": "GND"}],
            "components": [{"id": "R1", "type": "resistor", "value": 1000.0, "node1": "N1", "node2": "N2"}]
        }
        topo = classify_semiconductor_topology(netlist)
        self.assertEqual(topo["verification_status"], "UNSUPPORTED")

    # TEST 15: Unknown semiconductor device rejection / fallback
    def test_15_unknown_semiconductor_model(self):
        reg_entry = get_semiconductor_definition("UNKNOWN_MODEL_XYZ")
        # Should gracefully return standard default generic diode params
        self.assertIn("parameters", reg_entry)
        self.assertIn("Is", reg_entry["parameters"])
        self.assertIn("n", reg_entry["parameters"])

    # TEST 16: Parameter modification affects results
    def test_16_parameter_sensitivity(self):
        d_std = DiodeNonlinearModel("D1", "N1", "GND", custom_params={"Is": 1e-12, "n": 1.0})
        d_mod = DiodeNonlinearModel("D1", "N1", "GND", custom_params={"Is": 1e-9, "n": 1.5})
        i_std = d_std.evaluate_current(0.6)
        i_mod = d_mod.evaluate_current(0.6)
        self.assertNotEqual(i_std, i_mod)

    # TEST 17: Timestep refinement
    def test_17_timestep_refinement(self):
        netlist = {
            "nodes": [{"id": "NODE_PWR"}, {"id": "NODE_DIODE"}, {"id": "GND"}],
            "components": [
                {"id": "R1", "type": "resistor", "value": 1000.0, "node1": "NODE_PWR", "node2": "NODE_DIODE"},
                {"id": "D1", "type": "diode", "model": "1N4148", "node1": "NODE_DIODE", "node2": "GND"}
            ]
        }
        res_coarse = solve_nonlinear_transient_mna(
            netlist, t_start=0, t_stop=0.001, dt=0.0002,
            source_config={"type": "step", "final_value": 5.0, "node_pos": "NODE_PWR", "node_neg": "GND"}
        )
        res_fine = solve_nonlinear_transient_mna(
            netlist, t_start=0, t_stop=0.001, dt=0.00005,
            source_config={"type": "step", "final_value": 5.0, "node_pos": "NODE_PWR", "node_neg": "GND"}
        )
        self.assertEqual(res_coarse["status"], "VERIFIED")
        self.assertEqual(res_fine["status"], "VERIFIED")
        self.assertGreater(len(res_fine["time"]), len(res_coarse["time"]))

    # TEST 18: Backward Euler vs Trapezoidal integration
    def test_18_integration_methods(self):
        netlist = {
            "nodes": [{"id": "NODE_PWR"}, {"id": "NODE_DIODE"}, {"id": "GND"}],
            "components": [
                {"id": "R1", "type": "resistor", "value": 1000.0, "node1": "NODE_PWR", "node2": "NODE_DIODE"},
                {"id": "D1", "type": "diode", "model": "1N4148", "node1": "NODE_DIODE", "node2": "GND"}
            ]
        }
        res_be = solve_nonlinear_transient_mna(
            netlist, t_start=0, t_stop=0.001, dt=0.0001, method="backward_euler",
            source_config={"type": "step", "final_value": 5.0, "node_pos": "NODE_PWR", "node_neg": "GND"}
        )
        res_tr = solve_nonlinear_transient_mna(
            netlist, t_start=0, t_stop=0.001, dt=0.0001, method="trapezoidal",
            source_config={"type": "step", "final_value": 5.0, "node_pos": "NODE_PWR", "node_neg": "GND"}
        )
        self.assertEqual(res_be["status"], "VERIFIED")
        self.assertEqual(res_tr["status"], "VERIFIED")

    # TEST 19: Physical validation metadata
    def test_19_scientific_metadata(self):
        netlist = {
            "nodes": [{"id": "NODE_PWR"}, {"id": "NODE_DIODE"}, {"id": "GND"}],
            "components": [
                {"id": "R1", "type": "resistor", "value": 1000.0, "node1": "NODE_PWR", "node2": "NODE_DIODE"},
                {"id": "D1", "type": "diode", "model": "1N4148", "node1": "NODE_DIODE", "node2": "GND"}
            ]
        }
        res = analyze_semiconductor_circuit(
            netlist=netlist,
            source_config={"type": "step", "final_value": 5.0, "node_pos": "NODE_PWR", "node_neg": "GND"}
        )
        self.assertEqual(res["source"], "nonlinear_transient_mna_simulation")
        self.assertFalse(res["is_measured"])
        self.assertEqual(res["physical_validation_status"], "NOT_PERFORMED")

    # TEST 20: Regression with Phase 29 linear transient solver
    def test_20_linear_transient_regression(self):
        rc_netlist = {
            "nodes": [{"id": "IN"}, {"id": "OUT"}, {"id": "GND"}],
            "components": [
                {"id": "R1", "type": "resistor", "value": 1000.0, "node1": "IN", "node2": "OUT"},
                {"id": "C1", "type": "capacitor", "value": 1e-6, "node1": "OUT", "node2": "GND"}
            ]
        }
        res = analyze_transient_circuit(
            netlist=rc_netlist,
            source_config={"type": "step", "final_value": 5.0, "node_pos": "IN", "node_neg": "GND"},
            simulation_config={"t_stop": 0.005, "dt": 0.0001}
        )
        self.assertEqual(res["status"], "VERIFIED")
        self.assertEqual(res["circuit_type"], "RC_CHARGING")
        self.assertAlmostEqual(res["metrics"]["tau"], 0.001, delta=0.0002)


if __name__ == "__main__":
    unittest.main()

