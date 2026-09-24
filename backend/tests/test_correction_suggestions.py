"""
SmartBreadboard 3D — Unit Tests for Deterministic Correction Suggestions & Ambiguity Resolution
Tests end-to-end flow:
Vision/Hole Mapping Ambiguity -> LLM Assistant Diagnosis -> Deterministic Correction Suggestion -> User Confirmation Action Payload
"""

import unittest
from core.circuit_tools import (
    get_correction_suggestions,
    execute_circuit_tool,
    AVAILABLE_CIRCUIT_TOOLS
)
from llm.tool_registry import validate_and_execute_tool, validate_tool_arguments
from llm.provider import DeterministicFallbackProvider
from llm.agent import CircuitAssistantAgent


class TestCorrectionSuggestions(unittest.TestCase):

    def setUp(self):
        self.ambiguous_circuit = {
            "netlist": {
                "circuit_id": "test_ambig_circ",
                "components": [
                    {
                        "id": "R1",
                        "type": "resistor",
                        "value": 1000.0,
                        "unit": "Ω",
                        "start_hole": "E10",
                        "end_hole": "AMBIGUOUS",
                        "terminals": {
                            "terminal_a": {"hole": "E10", "ambiguous": False},
                            "terminal_b": {"hole": "AMBIGUOUS", "ambiguous": True, "candidate_holes": ["E15", "D15"]}
                        },
                        "verification": "VERIFIED"
                    },
                    {
                        "id": "U_COMP_1",
                        "type": "unknown",
                        "value": None,
                        "start_hole": "E15",
                        "end_hole": "E20",
                        "verification": "UNKNOWN",
                        "source": "unknown"
                    },
                    {
                        "id": "R_SHORT",
                        "type": "resistor",
                        "value": 220.0,
                        "unit": "Ω",
                        "start_hole": "A5",
                        "end_hole": "A5",
                        "verification": "VERIFIED"
                    }
                ],
                "sources": [
                    {
                        "id": "V1",
                        "voltage": 5.0,
                        "positive_node": "E10",
                        "negative_node": "E20"
                    }
                ]
            }
        }

    def test_get_correction_suggestions_ambiguous_terminals(self):
        res = get_correction_suggestions(self.ambiguous_circuit, component_id="R1")
        self.assertEqual(res.get("status"), "success")
        self.assertEqual(res.get("suggestions_count"), 1)
        sugg = res.get("suggestions")[0]
        self.assertEqual(sugg.get("component_id"), "R1")
        self.assertEqual(sugg.get("issue"), "ambiguous_terminals")
        self.assertEqual(sugg.get("suggested_start_hole"), "E10")
        self.assertEqual(sugg.get("suggested_end_hole"), "E15")
        self.assertEqual(sugg.get("action"), "update_component_terminals")
        self.assertEqual(sugg.get("action_payload", {}).get("hole2"), "E15")

    def test_get_correction_suggestions_unknown_component(self):
        res = get_correction_suggestions(self.ambiguous_circuit, component_id="U_COMP_1")
        self.assertEqual(res.get("status"), "success")
        self.assertEqual(res.get("suggestions_count"), 1)
        sugg = res.get("suggestions")[0]
        self.assertEqual(sugg.get("component_id"), "U_COMP_1")
        self.assertEqual(sugg.get("issue"), "unknown_component")
        self.assertTrue(sugg.get("requires_user_definition"))
        self.assertIsNone(sugg.get("suggested_type"))
        self.assertIsNone(sugg.get("suggested_value"))
        self.assertEqual(sugg.get("suggested_start_hole"), "E15")
        self.assertEqual(sugg.get("suggested_end_hole"), "E20")

    def test_get_correction_suggestions_short_circuit(self):
        res = get_correction_suggestions(self.ambiguous_circuit, component_id="R_SHORT")
        self.assertEqual(res.get("status"), "success")
        self.assertEqual(res.get("suggestions_count"), 1)
        sugg = res.get("suggestions")[0]
        self.assertEqual(sugg.get("component_id"), "R_SHORT")
        self.assertEqual(sugg.get("issue"), "short_circuit")
        self.assertEqual(sugg.get("status"), "BLOCKED")
        self.assertEqual(sugg.get("action"), "none")
        self.assertEqual(sugg.get("suggested_start_hole"), sugg.get("suggested_end_hole"))

    def test_tool_registry_validation_and_execution(self):
        is_valid, err = validate_tool_arguments("get_correction_suggestions", {"component_id": "R1"})
        self.assertTrue(is_valid)
        self.assertIsNone(err)

        res = validate_and_execute_tool("get_correction_suggestions", {"component_id": "R1"}, self.ambiguous_circuit)
        self.assertEqual(res.get("status"), "success")
        self.assertEqual(len(res.get("suggestions", [])), 1)

    def test_simulation_blocked_auto_suggestions(self):
        provider = DeterministicFallbackProvider()
        res = provider.generate_response("Simulate this circuit", self.ambiguous_circuit)
        self.assertIn("cannot run the simulation yet", res.get("answer"))
        self.assertTrue(len(res.get("suggestions", [])) >= 1)

    def test_user_query_for_fixing_ambiguity(self):
        provider = DeterministicFallbackProvider()
        res = provider.generate_response("How do I fix ambiguous mappings?", self.ambiguous_circuit)
        self.assertIn("ambiguous mappings", res.get("answer"))
        self.assertTrue(len(res.get("suggestions", [])) >= 1)

    def test_assistant_agent_session_turn(self):
        agent = CircuitAssistantAgent(session_id="test_turn_session")
        res = agent.process_message("What suggestions do you have for R1?", self.ambiguous_circuit)
        self.assertIn("R1", res.get("answer"))
        self.assertTrue(len(res.get("suggestions", [])) >= 1)


if __name__ == "__main__":
    unittest.main()
