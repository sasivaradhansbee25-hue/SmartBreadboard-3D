"""
SmartBreadboard 3D — Breadboard Wire Connectivity Engine (Phase 12 Electrical Reconstruction)
Calculates real electrical connectivity based strictly on breadboard internal tie-point rows,
jumper wire endpoints, and component terminal hole mappings.
"""

import re
from typing import List, Dict, Any, Tuple, Set, Optional

def get_base_node_for_hole(hole_id: str) -> str:
    """
    Maps a physical breadboard hole ID to its internal tie-point node ID:
    - Main grid cols 1-63: Rows A-E -> NODE_COL_{col}_TOP, Rows F-J -> NODE_COL_{col}_BOT
    - Power rails: VCC_TOP_n -> NODE_POWER_VCC, GND_TOP_n -> NODE_GROUND,
                   VCC_BOT_n -> NODE_POWER_VCC_BOT, GND_BOT_n -> NODE_GROUND_BOT
    """
    if not hole_id or not isinstance(hole_id, str):
        return "NODE_INVALID"

    hole_clean = hole_id.strip()

    if hole_clean.startswith("VCC_TOP"):
        return "NODE_POWER_VCC"
    elif hole_clean.startswith("GND_TOP"):
        return "NODE_GROUND"
    elif hole_clean.startswith("VCC_BOT"):
        return "NODE_POWER_VCC_BOT"
    elif hole_clean.startswith("GND_BOT"):
        return "NODE_GROUND_BOT"

    m = re.match(r"^([A-J])(\d+)$", hole_clean, re.IGNORECASE)
    if m:
        row = m.group(1).upper()
        col = int(m.group(2))
        if 1 <= col <= 63:
            if row in ['A', 'B', 'C', 'D', 'E']:
                return f"NODE_COL_{col}_TOP"
            elif row in ['F', 'G', 'H', 'I', 'J']:
                return f"NODE_COL_{col}_BOT"

    return f"NODE_HOLE_{hole_clean}"

def is_valid_hole_id(hole_id: str) -> bool:
    """Validates whether hole_id follows 830 tie-point breadboard naming conventions."""
    if not hole_id or not isinstance(hole_id, str):
        return False
    h = hole_id.strip()
    if h.startswith("VCC_TOP") or h.startswith("GND_TOP") or h.startswith("VCC_BOT") or h.startswith("GND_BOT"):
        return True
    m = re.match(r"^([A-J])(\d+)$", h, re.IGNORECASE)
    if m:
        col = int(m.group(2))
        return 1 <= col <= 63
    return False

class DisjointSetUnion:
    """Disjoint Set Union (DSU) / Union-Find for merging connected tie-points and wires."""
    def __init__(self):
        self.parent = {}

    def find(self, i: str) -> str:
        if i not in self.parent:
            self.parent[i] = i
            return i
        if self.parent[i] == i:
            return i
        self.parent[i] = self.find(self.parent[i])
        return self.parent[i]

    def union(self, i: str, j: str):
        root_i = self.find(i)
        root_j = self.find(j)
        if root_i != root_j:
            # Power rails take highest priority as canonical DSU root
            is_pwr_i = "POWER_VCC" in root_i
            is_gnd_i = "GROUND" in root_i
            is_pwr_j = "POWER_VCC" in root_j
            is_gnd_j = "GROUND" in root_j

            if (is_pwr_i or is_gnd_i) and not (is_pwr_j or is_gnd_j):
                self.parent[root_j] = root_i
            elif (is_pwr_j or is_gnd_j) and not (is_pwr_i or is_gnd_i):
                self.parent[root_i] = root_j
            else:
                # Deterministic root selection (alphabetical string sort)
                if root_i < root_j:
                    self.parent[root_j] = root_i
                else:
                    self.parent[root_i] = root_j

