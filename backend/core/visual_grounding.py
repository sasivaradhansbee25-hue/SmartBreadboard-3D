"""
SmartBreadboard 3D — Verified Visual Grounding Data Model (Phase 22.1)
Constructs a deterministic, structured representation of what the system
authoritatively knows about the currently observed breadboard circuit.

Hierarchy:
OBSERVED -> VISION VERIFIED -> HOLE MAPPED -> ELECTRICAL TOPOLOGY VERIFIED -> SIMULATION RESULT -> LLM EXPLANATION

Strictly distinguishes:
- OBSERVED
- VERIFIED
- USER_CONFIRMED
- SIMULATED
- UNKNOWN
- AMBIGUOUS
- REJECTED
"""

import re
from typing import Dict, Any, List, Optional
from core.circuit_tools import compute_circuit_signature, get_hole_mapping
from core.circuit_intelligence import ElectricalNodeGraph, TopologyAnalyzer


def parse_hole_metadata(hole_str: Optional[str], node_id: Optional[str] = None) -> Dict[str, Any]:
    """Extracts canonical row, column, and region for a breadboard tie-point."""
    if not hole_str or not isinstance(hole_str, str):
        return {
            "hole": None,
            "region": "unknown",
            "row": None,
            "column": None,
            "electrical_node": node_id,
            "status": "UNMAPPED"
        }

    h = hole_str.strip().upper()
    if h in ["+", "VCC", "PWR", "POWER_BUS_+", "NODE_PWR", "NODE_POWER_VCC"]:
        return {
            "hole": h,
            "region": "power_rail_vcc",
            "row": "VCC",
            "column": None,
            "electrical_node": node_id or "NODE_PWR",
            "status": "VERIFIED"
        }
    if h in ["-", "GND", "POWER_BUS_-", "NODE_GND", "NODE_GROUND"]:
        return {
            "hole": h,
            "region": "power_rail_gnd",
            "row": "GND",
            "column": None,
            "electrical_node": node_id or "NODE_GND",
            "status": "VERIFIED"
        }

    match = re.match(r"^([A-J])([1-9]|[1-5][0-9]|6[0-3])$", h)
    if match:
        row_letter = match.group(1)
        col_number = int(match.group(2))
        return {
            "hole": h,
            "region": "terminal_matrix",
            "row": row_letter,
            "column": col_number,
            "electrical_node": node_id or f"NODE_COL_{col_number}_{'TOP' if row_letter in 'ABCDE' else 'BOT'}",
            "status": "VERIFIED"
        }

    return {
        "hole": h,
        "region": "custom_tiepoint",
        "row": None,
        "column": None,
        "electrical_node": node_id or h,
        "status": "VERIFIED" if not (h in ["AMBIGUOUS", "UNKNOWN", None]) else h
    }


