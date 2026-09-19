"""
Verification script for orientation-aware component lead-to-breadboard-hole mapping system.
Tests Cases A through F per specification.
"""

import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from cv.breadboard_grid import (
    estimate_component_orientation,
    estimate_component_terminals,
    find_nearest_canonical_hole,
    extract_component_lead_positions,
    extract_component_lead_positions_verbose
)

def run_tests():
    test_cases = [
        {
            "case": "Case A: Horizontal Resistor",
            "bbox": [300, 200, 600, 260],
            "type": "resistor"
        },
        {
            "case": "Case B: Vertical Resistor",
            "bbox": [400, 150, 460, 450],
            "type": "resistor"
        },
        {
            "case": "Case C: Horizontal LED",
            "bbox": [500, 300, 750, 350],
            "type": "led"
        },
        {
            "case": "Case D: Vertical LED",
            "bbox": [550, 200, 600, 420],
            "type": "led"
        },
        {
            "case": "Case E: Jumper Wire",
            "bbox": [350, 180, 420, 500],
            "type": "wire"
        },
        {
            "case": "Case F: Out-of-Bounds Component",
            "bbox": [-200, -200, -100, -100],
            "type": "resistor"
        }
    ]

    print("==================================================================")
    print("      BREADBOARD GRID ORIENTATION-AWARE MAPPING TEST RESULTS       ")
    print("==================================================================")

    all_passed = True
    for tc in test_cases:
        c_name = tc["case"]
        bbox = tc["bbox"]
        ctype = tc["type"]

        # Run verbose extraction
        v_res = extract_component_lead_positions_verbose(bbox, ctype, img_w=1280, img_h=850)
        # Run backward-compatible signature extraction
        t1, t2, h1, h2, conf = extract_component_lead_positions(bbox, ctype, img_w=1280, img_h=850)

        print(f"\n--- {c_name} ---")
        print(f"  • Bounding Box: {bbox} (Type: {ctype})")
        print(f"  • Orientation Info: {v_res['orientation_info']}")
        print(f"  • Terminal 1 (px): ({v_res['t1_img'][0]:.1f}, {v_res['t1_img'][1]:.1f})")
        print(f"  • Terminal 2 (px): ({v_res['t2_img'][0]:.1f}, {v_res['t2_img'][1]:.1f})")
        print(f"  • Mapped Holes: {h1} <--> {h2}")
        print(f"  • Mapping Confidence: {conf}")
        print(f"  • Mapping Uncertain Flag: {v_res['is_uncertain']}")

        # Assert backward compatibility
        assert t1 == v_res["t1_img"], "t1 mismatch"
        assert t2 == v_res["t2_img"], "t2 mismatch"
        assert h1 == v_res["hole1"], "h1 mismatch"
        assert h2 == v_res["hole2"], "h2 mismatch"
        assert conf == v_res["overall_conf"], "conf mismatch"

    print("\n[SUCCESS] ALL TEST CASES COMPLETED AND SIGNATURE COMPATIBILITY VERIFIED!")

if __name__ == "__main__":
    run_tests()
