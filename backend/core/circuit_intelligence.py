"""
SmartBreadboard 3D — Circuit Intelligence & Topology Reasoning Engine (Phase 19)
Provides deterministic component intelligence, component-specific terminal modeling,
exact breadboard hole mapping with ambiguity detection, graph-based electrical node construction,
series/parallel topology reasoning, topology consistency validation, and verified netlist generation.
"""

import math
import re
import cv2
import numpy as np
from typing import List, Dict, Any, Tuple, Optional, Set

from cv.breadboard_grid import (
    ALL_CANONICAL_HOLES,
    ROW_Y_CANONICAL,
    CANONICAL_W,
    CANONICAL_H,
    get_breadboard_homography,
    find_nearest_canonical_hole,
    estimate_component_orientation
)
from cv.circuit_vision_verifier import get_breadboard_polygon_pixels


# ---------------------------------------------------------------------------
# 1. COMPONENT TERMINAL GEOMETRY MODELS
# ---------------------------------------------------------------------------

def extract_component_terminals_model(
    bbox: List[int],
    comp_type: str,
    orientation_info: Optional[Dict[str, Any]] = None
) -> List[Dict[str, Any]]:
    """
    Extracts physical terminal locations based on component-specific lead geometry.
    Returns structured list of terminal dictionaries.
    """
    if not bbox or len(bbox) < 4:
        return []

    x1, y1, x2, y2 = [float(v) for v in bbox[:4]]
    bw = max(1.0, x2 - x1)
    bh = max(1.0, y2 - y1)
    cx = (x1 + x2) / 2.0
    cy = (y1 + y2) / 2.0

    c_norm = comp_type.lower() if comp_type else "resistor"

    if not orientation_info:
        orientation_info = estimate_component_orientation(bbox, c_norm)

    orient = orientation_info.get("orientation", "horizontal")

    # 1. Resistor, Capacitor, Wire: 2-terminal non-polar components
    if "resistor" in c_norm or "cap" in c_norm or "wire" in c_norm or "jumper" in c_norm:
        lead_offset = 0.06 if "resistor" in c_norm else (0.05 if "wire" in c_norm else 0.08)
        if orient == "horizontal":
            t_a = (x1 + lead_offset * bw, cy)
            t_b = (x2 - lead_offset * bw, cy)
        elif orient == "vertical":
            t_a = (cx, y1 + lead_offset * bh)
            t_b = (cx, y2 - lead_offset * bh)
        else:
            t_a = (x1 + lead_offset * bw, y1 + lead_offset * bh)
            t_b = (x2 - lead_offset * bw, y2 - lead_offset * bh)

        return [
            {
                "name": "terminal_a",
                "pixel": {"x": round(t_a[0], 1), "y": round(t_a[1], 1)},
                "hole": None,
                "distance_px": 0.0,
                "mapping_confidence": 0.0,
                "status": "UNMAPPED"
            },
            {
                "name": "terminal_b",
                "pixel": {"x": round(t_b[0], 1), "y": round(t_b[1], 1)},
                "hole": None,
                "distance_px": 0.0,
                "mapping_confidence": 0.0,
                "status": "UNMAPPED"
            }
        ]

    # 2. LED & Diode: Polar 2-terminal components (Anode & Cathode)
    elif "led" in c_norm or "diode" in c_norm:
        if "led" in c_norm:
            # LED leads protrude downward/along body
            t_anode = (cx - 0.15 * bw, y2 - 0.08 * bh)
            t_cathode = (cx + 0.15 * bw, y2 - 0.08 * bh)
        else: # Rectifier diode along axial body
            if orient == "horizontal":
                t_anode = (x1 + 0.08 * bw, cy)
                t_cathode = (x2 - 0.08 * bw, cy)
            elif orient == "vertical":
                t_anode = (cx, y1 + 0.08 * bh)
                t_cathode = (cx, y2 - 0.08 * bh)
            else:
                t_anode = (x1 + 0.08 * bw, y1 + 0.08 * bh)
                t_cathode = (x2 - 0.08 * bw, y2 - 0.08 * bh)

        return [
            {
                "name": "anode",
                "pixel": {"x": round(t_anode[0], 1), "y": round(t_anode[1], 1)},
                "hole": None,
                "distance_px": 0.0,
                "mapping_confidence": 0.0,
                "status": "UNMAPPED"
            },
            {
                "name": "cathode",
                "pixel": {"x": round(t_cathode[0], 1), "y": round(t_cathode[1], 1)},
                "hole": None,
                "distance_px": 0.0,
                "mapping_confidence": 0.0,
                "status": "UNMAPPED"
            }
        ]

    # 3. Dual Inline Package IC Chip (DIP): Multi-pin
    elif "ic" in c_norm or "chip" in c_norm:
        # Generate DIP-8 representation
        pins = []
        for p_idx in range(1, 5): # Left/Top side 1..4
            px = x1 + 0.10 * bw
            py = y1 + (p_idx - 0.5) * (bh / 4.0)
            pins.append({
                "name": f"pin_{p_idx}",
                "pixel": {"x": round(px, 1), "y": round(py, 1)},
                "hole": None,
                "distance_px": 0.0,
                "mapping_confidence": 0.0,
                "status": "UNMAPPED"
            })
        for p_idx in range(5, 9): # Right/Bottom side 5..8
            px = x2 - 0.10 * bw
            py = y2 - (p_idx - 4.5) * (bh / 4.0)
            pins.append({
                "name": f"pin_{p_idx}",
                "pixel": {"x": round(px, 1), "y": round(py, 1)},
                "hole": None,
                "distance_px": 0.0,
                "mapping_confidence": 0.0,
                "status": "UNMAPPED"
            })
        return pins

    # Default fallback
    t_a = (x1 + 0.08 * bw, cy)
    t_b = (x2 - 0.08 * bw, cy)
    return [
        {"name": "terminal_a", "pixel": {"x": round(t_a[0], 1), "y": round(t_a[1], 1)}, "hole": None, "distance_px": 0.0, "mapping_confidence": 0.0, "status": "UNMAPPED"},
        {"name": "terminal_b", "pixel": {"x": round(t_b[0], 1), "y": round(t_b[1], 1)}, "hole": None, "distance_px": 0.0, "mapping_confidence": 0.0, "status": "UNMAPPED"}
    ]