def build_visual_grounding_state(circuit_state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Builds the authoritative Visual Grounding Model from the verified circuit state.
    Deterministic, mathematical, and grounded in ground truth — zero LLM generation.
    """
    netlist = circuit_state.get("netlist") or circuit_state
    comps = netlist.get("components", [])
    raw_wires = netlist.get("wires", [])
    raw_sources = netlist.get("sources", []) or netlist.get("power_sources", [])
    
    circuit_sig = compute_circuit_signature(netlist)

    # 1. Build / Query Electrical Node Graph & Topology
    graph_builder = ElectricalNodeGraph()
    for c in comps:
        graph_builder.add_component(c)
    node_graph = graph_builder.build_graph()
    nodes_list = node_graph.get("nodes", [])

    topo_analyzer = TopologyAnalyzer(node_graph, comps)
    topology = topo_analyzer.analyze()

    # 2. Process Components
    grounded_components = []
    grounded_connections = []
    grounded_diagnostics = []
    utilized_holes: Dict[str, Dict[str, Any]] = {}

    verified_comp_count = 0
    unknown_comp_count = 0
    ambiguous_comp_count = 0

    for c in comps:
        cid = c.get("id") or c.get("designator", "UNKNOWN_COMP")
        ctype = c.get("type", "resistor")
        cval = c.get("value")
        cunit = c.get("unit", "Ω")
        
        is_unknown = (
            c.get("verification") == "UNKNOWN" or 
            c.get("source") == "unknown" or 
            ctype in ["unknown", "UNKNOWN", None]
        )
        is_user_confirmed = c.get("source") == "USER_CONFIRMED" or c.get("user_override_value") is not None
        
        h_info = get_hole_mapping(circuit_state, cid)
        has_ambiguity = h_info.get("has_ambiguity", False)
        
        h1 = h_info.get("start_hole") or c.get("start_hole") or c.get("hole1")
        h2 = h_info.get("end_hole") or c.get("end_hole") or c.get("hole2")
        
        # Determine terminal statuses
        t1_status = "UNKNOWN" if not h1 or h1 in ["UNKNOWN", None] else ("AMBIGUOUS" if h1 == "AMBIGUOUS" else ("USER_CONFIRMED" if is_user_confirmed else "VERIFIED"))
        t2_status = "UNKNOWN" if not h2 or h2 in ["UNKNOWN", None] else ("AMBIGUOUS" if h2 == "AMBIGUOUS" else ("USER_CONFIRMED" if is_user_confirmed else "VERIFIED"))
        
        # Determine component overall status
        if is_unknown:
            comp_status = "UNKNOWN"
            unknown_comp_count += 1
        elif has_ambiguity or t1_status == "AMBIGUOUS" or t2_status == "AMBIGUOUS":
            comp_status = "AMBIGUOUS"
            ambiguous_comp_count += 1
        elif is_user_confirmed:
            comp_status = "USER_CONFIRMED"
            verified_comp_count += 1
        else:
            comp_status = "VERIFIED"
            verified_comp_count += 1

        # Extract coordinates / pixels if available
        bbox = c.get("bbox") or c.get("box") or []
        center = c.get("center") or ([round((bbox[0] + bbox[2])/2, 1), round((bbox[1] + bbox[3])/2, 1)] if len(bbox) == 4 else None)
        image_geom = {"bbox": bbox, "center": center} if bbox else None

        raw_terms = c.get("terminals", {})
        t1_pixel = None
        t2_pixel = None
        if isinstance(raw_terms, dict):
            ta = raw_terms.get("terminal_a") or raw_terms.get("anode")
            tb = raw_terms.get("terminal_b") or raw_terms.get("cathode")
            if isinstance(ta, dict):
                t1_pixel = ta.get("pixel")
            if isinstance(tb, dict):
                t2_pixel = tb.get("pixel")
        elif isinstance(raw_terms, list) and len(raw_terms) >= 2:
            t1_pixel = raw_terms[0].get("pixel") if isinstance(raw_terms[0], dict) else None
            t2_pixel = raw_terms[1].get("pixel") if isinstance(raw_terms[1], dict) else None

        node1_id = c.get("node1") or (f"NODE_HOLE_{h1}" if h1 and h1 not in ["AMBIGUOUS", "UNKNOWN"] else None)
        node2_id = c.get("node2") or (f"NODE_HOLE_{h2}" if h2 and h2 not in ["AMBIGUOUS", "UNKNOWN"] else None)

        comp_grounding = {
            "id": cid,
            "type": ctype if not is_unknown else "unknown",
            "value": cval if not is_unknown else None,
            "unit": cunit if not is_unknown else None,
            "display_value": f"{cval} {cunit}" if (cval is not None and not is_unknown) else "Unknown",
            "status": comp_status,
            "source": c.get("source", "ai"),
            "verified": (comp_status in ["VERIFIED", "USER_CONFIRMED"]),
            "terminals": {
                "terminal_a": {
                    "name": "terminal_a",
                    "hole": h1 if h1 not in ["AMBIGUOUS", "UNKNOWN"] else None,
                    "status": t1_status,
                    "pixel": t1_pixel,
                    "electrical_node": node1_id
                },
                "terminal_b": {
                    "name": "terminal_b",
                    "hole": h2 if h2 not in ["AMBIGUOUS", "UNKNOWN"] else None,
                    "status": t2_status,
                    "pixel": t2_pixel,
                    "electrical_node": node2_id
                }
            },
            "image_geometry": image_geom,
            "provenance": {
                "original_detection": c.get("original_detection") or {
                    "source": c.get("source", "ai"),
                    "confidence": c.get("confidence", 1.0)
                },
                "correction": c.get("correction")
            }
        }
        grounded_components.append(comp_grounding)

        # Build Physical-to-Electrical Connections
        if h1 and h1 not in ["AMBIGUOUS", "UNKNOWN"] and node1_id:
            conn_id_a = f"CONN_{cid}_TA"
            grounded_connections.append({
                "connection_id": conn_id_a,
                "from": {"component": cid, "terminal": "terminal_a", "physical_hole": h1},
                "to": {"node": node1_id},
                "status": t1_status,
                "source": "CIRCUIT_INTELLIGENCE"
            })
            if h1 not in utilized_holes:
                utilized_holes[h1] = parse_hole_metadata(h1, node1_id)

        if h2 and h2 not in ["AMBIGUOUS", "UNKNOWN"] and node2_id:
            conn_id_b = f"CONN_{cid}_TB"
            grounded_connections.append({
                "connection_id": conn_id_b,
                "from": {"component": cid, "terminal": "terminal_b", "physical_hole": h2},
                "to": {"node": node2_id},
                "status": t2_status,
                "source": "CIRCUIT_INTELLIGENCE"
            })
            if h2 not in utilized_holes:
                utilized_holes[h2] = parse_hole_metadata(h2, node2_id)

        # Collect Diagnostics
        if is_unknown:
            grounded_diagnostics.append({
                "diagnostic_id": f"diag_unknown_{cid}",
                "component_id": cid,
                "issue": "UNKNOWN_COMPONENT",
                "status": "UNKNOWN",
                "description": f"Component {cid} requires explicit user definition of type and value."
            })
        if has_ambiguity:
            grounded_diagnostics.append({
                "diagnostic_id": f"diag_ambig_{cid}",
                "component_id": cid,
                "issue": "AMBIGUOUS_TERMINAL",
                "status": "AMBIGUOUS",
                "description": f"Component {cid} has ambiguous terminal mapping ({h1} → {h2})."
            })
        if h1 and h2 and h1 == h2:
            grounded_diagnostics.append({
                "diagnostic_id": f"diag_short_{cid}",
                "component_id": cid,
                "issue": "SHORT_CIRCUIT",
                "status": "BLOCKED",
                "description": f"Short circuit detected on {cid}: both terminals map to hole {h1}."
            })

    # 3. Process Jumper Wires
    grounded_wires = []
    for w in raw_wires:
        wid = w.get("id") or w.get("designator", "W1")
        wh1 = w.get("start_hole") or w.get("hole1")
        wh2 = w.get("end_hole") or w.get("hole2")
        w_status = "VERIFIED" if (wh1 and wh2 and wh1 not in ["AMBIGUOUS", "UNKNOWN"] and wh2 not in ["AMBIGUOUS", "UNKNOWN"]) else "AMBIGUOUS"
        grounded_wires.append({
            "id": wid,
            "type": "wire",
            "start_hole": wh1,
            "end_hole": wh2,
            "electrical_effect": f"MERGES_HOLE_{wh1}_WITH_HOLE_{wh2}" if (wh1 and wh2) else "UNRESOLVED",
            "status": w_status,
            "source": w.get("source", "detected")
        })
        if wh1 and wh1 not in utilized_holes:
            utilized_holes[wh1] = parse_hole_metadata(wh1)
        if wh2 and wh2 not in utilized_holes:
            utilized_holes[wh2] = parse_hole_metadata(wh2)

    # 4. Process Electrical Nodes
    sim_data = circuit_state.get("simulationResult") or circuit_state.get("electrical_analysis")
    node_voltages = sim_data.get("node_voltages", {}) if sim_data else {}
    
    grounded_nodes = []
    for n in nodes_list:
        nid = n.get("id")
        grounded_nodes.append({
            "id": nid,
            "members": n.get("connected_pins", []),
            "holes": n.get("holes", []),
            "status": "VERIFIED",
            "voltage_v": node_voltages.get(nid)
        })

    # 5. Process Rejected Detections (Rule 11)
    vision_verif = circuit_state.get("vision_verification") or {}
    raw_rejected = vision_verif.get("rejected", [])
    if not raw_rejected:
        all_cands = vision_verif.get("all_candidates", [])
        raw_rejected = [c for c in all_cands if isinstance(c, dict) and (c.get("verification") == "REJECTED" or c.get("status") == "REJECTED")]
    
    grounded_rejected = []
    for rej in raw_rejected:
        if isinstance(rej, dict):
            grounded_rejected.append({
                "id": rej.get("candidate_id") or rej.get("id", "det_rejected"),
                "label": rej.get("label") or rej.get("type", "unknown"),
                "confidence": round(float(rej.get("confidence", 0.0)), 3),
                "bbox": rej.get("bbox", []),
                "status": "REJECTED",
                "reason": rej.get("rejection_reason") or rej.get("reason", "LOW_CONFIDENCE_FALSE_POSITIVE")
            })

    # 6. Process Simulation Grounding (Rule 12)
    solver_status = circuit_state.get("solverStatus") or circuit_state.get("solver_status") or "NOT_RUN"
    if sim_data and sim_data.get("success") and solver_status == "SOLVED":
        branch_currents = {c.get("id"): c.get("current") for c in sim_data.get("components", [])} if sim_data.get("components") else sim_data.get("branch_currents", {})
        comp_powers = {c.get("id"): c.get("power", 0.0) for c in sim_data.get("components", [])} if sim_data.get("components") else sim_data.get("component_powers", {})
        simulation_grounding = {
            "status": "SOLVED",
            "source": "MNA",
            "simulation_id": sim_data.get("simulation_id", "sim_current"),
            "voltages": node_voltages,
            "currents": branch_currents,
            "powers": comp_powers,
            "total_power_mW": sim_data.get("total_power_mW", 0.0)
        }
    else:
        simulation_grounding = {
            "status": solver_status if solver_status in ["NOT_RUN", "ERROR"] else "NOT_RUN",
            "source": "MNA"
        }

    # 7. Process AR Grounding (Rule 13)
    reg_data = circuit_state.get("registration") or {}
    ar_grounding = {
        "tracking": reg_data.get("status", "UNREGISTERED"),
        "coordinate_system": "BREADBOARD_CANONICAL",
        "registration": "ACTIVE" if reg_data.get("status") in ["REGISTERED", "TRACKED"] else "INACTIVE",
        "confidence": reg_data.get("confidence", 0.0),
        "breadboard_corners": reg_data.get("breadboard_corners", [])
    }

    # 8. Overall Grounding Status Determination (Rule 14)
    has_shorts = len(topology.get("short_circuits", [])) > 0
    if len(comps) == 0:
        overall_status = "UNKNOWN"
    elif has_shorts or (unknown_comp_count > 0 and verified_comp_count == 0):
        overall_status = "BLOCKED"
    elif ambiguous_comp_count > 0:
        overall_status = "AMBIGUOUS"
    elif unknown_comp_count > 0:
        overall_status = "PARTIALLY_VERIFIED"
    else:
        overall_status = "VERIFIED"

    # 9. Summary Counts (Rule 15)
    summary = {
        "component_count": len(comps),
        "verified_components": verified_comp_count,
        "unknown_components": unknown_comp_count,
        "ambiguous_components": ambiguous_comp_count,
        "rejected_detections": len(grounded_rejected),
        "verified_connections": len(grounded_connections),
        "verified_nodes": len(grounded_nodes),
        "simulation_status": simulation_grounding.get("status"),
        "overall_status": overall_status
    }

    # 10. Human-Readable Description (Rule 19)
    desc_lines = []
    for gc in grounded_components:
        cid = gc["id"]
        ctype = gc["type"]
        val_str = gc["display_value"]
        t_a = gc["terminals"]["terminal_a"]["hole"] or "Unmapped"
        t_b = gc["terminals"]["terminal_b"]["hole"] or "Unmapped"
        n_a = gc["terminals"]["terminal_a"]["electrical_node"] or "None"
        n_b = gc["terminals"]["terminal_b"]["electrical_node"] or "None"
        desc_lines.append(
            f"{cid} is a {val_str} {ctype}. "
            f"Terminal A is mapped to {t_a} ({gc['terminals']['terminal_a']['status']}). "
            f"Terminal B is mapped to {t_b} ({gc['terminals']['terminal_b']['status']}). "
            f"Connects between electrical nodes {n_a} and {n_b}."
        )
    for gw in grounded_wires:
        desc_lines.append(f"Wire {gw['id']} bridges {gw['start_hole']} to {gw['end_hole']}.")

    human_description = "\n".join(desc_lines) if desc_lines else "Circuit contains no physical components."

    return {
        "schema_version": "22.1",
        "circuit_signature": circuit_sig,
        "overall_status": overall_status,
        "summary": summary,
        "components": grounded_components,
        "wires": grounded_wires,
        "connections": grounded_connections,
        "nodes": grounded_nodes,
        "canonical_holes": utilized_holes,
        "diagnostics": grounded_diagnostics,
        "rejected_detections": grounded_rejected,
        "simulation": simulation_grounding,
        "ar": ar_grounding,
        "topology": topology,
        "human_description": human_description
    }
