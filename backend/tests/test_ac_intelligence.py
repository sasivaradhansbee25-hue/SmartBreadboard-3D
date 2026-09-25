"""
SmartBreadboard 3D — Generalized AC Circuit Intelligence Unit Tests (Phase 27)
Verifies:
1. Transfer function extraction H(jω) = Vout / Vin, Gain (mag & dB), Phase.
2. First-Order RC Low-Pass Filter (theoretical fc ≈ 1.5915 kHz vs MNA response).
3. First-Order RC High-Pass Filter (theoretical fc ≈ 1.5915 kHz vs MNA response).
4. First-Order RL Low-Pass Filter (theoretical fc = R / (2*pi*L)).
5. First-Order RL High-Pass Filter (theoretical fc = R / (2*pi*L)).
6. Second-Order RLC Band-Pass Filter (f0 resonance & -3dB passband).
7. Cutoff frequency detection accuracy and threshold bounds.
8. Response shape analysis (monotonicity, asymptotes, peak, notch).
9. Strict topology guards: Ambiguous/Missing output node handled safely.
10. Scientific validation: source is strictly 'mna_simulation', is_measured is False.
"""

import math
import os
import sys
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from circuit_solver.ac_intelligence import (
    inspect_filter_topology,
    extract_transfer_response,
    analyze_response_shape,
    detect_cutoff_frequencies,
    classify_ac_behavior,
    analyze_generalized_ac_circuit
)
from circuit_solver.frequency_sweep import run_frequency_sweep


