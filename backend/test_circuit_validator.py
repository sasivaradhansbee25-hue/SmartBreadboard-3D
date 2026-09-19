"""
SmartBreadboard 3D — Comprehensive Circuit Validator Test Suite
Tests A through F for real circuit validation and power source handling:
- Test A: Single resistor, unpowered -> INCOMPLETE
- Test B: Resistor + LED connected, unpowered -> INCOMPLETE
- Test C: Resistor + LED + User Power Source -> VALID / READY
- Test D: Jumper wire bridging V+ and GND -> Possible short circuit / INVALID
- Test E: Invalid terminal hole ID -> INVALID
- Test F: Uncertain terminal mapping -> WARNING / INCOMPLETE, not silent PASS
"""

import sys
import json
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from core.circuit_model import build_netlist_from_detections
from core.circuit_validator import validate_circuit

def test_a_single_resistor_unpowered():
    print("\n" + "="*60)
    print("TEST A: Single Resistor (R1 A10 -> A15) Unpowered")
    print("="*60)
    detections = [
        {
            "class": "resistor",
            "hole1": "A10",
            "hole2": "A15",
            "mapping_confidence": 0.95
        }
    ]
    result = build_netlist_from_detections(detections)
    
    val = result["validity"]
    ps_status = result["power_source_status"]
    solver_status = result["solver_status"]
    
    print(f"Status: {val['status']}")
    print(f"Power Source Status: {ps_status['source']} (detected={ps_status['detected']})")
    print(f"Solver Status: {solver_status}")
    print(f"Component Connectivity: {json.dumps(val['component_connectivity'], indent=2)}")
    
    assert val["status"] == "INCOMPLETE", f"Expected INCOMPLETE, got {val['status']}"
    assert solver_status == "NOT_RUN", f"Expected solver NOT_RUN, got {solver_status}"
    assert ps_status["source"] == "none", f"Expected source 'none', got {ps_status['source']}"
    assert ps_status["voltage"] is None, "Voltage should not be fabricated"
    assert val["checks"]["has_power_source"] is False
    assert len(val["component_connectivity"]) == 1
    assert val["component_connectivity"][0]["pin1"]["hole"] == "A10"
    assert val["component_connectivity"][0]["pin2"]["hole"] == "A15"
    assert val["component_connectivity"][0]["complete"] is True
    print("[PASS] Test A Passed: Correctly identified as INCOMPLETE due to lack of power source.")

def test_b_resistor_led_unpowered():
    print("\n" + "="*60)
    print("TEST B: Resistor + LED (R1 A10->A15, LED1 B15->B20) Unpowered")
    print("="*60)
    detections = [
        {
            "class": "resistor",
            "hole1": "A10",
            "hole2": "A15",
            "mapping_confidence": 0.95
        },
        {
            "class": "led",
            "hole1": "B15",
            "hole2": "B20",
            "mapping_confidence": 0.92
        }
    ]
    result = build_netlist_from_detections(detections)
    
    val = result["validity"]
    nets = result["nets"]
    
    print(f"Status: {val['status']}")
    print(f"Nets: {[n['net_id'] + ': ' + ', '.join(n['connected_pins']) for n in nets]}")
    print(f"Solver Status: {result['solver_status']}")
    
    # Verify R1 and LED1 share column 15 net
    col15_net = None
    for n in nets:
        pins = n.get("connected_pins", [])
        if any("R1" in p for p in pins) and any("LED1" in p for p in pins):
            col15_net = n["net_id"]
            break
            
    assert col15_net is not None, "R1.2 and LED1.1 should share the column 15 net"
    assert val["status"] == "INCOMPLETE", f"Expected INCOMPLETE without power, got {val['status']}"
    assert result["solver_status"] == "NOT_RUN", "Solver must NOT_RUN when unpowered"
    print(f"[PASS] Test B Passed: Shared node recognized ({col15_net}), status is INCOMPLETE.")

