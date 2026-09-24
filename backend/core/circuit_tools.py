"""
SmartBreadboard 3D — Deterministic Circuit Tools Interface for Future LLM Agent (Phase 19.13)
Exposes clean, deterministic functions for querying verified circuit state, topology,
connections, electrical nodes, simulation results, faults, and AR tracking state.

The LLM agent reasons over verified ground truth and calls these tools.
It never calculates or fabricates electrical values directly.
"""

from typing import Dict, Any, List, Optional


def get_verified_circuit(circuit_state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Returns the complete verified circuit representation including components,
    nodes, power supply, and simulation validity.
    """
    netlist = circuit_state.get("netlist") or circuit_state
    comps = netlist.get("components", [])
    nodes = netlist.get("nodes", [])
    validity = netlist.get("validity", {})
    solver_status = netlist.get("solver_status", "NOT_RUN")

    return {
        "status": "success",
        "verified_component_count": len(comps),
        "electrical_node_count": len(nodes),
        "circuit_validity": validity.get("status", "UNKNOWN"),
        "solver_status": solver_status,
        "components": [
            {
                "id": c.get("id") or c.get("designator"),
                "type": c.get("type"),
                "value": c.get("value"),
                "unit": c.get("unit", "Ω"),
                "start_hole": c.get("start_hole") or c.get("hole1"),
                "end_hole": c.get("end_hole") or c.get("hole2"),
                "source": c.get("source", "detected"),
                "verified": c.get("verified", True)
            }
            for c in comps
        ],
        "nodes": [
            {
                "id": n.get("id"),
                "holes": n.get("holes", []),
                "connected_pins": n.get("connected_pins", [])
            }
            for n in nodes
        ]
    }


def get_component(circuit_state: Dict[str, Any], component_id: str) -> Dict[str, Any]:
    """
    Returns detailed verified telemetry for a specific component.
    """
    netlist = circuit_state.get("netlist") or circuit_state
    comps = netlist.get("components", [])

    c_match = next((c for c in comps if (c.get("id") == component_id or c.get("designator") == component_id)), None)
    if not c_match:
        return {
            "status": "not_found",
            "found": False,
            "error": f"Component '{component_id}' not found in active verified circuit."
        }

    verified = c_match.get("verified", c_match.get("verification") == "VERIFIED")
    verification = c_match.get("verification", "VERIFIED" if verified else "UNKNOWN")
    source = c_match.get("source", "ai")

    terminals = c_match.get("terminals", {})
    start_h = c_match.get("start_hole") or c_match.get("hole1")
    if not start_h and isinstance(terminals, dict):
        start_h = terminals.get("terminal_a", {}).get("hole") if isinstance(terminals.get("terminal_a"), dict) else None
    end_h = c_match.get("end_hole") or c_match.get("hole2")
    if not end_h and isinstance(terminals, dict):
        end_h = terminals.get("terminal_b", {}).get("hole") if isinstance(terminals.get("terminal_b"), dict) else None

    return {
        "status": "success",
        "found": True,
        "component_id": c_match.get("id") or c_match.get("designator"),
        "type": c_match.get("type"),
        "value": c_match.get("value"),
        "unit": c_match.get("unit", "Ω"),
        "verified": verified,
        "verification": verification,
        "source": source,
        "start_hole": start_h,
        "end_hole": end_h,
        "terminals": terminals,
        "component": c_match
    }


def get_component_connections(circuit_state: Dict[str, Any], component_id: str) -> Dict[str, Any]:
    """
    Returns the electrical nodes and adjacent connected components for a given component.
    """
    netlist = circuit_state.get("netlist") or circuit_state
    comps = netlist.get("components", [])
    nets = netlist.get("nets", [])

    c_match = next((c for c in comps if (c.get("id") == component_id or c.get("designator") == component_id)), None)
    if not c_match:
        return {
            "status": "not_found",
            "error": f"Component '{component_id}' not found."
        }

    h1 = c_match.get("start_hole") or c_match.get("hole1")
    h2 = c_match.get("end_hole") or c_match.get("hole2")

    adjacent_comps = []
    for other in comps:
        oid = other.get("id") or other.get("designator")
        if oid == component_id:
            continue
        oh1 = other.get("start_hole") or other.get("hole1")
        oh2 = other.get("end_hole") or other.get("hole2")

        if (h1 and (h1 == oh1 or h1 == oh2)) or (h2 and (h2 == oh1 or h2 == oh2)):
            adjacent_comps.append(oid)

    return {
        "status": "success",
        "component_id": component_id,
        "terminals": {
            "start_hole": h1,
            "end_hole": h2
        },
        "adjacent_components": list(set(adjacent_comps))
    }


def get_electrical_node(circuit_state: Dict[str, Any], node_id: str) -> Dict[str, Any]:
    """
    Returns tie-point holes, connected pins, bridging wires, and MNA voltage for a specific electrical node.
    """
    netlist = circuit_state.get("netlist") or circuit_state
    nodes = netlist.get("nodes", [])
    if not nodes:
        ng = circuit_state.get("node_graph") or {}
        nodes = ng.get("nodes", [])
    if not nodes:
        from core.circuit_intelligence import ElectricalNodeGraph
        comps = netlist.get("components", [])
        graph_builder = ElectricalNodeGraph()
        for c in comps:
            graph_builder.add_component(c)
        ng = graph_builder.build_graph()
        nodes = ng.get("nodes", [])

    n_match = next((n for n in nodes if n.get("id") == node_id), None)
    if not n_match:
        return {
            "status": "not_found",
            "found": False,
            "error": f"Electrical node '{node_id}' not found in verified circuit."
        }

    sim_data = circuit_state.get("electrical_analysis") or circuit_state.get("simulationResult") or {}
    node_v = sim_data.get("node_voltages", {}).get(node_id)

    raw_wires = netlist.get("wires", [])
    node_holes = set(n_match.get("holes", []))
    connected_wires = [w.get("id") for w in raw_wires if w.get("start_hole") in node_holes or w.get("end_hole") in node_holes]

    return {
        "status": "success",
        "found": True,
        "node_id": node_id,
        "node": n_match,
        "holes": n_match.get("holes", []),
        "connected_pins": n_match.get("connected_pins", []),
        "connected_wires": connected_wires,
        "voltage_v": node_v
    }


def get_topology(circuit_state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Returns graph-based series, parallel, junction, and fault topology analysis.
    """
    netlist = circuit_state.get("netlist") or circuit_state
    topo = netlist.get("topology") or circuit_state.get("topology")

    if not topo:
        from core.circuit_intelligence import ElectricalNodeGraph, TopologyAnalyzer
        comps = netlist.get("components", [])
        graph_builder = ElectricalNodeGraph()
        for c in comps:
            graph_builder.add_component(c)
        ng = graph_builder.build_graph()
        analyzer = TopologyAnalyzer(ng, comps)
        topo = analyzer.analyze()

    return {
        "status": "success",
        "topology": topo
    }


def get_simulation_results(circuit_state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Returns verified MNA numerical simulation results (voltages, branch currents, powers).
    """
    sim = circuit_state.get("electrical_analysis") or circuit_state.get("simulationResult")
    if not sim:
        return {
            "status": "not_available",
            "has_simulation": False,
            "solver_status": "NOT_RUN",
            "message": "Simulation has not been executed on this circuit state."
        }

    return {
        "status": "success",
        "has_simulation": True,
        "solver_status": sim.get("solver_status", "SOLVED" if sim.get("success", True) else "ERROR"),
        "measurements": sim.get("measurements", {}),
        "node_voltages": sim.get("node_voltages", {}),
        "branch_currents": sim.get("branch_currents", {}),
        "component_powers": sim.get("component_powers", {}),
        "total_power_mw": sim.get("total_power_mw", 0.0)
    }


def get_faults(circuit_state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Returns all detected circuit anomalies (short circuits, open loops, floating pins).
    """
    netlist = circuit_state.get("netlist") or circuit_state
    validity = circuit_state.get("validity") or netlist.get("validity", {})
    errors = validity.get("errors", [])
    warnings = validity.get("warnings", [])
    
    topo = get_topology(circuit_state).get("topology", {})
    shorts = topo.get("short_circuits", [])
    floating = topo.get("floating_components", [])
    has_faults = len(shorts) > 0 or len(floating) > 0 or len(errors) > 0
    is_valid = validity.get("status") == "VALID" and not has_faults if validity.get("status") else not has_faults

    return {
        "status": "success",
        "valid": is_valid,
        "has_faults": has_faults,
        "errors": errors,
        "warnings": warnings,
        "short_circuits": shorts,
        "floating_components": floating
    }


def get_ar_state(circuit_state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Returns AR tracking registration, homography matrix, and camera alignment metrics.
    """
    reg = circuit_state.get("registration") or {}
    return {
        "status": "success",
        "ar_status": reg.get("status", "UNREGISTERED"),
        "confidence": reg.get("confidence", 0.0),
        "breadboard_corners": reg.get("breadboard_corners", [])
    }


def get_component_measurements(circuit_state: Dict[str, Any], component_id: str) -> Dict[str, Any]:
    """
    Returns voltage drop, branch current, and power dissipation for a specific component.
    """
    sim = get_simulation_results(circuit_state)
    if sim.get("status") != "success":
        return {
            "status": "not_available",
            "component_id": component_id,
            "error": "Simulation measurements are not available."
        }
    
    measurements = sim.get("measurements", {})
    comp_m = measurements.get(component_id)
    if not comp_m:
        return {
            "status": "not_found",
            "component_id": component_id,
            "error": f"No simulation measurements found for '{component_id}'."
        }
    
    return {
        "status": "success",
        "component_id": component_id,
        "measurements": comp_m
    }


def get_terminal_mapping(circuit_state: Dict[str, Any], component_id: str) -> Dict[str, Any]:
    """
    Returns terminal details, lead coordinates, and mapped breadboard holes for a component.
    """
    comp_info = get_component(circuit_state, component_id)
    if comp_info.get("status") != "success":
        return comp_info
    
    comp = comp_info.get("component", {})
    return {
        "status": "success",
        "component_id": component_id,
        "terminals": comp.get("terminals", [
            {"name": "terminal_a", "hole": comp.get("start_hole") or comp.get("hole1")},
            {"name": "terminal_b", "hole": comp.get("end_hole") or comp.get("hole2")}
        ]),
        "mapping_confidence": comp.get("mapping_confidence", 1.0)
    }


def get_hole_mapping(circuit_state: Dict[str, Any], component_id: str) -> Dict[str, Any]:
    """
    Returns physical start_hole and end_hole tie-point identifiers for a component.
    """
    comp_info = get_component(circuit_state, component_id)
    if comp_info.get("status") != "success":
        return comp_info
    
    comp = comp_info.get("component", {})
    terminals = comp.get("terminals", {})
    has_ambiguity = False
    
    h1 = comp.get("start_hole") or comp.get("hole1")
    h2 = comp.get("end_hole") or comp.get("hole2")

    if isinstance(terminals, dict):
        if not h1:
            t_a = terminals.get("terminal_a") or terminals.get("anode")
            if isinstance(t_a, dict):
                h1 = t_a.get("hole")
            elif isinstance(t_a, str):
                h1 = t_a
        if not h2:
            t_b = terminals.get("terminal_b") or terminals.get("cathode")
            if isinstance(t_b, dict):
                h2 = t_b.get("hole")
            elif isinstance(t_b, str):
                h2 = t_b

        for t_name, t_val in terminals.items():
            if isinstance(t_val, dict):
                if t_val.get("ambiguous") or t_val.get("hole") in ["AMBIGUOUS", "UNKNOWN", None]:
                    has_ambiguity = True
            elif t_val in ["AMBIGUOUS", "UNKNOWN", None]:
                has_ambiguity = True
    elif isinstance(terminals, list):
        if not h1 and len(terminals) > 0:
            h1 = terminals[0].get("hole") if isinstance(terminals[0], dict) else terminals[0]
        if not h2 and len(terminals) > 1:
            h2 = terminals[1].get("hole") if isinstance(terminals[1], dict) else terminals[1]
        for t in terminals:
            if isinstance(t, dict) and (t.get("ambiguous") or t.get("hole") in ["AMBIGUOUS", "UNKNOWN", None]):
                has_ambiguity = True

    if h1 in ["AMBIGUOUS", "UNKNOWN", None] or h2 in ["AMBIGUOUS", "UNKNOWN", None]:
        has_ambiguity = True

    return {
        "status": "success",
        "component_id": component_id,
        "start_hole": h1,
        "end_hole": h2,
        "has_ambiguity": has_ambiguity,
        "terminals": terminals
    }


def get_verification_diagnostics(circuit_state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Returns Phase 18 computer vision candidate verification summary, breakdown, and rejection reasons.
    """
    vv = circuit_state.get("vision_verification") or {}
    return {
        "status": "success",
        "raw_count": vv.get("raw_count", 0),
        "verified_count": vv.get("verified_count", 0),
        "unknown_count": vv.get("unknown_count", 0),
        "rejected_count": vv.get("rejected_count", 0),
        "all_candidates": vv.get("all_candidates", [])
    }


def get_netlist_status(circuit_state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Returns netlist validity status (VALID / INVALID) and validation reason.
    """
    netlist = circuit_state.get("netlist") or circuit_state
    validity = netlist.get("validity", {})
    return {
        "status": "success",
        "validity_status": validity.get("status", "UNKNOWN"),
        "reason": validity.get("reason", "Netlist status unrecorded.")
    }


def get_solver_status(circuit_state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Returns MNA numerical solver status (SOLVED, NOT_RUN, ERROR) and solver reason.
    """
    netlist = circuit_state.get("netlist") or circuit_state
    sim = circuit_state.get("electrical_analysis") or circuit_state.get("simulationResult") or {}
    return {
        "status": "success",
        "solver_status": netlist.get("solver_status") or sim.get("solver_status") or "NOT_RUN",
        "reason": netlist.get("solver_reason") or sim.get("reason") or "Solver status ready."
    }


def compute_circuit_signature(netlist: Dict[str, Any]) -> str:
    """Computes a deterministic hash signature of component topologies and values."""
    comps = netlist.get("components", [])
    sources = netlist.get("sources", [])
    
    parts = []
    for c in sorted(comps, key=lambda x: str(x.get("id") or x.get("designator"))):
        cid = str(c.get("id") or c.get("designator"))
        ctype = str(c.get("type", ""))
        cval = str(c.get("value", ""))
        h1 = str(c.get("start_hole") or c.get("hole1") or c.get("node1", ""))
        h2 = str(c.get("end_hole") or c.get("hole2") or c.get("node2", ""))
        parts.append(f"{cid}:{ctype}:{cval}:{h1}:{h2}")
        
    for s in sorted(sources, key=lambda x: str(x.get("id", ""))):
        sid = str(s.get("id", "SRC"))
        sval = str(s.get("voltage", s.get("value", 5.0)))
        pn = str(s.get("positive_node") or s.get("node_pos", ""))
        nn = str(s.get("negative_node") or s.get("node_neg", ""))
        parts.append(f"{sid}:{sval}:{pn}:{nn}")
        
    return "|".join(parts)


def simulate_verified_circuit(circuit_state: Dict[str, Any], force_rerun: bool = False) -> Dict[str, Any]:
    """
    Executes pre-validation checks and runs the deterministic MNA numerical solver on the verified circuit.
    Distinguishes SOLVED, BLOCKED, NOT_RUN, and ERROR states.
    Uses circuit signature caching to prevent unnecessary re-computations on unchanged circuits.
    """
    import time
    netlist = circuit_state.get("netlist") or circuit_state
    comps = netlist.get("components", [])
    sources = netlist.get("sources", []) or circuit_state.get("sources", [])

    # Handle power source passed in other common state fields
    if not sources:
        ps = circuit_state.get("power_source") or circuit_state.get("powerSources")
        if ps:
            sources = [ps] if isinstance(ps, dict) else ps
            netlist["sources"] = sources
    
    # Pre-simulation deterministic check 1: Empty circuit
    if not comps:
        return {
            "status": "BLOCKED",
            "solver": "MNA",
            "reason": "Circuit contains no detected or defined components.",
            "blocking_checks": ["empty_circuit"]
        }

    # Pre-simulation deterministic check 2: UNKNOWN components on active branches
    for c in comps:
        cid = c.get("id") or c.get("designator", "UNKNOWN")
        is_manual = c.get("source") == "manual"
        is_unknown = c.get("verification") == "UNKNOWN" or (c.get("verified") is False and not is_manual)
        if is_unknown:
            return {
                "status": "BLOCKED",
                "solver": "MNA",
                "reason": f"Component '{cid}' is unverified (UNKNOWN). Please define its parameters manually or verify it before simulation.",
                "blocking_checks": ["unknown_component"]
            }

    # Pre-simulation deterministic check 3: Unresolved or ambiguous terminal mappings
    for c in comps:
        cid = c.get("id") or c.get("designator", "UNKNOWN")
        h_info = get_hole_mapping(circuit_state, cid)
        if h_info.get("has_ambiguity"):
            return {
                "status": "BLOCKED",
                "solver": "MNA",
                "reason": f"Component '{cid}' has ambiguous or unmapped terminal connections.",
                "blocking_checks": ["terminal_mapping"]
            }
        h1 = h_info.get("start_hole")
        h2 = h_info.get("end_hole")
        if not h1 or not h2:
            return {
                "status": "BLOCKED",
                "solver": "MNA",
                "reason": f"Component '{cid}' terminals are not mapped to valid breadboard tie-points.",
                "blocking_checks": ["terminal_mapping"]
            }

    # Pre-simulation deterministic check 4: Short circuits
    topo_res = get_topology(circuit_state).get("topology", {})
    shorts = topo_res.get("short_circuits", [])
    if shorts:
        s_reasons = [s.get("reason", "Both terminals connect to identical node") for s in shorts]
        return {
            "status": "BLOCKED",
            "solver": "MNA",
            "reason": f"Short circuit detected: {'; '.join(s_reasons)}",
            "blocking_checks": ["short_circuit"]
        }

    # Pre-simulation deterministic check 5: Power source required
    if not sources:
        return {
            "status": "BLOCKED",
            "solver": "MNA",
            "reason": "No active power source (VCC/GND) connected. A DC power source is required to run simulation.",
            "blocking_checks": ["power_source"]
        }

    # Pre-simulation deterministic check 6: Netlist validation
    from circuit_solver.validation import validate_circuit_netlist
    is_valid, err_dict, warnings = validate_circuit_netlist(comps, sources)
    if not is_valid:
        err_msg = err_dict.get("message", "Circuit topology failed netlist validation.") if err_dict else "Invalid netlist"
        err_code = err_dict.get("code", "INVALID_NETLIST") if err_dict else "INVALID_NETLIST"
        return {
            "status": "BLOCKED",
            "solver": "MNA",
            "reason": err_msg,
            "blocking_checks": [err_code.lower()]
        }

    # Simulation Signature & Cache Policy
    signature = compute_circuit_signature(netlist)
    last_sig = circuit_state.get("_last_simulation_signature")
    cached_sim = circuit_state.get("simulationResult") or circuit_state.get("electrical_analysis")
    
    if not force_rerun and last_sig == signature and cached_sim and cached_sim.get("success"):
        return {
            "status": "SOLVED",
            "solver": "MNA",
            "cached": True,
            "simulation_id": cached_sim.get("simulation_id", "sim_cached"),
            "circuit_signature": signature,
            "node_voltages": cached_sim.get("node_voltages", {}),
            "branch_currents": {c.get("id"): c.get("current") for c in cached_sim.get("components", [])} if cached_sim.get("components") else cached_sim.get("branch_currents", {}),
            "component_measurements": cached_sim.get("measurements", {}),
            "power": {
                "total_power_mW": cached_sim.get("total_power_mW", 0.0),
                "component_powers": {c.get("id"): c.get("power", 0.0) for c in cached_sim.get("components", [])} if cached_sim.get("components") else cached_sim.get("component_powers", {})
            },
            "results": cached_sim,
            "validation": {
                "status": "VALID",
                "warnings": cached_sim.get("warnings", [])
            }
        }

    # Ensure node1 and node2 connections on components for solver
    for c in comps:
        if not c.get("node1"):
            c["node1"] = c.get("start_hole") or c.get("hole1")
        if not c.get("node2"):
            c["node2"] = c.get("end_hole") or c.get("hole2")

    # Run MNA numerical solver
    from circuit_solver.mna_solver import solve_dc_circuit
    from circuit_solver.results import format_solver_result
    
    try:
        solver_res = solve_dc_circuit(netlist)
        formatted = format_solver_result(solver_res, netlist)
        
        if not solver_res.success:
            return {
                "status": "ERROR",
                "solver": "MNA",
                "reason": solver_res.error.get("message", "Numerical solver failed."),
                "results": formatted
            }

        # Update circuit_state with real simulation results
        sim_id = f"sim_{int(time.time() * 1000)}"
        formatted["simulation_id"] = sim_id
        formatted["success"] = True
        formatted["solver_status"] = "SOLVED"
        
        circuit_state["electrical_analysis"] = formatted
        circuit_state["simulationResult"] = formatted
        circuit_state["solverStatus"] = "solved"
        circuit_state["solver_status"] = "SOLVED"
        circuit_state["_last_simulation_signature"] = signature

        node_voltages = formatted.get("node_voltages", {}) or getattr(solver_res, "node_voltages", {})
        branch_currents = {c["id"]: c["current"] for c in formatted.get("components", [])}
        component_powers = {c["id"]: c.get("power", 0.0) for c in formatted.get("components", [])}

        return {
            "status": "SOLVED",
            "solver": "MNA",
            "simulation_id": sim_id,
            "circuit_signature": signature,
            "cached": False,
            "node_voltages": node_voltages,
            "branch_currents": branch_currents,
            "component_measurements": formatted.get("measurements", {}),
            "power": {
                "total_power_mW": formatted.get("total_power_mW", 0.0),
                "component_powers": component_powers
            },
            "results": formatted,
            "validation": {
                "status": "VALID",
                "warnings": formatted.get("warnings", [])
            }
        }
    except Exception as e:
        return {
            "status": "ERROR",
            "solver": "MNA",
            "reason": f"MNA solver exception: {str(e)}"
        }



def get_correction_suggestions(circuit_state: Dict[str, Any], component_id: Optional[str] = None) -> Dict[str, Any]:
    """
    Analyzes verified circuit state, detects ambiguous terminal mappings, unknown components,
    or topology faults, and generates deterministic, safe correction suggestions with signature versioning.
    Never fabricates electrical values or automatically verifies unknown components without user definition.
    Never shifts short circuits without independent terminal candidate evidence.
    """
    import time
    netlist = circuit_state.get("netlist") or circuit_state
    comps = netlist.get("components", [])
    circuit_sig = compute_circuit_signature(netlist)
    now_ts = time.time()
    
    suggestions = []
    
    target_comps = [c for c in comps if not component_id or (c.get("id") == component_id or c.get("designator") == component_id)]
    
    for c in target_comps:
        cid = c.get("id") or c.get("designator", "UNKNOWN_COMP")
        ctype = c.get("type", "resistor")
        cval = c.get("value")
        cunit = c.get("unit", "Ω")
        
        is_unknown = (
            c.get("verification") == "UNKNOWN" or 
            c.get("source") == "unknown" or 
            ctype in ["unknown", "UNKNOWN", None]
        )
        
        h_info = get_hole_mapping(circuit_state, cid)
        has_ambiguity = h_info.get("has_ambiguity", False)
        h1 = h_info.get("start_hole") or c.get("start_hole") or c.get("hole1")
        h2 = h_info.get("end_hole") or c.get("end_hole") or c.get("hole2")
        
        # 1. Ambiguous or missing hole mappings
        if has_ambiguity or not h1 or not h2 or h1 in ["AMBIGUOUS", "UNKNOWN", None] or h2 in ["AMBIGUOUS", "UNKNOWN", None]:
            # Derive deterministic suggested holes
            sugg_h1 = h1 if (h1 and h1 not in ["AMBIGUOUS", "UNKNOWN", None]) else None
            sugg_h2 = h2 if (h2 and h2 not in ["AMBIGUOUS", "UNKNOWN", None]) else None
            
            # Check terminal candidates if present
            terms = c.get("terminals", {})
            if isinstance(terms, dict):
                ta = terms.get("terminal_a") or terms.get("anode") or {}
                tb = terms.get("terminal_b") or terms.get("cathode") or {}
                if not sugg_h1 and isinstance(ta, dict) and ta.get("candidate_holes"):
                    sugg_h1 = ta.get("candidate_holes")[0]
                if not sugg_h2 and isinstance(tb, dict) and tb.get("candidate_holes"):
                    sugg_h2 = tb.get("candidate_holes")[0]
            
            # Fallback deterministic snapping rules
            if not sugg_h1 and sugg_h2:
                row_char = sugg_h2[0] if sugg_h2[0].isalpha() else "E"
                try:
                    col_num = int("".join(ch for ch in sugg_h2 if ch.isdigit()))
                    sugg_h1 = f"{row_char}{max(1, col_num - 5)}"
                except Exception:
                    sugg_h1 = "E10"
            elif sugg_h1 and not sugg_h2:
                row_char = sugg_h1[0] if sugg_h1[0].isalpha() else "E"
                try:
                    col_num = int("".join(ch for ch in sugg_h1 if ch.isdigit()))
                    sugg_h2 = f"{row_char}{col_num + 5}"
                except Exception:
                    sugg_h2 = "E15"
            elif not sugg_h1 and not sugg_h2:
                sugg_h1 = "E10"
                sugg_h2 = "E15"
                
            prop_id = f"prop_hole_{cid}_{int(now_ts)}"
            diag_id = f"diag_hole_{cid}"

            suggestions.append({
                "proposal_id": prop_id,
                "diagnostic_id": diag_id,
                "circuit_signature": circuit_sig,
                "created_at": now_ts,
                "component_id": cid,
                "issue": "ambiguous_terminals",
                "severity": "blocking",
                "status": "PROPOSED",
                "description": f"Component {cid} has ambiguous or unmapped terminals ({h1 or 'None'} → {h2 or 'None'}). Deterministic suggestion snaps terminals to breadboard tie-points {sugg_h1} and {sugg_h2}.",
                "correction_type": "TERMINAL_HOLE_REMAP",
                "suggested_type": ctype if not is_unknown else None,
                "suggested_value": cval if not is_unknown else None,
                "suggested_unit": cunit,
                "suggested_start_hole": sugg_h1,
                "suggested_end_hole": sugg_h2,
                "candidate": {
                    "start_hole": sugg_h1,
                    "end_hole": sugg_h2,
                    "type": ctype if not is_unknown else None,
                    "value": cval if not is_unknown else None
                },
                "action": "update_component_terminals",
                "action_payload": {
                    "proposal_id": prop_id,
                    "diagnostic_id": diag_id,
                    "circuit_signature": circuit_sig,
                    "created_at": now_ts,
                    "correction_type": "TERMINAL_HOLE_REMAP",
                    "component_id": cid,
                    "hole1": sugg_h1,
                    "hole2": sugg_h2,
                    "type": ctype if not is_unknown else None,
                    "value": cval if not is_unknown else None,
                    "unit": cunit,
                    "user_confirmed": True
                }
            })
            continue

        # 2. Unknown Component Safety (Rule 1: Never automatically verify without explicit user definition)
        if is_unknown:
            prop_id = f"prop_unknown_{cid}_{int(now_ts)}"
            diag_id = f"diag_unknown_{cid}"
            suggestions.append({
                "proposal_id": prop_id,
                "diagnostic_id": diag_id,
                "circuit_signature": circuit_sig,
                "created_at": now_ts,
                "component_id": cid,
                "issue": "unknown_component",
                "severity": "blocking",
                "status": "PROPOSED",
                "requires_user_definition": True,
                "description": f"Component {cid} was detected as UNKNOWN by the vision pipeline. Explicit user definition of component type and value is required before it can be verified or simulated.",
                "correction_type": "USER_COMPONENT_DEFINITION",
                "suggested_type": None,
                "suggested_value": None,
                "suggested_unit": "Ω",
                "suggested_start_hole": h1,
                "suggested_end_hole": h2,
                "candidate": {
                    "start_hole": h1,
                    "end_hole": h2,
                    "type": None,
                    "value": None
                },
                "action": "define_unknown_component",
                "action_payload": {
                    "proposal_id": prop_id,
                    "diagnostic_id": diag_id,
                    "circuit_signature": circuit_sig,
                    "created_at": now_ts,
                    "correction_type": "USER_COMPONENT_DEFINITION",
                    "component_id": cid,
                    "hole1": h1,
                    "hole2": h2,
                    "user_confirmed": True
                }
            })
            continue

        # 3. Short-circuit detection safety (Rule 2: Never automatically shift without independent candidate evidence)
        if h1 and h2 and h1 == h2:
            terms = c.get("terminals", {})
            has_independent_evidence = False
            sugg_fixed_h2 = None
            
            if isinstance(terms, dict):
                tb = terms.get("terminal_b") or terms.get("cathode") or {}
                if isinstance(tb, dict) and tb.get("candidate_holes"):
                    cands = [ch for ch in tb.get("candidate_holes") if ch != h1]
                    if cands:
                        has_independent_evidence = True
                        sugg_fixed_h2 = cands[0]

            prop_id = f"prop_short_{cid}_{int(now_ts)}"
            diag_id = f"diag_short_{cid}"

            if has_independent_evidence and sugg_fixed_h2:
                suggestions.append({
                    "proposal_id": prop_id,
                    "diagnostic_id": diag_id,
                    "circuit_signature": circuit_sig,
                    "created_at": now_ts,
                    "component_id": cid,
                    "issue": "short_circuit",
                    "severity": "critical",
                    "status": "PROPOSED",
                    "candidate_evidence": True,
                    "description": f"Component {cid} terminals share hole {h1}. Vision candidate evidence supports mapping terminal B to {sugg_fixed_h2}.",
                    "correction_type": "TERMINAL_HOLE_REMAP",
                    "suggested_type": ctype,
                    "suggested_value": cval,
                    "suggested_unit": cunit,
                    "suggested_start_hole": h1,
                    "suggested_end_hole": sugg_fixed_h2,
                    "candidate": {
                        "start_hole": h1,
                        "end_hole": sugg_fixed_h2,
                        "type": ctype,
                        "value": cval
                    },
                    "action": "update_component_terminals",
                    "action_payload": {
                        "proposal_id": prop_id,
                        "diagnostic_id": diag_id,
                        "circuit_signature": circuit_sig,
                        "created_at": now_ts,
                        "correction_type": "TERMINAL_HOLE_REMAP",
                        "component_id": cid,
                        "hole1": h1,
                        "hole2": sugg_fixed_h2,
                        "type": ctype,
                        "value": cval,
                        "unit": cunit,
                        "candidate_evidence": True,
                        "user_confirmed": True
                    }
                })
            else:
                # No independent vision candidate evidence: report true electrical short without automatic shift
                suggestions.append({
                    "proposal_id": prop_id,
                    "diagnostic_id": diag_id,
                    "circuit_signature": circuit_sig,
                    "created_at": now_ts,
                    "component_id": cid,
                    "issue": "short_circuit",
                    "severity": "critical",
                    "status": "BLOCKED",
                    "candidate_evidence": False,
                    "description": f"Short circuit detected on component {cid} (both terminals mapped to {h1}). No independent vision terminal evidence exists to justify moving terminals automatically.",
                    "correction_type": "SHORT_CIRCUIT_REPORT",
                    "suggested_type": ctype,
                    "suggested_value": cval,
                    "suggested_unit": cunit,
                    "suggested_start_hole": h1,
                    "suggested_end_hole": h1,
                    "candidate": None,
                    "action": "none"
                })

    return {
        "status": "success",
        "circuit_signature": circuit_sig,
        "suggestions_count": len(suggestions),
        "suggestions": suggestions
    }


def apply_circuit_correction(circuit_state: Dict[str, Any], correction_request: Dict[str, Any]) -> Dict[str, Any]:
    """
    Executes authoritative backend validation and applies the verified correction to the circuit.
    """
    from core.correction_engine import validate_and_apply_correction
    return validate_and_apply_correction(circuit_state, correction_request)


def get_visual_grounding(circuit_state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Returns the complete deterministic Visual Grounding State (Phase 22.1).
    """
    from core.visual_grounding import build_visual_grounding_state
    return build_visual_grounding_state(circuit_state)


AVAILABLE_CIRCUIT_TOOLS = {
    "get_verified_circuit": get_verified_circuit,
    "get_component": get_component,
    "get_component_connections": get_component_connections,
    "get_electrical_node": get_electrical_node,
    "get_topology": get_topology,
    "get_simulation_results": get_simulation_results,
    "get_faults": get_faults,
    "get_ar_state": get_ar_state,
    "get_component_measurements": get_component_measurements,
    "get_terminal_mapping": get_terminal_mapping,
    "get_hole_mapping": get_hole_mapping,
    "get_verification_diagnostics": get_verification_diagnostics,
    "get_netlist_status": get_netlist_status,
    "get_solver_status": get_solver_status,
    "simulate_verified_circuit": simulate_verified_circuit,
    "get_correction_suggestions": get_correction_suggestions,
    "apply_circuit_correction": apply_circuit_correction,
    "get_visual_grounding": get_visual_grounding
}


def execute_circuit_tool(tool_name: str, tool_args: Dict[str, Any], circuit_state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Executes a requested deterministic circuit tool with given arguments against verified circuit state.
    """
    tool_fn = AVAILABLE_CIRCUIT_TOOLS.get(tool_name)
    if not tool_fn:
        return {
            "status": "error",
            "error": f"Unknown circuit tool '{tool_name}'. Available tools: {list(AVAILABLE_CIRCUIT_TOOLS.keys())}"
        }

    try:
        if tool_name in ["get_component", "get_component_connections", "get_component_measurements", "get_terminal_mapping", "get_hole_mapping"]:
            return tool_fn(circuit_state, tool_args.get("component_id", ""))
        elif tool_name == "get_correction_suggestions":
            return tool_fn(circuit_state, component_id=tool_args.get("component_id"))
        elif tool_name == "apply_circuit_correction":
            return tool_fn(circuit_state, tool_args)
        elif tool_name == "get_electrical_node":
            return tool_fn(circuit_state, tool_args.get("node_id", ""))
        elif tool_name == "simulate_verified_circuit":
            return tool_fn(circuit_state, force_rerun=tool_args.get("force_rerun", False))
        else:
            return tool_fn(circuit_state)
    except Exception as e:
        return {
            "status": "error",
            "error": f"Tool execution error in '{tool_name}': {str(e)}"
        }