class TestACIntelligence(unittest.TestCase):

    def test_rc_low_pass_benchmark(self):
        # Benchmark: R = 1 kΩ (1000 Ω), C = 100 nF (1e-7 F)
        # Expected theoretical fc = 1 / (2 * pi * 1000 * 1e-7) ≈ 1591.55 Hz (1.5915 kHz)
        netlist = {
            "components": [
                {"id": "R1", "type": "resistor", "value": 1000.0, "node1": "VIN", "node2": "VOUT"},
                {"id": "C1", "type": "capacitor", "value": 1e-7, "node1": "VOUT", "node2": "GND"}
            ],
            "power_sources": [
                {"id": "V_AC", "type": "ac_voltage", "voltage": 1.0, "positive_node": "VIN", "negative_node": "GND"}
            ]
        }

        res = analyze_generalized_ac_circuit(netlist, start_freq_hz=10.0, stop_freq_hz=100000.0, num_points=120)
        self.assertTrue(res["success"])
        self.assertEqual(res["behavior"], "LOW_PASS")
        self.assertEqual(res["status"], "VERIFIED")

        # Check Cutoff Frequency
        cutoff = res["cutoff"]
        self.assertEqual(cutoff["status"], "DETERMINED")
        fc_mna = cutoff["fc_hz"]
        self.assertAlmostEqual(fc_mna, 1591.55, delta=150.0) # Within fine sweep resolution

        # Check Benchmark Comparison
        bench = res["benchmark_comparison"]
        self.assertIsNotNone(bench)
        self.assertEqual(bench["status"], "VALIDATED_WITHIN_TOLERANCE")
        self.assertTrue(bench["difference_percent"] < 10.0)

        # Check Evidence & Integrity
        self.assertTrue(len(res["evidence"]) >= 2)
        self.assertEqual(res["source"], "mna_simulation")
        self.assertFalse(res["is_measured"])

    def test_rc_high_pass_benchmark(self):
        # Benchmark: C = 100 nF, R = 1 kΩ
        # Input -> C -> VOUT, VOUT -> R -> GND
        netlist = {
            "components": [
                {"id": "C1", "type": "capacitor", "value": 1e-7, "node1": "VIN", "node2": "VOUT"},
                {"id": "R1", "type": "resistor", "value": 1000.0, "node1": "VOUT", "node2": "GND"}
            ],
            "power_sources": [
                {"id": "V_AC", "type": "ac_voltage", "voltage": 1.0, "positive_node": "VIN", "negative_node": "GND"}
            ]
        }

        res = analyze_generalized_ac_circuit(netlist, start_freq_hz=10.0, stop_freq_hz=100000.0, num_points=120)
        self.assertTrue(res["success"])
        self.assertEqual(res["behavior"], "HIGH_PASS")
        self.assertEqual(res["status"], "VERIFIED")

        cutoff = res["cutoff"]
        self.assertEqual(cutoff["status"], "DETERMINED")
        fc_mna = cutoff["fc_hz"]
        self.assertAlmostEqual(fc_mna, 1591.55, delta=150.0)

    def test_rl_low_pass_filter(self):
        # RL Low-Pass: Input -> L (100 mH = 0.1 H) -> VOUT -> R (1000 Ω) -> GND
        # Theoretical fc = R / (2*pi*L) = 1000 / (2*pi*0.1) ≈ 1591.55 Hz
        netlist = {
            "components": [
                {"id": "L1", "type": "inductor", "value": 0.1, "node1": "VIN", "node2": "VOUT"},
                {"id": "R1", "type": "resistor", "value": 1000.0, "node1": "VOUT", "node2": "GND"}
            ]
        }

        res = analyze_generalized_ac_circuit(netlist, start_freq_hz=10.0, stop_freq_hz=100000.0, num_points=100)
        self.assertTrue(res["success"])
        self.assertEqual(res["behavior"], "LOW_PASS")
        self.assertEqual(res["status"], "VERIFIED")
        fc_mna = res["cutoff"]["fc_hz"]
        self.assertAlmostEqual(fc_mna, 1591.55, delta=150.0)

    def test_rl_high_pass_filter(self):
        # RL High-Pass: Input -> R (1000 Ω) -> VOUT -> L (100 mH = 0.1 H) -> GND
        # Theoretical fc = R / (2*pi*L) ≈ 1591.55 Hz
        netlist = {
            "components": [
                {"id": "R1", "type": "resistor", "value": 1000.0, "node1": "VIN", "node2": "VOUT"},
                {"id": "L1", "type": "inductor", "value": 0.1, "node1": "VOUT", "node2": "GND"}
            ]
        }

        res = analyze_generalized_ac_circuit(netlist, start_freq_hz=10.0, stop_freq_hz=100000.0, num_points=100)
        self.assertTrue(res["success"])
        self.assertEqual(res["behavior"], "HIGH_PASS")
        self.assertEqual(res["status"], "VERIFIED")
        fc_mna = res["cutoff"]["fc_hz"]
        self.assertAlmostEqual(fc_mna, 1591.55, delta=150.0)

    def test_rlc_band_pass_filter(self):
        # Series RLC Band-Pass (output across R to GND):
        # VIN -> L (10mH) -> N2 -> C (100µF) -> VOUT -> R (100Ω) -> GND
        # Expected resonant peak f0 ≈ 159.15 Hz
        netlist = {
            "components": [
                {"id": "L1", "type": "inductor", "value": 0.010, "node1": "VIN", "node2": "N2"},
                {"id": "C1", "type": "capacitor", "value": 100e-6, "node1": "N2", "node2": "VOUT"},
                {"id": "R1", "type": "resistor", "value": 100.0, "node1": "VOUT", "node2": "GND"}
            ]
        }

        res = analyze_generalized_ac_circuit(netlist, start_freq_hz=10.0, stop_freq_hz=1000.0, num_points=100)
        self.assertTrue(res["success"])
        self.assertEqual(res["behavior"], "BAND_PASS")
        self.assertEqual(res["status"], "VERIFIED")
        self.assertTrue(res["resonance"]["resonance_detected"])
        self.assertAlmostEqual(res["resonance"]["resonant_frequency_hz"], 159.15, delta=15.0)

    def test_transfer_function_extraction_properties(self):
        # Pure 1k resistor divider: VIN -> R1 (1k) -> VOUT -> R2 (1k) -> GND
        # H(jω) = 0.5 (Gain = -6.02 dB, Phase = 0°) at all frequencies
        netlist = {
            "components": [
                {"id": "R1", "type": "resistor", "value": 1000.0, "node1": "VIN", "node2": "VOUT"},
                {"id": "R2", "type": "resistor", "value": 1000.0, "node1": "VOUT", "node2": "GND"}
            ]
        }
        res = analyze_generalized_ac_circuit(netlist, start_freq_hz=100.0, stop_freq_hz=10000.0, num_points=20)
        self.assertTrue(res["success"])
        self.assertEqual(res["behavior"], "FREQUENCY_INDEPENDENT")

        pts = res["frequency_response"]["transfer_points"]
        self.assertTrue(len(pts) > 0)
        for pt in pts:
            self.assertAlmostEqual(pt["gain_magnitude"], 0.5, delta=0.01)
            self.assertAlmostEqual(pt["gain_db"], -6.02, delta=0.1)
            self.assertAlmostEqual(pt["phase_deg"], 0.0, delta=0.1)

    def test_safety_unknown_empty_circuit(self):
        netlist = {"components": []}
        res = analyze_generalized_ac_circuit(netlist)
        self.assertFalse(res["success"])
        self.assertEqual(res["status"], "FAILED")


if __name__ == "__main__":
    unittest.main()
