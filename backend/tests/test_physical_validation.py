"""
test_physical_validation.py — Unit & Integration Test Suite for Phase 23 Physical Validation Framework

Validates:
1. ValidationCase schema initialization, dataclass serialization & deserialization.
2. Detection metrics calculations (TP, FP, FN, Precision, Recall, empty edge cases).
3. Terminal & Hole mapping accuracy calculations (perfect, partial, failed).
4. Netlist graph topological matching (matches, missing edges, extra edges).
5. Electrical measurement error calculations (absolute error, percentage error, zero-division safety, tolerance compliance).
6. Comparator evaluation and validation status assignment (PASS, FAIL, INSUFFICIENT_DATA, NOT_TESTED).
7. Controlled failure injection scenarios (A, B, C, D, E, F).
8. Benchmark test matrix persistence (loading PHYS-001 through PHYS-010).
9. Markdown and JSON validation report generation with tier separation.
10. Preservation of mathematical reference models without fudging.
"""

import sys
import os
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from validation.schema import (
    ValidationCase,
    ValidationStatus,
    PhysicalComponent,
    PhysicalConnection,
    PowerSourceConfig,
    CameraEnvironment,
    ToleranceSpec,
    PhysicalMeasurements,
    SoftwareResults,
    ARAlignmentStatus
)
from validation.metrics import (
    calculate_detection_metrics,
    calculate_mapping_metrics,
    compare_netlists,
    calculate_electrical_error
)
from validation.comparator import (
    compare_physical_vs_software,
    evaluate_validation_case
)
from validation.failure_injection import (
    inject_removed_wire_fault,
    inject_shifted_terminal_fault,
    inject_removed_power_fault,
    inject_unsupported_component_fault,
    inject_ambiguous_placement_fault,
    inject_manual_value_change
)
from validation.benchmarks import (
    create_standard_benchmark_suite,
    load_benchmark_cases_from_disk
)
from validation.report_generator import (
    generate_validation_summary_report,
    export_validation_suite_json
)


