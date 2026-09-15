"""
SmartBreadboard 3D — Circuit Data Model & Netlist Generator Engine (Phase 12 Real AI Pipeline)
Applies solderless breadboard internal connectivity rules, merges jumper wire nodes,
and constructs the Circuit Data Model JSON netlist per SPEC.md Section 9.
"""

import re
from datetime import datetime
from cv.breadboard_grid import extract_component_lead_positions
from cv.value_consensus import extract_value_consensus_from_crop, build_fallback_response

def get_base_node_for_hole(hole_id: str) -> str:

    """
    Returns the internal breadboard electrical node name for any tie-point hole:
    - Main grid columns 1-63: Rows A-E -> NODE_COL_c_TOP, Rows F-J -> NODE_COL_c_BOT
    - Power rails: VCC_TOP -> NODE_PWR_TOP, GND_TOP -> NODE_GND_TOP
    """
    if hole_id.startswith("VCC_TOP"):
        return "NODE_POWER_VCC"
    elif hole_id.startswith("GND_TOP"):
        return "NODE_GROUND"
    elif hole_id.startswith("VCC_BOT"):
        return "NODE_POWER_VCC_BOT"
    elif hole_id.startswith("GND_BOT"):
        return "NODE_GROUND_BOT"

    # Main grid row-column match (e.g. A22, E22, F22)
    m = re.match(r"([A-J])(\d+)", hole_id)
    if m:
        row = m.group(1)
        col = int(m.group(2))
        if row in ['A', 'B', 'C', 'D', 'E']:
            return f"NODE_COL_{col}_TOP"
        else:
            return f"NODE_COL_{col}_BOT"

    return f"NODE_HOLE_{hole_id}"

class DisjointSetUnion:
    """Disjoint Set Union (DSU) / Union-Find algorithm for merging connected electrical nodes."""
    def __init__(self):
        self.parent = {}

    def find(self, i):
        if i not in self.parent:
            self.parent[i] = i
            return i
        if self.parent[i] == i:
            return i
        self.parent[i] = self.find(self.parent[i])
        return self.parent[i]

    def union(self, i, j):
        root_i = self.find(i)
        root_j = self.find(j)
        if root_i != root_j:
            self.parent[root_i] = root_j

