"""
test_llm_circuit_assistant.py - Phase 20 LLM Circuit Assistant Test Suite
Covers all 15 Phase 20.16 validation scenarios:
1. Unknown component question
2. Unknown hole mapping
3. Missing simulation
4. Invalid circuit
5. Missing power source
6. Verified parallel branches
7. Verified series branches
8. Real simulation current
9. Real simulation voltage
10. Real fault diagnosis
11. Manual component provenance
12. Tool failure handling
13. LLM provider failure fallback
14. Invalid tool arguments schema validation
15. Attempted unsupported write action
"""

import sys
import os
import unittest

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.circuit_tools import (
    execute_circuit_tool,
    get_verified_circuit,
    get_component,
    get_topology,
    get_simulation_results,
    get_faults,
    get_hole_mapping
)
from llm.tool_registry import execute_assistant_tool, validate_tool_arguments, get_tool_definitions
from llm.provider import LLMProvider, DeterministicFallbackProvider
from llm.agent import CircuitAssistantAgent
from llm.prompts import SYSTEM_PROMPT, STRICT_NEGATIVE_CONSTRAINTS


class TestLLMCircuitAssistant(unittest.TestCase):

    def setUp(self):
        # Base realistic verified circuit fixture
        self.verified_circuit_context = {
            "components": [
                {
                    "id": "R1",
                    "type": "resistor",
                    "value": 220.0,
                    "unit": "Ω",
                    "verified": True,
                    "verification": "VERIFIED",
                    "source": "ai",
                    "terminals": {
                        "terminal_a": {"hole": "E10", "node_id": "N_PWR"},
                        "terminal_b": {"hole": "E15", "node_id": "N_MID"}
                    }
                },
                {
                    "id": "LED1",
                    "type": "led",
                    "forward_voltage": 2.0,
                    "verified": True,
                    "verification": "VERIFIED",
                    "source": "ai",
                    "terminals": {
                        "anode": {"hole": "D15", "node_id": "N_MID"},
                        "cathode": {"hole": "D20", "node_id": "N_GND"}
                    }
                },
                {
                    "id": "R2",
                    "type": "resistor",
                    "value": 1000.0,
                    "unit": "Ω",
                    "verified": True,
                    "verification": "VERIFIED",
                    "source": "manual",
                    "terminals": {
                        "terminal_a": {"hole": "C10", "node_id": "N_PWR"},
                        "terminal_b": {"hole": "C15", "node_id": "N_MID"}
                    }
                }
            ],
            "topology": {
                "status": "VALID",
                "parallel_groups": [["R1", "R2"]],
                "series_groups": [],
                "short_circuits": []
            },
            "node_graph": {
                "nodes": [
                    {"node_id": "N_PWR", "components": ["R1", "R2"]},
                    {"node_id": "N_MID", "components": ["R1", "R2", "LED1"]},
                    {"node_id": "N_GND", "components": ["LED1"]}
                ]
            },
            "simulationResult": {
                "success": True,
                "node_voltages": {
                    "N_PWR": 5.0,
                    "N_MID": 2.1,
                    "N_GND": 0.0
                },
                "branch_currents": {
                    "R1": 0.01318, # 13.18 mA
                    "R2": 0.0029,  # 2.9 mA
                    "LED1": 0.01608 # 16.08 mA
                },
                "component_powers": {
                    "R1": 0.0382,
                    "R2": 0.0084,
                    "LED1": 0.0337
                }
            },
            "validity": {
                "status": "VALID",
                "errors": [],
                "warnings": []
            }
        }
        self.agent = CircuitAssistantAgent()

    # Test 1: Unknown component question
    def test_01_unknown_component_question(self):
        context = {
            "components": [
                {"id": "U_COMP_1", "type": "resistor", "verification": "UNKNOWN", "verified": False}
            ]
        }
        res = execute_assistant_tool("get_component", context, {"component_id": "U_COMP_1"})
        self.assertFalse(res.get("verified"))
        self.assertEqual(res.get("verification"), "UNKNOWN")
        
        reply = self.agent.process_message("What is U_COMP_1?", context=context)
        self.assertIn("not verified", reply.get("answer", "").lower())

    # Test 2: Unknown / Ambiguous hole mapping
    def test_02_unknown_hole_mapping(self):
        context = {
            "components": [
                {
                    "id": "R1",
                    "verified": True,
                    "verification": "VERIFIED",
                    "terminals": {
                        "terminal_a": {"hole": "AMBIGUOUS", "node_id": None, "ambiguous": True},
                        "terminal_b": {"hole": "UNKNOWN", "node_id": None}
                    }
                }
            ]
        }
        res = execute_assistant_tool("get_hole_mapping", context, {"component_id": "R1"})
        self.assertTrue(res.get("has_ambiguity"))
        
        reply = self.agent.process_message("Which hole is R1 connected to?", context=context)
        self.assertTrue("ambiguous" in reply.get("answer", "").lower() or "not mapped" in reply.get("answer", "").lower())

    # Test 3: Missing simulation
    def test_03_missing_simulation(self):
        context = {
            "components": [{"id": "R1", "verified": True}],
            "simulationResult": None
        }
        res = execute_assistant_tool("get_simulation_results", context)
        self.assertFalse(res.get("has_simulation"))
        
        reply = self.agent.process_message("What is the current through R1?", context=context)
        self.assertIn("simulation has not been run", reply.get("answer", "").lower())

    # Test 4: Invalid circuit
    def test_04_invalid_circuit(self):
        context = {
            "components": [{"id": "R1", "verified": True}],
            "validity": {
                "status": "INVALID",
                "errors": ["Floating node detected: N2 has only 1 terminal."],
                "warnings": []
            }
        }
        res = execute_assistant_tool("get_faults", context)
        self.assertFalse(res.get("valid"))
        self.assertEqual(len(res.get("errors")), 1)
        
        reply = self.agent.process_message("Why is my circuit invalid?", context=context)
        self.assertIn("floating node", reply.get("answer", "").lower())

    # Test 5: Missing power source
    def test_05_missing_power_source(self):
        context = {
            "components": [
                {"id": "R1", "verified": True},
                {"id": "LED1", "verified": True}
            ],
            "validity": {
                "status": "INVALID",
                "errors": ["No active DC/AC power source found in circuit netlist."],
                "warnings": []
            }
        }
        reply = self.agent.process_message("Why is the circuit not working?", context=context)
        self.assertIn("power source", reply.get("answer", "").lower())

    # Test 6: Verified parallel branches
    def test_06_verified_parallel_branches(self):
        reply = self.agent.process_message("Which components are parallel?", context=self.verified_circuit_context)
        self.assertIn("parallel", reply.get("answer", "").lower())
        self.assertIn("r1", reply.get("answer", "").lower())
        self.assertIn("r2", reply.get("answer", "").lower())

    # Test 7: Verified series branches
    def test_07_verified_series_branches(self):
        context = dict(self.verified_circuit_context)
        context["topology"] = {
            "status": "VALID",
            "series_groups": [["R1", "LED1"]],
            "parallel_groups": [],
            "short_circuits": []
        }
        reply = self.agent.process_message("Which components are in series?", context=context)
        self.assertIn("series", reply.get("answer", "").lower())
        self.assertIn("r1", reply.get("answer", "").lower())

    # Test 8: Real simulation current
    def test_08_real_simulation_current(self):
        reply = self.agent.process_message("What is the current through R1?", context=self.verified_circuit_context)
        # Should reference ~13.18 mA or 0.01318 A
        self.assertTrue("13.18" in reply.get("answer", "") or "0.013" in reply.get("answer", ""))

    # Test 9: Real simulation voltage
    def test_09_real_simulation_voltage(self):
        reply = self.agent.process_message("What is the voltage across LED1?", context=self.verified_circuit_context)
        # LED1 is between N_MID (2.1V) and N_GND (0.0V) -> 2.1V
        self.assertIn("2.1", reply.get("answer", ""))

    # Test 10: Real fault diagnosis (Short Circuit)
    def test_10_real_fault_diagnosis(self):
        context = dict(self.verified_circuit_context)
        context["topology"] = {
            "status": "SHORT_CIRCUIT",
            "short_circuits": [
                {"component_id": "R1", "node": "N1", "reason": "Both terminals connect to identical node N1"}
            ],
            "series_groups": [],
            "parallel_groups": []
        }
        reply = self.agent.process_message("Is there a short circuit?", context=context)
        self.assertIn("short circuit", reply.get("answer", "").lower())
        self.assertIn("r1", reply.get("answer", "").lower())

    # Test 11: Manual component provenance
    def test_11_manual_component_provenance(self):
        res = execute_assistant_tool("get_component", self.verified_circuit_context, {"component_id": "R2"})
        self.assertEqual(res.get("source"), "manual")
        
        reply = self.agent.process_message("What is R2?", context=self.verified_circuit_context)
        self.assertIn("manual", reply.get("answer", "").lower())

    # Test 12: Tool failure handling
    def test_12_tool_failure_handling(self):
        # Calling tool with invalid component_id
        res = execute_assistant_tool("get_component", self.verified_circuit_context, {"component_id": "NON_EXISTENT_99"})
        self.assertFalse(res.get("found"))
        self.assertIn("error", res)

    # Test 13: LLM provider failure fallback
    def test_13_llm_provider_fallback(self):
        # Fallback provider handles queries deterministically even with 0 external API availability
        fallback = DeterministicFallbackProvider()
        res = fallback.chat("What is connected to R1?", self.verified_circuit_context)
        self.assertIsNotNone(res.get("answer"))
        self.assertTrue(len(res.get("tool_calls")) > 0)

    # Test 14: Invalid tool arguments schema validation
    def test_14_invalid_tool_arguments_schema(self):
        is_valid, err = validate_tool_arguments("get_component", {}) # missing required component_id
        self.assertFalse(is_valid)
        self.assertIn("Missing required parameter", err)

    # Test 15: Attempted unsupported write action
    def test_15_attempted_unsupported_write_action(self):
        # LLM must not directly mutate; it returns explicit parameter confirmation
        reply = self.agent.process_message("Add a 220 ohm resistor between N1 and N2", context=self.verified_circuit_context)
        answer = reply.get("answer", "").lower()
        self.assertTrue("cannot directly mutate" in answer or "confirm" in answer or "read-only" in answer or "manual component" in answer)


if __name__ == "__main__":
    unittest.main()
