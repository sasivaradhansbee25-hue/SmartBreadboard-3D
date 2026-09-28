"""
backend/validation/__init__.py — Phase 23 Physical Validation & Reliability Engineering Module
"""

from .schema import (
    ValidationStatus,
    ARAlignmentStatus,
    DetectionVerificationState,
    ToleranceSpec,
    PhysicalComponent,
    PhysicalConnection,
    PowerSourceConfig,
    CameraEnvironment,
    PhysicalMeasurements,
    SoftwareResults,
    MetricComparison,
    ValidationCase
)

from .metrics import (
    calculate_detection_metrics,
    calculate_mapping_metrics,
    compare_netlists,
    calculate_electrical_error
)

from .comparator import (
    compare_physical_vs_software,
    evaluate_validation_case
)

from .failure_injection import (
    inject_removed_wire_fault,
    inject_shifted_terminal_fault,
    inject_removed_power_fault,
    inject_unsupported_component_fault,
    inject_ambiguous_placement_fault,
    inject_manual_value_change
)

from .report_generator import (
    generate_validation_summary_report,
    export_validation_suite_json
)

from .benchmarks import (
    create_standard_benchmark_suite,
    save_benchmark_cases_to_disk,
    load_benchmark_cases_from_disk
)

from .ground_truth_schema import (
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

from .physical_validation import (
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
