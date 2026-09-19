"""
SmartBreadboard 3D — Test Suite: Electrical Simulation Result → 3D Digital Twin
Tests normalized electrical simulation formatting, component electrical states,
node voltage mapping, current direction, 3D digital-twin data retention,
and simulation safety guardrails.
"""

import os
import sys

# Ensure UTF-8 output encoding on Windows consoles
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from circuit_solver.dc_solver import run_dc_analysis
from circuit_solver.results import format_solver_result, build_digital_twin_payload
from core.circuit_model import build_netlist_from_detections
from core.circuit_validator import validate_circuit

def test_complete_r1_led1_digital_twin():
    """
    Test a complete circuit:
    - 5V DC power source connected to VCC and GND
    - R1 (220 Ohm) from VCC to NET1
    - LED1 (Red, Vf ~ 2.0V) from NET1 to GND
    - Jumper Wire W1 connecting VCC rail to R1 input
    """
    print("\n--- Test 1: Complete Circuit (R1 = 220 Ohm, LED1, 5V Source) ---")

    # 1. Mock detections representing physical breadboard layout
    mock_detections = [
        {
            "id": "comp-1",
            "class": "resistor",
            "hole1": "E10",
            "hole2": "E15",
            "value": 220.0,
            "unit": "Ω",
            "confidence": 0.95,
            "mapping_confidence": 0.92
        },
        {
            "id": "comp-2",
            "class": "led",
            "hole1": "B15",
            "hole2": "B20",
            "value": 2.0,
            "unit": "V",
            "confidence": 0.93,
            "mapping_confidence": 0.89
        },
        {
            "id": "wire-1",
            "class": "wire",
            "hole1": "VCC_TOP_10",
            "hole2": "A10",
            "confidence": 0.98,
            "mapping_confidence": 0.96
        },
        {
            "id": "wire-2",
            "class": "wire",
            "hole1": "A20",
            "hole2": "GND_TOP_20",
            "confidence": 0.98,
            "mapping_confidence": 0.96
        }
    ]

    power_source = {
        "id": "V1",
        "type": "dc",
        "voltage": 5.0
    }

    netlist = build_netlist_from_detections(mock_detections, power_source=power_source)

    # Verify circuit validation passed
    assert netlist["validity"]["valid"] is True, f"Expected valid circuit, got errors: {netlist['validity']['errors']}"
    assert netlist["solver_status"] == "READY", f"Expected READY, got {netlist['solver_status']}"

    # Solve circuit
    solver_res = run_dc_analysis(netlist)
    assert solver_res.success is True, f"Expected solver success, got: {solver_res.error}"

    # Format result with digital twin
    result = format_solver_result(solver_res, netlist)

    # Verify Normalized Result Top-Level Fields
    assert result["solver_status"] == "SOLVED", f"Expected SOLVED, got {result['solver_status']}"
    assert result["analysis_type"] == "DC", f"Expected DC, got {result['analysis_type']}"
    assert "node_voltages" in result, "Missing node_voltages in result"
    assert "nodes" in result and len(result["nodes"]) > 0, "Missing or empty nodes list"
    assert "components" in result and len(result["components"]) > 0, "Missing or empty components list"

    # Verify Digital Twin Object
    assert "digital_twin" in result, "Missing digital_twin in result"
    dt = result["digital_twin"]
    assert dt["solver_status"] == "SOLVED"
    assert len(dt["components"]) >= 2
    assert len(dt["wires"]) >= 2
    assert len(dt["nodes"]) >= 2

    # Verify Component IDs & Electrical Parameters
    r1 = next((c for c in dt["components"] if "R" in c["designator"] or c["type"] == "resistor"), None)
    assert r1 is not None, "Resistor R1 not found in digital_twin"
    assert r1["value"] == 220.0
    assert r1["start_hole"] == "E10"
    assert r1["end_hole"] == "E15"
    assert r1["mapping_confidence"] == 0.92
    assert r1["electrical"] is not None
    assert r1["electrical"]["voltage"] > 0, f"Expected positive voltage drop across R1, got {r1['electrical']['voltage']}"
    assert r1["electrical"]["current"] > 0, f"Expected positive current through R1, got {r1['electrical']['current']}"
    assert r1["electrical"]["power"] > 0, f"Expected positive power in R1, got {r1['electrical']['power']}"
    assert r1["electrical"]["direction"] in ["pin1_to_pin2", "pin2_to_pin1"]

    led1 = next((c for c in dt["components"] if "LED" in c["designator"] or c["type"] == "led"), None)
    assert led1 is not None, "LED1 not found in digital_twin"
    assert led1["start_hole"] == "B15"
    assert led1["end_hole"] == "B20"
    assert led1["electrical"] is not None
    assert led1["electrical"]["state"] == "ON", f"Expected LED1 state to be ON, got {led1['electrical']['state']}"
    assert led1["electrical"]["forward_voltage"] is not None
    assert led1["electrical"]["forward_voltage"] > 1.5
    assert led1["electrical"]["current"] > 0

    # Verify Wire Metadata Preserved
    w1 = next((w for w in dt["wires"] if w["start_hole"] == "VCC_TOP_10" or "W1" in w["id"]), None)
    assert w1 is not None, "Wire W1 not found in digital_twin"
    assert w1["start_hole"] == "VCC_TOP_10"
    assert w1["end_hole"] == "A10"
    assert w1["net"] is not None

    print("✓ Complete circuit digital twin correctly verified.")
    return result


