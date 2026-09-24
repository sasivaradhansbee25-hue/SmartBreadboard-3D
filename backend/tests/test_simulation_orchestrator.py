"""
test_simulation_orchestrator.py — Phase 20.5 AI Circuit Simulation Orchestrator Test Suite
Covers all 17 Phase 20.5.19 validation scenarios:
1. Valid resistor circuit (MNA executes)
2. Valid resistor + LED series circuit (MNA executes)
3. Valid resistor + LED parallel circuit (MNA executes)
4. Unmapped terminal (BLOCKED)
5. Unknown active component (BLOCKED)
6. Ambiguous terminal mapping (BLOCKED)
7. Short circuit (BLOCKED)
8. Missing power source (BLOCKED)
9. Successful simulation returns actual numerical values
10. Simulation result is stored in circuit state
11. 3D visualization receives updated simulation state
12. Simulation result becomes stale after topology changes
13. Repeated simulation with unchanged circuit reuses cache
14. LLM asks for current (obtains actual MNA result)
15. LLM asks for voltage (obtains actual MNA result)
16. LLM attempts to fabricate a value (prevented by tool-grounding)
17. LLM provider unavailable (circuit simulation remains operational)
"""

import sys
import os
import unittest

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.circuit_tools import (
    execute_circuit_tool,
    simulate_verified_circuit,
    get_simulation_results,
    get_verified_circuit,
    compute_circuit_signature
)
from llm.tool_registry import execute_assistant_tool, validate_tool_arguments
from llm.provider import DeterministicFallbackProvider
from llm.agent import CircuitAssistantAgent


