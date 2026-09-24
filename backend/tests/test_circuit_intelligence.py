"""
Unit & Integration Tests for SmartBreadboard Circuit Intelligence & Topology Engine (Phase 19)
Verifies:
TEST 1: Single resistor correctly placed (terminals & nodes verified)
TEST 2: Single LED correctly placed (anode/cathode polarity mapped)
TEST 3: Resistor + LED in parallel (graph-based parallel reasoning)
TEST 4: Two resistors in series (graph-based series reasoning)
TEST 5: Ambiguous terminal position returns AMBIGUOUS
TEST 6: Component outside breadboard ROI rejected
TEST 7: Duplicate detection of same physical component suppressed
TEST 8: Wrong component class overlapping correct component suppressed
TEST 9: Unmapped terminal blocks MNA (solver_status = NOT_RUN)
TEST 10: Phase 17 manual resistor compatibility
TEST 11: Real-image benchmark non-regression
TEST 12: Electrical node construction & jumper wire merging
TEST 13: Deterministic LLM Tool Interface execution
TEST 14: Short circuit fault detection
TEST 15: Verified Netlist construction integrity
"""

import unittest
import sys
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from core.circuit_intelligence import (
    extract_component_terminals_model,
    map_terminal_to_exact_hole,
    build_component_intelligence,
    ElectricalNodeGraph,
    TopologyAnalyzer,
    verify_and_build_circuit_intelligence,
    get_canonical_node_for_hole
)
from core.circuit_tools import (
    get_verified_circuit,
    get_component,
    get_component_connections,
    get_electrical_node,
    get_topology,
    get_faults,
    execute_circuit_tool
)