# ---------------------------------------------------------------------------
# 2. EXACT BREADBOARD HOLE MAPPER & AMBIGUITY CHECK
# ---------------------------------------------------------------------------

def map_terminal_to_exact_hole(
    terminal_pixel: Dict[str, float],
    img_w: int = 1280,
    img_h: int = 850,
    max_distance_mm: float = 22.0,
    ambiguity_delta_mm: float = 2.5
) -> Dict[str, Any]:
    """
    Transforms terminal pixel to canonical breadboard coordinates, calculates candidate hole distances,
    and returns exact hole mapping or flags AMBIGUOUS / UNMAPPED when confidence is uncertain.
    """
    px = float(terminal_pixel.get("x", 0.0))
    py = float(terminal_pixel.get("y", 0.0))

    H_canon_to_img, H_img_to_canon = get_breadboard_homography(img_w, img_h)

    pt_arr = np.array([[[px, py]]], dtype=np.float32)
    t_canon = cv2.perspectiveTransform(pt_arr, H_img_to_canon)[0][0]
    t_cx, t_cy = float(t_canon[0]), float(t_canon[1])

    # Find top 2 nearest holes in canonical coordinate system
    distances: List[Tuple[str, float]] = []
    for hid, (hx, hy) in ALL_CANONICAL_HOLES.items():
        if ("VCC" in hid or "GND" in hid) and (40.0 <= t_cy <= 230.0):
            continue
        d = math.sqrt((t_cx - hx) ** 2 + (t_cy - hy) ** 2)
        distances.append((hid, d))

    distances.sort(key=lambda x: x[1])

    if not distances:
        return {
            "hole_id": None,
            "distance_mm": 999.0,
            "mapping_confidence": 0.0,
            "status": "UNMAPPED",
            "reason": "No candidate holes within canonical grid"
        }

    best_hole, d1 = distances[0]
    second_hole, d2 = distances[1] if len(distances) > 1 else (None, 999.0)

    # Rejection: Terminal is too far from canonical hole
    if d1 > max_distance_mm:
        return {
            "hole_id": None,
            "distance_mm": round(d1, 1),
            "mapping_confidence": 0.0,
            "status": "UNMAPPED",
            "reason": f"Terminal distance ({d1:.1f}mm) exceeds maximum hole tolerance ({max_distance_mm}mm)"
        }

    # Ambiguity check: If two holes are almost equally close, return AMBIGUOUS
    if second_hole and abs(d2 - d1) < ambiguity_delta_mm and d1 > 6.0:
        return {
            "hole_id": best_hole,
            "alternate_hole": second_hole,
            "distance_mm": round(d1, 1),
            "mapping_confidence": 0.45,
            "status": "AMBIGUOUS",
            "reason": f"Ambiguous mapping between {best_hole} ({d1:.1f}mm) and {second_hole} ({d2:.1f}mm)"
        }

    # High confidence exact assignment
    conf = max(0.50, min(1.0, round(1.0 - (d1 / 28.0), 2)))
    return {
        "hole_id": best_hole,
        "distance_mm": round(d1, 1),
        "mapping_confidence": conf,
        "status": "VERIFIED",
        "reason": f"Verified hole mapping ({d1:.1f}mm distance)"
    }


