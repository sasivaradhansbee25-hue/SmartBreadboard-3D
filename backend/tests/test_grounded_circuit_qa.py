"""
test_grounded_circuit_qa.py — Phase 22.4 Grounded AI Circuit Q&A Test Suite
Strict deterministic verification of all 26 required test cases:

1. Component info.
2. Unknown component.
3. Component connections.
4. Node info.
5. Unknown node.
6. Topology question.
7. Simulation current.
8. Simulation voltage.
9. Simulation power.
10. NOT_RUN simulation.
11. Stale simulation.
12. Blocked circuit.
13. Unknown component explanation.
14. Ambiguous terminal explanation.
15. Rejected detection exclusion.
16. Visual location query.
17. Highlight component action.
18. Highlight node action.
19. Invalid highlight target.
20. Combined visual + simulation question.
21. Follow-up question.
22. Circuit signature refresh.
23. No fabricated values.
24. No fabricated coordinates.
25. No circuit mutation.
26. MNA values used instead of LLM calculations.
"""

import sys
import os
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from llm.agent import CircuitAssistantAgent
from core.circuit_tools import compute_circuit_signature


class TestGroundedCircuitQA(unittest.TestCase):

    def setUp(self):
        self.agent = CircuitAssistantAgent()
        
        # Base realistic verified circuit with 3 components (R1, LED1, W1)
        self.verified_circuit = {
            "circuit_signature": "sig_base_verified_123",
            "simulation_signature": "sig_base_verified_123",
            "components": [
                {
                    "id": "R1",
                    "type": "resistor",
                    "value": 220.0,
                    "unit": "Ω",
                    "verified": True,
                    "verification": "VERIFIED",
                    "start_hole": "E10",
                    "end_hole": "E15",
                    "terminals": {
                        "terminal_a": {"hole": "E10", "node_id": "NODE_1", "electrical_node": "NODE_1"},
                        "terminal_b": {"hole": "E15", "node_id": "NODE_2", "electrical_node": "NODE_2"}
                    }
                },
                {
                    "id": "LED1",
                    "type": "led",
                    "value": None,
                    "unit": "",
                    "verified": True,
                    "verification": "VERIFIED",
                    "start_hole": "E15",
                    "end_hole": "E20",
                    "terminals": {
                        "terminal_a": {"hole": "E15", "node_id": "NODE_2", "electrical_node": "NODE_2"},
                        "terminal_b": {"hole": "E20", "node_id": "NODE_GND", "electrical_node": "NODE_GND"}
                    }
                },
                {
                    "id": "W1",
                    "type": "wire",
                    "value": 0.0,
                    "unit": "Ω",
                    "verified": True,
                    "verification": "VERIFIED",
                    "start_hole": "E15",
                    "end_hole": "F15",
                    "terminals": {
                        "terminal_a": {"hole": "E15", "node_id": "NODE_2", "electrical_node": "NODE_2"},
                        "terminal_b": {"hole": "F15", "node_id": "NODE_2", "electrical_node": "NODE_2"}
                    }
                }
            ],
            "nodes": [
                {"id": "NODE_1", "holes": ["E10"], "connected_pins": ["R1.A"]},
                {"id": "NODE_2", "holes": ["E15", "F15"], "connected_pins": ["R1.B", "LED1.A", "W1.A", "W1.B"]},
                {"id": "NODE_GND", "holes": ["E20"], "connected_pins": ["LED1.B"]}
            ],
            "topology": {
                "status": "VALID",
                "series_groups": [["R1", "LED1"]],
                "parallel_groups": [],
                "short_circuits": []
            },
            "electrical_analysis": {
                "circuit_signature": "sig_base_verified_123",
                "solver_status": "SOLVED",
                "node_voltages": {
                    "NODE_1": 5.0,
                    "NODE_2": 2.13,
                    "NODE_GND": 0.0
                },
                "branch_currents": {
                    "R1": 0.01304,
                    "LED1": 0.01304
                },
                "component_powers": {
                    "R1": 0.0374,
                    "LED1": 0.0277
                }
            },
            "vision_verification": {
                "rejected": [
                    {"id": "REJ_CAND_99", "candidate_id": "REJ_CAND_99", "verification": "REJECTED"}
                ]
            }
        }
        # Update signature dynamically to match fixture
        self.verified_circuit["circuit_signature"] = compute_circuit_signature(self.verified_circuit)
        self.verified_circuit["electrical_analysis"]["circuit_signature"] = self.verified_circuit["circuit_signature"]

    # 1. Component info
    def test_01_component_info(self):
        res = self.agent.process_message("What is R1?", context=self.verified_circuit)
        ans = res.get("answer", "")
        self.assertIn("R1", ans)
        self.assertIn("220", ans)
        self.assertIn("resistor", ans.lower())
        self.assertIn("E10", ans)
        self.assertIn("E15", ans)

    # 2. Unknown component
    def test_02_unknown_component(self):
        res = self.agent.process_message("What is R99?", context=self.verified_circuit)
        ans = res.get("answer", "")
        self.assertIn("R99", ans)
        self.assertIn("not present in the current verified circuit", ans)

    # 3. Component connections
    def test_03_component_connections(self):
        res = self.agent.process_message("What is connected to R1?", context=self.verified_circuit)
        ans = res.get("answer", "")
        self.assertIn("R1", ans)
        # Connected to LED1 / W1 at hole E15
        self.assertTrue("LED1" in ans or "W1" in ans or "terminal" in ans.lower())

    # 4. Node info
    def test_04_node_info(self):
        res = self.agent.process_message("What is connected to NODE_2?", context=self.verified_circuit)
        ans = res.get("answer", "")
        self.assertIn("NODE_2", ans)
        self.assertTrue("R1.B" in ans or "LED1.A" in ans or "terminal" in ans.lower())
        self.assertIn("2.13", ans)

    # 5. Unknown node
    def test_05_unknown_node(self):
        res = self.agent.process_message("What is connected to NODE_99?", context=self.verified_circuit)
        ans = res.get("answer", "")
        self.assertIn("NODE_99", ans)
        self.assertIn("not present in the current verified circuit", ans)

    # 6. Topology question
    def test_06_topology_question(self):
        res = self.agent.process_message("Which components are in series?", context=self.verified_circuit)
        ans = res.get("answer", "")
        self.assertIn("series", ans.lower())
        self.assertTrue("R1" in ans or "LED1" in ans)

    # 7. Simulation current
    def test_07_simulation_current(self):
        res = self.agent.process_message("What is the current through R1?", context=self.verified_circuit)
        ans = res.get("answer", "")
        self.assertIn("13.04", ans)
        self.assertIn("MNA", ans)

    # 8. Simulation voltage
    def test_08_simulation_voltage(self):
        res = self.agent.process_message("What is the voltage across R1?", context=self.verified_circuit)
        ans = res.get("answer", "")
        # V = 5.0 - 2.13 = 2.87 V
        self.assertIn("2.87", ans)
        self.assertIn("MNA", ans)

    # 9. Simulation power
    def test_09_simulation_power(self):
        res = self.agent.process_message("What is the power of R1?", context=self.verified_circuit)
        ans = res.get("answer", "")
        self.assertIn("37.40", ans)
        self.assertIn("MNA", ans)

    # 10. NOT_RUN simulation
    def test_10_not_run_simulation(self):
        ctx = dict(self.verified_circuit)
        ctx["electrical_analysis"] = None
        ctx["simulationResult"] = None
        res = self.agent.process_message("What is the current through R1?", context=ctx)
        ans = res.get("answer", "")
        self.assertTrue("not been simulated yet" in ans.lower() or "not been run yet" in ans.lower())

    # 11. Stale simulation
    def test_11_stale_simulation(self):
        ctx = dict(self.verified_circuit)
        ctx["simulation_signature"] = "stale_outdated_signature_abc"
        ctx["circuit_signature"] = "fresh_new_signature_xyz"
        if ctx.get("electrical_analysis"):
            ctx["electrical_analysis"] = dict(ctx["electrical_analysis"])
            ctx["electrical_analysis"]["circuit_signature"] = "stale_outdated_signature_abc"
        res = self.agent.process_message("What is the current through R1?", context=ctx)
        ans = res.get("answer", "")
        self.assertIn("stale", ans.lower())

    # 12. Blocked circuit
    def test_12_blocked_circuit(self):
        ctx = dict(self.verified_circuit)
        ctx["validity"] = {
            "status": "INVALID",
            "errors": ["Floating pin detected on R1 terminal A."]
        }
        res = self.agent.process_message("Why is my circuit blocked?", context=ctx)
        ans = res.get("answer", "")
        self.assertIn("Floating pin", ans)

    # 13. Unknown component explanation
    def test_13_unknown_component_explanation(self):
        ctx = dict(self.verified_circuit)
        ctx["components"] = list(ctx["components"]) + [{
            "id": "UNK_1",
            "type": "unknown",
            "verification": "UNKNOWN",
            "verified": False,
            "start_hole": "A1",
            "end_hole": "A5"
        }]
        res = self.agent.process_message("What is UNK_1?", context=ctx)
        ans = res.get("answer", "")
        self.assertIn("UNKNOWN", ans)
        self.assertIn("don't have a verified value", ans)

    # 14. Ambiguous terminal explanation
    def test_14_ambiguous_terminal_explanation(self):
        ctx = dict(self.verified_circuit)
        ctx["components"] = [
            {
                "id": "R_AMB",
                "type": "resistor",
                "value": 100.0,
                "unit": "Ω",
                "verified": True,
                "verification": "VERIFIED",
                "start_hole": "E10",
                "end_hole": "AMBIGUOUS"
            }
        ]
        res = self.agent.process_message("Where is R_AMB?", context=ctx)
        ans = res.get("answer", "")
        self.assertIn("ambiguous", ans.lower())

    # 15. Rejected detection exclusion
    def test_15_rejected_detection_exclusion(self):
        res = self.agent.process_message("What is REJ_CAND_99?", context=self.verified_circuit)
        ans = res.get("answer", "")
        self.assertIn("rejected", ans.lower())
        self.assertIn("not part of the verified circuit", ans.lower())

    # 16. Visual location query
    def test_16_visual_location_query(self):
        res = self.agent.process_message("Where is R1?", context=self.verified_circuit)
        ans = res.get("answer", "")
        self.assertIn("E10", ans)
        self.assertIn("E15", ans)
        # Ensure no pixel / screen coordinates are present
        self.assertNotIn("px", ans.lower())
        self.assertNotIn("screen_x", ans.lower())

    # 17. Highlight component action
    def test_17_highlight_component_action(self):
        res = self.agent.process_message("Highlight R1", context=self.verified_circuit)
        self.assertEqual(res.get("action"), "HIGHLIGHT_COMPONENT")
        self.assertEqual(res.get("component_id"), "R1")

    # 18. Highlight node action
    def test_18_highlight_node_action(self):
        res = self.agent.process_message("Highlight NODE_2", context=self.verified_circuit)
        self.assertEqual(res.get("action"), "HIGHLIGHT_NODE")
        self.assertEqual(res.get("node_id"), "NODE_2")

    # 19. Invalid highlight target
    def test_19_invalid_highlight_target(self):
        res = self.agent.process_message("Highlight R99", context=self.verified_circuit)
        ans = res.get("answer", "")
        self.assertIn("R99", ans)
        self.assertIn("not present in the current verified circuit", ans)
        self.assertIsNone(res.get("action"))

    # 20. Combined visual + simulation question
    def test_20_combined_visual_plus_simulation_question(self):
        res = self.agent.process_message("Where is R1 and what is its current?", context=self.verified_circuit)
        ans = res.get("answer", "")
        self.assertIn("E10", ans)
        self.assertIn("E15", ans)
        self.assertIn("13.04", ans)

    # 21. Follow-up question
    def test_21_follow_up_question(self):
        history = [
            {"role": "user", "content": "What is R1?"},
            {"role": "assistant", "content": "R1 is a 220 Ω resistor mapped to E10 and E15."}
        ]
        res = self.agent.process_message("What is connected to it?", context=self.verified_circuit, conversation_history=history)
        ans = res.get("answer", "")
        self.assertIn("R1", ans)
        self.assertTrue("connected" in ans.lower())

    # 22. Circuit signature refresh
    def test_22_circuit_signature_refresh(self):
        sig1 = compute_circuit_signature(self.verified_circuit)
        ctx2 = dict(self.verified_circuit)
        ctx2["components"] = list(ctx2["components"]) + [{
            "id": "R2",
            "type": "resistor",
            "value": 1000.0,
            "unit": "Ω",
            "verified": True,
            "verification": "VERIFIED",
            "start_hole": "G10",
            "end_hole": "G15"
        }]
        sig2 = compute_circuit_signature(ctx2)
        self.assertNotEqual(sig1, sig2)

    # 23. No fabricated values
    def test_23_no_fabricated_values(self):
        res = self.agent.process_message("What is the current through R99?", context=self.verified_circuit)
        ans = res.get("answer", "")
        self.assertIn("R99", ans)
        self.assertNotIn("mA", ans)

    # 24. No fabricated coordinates
    def test_24_no_fabricated_coordinates(self):
        res = self.agent.process_message("Where is LED1 placed?", context=self.verified_circuit)
        ans = res.get("answer", "")
        self.assertIn("E15", ans)
        self.assertIn("E20", ans)
        # Ensure no pixel (x,y) screen coordinates
        self.assertNotIn("x=", ans)
        self.assertNotIn("y=", ans)

    # 25. No circuit mutation
    def test_25_no_circuit_mutation(self):
        res = self.agent.process_message("Add a 500 ohm resistor between A1 and A5", context=self.verified_circuit)
        ans = res.get("answer", "")
        self.assertIn("Read-Only", ans)

    # 26. MNA values used instead of LLM calculations
    def test_26_mna_values_used_instead_of_llm_calculations(self):
        res = self.agent.process_message("What is the current through LED1?", context=self.verified_circuit)
        ans = res.get("answer", "")
        self.assertIn("13.04", ans)
        self.assertIn("MNA", ans)


if __name__ == "__main__":
    unittest.main()