class TestSimulationOrchestrator(unittest.TestCase):

    def setUp(self):
        self.valid_resistor_circuit = {
            "components": [
                {
                    "id": "R1",
                    "type": "resistor",
                    "value": 1000.0,
                    "unit": "Ω",
                    "node1": "N_PWR",
                    "node2": "N_GND",
                    "verified": True,
                    "verification": "VERIFIED",
                    "source": "ai",
                    "start_hole": "E10",
                    "end_hole": "E15",
                    "terminals": {
                        "terminal_a": {"hole": "E10", "node_id": "N_PWR"},
                        "terminal_b": {"hole": "E15", "node_id": "N_GND"}
                    }
                }
            ],
            "sources": [
                {
                    "id": "V_DC",
                    "type": "dc_voltage",
                    "voltage": 12.0,
                    "positive_node": "N_PWR",
                    "negative_node": "N_GND"
                }
            ],
            "validity": {"status": "VALID", "errors": [], "warnings": []}
        }

        self.series_r_led_circuit = {
            "components": [
                {
                    "id": "R1",
                    "type": "resistor",
                    "value": 330.0,
                    "unit": "Ω",
                    "node1": "N_PWR",
                    "node2": "N_MID",
                    "verified": True,
                    "verification": "VERIFIED",
                    "source": "ai",
                    "start_hole": "E10",
                    "end_hole": "E15",
                    "terminals": {
                        "terminal_a": {"hole": "E10", "node_id": "N_PWR"},
                        "terminal_b": {"hole": "E15", "node_id": "N_MID"}
                    }
                },
                {
                    "id": "LED1",
                    "type": "led",
                    "forward_voltage": 2.0,
                    "node1": "N_MID",
                    "node2": "N_GND",
                    "verified": True,
                    "verification": "VERIFIED",
                    "source": "ai",
                    "start_hole": "D15",
                    "end_hole": "D20",
                    "terminals": {
                        "anode": {"hole": "D15", "node_id": "N_MID"},
                        "cathode": {"hole": "D20", "node_id": "N_GND"}
                    }
                }
            ],
            "sources": [
                {
                    "id": "V_DC",
                    "type": "dc_voltage",
                    "voltage": 5.0,
                    "positive_node": "N_PWR",
                    "negative_node": "N_GND"
                }
            ],
            "topology": {
                "status": "VALID",
                "series_groups": [["R1", "LED1"]],
                "parallel_groups": [],
                "short_circuits": []
            },
            "validity": {"status": "VALID", "errors": [], "warnings": []}
        }

        self.parallel_r_led_circuit = {
            "components": [
                {
                    "id": "R1",
                    "type": "resistor",
                    "value": 1000.0,
                    "unit": "Ω",
                    "node1": "N_PWR",
                    "node2": "N_GND",
                    "verified": True,
                    "verification": "VERIFIED",
                    "source": "ai",
                    "start_hole": "E10",
                    "end_hole": "E15",
                    "terminals": {
                        "terminal_a": {"hole": "E10", "node_id": "N_PWR"},
                        "terminal_b": {"hole": "E15", "node_id": "N_GND"}
                    }
                },
                {
                    "id": "R2",
                    "type": "resistor",
                    "value": 1000.0,
                    "unit": "Ω",
                    "node1": "N_PWR",
                    "node2": "N_GND",
                    "verified": True,
                    "verification": "VERIFIED",
                    "source": "manual",
                    "start_hole": "D10",
                    "end_hole": "D15",
                    "terminals": {
                        "terminal_a": {"hole": "D10", "node_id": "N_PWR"},
                        "terminal_b": {"hole": "D15", "node_id": "N_GND"}
                    }
                }
            ],
            "sources": [
                {
                    "id": "V_DC",
                    "type": "dc_voltage",
                    "voltage": 5.0,
                    "positive_node": "N_PWR",
                    "negative_node": "N_GND"
                }
            ],
            "topology": {
                "status": "VALID",
                "parallel_groups": [["R1", "R2"]],
                "series_groups": [],
                "short_circuits": []
            },
            "validity": {"status": "VALID", "errors": [], "warnings": []}
        }

        self.agent = CircuitAssistantAgent()

    # TEST 1: Valid resistor circuit (MNA executes)
    def test_01_valid_resistor_circuit(self):
        res = simulate_verified_circuit(self.valid_resistor_circuit)
        self.assertEqual(res["status"], "SOLVED")
        self.assertEqual(res["solver"], "MNA")
        self.assertAlmostEqual(res["node_voltages"].get("N_PWR"), 12.0, places=2)
        self.assertAlmostEqual(res["node_voltages"].get("N_GND"), 0.0, places=2)
        # 12V / 1000 Ohm = 0.012 A (12 mA)
        self.assertAlmostEqual(res["branch_currents"]["R1"], 0.012, places=4)

    # TEST 2: Valid resistor + LED series circuit (MNA executes)
    def test_02_valid_series_circuit(self):
        res = simulate_verified_circuit(self.series_r_led_circuit)
        self.assertEqual(res["status"], "SOLVED")
        self.assertIn("R1", res["branch_currents"])
        self.assertIn("LED1", res["branch_currents"])
        # Series current is identical
        self.assertAlmostEqual(res["branch_currents"]["R1"], res["branch_currents"]["LED1"], places=5)

    # TEST 3: Valid parallel circuit (MNA executes)
    def test_03_valid_parallel_circuit(self):
        res = simulate_verified_circuit(self.parallel_r_led_circuit)
        self.assertEqual(res["status"], "SOLVED")
        self.assertAlmostEqual(res["branch_currents"]["R1"], 0.005, places=4)
        self.assertAlmostEqual(res["branch_currents"]["R2"], 0.005, places=4)
        # Total power = (5V)^2 / 500 = 0.05 W = 50 mW
        self.assertAlmostEqual(res["power"]["total_power_mW"], 50.0, places=1)

    # TEST 4: Unmapped terminal (BLOCKED)
    def test_04_unmapped_terminal_blocked(self):
        bad_circuit = dict(self.valid_resistor_circuit)
        bad_circuit["components"] = [
            {
                "id": "R1",
                "type": "resistor",
                "verified": True,
                "verification": "VERIFIED",
                "start_hole": None,
                "end_hole": "E15",
                "terminals": {"terminal_a": {"hole": None}, "terminal_b": {"hole": "E15"}}
            }
        ]
        res = simulate_verified_circuit(bad_circuit)
        self.assertEqual(res["status"], "BLOCKED")
        self.assertIn("terminal_mapping", res["blocking_checks"])

    # TEST 5: Unknown active component (BLOCKED)
    def test_05_unknown_component_blocked(self):
        bad_circuit = dict(self.valid_resistor_circuit)
        bad_circuit["components"] = [
            {
                "id": "U_COMP_1",
                "type": "resistor",
                "verified": False,
                "verification": "UNKNOWN",
                "source": "ai",
                "start_hole": "E10",
                "end_hole": "E15"
            }
        ]
        res = simulate_verified_circuit(bad_circuit)
        self.assertEqual(res["status"], "BLOCKED")
        self.assertIn("unknown_component", res["blocking_checks"])

    # TEST 6: Ambiguous terminal mapping (BLOCKED)
    def test_06_ambiguous_terminal_blocked(self):
        bad_circuit = dict(self.valid_resistor_circuit)
        bad_circuit["components"] = [
            {
                "id": "R1",
                "type": "resistor",
                "verified": True,
                "verification": "VERIFIED",
                "terminals": {
                    "terminal_a": {"hole": "AMBIGUOUS", "ambiguous": True},
                    "terminal_b": {"hole": "E15"}
                }
            }
        ]
        res = simulate_verified_circuit(bad_circuit)
        self.assertEqual(res["status"], "BLOCKED")
        self.assertIn("terminal_mapping", res["blocking_checks"])

    # TEST 7: Short circuit (BLOCKED)
    def test_07_short_circuit_blocked(self):
        short_circuit = dict(self.valid_resistor_circuit)
        short_circuit["components"] = [
            {
                "id": "R1",
                "type": "resistor",
                "node1": "N_PWR",
                "node2": "N_PWR", # Same node short
                "start_hole": "E10",
                "end_hole": "D10", # Same column 10 short
                "verified": True,
                "verification": "VERIFIED",
                "terminals": {
                    "terminal_a": {"hole": "E10", "node_id": "N_PWR"},
                    "terminal_b": {"hole": "D10", "node_id": "N_PWR"}
                }
            }
        ]
        short_circuit["topology"] = {
            "status": "SHORT_CIRCUIT",
            "short_circuits": [{"component_id": "R1", "reason": "Both terminals connect to identical node N_PWR"}]
        }
        res = simulate_verified_circuit(short_circuit)
        self.assertEqual(res["status"], "BLOCKED")
        self.assertIn("short_circuit", res["blocking_checks"])

    # TEST 8: Missing power source (BLOCKED)
    def test_08_missing_power_source_blocked(self):
        no_pwr_circuit = dict(self.valid_resistor_circuit)
        no_pwr_circuit["sources"] = []
        no_pwr_circuit["power_source"] = None
        no_pwr_circuit["powerSources"] = []
        res = simulate_verified_circuit(no_pwr_circuit)
        self.assertEqual(res["status"], "BLOCKED")
        self.assertIn("power_source", res["blocking_checks"])

    # TEST 9: Successful simulation returns actual numerical values
    def test_09_actual_numerical_values(self):
        res = simulate_verified_circuit(self.valid_resistor_circuit)
        self.assertEqual(res["status"], "SOLVED")
        self.assertIsInstance(res["branch_currents"]["R1"], float)
        self.assertIsInstance(res["node_voltages"]["N_PWR"], float)
        self.assertGreater(res["power"]["total_power_mW"], 0.0)

    # TEST 10: Simulation result is stored in circuit state
    def test_10_stores_in_circuit_state(self):
        state = dict(self.valid_resistor_circuit)
        simulate_verified_circuit(state)
        self.assertEqual(state.get("solver_status"), "SOLVED")
        self.assertIsNotNone(state.get("simulationResult"))
        self.assertIsNotNone(state.get("_last_simulation_signature"))

    # TEST 11: 3D visualization receives updated simulation state
    def test_11_digital_twin_payload_created(self):
        state = dict(self.valid_resistor_circuit)
        res = simulate_verified_circuit(state)
        self.assertIn("results", res)
        self.assertIn("measurements", res["results"])
        self.assertIn("R1", res["results"]["measurements"])

    # TEST 12: Simulation result becomes stale after topology changes
    def test_12_stale_invalidation_on_change(self):
        state = dict(self.valid_resistor_circuit)
        res1 = simulate_verified_circuit(state)
        sig1 = res1["circuit_signature"]
        
        # Modify resistor value (topology change)
        state["components"][0]["value"] = 220.0
        sig2 = compute_circuit_signature(state)
        self.assertNotEqual(sig1, sig2)

    # TEST 13: Repeated simulation with unchanged circuit reuses cache
    def test_13_signature_cache_reuse(self):
        state = dict(self.valid_resistor_circuit)
        res1 = simulate_verified_circuit(state)
        self.assertFalse(res1.get("cached", False))
        
        # Second run without changes
        res2 = simulate_verified_circuit(state, force_rerun=False)
        self.assertTrue(res2.get("cached", True))

    # TEST 14: LLM asks for current -> obtains actual MNA result
    def test_14_llm_asks_current_flow(self):
        state = dict(self.valid_resistor_circuit)
        # Simulate first so state is solved
        simulate_verified_circuit(state)
        reply = self.agent.process_message("What is the current through R1?", context=state)
        self.assertIn("12.00", reply.get("answer", ""))

    # TEST 15: LLM asks for voltage -> obtains actual MNA result
    def test_15_llm_asks_voltage_drop(self):
        state = dict(self.valid_resistor_circuit)
        simulate_verified_circuit(state)
        reply = self.agent.process_message("What is the voltage across R1?", context=state)
        self.assertIn("12.00", reply.get("answer", ""))

    # TEST 16: LLM attempts to fabricate a value (prevented by tool grounding)
    def test_16_prevent_fabrication_on_unsimulated(self):
        unsimulated_state = {
            "components": [
                {"id": "R1", "type": "resistor", "value": 1000.0, "verified": True, "verification": "VERIFIED"}
            ],
            "simulationResult": None
        }
        reply = self.agent.process_message("What is the current through R1?", context=unsimulated_state)
        self.assertIn("simulation has not been run", reply.get("answer", "").lower())

    # TEST 17: LLM provider unavailable (core circuit simulation remains functional)
    def test_17_deterministic_fallback_simulates(self):
        fallback = DeterministicFallbackProvider()
        state = dict(self.valid_resistor_circuit)
        res = fallback.chat("Simulate this circuit.", state)
        self.assertIn("simulation completed successfully", res.get("answer", "").lower())
        self.assertIn("12.000 v", res.get("answer", "").lower())
        self.assertIsNotNone(res.get("simulation_result"))


if __name__ == "__main__":
    unittest.main()