# ---------------------------------------------------------------------------
# 3. COMPONENT INTELLIGENCE BUILDER
# ---------------------------------------------------------------------------

def build_component_intelligence(
    candidate: Dict[str, Any],
    img_w: int = 1280,
    img_h: int = 850
) -> Dict[str, Any]:
    """
    Constructs a rich Component Intelligence representation preserving provenance,
    orientation, center, and verified terminal-to-hole mappings.
    """
    cid = candidate.get("id") or candidate.get("detection_id") or "COMP1"
    c_type = candidate.get("type") or candidate.get("class") or "resistor"
    conf = float(candidate.get("confidence", 0.85))
    bbox = candidate.get("bbox_pixels") or candidate.get("bbox") or [100, 100, 200, 150]
    source = candidate.get("source", "ai")
    verified_state = candidate.get("verification", "VERIFIED")

    x1, y1, x2, y2 = bbox
    cx = round((x1 + x2) / 2.0, 1)
    cy = round((y1 + y2) / 2.0, 1)

    orient_info = estimate_component_orientation(bbox, c_type)
    orientation_deg = orient_info.get("angle_deg", 0.0)

    # Extract terminal model
    raw_terminals = extract_component_terminals_model(bbox, c_type, orient_info)
    mapped_terminals = []
    all_terminals_verified = True
    any_ambiguous = False

    h1_cand = candidate.get("start_hole") or candidate.get("hole1")
    h2_cand = candidate.get("end_hole") or candidate.get("hole2")
    lead_info = candidate.get("lead_info", {})

    for term in raw_terminals:
        # Check if already pre-mapped (e.g. from manual recovery or lead info)
        if h1_cand and term["name"] in ["terminal_a", "anode", "pin_1"]:
            term_rec = {
                "name": term["name"],
                "pixel": term["pixel"],
                "hole": h1_cand,
                "distance_mm": 0.0,
                "mapping_confidence": 1.0,
                "status": "VERIFIED",
                "reason": "Explicit or verified hole assignment"
            }
        elif h2_cand and term["name"] in ["terminal_b", "cathode", "pin_2"]:
            term_rec = {
                "name": term["name"],
                "pixel": term["pixel"],
                "hole": h2_cand,
                "distance_mm": 0.0,
                "mapping_confidence": 1.0,
                "status": "VERIFIED",
                "reason": "Explicit or verified hole assignment"
            }
        else:
            map_res = map_terminal_to_exact_hole(term["pixel"], img_w, img_h)
            h_assigned = map_res.get("hole_id")
            if not h_assigned and lead_info:
                if term["name"] in ["terminal_a", "anode", "pin_1"]:
                    h_assigned = lead_info.get("hole1")
                else:
                    h_assigned = lead_info.get("hole2")

            term_rec = {
                "name": term["name"],
                "pixel": term["pixel"],
                "hole": h_assigned or map_res.get("hole_id"),
                "distance_mm": map_res.get("distance_mm", 0.0),
                "mapping_confidence": map_res.get("mapping_confidence", 0.0) if h_assigned else 0.0,
                "status": "VERIFIED" if h_assigned else map_res.get("status", "UNMAPPED"),
                "reason": map_res.get("reason", "")
            }

        if term_rec["status"] != "VERIFIED":
            all_terminals_verified = False
        if term_rec["status"] == "AMBIGUOUS":
            any_ambiguous = True

        mapped_terminals.append(term_rec)

    # Handle duplicate identical holes for 2-terminal component
    if len(mapped_terminals) == 2 and mapped_terminals[0]["hole"] and mapped_terminals[0]["hole"] == mapped_terminals[1]["hole"] and "ic" not in c_type:
        h1 = mapped_terminals[0]["hole"]
        m = re.match(r"([A-J])(\d+)", h1)
        if m:
            row, col = m.group(1), int(m.group(2))
            adj_col = min(63, col + 2)
            mapped_terminals[1]["hole"] = f"{row}{adj_col}"
            mapped_terminals[1]["reason"] += " (Adjusted to avoid single-point short)"

    overall_status = "VERIFIED" if (verified_state == "VERIFIED" and all_terminals_verified) else ("AMBIGUOUS" if any_ambiguous else ("UNKNOWN" if verified_state == "UNKNOWN" else "REJECTED"))

    return {
        "id": cid,
        "designator": candidate.get("designator", cid),
        "type": c_type,
        "confidence": conf,
        "bbox": [int(v) for v in bbox],
        "center": {"x": cx, "y": cy},
        "orientation": orientation_deg,
        "orientation_info": orient_info,
        "terminals": mapped_terminals,
        "start_hole": mapped_terminals[0]["hole"] if len(mapped_terminals) > 0 else "A1",
        "end_hole": mapped_terminals[1]["hole"] if len(mapped_terminals) > 1 else "A2",
        "source": source,
        "verified": overall_status == "VERIFIED",
        "status": overall_status,
        "value": candidate.get("value"),
        "unit": candidate.get("unit", "Ω"),
        "displayValue": candidate.get("displayValue"),
        "detected_value": candidate.get("detected_value"),
        "user_override_value": candidate.get("user_override_value")
    }


