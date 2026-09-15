"""
SmartBreadboard 3D — Netlist Parser Engine
Parses raw frontend/detection netlist inputs into normalized Component, Node, and PowerSource models.
"""

from typing import Dict, Any, List, Tuple
from cv.value_parser import parse_component_value, format_si_value
from .component_models import Component, Node

def parse_circuit_netlist(netlist: Dict[str, Any]) -> Tuple[List[Component], List[Dict[str, Any]], Dict[str, Node]]:
    """
    Parses input JSON netlist into lists of (components, power_sources, nodes_dict).
    """
    raw_components = netlist.get("components", [])
    raw_sources = netlist.get("power_sources", netlist.get("sources", []))
    raw_nodes = netlist.get("nodes", [])

    # If no sources specified in netlist, check default power supply
    if raw_sources is None and "power_supply" in netlist:
        ps = netlist["power_supply"]
        raw_sources = [{
            "id": "V1",
            "type": "voltage_source",
            "positive_node": ps.get("positive_node", "NODE_PWR"),
            "negative_node": ps.get("negative_node", "NODE_GND"),
            "voltage": float(ps.get("voltage", 5.0))
        }]
    elif raw_sources is None:
        raw_sources = [{
            "id": "V1",
            "type": "voltage_source",
            "positive_node": "NODE_PWR",
            "negative_node": "NODE_GND",
            "voltage": 5.0
        }]

    nodes_dict: Dict[str, Node] = {}
    for n in raw_nodes:
        nid = str(n.get("id", ""))
        lbl = str(n.get("label", nid))
        is_gnd = "GND" in nid.upper() or "GROUND" in nid.upper()
        is_pwr = "PWR" in nid.upper() or "VCC" in nid.upper()
        nodes_dict[nid] = Node(id=nid, label=lbl, is_ground=is_gnd, is_power=is_pwr)

    # Ensure NODE_GND and NODE_PWR exist
    if "NODE_GND" not in nodes_dict:
        nodes_dict["NODE_GND"] = Node(id="NODE_GND", label="Ground (0V)", is_ground=True)
    if "NODE_PWR" not in nodes_dict:
        nodes_dict["NODE_PWR"] = Node(id="NODE_PWR", label="VCC (+5V)", is_power=True)

    parsed_components: List[Component] = []

    for idx, rc in enumerate(raw_components):
        cid = rc.get("designator") or rc.get("id") or f"C{idx+1}"
        ctype = str(rc.get("type", rc.get("class", "resistor"))).lower()

        # Extract node connections
        n1 = str(rc.get("node1") or rc.get("hole1") or rc.get("node1_hole") or rc.get("start_hole") or "NODE_PWR")
        n2 = str(rc.get("node2") or rc.get("hole2") or rc.get("node2_hole") or rc.get("end_hole") or "NODE_GND")

        # Value parsing
        user_val = rc.get("user_override_value")
        det_val = rc.get("detected_value") or rc.get("value")
        val_src = rc.get("valueSource", "detected")

        val_to_parse = user_val if user_val is not None else det_val

        numeric_val = None
        unit = "Ω"
        raw_str = str(val_to_parse) if val_to_parse is not None else None

        if isinstance(val_to_parse, (int, float)):
            numeric_val = float(val_to_parse)
            unit = "Ω" if "resistor" in ctype else ("F" if "cap" in ctype else ("H" if "ind" in ctype else "unit"))
        elif isinstance(val_to_parse, str):
            num_v, u_str, src_status = parse_component_value(val_to_parse, ctype)
            if num_v is not None:
                numeric_val = num_v
                unit = u_str
            else:
                val_src = "user_required"

        if numeric_val is None or "wire" in ctype or "jumper" in ctype:
            # Assign defaults if required, but flag value_source
            if "wire" in ctype or "jumper" in ctype:
                numeric_val = 0.001
                unit = "Ω"
                val_src = "detected"
            elif "resistor" in ctype:
                numeric_val = 1000.0
                unit = "Ω"
                if val_src != "user_override":
                    val_src = "detected"
            elif "capacitor" in ctype:
                numeric_val = 100e-6
                unit = "F"
                if val_src != "user_override":
                    val_src = "detected"
            elif "inductor" in ctype:
                numeric_val = 10e-3
                unit = "H"
                if val_src != "user_override":
                    val_src = "detected"
            elif "led" in ctype:
                numeric_val = 2.0  # 2V forward drop
                unit = "V"
                if val_src != "user_override":
                    val_src = "detected"
            else:
                numeric_val = 0.0
                unit = "unit"
                if val_src != "user_override":
                    val_src = "user_required"

        comp = Component(
            id=cid,
            type=ctype,
            node1=n1,
            node2=n2,
            value=numeric_val,
            unit=unit,
            raw_value=raw_str,
            value_source=val_src,
            properties=rc.get("properties", {}),
            holes=[n1, n2]
        )
        parsed_components.append(comp)

        # Register nodes if not existing
        if n1 not in nodes_dict:
            nodes_dict[n1] = Node(id=n1, label=f"Node {n1}")
        if n2 not in nodes_dict:
            nodes_dict[n2] = Node(id=n2, label=f"Node {n2}")

    return parsed_components, raw_sources, nodes_dict
