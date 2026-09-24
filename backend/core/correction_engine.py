"""
SmartBreadboard 3D — Correction Safety & Backend Validation Engine (Phase 21.1)
Authoritative backend validation layer for applying circuit corrections.
Guarantees:
1. No automatic verification of UNKNOWN components without explicit user parameters.
2. No automatic shifting of detected short circuits without independent vision evidence.
3. Strict circuit signature versioning to reject stale or expired proposals.
4. Comprehensive 12-point deterministic validation.
5. Invalidation of previous numerical simulation results upon any topology alteration.
6. Full detection provenance preservation (original_detection vs user_confirmed).
7. Deterministic correction audit history logging.
"""

import time
import re
from typing import Dict, Any, List, Optional, Tuple

from core.circuit_intelligence import ElectricalNodeGraph, TopologyAnalyzer


def validate_breadboard_hole(hole_str: Optional[str]) -> bool:
    """Validates if a hole string is a legitimate breadboard tie-point or power rail."""
    if not hole_str or not isinstance(hole_str, str):
        return False
    h = hole_str.strip().upper()
    
    # Power rails and named nodes
    if h in ["+", "-", "VCC", "GND", "PWR", "POWER_BUS_+", "POWER_BUS_-", "NODE_PWR", "NODE_GND", "NODE_POWER_VCC", "NODE_GROUND"]:
        return True
    if h.startswith("NODE_HOLE_") or h.startswith("NODE_COL_") or h.startswith("NODE_POWER_"):
        return True
        
    # Standard breadboard tie-points: Row A-J, Col 1-63
    match = re.match(r"^([A-J])([1-9]|[1-5][0-9]|6[0-3])$", h)
    return match is not None