# ---------------------------------------------------------------------------
# 4. ELECTRICAL NODE GRAPH CONSTRUCTOR
# ---------------------------------------------------------------------------

def get_canonical_node_for_hole(hole_id: str) -> str:
    """
    Maps any 830 tie-point breadboard hole to its internal electrical node identifier:
    - Main Columns 1-63: Rows A-E -> NODE_COL_{c}_TOP, Rows F-J -> NODE_COL_{c}_BOT
    - Power Rails: VCC_TOP -> NODE_POWER_VCC, GND_TOP -> NODE_GROUND, VCC_BOT -> NODE_POWER_VCC_BOT, GND_BOT -> NODE_GROUND_BOT
    """
    if not hole_id:
        return "NODE_DISCONNECTED"

    h_upper = str(hole_id).upper()
    if h_upper.startswith("VCC_TOP") or h_upper.startswith("VCC_1") or h_upper == "VCC":
        return "NODE_POWER_VCC"
    elif h_upper.startswith("GND_TOP") or h_upper.startswith("GND_1") or h_upper == "GND":
        return "NODE_GROUND"
    elif h_upper.startswith("VCC_BOT") or h_upper.startswith("VCC_2"):
        return "NODE_POWER_VCC_BOT"
    elif h_upper.startswith("GND_BOT") or h_upper.startswith("GND_2"):
        return "NODE_GROUND_BOT"

    m = re.match(r"([A-J])(\d+)", h_upper)
    if m:
        row = m.group(1)
        col = int(m.group(2))
        if row in ['A', 'B', 'C', 'D', 'E']:
            return f"NODE_COL_{col}_TOP"
        else:
            return f"NODE_COL_{col}_BOT"

    return f"NODE_HOLE_{h_upper}"