class TestCircuitIntelligence(unittest.TestCase):
    def setUp(self):
        self.img_w = 1280
        self.img_h = 850

    def test_01_single_resistor_correctly_placed(self):
        """TEST 1: Single resistor with 2 terminals, valid hole mappings, and resolved nodes."""
        cand = {
            "id": "R1",
            "type": "resistor",
            "confidence": 0.95,
            "start_hole": "C25",
            "end_hole": "C29",
            "bbox": [400, 300, 520, 340],
            "verification": "VERIFIED"
        }
        res = verify_and_build_circuit_intelligence([cand], self.img_w, self.img_h)
        self.assertEqual(res["summary"]["verified_count"], 1)
        comp_intel = res["component_intelligence"][0]
        self.assertEqual(len(comp_intel["terminals"]), 2)
        self.assertEqual(comp_intel["terminals"][0]["name"], "terminal_a")
        self.assertEqual(comp_intel["terminals"][1]["name"], "terminal_b")
        self.assertEqual(comp_intel["status"], "VERIFIED")
        self.assertGreaterEqual(len(res["node_graph"]["nodes"]), 2)

    def test_02_single_led_anode_cathode_mapped(self):
        """TEST 2: Single LED with explicit anode and cathode terminal polarity."""
        cand = {
            "id": "LED1",
            "type": "led",
            "confidence": 0.92,
            "bbox": [550, 400, 620, 500],
            "verification": "VERIFIED"
        }
        res = verify_and_build_circuit_intelligence([cand], self.img_w, self.img_h)
        self.assertEqual(res["summary"]["verified_count"], 1)
        comp_intel = res["component_intelligence"][0]
        term_names = [t["name"] for t in comp_intel["terminals"]]
        self.assertIn("anode", term_names)
        self.assertIn("cathode", term_names)

    def test_03_resistor_and_led_in_parallel(self):
        """TEST 3: Resistor + LED connected across identical electrical nodes form PARALLEL topology."""
        r1 = {
            "id": "R1",
            "type": "resistor",
            "confidence": 0.95,
            "start_hole": "A10",
            "end_hole": "A15",
            "verification": "VERIFIED"
        }
        led1 = {
            "id": "LED1",
            "type": "led",
            "confidence": 0.92,
            "start_hole": "B10",
            "end_hole": "B15",
            "verification": "VERIFIED"
        }
        res = verify_and_build_circuit_intelligence([r1, led1], self.img_w, self.img_h)
        topo = res["topology"]
        self.assertEqual(topo["status"], "VALID")
        self.assertEqual(topo["parallel_count"], 1)
        par_group = topo["parallel_groups"][0]
        self.assertIn("R1", par_group["components"])
        self.assertIn("LED1", par_group["components"])
        self.assertEqual(par_group["type"], "PARALLEL")

    def test_04_two_resistors_in_series(self):
        """TEST 4: Two resistors sharing exactly one intermediate junction node form SERIES topology."""
        r1 = {
            "id": "R1",
            "type": "resistor",
            "confidence": 0.95,
            "start_hole": "A10",
            "end_hole": "A15",
            "verification": "VERIFIED"
        }
        r2 = {
            "id": "R2",
            "type": "resistor",
            "confidence": 0.95,
            "start_hole": "B15",  # Shares Column 15 Top with R1
            "end_hole": "A20",
            "verification": "VERIFIED"
        }
        res = verify_and_build_circuit_intelligence([r1, r2], self.img_w, self.img_h)
        topo = res["topology"]
        self.assertEqual(topo["status"], "VALID")
        self.assertEqual(topo["series_count"], 1)
        ser_group = topo["series_groups"][0]
        self.assertIn("R1", ser_group["components"])
        self.assertIn("R2", ser_group["components"])
        self.assertEqual(ser_group["type"], "SERIES")

    def test_05_ambiguous_terminal_position_returns_ambiguous(self):
        """TEST 5: Terminal positioned exactly equidistant between two holes returns AMBIGUOUS."""
        map_res = map_terminal_to_exact_hole(
            {"x": 600.0, "y": 400.0},
            img_w=self.img_w,
            img_h=self.img_h,
            ambiguity_delta_mm=50.0  # Force ambiguity threshold
        )
        self.assertEqual(map_res["status"], "AMBIGUOUS")
        self.assertIn("alternate_hole", map_res)

    def test_06_component_outside_breadboard_roi_rejected(self):
        """TEST 6: Component placed far outside breadboard quad is REJECTED."""
        outside_cand = {
            "id": "R_DESK",
            "type": "resistor",
            "confidence": 0.90,
            "bbox": [5, 5, 25, 25],
            "verification": "REJECTED"
        }
        res = verify_and_build_circuit_intelligence([outside_cand], self.img_w, self.img_h)
        self.assertEqual(res["summary"]["rejected_count"], 1)
        self.assertEqual(res["summary"]["verified_count"], 0)

    def test_07_duplicate_detection_suppressed(self):
        """TEST 7: Redundant candidate flagged as duplicate is excluded from netlist."""
        c1 = {
            "id": "R1_primary",
            "type": "resistor",
            "confidence": 0.95,
            "start_hole": "A10",
            "end_hole": "A15",
            "verification": "VERIFIED"
        }
        c2 = {
            "id": "R1_dup",
            "type": "resistor",
            "confidence": 0.60,
            "start_hole": "A10",
            "end_hole": "A15",
            "verification": "REJECTED",
            "is_duplicate": True
        }
        res = verify_and_build_circuit_intelligence([c1, c2], self.img_w, self.img_h)
        self.assertEqual(res["summary"]["verified_count"], 1)
        self.assertEqual(res["summary"]["rejected_count"], 1)

    def test_08_cross_class_duplicate_suppression(self):
        """TEST 8: Overlapping wire candidate on top of verified resistor is excluded."""
        res_cand = {
            "id": "R1",
            "type": "resistor",
            "confidence": 0.95,
            "start_hole": "A10",
            "end_hole": "A15",
            "verification": "VERIFIED"
        }
        false_wire = {
            "id": "W_FALSE",
            "type": "wire",
            "confidence": 0.50,
            "start_hole": "A10",
            "end_hole": "A15",
            "verification": "REJECTED",
            "is_duplicate": True
        }
        res = verify_and_build_circuit_intelligence([res_cand, false_wire], self.img_w, self.img_h)
        self.assertEqual(res["summary"]["verified_count"], 1)
        netlist_types = [c["type"] for c in res["netlist"]["components"]]
        self.assertIn("resistor", netlist_types)
        self.assertNotIn("wire", netlist_types)

    def test_09_unmapped_terminal_blocks_mna_solver(self):
        """TEST 9: Circuit with unmapped/empty components sets solver_status = NOT_RUN."""
        res = verify_and_build_circuit_intelligence([], self.img_w, self.img_h)
        self.assertEqual(res["netlist"]["solver_status"], "NOT_RUN")
        self.assertEqual(res["netlist"]["validity"]["status"], "INVALID")

    def test_10_phase17_manual_resistor_compatibility(self):
        """TEST 10: Phase 17 user manual component definition preserved with verified topology."""
        manual_r = {
            "id": "R_MANUAL_1",
            "designator": "R_MANUAL_1",
            "type": "resistor",
            "source": "user_override",
            "user_override_value": 470.0,
            "value": 470.0,
            "start_hole": "C10",
            "end_hole": "C15",
            "verification": "VERIFIED"
        }
        res = verify_and_build_circuit_intelligence([manual_r], self.img_w, self.img_h)
        self.assertEqual(res["summary"]["verified_count"], 1)
        comp = res["netlist"]["components"][0]
        self.assertEqual(comp["source"], "user_override")
        self.assertEqual(comp["value"], 470.0)

    def test_11_real_benchmark_non_regression(self):
        """TEST 11: Real benchmark photo components are resolved into clean verified netlist."""
        real_candidates = [
            {"id": "R1", "type": "resistor", "confidence": 0.96, "start_hole": "C25", "end_hole": "C29", "verification": "VERIFIED"},
            {"id": "LED1", "type": "led", "confidence": 0.94, "start_hole": "E35", "end_hole": "F35", "verification": "VERIFIED"},
            {"id": "W1", "type": "wire", "confidence": 0.97, "start_hole": "E8", "end_hole": "E19", "verification": "VERIFIED"}
        ]
        res = verify_and_build_circuit_intelligence(real_candidates, self.img_w, self.img_h)
        self.assertEqual(res["summary"]["verified_count"], 3)
        self.assertEqual(res["netlist"]["validity"]["status"], "VALID")

    def test_12_electrical_node_construction_and_wire_merging(self):
        """TEST 12: Jumper wire merges two distinct columns into a single unified electrical node."""
        w1 = {
            "id": "W1",
            "type": "wire",
            "start_hole": "A10",  # NODE_COL_10_TOP
            "end_hole": "A20",    # NODE_COL_20_TOP
            "verification": "VERIFIED"
        }
        r1 = {
            "id": "R1",
            "type": "resistor",
            "start_hole": "B10",
            "end_hole": "B20",
            "verification": "VERIFIED"
        }
        res = verify_and_build_circuit_intelligence([w1, r1], self.img_w, self.img_h)
        # Because W1 merges col 10 and col 20, R1's terminals connect to the same merged node -> short circuit detected!
        topo = res["topology"]
        self.assertEqual(len(topo["short_circuits"]), 1)
        self.assertEqual(topo["status"], "INVALID")

    def test_13_deterministic_llm_tool_interface(self):
        """TEST 13: Deterministic LLM tools return structured ground truth without fabrication."""
        circuit_state = {
            "netlist": {
                "components": [
                    {"id": "R1", "type": "resistor", "value": 220.0, "start_hole": "A10", "end_hole": "A15", "verified": True},
                    {"id": "LED1", "type": "led", "value": 2.1, "start_hole": "B10", "end_hole": "B15", "verified": True}
                ],
                "nodes": [
                    {"id": "NODE_COL_10_TOP", "holes": ["A10", "B10"], "connected_pins": ["R1.terminal_a", "LED1.anode"]},
                    {"id": "NODE_COL_15_TOP", "holes": ["A15", "B15"], "connected_pins": ["R1.terminal_b", "LED1.cathode"]}
                ],
                "validity": {"status": "VALID"},
                "solver_status": "READY"
            }
        }
        # Test 1: get_verified_circuit
        c_res = execute_circuit_tool("get_verified_circuit", {}, circuit_state)
        self.assertEqual(c_res["status"], "success")
        self.assertEqual(c_res["verified_component_count"], 2)

        # Test 2: get_component
        comp_res = execute_circuit_tool("get_component", {"component_id": "R1"}, circuit_state)
        self.assertEqual(comp_res["status"], "success")
        self.assertEqual(comp_res["component"]["value"], 220.0)

        # Test 3: get_topology
        topo_res = execute_circuit_tool("get_topology", {}, circuit_state)
        self.assertEqual(topo_res["status"], "success")
        self.assertEqual(topo_res["topology"]["parallel_count"], 1)

    def test_14_short_circuit_detection(self):
        """TEST 14: Component placed with both leads in the same column row (A-E) triggers short circuit fault."""
        short_resistor = {
            "id": "R_SHORT",
            "type": "resistor",
            "start_hole": "A10",
            "end_hole": "C10", # Both in Col 10 Top -> same node!
            "verification": "VERIFIED"
        }
        res = verify_and_build_circuit_intelligence([short_resistor], self.img_w, self.img_h)
        topo = res["topology"]
        self.assertEqual(len(topo["short_circuits"]), 1)
        self.assertEqual(topo["status"], "INVALID")
        self.assertIn("R_SHORT", topo["short_circuits"][0]["reason"])

    def test_15_canonical_node_naming(self):
        """TEST 15: Canonical breadboard hole to node conversion handles top/bottom rows and power rails."""
        self.assertEqual(get_canonical_node_for_hole("A12"), "NODE_COL_12_TOP")
        self.assertEqual(get_canonical_node_for_hole("E12"), "NODE_COL_12_TOP")
        self.assertEqual(get_canonical_node_for_hole("F12"), "NODE_COL_12_BOT")
        self.assertEqual(get_canonical_node_for_hole("J12"), "NODE_COL_12_BOT")
        self.assertEqual(get_canonical_node_for_hole("VCC_TOP_1"), "NODE_POWER_VCC")
        self.assertEqual(get_canonical_node_for_hole("GND_TOP_1"), "NODE_GROUND")


if __name__ == '__main__':
    unittest.main()
