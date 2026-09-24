"""
SmartBreadboard 3D — Comprehensive Unit Tests for Phase 22.1 Visual Grounding Data Model
Verifies deterministic grounding construction, provenance, separation of physical vs electrical,
diagnostics, simulation grounding, rejected detections, and LLM tool integration.
"""

import unittest
from core.visual_grounding import build_visual_grounding_state, parse_hole_metadata
from core.circuit_tools import execute_circuit_tool, compute_circuit_signature
from main import app
from fastapi.testclient import TestClient


class TestVisualGroundingDataModel(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)

    # 1. Empty Circuit
    def test_empty_circuit(self):
        state = build_visual_grounding_state({})
        self.assertEqual(state["schema_version"], "22.1")
        self.assertEqual(state["overall_status"], "UNKNOWN")
        self.assertEqual(len(state["components"]), 0)
        self.assertEqual(state["summary"]["component_count"], 0)

    # 2. Single Verified Resistor
    def test_single_verified_resistor(self):
        circuit = {
            "components": [
                {
                    "id": "R1",
                    "type": "resistor",
                    "value": 220.0,
                    "unit": "Ω",
                    "start_hole": "E10",
                    "end_hole": "E15",
                    "source": "ai",
                    "verification": "VERIFIED"
                }
            ]
        }
        vg = build_visual_grounding_state(circuit)
        self.assertEqual(vg["overall_status"], "VERIFIED")
        self.assertEqual(len(vg["components"]), 1)
        r1 = vg["components"][0]
        self.assertEqual(r1["id"], "R1")
        self.assertEqual(r1["value"], 220.0)
        self.assertEqual(r1["status"], "VERIFIED")
        self.assertEqual(r1["terminals"]["terminal_a"]["hole"], "E10")
        self.assertEqual(r1["terminals"]["terminal_b"]["hole"], "E15")
        self.assertEqual(len(vg["connections"]), 2)

    # 3. Resistor + LED
    def test_resistor_plus_led(self):
        circuit = {
            "components": [
                {"id": "R1", "type": "resistor", "value": 330.0, "start_hole": "E10", "end_hole": "E15", "verification": "VERIFIED"},
                {"id": "LED1", "type": "led", "value": 2.0, "start_hole": "E15", "end_hole": "E20", "verification": "VERIFIED"}
            ]
        }
        vg = build_visual_grounding_state(circuit)
        self.assertEqual(vg["summary"]["verified_components"], 2)
        self.assertEqual(len(vg["nodes"]), 3)

    # 4. Parallel Topology
    def test_parallel_components(self):
        circuit = {
            "components": [
                {"id": "R1", "type": "resistor", "value": 1000.0, "start_hole": "E10", "end_hole": "E15", "verification": "VERIFIED"},
                {"id": "R2", "type": "resistor", "value": 1000.0, "start_hole": "D10", "end_hole": "D15", "verification": "VERIFIED"}
            ]
        }
        vg = build_visual_grounding_state(circuit)
        par_groups = vg["topology"].get("parallel_groups", [])
        self.assertTrue(len(par_groups) >= 1)

    # 5. Series Topology
    def test_series_components(self):
        circuit = {
            "components": [
                {"id": "R1", "type": "resistor", "value": 1000.0, "start_hole": "E10", "end_hole": "E15", "verification": "VERIFIED"},
                {"id": "R2", "type": "resistor", "value": 1000.0, "start_hole": "E15", "end_hole": "E20", "verification": "VERIFIED"}
            ]
        }
        vg = build_visual_grounding_state(circuit)
        ser_groups = vg["topology"].get("series_groups", [])
        self.assertTrue(len(ser_groups) >= 1)

    # 6. Ambiguous Terminal
    def test_ambiguous_terminal(self):
        circuit = {
            "components": [
                {
                    "id": "R1",
                    "type": "resistor",
                    "value": 1000.0,
                    "start_hole": "E10",
                    "end_hole": "AMBIGUOUS",
                    "terminals": {"terminal_a": {"hole": "E10"}, "terminal_b": {"hole": "AMBIGUOUS", "ambiguous": True}},
                    "verification": "VERIFIED"
                }
            ]
        }
        vg = build_visual_grounding_state(circuit)
        self.assertEqual(vg["overall_status"], "AMBIGUOUS")
        self.assertEqual(vg["summary"]["ambiguous_components"], 1)
        self.assertTrue(len(vg["diagnostics"]) >= 1)
        self.assertEqual(vg["diagnostics"][0]["issue"], "AMBIGUOUS_TERMINAL")

    # 7. Unknown Component
    def test_unknown_component(self):
        circuit = {
            "components": [
                {
                    "id": "U1",
                    "type": "unknown",
                    "value": None,
                    "start_hole": "E10",
                    "end_hole": "E15",
                    "source": "unknown",
                    "verification": "UNKNOWN"
                }
            ]
        }
        vg = build_visual_grounding_state(circuit)
        self.assertEqual(vg["summary"]["unknown_components"], 1)
        u1 = vg["components"][0]
        self.assertEqual(u1["status"], "UNKNOWN")
        self.assertIsNone(u1["value"])
        self.assertFalse(u1["verified"])

    # 8. Rejected Detection
    def test_rejected_detection_isolation(self):
        circuit = {
            "components": [
                {"id": "R1", "type": "resistor", "value": 220.0, "start_hole": "E10", "end_hole": "E15", "verification": "VERIFIED"}
            ],
            "vision_verification": {
                "rejected": [
                    {"candidate_id": "rej_1", "label": "resistor", "confidence": 0.22, "rejection_reason": "LOW_CONFIDENCE_FALSE_POSITIVE"}
                ]
            }
        }
        vg = build_visual_grounding_state(circuit)
        self.assertEqual(len(vg["components"]), 1)
        self.assertEqual(len(vg["rejected_detections"]), 1)
        self.assertEqual(vg["rejected_detections"][0]["status"], "REJECTED")

    # 9. User-Confirmed Correction
    def test_user_confirmed_provenance(self):
        circuit = {
            "components": [
                {
                    "id": "R1",
                    "type": "resistor",
                    "value": 1000.0,
                    "start_hole": "E10",
                    "end_hole": "E15",
                    "source": "USER_CONFIRMED",
                    "verification": "VERIFIED",
                    "original_detection": {"source": "ai", "confidence": 0.72}
                }
            ]
        }
        vg = build_visual_grounding_state(circuit)
        r1 = vg["components"][0]
        self.assertEqual(r1["status"], "USER_CONFIRMED")
        self.assertEqual(r1["provenance"]["original_detection"]["source"], "ai")

    # 10. Jumper Wire Grounding
    def test_wire_grounding(self):
        circuit = {
            "components": [
                {"id": "R1", "type": "resistor", "value": 220.0, "start_hole": "E10", "end_hole": "E15", "verification": "VERIFIED"}
            ],
            "wires": [
                {"id": "W1", "start_hole": "E15", "end_hole": "E25", "source": "detected"}
            ]
        }
        vg = build_visual_grounding_state(circuit)
        self.assertEqual(len(vg["wires"]), 1)
        w1 = vg["wires"][0]
        self.assertEqual(w1["id"], "W1")
        self.assertEqual(w1["electrical_effect"], "MERGES_HOLE_E15_WITH_HOLE_E25")

    # 11. Canonical Breadboard Hole Parsing
    def test_canonical_breadboard_hole_parsing(self):
        h_info = parse_hole_metadata("E15")
        self.assertEqual(h_info["row"], "E")
        self.assertEqual(h_info["column"], 15)
        self.assertEqual(h_info["region"], "terminal_matrix")

        pwr_info = parse_hole_metadata("+")
        self.assertEqual(pwr_info["region"], "power_rail_vcc")

    # 12. Simulation Solved Grounding
    def test_simulation_solved_grounding(self):
        circuit = {
            "components": [{"id": "R1", "type": "resistor", "value": 220.0, "start_hole": "E10", "end_hole": "E15", "verification": "VERIFIED"}],
            "solverStatus": "SOLVED",
            "simulationResult": {
                "success": True,
                "node_voltages": {"NODE_1": 5.0, "NODE_2": 0.0},
                "total_power_mW": 113.6
            }
        }
        vg = build_visual_grounding_state(circuit)
        self.assertEqual(vg["simulation"]["status"], "SOLVED")
        self.assertEqual(vg["simulation"]["voltages"]["NODE_1"], 5.0)

    # 13. Stale Simulation Grounding (Rule 12)
    def test_stale_simulation_grounding(self):
        circuit = {
            "components": [{"id": "R1", "type": "resistor", "value": 220.0, "start_hole": "E10", "end_hole": "E15", "verification": "VERIFIED"}],
            "solverStatus": "NOT_RUN",
            "simulationResult": None
        }
        vg = build_visual_grounding_state(circuit)
        self.assertEqual(vg["simulation"]["status"], "NOT_RUN")

    # 14. Signature Consistency
    def test_signature_consistency(self):
        circuit = {
            "components": [{"id": "R1", "type": "resistor", "value": 220.0, "start_hole": "E10", "end_hole": "E15", "verification": "VERIFIED"}]
        }
        vg = build_visual_grounding_state(circuit)
        sig = compute_circuit_signature(circuit)
        self.assertEqual(vg["circuit_signature"], sig)

    # 15. LLM Tool Integration
    def test_llm_tool_integration(self):
        circuit = {
            "components": [{"id": "R1", "type": "resistor", "value": 220.0, "start_hole": "E10", "end_hole": "E15", "verification": "VERIFIED"}]
        }
        tool_res = execute_circuit_tool("get_visual_grounding", {}, circuit)
        self.assertEqual(tool_res["schema_version"], "22.1")
        self.assertEqual(tool_res["overall_status"], "VERIFIED")

    # 16. FastApi Endpoints
    def test_api_endpoints(self):
        get_res = self.client.get("/api/circuit/visual-grounding")
        self.assertEqual(get_res.status_code, 200)
        self.assertEqual(get_res.json()["schema_version"], "22.1")

        post_res = self.client.post("/api/circuit/visual-grounding", json={
            "components": [{"id": "R1", "type": "resistor", "value": 220.0, "start_hole": "E10", "end_hole": "E15", "verification": "VERIFIED"}]
        })
        self.assertEqual(post_res.status_code, 200)
        self.assertEqual(post_res.json()["summary"]["verified_components"], 1)


if __name__ == "__main__":
    unittest.main()