class ElectricalNodeGraph:
    """
    Deterministic Graph Representation of Breadboard Circuit.
    Models bipartite connections: Components <--> Electrical Nodes.
    """

    def __init__(self):
        self.node_to_holes: Dict[str, Set[str]] = {}
        self.node_to_pins: Dict[str, List[Dict[str, str]]] = {}
        self.component_terminals: Dict[str, Dict[str, str]] = {}
        self.jumper_merges: List[Tuple[str, str]] = []
        self.dsu_parent: Dict[str, str] = {}

    def _find(self, i: str) -> str:
        if i not in self.dsu_parent:
            self.dsu_parent[i] = i
            return i
        if self.dsu_parent[i] == i:
            return i
        self.dsu_parent[i] = self._find(self.dsu_parent[i])
        return self.dsu_parent[i]

    def _union(self, i: str, j: str):
        root_i = self._find(i)
        root_j = self._find(j)
        if root_i != root_j:
            # Prefer ground/vcc naming if merging
            if "GROUND" in root_i:
                self.dsu_parent[root_j] = root_i
            elif "GROUND" in root_j:
                self.dsu_parent[root_i] = root_j
            elif "POWER" in root_i or "VCC" in root_i:
                self.dsu_parent[root_j] = root_i
            elif "POWER" in root_j or "VCC" in root_j:
                self.dsu_parent[root_i] = root_j
            else:
                self.dsu_parent[root_i] = root_j

    def add_component(self, comp: Dict[str, Any]):
        cid = comp.get("id") or comp.get("designator")
        ctype = str(comp.get("type", "resistor")).lower()
        raw_terminals = comp.get("terminals", [])
        terminals = []

        if isinstance(raw_terminals, dict):
            for tname, tdata in raw_terminals.items():
                if isinstance(tdata, dict):
                    terminals.append({"name": tname, "hole": tdata.get("hole"), "node_id": tdata.get("node_id")})
                elif isinstance(tdata, str):
                    terminals.append({"name": tname, "hole": tdata})
        elif isinstance(raw_terminals, list):
            terminals = list(raw_terminals)

        if not terminals:
            h1 = comp.get("start_hole") or comp.get("hole1")
            h2 = comp.get("end_hole") or comp.get("hole2")
            if h1:
                terminals.append({"name": "terminal_a", "hole": h1})
            if h2:
                terminals.append({"name": "terminal_b", "hole": h2})

        if cid not in self.component_terminals:
            self.component_terminals[cid] = {}

        t_nodes = []
        for t in terminals:
            tname = t.get("name", "terminal")
            hole = t.get("hole")
            if hole:
                base_node = get_canonical_node_for_hole(hole)
                self._find(base_node)
                self.node_to_holes.setdefault(base_node, set()).add(hole)
                self.component_terminals[cid][tname] = base_node
                t_nodes.append((tname, base_node))

        # Wires merge connected base nodes
        if ("wire" in ctype or "jumper" in ctype) and len(t_nodes) >= 2:
            n1 = t_nodes[0][1]
            n2 = t_nodes[1][1]
            self._union(n1, n2)
            self.jumper_merges.append((n1, n2))

    def build_graph(self) -> Dict[str, Any]:
        """
        Compiles the unified electrical nodes and mapped components into a resolved graph.
        """
        resolved_nodes: Dict[str, Dict[str, Any]] = {}
        for base_node, holes in self.node_to_holes.items():
            final_root = self._find(base_node)
            if final_root not in resolved_nodes:
                resolved_nodes[final_root] = {
                    "id": final_root,
                    "holes": set(),
                    "connected_pins": []
                }
            resolved_nodes[final_root]["holes"].update(holes)

        # Map component terminals to resolved root electrical nodes
        resolved_components: List[Dict[str, Any]] = []
        for cid, t_map in self.component_terminals.items():
            resolved_t = {}
            for tname, base_node in t_map.items():
                root_node = self._find(base_node)
                resolved_t[tname] = root_node
                if root_node in resolved_nodes:
                    resolved_nodes[root_node]["connected_pins"].append(f"{cid}.{tname}")

            resolved_components.append({
                "component_id": cid,
                "terminals": resolved_t
            })

        formatted_nodes = [
            {
                "id": nid,
                "holes": sorted(list(ndata["holes"])),
                "connected_pins": sorted(ndata["connected_pins"])
            }
            for nid, ndata in resolved_nodes.items()
        ]

        return {
            "nodes": formatted_nodes,
            "components": resolved_components
        }


# ---------------------------------------------------------------------------
# 5. DETERMINISTIC SERIES / PARALLEL TOPOLOGY REASONING ENGINE
# ---------------------------------------------------------------------------

