import os
import sys
import unittest
import numpy as np

# Ensure backend root is on sys.path for direct module runs
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

try:
    from backend.circuit_solver.transient_mna import solve_transient_mna
    from backend.circuit_solver.transient_behavior import (
        analyze_transient_circuit,
        classify_transient_topology,
        extract_waveform_metrics
    )
except ImportError:
    from circuit_solver.transient_mna import solve_transient_mna
    from circuit_solver.transient_behavior import (
        analyze_transient_circuit,
        classify_transient_topology,
        extract_waveform_metrics
    )



from fastapi.testclient import TestClient
try:
    from backend.main import app
except ImportError:
    from main import app

class TestTransientSolverPhase29(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)


    # TEST 1: RC Charging
    def test_rc_charging_transient(self):
        """Verify RC charging circuit voltage increases towards final voltage."""
        netlist = {
            "circuit_id": "rc_charge_01",
            "components": [
                {"id": "R1", "type": "resistor", "value": 1000.0, "node1": "node_pwr", "node2": "node_mid"},
                {"id": "C1", "type": "capacitor", "value": 1e-6, "node1": "node_mid", "node2": "node_gnd"}
            ],
            "sources": [
                {"id": "V1", "type": "step", "positive_node": "node_pwr", "negative_node": "node_gnd", "initial_value": 0.0, "final_value": 5.0}
            ]
        }
        res = analyze_transient_circuit(
            netlist=netlist,
            simulation_config={"t_start": 0.0, "t_stop": 0.005, "dt": 0.00005, "method": "backward_euler"}
        )
        self.assertEqual(res.get("status"), "VERIFIED")
        self.assertEqual(res.get("circuit_type"), "RC_CHARGING")
        self.assertEqual(res.get("source"), "transient_mna_simulation")
        self.assertFalse(res.get("is_measured"))
        self.assertEqual(res.get("physical_validation_status"), "NOT_PERFORMED")

        # Check capacitor voltage rises from ~0 towards 5V
        metrics = res["metrics"]
        self.assertAlmostEqual(metrics["initial_value"], 0.0, delta=0.05)
        self.assertGreater(metrics["final_value"], 4.5)
        # Tau = R * C = 1000 * 1e-6 = 0.001 s (1 ms)
        self.assertIsNotNone(metrics["tau"])
        self.assertAlmostEqual(metrics["tau"], 0.001, delta=0.0002)

    # TEST 2: RC Discharging
    def test_rc_discharging_transient(self):
        """Verify RC discharging with initial capacitor voltage decays to 0V."""
        netlist = {
            "circuit_id": "rc_discharge_01",
            "components": [
                {"id": "R1", "type": "resistor", "value": 1000.0, "node1": "node_cap", "node2": "node_gnd"},
                {"id": "C1", "type": "capacitor", "value": 1e-6, "node1": "node_cap", "node2": "node_gnd"}
            ],
            "sources": []
        }
        res = analyze_transient_circuit(
            netlist=netlist,
            simulation_config={"t_start": 0.0, "t_stop": 0.005, "dt": 0.00005, "method": "trapezoidal"},
            initial_conditions={"C1": 5.0}
        )
        self.assertEqual(res.get("status"), "VERIFIED")
        self.assertEqual(res.get("circuit_type"), "RC_DISCHARGING")
        
        metrics = res["metrics"]
        self.assertAlmostEqual(metrics["initial_value"], 5.0, delta=0.05)
        self.assertLess(metrics["final_value"], 0.1)
        self.assertIsNotNone(metrics["tau"])
        self.assertAlmostEqual(metrics["tau"], 0.001, delta=0.0002)

    # TEST 3: RL Current Rise
    def test_rl_current_rise_transient(self):
        """Verify RL step response: inductor current rises towards V/R."""
        netlist = {
            "circuit_id": "rl_rise_01",
            "components": [
                {"id": "R1", "type": "resistor", "value": 100.0, "node1": "node_pwr", "node2": "node_mid"},
                {"id": "L1", "type": "inductor", "value": 0.1, "node1": "node_mid", "node2": "node_gnd"}
            ],
            "sources": [
                {"id": "V1", "type": "step", "positive_node": "node_pwr", "negative_node": "node_gnd", "initial_value": 0.0, "final_value": 10.0}
            ]
        }
        res = analyze_transient_circuit(
            netlist=netlist,
            simulation_config={"t_start": 0.0, "t_stop": 0.005, "dt": 0.00002, "method": "backward_euler"}
        )
        self.assertEqual(res.get("status"), "VERIFIED")
        self.assertEqual(res.get("circuit_type"), "RL_CURRENT_RISE")

        # Tau = L / R = 0.1 / 100 = 0.001 s (1 ms), Final current = 10 / 100 = 0.1 A
        metrics = res["metrics"]
        self.assertAlmostEqual(metrics["initial_value"], 0.0, delta=0.01)
        self.assertAlmostEqual(metrics["final_value"], 0.1, delta=0.01)
        self.assertAlmostEqual(metrics["tau"], 0.001, delta=0.0002)

    # TEST 4: RL Current Decay
    def test_rl_current_decay_transient(self):
        """Verify RL decay from initial inductor current."""
        netlist = {
            "circuit_id": "rl_decay_01",
            "components": [
                {"id": "R1", "type": "resistor", "value": 100.0, "node1": "node_ind", "node2": "node_gnd"},
                {"id": "L1", "type": "inductor", "value": 0.1, "node1": "node_ind", "node2": "node_gnd"}
            ],
            "sources": []
        }
        res = analyze_transient_circuit(
            netlist=netlist,
            simulation_config={"t_start": 0.0, "t_stop": 0.005, "dt": 0.00002, "method": "trapezoidal"},
            initial_conditions={"L1": 0.1}
        )

        self.assertEqual(res.get("status"), "VERIFIED")
        self.assertEqual(res.get("circuit_type"), "RL_CURRENT_DECAY")
        
        metrics = res["metrics"]
        self.assertAlmostEqual(metrics["initial_value"], 0.1, delta=0.01)
        self.assertLess(metrics["final_value"], 0.01)

    # TEST 5: Series RLC Transient (Underdamped / Oscillatory)
    def test_rlc_transient_underdamped(self):
        """Verify 2nd-order series RLC transient shows underdamped oscillation when R is small."""
        # R = 10 ohm, L = 10 mH, C = 1 uF -> zeta = (R/2)*sqrt(C/L) = 5 * sqrt(1e-4) = 0.05 (Underdamped)
        netlist = {
            "circuit_id": "rlc_underdamped_01",
            "components": [
                {"id": "R1", "type": "resistor", "value": 10.0, "node1": "node_pwr", "node2": "node_r_l"},
                {"id": "L1", "type": "inductor", "value": 0.01, "node1": "node_r_l", "node2": "node_cap"},
                {"id": "C1", "type": "capacitor", "value": 1e-6, "node1": "node_cap", "node2": "node_gnd"}
            ],
            "sources": [
                {"id": "V1", "type": "step", "positive_node": "node_pwr", "negative_node": "node_gnd", "initial_value": 0.0, "final_value": 5.0}
            ]
        }
        res = analyze_transient_circuit(
            netlist=netlist,
            simulation_config={"t_start": 0.0, "t_stop": 0.01, "dt": 0.00001, "method": "trapezoidal"}
        )
        self.assertEqual(res.get("status"), "VERIFIED")
        self.assertEqual(res.get("circuit_type"), "RLC_TRANSIENT")
        metrics = res["metrics"]
        self.assertEqual(metrics["damping"], "UNDERDAMPED")
        self.assertGreater(metrics["overshoot_percent"], 50.0)
        self.assertIsNotNone(metrics["oscillation_freq_hz"])

    # TEST 6: Initial Capacitor Voltage
    def test_non_zero_initial_capacitor_voltage(self):
        """Verify capacitor non-zero Vc(0) is honored in transient simulation."""
        netlist = {
            "circuit_id": "rc_init_v_01",
            "components": [
                {"id": "R1", "type": "resistor", "value": 1000.0, "node1": "node_pwr", "node2": "node_mid"},
                {"id": "C1", "type": "capacitor", "value": 1e-6, "node1": "node_mid", "node2": "node_gnd"}
            ],
            "sources": [
                {"id": "V1", "type": "step", "positive_node": "node_pwr", "negative_node": "node_gnd", "initial_value": 0.0, "final_value": 5.0}
            ]
        }
        res = solve_transient_mna(
            netlist=netlist,
            t_start=0.0,
            t_stop=0.002,
            dt=0.0001,
            initial_conditions={"C1": 2.5}
        )
        self.assertEqual(res.get("status"), "VERIFIED")
        vc_signals = [s for s in res["signals"] if s["name"] == "V(C1)"]
        self.assertEqual(len(vc_signals), 1)
        self.assertAlmostEqual(vc_signals[0]["values"][0], 2.5, places=2)

    # TEST 7: Initial Inductor Current
    def test_non_zero_initial_inductor_current(self):
        """Verify inductor non-zero IL(0) is honored."""
        netlist = {
            "circuit_id": "rl_init_i_01",
            "components": [
                {"id": "R1", "type": "resistor", "value": 100.0, "node1": "node_pwr", "node2": "node_mid"},
                {"id": "L1", "type": "inductor", "value": 0.1, "node1": "node_mid", "node2": "node_gnd"}
            ],
            "sources": [
                {"id": "V1", "type": "step", "positive_node": "node_pwr", "negative_node": "node_gnd", "initial_value": 0.0, "final_value": 5.0}
            ]
        }
        res = solve_transient_mna(
            netlist=netlist,
            t_start=0.0,
            t_stop=0.002,
            dt=0.0001,
            initial_conditions={"L1": 0.025}
        )
        self.assertEqual(res.get("status"), "VERIFIED")
        il_signals = [s for s in res["signals"] if s["name"] == "I(L1)"]
        self.assertEqual(len(il_signals), 1)
        self.assertAlmostEqual(il_signals[0]["values"][0], 0.025, places=3)

    # TEST 8: Backward Euler vs Trapezoidal Integration
    def test_backward_euler_vs_trapezoidal_consistency(self):
        """Compare Backward Euler and Trapezoidal methods on RC charging circuit."""
        netlist = {
            "circuit_id": "rc_compare_01",
            "components": [
                {"id": "R1", "type": "resistor", "value": 1000.0, "node1": "node_pwr", "node2": "node_mid"},
                {"id": "C1", "type": "capacitor", "value": 1e-6, "node1": "node_mid", "node2": "node_gnd"}
            ],
            "sources": [
                {"id": "V1", "type": "step", "positive_node": "node_pwr", "negative_node": "node_gnd", "initial_value": 0.0, "final_value": 5.0}
            ]
        }
        res_be = solve_transient_mna(netlist, t_start=0.0, t_stop=0.003, dt=0.00005, method="backward_euler")
        res_tr = solve_transient_mna(netlist, t_start=0.0, t_stop=0.003, dt=0.00005, method="trapezoidal")
        
        self.assertEqual(res_be.get("status"), "VERIFIED")
        self.assertEqual(res_tr.get("status"), "VERIFIED")

        v_be = next(s["values"] for s in res_be["signals"] if s["name"] == "V(C1)")
        v_tr = next(s["values"] for s in res_tr["signals"] if s["name"] == "V(C1)")

        # Both should match closely within numerical integration truncation error (~2.5%)
        diff = np.abs(np.array(v_be) - np.array(v_tr))
        self.assertLess(np.max(diff), 0.15)  # Within 150 mV agreement on 5V step


    # TEST 9: Timestep Refinement & Convergence
    def test_timestep_refinement_convergence(self):
        """Verify dt vs dt/2 yields consistent convergent results."""
        netlist = {
            "circuit_id": "rc_refine_01",
            "components": [
                {"id": "R1", "type": "resistor", "value": 1000.0, "node1": "node_pwr", "node2": "node_mid"},
                {"id": "C1", "type": "capacitor", "value": 1e-6, "node1": "node_mid", "node2": "node_gnd"}
            ],
            "sources": [
                {"id": "V1", "type": "step", "positive_node": "node_pwr", "negative_node": "node_gnd", "initial_value": 0.0, "final_value": 5.0}
            ]
        }
        res_coarse = solve_transient_mna(netlist, t_start=0.0, t_stop=0.002, dt=0.0001)
        res_fine = solve_transient_mna(netlist, t_start=0.0, t_stop=0.002, dt=0.00005)

        v_coarse_end = next(s["values"][-1] for s in res_coarse["signals"] if s["name"] == "V(C1)")
        v_fine_end = next(s["values"][-1] for s in res_fine["signals"] if s["name"] == "V(C1)")

        self.assertAlmostEqual(v_coarse_end, v_fine_end, delta=0.05)

    # TEST 10: Invalid / Non-Reactive Topology Rejection
    def test_non_reactive_topology_rejection(self):
        """Pure resistive circuits without reactive elements return UNSUPPORTED and no fake waveform."""
        netlist = {
            "circuit_id": "pure_resistive",
            "components": [
                {"id": "R1", "type": "resistor", "value": 1000.0, "node1": "node_pwr", "node2": "node_mid"},
                {"id": "R2", "type": "resistor", "value": 1000.0, "node1": "node_mid", "node2": "node_gnd"}
            ],
            "sources": [
                {"id": "V1", "type": "voltage_source", "positive_node": "node_pwr", "negative_node": "node_gnd", "voltage": 5.0}
            ]
        }
        res = analyze_transient_circuit(netlist)
        self.assertEqual(res.get("status"), "UNSUPPORTED")
        self.assertEqual(res.get("circuit_type"), "UNSUPPORTED")
        self.assertNotIn("signals", res)

    # TEST 11: Singular Matrix Safeguard
    def test_singular_matrix_safeguard(self):
        """Floating or disconnected node returns structured solver error."""
        netlist = {
            "circuit_id": "floating_circuit",
            "components": [
                {"id": "R1", "type": "resistor", "value": 1000.0, "node1": "node_float1", "node2": "node_float2"},
                {"id": "C1", "type": "capacitor", "value": 1e-6, "node1": "node_float2", "node2": "node_float3"}
            ],
            "sources": []
        }
        res = solve_transient_mna(netlist)
        self.assertEqual(res.get("status"), "ERROR")

    # TEST 12: Invalid Timestep & Numerical Bounds
    def test_numerical_bounds_protection(self):
        """Negative or zero dt and inverted time intervals are safely rejected."""
        netlist = {
            "circuit_id": "rc_valid",
            "components": [
                {"id": "R1", "type": "resistor", "value": 1000.0, "node1": "node_pwr", "node2": "node_mid"},
                {"id": "C1", "type": "capacitor", "value": 1e-6, "node1": "node_mid", "node2": "node_gnd"}
            ]
        }
        res_neg_dt = solve_transient_mna(netlist, dt=-0.001)
        self.assertEqual(res_neg_dt.get("status"), "ERROR")
        self.assertEqual(res_neg_dt.get("error_code"), "INVALID_TIMESTEP")

        res_inv_t = solve_transient_mna(netlist, t_start=0.01, t_stop=0.005)
        self.assertEqual(res_inv_t.get("status"), "ERROR")
        self.assertEqual(res_inv_t.get("error_code"), "INVALID_TIME_INTERVAL")

    # TEST 13: Source Configurations (Step & Pulse)
    def test_source_configurations(self):
        """Verify pulse and step source waveforms in transient simulation."""
        netlist = {
            "circuit_id": "rc_pulse_01",
            "components": [
                {"id": "R1", "type": "resistor", "value": 1000.0, "node1": "node_in", "node2": "node_out"},
                {"id": "C1", "type": "capacitor", "value": 1e-6, "node1": "node_out", "node2": "node_gnd"}
            ]
        }
        pulse_src = {
            "id": "Vpulse",
            "type": "pulse",
            "low": 0.0,
            "high": 5.0,
            "delay": 0.001,
            "riseTime": 1e-5,
            "fallTime": 1e-5,
            "width": 0.003,
            "period": 0.008,
            "positive_node": "node_in",
            "negative_node": "node_gnd"
        }
        res = solve_transient_mna(
            netlist=netlist,
            t_start=0.0,
            t_stop=0.006,
            dt=0.00005,
            source_config=pulse_src
        )
        self.assertEqual(res.get("status"), "VERIFIED")
        vin_vals = next(s["values"] for s in res["signals"] if s["name"] == "V(node_in)")
        # Before delay (t < 0.001), Vin should be 0V
        self.assertEqual(vin_vals[0], 0.0)
        # At t = 0.002, Vin should be 5V
        idx_2ms = int(0.002 / 0.00005)
        self.assertAlmostEqual(vin_vals[idx_2ms], 5.0, delta=0.05)

    # TEST 14: FastAPI Endpoint Verification
    def test_fastapi_transient_endpoint(self):
        """Verify POST /api/transient/analyze endpoint returns structured transient response."""
        payload = {
            "netlist": {
                "circuit_id": "rc_api_test",
                "components": [
                    {"id": "R1", "type": "resistor", "value": 1000.0, "node1": "node_pwr", "node2": "node_mid"},
                    {"id": "C1", "type": "capacitor", "value": 1e-6, "node1": "node_mid", "node2": "node_gnd"}
                ],
                "sources": [
                    {"id": "V1", "type": "step", "positive_node": "node_pwr", "negative_node": "node_gnd", "voltage": 5.0}
                ]
            },
            "simulation": {
                "t_start": 0.0,
                "t_stop": 0.005,
                "dt": 0.0001,
                "method": "backward_euler"
            }
        }
        response = self.client.post("/api/transient/analyze", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "VERIFIED")
        self.assertEqual(data["circuit_type"], "RC_CHARGING")
        self.assertEqual(data["source"], "transient_mna_simulation")
        self.assertFalse(data["is_measured"])
        self.assertIn("signals", data)
        self.assertIn("metrics", data)


if __name__ == "__main__":
    unittest.main()
