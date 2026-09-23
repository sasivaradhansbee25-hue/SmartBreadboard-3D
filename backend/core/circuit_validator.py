"""
SmartBreadboard 3D — Real Circuit Validation Engine
Validates reconstructed circuit topologies for engineering correctness:
power source presence, closed loop electrical paths, direct short circuits,
floating terminals, invalid holes, and uncertain mappings before MNA simulation.
"""

from typing import Dict, Any, List, Tuple, Set, Optional
from collections import deque
from core.wire_connectivity import is_valid_hole_id

def validate_circuit(netlist: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validates complete circuit netlist topology.
    Returns:
    {
        "valid": bool,
        "status": "VALID" | "INCOMPLETE" | "WARNING" | "INVALID",
        "errors": list[str],
        "warnings": list[str],
        "checks": dict[str, Any],
        "component_connectivity": list[dict],
        "solver_status": "READY" | "NOT_RUN",
        "solver_reason": str (optional)
    }
    """
    errors: List[str] = []
    warnings: List[str] = []

    components = netlist.get("components", [])
    power_sources = netlist.get("power_sources", [])
    power_status = netlist.get("power_source_status", {})
    nets = netlist.get("nets", [])

    # 1. Component Count & ID Validation
    component_count = len(components)
    has_components = component_count > 0

    seen_ids: Set[str] = set()
    duplicate_ids: List[str] = []
    for c in components:
        cid = str(c.get("designator") or c.get("id") or "")
        if cid in seen_ids:
            duplicate_ids.append(cid)
        seen_ids.add(cid)

    no_duplicate_ids = len(duplicate_ids) == 0
    if not no_duplicate_ids:
        errors.append(f"Duplicate component IDs detected: {', '.join(duplicate_ids)}")

    if not has_components:
        return {
            "valid": False,
            "status": "INCOMPLETE",
            "errors": ["Circuit contains no detected or defined components."],
            "warnings": [],
            "checks": {
                "component_count": 0,
                "has_components": False,
                "has_power_source": False,
                "power_source_type": "none",
                "valid_hole_ids": True,
                "no_duplicate_ids": True,
                "no_short_circuit": True,
                "closed_path": False,
                "no_floating_terminals": True,
                "no_uncertain_mappings": True
            },
            "component_connectivity": [],
            "solver_status": "NOT_RUN",
            "solver_reason": "No components detected"
        }

    # 2. Terminal Hole ID and Uncertainty Validation
    valid_hole_ids = True
    uncertain_mappings: List[str] = []
    component_connectivity: List[Dict[str, Any]] = []

    # Map of net_id -> count of connected pins
    net_pin_counts: Dict[str, int] = {}
    for n in nets:
        nid = n.get("net_id") or n.get("id") or ""
        net_pin_counts[nid] = len(n.get("pins") or n.get("connected_pins") or [])

    # Account for power source connections in net_pin_counts
    for ps in power_sources:
        p_pos = ps.get("node_pos") or ps.get("positive_node") or ps.get("positiveNode")
        p_neg = ps.get("node_neg") or ps.get("negative_node") or ps.get("negativeNode")
        if p_pos:
            net_pin_counts[p_pos] = net_pin_counts.get(p_pos, 0) + 1
        if p_neg:
            net_pin_counts[p_neg] = net_pin_counts.get(p_neg, 0) + 1

    floating_terminals: List[str] = []

    for c in components:
        des = str(c.get("designator") or c.get("id") or "COMP")
        h1 = str(c.get("start_hole") or c.get("hole1") or "")
        h2 = str(c.get("end_hole") or c.get("hole2") or "")
        n1 = str(c.get("node1") or "")
        n2 = str(c.get("node2") or "")

        # Validate holes
        h1_valid = is_valid_hole_id(h1)
        h2_valid = is_valid_hole_id(h2)

        if not h1_valid:
            valid_hole_ids = False
            errors.append(f"Invalid terminal 1 hole ID '{h1}' on component {des}")
        if not h2_valid:
            valid_hole_ids = False
            errors.append(f"Invalid terminal 2 hole ID '{h2}' on component {des}")

        # Check uncertainty
        if c.get("uncertain_mapping") or float(c.get("mapping_confidence", 1.0)) < 0.50:
            uncertain_mappings.append(des)
            warnings.append(f"Uncertain lead mapping on component {des} (confidence: {c.get('mapping_confidence', 0.0)})")

        if h1_valid and h2_valid and h1 == h2 and c.get("type") not in ["ic_chip"]:
            warnings.append(f"Component {des} terminals mapped to the exact same hole '{h1}'")

        # Check terminal connectivity: connected is true when terminal has a valid hole and net mapping
        p1_connected = bool(h1_valid and h1 and n1)
        p2_connected = bool(h2_valid and h2 and n2)

        # Check floating terminals (a terminal is floating if net has no other pin or power source)
        p1_floating = net_pin_counts.get(n1, 0) <= 1
        p2_floating = net_pin_counts.get(n2, 0) <= 1

        if p1_floating:
            floating_terminals.append(f"{des}.1")
            warnings.append(f"Floating terminal {des}.1 at hole {h1} (net {n1} has no other connections)")
        if p2_floating:
            floating_terminals.append(f"{des}.2")
            warnings.append(f"Floating terminal {des}.2 at hole {h2} (net {n2} has no other connections)")

        component_connectivity.append({
            "designator": des,
            "type": c.get("type", "resistor"),
            "pin1": {
                "hole": h1,
                "net": n1,
                "connected": p1_connected
            },
            "pin2": {
                "hole": h2,
                "net": n2,
                "connected": p2_connected
            },
            "complete": bool(h1_valid and h2_valid and h1 != h2 and p1_connected and p2_connected)
        })

    # 3. Power Source Validation
    ps_source_type = power_status.get("source", "none")
    has_power_source = len(power_sources) > 0 and ps_source_type != "none"

    pos_node: Optional[str] = None
    neg_node: Optional[str] = None

    if has_power_source:
        first_ps = power_sources[0]
        pos_node = first_ps.get("node_pos") or first_ps.get("positive_node") or first_ps.get("positiveNode")
        neg_node = first_ps.get("node_neg") or first_ps.get("negative_node") or first_ps.get("negativeNode")

    # 4. Short Circuit and Closed Path Graph Checks
    no_short_circuit = True
    closed_path = False

    # Check 4a: Check if any wire or jumper bridges positive and negative power rails directly
    for c in components:
        ctype = (c.get("type") or c.get("class") or "").lower()
        if ctype in ["wire", "jumper"]:
            h1 = str(c.get("start_hole") or c.get("hole1") or "").upper()
            h2 = str(c.get("end_hole") or c.get("hole2") or "").upper()
            is_vcc_1 = "VCC" in h1 or "POWER" in h1
            is_gnd_2 = "GND" in h2 or "GROUND" in h2
            is_vcc_2 = "VCC" in h2 or "POWER" in h2
            is_gnd_1 = "GND" in h1 or "GROUND" in h1
            if (is_vcc_1 and is_gnd_2) or (is_vcc_2 and is_gnd_1):
                no_short_circuit = False
                errors.append("Possible direct short between power and ground (wire directly bridges V+ and GND rails).")
                break

    for w in netlist.get("wires", []):
        h1 = str(w.get("start_hole", "")).upper()
        h2 = str(w.get("end_hole", "")).upper()
        r1 = str(w.get("raw_node1", "")).upper()
        r2 = str(w.get("raw_node2", "")).upper()
        is_vcc = "VCC" in h1 or "VCC" in r1 or "POWER" in r1
        is_gnd = "GND" in h2 or "GND" in r2 or "GROUND" in r2
        is_vcc_rev = "VCC" in h2 or "VCC" in r2 or "POWER" in r2
        is_gnd_rev = "GND" in h1 or "GND" in r1 or "GROUND" in r1
        if (is_vcc and is_gnd) or (is_vcc_rev and is_gnd_rev):
            no_short_circuit = False
            if "Possible direct short between power and ground" not in "".join(errors):
                errors.append("Possible direct short between power and ground (wire directly bridges V+ and GND rails).")
            break

    # Check 4b: Check if positive and negative power rails were merged into the same net
    for n in nets:
        holes = n.get("holes") or []
        has_vcc_hole = any("VCC" in str(h).upper() for h in holes)
        has_gnd_hole = any("GND" in str(h).upper() for h in holes)
        if has_vcc_hole and has_gnd_hole:
            no_short_circuit = False
            if "Possible direct short between power and ground" not in "".join(errors):
                errors.append("Possible direct short between power and ground (V+ and GND rails merged into same net).")
            break

    if has_power_source and pos_node and neg_node:
        # Check direct identical node short
        if pos_node == neg_node:
            no_short_circuit = False
            if "Possible direct short between power and ground" not in "".join(errors):
                errors.append("Possible direct short between power and ground (source positive and negative on same node).")
        else:
            # Graph with only wires/jumpers (zero impedance)
            wire_adj: Dict[str, List[str]] = {}
            # Full graph with all components
            all_adj: Dict[str, List[str]] = {}

            for c in components:
                n1 = c.get("node1")
                n2 = c.get("node2")
                ctype = (c.get("type") or "").lower()

                if not n1 or not n2 or n1 == n2:
                    continue

                # Add to full graph
                all_adj.setdefault(n1, []).append(n2)
                all_adj.setdefault(n2, []).append(n1)

                # Add to wire-only graph
                if ctype in ["wire", "jumper"]:
                    wire_adj.setdefault(n1, []).append(n2)
                    wire_adj.setdefault(n2, []).append(n1)

            # Check for direct wire short between pos_node and neg_node
            visited_wires: Set[str] = set([pos_node])
            q_wires = deque([pos_node])
            while q_wires:
                curr = q_wires.popleft()
                if curr == neg_node:
                    no_short_circuit = False
                    if "Possible direct short between power and ground" not in "".join(errors):
                        errors.append("Possible direct short between power and ground (zero-impedance wire path).")
                    break
                for nxt in wire_adj.get(curr, []):
                    if nxt not in visited_wires:
                        visited_wires.add(nxt)
                        q_wires.append(nxt)

            # Check closed path traversing any valid component
            visited_all: Set[str] = set([pos_node])
            q_all = deque([pos_node])
            while q_all:
                curr = q_all.popleft()
                if curr == neg_node:
                    closed_path = True
                    break
                for nxt in all_adj.get(curr, []):
                    if nxt not in visited_all:
                        visited_all.add(nxt)
                        q_all.append(nxt)

    # Check missing ground / reference node
    missing_ground = False
    if has_power_source and not neg_node:
        missing_ground = True
        warnings.append("Missing ground or negative reference node for power source.")

    # Check floating components (components where both terminals are floating or isolated)
    floating_components: List[str] = []
    for c_conn in component_connectivity:
        des = c_conn["designator"]
        h1 = c_conn["pin1"]["hole"]
        h2 = c_conn["pin2"]["hole"]
        n1 = c_conn["pin1"]["net"]
        n2 = c_conn["pin2"]["net"]
        if (net_pin_counts.get(n1, 0) <= 1) and (net_pin_counts.get(n2, 0) <= 1):
            floating_components.append(des)
            warnings.append(f"Component {des} is completely floating (neither terminal connects to other circuit nodes).")

    # Check disconnected subcircuits
    # Build an undirected graph between nets connected by components
    net_adj: Dict[str, Set[str]] = {}
    for c in components:
        n1 = c.get("node1")
        n2 = c.get("node2")
        if n1 and n2:
            net_adj.setdefault(n1, set()).add(n2)
            net_adj.setdefault(n2, set()).add(n1)

    visited_nets: Set[str] = set()
    subcircuit_count = 0
    for n in net_adj.keys():
        if n not in visited_nets:
            subcircuit_count += 1
            q = deque([n])
            visited_nets.add(n)
            while q:
                curr = q.popleft()
                for neighbor in net_adj.get(curr, set()):
                    if neighbor not in visited_nets:
                        visited_nets.add(neighbor)
                        q.append(neighbor)

    single_subcircuit = (subcircuit_count <= 1)
    if subcircuit_count > 1:
        warnings.append(f"Detected {subcircuit_count} disconnected subcircuits on the breadboard.")

    # 5. Determine Overall Status
    # Priority: INVALID > INCOMPLETE > WARNING > VALID
    status = "VALID"
    valid = True

    if not valid_hole_ids or not no_duplicate_ids or not no_short_circuit:
        status = "INVALID"
        valid = False
    elif not has_power_source:
        status = "INCOMPLETE"
        valid = False
    elif not closed_path:
        status = "INCOMPLETE"
        valid = False
    elif len(uncertain_mappings) > 0 or len(floating_terminals) > 0 or len(warnings) > 0:
        status = "WARNING"
        valid = True
    else:
        status = "VALID"
        valid = True

    # 6. Determine Solver Status
    if status == "VALID":
        solver_status = "READY"
        solver_reason = "Circuit topology is fully connected and ready for MNA simulation"
    elif status == "WARNING" and has_power_source and closed_path and no_short_circuit:
        solver_status = "READY"
        solver_reason = "Circuit has closed path but engineering warnings present"
    elif not has_power_source:
        solver_status = "NOT_RUN"
        solver_reason = "Circuit topology incomplete: No power source detected or provided"
    elif not closed_path:
        solver_status = "NOT_RUN"
        solver_reason = "Circuit topology incomplete: Open circuit path"
    else:
        solver_status = "NOT_RUN"
        solver_reason = f"Circuit validation failed with status {status}"

    # 7. Map to standardized NETLIST_VALID / NETLIST_WARNING / NETLIST_INVALID
    if status == "VALID":
        netlist_status = "NETLIST_VALID"
    elif status == "WARNING":
        netlist_status = "NETLIST_WARNING"
    else:
        netlist_status = "NETLIST_INVALID"

    return {
        "valid": valid,
        "status": status,
        "netlist_status": netlist_status,
        "errors": errors,
        "warnings": warnings,
        "checks": {
            "component_count": component_count,
            "terminal_count": component_count * 2,
            "has_components": has_components,
            "has_power_source": has_power_source,
            "missing_power_source": not has_power_source,
            "missing_ground_reference": missing_ground,
            "power_source_type": ps_source_type,
            "valid_hole_ids": valid_hole_ids,
            "no_duplicate_ids": no_duplicate_ids,
            "no_short_circuit": no_short_circuit,
            "closed_path": closed_path,
            "open_circuit": not closed_path if has_power_source else True,
            "no_floating_terminals": len(floating_terminals) == 0,
            "no_floating_components": len(floating_components) == 0,
            "single_subcircuit": single_subcircuit,
            "no_uncertain_mappings": len(uncertain_mappings) == 0
        },
        "component_connectivity": component_connectivity,
        "solver_status": solver_status,
        "solver_reason": solver_reason
    }