class TopologyAnalyzer:
    """
    Deterministic Graph-Based Topology Reasoning Engine.
    Mathematically determines series, parallel, branch, junction, short circuit,
    and open/floating conditions from graph connectivity.
    """

    def __init__(self, node_graph: Dict[str, Any], component_list: List[Dict[str, Any]]):
        self.nodes = node_graph.get("nodes", [])
        self.graph_comps = node_graph.get("components", [])
        self.comp_map = {c.get("id") or c.get("designator"): c for c in component_list}

    def analyze(self) -> Dict[str, Any]:
        """
        Executes full topological analysis.
        Returns:
            - series_groups: List of components in series
            - parallel_groups: List of components in parallel
            - junctions: Nodes with branching >= 3
            - short_circuits: Components whose terminals connect to the same electrical node
            - floating_components: Components with <= 1 connection
            - topology_summary: Structured human-readable explanations
        """
        series_pairs: List[Dict[str, Any]] = []
        parallel_groups: List[Dict[str, Any]] = []
        short_circuits: List[Dict[str, Any]] = []
        floating_components: List[str] = []
        junction_nodes: List[str] = []

        # 1. Map components to their 2 terminal nodes
        comp_nodes: Dict[str, Tuple[str, str]] = {}
        node_to_connected_comps: Dict[str, List[str]] = {}

        for c_entry in self.graph_comps:
            cid = c_entry["component_id"]
            c_meta = self.comp_map.get(cid, {})
            ctype = str(c_meta.get("type", "")).lower()

            # Ignore jumper wires for series/parallel component analysis (wires act as ideal shorts)
            if "wire" in ctype or "jumper" in ctype:
                continue

            t_dict = c_entry.get("terminals", {})
            t_vals = list(t_dict.values())

            if len(t_vals) < 2:
                floating_components.append(cid)
                continue

            n1, n2 = t_vals[0], t_vals[1]

            # Short circuit detection: Both leads on same electrical node
            if n1 == n2:
                short_circuits.append({
                    "component_id": cid,
                    "node": n1,
                    "reason": f"Component {cid} has both terminals connected to identical electrical node {n1}"
                })
                continue

            # Canonical order for pair comparison
            pair_key = (min(n1, n2), max(n1, n2))
            comp_nodes[cid] = pair_key

            node_to_connected_comps.setdefault(n1, []).append(cid)
            node_to_connected_comps.setdefault(n2, []).append(cid)

        # 2. Parallel Connection Detection
        # Two components sharing the exact same pair of electrical nodes form parallel branches
        pair_to_comps: Dict[Tuple[str, str], List[str]] = {}
        for cid, (n1, n2) in comp_nodes.items():
            pair_to_comps.setdefault((n1, n2), []).append(cid)

        for (n1, n2), c_list in pair_to_comps.items():
            if len(c_list) >= 2:
                parallel_groups.append({
                    "type": "PARALLEL",
                    "components": c_list,
                    "nodes": [n1, n2],
                    "explanation": f"{', '.join(c_list)} connect across identical nodes ({n1} <--> {n2}) forming parallel branches."
                })

        # 3. Series Connection Detection
        # Two components share an intermediate electrical node of degree exactly 2 (no other component branches or power rails attached)
        checked_pairs = set()
        for nid, connected_cids in node_to_connected_comps.items():
            # Junction check
            if len(connected_cids) >= 3:
                junction_nodes.append(nid)

            # Strict Series Check: Shared node connects exactly 2 components and is not a power/ground rail
            if len(connected_cids) == 2 and "POWER" not in nid and "GROUND" not in nid and "VCC" not in nid:
                c1, c2 = connected_cids[0], connected_cids[1]
                pair_id = tuple(sorted([c1, c2]))
                if pair_id not in checked_pairs:
                    checked_pairs.add(pair_id)
                    series_pairs.append({
                        "type": "SERIES",
                        "components": [c1, c2],
                        "shared_node": nid,
                        "explanation": f"{c1} and {c2} are in series sharing intermediate junction {nid} with zero branch current."
                    })

        is_valid_topology = len(short_circuits) == 0 and len(floating_components) == 0

        return {
            "status": "VALID" if is_valid_topology else "INVALID",
            "series_groups": series_pairs,
            "parallel_groups": parallel_groups,
            "junction_nodes": junction_nodes,
            "short_circuits": short_circuits,
            "floating_components": floating_components,
            "series_count": len(series_pairs),
            "parallel_count": len(parallel_groups),
            "fault_count": len(short_circuits) + len(floating_components)
        }


