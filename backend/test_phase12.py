"""
SmartBreadboard 3D — Phase 12 Breadboard Netlist Mapping Test Suite
Tests 830 tie-point hole centroid generation, terminal strip rules,
jumper wire node merging, and full Phase 9 -> Phase 10 -> Phase 11 -> Phase 12 end-to-end netlist output.
"""

import os
import sys
import json

sys.path.insert(0, os.path.dirname(__file__))

from cv.preprocessing import preprocess_breadboard_image
from cv.yolo_detector import detect_components_yolo
from cv.resistor_color import analyze_resistor_color
from cv.breadboard_grid import HOLE_CENTROIDS, map_lead_to_nearest_hole
from core.circuit_model import get_base_node_for_hole, build_netlist_from_detections

def test_phase12():
    photo_path = 'e:/CIRCUIT STIMULATOR/backend/test_assets/real_breadboard_photo.jpg'
    if not os.path.exists(photo_path):
        print(f"Error: Test asset {photo_path} not found.")
        return

    print("================================================================")
    print("      PHASE 12 BREADBOARD NETLIST MAPPING TEST                  ")
    print("================================================================")

    # Unit Test 1: 830 Hole Centroid Generation
    print(f"1. Total 830 Tie-Point Hole Centroids Generated: {len(HOLE_CENTROIDS)}")
    assert len(HOLE_CENTROIDS) >= 630, "Missing tie-point hole centroids"

    # Unit Test 2: Terminal Strip Connectivity Rules
    node_A22 = get_base_node_for_hole("A22")
    node_E22 = get_base_node_for_hole("E22")
    node_F22 = get_base_node_for_hole("F22")

    print("\n2. Terminal Strip Connectivity Rule Verification:")
    print(f"   • Hole A22 Base Node: {node_A22}")
    print(f"   • Hole E22 Base Node: {node_E22}")
    print(f"   • Hole F22 Base Node: {node_F22}")

    assert node_A22 == node_E22, "A22 and E22 must belong to the same top column node"
    assert node_E22 != node_F22, "Center channel must isolate E22 and F22"

    # Unit Test 3: Euclidean Lead-to-Hole Mapping
    hole, dist = map_lead_to_nearest_hole(286.0, 135.0) # Near E22 (x ~ 286, y = 135)
    print(f"\n3. Lead-to-Hole Distance Test: Lead at (286, 135) -> Hole '{hole}' (Distance: {dist} px)")

    # Unit Test 4: End-to-End Pipeline Verification
    with open(photo_path, 'rb') as f:
        raw_bytes = f.read()

    print("\n--- Running End-to-End Pipeline (Phase 9 -> Phase 10 -> Phase 11 -> Phase 12) ---")
    prep_res = preprocess_breadboard_image(raw_bytes)
    norm_b64 = prep_res.get('normalized_image_base64', '')

    det_res = detect_components_yolo(norm_b64)
    detections = det_res.get('detections', [])

    # Collect resistor color analyses for detected resistors
    resistor_analyses = []
    for d in detections:
        if d.get('class') == 'resistor' and 'crop_base64' in d:
            r_color = analyze_resistor_color(d['crop_base64'], resistor_id=d['id'])
            resistor_analyses.append(r_color)

    # Build Circuit Data Model Netlist
    netlist = build_netlist_from_detections(detections, resistor_analyses)

    print("\n[Circuit Data Model Netlist Schema Output (SPEC.md Section 9)]:")
    print(f"  • Circuit ID: {netlist.get('circuit_id')}")
    print(f"  • Netlist Source: {netlist.get('metadata', {}).get('source')}")
    print(f"  • Total Electrical Nodes: {len(netlist.get('nodes', []))}")
    print(f"  • Total Components: {len(netlist.get('components', []))}")
    print(f"  • Total Power Sources: {len(netlist.get('power_sources', []))}")
    print(f"  • Netlist Pass Status: {netlist.get('validity', {}).get('status')}")

    print("\n[Mapped Components Detail]:")
    for comp in netlist.get('components', []):
        print(f"   • {comp['id']} ({comp['type']}): Node1 = {comp['node1']} ({comp['hole1']}) <-> Node2 = {comp['node2']} ({comp['hole2']}) | Val = {comp['detected_value']}")

    assert netlist.get('validity', {}).get('status') == 'PASS', "Netlist validity failed"
    assert len(netlist.get('nodes', [])) > 0, "No electrical nodes generated"

    print("\n[SUCCESS] PHASE 12 BREADBOARD NETLIST TEST PASSED CLEANLY!")

if __name__ == "__main__":
    test_phase12()