def validate_and_apply_correction(
    circuit_state: Dict[str, Any],
    correction_request: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Executes all 12 safety checks and applies verified corrections to the circuit state.
    """
    from core.circuit_tools import compute_circuit_signature

    netlist = circuit_state.get("netlist") or circuit_state
    comps = netlist.get("components", [])

    # 1. Proposal & Diagnostic ID existence
    proposal_id = correction_request.get("proposal_id")
    diagnostic_id = correction_request.get("diagnostic_id") or correction_request.get("id")
    if not proposal_id and not diagnostic_id:
        return {
            "status": "BLOCKED",
            "reason": "Missing required proposal_id or diagnostic_id."
        }

    # 2. Component exists
    component_id = correction_request.get("component_id")
    if not component_id:
        return {
            "status": "BLOCKED",
            "reason": "Missing required component_id."
        }

    target_comp = next((c for c in comps if (c.get("id") == component_id or c.get("designator") == component_id)), None)
    if not target_comp:
        return {
            "status": "BLOCKED",
            "reason": f"Component '{component_id}' does not exist in the active circuit."
        }

    # 3. Explicit User Confirmation Check
    user_confirmed = correction_request.get("user_confirmed", False)
    confirmation_token = correction_request.get("confirmation_token")
    if not user_confirmed and not confirmation_token:
        return {
            "status": "BLOCKED",
            "reason": "Explicit user confirmation is required to apply correction."
        }

    # 4. Correction Type Supported
    corr_type = correction_request.get("correction_type") or correction_request.get("action") or "TERMINAL_HOLE_REMAP"
    valid_types = [
        "TERMINAL_HOLE_REMAP",
        "update_component_terminals",
        "USER_COMPONENT_DEFINITION",
        "define_unknown_component",
        "MANUAL_REPAIR"
    ]
    if corr_type not in valid_types:
        return {
            "status": "BLOCKED",
            "reason": f"Unsupported correction type '{corr_type}'. Valid types: {valid_types}"
        }

    # 5. Circuit Signature & State Versioning (Reject stale proposals)
    current_sig = compute_circuit_signature(netlist)
    proposed_sig = correction_request.get("circuit_signature")
    if proposed_sig and proposed_sig != current_sig:
        return {
            "status": "BLOCKED",
            "reason": "BLOCKED_STALE_PROPOSAL: Circuit topology signature has changed since the proposal was generated. Please request fresh diagnostics."
        }

    # 6. Proposal Expiration Check (10 minutes)
    created_at = correction_request.get("created_at")
    if created_at:
        try:
            if isinstance(created_at, (int, float)):
                if time.time() - created_at > 600:
                    return {
                        "status": "BLOCKED",
                        "reason": "Proposal has expired (lifetime: 10 minutes). Please request a fresh correction suggestion."
                    }
        except Exception:
            pass

    # Extract target holes and values
    hole1 = (
        correction_request.get("hole1") or 
        correction_request.get("suggested_start_hole") or 
        correction_request.get("start_hole") or 
        target_comp.get("start_hole") or 
        target_comp.get("hole1")
    )
    hole2 = (
        correction_request.get("hole2") or 
        correction_request.get("suggested_end_hole") or 
        correction_request.get("end_hole") or 
        target_comp.get("end_hole") or 
        target_comp.get("hole2")
    )

    # 7. UNKNOWN Component Safety Check (Rule 1)
    is_unknown = (
        target_comp.get("verification") == "UNKNOWN" or 
        target_comp.get("source") == "unknown" or 
        target_comp.get("type") in ["unknown", "UNKNOWN", None]
    )
    
    user_type = correction_request.get("type") or correction_request.get("user_override_type")
    user_val = correction_request.get("value") or correction_request.get("user_override_value")
    
    if is_unknown:
        # User MUST explicitly supply type and numerical value
        if not user_type or user_val is None:
            return {
                "status": "BLOCKED",
                "reason": f"Component '{component_id}' was detected as UNKNOWN. User must explicitly define component type and value before verification."
            }
        try:
            user_val_float = float(user_val)
            if user_val_float <= 0:
                return {
                    "status": "BLOCKED",
                    "reason": "Component value must be a positive numerical value."
                }
        except (ValueError, TypeError):
            return {
                "status": "BLOCKED",
                "reason": f"Invalid component value '{user_val}'. Must be a valid positive number."
            }

    # 8. SHORT CIRCUIT Safety Check (Rule 2)
    old_h1 = target_comp.get("start_hole") or target_comp.get("hole1")
    old_h2 = target_comp.get("end_hole") or target_comp.get("hole2")
    if old_h1 and old_h2 and old_h1 == old_h2 and (hole1 != old_h1 or hole2 != old_h2):
        # Moving terminals away from short requires independent candidate evidence
        has_independent_evidence = False
        terms = target_comp.get("terminals", {})
        if isinstance(terms, dict):
            for t_val in terms.values():
                if isinstance(t_val, dict) and t_val.get("candidate_holes"):
                    if hole1 in t_val.get("candidate_holes") or hole2 in t_val.get("candidate_holes"):
                        has_independent_evidence = True
                        break
        
        candidate_evidence = correction_request.get("candidate_evidence", False)
        if not has_independent_evidence and not candidate_evidence and not correction_request.get("user_explicit_remap"):
            return {
                "status": "BLOCKED",
                "reason": f"SHORT_CIRCUIT_CANNOT_BE_AUTOMATICALLY_SHIFTED: Short circuit on '{component_id}' is an electrical condition. Shifting requires independent terminal candidate evidence or explicit manual remap."
            }

    # 9. Target Hole Validation
    if not hole1 or not hole2:
        return {
            "status": "BLOCKED",
            "reason": "Both start and end tie-point holes must be specified."
        }

    if not validate_breadboard_hole(hole1):
        return {
            "status": "BLOCKED",
            "reason": f"Target hole '{hole1}' is not a valid breadboard tie-point."
        }

    if not validate_breadboard_hole(hole2):
        return {
            "status": "BLOCKED",
            "reason": f"Target hole '{hole2}' is not a valid breadboard tie-point."
        }

    # 10. Record Provenance (Rule 9)
    if "original_detection" not in target_comp:
        target_comp["original_detection"] = {
            "source": target_comp.get("source", "ai"),
            "confidence": target_comp.get("confidence", 1.0),
            "verification": target_comp.get("verification", "UNKNOWN"),
            "start_hole": old_h1,
            "end_hole": old_h2,
            "terminals": target_comp.get("terminals")
        }

    target_comp["correction"] = {
        "source": "USER_CONFIRMED",
        "verified": True,
        "proposal_id": proposal_id or diagnostic_id,
        "applied_at": time.time()
    }

    # 11. Apply Verified Mutation
    h1_clean = hole1.strip().upper()
    h2_clean = hole2.strip().upper()
    
    target_comp["start_hole"] = h1_clean
    target_comp["end_hole"] = h2_clean
    target_comp["hole1"] = h1_clean
    target_comp["hole2"] = h2_clean
    target_comp["node1"] = f"NODE_HOLE_{h1_clean}" if not h1_clean.startswith("NODE_") else h1_clean
    target_comp["node2"] = f"NODE_HOLE_{h2_clean}" if not h2_clean.startswith("NODE_") else h2_clean
    target_comp["terminals"] = {
        "terminal_a": {"hole": h1_clean, "node_id": target_comp["node1"], "ambiguous": False},
        "terminal_b": {"hole": h2_clean, "node_id": target_comp["node2"], "ambiguous": False}
    }
    target_comp["source"] = "USER_CONFIRMED"
    target_comp["verified"] = True
    target_comp["verification"] = "VERIFIED"
    target_comp["user_override_terminals"] = True
    
    if user_type:
        target_comp["type"] = user_type
    if user_val is not None:
        target_comp["value"] = float(user_val)
        unit = correction_request.get("unit") or target_comp.get("unit", "Ω")
        target_comp["unit"] = unit
        target_comp["displayValue"] = f"{user_val} {unit}"
        target_comp["formatted_value"] = f"{user_val} {unit}"
        target_comp["user_override_value"] = f"{user_val} {unit}"

    # 12. Simulation Invalidation (Rule 8)
    circuit_state["simulationResult"] = None
    circuit_state["electrical_analysis"] = None
    circuit_state["solverStatus"] = "NOT_RUN"
    circuit_state["solver_status"] = "NOT_RUN"
    circuit_state["_last_simulation_signature"] = None
    if "netlist" in circuit_state:
        circuit_state["netlist"]["solver_status"] = "NOT_RUN"

    # 13. Rebuild Topology (Rule 5 & 10)
    graph_builder = ElectricalNodeGraph()
    for c in comps:
        graph_builder.add_component(c)
    node_graph = graph_builder.build_graph()
    
    topo_analyzer = TopologyAnalyzer(node_graph, comps)
    rebuilt_topo = topo_analyzer.analyze()
    
    circuit_state["topology"] = rebuilt_topo
    if "netlist" in circuit_state:
        circuit_state["netlist"]["topology"] = rebuilt_topo
        circuit_state["netlist"]["nodes"] = node_graph.get("nodes", [])

    # 14. Compute New Circuit Signature & Audit History Entry (Rule 10)
    new_sig = compute_circuit_signature(netlist)
    
    audit_entry = {
        "proposal_id": proposal_id or diagnostic_id,
        "diagnostic_id": diagnostic_id,
        "component_id": component_id,
        "action": corr_type,
        "old_mapping": {"start_hole": old_h1, "end_hole": old_h2},
        "new_mapping": {"start_hole": h1_clean, "end_hole": h2_clean},
        "source": "USER_CONFIRMED",
        "previous_signature": current_sig,
        "new_signature": new_sig,
        "timestamp": time.time()
    }
    
    if "correction_history" not in circuit_state:
        circuit_state["correction_history"] = []
    circuit_state["correction_history"].append(audit_entry)

    return {
        "status": "APPLIED",
        "component_id": component_id,
        "updated_terminals": {
            "terminal_a": h1_clean,
            "terminal_b": h2_clean
        },
        "new_circuit_signature": new_sig,
        "topology_rebuilt": True,
        "simulation_invalidated": True,
        "circuit": circuit_state,
        "audit_entry": audit_entry
    }