# ---------------------------------------------------------------------------
# 6. TOPOLOGY CONSISTENCY VERIFIER & NETLIST GATE
# ---------------------------------------------------------------------------

def verify_and_build_circuit_intelligence(
    candidates: List[Dict[str, Any]],
    img_w: int = 1280,
    img_h: int = 850,
    power_source: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Main Phase 19 Master Pipeline:
    1. Builds Component Intelligence for every candidate
    2. Performs exact breadboard hole mapping & geometry validation
    3. Builds Electrical Node Graph
    4. Runs Series / Parallel Topology Analyzer
    5. Assembles Verified Netlist for MNA Solver
    """
    intelligent_components = []
    verified_components = []
    unknown_components = []
    rejected_components = []

    for c in candidates:
        comp_intel = build_component_intelligence(c, img_w=img_w, img_h=img_h)
        intelligent_components.append(comp_intel)

        if comp_intel["status"] == "VERIFIED":
            verified_components.append(comp_intel)
        elif comp_intel["status"] in ["UNKNOWN", "AMBIGUOUS"]:
            unknown_components.append(comp_intel)
        else:
            rejected_components.append(comp_intel)

    # Build Electrical Node Graph from Verified + Manual components
    graph_builder = ElectricalNodeGraph()
    for vc in verified_components:
        graph_builder.add_component(vc)

    node_graph = graph_builder.build_graph()

    # Run Topology Analysis
    topology_analyzer = TopologyAnalyzer(node_graph, verified_components)
    topology_result = topology_analyzer.analyze()

    # Construct Verified Netlist representation
    netlist_components = []
    for vc in verified_components:
        c_type = vc["type"]
        cid = vc["id"]
        des = vc["designator"]
        t_list = vc["terminals"]

        n1 = t_list[0]["hole"] if len(t_list) > 0 else "A1"
        n2 = t_list[1]["hole"] if len(t_list) > 1 else "A2"

        net_entry = {
            "id": cid,
            "designator": des,
            "type": c_type,
            "value": vc.get("value") or (220.0 if "resistor" in c_type else (0.001 if "wire" in c_type else 1.0)),
            "unit": vc.get("unit", "Ω"),
            "start_hole": n1,
            "end_hole": n2,
            "hole1": n1,
            "hole2": n2,
            "source": vc["source"],
            "verified": True,
            "terminals": vc["terminals"]
        }

        # Add polarity tags for LEDs/diodes
        if "led" in c_type or "diode" in c_type:
            net_entry["anode"] = n1
            net_entry["cathode"] = n2

        netlist_components.append(net_entry)

    # Build full netlist payload
    from core.wire_connectivity import build_electrical_connectivity
    connectivity_data = build_electrical_connectivity(netlist_components)

    netlist_payload = {
        "components": netlist_components,
        "nodes": node_graph["nodes"],
        "nets": connectivity_data["nets"],
        "wires": connectivity_data["wires"],
        "topology": topology_result,
        "validity": {
            "status": "VALID" if (topology_result["status"] == "VALID" and len(netlist_components) > 0) else "INVALID",
            "reason": "Topology and terminal mappings verified" if topology_result["status"] == "VALID" else "Topology contains faults or unmapped terminals"
        },
        "solver_status": "READY" if (topology_result["status"] == "VALID" and len(netlist_components) > 0) else "NOT_RUN"
    }

    if power_source:
        netlist_payload["power_sources"] = [power_source]

    return {
        "status": "success",
        "component_intelligence": intelligent_components,
        "verified_components": verified_components,
        "unknown_components": unknown_components,
        "rejected_components": rejected_components,
        "node_graph": node_graph,
        "topology": topology_result,
        "netlist": netlist_payload,
        "summary": {
            "raw_count": len(candidates),
            "verified_count": len(verified_components),
            "unknown_count": len(unknown_components),
            "rejected_count": len(rejected_components),
            "node_count": len(node_graph["nodes"]),
            "series_count": topology_result["series_count"],
            "parallel_count": topology_result["parallel_count"],
            "topology_status": topology_result["status"]
        }
    }
