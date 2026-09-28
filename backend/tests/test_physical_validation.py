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
from validation.ground_truth_schema import (
    GroundTruthCircuit,
    GroundTruthComponent,
    GroundTruthWire,
    GroundTruthTopology,
    GroundTruthSimulationState,
    Orientation,
    TopologyPattern,
    create_single_resistor_scenario,
    create_resistor_led_series_scenario,
    create_resistor_led_parallel_scenario,
    create_voltage_divider_scenario,
    create_jumper_wire_node_merge_scenario,
    get_all_standard_scenarios
)
from validation.physical_validation import (
    calculate_component_detection_accuracy,
    calculate_component_classification_accuracy,
    calculate_terminal_detection_accuracy,
    calculate_hole_mapping_accuracy,
    calculate_electrical_node_accuracy,
    calculate_wire_detection_accuracy,
    calculate_topology_accuracy,
    calculate_simulation_consistency,
    calculate_ar_grounding_consistency,
    validate_physical_circuit
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

    # 10. Ground truth schema completeness & integrity
    def test_10_ground_truth_schema_support(self):
        scenario = create_single_resistor_scenario()
        # Verify supported fields
        comp = scenario.components[0]
        self.assertEqual(comp.id, "R1")
        self.assertEqual(comp.type, "resistor")
        self.assertEqual(comp.terminal_holes, ["A10", "A15"])
        self.assertEqual(comp.orientation, Orientation.HORIZONTAL.value)
        self.assertIn("terminal_1", comp.electrical_nodes)
        self.assertIsNone(comp.measured_value)  # Never fabricated

        # Verify wire support
        wire_scenario = create_jumper_wire_node_merge_scenario()
        wire = wire_scenario.jumper_wires[0]
        self.assertEqual(wire.id, "W1")
        self.assertEqual(wire.start_hole, "E15")
        self.assertEqual(wire.end_hole, "E25")

        # Verify topology & simulation state
        self.assertEqual(scenario.topology.pattern, TopologyPattern.SINGLE_COMPONENT.value)
        self.assertEqual(scenario.simulation_state.expected_status, "SOLVED")
        self.assertEqual(scenario.simulation_state.expected_node_voltages["NODE_VCC"], 5.0)

        # Serialization round-trip
        data = scenario.to_dict()
        reconstructed = GroundTruthCircuit.from_dict(data)
        self.assertEqual(reconstructed.circuit_id, scenario.circuit_id)
        self.assertEqual(len(reconstructed.components), 1)

    # 11. Test Scenario 1: Single resistor
    def test_11_scenario_1_single_resistor(self):
        gt = create_single_resistor_scenario()
        pipeline_data = {
            "components": [{"id": "R1", "type": "resistor", "start_hole": "A10", "end_hole": "A15", "status": "VERIFIED"}],
            "hole_mapping": {"R1": ["A10", "A15"]},
            "topology": {
                "pattern": "SINGLE_COMPONENT",
                "nodes": [
                    {"id": "N1", "connected_pins": ["R1.1", "POWER_PLUS"]},
                    {"id": "N2", "connected_pins": ["R1.2", "POWER_MINUS"]}
                ]
            },
            "simulation_result": {
                "status": "SOLVED",
                "node_voltages": {"NODE_VCC": 5.0, "NODE_GND": 0.0},
                "branch_currents": {"R1": 5.0}
            },
            "ar_grounding_state": {"tracking": "ACTIVE", "registration": "ACTIVE"}
        }

        report = validate_physical_circuit(gt, pipeline_data, is_actual_hardware_test=False)
        self.assertEqual(report["circuit_id"], "SCENARIO-1-SINGLE-RESISTOR")
        self.assertEqual(report["accuracy_percentage"], 100.0)
        self.assertEqual(len(report["missing"]), 0)
        self.assertEqual(len(report["failure_reason"]), 0)

        # Missing component failure test
        report_fail = validate_physical_circuit(gt, {"components": []})
        self.assertIn("R1", report_fail["missing"])
        self.assertLess(report_fail["accuracy_percentage"], 50.0)

    # 12. Test Scenario 2: Resistor + LED series
    def test_12_scenario_2_resistor_led_series(self):
        gt = create_resistor_led_series_scenario()
        pipeline_data = {
            "components": [
                {"id": "R1", "type": "resistor", "start_hole": "A10", "end_hole": "A15", "status": "VERIFIED"},
                {"id": "LED1", "type": "led", "start_hole": "B15", "end_hole": "B20", "status": "VERIFIED"}
            ],
            "hole_mapping": {"R1": ["A10", "A15"], "LED1": ["B15", "B20"]},
            "topology": {
                "pattern": "SERIES",
                "series_pairs": [["LED1", "R1"]],
                "parallel_pairs": [],
                "nodes": [
                    {"id": "NODE_VCC", "connected_pins": ["R1.1"]},
                    {"id": "NODE_MID", "connected_pins": ["R1.2", "LED1.anode"]},
                    {"id": "NODE_GND", "connected_pins": ["LED1.cathode"]}
                ]
            },
            "simulation_result": {
                "status": "SOLVED",
                "node_voltages": {"NODE_VCC": 5.0, "NODE_MID": 2.1, "NODE_GND": 0.0},
                "branch_currents": {"R1": 13.18, "LED1": 13.18}
            },
            "ar_grounding_state": {"tracking": "ACTIVE", "registration": "ACTIVE"}
        }

        report = validate_physical_circuit(gt, pipeline_data)
        self.assertEqual(report["accuracy_percentage"], 100.0)
        self.assertEqual(report["metrics_breakdown"]["topology"]["accuracy_percentage"], 100.0)
        self.assertEqual(report["metrics_breakdown"]["simulation_consistency"]["accuracy_percentage"], 100.0)

    # 13. Test Scenario 3: Resistor + LED parallel
    def test_13_scenario_3_resistor_led_parallel(self):
        gt = create_resistor_led_parallel_scenario()
        pipeline_data = {
            "components": [
                {"id": "R1", "type": "resistor", "start_hole": "A10", "end_hole": "A15", "status": "VERIFIED"},
                {"id": "LED1", "type": "led", "start_hole": "C10", "end_hole": "C15", "status": "VERIFIED"}
            ],
            "hole_mapping": {"R1": ["A10", "A15"], "LED1": ["C10", "C15"]},
            "topology": {
                "pattern": "PARALLEL",
                "series_pairs": [],
                "parallel_pairs": [["LED1", "R1"]],
                "nodes": [
                    {"id": "NODE_VCC", "connected_pins": ["R1.1", "LED1.anode"]},
                    {"id": "NODE_GND", "connected_pins": ["R1.2", "LED1.cathode"]}
                ]
            },
            "simulation_result": {
                "status": "SOLVED",
                "node_voltages": {"NODE_VCC": 5.0, "NODE_GND": 0.0},
                "branch_currents": {"R1": 5.0, "LED1": 20.0}
            },
            "ar_grounding_state": {"tracking": "ACTIVE", "registration": "ACTIVE"}
        }

        report = validate_physical_circuit(gt, pipeline_data)
        self.assertEqual(report["accuracy_percentage"], 100.0)
        self.assertEqual(report["metrics_breakdown"]["topology"]["accuracy_percentage"], 100.0)

    # 14. Test Scenario 4: Voltage divider
    def test_14_scenario_4_voltage_divider(self):
        gt = create_voltage_divider_scenario()
        pipeline_data = {
            "components": [
                {"id": "R1", "type": "resistor", "start_hole": "A10", "end_hole": "A15", "status": "VERIFIED"},
                {"id": "R2", "type": "resistor", "start_hole": "B15", "end_hole": "B20", "status": "VERIFIED"}
            ],
            "hole_mapping": {"R1": ["A10", "A15"], "R2": ["B15", "B20"]},
            "topology": {
                "pattern": "VOLTAGE_DIVIDER",
                "series_pairs": [["R1", "R2"]],
                "nodes": [
                    {"id": "NODE_VCC", "connected_pins": ["R1.1"]},
                    {"id": "NODE_MID", "connected_pins": ["R1.2", "R2.1"]},
                    {"id": "NODE_GND", "connected_pins": ["R2.2"]}
                ]
            },
            "simulation_result": {
                "status": "SOLVED",
                "node_voltages": {"NODE_VCC": 5.0, "NODE_MID": 2.5, "NODE_GND": 0.0},
                "branch_currents": {"R1": 0.25, "R2": 0.25}
            },
            "ar_grounding_state": {"tracking": "ACTIVE", "registration": "ACTIVE"}
        }

        report = validate_physical_circuit(gt, pipeline_data)
        self.assertEqual(report["accuracy_percentage"], 100.0)
        self.assertEqual(report["metrics_breakdown"]["simulation_consistency"]["accuracy_percentage"], 100.0)

    # 15. Test Scenario 5: Jumper wire node merge
    def test_15_scenario_5_jumper_wire_node_merge(self):
        gt = create_jumper_wire_node_merge_scenario()
        pipeline_data = {
            "components": [
                {"id": "R1", "type": "resistor", "start_hole": "A10", "end_hole": "A15", "status": "VERIFIED"},
                {"id": "R2", "type": "resistor", "start_hole": "A25", "end_hole": "A30", "status": "VERIFIED"}
            ],
            "jumper_wires": [
                {"id": "W1", "start_hole": "E15", "end_hole": "E25", "status": "VERIFIED"}
            ],
            "hole_mapping": {"R1": ["A10", "A15"], "R2": ["A25", "A30"]},
            "topology": {
                "pattern": "NODE_MERGE",
                "series_pairs": [["R1", "R2"]],
                "nodes": [
                    {"id": "NODE_VCC", "connected_pins": ["R1.1"]},
                    {"id": "NODE_MERGED", "connected_pins": ["R1.2", "W1.start", "W1.end", "R2.1"]},
                    {"id": "NODE_GND", "connected_pins": ["R2.2"]}
                ]
            },
            "simulation_result": {
                "status": "SOLVED",
                "node_voltages": {"NODE_VCC": 5.0, "NODE_MERGED": 2.5, "NODE_GND": 0.0},
                "branch_currents": {"R1": 11.36, "R2": 11.36, "W1": 11.36}
            },
            "ar_grounding_state": {"tracking": "ACTIVE", "registration": "ACTIVE"}
        }

        report = validate_physical_circuit(gt, pipeline_data)
        self.assertEqual(report["accuracy_percentage"], 100.0)
        self.assertEqual(report["metrics_breakdown"]["wire_detection"]["accuracy_percentage"], 100.0)
        self.assertEqual(report["metrics_breakdown"]["electrical_node"]["accuracy_percentage"], 100.0)

    # 16. Verify all 9 separate accuracy metrics individually
    def test_16_nine_separate_metrics_calculation(self):
        gt = create_resistor_led_series_scenario()
        sample_pipeline = {
            "components": [
                {"id": "R1", "type": "resistor", "start_hole": "A10", "end_hole": "A15", "status": "VERIFIED"},
                {"id": "LED1", "type": "led", "start_hole": "B15", "end_hole": "B20", "status": "VERIFIED"}
            ],
            "hole_mapping": {"R1": ["A10", "A15"], "LED1": ["B15", "B20"]},
            "topology": {
                "pattern": "SERIES",
                "series_pairs": [["R1", "LED1"]],
                "nodes": [
                    {"id": "NODE_VCC", "connected_pins": ["R1.1"]},
                    {"id": "NODE_MID", "connected_pins": ["R1.2", "LED1.anode"]},
                    {"id": "NODE_GND", "connected_pins": ["LED1.cathode"]}
                ]
            },
            "simulation_result": {
                "status": "SOLVED",
                "node_voltages": {"NODE_VCC": 5.0, "NODE_MID": 2.1, "NODE_GND": 0.0},
                "branch_currents": {"R1": 13.18, "LED1": 13.18}
            },
            "ar_grounding_state": {"tracking": "ACTIVE", "registration": "ACTIVE"}
        }

        m1 = calculate_component_detection_accuracy(gt, sample_pipeline)
        m2 = calculate_component_classification_accuracy(gt, sample_pipeline)
        m3 = calculate_terminal_detection_accuracy(gt, sample_pipeline)
        m4 = calculate_hole_mapping_accuracy(gt, sample_pipeline)
        m5 = calculate_electrical_node_accuracy(gt, sample_pipeline)
        m6 = calculate_wire_detection_accuracy(gt, sample_pipeline)
        m7 = calculate_topology_accuracy(gt, sample_pipeline)
        m8 = calculate_simulation_consistency(gt, sample_pipeline)
        m9 = calculate_ar_grounding_consistency(gt, sample_pipeline)

        for m in [m1, m2, m3, m4, m5, m6, m7, m8, m9]:
            self.assertIn("accuracy_percentage", m)
            self.assertIn("matched", m)
            self.assertIn("incorrect", m)
            self.assertIn("missing", m)
            self.assertIn("extra_detections", m)
            self.assertEqual(m["accuracy_percentage"], 100.0)

    # 17. Unknown and ambiguous marking tests
    def test_17_unknown_and_ambiguous_marking(self):
        gt = create_single_resistor_scenario()
        ambiguous_pipeline = {
            "components": [
                {"id": "R1", "type": "UNKNOWN", "start_hole": "AMBIGUOUS", "end_hole": "A15", "status": "AMBIGUOUS"}
            ],
            "hole_mapping": {"R1": ["AMBIGUOUS", "A15"]},
            "topology": {"pattern": "AMBIGUOUS", "nodes": []},
            "simulation_result": {"status": "ERROR"},
            "ar_grounding_state": {"tracking": "UNKNOWN"}
        }

        report = validate_physical_circuit(gt, ambiguous_pipeline)
        self.assertTrue(any("ambiguous" in r.lower() or "unknown" in r.lower() for r in report["failure_reason"]))
        # Never fabricate missing measurements: simulation accuracy must be 0 when error
        self.assertEqual(report["metrics_breakdown"]["simulation_consistency"]["accuracy_percentage"], 0.0)

    # 18. Validation report structure verification
    def test_18_validation_report_structure(self):
        gt = create_single_resistor_scenario()
        report = validate_physical_circuit(gt, {})
        
        required_keys = [
            "expected", "detected", "matched", "incorrect",
            "missing", "extra_detections", "accuracy_percentage", "failure_reason"
        ]
        for key in required_keys:
            self.assertIn(key, report)

        self.assertIn("metrics_breakdown", report)
        self.assertEqual(len(report["metrics_breakdown"]), 9)

    # 19. Hardware validation status confirmation gate
    def test_19_physical_validation_status_gate(self):
        gt_synthetic = create_single_resistor_scenario()
        # Synthetic run without real hardware test
        rep1 = validate_physical_circuit(gt_synthetic, {}, is_actual_hardware_test=False)
        self.assertEqual(rep1["physical_validation_status"], "NOT PERFORMED (SYNTHETIC BENCHMARK)")

        # Real hardware test flag simulation
        gt_real = create_single_resistor_scenario()
        gt_real.is_physical_test = True
        pipeline_perfect = {
            "components": [{"id": "R1", "type": "resistor", "start_hole": "A10", "end_hole": "A15", "status": "VERIFIED"}],
            "hole_mapping": {"R1": ["A10", "A15"]},
            "topology": {
                "pattern": "SINGLE_COMPONENT",
                "nodes": [
                    {"id": "N1", "connected_pins": ["R1.1", "POWER_PLUS"]},
                    {"id": "N2", "connected_pins": ["R1.2", "POWER_MINUS"]}
                ]
            },
            "simulation_result": {
                "status": "SOLVED",
                "node_voltages": {"NODE_VCC": 5.0, "NODE_GND": 0.0},
                "branch_currents": {"R1": 5.0}
            },
            "ar_grounding_state": {"tracking": "ACTIVE", "registration": "ACTIVE"}
        }
        rep2 = validate_physical_circuit(gt_real, pipeline_perfect, is_actual_hardware_test=True)
        self.assertEqual(rep2["physical_validation_status"], "PERFORMED_VERIFIED")


if __name__ == "__main__":
    unittest.main()