def test_c_powered_complete_circuit():
    print("\n" + "="*60)
    print("TEST C: Resistor + LED with User Power Source (V1 on NET1 -> NET3)")
    print("="*60)
    detections = [
        {
            "class": "resistor",
            "hole1": "A10",
            "hole2": "A15",
            "mapping_confidence": 0.95
        },
        {
            "class": "led",
            "hole1": "B15",
            "hole2": "B20",
            "mapping_confidence": 0.92
        }
    ]
    # First build to inspect net IDs
    pre = build_netlist_from_detections(detections)
    net_names = [n["net_id"] for n in pre["nets"]]
    pos_net = net_names[0] # NET1 (col 10)
    neg_net = net_names[2] # NET3 (col 20)
    
    user_power = {
        "id": "V1",
        "voltage": 5.0,
        "node_pos": pos_net,
        "node_neg": neg_net
    }
    
    result = build_netlist_from_detections(detections, power_source=user_power)
    val = result["validity"]
    ps_status = result["power_source_status"]
    
    print(f"Status: {val['status']}")
    print(f"Power Source: {ps_status}")
    print(f"Checks: {json.dumps(val['checks'], indent=2)}")
    print(f"Solver Status: {result['solver_status']}")
    
    assert val["status"] == "VALID", f"Expected VALID, got {val['status']}"
    assert val["valid"] is True
    assert val["checks"]["closed_path"] is True
    assert val["checks"]["no_short_circuit"] is True
    assert result["solver_status"] == "READY", f"Expected READY, got {result['solver_status']}"
    assert ps_status["source"] == "user"
    assert ps_status["voltage"] == 5.0
    print("[PASS] Test C Passed: Closed path verified from V+ -> R1 -> LED1 -> GND, Solver is READY.")

def test_d_direct_short_circuit():
    print("\n" + "="*60)
    print("TEST D: V+ and GND directly bridged by Jumper Wire W1")
    print("="*60)
    # W1 bridges VCC and GND directly
    detections = [
        {
            "class": "wire",
            "hole1": "VCC_TOP1",
            "hole2": "GND_TOP1",
            "mapping_confidence": 0.98
        }
    ]
    user_power = {
        "id": "V1",
        "voltage": 5.0,
        "node_pos": "NET_VCC (+5V)",
        "node_neg": "NET_GND (0V)"
    }
    result = build_netlist_from_detections(detections, power_source=user_power)
    val = result["validity"]
    
    print(f"Status: {val['status']}")
    print(f"Errors: {val['errors']}")
    print(f"Short Circuit Check: {val['checks']['no_short_circuit']}")
    print(f"Solver Status: {result['solver_status']}")
    
    assert val["status"] == "INVALID", f"Expected INVALID, got {val['status']}"
    assert val["valid"] is False
    assert val["checks"]["no_short_circuit"] is False
    assert result["solver_status"] == "NOT_RUN"
    assert any("short between power and ground" in e.lower() for e in val["errors"])
    print("[PASS] Test D Passed: Direct short circuit detected and flagged as INVALID.")

def test_e_invalid_terminal_hole():
    print("\n" + "="*60)
    print("TEST E: Invalid Terminal Hole ID ('XYZ999')")
    print("="*60)
    detections = [
        {
            "class": "resistor",
            "hole1": "XYZ999",
            "hole2": "A15",
            "mapping_confidence": 0.95
        }
    ]
    result = build_netlist_from_detections(detections)
    val = result["validity"]
    
    print(f"Status: {val['status']}")
    print(f"Errors: {val['errors']}")
    print(f"Valid Hole IDs Check: {val['checks']['valid_hole_ids']}")
    
    assert val["status"] == "INVALID", f"Expected INVALID, got {val['status']}"
    assert val["valid"] is False
    assert val["checks"]["valid_hole_ids"] is False
    assert any("Invalid terminal" in e for e in val["errors"])
    print("[PASS] Test E Passed: Invalid hole ID properly rejected with INVALID status.")

def test_f_uncertain_terminal_mapping():
    print("\n" + "="*60)
    print("TEST F: Uncertain Terminal Mapping (confidence 0.35)")
    print("="*60)
    detections = [
        {
            "class": "resistor",
            "hole1": "A10",
            "hole2": "A15",
            "mapping_confidence": 0.35,
            "is_uncertain": True
        }
    ]
    result = build_netlist_from_detections(detections)
    val = result["validity"]
    
    print(f"Status: {val['status']}")
    print(f"Warnings: {val['warnings']}")
    print(f"Uncertain Check: {val['checks']['no_uncertain_mappings']}")
    
    # Must be WARNING or INCOMPLETE, never silent PASS/VALID
    assert val["status"] in ["WARNING", "INCOMPLETE"], f"Expected WARNING or INCOMPLETE, got {val['status']}"
    assert val["status"] != "VALID", "Must not silently PASS with uncertain mappings"
    assert val["checks"]["no_uncertain_mappings"] is False
    assert any("Uncertain" in w for w in val["warnings"])
    print("[PASS] Test F Passed: Low confidence / uncertain mapping flagged with WARNING/INCOMPLETE.")

if __name__ == "__main__":
    print("RUNNING CIRCUIT VALIDATOR TEST SUITE...")
    test_a_single_resistor_unpowered()
    test_b_resistor_led_unpowered()
    test_c_powered_complete_circuit()
    test_d_direct_short_circuit()
    test_e_invalid_terminal_hole()
    test_f_uncertain_terminal_mapping()
    print("\n" + "="*60)
    print("ALL TESTS (A - F) COMPLETED SUCCESSFULLY!")
    print("="*60)