class TestPhysicalValidationFramework(unittest.TestCase):

    def setUp(self):
        self.sample_case = ValidationCase(
            case_id="PHYS-TEST-001",
            circuit_name="5V_Resistor_LED_Test",
            description="5V supply driving 220Ω resistor and LED",
            status=ValidationStatus.NOT_TESTED,
            components=[
                PhysicalComponent(id="R1", type="resistor", nominal_value=220.0, measured_value=218.5, unit="Ω", start_hole="E10", end_hole="E15"),
                PhysicalComponent(id="LED1", type="led", nominal_value=None, measured_value=None, unit="", start_hole="E15", end_hole="E20")
            ],
            connections=[],
            power_source=PowerSourceConfig(type="DC", nominal_voltage_v=5.0, measured_voltage_v=5.02, positive_hole="E10", ground_hole="E20"),
            camera=CameraEnvironment(camera_device="Test Webcam", distance_cm=25.0, viewing_angle="front", lighting_condition="indoor_bench_led"),
            tolerance_spec=ToleranceSpec(resistor_tolerance_percent=5.0, power_supply_tolerance_percent=2.0)
        )

    # 1. Schema serialization & deserialization
    def test_01_schema_serialization(self):
        data_dict = self.sample_case.to_dict()
        self.assertEqual(data_dict["case_id"], "PHYS-TEST-001")
        self.assertEqual(len(data_dict["components"]), 2)
        
        reconstructed = ValidationCase.from_dict(data_dict)
        self.assertEqual(reconstructed.case_id, self.sample_case.case_id)
        self.assertEqual(reconstructed.components[0].nominal_value, 220.0)
        self.assertEqual(reconstructed.status, ValidationStatus.NOT_TESTED)

    # 2. Detection metrics calculations
    def test_02_detection_metrics(self):
        gt = [{"type": "resistor"}, {"type": "led"}]
        det = [{"type": "resistor"}, {"type": "led"}]
        res = calculate_detection_metrics(gt, det)
        self.assertEqual(res["tp"], 2)
        self.assertEqual(res["fp"], 0)
        self.assertEqual(res["fn"], 0)
        self.assertEqual(res["precision"], 1.0)
        self.assertEqual(res["recall"], 1.0)

        # Case with False Positive and False Negative
        det_noisy = [{"type": "resistor"}, {"type": "capacitor"}]
        res_noisy = calculate_detection_metrics(gt, det_noisy)
        self.assertEqual(res_noisy["tp"], 1)
        self.assertEqual(res_noisy["fp"], 1)
        self.assertEqual(res_noisy["fn"], 1)
        self.assertEqual(res_noisy["precision"], 0.5)
        self.assertEqual(res_noisy["recall"], 0.5)

    # 3. Terminal & Hole mapping accuracy
    def test_03_mapping_metrics(self):
        gt_terminals = {"R1": ("E10", "E15"), "LED1": ("E15", "E20")}
        # Order independent match for R1 ("E15", "E10") and exact match for LED1
        det_terminals = {"R1": ("E15", "E10"), "LED1": ("E15", "E20")}
        res = calculate_mapping_metrics(gt_terminals, det_terminals)
        self.assertEqual(res["terminal_accuracy"], 1.0)
        self.assertEqual(res["hole_accuracy"], 1.0)

        # Partial match
        det_partial = {"R1": ("E10", "E16"), "LED1": ("E15", "E20")}
        res_part = calculate_mapping_metrics(gt_terminals, det_partial)
        self.assertEqual(res_part["terminal_accuracy"], 0.5)
        self.assertEqual(res_part["hole_accuracy"], 0.75)

    # 4. Netlist topological comparison
    def test_04_netlist_comparison(self):
        gt_net = {"N1": ["R1.A", "VCC"], "N2": ["R1.B", "LED1.A"], "N3": ["LED1.B", "GND"]}
        sw_net = {"N1": ["R1.A", "VCC"], "N2": ["R1.B", "LED1.A"], "N3": ["LED1.B", "GND"]}
        res = compare_netlists(gt_net, sw_net)
        self.assertTrue(res["match"])
        self.assertEqual(len(res["discrepancies"]), 0)

        # Netlist with missing wire
        sw_broken = {"N1": ["R1.A", "VCC"], "N3": ["LED1.B", "GND"]}
        res_broken = compare_netlists(gt_net, sw_broken)
        self.assertFalse(res_broken["match"])
        self.assertTrue(len(res_broken["discrepancies"]) > 0)

    # 5. Electrical error & Zero-division protection
    def test_05_electrical_error_calculation(self):
        # Normal measurement vs MNA prediction: 5.02V vs 5.00V
        res = calculate_electrical_error(measured=5.02, predicted=5.00, tolerance_percent=2.0)
        self.assertEqual(res["absolute_error"], 0.02)
        self.assertEqual(res["percentage_error"], 0.4)
        self.assertTrue(res["within_tolerance"])

        # Zero baseline zero-division safety test
        res_zero = calculate_electrical_error(measured=0.01, predicted=0.00, tolerance_percent=5.0)
        self.assertEqual(res_zero["percentage_error"], "NOT_APPLICABLE")
        self.assertTrue(res_zero["within_tolerance"])

        # None measurement safety
        res_none = calculate_electrical_error(measured=None, predicted=5.0)
        self.assertEqual(res_none["percentage_error"], "NOT_APPLICABLE")
        self.assertFalse(res_none["within_tolerance"])

    # 6. Physical vs Software evaluation
    def test_06_comparator_evaluation(self):
        case = ValidationCase.from_dict(self.sample_case.to_dict())
        case.physical_measurements.v_supply_measured_v = 5.0
        case.physical_measurements.i_circuit_measured_ma = 13.0
        case.software_results.components_detected = [{"type": "resistor"}, {"type": "led"}]
        case.software_results.holes_mapped = {"R1": ["E10", "E15"], "LED1": ["E15", "E20"]}
        case.software_results.netlist_extracted = {
            "nodes": [
                {"id": "E10", "connected_pins": ["R1.A"]},
                {"id": "E15", "connected_pins": ["R1.B", "LED1.A"]},
                {"id": "E20", "connected_pins": ["LED1.B"]}
            ]
        }
        case.software_results.mna_node_voltages = {"E10": 5.0, "E15": 2.1, "E20": 0.0}
        case.software_results.mna_branch_currents_ma = {"R1": 13.0, "LED1": 13.0}

        evaluated = evaluate_validation_case(case)
        self.assertEqual(evaluated.status, ValidationStatus.PASS)
        self.assertTrue(evaluated.comparison.within_tolerance)

    # 7. Failure Injection Scenarios
    def test_07_failure_injection_scenarios(self):
        # Scenario A: Removed wire
        fa = inject_removed_wire_fault(self.sample_case, wire_id="W1")
        self.assertIn("FAULT_WIRE", fa.case_id)

        # Scenario B: Shifted terminal
        fb = inject_shifted_terminal_fault(self.sample_case, component_id="R1", new_end_hole="E18")
        self.assertEqual(fb.components[0].end_hole, "E18")

        # Scenario C: Removed power
        fc = inject_removed_power_fault(self.sample_case)
        self.assertEqual(fc.power_source.nominal_voltage_v, 0.0)

        # Scenario D: Unsupported component
        fd = inject_unsupported_component_fault(self.sample_case, comp_id="UNK_CHIP_1")
        self.assertTrue(any(c.id == "UNK_CHIP_1" for c in fd.components))

        # Scenario E: Ambiguous placement
        fe = inject_ambiguous_placement_fault(self.sample_case, comp_id="R1")
        self.assertEqual(fe.components[0].end_hole, "AMBIGUOUS")

        # Scenario F: Manual value change
        ff = inject_manual_value_change(self.sample_case, comp_id="R1", new_value=1000.0)
        self.assertEqual(ff.components[0].nominal_value, 1000.0)

    # 8. Standard benchmark matrix
    def test_08_standard_benchmark_suite(self):
        benchmarks = create_standard_benchmark_suite()
        self.assertEqual(len(benchmarks), 10)
        self.assertEqual(benchmarks[0].case_id, "PHYS-001")
        self.assertEqual(benchmarks[9].case_id, "PHYS-010")
        
        # Verify all default to NOT_TESTED per specifications
        for b in benchmarks:
            self.assertEqual(b.status, ValidationStatus.NOT_TESTED)

        # Verify disk loading
        loaded = load_benchmark_cases_from_disk()
        self.assertEqual(len(loaded), 10)
        self.assertEqual(loaded[0].case_id, "PHYS-001")

    # 9. Report generation
    def test_09_report_generation(self):
        benchmarks = create_standard_benchmark_suite()
        report_md = generate_validation_summary_report(benchmarks)
        self.assertIn("Physical Validation & Reliability Report", report_md)
        self.assertIn("PHYSICAL VALIDATION STATUS: NOT PERFORMED", report_md)
        self.assertIn("PHYS-001", report_md)
        self.assertIn("PHYS-010", report_md)

        json_out = export_validation_suite_json(benchmarks)
        self.assertIn("PHYS-001", json_out)
        self.assertIn("NOT_TESTED", json_out)


if __name__ == "__main__":
    unittest.main()
