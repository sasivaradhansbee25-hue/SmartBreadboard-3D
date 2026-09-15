"""
SmartBreadboard 3D — Circuit Validation Engine
Checks circuit netlist for engineering errors: missing ground, floating nodes, short circuits, zero/negative resistance, missing source.
"""

from typing import List, Dict, Any, Tuple, Optional

def validate_circuit_netlist(components: List[Dict[str, Any]], power_sources: List[Dict[str, Any]]) -> Tuple[bool, Optional[Dict[str, Any]], List[str]]:
    """
    Validates components and sources.
    Returns (is_valid, error_dict_or_none, list_of_warnings)
    """
    warnings = []

    if not components:
        return False, {
            "code": "EMPTY_CIRCUIT",
            "message": "Circuit contains no detected or defined components."
        }, warnings

    if not power_sources:
        return False, {
            "code": "POWER_SOURCE_REQUIRED",
            "message": "No active power source was detected in this photograph. Please add a simulated source for analysis."
        }, warnings

    # Validate each power source
    for ps in power_sources:
        v_val = float(ps.get("voltage", ps.get("value", 0.0)))
        pos_n = str(ps.get("positive_node", ps.get("positiveNode", ps.get("node1", ""))))
        neg_n = str(ps.get("negative_node", ps.get("negativeNode", ps.get("node2", ""))))

        if v_val <= 0:
            return False, {
                "code": "INVALID_SOURCE_VOLTAGE",
                "message": f"Simulated voltage source must be greater than 0V (got {v_val}V)."
            }, warnings

        if not pos_n or not neg_n:
            return False, {
                "code": "INVALID_SOURCE_CONNECTION",
                "message": "Source terminals must be connected to valid circuit nodes."
            }, warnings

        if pos_n.upper() == neg_n.upper():
            return False, {
                "code": "SAME_NODE_SOURCE",
                "message": "The selected positive and negative terminals resolve to the same electrical node."
            }, warnings

    has_ground = False
    all_nodes = set()
    node_connections = {}

    for c in components:
        n1 = str(c.get("node1", c.get("hole1", "")))
        n2 = str(c.get("node2", c.get("hole2", "")))

        if not n1 or not n2:
            return False, {
                "code": "DISCONNECTED_COMPONENT",
                "message": f"Component '{c.get('id', 'unknown')}' is missing valid terminal/node connections."
            }, warnings

        all_nodes.add(n1)
        all_nodes.add(n2)

        node_connections[n1] = node_connections.get(n1, 0) + 1
        node_connections[n2] = node_connections.get(n2, 0) + 1

        if "GND" in n1.upper() or "GND" in n2.upper() or "GROUND" in n1.upper() or "GROUND" in n2.upper():
            has_ground = True

    for ps in power_sources:
        n1 = str(ps.get("positive_node", ps.get("positiveNode", ps.get("node1", ""))))
        n2 = str(ps.get("negative_node", ps.get("negativeNode", ps.get("node2", ""))))
        if n1:
            all_nodes.add(n1)
        if n2:
            all_nodes.add(n2)
        if "GND" in n1.upper() or "GND" in n2.upper() or "GROUND" in n1.upper() or "GROUND" in n2.upper():
            has_ground = True

    if not has_ground:
        if power_sources:
            warnings.append("No explicit GND label found; using power source negative terminal as reference node.")
        else:
            return False, {
                "code": "MISSING_GROUND",
                "message": "Circuit has no ground (0V) reference node. Please designate a ground node or connect a power source."
            }, warnings

    # Check for floating nodes
    for node, count in node_connections.items():
        if count == 1 and not ("GND" in node.upper() or "PWR" in node.upper() or "VCC" in node.upper()):
            warnings.append(f"Node '{node}' is floating (connected to only 1 terminal).")

    # Check for invalid component values
    for c in components:
        comp_type = str(c.get("type", "")).lower()
        cid = c.get("designator", c.get("id", "R"))
        val = c.get("value") if c.get("value") is not None else (c.get("detected_value") or c.get("user_override_value"))
        needs_conf = c.get("needsConfirmation", False)
        v_source = c.get("valueSource", "")

        if val is None or v_source in ["user_required", "uncertain"] or needs_conf:
            return False, {
                "code": "VALUE_CONFIRMATION_REQUIRED",
                "message": f"Component '{cid}' requires value confirmation before simulation."
            }, warnings

        if isinstance(val, (int, float)):
            if val <= 0 and comp_type in ["resistor", "capacitor", "inductor"]:
                return False, {
                    "code": "INVALID_VALUE",
                    "message": f"Component '{cid}' has invalid non-positive value ({val})."
                }, warnings

    return True, None, warnings

