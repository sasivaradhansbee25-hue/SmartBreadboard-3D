"""
SmartBreadboard 3D — Custom Test Runner
Runs circuit solver and power source injection unit tests.
"""

import sys
import os

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
tests_dir = os.path.dirname(__file__)
for p in [backend_dir, tests_dir]:
    if p not in sys.path:
        sys.path.insert(0, p)

from test_circuit_solver import (
    test_1_simple_resistor_12v,
    test_2_series_resistors_12v,
    test_3_parallel_resistors_12v,
    test_4_real_photo_no_power_source,
    test_5_real_photo_with_user_source,
    test_6_invalid_source_connection,
    test_7_same_node_source,
    test_8_source_voltage_update_5v_to_12v,
    test_9_current_direction_reversal,
    test_10_zero_current_circuit
)

def run_all():
    tests = [
        ("TEST 1: 12V + 1kOhm Resistor", test_1_simple_resistor_12v),
        ("TEST 2: 12V + 1kOhm + 1kOhm Series", test_2_series_resistors_12v),
        ("TEST 3: 12V + Parallel Resistors", test_3_parallel_resistors_12v),
        ("TEST 4: Real Photo NO Power Source", test_4_real_photo_no_power_source),
        ("TEST 5: Real Photo WITH User Source", test_5_real_photo_with_user_source),
        ("TEST 6: Invalid Source Connection", test_6_invalid_source_connection),
        ("TEST 7: Same Node Source Error", test_7_same_node_source),
        ("TEST 8: Voltage Change 5V to 12V", test_8_source_voltage_update_5v_to_12v),
        ("TEST 9: Current Polarity Reversal", test_9_current_direction_reversal),
        ("TEST 10: Zero Current / Empty Circuit", test_10_zero_current_circuit)
    ]

    passed = 0
    failed = 0

    print("==================================================")
    print("RUNNING SMARTBREADBOARD 3D POWER SOURCE & SOLVER TESTS")
    print("==================================================")

    for name, func in tests:
        try:
            func()
            print(f"[PASS] {name}")
            passed += 1
        except Exception as e:
            print(f"[FAIL] {name} - Error: {e}")
            import traceback
            traceback.print_exc()
            failed += 1

    print("==================================================")
    print(f"RESULTS: {passed} Passed, {failed} Failed")
    print("==================================================")

    print("\n==================================================")
    print("RUNNING VALUE DETECTION ACCURACY & LIVE CAMERA UNITTESTS")
    print("==================================================")
    import unittest
    from test_value_detection import TestValueDetectionAccuracy
    from test_live_camera import TestLiveCameraTracking

    suite1 = unittest.TestLoader().loadTestsFromTestCase(TestValueDetectionAccuracy)
    suite2 = unittest.TestLoader().loadTestsFromTestCase(TestLiveCameraTracking)
    full_suite = unittest.TestSuite([suite1, suite2])

    runner = unittest.TextTestRunner(verbosity=2)
    val_res = runner.run(full_suite)

    if failed > 0 or not val_res.wasSuccessful():
        sys.exit(1)

if __name__ == "__main__":
    run_all()


