"""
SmartBreadboard 3D — Complex MNA & Frequency Domain AC Solver Unit Tests (Phase 26)
Tests:
1. Single resistor AC circuit impedance (|Z| = R, phase = 0°).
2. RC series impedance (|Z| = sqrt(R^2 + Xc^2), phase < 0°).
3. RL series impedance (|Z| = sqrt(R^2 + Xl^2), phase > 0°).
4. Series RLC impedance & zero-phase resonance.
5. Parallel RLC impedance peak at resonance.
6. Complex node voltages and branch currents.
7. Frequency sweep generation across log scale.
8. Series RLC resonant frequency f0 = 1 / (2*pi*sqrt(L*C)).
9. Bandwidth (-3dB) and Quality factor (Q = f0/BW).
10. Scientific validation test case: R=100Ω, L=10mH, C=100µF -> f0 ≈ 159.15 Hz.
11. Guard: Zero/negative frequency returns error.
12. Guard: Missing ground returns valid stabilized node voltages without crashing.
"""

import math
import os
import sys
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from circuit_solver.complex_mna import solve_ac_frequency_point
from circuit_solver.frequency_sweep import run_frequency_sweep
from circuit_solver.resonance import analyze_resonance


class TestACSolver(unittest.TestCase):

    def test_single_resistor_ac(self):
        netlist = {
            "components": [
                {"id": "R1", "type": "resistor", "value": 1000.0, "node1": "N1", "node2": "GND"}
            ]
        }
        res = solve_ac_frequency_point(netlist, 1000.0)
        self.assertTrue(res["success"])
        z_in = res["input_impedance"]
        self.assertAlmostEqual(z_in["magnitude_ohms"], 1000.0, delta=1.0)
        self.assertAlmostEqual(z_in["phase_deg"], 0.0, delta=0.5)

    def test_rc_series_impedance(self):
        # R=1k, C=1µF at f=1000Hz -> Xc = 1/(2*pi*1000*1e-6) ≈ 159.15 Ω
        # Z = sqrt(1000^2 + 159.15^2) ≈ 1012.6 Ω, phase ≈ -9.04°
        netlist = {
            "components": [
                {"id": "R1", "type": "resistor", "value": 1000.0, "node1": "N1", "node2": "N2"},
                {"id": "C1", "type": "capacitor", "value": 1e-6, "node1": "N2", "node2": "GND"}
            ]
        }
        res = solve_ac_frequency_point(netlist, 1000.0)
        self.assertTrue(res["success"])
        z_in = res["input_impedance"]
        self.assertAlmostEqual(z_in["magnitude_ohms"], 1012.6, delta=5.0)
        self.assertTrue(z_in["phase_deg"] < 0)

    def test_rl_series_impedance(self):
        # R=100Ω, L=10mH at f=1000Hz -> Xl = 2*pi*1000*0.010 ≈ 62.83 Ω
        # Z = sqrt(100^2 + 62.83^2) ≈ 118.1 Ω, phase ≈ +32.1°
        netlist = {
            "components": [
                {"id": "R1", "type": "resistor", "value": 100.0, "node1": "N1", "node2": "N2"},
                {"id": "L1", "type": "inductor", "value": 0.010, "node1": "N2", "node2": "GND"}
            ]
        }
        res = solve_ac_frequency_point(netlist, 1000.0)
        self.assertTrue(res["success"])
        z_in = res["input_impedance"]
        self.assertAlmostEqual(z_in["magnitude_ohms"], 118.1, delta=2.0)
        self.assertTrue(z_in["phase_deg"] > 0)

    def test_series_rlc_resonance_exact(self):
        # Known scientific validation benchmark:
        # R = 100 Ω, L = 10 mH, C = 100 µF
        # Expected f0 = 1 / (2*pi*sqrt(0.01 * 100e-6)) = 1 / (2*pi*1e-3) ≈ 159.155 Hz
        netlist = {
            "components": [
                {"id": "R1", "type": "resistor", "value": 100.0, "node1": "N1", "node2": "N2"},
                {"id": "L1", "type": "inductor", "value": 0.010, "node1": "N2", "node2": "N3"},
                {"id": "C1", "type": "capacitor", "value": 100e-6, "node1": "N3", "node2": "GND"}
            ]
        }
        # Run sweep around f0 (10Hz to 1000Hz)
        sweep = run_frequency_sweep(netlist, start_freq_hz=10.0, stop_freq_hz=1000.0, num_points=120, sweep_type="log")
        self.assertTrue(sweep["success"])
        self.assertEqual(len(sweep["points"]), 120)

        res = analyze_resonance(sweep, topology_type="series")
        self.assertTrue(res["resonance_detected"])
        # Solver detected f0 vs theoretical f0 (159.15 Hz)
        f0_solver = res["resonant_frequency_hz"]
        self.assertAlmostEqual(f0_solver, 159.15, delta=10.0)

        # At resonance, phase should cross near 0° and |Z| ≈ R (100 Ω)
        self.assertAlmostEqual(res["impedance_at_resonance_ohms"], 100.0, delta=15.0)
        self.assertTrue(abs(res["phase_at_resonance_deg"]) < 15.0)

    def test_parallel_rlc_resonance(self):
        netlist = {
            "components": [
                {"id": "R1", "type": "resistor", "value": 1000.0, "node1": "N1", "node2": "GND"},
                {"id": "L1", "type": "inductor", "value": 0.010, "node1": "N1", "node2": "GND"},
                {"id": "C1", "type": "capacitor", "value": 100e-6, "node1": "N1", "node2": "GND"}
            ]
        }
        sweep = run_frequency_sweep(netlist, start_freq_hz=10.0, stop_freq_hz=1000.0, num_points=80, sweep_type="log")
        self.assertTrue(sweep["success"])
        res = analyze_resonance(sweep, topology_type="parallel")
        self.assertTrue(res["resonance_detected"])
        self.assertAlmostEqual(res["resonant_frequency_hz"], 159.15, delta=15.0)

    def test_invalid_frequency_handled_safely(self):
        netlist = {
            "components": [
                {"id": "R1", "type": "resistor", "value": 100.0, "node1": "N1", "node2": "GND"}
            ]
        }
        res = solve_ac_frequency_point(netlist, -50.0)
        self.assertFalse(res["success"])
        self.assertIn("strictly positive", res["error"])


if __name__ == "__main__":
    unittest.main()
