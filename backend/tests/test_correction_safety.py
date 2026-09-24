"""
SmartBreadboard 3D — Unit Tests for Phase 21.1 Correction Safety Hardening
Tests the authoritative backend validation engine, provenance preservation,
circuit signature protection, unknown component safety, short-circuit safety,
and simulation invalidation.
"""

import unittest
import copy
from core.circuit_tools import (
    get_correction_suggestions,
    simulate_verified_circuit,
    compute_circuit_signature,
    execute_circuit_tool
)
from core.correction_engine import validate_and_apply_correction, validate_breadboard_hole
from llm.provider import DeterministicFallbackProvider


class TestCorrectionSafetyHardening(unittest.TestCase):

    def setUp(self):
        self.circuit_state = {
            "netlist": {
                "circuit_id": "safety_test_circ",
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
                            "terminal_b": {"hole": "AMBIGUOUS", "ambiguous": True, "candidate_holes": ["E15"]}
                        },
                        "source": "ai",
                        "confidence": 0.85,
                        "verification": "VERIFIED"
                    },
                    {
                        "id": "U_COMP_1",
                        "type": "unknown",
                        "value": None,
                        "start_hole": "E15",
                        "end_hole": "E20",
                        "source": "unknown",
                        "confidence": 0.40,
                        "verification": "UNKNOWN"
                    },
                    {
                        "id": "R_SHORT_NO_EVIDENCE",
                        "type": "resistor",
                        "value": 220.0,
                        "unit": "Ω",
                        "start_hole": "A5",
                        "end_hole": "A5",
                        "source": "ai",
                        "verification": "VERIFIED"
                    },
                    {
                        "id": "R_SHORT_WITH_EVIDENCE",
                        "type": "resistor",
                        "value": 330.0,
                        "unit": "Ω",
                        "start_hole": "B10",
                        "end_hole": "B10",
                        "terminals": {
                            "terminal_a": {"hole": "B10"},
                            "terminal_b": {"hole": "B10", "candidate_holes": ["B15"]}
                        },
                        "source": "ai",
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

    # 1. UNKNOWN Component Safety
    def test_unknown_component_is_not_automatically_verified(self):
        res = get_correction_suggestions(self.circuit_state, component_id="U_COMP_1")
        self.assertEqual(res.get("status"), "success")
        sugg = res.get("suggestions")[0]
        
        self.assertTrue(sugg.get("requires_user_definition"))
        self.assertIsNone(sugg.get("suggested_type"))
        self.assertIsNone(sugg.get("suggested_value"))
        self.assertEqual(sugg.get("correction_type"), "USER_COMPONENT_DEFINITION")

    def test_unknown_component_blocks_simulation(self):
        sim_res = simulate_verified_circuit(self.circuit_state)
        self.assertEqual(sim_res.get("status"), "BLOCKED")
        self.assertIn("U_COMP_1", sim_res.get("reason"))

    def test_unknown_component_correction_requires_explicit_user_definition(self):
        state = copy.deepcopy(self.circuit_state)
        sig = compute_circuit_signature(state["netlist"])
        
        # Missing user type/value definition
        bad_req = {
            "proposal_id": "prop_unknown_test",
            "component_id": "U_COMP_1",
            "circuit_signature": sig,
            "hole1": "E15",
            "hole2": "E20",
            "user_confirmed": True
        }
        res = validate_and_apply_correction(state, bad_req)
        self.assertEqual(res.get("status"), "BLOCKED")
        self.assertIn("explicitly define", res.get("reason"))

        # With explicit user definition
        good_req = {
            "proposal_id": "prop_unknown_test",
            "component_id": "U_COMP_1",
            "circuit_signature": sig,
            "hole1": "E15",
            "hole2": "E20",
            "type": "resistor",
            "value": 1000.0,
            "unit": "Ω",
            "user_confirmed": True
        }
        res_ok = validate_and_apply_correction(state, good_req)
        self.assertEqual(res_ok.get("status"), "APPLIED")
        
        comp = next(c for c in state["netlist"]["components"] if c["id"] == "U_COMP_1")
        self.assertEqual(comp["source"], "USER_CONFIRMED")
        self.assertEqual(comp["verification"], "VERIFIED")
        self.assertEqual(comp["value"], 1000.0)
        self.assertEqual(comp["original_detection"]["source"], "unknown")

    # 2. Short Circuit Safety
    def test_short_circuit_without_evidence_is_not_automatically_shifted(self):
        res = get_correction_suggestions(self.circuit_state, component_id="R_SHORT_NO_EVIDENCE")
        sugg = res.get("suggestions")[0]
        self.assertEqual(sugg.get("status"), "BLOCKED")
        self.assertEqual(sugg.get("action"), "none")
        self.assertFalse(sugg.get("candidate_evidence"))
        self.assertEqual(sugg.get("suggested_start_hole"), "A5")
        self.assertEqual(sugg.get("suggested_end_hole"), "A5")

    def test_short_circuit_with_evidence_generates_candidate(self):
        res = get_correction_suggestions(self.circuit_state, component_id="R_SHORT_WITH_EVIDENCE")
        sugg = res.get("suggestions")[0]
        self.assertEqual(sugg.get("status"), "PROPOSED")
        self.assertTrue(sugg.get("candidate_evidence"))
        self.assertEqual(sugg.get("suggested_end_hole"), "B15")

    def test_short_circuit_shift_without_evidence_is_blocked_by_engine(self):
        state = copy.deepcopy(self.circuit_state)
        sig = compute_circuit_signature(state["netlist"])
        
        req = {
            "proposal_id": "prop_short_test",
            "component_id": "R_SHORT_NO_EVIDENCE",
            "circuit_signature": sig,
            "hole1": "A5",
            "hole2": "A10",  # arbitrary shift without evidence
            "user_confirmed": True,
            "candidate_evidence": False
        }
        res = validate_and_apply_correction(state, req)
        self.assertEqual(res.get("status"), "BLOCKED")
        self.assertIn("SHORT_CIRCUIT_CANNOT_BE_AUTOMATICALLY_SHIFTED", res.get("reason"))

    # 3. Circuit Signature & State Versioning (Reject Stale Proposals)
    def test_mismatched_circuit_signature_rejects_stale_proposal(self):
        state = copy.deepcopy(self.circuit_state)
        
        stale_req = {
            "proposal_id": "prop_stale_test",
            "component_id": "R1",
            "circuit_signature": "STALE_HASH_12345",
            "hole1": "E10",
            "hole2": "E15",
            "user_confirmed": True
        }
        res = validate_and_apply_correction(state, stale_req)
        self.assertEqual(res.get("status"), "BLOCKED")
        self.assertIn("BLOCKED_STALE_PROPOSAL", res.get("reason"))

    # 4. Mandatory User Confirmation
    def test_missing_user_confirmation_is_blocked(self):
        state = copy.deepcopy(self.circuit_state)
        sig = compute_circuit_signature(state["netlist"])
        
        req = {
            "proposal_id": "prop_no_confirm",
            "component_id": "R1",
            "circuit_signature": sig,
            "hole1": "E10",
            "hole2": "E15",
            "user_confirmed": False
        }
        res = validate_and_apply_correction(state, req)
        self.assertEqual(res.get("status"), "BLOCKED")
        self.assertIn("confirmation", res.get("reason").lower())

    # 5. Invalid Breadboard Holes
    def test_invalid_breadboard_hole_is_blocked(self):
        state = copy.deepcopy(self.circuit_state)
        sig = compute_circuit_signature(state["netlist"])
        
        self.assertFalse(validate_breadboard_hole("Z99"))
        self.assertTrue(validate_breadboard_hole("E10"))
        self.assertTrue(validate_breadboard_hole("+"))
        
        req = {
            "proposal_id": "prop_bad_hole",
            "component_id": "R1",
            "circuit_signature": sig,
            "hole1": "E10",
            "hole2": "Z99",
            "user_confirmed": True
        }
        res = validate_and_apply_correction(state, req)
        self.assertEqual(res.get("status"), "BLOCKED")
        self.assertIn("not a valid breadboard tie-point", res.get("reason"))

    # 6. Simulation Invalidation & Audit Logging
    def test_simulation_invalidation_and_audit_history(self):
        state = copy.deepcopy(self.circuit_state)
        state["simulationResult"] = {"success": True, "voltage": 5.0}
        state["solverStatus"] = "SOLVED"
        state["solver_status"] = "SOLVED"
        
        sig_before = compute_circuit_signature(state["netlist"])
        
        req = {
            "proposal_id": "prop_audit_test",
            "diagnostic_id": "diag_audit_test",
            "component_id": "R1",
            "circuit_signature": sig_before,
            "hole1": "E10",
            "hole2": "E15",
            "user_confirmed": True
        }
        
        res = validate_and_apply_correction(state, req)
        self.assertEqual(res.get("status"), "APPLIED")
        self.assertTrue(res.get("simulation_invalidated"))
        self.assertTrue(res.get("topology_rebuilt"))
        
        # Verify state invalidation
        self.assertIsNone(state.get("simulationResult"))
        self.assertEqual(state.get("solverStatus"), "NOT_RUN")
        self.assertEqual(state.get("solver_status"), "NOT_RUN")
        
        # Verify audit history
        history = state.get("correction_history", [])
        self.assertEqual(len(history), 1)
        entry = history[0]
        self.assertEqual(entry.get("component_id"), "R1")
        self.assertEqual(entry.get("source"), "USER_CONFIRMED")
        self.assertNotEqual(entry.get("previous_signature"), entry.get("new_signature"))

    # 7. Provenance Preservation
    def test_provenance_preservation(self):
        state = copy.deepcopy(self.circuit_state)
        sig = compute_circuit_signature(state["netlist"])
        
        req = {
            "proposal_id": "prop_prov_test",
            "component_id": "R1",
            "circuit_signature": sig,
            "hole1": "E10",
            "hole2": "E15",
            "user_confirmed": True
        }
        
        validate_and_apply_correction(state, req)
        comp = next(c for c in state["netlist"]["components"] if c["id"] == "R1")
        
        # Must contain original detection data
        self.assertIn("original_detection", comp)
        self.assertEqual(comp["original_detection"]["source"], "ai")
        self.assertEqual(comp["original_detection"]["confidence"], 0.85)
        self.assertEqual(comp["source"], "USER_CONFIRMED")
        self.assertEqual(comp["verified"], True)


if __name__ == "__main__":
    unittest.main()
