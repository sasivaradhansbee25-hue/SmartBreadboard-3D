"""
Tests for Phase 31: BJT Non-Linear Modeling & Switching / Amplifier Intelligence.
Verifies Ebers-Moll transport equations, Jacobian derivatives, KCL (IB + IC + IE = 0),
Newton-Raphson convergence, operating regions (CUTOFF, FORWARD_ACTIVE, SATURATION),
NPN / PNP polarity, Common-Emitter amplifier, Emitter Follower, BJT switch / inverter,
transient switching, dynamic junction capacitances, temperature sensitivity, and scientific metadata.
"""

import unittest
import numpy as np
from typing import Dict, Any
import sys
import os

_backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_repo_dir = os.path.dirname(_backend_dir)
for p in [_backend_dir, _repo_dir]:
    if p not in sys.path:
        sys.path.insert(0, p)

try:
    from backend.circuit_solver.bjt_registry import (
        get_bjt_definition,
        BJT_REGISTRY,
        THERMAL_VOLTAGE_300K,
        compute_thermal_voltage
    )
    from backend.circuit_solver.nonlinear_transient_mna import (
        BJTNonlinearModel,
        DiodeNonlinearModel,
        solve_nonlinear_transient_mna
    )
    from backend.circuit_solver.bjt_behavior import (
        classify_bjt_topology,
        extract_bjt_metrics,
        analyze_bjt_circuit
    )
except ImportError:
    from circuit_solver.bjt_registry import (
        get_bjt_definition,
        BJT_REGISTRY,
        THERMAL_VOLTAGE_300K,
        compute_thermal_voltage
    )
    from circuit_solver.nonlinear_transient_mna import (
        BJTNonlinearModel,
        DiodeNonlinearModel,
        solve_nonlinear_transient_mna
    )
    from circuit_solver.bjt_behavior import (
        classify_bjt_topology,
        extract_bjt_metrics,
        analyze_bjt_circuit
    )