def test_incomplete_circuit_safety():
    """
    Test simulation safety:
    When circuit topology is incomplete (e.g. open circuit, no power source, or invalid),
    the solver must return solver_status: 'NOT_RUN' with an explicit reason and NO fabricated electrical values.
    """
    print("\n--- Test 2: Incomplete Circuit Simulation Safety ---")

    mock_detections = [
        {
            "id": "comp-1",
            "class": "resistor",
            "hole1": "E10",
            "hole2": "E15",
            "value": 1000.0,
            "unit": "Ω",
            "confidence": 0.95
        }
    ]

    # No power source provided
    netlist = build_netlist_from_detections(mock_detections, power_source=None)

    assert netlist["validity"]["status"] == "INCOMPLETE"
    assert netlist["solver_status"] == "NOT_RUN"
    assert netlist["solver_reason"] is not None

    # Format result without running solver
    result = format_solver_result(None, netlist)

    assert result["solver_status"] == "NOT_RUN"
    assert result["nodes"] == []
    assert result["components"] == []
    assert result["total_current_mA"] == 0.0

    dt = result["digital_twin"]
    assert dt["solver_status"] == "NOT_RUN"
    assert dt["reason"] is not None
    # Component metadata retained, but electrical values are None
    assert len(dt["components"]) == 1
    assert dt["components"][0]["designator"] == "R1"
    assert dt["components"][0]["start_hole"] == "E10"
    assert dt["components"][0]["electrical"] is None

    print("✓ Incomplete circuit safety correctly verified.")


def print_final_log(result: dict):
    """Prints terminal output conforming to Section 9 of the specification."""
    dt = result["digital_twin"]
    print("\n" + "="*50)
    print("DIGITAL TWIN SIMULATION")
    print("="*50)
    print(f"Solver: {result.get('solver_status', 'UNKNOWN')}\n")

    print("Nodes:")
    for n in dt.get("nodes", []):
        nid = n["id"]
        v = n["voltage"]
        v_str = f"{v:.2f} V" if v is not None else "N/A"
        print(f"{nid} = {v_str}")

    print("\nComponents:")
    for c in dt.get("components", []):
        des = c["designator"]
        ctype = c["type"]
        elec = c.get("electrical") or {}
        print(des)
        if "resistor" in ctype:
            print(f"  V = {elec.get('voltage', 0.0):.2f} V")
            print(f"  I = {elec.get('current', 0.0):.6f} A")
            print(f"  P = {elec.get('power', 0.0):.6f} W")
        elif "led" in ctype:
            print(f"  Vf = {elec.get('forward_voltage', elec.get('voltage', 0.0)):.2f} V")
            print(f"  I = {elec.get('current', 0.0):.6f} A")
            print(f"  State = {elec.get('state', 'UNKNOWN')}")
        else:
            print(f"  V = {elec.get('voltage', 0.0):.2f} V")
            print(f"  I = {elec.get('current', 0.0):.6f} A")
            print(f"  State = {elec.get('state', 'UNKNOWN')}")
        print()

    print("Wires:")
    for w in dt.get("wires", []):
        print(w.get("id", "W"))
        print(f"  Net = {w.get('net', 'UNKNOWN')}")
        print(f"  Start Hole = {w.get('start_hole')}, End Hole = {w.get('end_hole')}")
        print()
    print("="*50)


if __name__ == "__main__":
    res = test_complete_r1_led1_digital_twin()
    test_incomplete_circuit_safety()
    print_final_log(res)