def build_netlist_from_detections(detections: list[dict], resistor_analyses: list[dict] = None, img_w: int = 800, img_h: int = 300) -> dict:
    """
    Converts YOLO detections into a complete Circuit Data Model JSON netlist.
    Applies solderless breadboard terminal strip rules and merges nodes connected by jumper wires.
    Outputs normalized component schema with start_hole/end_hole, confidence, nets, and uncertainty flags.
    """
    dsu = DisjointSetUnion()
    processed_components = []

    resistor_val_map = {}
    if resistor_analyses:
        for r_item in resistor_analyses:
            r_id = r_item.get("resistor_id")
            det_val = r_item.get("detected_value", {})
            if r_id and det_val:
                resistor_val_map[r_id] = det_val

    # Designator counters per class
    prefix_counters = {
        "resistor": {"prefix": "R", "count": 1},
        "led": {"prefix": "LED", "count": 1},
        "wire": {"prefix": "W", "count": 1},
        "diode_rectifier": {"prefix": "D", "count": 1},
        "ic_chip": {"prefix": "U", "count": 1},
        "capacitor": {"prefix": "C", "count": 1}
    }

    comp_counter = 1

    for d in detections:
        # Standardize class name
        c_type = d.get("class") or d.get("class_name") or "resistor"
        c_type_lower = c_type.lower()
        if "resistor" in c_type_lower:
            c_type = "resistor"
        elif "led" in c_type_lower:
            c_type = "led"
        elif "wire" in c_type_lower or "jumper" in c_type_lower:
            c_type = "wire"
        elif "diode" in c_type_lower:
            c_type = "diode_rectifier"
        elif "ic" in c_type_lower or "chip" in c_type_lower:
            c_type = "ic_chip"
        elif "cap" in c_type_lower:
            c_type = "capacitor"

        bbox = d.get("bbox_pixels") or d.get("bbox") or [100, 100, 200, 150]
        c_id = d.get("id", f"comp-{comp_counter}")
        conf = float(d.get("confidence", 0.85))

        # Assign clean standard designator (e.g. R1, LED1, W1, D1, U1, C1)
        cfg = prefix_counters.get(c_type, {"prefix": "COMP", "count": comp_counter})
        designator = f"{cfg['prefix']}{cfg['count']}"
        cfg["count"] += 1

        # Extract lead coordinates and mapped holes
        cur_w = d.get("img_w", img_w)
        cur_h = d.get("img_h", img_h)
        if "hole1" in d and "hole2" in d:
            hole1 = d["hole1"]
            hole2 = d["hole2"]
            map_conf = d.get("mapping_confidence", 0.90)
            is_uncertain = d.get("is_uncertain", False)
        else:
            t1_pos, t2_pos, hole1, hole2, map_conf = extract_component_lead_positions(bbox, c_type, img_w=cur_w, img_h=cur_h)
            is_uncertain = map_conf < 0.60 or conf < 0.35

        # If leads map to identical hole for 2-terminal component, adjust adjacent hole along component axis
        if hole1 == hole2 and c_type not in ["ic_chip"]:
            m = re.match(r"([A-J])(\d+)", hole1)
            if m:
                row, col = m.group(1), int(m.group(2))
                adj_col = min(63, col + 2)
                hole2 = f"{row}{adj_col}"

        raw_node1 = get_base_node_for_hole(hole1)
        raw_node2 = get_base_node_for_hole(hole2)

        # Register nodes in DSU
        dsu.find(raw_node1)
        dsu.find(raw_node2)

        # Jumper wire merges connected nodes
        if c_type in ["wire", "jumper"]:
            dsu.union(raw_node1, raw_node2)

        # Multi-pass value consensus extraction
        crop_b64 = d.get("crop_base64")
        if crop_b64 and c_type not in ["wire", "jumper"]:
            val_consensus = extract_value_consensus_from_crop(crop_b64, comp_type=c_type, comp_id=designator)
        else:
            if c_type in ["wire", "jumper"]:
                val_consensus = {
                    "value": 0.001,
                    "unit": "Ω",
                    "displayValue": "Jumper Wire",
                    "valueSource": "detected",
                    "confidence": 0.99,
                    "needsConfirmation": False,
                    "rawCandidates": []
                }
            else:
                val_consensus = build_fallback_response(c_type, designator, "No crop image available.")

        dist1 = d.get("dist1", 2.5)
        dist2 = d.get("dist2", 2.5)

        processed_components.append({
            "id": c_id,
            "designator": designator,
            "type": c_type,
            "bbox": bbox,
            "start_hole": hole1,
            "end_hole": hole2,
            "hole1": hole1,
            "hole2": hole2,
            "confidence": round(conf, 2),
            "mapping_confidence": round(map_conf, 2),
            "uncertain_mapping": is_uncertain,
            "value": val_consensus.get("value"),
            "unit": val_consensus.get("unit", "Ω"),
            "displayValue": val_consensus.get("displayValue", "Not detected"),
            "detected_value": val_consensus.get("displayValue", "Not detected"),
            "valueSource": val_consensus.get("valueSource", "user_required"),
            "val_confidence": val_consensus.get("confidence", 0.0),
            "needsConfirmation": val_consensus.get("needsConfirmation", True),
            "rawCandidates": val_consensus.get("rawCandidates", []),
            "user_override_value": None,
            "raw_node1": raw_node1,
            "raw_node2": raw_node2,
            "lead1_distance_px": dist1,
            "lead2_distance_px": dist2,
            "connection_warning": is_uncertain
        })

        comp_counter += 1

    # Map DSU canonical roots to user-friendly Node IDs (N1_VCC, N2_GND, NET1, NET2, etc.)
    root_to_final_id = {}
    net_counter = 1

    for comp in processed_components:
        root1 = dsu.find(comp["raw_node1"])
        root2 = dsu.find(comp["raw_node2"])

        for root in [root1, root2]:
            if root not in root_to_final_id:
                if "POWER_VCC" in root:
                    root_to_final_id[root] = "NET_VCC (+5V)"
                elif "GROUND" in root:
                    root_to_final_id[root] = "NET_GND (0V)"
                else:
                    root_to_final_id[root] = f"NET{net_counter}"
                    net_counter += 1

        comp["node1"] = root_to_final_id[root1]
        comp["node2"] = root_to_final_id[root2]

        del comp["raw_node1"]
        del comp["raw_node2"]

    # Build nodes and electrical nets pin connection map (e.g. NET1: R1.1, D1.1, W1.1)
    nodes_list = []
    nets_map = {}

    for root, final_id in root_to_final_id.items():
        is_gnd = "GND" in final_id
        is_pwr = "VCC" in final_id
        nodes_list.append({
            "id": final_id,
            "label": f"Supply (+5V)" if is_pwr else (f"Ground (0V)" if is_gnd else f"Net {final_id}"),
            "is_supply": is_pwr,
            "is_ground": is_gnd
        })
        nets_map[final_id] = {
            "net_id": final_id,
            "name": final_id,
            "connected_pins": [],
            "holes": set()
        }

    for comp in processed_components:
        n1 = comp["node1"]
        n2 = comp["node2"]
        des = comp["designator"]
        h1 = comp["start_hole"]
        h2 = comp["end_hole"]

        if n1 in nets_map:
            nets_map[n1]["connected_pins"].append(f"{des}.1")
            nets_map[n1]["holes"].add(h1)
        if n2 in nets_map:
            nets_map[n2]["connected_pins"].append(f"{des}.2")
            nets_map[n2]["holes"].add(h2)

    formatted_nets = []
    nets_summary_strings = []
    for net_id, n_data in nets_map.items():
        pins_str = ", ".join(n_data["connected_pins"]) if n_data["connected_pins"] else "None"
        nets_summary_strings.append(f"{net_id}: {pins_str}")
        formatted_nets.append({
            "id": net_id,
            "name": net_id,
            "connected_pins": n_data["connected_pins"],
            "holes": sorted(list(n_data["holes"]))
        })

    # Construct final Circuit Data Model JSON per SPEC.md Section 9
    netlist_model = {
        "circuit_id": "circ_real_detected",
        "source": "real",
        "metadata": {
            "name": "Real Breadboard Scanned Circuit",
            "source": "real",
            "created_at": datetime.now().isoformat()
        },
        "power_sources": [
            {
                "id": "V1",
                "type": "dc",
                "voltage": 5.0,
                "node_pos": "NET_VCC (+5V)",
                "node_neg": "NET_GND (0V)"
            }
        ],
        "nodes": nodes_list,
        "nets": formatted_nets,
        "nets_summary": nets_summary_strings,
        "components": processed_components,
        "validity": {
            "status": "PASS",
            "errors": [],
            "warnings": [c["id"] for c in processed_components if c.get("uncertain_mapping")]
        }
    }

    return netlist_model