class TestBJTModel(unittest.TestCase):
    def setUp(self):
        self.npn_model = BJTNonlinearModel(
            device_id="Q1",
            collector_node="NODE_C",
            base_node="NODE_B",
            emitter_node="GND",
            model_name="2N3904",
            polarity="NPN"
        )
        self.pnp_model = BJTNonlinearModel(
            device_id="Q2",
            collector_node="NODE_C",
            base_node="NODE_B",
            emitter_node="NODE_VCC",
            model_name="2N3906",
            polarity="PNP"
        )

    # TEST 1: Ebers-Moll current calculation
    def test_01_ebers_moll_currents(self):
        # In forward active (V_BE = 0.65V, V_CE = 5.0V => V_BC = -4.35V)
        currents, jac, reg = self.npn_model.evaluate_terminals(v_b=0.65, v_c=5.0, v_e=0.0)
        self.assertGreater(currents["IB"], 0.0)
        self.assertGreater(currents["IC"], 0.0)
        self.assertLess(currents["IE"], 0.0)
        self.assertEqual(reg, "FORWARD_ACTIVE")
        # Collector current should be approx beta_f * IB
        self.assertGreater(currents["IC"] / currents["IB"], 50.0)

    # TEST 2: BJT Jacobian calculation (Finite-Difference Verification)
    def test_02_jacobian_derivatives(self):
        vb, vc, ve = 0.65, 3.0, 0.0
        _, jac, _ = self.npn_model.evaluate_terminals(vb, vc, ve)
        eps = 1e-6

        # Check dIc/dVb numerically
        c_plus, _, _ = self.npn_model.evaluate_terminals(vb + eps, vc, ve)
        c_minus, _, _ = self.npn_model.evaluate_terminals(vb - eps, vc, ve)
        dIc_dVb_num = (c_plus["IC"] - c_minus["IC"]) / (2 * eps)
        self.assertAlmostEqual(jac[("C", "B")], dIc_dVb_num, delta=abs(dIc_dVb_num) * 0.02)

        # Check dIb/dVb numerically
        dIb_dVb_num = (c_plus["IB"] - c_minus["IB"]) / (2 * eps)
        self.assertAlmostEqual(jac[("B", "B")], dIb_dVb_num, delta=abs(dIb_dVb_num) * 0.02)

    # TEST 3: KCL: IB + IC + IE ≈ 0
    def test_03_kcl_conservation(self):
        for vb in [0.0, 0.6, 0.7, 0.85]:
            for vc in [0.1, 0.5, 5.0]:
                currents, _, _ = self.npn_model.evaluate_terminals(v_b=vb, v_c=vc, v_e=0.0)
                kcl_sum = currents["IB"] + currents["IC"] + currents["IE"]
                self.assertAlmostEqual(kcl_sum, 0.0, places=10)

    # TEST 4: Newton-Raphson convergence
    def test_04_newton_raphson_convergence(self):
        # 5V -> Rc=1k -> C, 5V -> Rb=10k -> B, E=GND
        netlist = {
            "nodes": [{"id": "VCC"}, {"id": "B"}, {"id": "C"}, {"id": "GND"}],
            "components": [
                {"id": "RC", "type": "resistor", "value": 1000.0, "node1": "VCC", "node2": "C"},
                {"id": "RB", "type": "resistor", "value": 10000.0, "node1": "VCC", "node2": "B"},
                {"id": "Q1", "type": "bjt", "model": "2N3904", "node1": "C", "node2": "B", "node3": "GND"}
            ]
        }
        res = solve_nonlinear_transient_mna(
            netlist=netlist,
            t_start=0.0,
            t_stop=0.001,
            dt=0.0001,
            source_config={"type": "step", "final_value": 5.0, "node_pos": "VCC", "node_neg": "GND"}
        )
        self.assertEqual(res["status"], "VERIFIED")
        self.assertTrue(res["solver"]["converged"])
        self.assertLessEqual(res["solver"]["max_iterations_used"], 50)

    # TEST 5: Newton-Raphson failure handling
    def test_05_newton_raphson_failure(self):
        netlist = {
            "nodes": [{"id": "VCC"}, {"id": "B"}, {"id": "C"}, {"id": "GND"}],
            "components": [
                {"id": "RC", "type": "resistor", "value": 1.0, "node1": "VCC", "node2": "C"},
                {"id": "RB", "type": "resistor", "value": 10.0, "node1": "VCC", "node2": "B"},
                {"id": "Q1", "type": "bjt", "model": "2N3904", "node1": "C", "node2": "B", "node3": "GND"}
            ]
        }
        res = solve_nonlinear_transient_mna(
            netlist=netlist,
            t_start=0.0,
            t_stop=0.001,
            dt=0.0001,
            source_config={"type": "step", "final_value": 50.0, "node_pos": "VCC", "node_neg": "GND"},
            nonlinear_config={"max_iterations": 1, "voltage_tolerance": 1e-12, "damping_factor": 1.0}
        )
        self.assertEqual(res["status"], "ERROR")
        self.assertEqual(res["error_code"], "NONLINEAR_CONVERGENCE_FAILED")
        self.assertFalse(res["solver"]["converged"])

    # TEST 6: NPN Cutoff Operation
    def test_06_npn_cutoff(self):
        currents, _, reg = self.npn_model.evaluate_terminals(v_b=0.1, v_c=5.0, v_e=0.0)
        self.assertEqual(reg, "CUTOFF")
        self.assertLess(abs(currents["IB"]), 1e-9)
        self.assertLess(abs(currents["IC"]), 1e-7)

    # TEST 7: NPN Forward-Active Operation
    def test_07_npn_forward_active(self):
        currents, _, reg = self.npn_model.evaluate_terminals(v_b=0.68, v_c=3.0, v_e=0.0)
        self.assertEqual(reg, "FORWARD_ACTIVE")
        self.assertGreater(currents["IC"], 0.0005)
        self.assertGreater(currents["IB"], 1e-6)

    # TEST 8: NPN Saturation Operation
    def test_08_npn_saturation(self):
        # Both junctions forward-biased (VB=0.75, VC=0.15, VE=0.0 => VBE=0.75, VBC=0.60)
        currents, _, reg = self.npn_model.evaluate_terminals(v_b=0.75, v_c=0.15, v_e=0.0)
        self.assertEqual(reg, "SATURATION")
        self.assertGreater(currents["IB"], 1e-4)

    # TEST 9: PNP Polarity
    def test_09_pnp_polarity(self):
        # PNP in active: Emitter at +5V, Base at +4.3V (VEB = +0.7V), Collector at 0V (VEC = +5.0V)
        currents, _, reg = self.pnp_model.evaluate_terminals(v_b=4.3, v_c=0.0, v_e=5.0)
        self.assertEqual(reg, "FORWARD_ACTIVE")
        # In PNP, currents flowing INTO terminals: IB < 0 (leaves base), IC < 0 (leaves collector), IE > 0 (enters emitter)
        self.assertLess(currents["IB"], 0.0)
        self.assertLess(currents["IC"], 0.0)
        self.assertGreater(currents["IE"], 0.0)
        self.assertAlmostEqual(currents["IB"] + currents["IC"] + currents["IE"], 0.0, places=10)

        # TEST 10: Common-Emitter Topology Classification & Verification
    def test_10_common_emitter_topology(self):
        netlist = {
            "nodes": [
                {"id": "VCC"},
                {"id": "VIN"},
                {"id": "C"},
                {"id": "B"},
                {"id": "GND"}
            ],
            "components": [
                {
                    "id": "RC",
                    "type": "resistor",
                    "value": 2200.0,
                    "node1": "VCC",
                    "node2": "C"
                },
                {
                    "id": "RB",
                    "type": "resistor",
                    "value": 47000.0,
                    "node1": "VIN",
                    "node2": "B"
                },
                {
                    "id": "Q1",
                    "type": "bjt",
                    "model": "2N3904",
                    "node1": "C",
                    "node2": "B",
                    "node3": "GND"
                }
            ],
            "power_sources": [
                {
                    "id": "VCC_SUPPLY",
                    "type": "voltage_source",
                    "voltage": 5.0,
                    "positive_node": "VCC",
                    "negative_node": "GND"
                }
            ]
        }

        res = analyze_bjt_circuit(
            netlist=netlist,
            source_config={
                "type": "sine",
                "amplitude": 0.5,
                "frequency": 1000.0,
                "offset": 1.5,
                "node_pos": "VIN",
                "node_neg": "GND"
            },
            simulation_config={
                "t_stop": 0.002,
                "dt": 0.00005
            }
        )

        print("\n=== TEST 10 COMMON EMITTER RESULT ===")
        print(res)

        self.assertEqual(res["status"], "VERIFIED")
        self.assertEqual(
            res["circuit_type"],
            "BJT_COMMON_EMITTER"
        )
        self.assertIn(
            "FORWARD_ACTIVE",
            res["metrics"]["operating_region"]
        )


    # TEST 11: Common-Collector / Emitter-Follower Topology
    def test_11_common_collector_topology(self):
        netlist = {
            "nodes": [
                {"id": "VCC"},
                {"id": "VIN"},
                {"id": "B"},
                {"id": "E_OUT"},
                {"id": "GND"}
            ],
            "components": [
                {
                    "id": "RE",
                    "type": "resistor",
                    "value": 1000.0,
                    "node1": "E_OUT",
                    "node2": "GND"
                },
                {
                    "id": "RB",
                    "type": "resistor",
                    "value": 10000.0,
                    "node1": "VIN",
                    "node2": "B"
                },
                {
                    "id": "Q1",
                    "type": "bjt",
                    "model": "2N3904",
                    "collector": "VCC",
                    "base": "B",
                    "emitter": "E_OUT"
                }
            ],
            "power_sources": [
                {
                    "id": "VCC_SUPPLY",
                    "type": "voltage_source",
                    "voltage": 5.0,
                    "positive_node": "VCC",
                    "negative_node": "GND"
                }
            ]
        }

        res = analyze_bjt_circuit(
            netlist=netlist,
            source_config={
                "type": "step",
                "initial_value": 0.0,
                "final_value": 3.0,
                "node_pos": "VIN",
                "node_neg": "GND"
            },
            simulation_config={
                "t_stop": 0.002,
                "dt": 0.00005
            }
        )

        print("\n=== TEST 11 COMMON COLLECTOR RESULT ===")
        print(str(res).encode("ascii", "replace").decode("ascii"))

        self.assertEqual(res["status"], "VERIFIED")
        self.assertEqual(
            res["circuit_type"],
            "BJT_COMMON_COLLECTOR"
        )


    # TEST 12: BJT Switch Circuit
    def test_12_bjt_switch(self):
        netlist = {
            "nodes": [
                {"id": "VCC"},
                {"id": "V_CTRL"},
                {"id": "B"},
                {"id": "LOAD_C"},
                {"id": "GND"}
            ],
            "components": [
                {
                    "id": "RLOAD",
                    "type": "resistor",
                    "value": 330.0,
                    "node1": "VCC",
                    "node2": "LOAD_C"
                },
                {
                    "id": "RBASE",
                    "type": "resistor",
                    "value": 2200.0,
                    "node1": "V_CTRL",
                    "node2": "B"
                },
                {
                    "id": "Q1",
                    "type": "bjt",
                    "model": "2N3904",
                    "node1": "LOAD_C",
                    "node2": "B",
                    "node3": "GND"
                }
            ],
            "power_sources": [
                {
                    "id": "VCC_SUPPLY",
                    "type": "voltage_source",
                    "voltage": 5.0,
                    "positive_node": "VCC",
                    "negative_node": "GND"
                }
            ]
        }

        res = analyze_bjt_circuit(
            netlist=netlist,
            source_config={
                "type": "pulse",
                "initial_value": 0.0,
                "final_value": 5.0,
                "t_rise": 1e-6,
                "t_fall": 1e-6,
                "t_width": 0.001,
                "node_pos": "V_CTRL",
                "node_neg": "GND"
            },
            simulation_config={
                "t_stop": 0.002,
                "dt": 0.00002
            }
        )

        print("\n=== TEST 12 BJT SWITCH RESULT ===")
        print(res)

        self.assertEqual(res["status"], "VERIFIED")
        self.assertIn(
            res["circuit_type"],
            ["BJT_SWITCH", "BJT_INVERTER"]
        )


    # TEST 13: BJT Inverter
    def test_13_bjt_inverter(self):
        netlist = {
            "nodes": [
                {"id": "VCC"},
                {"id": "VIN"},
                {"id": "B"},
                {"id": "VOUT"},
                {"id": "GND"}
            ],
            "components": [
                {
                    "id": "RC",
                    "type": "resistor",
                    "value": 1000.0,
                    "node1": "VCC",
                    "node2": "VOUT"
                },
                {
                    "id": "RB",
                    "type": "resistor",
                    "value": 10000.0,
                    "node1": "VIN",
                    "node2": "B"
                },
                {
                    "id": "Q1",
                    "type": "bjt",
                    "model": "2N3904",
                    "node1": "VOUT",
                    "node2": "B",
                    "node3": "GND"
                }
            ],
            "power_sources": [
                {
                    "id": "VCC_SUPPLY",
                    "type": "voltage_source",
                    "voltage": 5.0,
                    "positive_node": "VCC",
                    "negative_node": "GND"
                }
            ]
        }

        res = analyze_bjt_circuit(
            netlist=netlist,
            source_config={
                "type": "step",
                "initial_value": 0.0,
                "final_value": 5.0,
                "node_pos": "VIN",
                "node_neg": "GND"
            },
            simulation_config={
                "t_stop": 0.002,
                "dt": 0.00005
            }
        )

        print("\n=== TEST 13 BJT INVERTER RESULT ===")
        print(res)

        self.assertEqual(res["status"], "VERIFIED")
        self.assertIn(
            res["circuit_type"],
            ["BJT_INVERTER", "BJT_SWITCH"]
        )

        self.assertLess(
            res["metrics"]["vce_final"],
            0.35
        )


    # TEST 14: Switching Transient Metrics
    def test_14_switching_transient(self):
        netlist = {
            "nodes": [
                {"id": "VCC"},
                {"id": "PULSE_IN"},
                {"id": "B"},
                {"id": "C"},
                {"id": "GND"}
            ],
            "components": [
                {
                    "id": "RC",
                    "type": "resistor",
                    "value": 470.0,
                    "node1": "VCC",
                    "node2": "C"
                },
                {
                    "id": "RB",
                    "type": "resistor",
                    "value": 4700.0,
                    "node1": "PULSE_IN",
                    "node2": "B"
                },
                {
                    "id": "Q1",
                    "type": "bjt",
                    "model": "2N3904",
                    "node1": "C",
                    "node2": "B",
                    "node3": "GND"
                }
            ],
            "power_sources": [
                {
                    "id": "VCC_SUPPLY",
                    "type": "voltage_source",
                    "voltage": 5.0,
                    "positive_node": "VCC",
                    "negative_node": "GND"
                }
            ]
        }

        res = analyze_bjt_circuit(
            netlist=netlist,
            source_config={
                "type": "pulse",
                "initial_value": 0.0,
                "final_value": 5.0,
                "t_rise": 1e-6,
                "t_fall": 1e-6,
                "t_width": 0.001,
                "node_pos": "PULSE_IN",
                "node_neg": "GND"
            },
            simulation_config={
                "t_stop": 0.002,
                "dt": 0.00002
            }
        )

        print("\n=== TEST 14 SWITCHING TRANSIENT RESULT ===")
        print(res)

        self.assertEqual(res["status"], "VERIFIED")
        self.assertIsNotNone(
            res["metrics"]["ic_final"]
        )


    # TEST 15: Common-Emitter Transient Amplification
    def test_15_common_emitter_amplification(self):
        netlist = {
            "nodes": [
                {"id": "VCC"},
                {"id": "VIN"},
                {"id": "C"},
                {"id": "B"},
                {"id": "GND"}
            ],
            "components": [
                {
                    "id": "RC",
                    "type": "resistor",
                    "value": 2200.0,
                    "node1": "VCC",
                    "node2": "C"
                },
                {
                    "id": "RB",
                    "type": "resistor",
                    "value": 33000.0,
                    "node1": "VIN",
                    "node2": "B"
                },
                {
                    "id": "Q1",
                    "type": "bjt",
                    "model": "2N3904",
                    "node1": "C",
                    "node2": "B",
                    "node3": "GND"
                }
            ],
            "power_sources": [
                {
                    "id": "VCC_SUPPLY",
                    "type": "voltage_source",
                    "voltage": 5.0,
                    "positive_node": "VCC",
                    "negative_node": "GND"
                }
            ]
        }

        res = analyze_bjt_circuit(
            netlist=netlist,
            source_config={
                "type": "sine",
                "amplitude": 0.2,
                "frequency": 1000.0,
                "offset": 1.2,
                "node_pos": "VIN",
                "node_neg": "GND"
            },
            simulation_config={
                "t_stop": 0.002,
                "dt": 0.00004
            }
        )

        print("\n=== TEST 15 COMMON EMITTER AMPLIFICATION RESULT ===")
        print(res)

        self.assertEqual(res["status"], "VERIFIED")
        self.assertEqual(
            res["circuit_type"],
            "BJT_COMMON_EMITTER"
        )
    # TEST 16: BJT Junction Capacitance
    def test_16_junction_capacitances(self):
        c_be, c_bc = self.npn_model.evaluate_capacitances(v_b=0.65, v_c=5.0, v_e=0.0)
        self.assertGreater(c_be, self.npn_model.c_je0)
        self.assertLess(c_bc, self.npn_model.c_jc0)

    # TEST 17: Temperature Parameter
    def test_17_temperature_parameter(self):
        q_cold = BJTNonlinearModel("Q1", custom_params={"temperature_k": 250.0})
        q_hot = BJTNonlinearModel("Q1", custom_params={"temperature_k": 350.0})
        self.assertLess(q_cold.Vt, q_hot.Vt)
        c_cold, _, _ = q_cold.evaluate_terminals(0.65, 5.0, 0.0)
        c_hot, _, _ = q_hot.evaluate_terminals(0.65, 5.0, 0.0)
        self.assertNotEqual(c_cold["IC"], c_hot["IC"])

    # TEST 18: Parameter Sensitivity
    def test_18_parameter_sensitivity(self):
        q_low_beta = BJTNonlinearModel("Q1", custom_params={"beta_f": 50.0})
        q_high_beta = BJTNonlinearModel("Q1", custom_params={"beta_f": 300.0})
        c_low, _, _ = q_low_beta.evaluate_terminals(0.65, 5.0, 0.0)
        c_high, _, _ = q_high_beta.evaluate_terminals(0.65, 5.0, 0.0)
        self.assertGreater(c_low["IB"], c_high["IB"])

    # TEST 19: Invalid Terminal Mapping
    def test_19_invalid_terminal_mapping(self):
        # Empty nodes
        q = BJTNonlinearModel(comp={"id": "Q1", "type": "bjt", "node1": "", "node2": "", "node3": ""})
        self.assertEqual(q.node_collector, "NODE_C")

    # TEST 20: Invalid Topology Rejection
    def test_20_invalid_topology(self):
        netlist = {
            "nodes": [{"id": "N1"}, {"id": "N2"}],
            "components": [{"id": "R1", "type": "resistor", "value": 1000.0, "node1": "N1", "node2": "N2"}]
        }
        res = analyze_bjt_circuit(netlist=netlist)
        self.assertEqual(res["verification_status"], "UNSUPPORTED")

    # TEST 21: Unknown BJT Model Fallback
    def test_21_unknown_model_fallback(self):
        reg = get_bjt_definition("UNKNOWN_TRANSISTOR_999")
        self.assertEqual(reg["model"], "NPN_GENERIC")
        self.assertIn("parameters", reg)

    # TEST 22: NaN / Infinity Protection
    def test_22_nan_inf_protection(self):
        # 100V base voltage must not produce Inf or NaN
        currents, jac, _ = self.npn_model.evaluate_terminals(v_b=100.0, v_c=5.0, v_e=0.0)
        self.assertFalse(np.isnan(currents["IB"]))
        self.assertFalse(np.isinf(currents["IB"]))
        self.assertFalse(np.isnan(currents["IC"]))
        self.assertFalse(np.isinf(currents["IC"]))

    # TEST 23: Timestep Refinement
    def test_23_timestep_refinement(self):
        netlist = {
            "nodes": [{"id": "VCC"}, {"id": "C"}, {"id": "GND"}],
            "components": [
                {"id": "RC", "type": "resistor", "value": 1000.0, "node1": "VCC", "node2": "C"},
                {"id": "RB", "type": "resistor", "value": 10000.0, "node1": "VCC", "node2": "B"},
                {"id": "Q1", "type": "bjt", "model": "2N3904", "node1": "C", "node2": "B", "node3": "GND"}
            ]
        }
        res_coarse = solve_nonlinear_transient_mna(
            netlist, t_start=0, t_stop=0.001, dt=0.0002,
            source_config={"type": "step", "final_value": 5.0, "node_pos": "VCC", "node_neg": "GND"}
        )
        res_fine = solve_nonlinear_transient_mna(
            netlist, t_start=0, t_stop=0.001, dt=0.00005,
            source_config={"type": "step", "final_value": 5.0, "node_pos": "VCC", "node_neg": "GND"}
        )
        self.assertEqual(res_coarse["status"], "VERIFIED")
        self.assertEqual(res_fine["status"], "VERIFIED")
        self.assertGreater(len(res_fine["time"]), len(res_coarse["time"]))

    # TEST 24: Backward Euler vs Trapezoidal Integration
    def test_24_integration_methods(self):
        netlist = {
            "nodes": [{"id": "VCC"}, {"id": "C"}, {"id": "GND"}],
            "components": [
                {"id": "RC", "type": "resistor", "value": 1000.0, "node1": "VCC", "node2": "C"},
                {"id": "RB", "type": "resistor", "value": 10000.0, "node1": "VCC", "node2": "B"},
                {"id": "Q1", "type": "bjt", "model": "2N3904", "node1": "C", "node2": "B", "node3": "GND"}
            ]
        }
        res_be = solve_nonlinear_transient_mna(
            netlist, t_start=0, t_stop=0.001, dt=0.0001, method="backward_euler",
            source_config={"type": "step", "final_value": 5.0, "node_pos": "VCC", "node_neg": "GND"}
        )
        res_tr = solve_nonlinear_transient_mna(
            netlist, t_start=0, t_stop=0.001, dt=0.0001, method="trapezoidal",
            source_config={"type": "step", "final_value": 5.0, "node_pos": "VCC", "node_neg": "GND"}
        )
        self.assertEqual(res_be["status"], "VERIFIED")
        self.assertEqual(res_tr["status"], "VERIFIED")

    # TEST 25: Physical Validation Metadata
    def test_25_scientific_metadata(self):
        netlist = {
            "nodes": [{"id": "VCC"}, {"id": "C"}, {"id": "GND"}],
            "components": [
                {"id": "RC", "type": "resistor", "value": 1000.0, "node1": "VCC", "node2": "C"},
                {"id": "RB", "type": "resistor", "value": 10000.0, "node1": "VCC", "node2": "B"},
                {"id": "Q1", "type": "bjt", "model": "2N3904", "node1": "C", "node2": "B", "node3": "GND"}
            ]
        }
        res = analyze_bjt_circuit(
            netlist=netlist,
            source_config={"type": "step", "final_value": 5.0, "node_pos": "VCC", "node_neg": "GND"}
        )
        self.assertEqual(res["source"], "nonlinear_transient_mna_simulation")
        self.assertFalse(res["is_measured"])
        self.assertEqual(res["physical_validation_status"], "NOT_PERFORMED")


if __name__ == "__main__":
    unittest.main()