def build_electrical_connectivity(components: List[Dict[str, Any]], breadboard_holes: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Main connectivity engine function.
    Calculates deterministic electrical netlist topology from component lead holes and jumper wire connections.
    """
    dsu = DisjointSetUnion()
    warnings = []
    pins = []
    wires_info = []

    # Sort components deterministically by designator/id
    sorted_comps = sorted(
        components,
        key=lambda c: str(c.get("designator") or c.get("id") or "")
    )

    # 1. Register all component holes & process jumper wires
    for comp in sorted_comps:
        des = str(comp.get("designator") or comp.get("id") or "COMP")
        c_type = (comp.get("type") or comp.get("class") or "resistor").lower()

        h1 = comp.get("start_hole") or comp.get("hole1") or "A1"
        h2 = comp.get("end_hole") or comp.get("hole2") or "A2"

        # Validate holes
        if not is_valid_hole_id(h1):
            warnings.append(f"{des}: Invalid terminal 1 hole ID '{h1}'")
        if not is_valid_hole_id(h2):
            warnings.append(f"{des}: Invalid terminal 2 hole ID '{h2}'")

        if h1 == h2 and "ic" not in c_type:
            warnings.append(f"{des}: Terminals 1 and 2 accidentally mapped to the same hole '{h1}'")

        if comp.get("uncertain_mapping") or comp.get("mapping_confidence", 1.0) < 0.50:
            warnings.append(f"{des}: Mapped with low confidence or uncertain boundary location")

        raw_node1 = get_base_node_for_hole(h1)
        raw_node2 = get_base_node_for_hole(h2)

        # Register in DSU
        dsu.find(raw_node1)
        dsu.find(raw_node2)

        # If component is a jumper wire, merge endpoints in DSU
        if c_type in ["wire", "jumper"]:
            dsu.union(raw_node1, raw_node2)
            wires_info.append({
                "id": des,
                "start_hole": h1,
                "end_hole": h2,
                "raw_node1": raw_node1,
                "raw_node2": raw_node2
            })

    # 2. Assign deterministic Net IDs to DSU roots
    all_roots = sorted(list(set(dsu.find(node) for node in dsu.parent.keys())))

    # Group member nodes by their resolved root
    root_members: Dict[str, Set[str]] = {}
    for node in dsu.parent.keys():
        r = dsu.find(node)
        root_members.setdefault(r, set()).add(node)

    root_to_net_id = {}
    net_counter = 1

    for root in all_roots:
        members = root_members.get(root, {root})
        if any("POWER_VCC" in m for m in members):
            root_to_net_id[root] = "NET_VCC (+5V)"
        elif any("GROUND" in m for m in members):
            root_to_net_id[root] = "NET_GND (0V)"
        else:
            root_to_net_id[root] = f"NET{net_counter}"
            net_counter += 1

    # 3. Build pins list and associate each component terminal with its resolved Net ID
    nets_dict = {}

    for root, net_id in root_to_net_id.items():
        is_gnd = "GND" in net_id
        is_pwr = "VCC" in net_id
        nets_dict[net_id] = {
            "net_id": net_id,
            "name": net_id,
            "label": "Supply (+5V)" if is_pwr else ("Ground (0V)" if is_gnd else f"Net {net_id}"),
            "holes": set(),
            "pins": [],
            "connected_pins": [],
            "is_supply": is_pwr,
            "is_ground": is_gnd
        }

    for comp in sorted_comps:
        des = str(comp.get("designator") or comp.get("id") or "COMP")
        c_type = (comp.get("type") or comp.get("class") or "resistor").lower()

        h1 = comp.get("start_hole") or comp.get("hole1") or "A1"
        h2 = comp.get("end_hole") or comp.get("hole2") or "A2"

        r1 = get_base_node_for_hole(h1)
        r2 = get_base_node_for_hole(h2)

        net1 = root_to_net_id[dsu.find(r1)]
        net2 = root_to_net_id[dsu.find(r2)]

        comp["node1"] = net1
        comp["node2"] = net2

        # Pin objects
        pin1_obj = {
            "component": des,
            "pin": 1,
            "hole": h1,
            "net": net1
        }
        pin2_obj = {
            "component": des,
            "pin": 2,
            "hole": h2,
            "net": net2
        }

        pins.append(pin1_obj)
        pins.append(pin2_obj)

        nets_dict[net1]["pins"].append(f"{des}.1")
        nets_dict[net1]["connected_pins"].append(f"{des}.1")
        nets_dict[net1]["holes"].add(h1)

        nets_dict[net2]["pins"].append(f"{des}.2")
        nets_dict[net2]["connected_pins"].append(f"{des}.2")
        nets_dict[net2]["holes"].add(h2)

    # 4. Attach Net ID to wire path info
    for w in wires_info:
        w["net"] = root_to_net_id[dsu.find(w["raw_node1"])]
        del w["raw_node1"]
        del w["raw_node2"]

    # 5. Build final deterministic nets list & check connection warnings
    nets_list = []
    connections_list = []

    for net_id in sorted(nets_dict.keys()):
        net_info = nets_dict[net_id]
        sorted_holes = sorted(list(net_info["holes"]))
        sorted_pins = sorted(net_info["connected_pins"])

        # Check for isolated / single-pin / floating nets
        if len(sorted_pins) <= 1:
            warnings.append(f"{net_id}: Single-pin / floating node with connected pins: {sorted_pins}")

        net_obj = {
            "net_id": net_id,
            "name": net_id,
            "label": net_info["label"],
            "holes": sorted_holes,
            "pins": sorted_pins,
            "connected_pins": sorted_pins,
            "is_supply": net_info["is_supply"],
            "is_ground": net_info["is_ground"]
        }
        nets_list.append(net_obj)
        connections_list.append({
            "net_id": net_id,
            "pins": sorted_pins,
            "holes": sorted_holes
        })

    # Nodes schema list for Circuit Data Model
    nodes_list = [
        {
            "id": n["net_id"],
            "label": n["label"],
            "is_supply": n["is_supply"],
            "is_ground": n["is_ground"]
        }
        for n in nets_list
    ]

    return {
        "nodes": nodes_list,
        "connections": connections_list,
        "nets": nets_list,
        "pins": pins,
        "wires": wires_info,
        "warnings": warnings,
        "components": sorted_comps
    }
