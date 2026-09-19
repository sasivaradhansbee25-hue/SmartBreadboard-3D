"""
Unit test suite for backend/core/wire_connectivity.py.
Executes Tests 1 through 6 per specification.
"""

import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from core.wire_connectivity import build_electrical_connectivity, get_base_node_for_hole, is_valid_hole_id

def run_tests():
    print("==================================================================")
    print("      REAL BREADBOARD WIRE CONNECTIVITY TEST SUITE               ")
    print("==================================================================")

    # ------------------------------------------------------------------
    # Test 1: R1 A10 -> A15 (Different Nets)
    # ------------------------------------------------------------------
    print("\n[Test 1] R1: A10 -> A15")
    t1_comps = [
        {"id": "c1", "designator": "R1", "type": "resistor", "start_hole": "A10", "end_hole": "A15"}
    ]
    res1 = build_electrical_connectivity(t1_comps)
    r1_p1_net = [p["net"] for p in res1["pins"] if p["component"] == "R1" and p["pin"] == 1][0]
    r1_p2_net = [p["net"] for p in res1["pins"] if p["component"] == "R1" and p["pin"] == 2][0]

    print(f"  • R1.1 Net: {r1_p1_net}")
    print(f"  • R1.2 Net: {r1_p2_net}")
    assert r1_p1_net != r1_p2_net, "Test 1 Failed: R1.1 and R1.2 should be in different nets"
    print("  [PASS] R1.1 and R1.2 belong to different nets.")

    # ------------------------------------------------------------------
    # Test 2: R1 (A10 -> A15) & LED1 (B15 -> B20) (Internal Column Connection)
    # ------------------------------------------------------------------
    print("\n[Test 2] R1: A10 -> A15 | LED1: B15 -> B20")
    t2_comps = [
        {"id": "c1", "designator": "R1", "type": "resistor", "start_hole": "A10", "end_hole": "A15"},
        {"id": "c2", "designator": "LED1", "type": "led", "start_hole": "B15", "end_hole": "B20"}
    ]
    res2 = build_electrical_connectivity(t2_comps)
    r1_p2_net = [p["net"] for p in res2["pins"] if p["component"] == "R1" and p["pin"] == 2][0]
    led1_p1_net = [p["net"] for p in res2["pins"] if p["component"] == "LED1" and p["pin"] == 1][0]

    print(f"  • R1.2 Net (A15): {r1_p2_net}")
    print(f"  • LED1.1 Net (B15): {led1_p1_net}")
    assert r1_p2_net == led1_p1_net, "Test 2 Failed: A15 and B15 are in same col 15 top strip, should share net"
    print("  [PASS] R1.2 and LED1.1 belong to the same net via internal column tie-point strip.")

    # ------------------------------------------------------------------
    # Test 3: R1 (A10 -> A15), W1 (A15 -> F20), LED1 (G20 -> G25) (Bridge Wire)
    # ------------------------------------------------------------------
    print("\n[Test 3] R1: A10 -> A15 | W1: A15 -> F20 | LED1: G20 -> G25")
    t3_comps = [
        {"id": "c1", "designator": "R1", "type": "resistor", "start_hole": "A10", "end_hole": "A15"},
        {"id": "w1", "designator": "W1", "type": "wire", "start_hole": "A15", "end_hole": "F20"},
        {"id": "c2", "designator": "LED1", "type": "led", "start_hole": "G20", "end_hole": "G25"}
    ]
    res3 = build_electrical_connectivity(t3_comps)
    r1_p2_net = [p["net"] for p in res3["pins"] if p["component"] == "R1" and p["pin"] == 2][0]
    led1_p1_net = [p["net"] for p in res3["pins"] if p["component"] == "LED1" and p["pin"] == 1][0]
    w1_net = res3["wires"][0]["net"]

    print(f"  • R1.2 Net (A15): {r1_p2_net}")
    print(f"  • W1 Net (A15 -> F20): {w1_net}")
    print(f"  • LED1.1 Net (G20): {led1_p1_net}")
    assert r1_p2_net == led1_p1_net == w1_net, "Test 3 Failed: W1 bridges A15 and F20, and F20/G20 share col 20 bot strip"
    print("  [PASS] R1.2 and LED1.1 belong to the same net via jumper wire W1 and column tie-points.")

    # ------------------------------------------------------------------
    # Test 4: R1 (A10 -> A15) & LED1 (F15 -> F20) (Isolated Top/Bot Sections)
    # ------------------------------------------------------------------
    print("\n[Test 4] R1: A10 -> A15 | LED1: F15 -> F20")
    t4_comps = [
        {"id": "c1", "designator": "R1", "type": "resistor", "start_hole": "A10", "end_hole": "A15"},
        {"id": "c2", "designator": "LED1", "type": "led", "start_hole": "F15", "end_hole": "F20"}
    ]
    res4 = build_electrical_connectivity(t4_comps)
    r1_p2_net = [p["net"] for p in res4["pins"] if p["component"] == "R1" and p["pin"] == 2][0]
    led1_p1_net = [p["net"] for p in res4["pins"] if p["component"] == "LED1" and p["pin"] == 1][0]

    print(f"  • R1.2 Net (A15): {r1_p2_net}")
    print(f"  • LED1.1 Net (F15): {led1_p1_net}")
    assert r1_p2_net != led1_p1_net, "Test 4 Failed: A15 (top) and F15 (bot) must be isolated"
    print("  [PASS] R1.2 and LED1.1 do NOT share a net because top (A-E) and bottom (F-J) sections are isolated.")

    # ------------------------------------------------------------------
    # Test 5: Invalid Hole Handling (XYZ123)
    # ------------------------------------------------------------------
    print("\n[Test 5] Invalid Hole ID: XYZ123")
    t5_comps = [
        {"id": "c1", "designator": "R1", "type": "resistor", "start_hole": "XYZ123", "end_hole": "A15"}
    ]
    res5 = build_electrical_connectivity(t5_comps)
    print(f"  • Returned Warnings: {res5['warnings']}")
    assert len(res5["warnings"]) >= 1, "Test 5 Failed: Expected warning for invalid hole XYZ123"
    print("  [PASS] Invalid hole handled safely with warning, zero crash.")

    # ------------------------------------------------------------------
    # Test 6: Wire Endpoints (W1: A10 -> F20)
    # ------------------------------------------------------------------
    print("\n[Test 6] Wire W1: A10 -> F20")
    t6_comps = [
        {"id": "w1", "designator": "W1", "type": "wire", "start_hole": "A10", "end_hole": "F20"}
    ]
    res6 = build_electrical_connectivity(t6_comps)
    w1_info = res6["wires"][0]
    w1_p1_net = [p["net"] for p in res6["pins"] if p["component"] == "W1" and p["pin"] == 1][0]
    w1_p2_net = [p["net"] for p in res6["pins"] if p["component"] == "W1" and p["pin"] == 2][0]

    print(f"  • W1 Info: {w1_info}")
    print(f"  • W1 Pin 1 Net: {w1_p1_net} | Pin 2 Net: {w1_p2_net}")
    assert w1_p1_net == w1_p2_net == w1_info["net"], "Test 6 Failed: Wire endpoints must belong to same net"
    print("  [PASS] Wire endpoints A10 and F20 merge into the exact same electrical net.")

    print("\n==================================================================")
    print("[SUCCESS] ALL 6 WIRE CONNECTIVITY UNIT TESTS PASSED CLEANLY!")
    print("==================================================================")

if __name__ == "__main__":
    run_tests()
