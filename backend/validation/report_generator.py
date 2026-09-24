"""
backend/validation/report_generator.py — Comprehensive Physical Validation Report Generator (Phase 23)

Generates structured Markdown and JSON audit reports:
- Test Case Summaries
- Component Detection Metrics (Precision / Recall)
- Terminal & Hole Mapping Accuracy
- Netlist Topological Matching
- MNA vs Multimeter Electrical Comparison
- AR Overlay Alignment Status
- Grounded AI Response Verification
- Controlled Failure Injection Results
- Clear separation of:
  * SOFTWARE TESTS
  * PHYSICAL TESTS
  * SIMULATION TESTS
  * MEASURED HARDWARE RESULTS
"""

import json
from typing import Dict, Any, List, Optional
from .schema import ValidationCase, ValidationStatus


def generate_validation_summary_report(cases: List[ValidationCase]) -> str:
    """
    Builds a markdown validation report covering all evaluated validation cases.
    """
    total_cases = len(cases)
    tested_cases = [c for c in cases if c.status != ValidationStatus.NOT_TESTED]
    passed_cases = [c for c in cases if c.status == ValidationStatus.PASS]
    failed_cases = [c for c in cases if c.status == ValidationStatus.FAIL]
    not_tested = [c for c in cases if c.status == ValidationStatus.NOT_TESTED]

    lines = []
    lines.append("# SmartBreadboard 3D — Physical Validation & Reliability Report")
    lines.append("## Phase 23 Hardware Benchmarking Audit\n")
    lines.append("> **IMPORTANT NOTICE**:")
    if not tested_cases:
        lines.append("> **PHYSICAL VALIDATION STATUS: NOT PERFORMED**")
        lines.append("> Software validation and benchmark schemas are fully implemented. Physical hardware benchmarks remain queued as `NOT_TESTED` until physical bench trials are executed.\n")
    else:
        status_str = "COMPLETED" if len(tested_cases) == total_cases else "PARTIALLY PERFORMED"
        lines.append(f"> **PHYSICAL VALIDATION STATUS: {status_str}**\n")

    lines.append("### 1. Test Matrix Summary")
    lines.append("| Case ID | Circuit Name | Camera Angle | Lighting | Measured V/I | Validation Status |")
    lines.append("| :--- | :--- | :--- | :--- | :--- | :--- |")
    for c in cases:
        meas_str = "None"
        if c.physical_measurements.v_supply_measured_v or c.physical_measurements.i_circuit_measured_ma:
            v = f"{c.physical_measurements.v_supply_measured_v:.2f}V" if c.physical_measurements.v_supply_measured_v else ""
            i = f"{c.physical_measurements.i_circuit_measured_ma:.2f}mA" if c.physical_measurements.i_circuit_measured_ma else ""
            meas_str = f"{v} / {i}".strip(" / ")

        lines.append(f"| **{c.case_id}** | {c.circuit_name} | {c.camera.viewing_angle} | {c.camera.lighting_condition} | {meas_str} | `{c.status.value}` |")

    lines.append("\n### 2. Metric Breakdown & Accuracy")
    lines.append("- **Total Benchmark Cases Defined**: " + str(total_cases))
    lines.append(f"- **Physical Tests Executed**: {len(tested_cases)}")
    lines.append(f"- **Tests Still NOT_TESTED**: {len(not_tested)}")
    lines.append(f"- **Passed Physical Tests**: {len(passed_cases)}")
    lines.append(f"- **Failed Physical Tests**: {len(failed_cases)}")

    lines.append("\n### 3. Tier-by-Tier Evaluation Matrix")
    lines.append("The validation framework separates measurements into independent verification tiers:")
    lines.append("1. **Software Test**: Unit & integration tests validating deterministic algorithms.")
    lines.append("2. **Simulation Test**: Mathematical reference solver predictions (MNA).")
    lines.append("3. **Measured Hardware Result**: Calibrated digital multimeter readings.")
    lines.append("4. **Physical Test**: Optical vision capture under controlled laboratory lighting.")

    lines.append("\n### 4. Case-by-Case Diagnostic Analysis")
    for c in cases:
        lines.append(f"#### {c.case_id}: {c.circuit_name}")
        lines.append(f"- **Description**: {c.description}")
        lines.append(f"- **Status**: `{c.status.value}`")
        lines.append(f"- **Detection**: TP={c.comparison.detection_tp}, FP={c.comparison.detection_fp}, FN={c.comparison.detection_fn} (Precision: {c.comparison.detection_precision}, Recall: {c.comparison.detection_recall})")
        lines.append(f"- **Mapping**: Terminal Accuracy: {c.comparison.terminal_mapping_accuracy}, Hole Accuracy: {c.comparison.hole_mapping_accuracy}")
        lines.append(f"- **Netlist Topology Match**: {'✓ MATCH' if c.comparison.netlist_match else '✗ MISMATCH / NOT EVALUATED'}")
        
        v_err = f"{c.comparison.v_error_abs_v} V ({c.comparison.v_error_pct}%)" if c.comparison.v_error_abs_v is not None else "NOT MEASURED"
        i_err = f"{c.comparison.i_error_abs_ma} mA ({c.comparison.i_error_pct}%)" if c.comparison.i_error_abs_ma is not None else "NOT MEASURED"
        lines.append(f"- **Electrical Errors**: Voltage Error: {v_err}, Current Error: {i_err}")
        lines.append(f"- **AR Overlay Status**: `{c.software_results.ar_alignment_status.value}`")
        lines.append(f"- **Grounded AI Verification**: {'✓ GROUNDED' if c.software_results.ai_grounding_verified else 'NOT EVALUATED'}")
        
        if c.comparison.discrepancies:
            lines.append("- **Discrepancies / Failure Notes**:")
            for d in c.comparison.discrepancies:
                lines.append(f"  * ⚠️ {d}")
        lines.append("")

    lines.append("### 5. Known Limitations & Recommendations")
    lines.append("1. **Physical Lighting Sensitivity**: High-glare reflections on glossy breadboard plastic can degrade hole segmentation.")
    lines.append("2. **Jumper Wire Shadowing**: Thick bundles of jumper wires can partially occlude tie-points.")
    lines.append("3. **Contact Resistance**: Worn breadboard leaf springs can introduce 0.1–0.5 Ω contact resistance affecting low-impedance MNA matching.")
    lines.append("4. **Zero-Division Protection**: Percentage errors are marked `NOT_APPLICABLE` when simulated baseline values are near zero.\n")

    return "\n".join(lines)


def export_validation_suite_json(cases: List[ValidationCase]) -> str:
    """
    Serializes full validation suite to JSON.
    """
    return json.dumps([c.to_dict() for c in cases], indent=2)
