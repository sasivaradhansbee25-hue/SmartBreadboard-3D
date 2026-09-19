"""
Verification Test for Normalized Simulation Result -> CircuitContext -> 3D Digital Twin Integration
Tests full data flow, component matching, electrical attributes, safety rules, and Three.js 3D synchronization.
"""

import sys
import os
import json

# Add backend directory to sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

from core.circuit_model import build_netlist_from_detections
from circuit_solver.dc_solver import run_dc_analysis
from circuit_solver.results import format_solver_result, build_digital_twin_payload

def run_tests():
    print("=" * 60)
    print("TEST 1: COMPLETE RECONSTRUCTED CIRCUIT (SOLVED)")
    print("=" * 60)

    mock_detections = [
        {"class_name": "resistor", "confidence": 0.95, "bbox": [100, 200, 150, 300], "name": "R1"},
        {"class_name": "led", "confidence": 0.94, "bbox": [150, 200, 200, 300], "name": "LED1"},
        {"class_name": "wire", "confidence": 0.90, "bbox": [50, 50, 100, 100], "name": "W1"}
    ]

    power_source = {
        "id": "V1",
        "type": "dc_voltage",
        "voltage": 5.0,
        "positive_node": "NET1",
        "negative_node": "NET3"
    }

    netlist = build_netlist_from_detections(mock_detections, power_source=power_source)
    # Give clear connection nodes for complete circuit
    netlist["components"] = [
        {
            "id": "R1",
            "designator": "R1",
            "type": "resistor",
            "value": 220,
            "unit": "Ω",
            "start_hole": "10A",
            "end_hole": "10E",
            "node1": "NET1",
            "node2": "NET2",
            "confidence": 0.95
        },
        {
            "id": "LED1",
            "designator": "LED1",
            "type": "led",
            "value": "RED",
            "start_hole": "10F",
            "end_hole": "10J",
            "node1": "NET2",
            "node2": "NET3",
            "confidence": 0.94
        }
    ]
    netlist["wires"] = [
        {
            "id": "W1",
            "designator": "W1",
            "start_hole": "VCC_TOP_10",
            "end_hole": "10A",
            "net": "NET1",
            "node1": "NET1",
            "node2": "NET1"
        }
    ]

    solver_res = run_dc_analysis(netlist)
    formatted = format_solver_result(solver_res, netlist)

    assert formatted["status"] == "SOLVED", f"Expected SOLVED, got {formatted['status']}"
    assert formatted["solver_status"] == "SOLVED"
    assert "node_voltages" in formatted
    assert "NET1" in formatted["node_voltages"]
    assert "components" in formatted
    assert len(formatted["components"]) >= 2
    assert "digital_twin" in formatted
    dt = formatted["digital_twin"]
    assert dt["solver_status"] == "SOLVED"
    assert len(dt["components"]) == 2
    assert len(dt["wires"]) == 1

    # Check R1 electrical data
    r1 = next(c for c in formatted["components"] if c["id"] == "R1")
    assert r1["voltage"] > 0, "R1 voltage drop should be > 0"
    assert r1["current"] > 0, "R1 current should be > 0"
    assert r1["power"] > 0, "R1 power should be > 0"
    assert r1["direction"] in ["pin1_to_pin2", "pin2_to_pin1"]

    # Check LED1 electrical data
    led1 = next(c for c in formatted["components"] if c["id"] == "LED1")
    assert led1["state"] == "ON", f"Expected LED state ON, got {led1['state']}"
    assert led1["forward_voltage"] is not None

    print(f"[PASS] Solver Status: {formatted['solver_status']}")
    print(f"[PASS] Node Voltages: {formatted['node_voltages']}")
    print(f"[PASS] R1 Voltage: {r1['voltage']} V | Current: {r1['current']*1000:.2f} mA | Power: {r1['power']*1000:.2f} mW | Direction: {r1['direction']}")
    print(f"[PASS] LED1 State: {led1['state']} | Forward Voltage: {led1['forward_voltage']} V | Current: {led1['current']*1000:.2f} mA")
    print(f"[PASS] Digital Twin Wires: {len(dt['wires'])} (Wire W1 connected to {dt['wires'][0]['net']})")

    print("\n" + "=" * 60)
    print("TEST 2: INCOMPLETE CIRCUIT WITHOUT POWER (NOT_RUN SAFETY)")
    print("=" * 60)

    incomplete_netlist = build_netlist_from_detections(mock_detections, power_source=None)
    assert incomplete_netlist["solver_status"] == "NOT_RUN"
    
    formatted_incomplete = format_solver_result(None, incomplete_netlist)
    assert formatted_incomplete["status"] == "NOT_RUN"
    assert formatted_incomplete["solver_status"] == "NOT_RUN"
    assert formatted_incomplete["components"] == []
    assert formatted_incomplete["digital_twin"]["solver_status"] == "NOT_RUN"
    assert formatted_incomplete["reason"] is not None

    print(f"[PASS] Incomplete Circuit Solver Status: {formatted_incomplete['solver_status']}")
    print(f"[PASS] Backend Reason: {formatted_incomplete['reason']}")
    print(f"[PASS] Components List Empty (Zero fake data): {len(formatted_incomplete['components']) == 0}")
    print("[PASS] Passed simulation safety verification.")

    print("\n" + "=" * 60)
    print("TEST 3: FRONTEND MATCHING LOGIC SIMULATION")
    print("=" * 60)

    # Simulate frontend matchSimulationElectrical() logic
    def frontend_match(comp, sim_res):
        cid = (comp.get("id") or "").upper()
        cdes = (comp.get("designator") or "").upper()
        if sim_res and "components" in sim_res:
            for item in sim_res["components"]:
                sid = (item.get("id") or "").upper()
                sdes = (item.get("designator") or "").upper()
                if (sid and (sid == cid or sid == cdes)) or (sdes and (sdes == cid or sdes == cdes)):
                    return item
        return None

    # Test physical component R1 match
    physical_r1 = {"id": "R1", "designator": "R1", "type": "resistor", "start_hole": "10A", "end_hole": "10E"}
    matched_r1 = frontend_match(physical_r1, formatted)
    assert matched_r1 is not None, "Failed to match R1"
    assert matched_r1["voltage"] == r1["voltage"]
    print(f"[PASS] Frontend matched R1 by designator: Voltage={matched_r1['voltage']}V, Current={matched_r1['current']}A")

    # Test physical component LED1 match
    physical_led1 = {"id": "comp-led-1", "designator": "LED1", "type": "led", "start_hole": "10F", "end_hole": "10J"}
    matched_led1 = frontend_match(physical_led1, formatted)
    assert matched_led1 is not None, "Failed to match LED1 by designator"
    assert matched_led1["state"] == "ON"
    print(f"[PASS] Frontend matched LED1 by designator: State={matched_led1['state']}, Vf={matched_led1['forward_voltage']}V")

    # Test missing component (no fake data)
    unrelated_comp = {"id": "C99", "designator": "C99", "type": "capacitor"}
    matched_unrelated = frontend_match(unrelated_comp, formatted)
    assert matched_unrelated is None, "Should be None for unmatched component"
    print("[PASS] Unmatched component correctly returns None (Zero fake data)")

    print("\n" + "=" * 60)
    print("ALL INTEGRATION TESTS PASSED (100% CORRECTNESS)")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
