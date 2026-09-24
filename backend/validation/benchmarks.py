"""
backend/validation/benchmarks.py — Phase 23 Standard Physical Validation Test Matrix

Defines the standard 10 hardware benchmark validation cases:
- PHYS-001: 5V Source + 220Ω Resistor + Red LED + GND
- PHYS-002: 5V Source + Two Resistors (Voltage Divider)
- PHYS-003: 5V Source + Series Resistor Network (3 Resistors)
- PHYS-004: 5V Source + Parallel Resistor Network (2 Resistors)
- PHYS-005: 5V Source + Resistor + LED + Jumper Wire Bridge
- PHYS-006: Failure Injection: Missing Jumper Wire (Open Circuit)
- PHYS-007: Failure Injection: Disconnected DC Power Supply
- PHYS-008: Robustness: Ambiguous Camera View (Diagonal Occlusion)
- PHYS-009: Robustness: 45° Angled Camera Perspective
- PHYS-010: Robustness: Low-Light / Variable Lighting Condition

All benchmarks default strictly to status = NOT_TESTED.
"""

import os
import json
from typing import List, Optional
from .schema import (
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

RESULTS_DIR = os.path.join(os.path.dirname(__file__), "results")


def create_standard_benchmark_suite() -> List[ValidationCase]:
    """
    Constructs the canonical 10 physical benchmark cases.
    """
    cases = [
        # PHYS-001: 5V + Resistor + LED
        ValidationCase(
            case_id="PHYS-001",
            circuit_name="5V_Resistor_LED",
            description="5V DC source feeding a 220Ω current-limiting resistor and forward-biased Red LED to GND.",
            status=ValidationStatus.NOT_TESTED,
            components=[
                PhysicalComponent(id="R1", type="resistor", nominal_value=220.0, unit="Ω", start_hole="E10", end_hole="E15", tolerance_percent=5.0),
                PhysicalComponent(id="LED1", type="led", nominal_value=None, unit="", start_hole="E15", end_hole="E20", tolerance_percent=10.0)
            ],
            connections=[],
            power_source=PowerSourceConfig(type="DC", nominal_voltage_v=5.0, positive_hole="E10", ground_hole="E20"),
            camera=CameraEnvironment(camera_device="Webcam 1080p", distance_cm=25.0, viewing_angle="front", lighting_condition="indoor_bench_led"),
            tolerance_spec=ToleranceSpec(resistor_tolerance_percent=5.0, power_supply_tolerance_percent=2.0)
        ),

        # PHYS-002: 5V + Two Resistors (Voltage Divider)
        ValidationCase(
            case_id="PHYS-002",
            circuit_name="5V_Voltage_Divider",
            description="5V DC source connected across two 1000Ω resistors in series (midpoint voltage = 2.5V).",
            status=ValidationStatus.NOT_TESTED,
            components=[
                PhysicalComponent(id="R1", type="resistor", nominal_value=1000.0, unit="Ω", start_hole="E10", end_hole="E15", tolerance_percent=5.0),
                PhysicalComponent(id="R2", type="resistor", nominal_value=1000.0, unit="Ω", start_hole="E15", end_hole="E20", tolerance_percent=5.0)
            ],
            connections=[],
            power_source=PowerSourceConfig(type="DC", nominal_voltage_v=5.0, positive_hole="E10", ground_hole="E20"),
            camera=CameraEnvironment(camera_device="Webcam 1080p", distance_cm=25.0, viewing_angle="front", lighting_condition="indoor_bench_led")
        ),

        # PHYS-003: Series Resistor Network
        ValidationCase(
            case_id="PHYS-003",
            circuit_name="Series_Resistor_Network",
            description="5V DC source driving 3 series resistors: R1(220Ω), R2(330Ω), R3(470Ω).",
            status=ValidationStatus.NOT_TESTED,
            components=[
                PhysicalComponent(id="R1", type="resistor", nominal_value=220.0, unit="Ω", start_hole="E10", end_hole="E15", tolerance_percent=5.0),
                PhysicalComponent(id="R2", type="resistor", nominal_value=330.0, unit="Ω", start_hole="E15", end_hole="E20", tolerance_percent=5.0),
                PhysicalComponent(id="R3", type="resistor", nominal_value=470.0, unit="Ω", start_hole="E20", end_hole="E25", tolerance_percent=5.0)
            ],
            connections=[],
            power_source=PowerSourceConfig(type="DC", nominal_voltage_v=5.0, positive_hole="E10", ground_hole="E25"),
            camera=CameraEnvironment(camera_device="Webcam 1080p", distance_cm=25.0, viewing_angle="front", lighting_condition="indoor_bench_led")
        ),

        # PHYS-004: Parallel Resistor Network
        ValidationCase(
            case_id="PHYS-004",
            circuit_name="Parallel_Resistor_Network",
            description="5V DC source connected across two parallel 1000Ω resistors (equivalent R = 500Ω).",
            status=ValidationStatus.NOT_TESTED,
            components=[
                PhysicalComponent(id="R1", type="resistor", nominal_value=1000.0, unit="Ω", start_hole="E10", end_hole="E20", tolerance_percent=5.0),
                PhysicalComponent(id="R2", type="resistor", nominal_value=1000.0, unit="Ω", start_hole="E10", end_hole="E20", tolerance_percent=5.0)
            ],
            connections=[],
            power_source=PowerSourceConfig(type="DC", nominal_voltage_v=5.0, positive_hole="E10", ground_hole="E20"),
            camera=CameraEnvironment(camera_device="Webcam 1080p", distance_cm=25.0, viewing_angle="front", lighting_condition="indoor_bench_led")
        ),

        # PHYS-005: Resistor + LED + Jumper Wire Bridge
        ValidationCase(
            case_id="PHYS-005",
            circuit_name="Resistor_LED_Jumper_Bridge",
            description="5V source feeding R1(220Ω), bridging across breadboard halves with Jumper W1, then LED1 to GND.",
            status=ValidationStatus.NOT_TESTED,
            components=[
                PhysicalComponent(id="R1", type="resistor", nominal_value=220.0, unit="Ω", start_hole="E10", end_hole="E15", tolerance_percent=5.0),
                PhysicalComponent(id="LED1", type="led", nominal_value=None, unit="", start_hole="F15", end_hole="F20", tolerance_percent=10.0)
            ],
            connections=[
                PhysicalConnection(id="W1", start_hole="E15", end_hole="F15", color="blue")
            ],
            power_source=PowerSourceConfig(type="DC", nominal_voltage_v=5.0, positive_hole="E10", ground_hole="F20"),
            camera=CameraEnvironment(camera_device="Webcam 1080p", distance_cm=25.0, viewing_angle="front", lighting_condition="indoor_bench_led")
        ),

        # PHYS-006: Missing Wire (Failure Injection)
        ValidationCase(
            case_id="PHYS-006",
            circuit_name="Missing_Jumper_Wire_Fault",
            description="Controlled fault: Jumper wire between E15 and F15 is physically disconnected, creating an open circuit.",
            status=ValidationStatus.NOT_TESTED,
            components=[
                PhysicalComponent(id="R1", type="resistor", nominal_value=220.0, unit="Ω", start_hole="E10", end_hole="E15", tolerance_percent=5.0),
                PhysicalComponent(id="LED1", type="led", nominal_value=None, unit="", start_hole="F15", end_hole="F20", tolerance_percent=10.0)
            ],
            connections=[], # Missing W1
            power_source=PowerSourceConfig(type="DC", nominal_voltage_v=5.0, positive_hole="E10", ground_hole="F20"),
            camera=CameraEnvironment(camera_device="Webcam 1080p", distance_cm=25.0, viewing_angle="front", lighting_condition="indoor_bench_led")
        ),

        # PHYS-007: Missing Power (Failure Injection)
        ValidationCase(
            case_id="PHYS-007",
            circuit_name="Missing_Power_Supply_Fault",
            description="Controlled fault: DC power supply disconnected (0V applied). MNA simulation should report unpowered.",
            status=ValidationStatus.NOT_TESTED,
            components=[
                PhysicalComponent(id="R1", type="resistor", nominal_value=220.0, unit="Ω", start_hole="E10", end_hole="E15", tolerance_percent=5.0),
                PhysicalComponent(id="LED1", type="led", nominal_value=None, unit="", start_hole="E15", end_hole="E20", tolerance_percent=10.0)
            ],
            connections=[],
            power_source=PowerSourceConfig(type="DC", nominal_voltage_v=0.0, measured_voltage_v=0.0, positive_hole="", ground_hole=""),
            camera=CameraEnvironment(camera_device="Webcam 1080p", distance_cm=25.0, viewing_angle="front", lighting_condition="indoor_bench_led")
        ),

        # PHYS-008: Ambiguous Camera View
        ValidationCase(
            case_id="PHYS-008",
            circuit_name="Ambiguous_Perspective_View",
            description="Camera positioned at a steep shallow angle causing partial occlusion of resistor terminal hole.",
            status=ValidationStatus.NOT_TESTED,
            components=[
                PhysicalComponent(id="R1", type="resistor", nominal_value=220.0, unit="Ω", start_hole="E10", end_hole="AMBIGUOUS", tolerance_percent=5.0)
            ],
            connections=[],
            power_source=PowerSourceConfig(type="DC", nominal_voltage_v=5.0, positive_hole="E10", ground_hole="E15"),
            camera=CameraEnvironment(camera_device="Webcam 1080p", distance_cm=15.0, viewing_angle="slight_left", lighting_condition="indoor_bench_led")
        ),

        # PHYS-009: 45° Camera Angle
        ValidationCase(
            case_id="PHYS-009",
            circuit_name="Angled_Perspective_45Deg",
            description="Breadboard viewed from 45° top-right perspective to evaluate homography transformation robustness.",
            status=ValidationStatus.NOT_TESTED,
            components=[
                PhysicalComponent(id="R1", type="resistor", nominal_value=220.0, unit="Ω", start_hole="E10", end_hole="E15", tolerance_percent=5.0),
                PhysicalComponent(id="LED1", type="led", nominal_value=None, unit="", start_hole="E15", end_hole="E20", tolerance_percent=10.0)
            ],
            connections=[],
            power_source=PowerSourceConfig(type="DC", nominal_voltage_v=5.0, positive_hole="E10", ground_hole="E20"),
            camera=CameraEnvironment(camera_device="Webcam 1080p", distance_cm=30.0, viewing_angle="slight_top", lighting_condition="indoor_bench_led")
        ),

        # PHYS-010: Variable Lighting
        ValidationCase(
            case_id="PHYS-010",
            circuit_name="Variable_Lighting_Shadow",
            description="Non-uniform bench lighting with casting shadows to test contrast normalization and thresholding.",
            status=ValidationStatus.NOT_TESTED,
            components=[
                PhysicalComponent(id="R1", type="resistor", nominal_value=220.0, unit="Ω", start_hole="E10", end_hole="E15", tolerance_percent=5.0),
                PhysicalComponent(id="LED1", type="led", nominal_value=None, unit="", start_hole="E15", end_hole="E20", tolerance_percent=10.0)
            ],
            connections=[],
            power_source=PowerSourceConfig(type="DC", nominal_voltage_v=5.0, positive_hole="E10", ground_hole="E20"),
            camera=CameraEnvironment(camera_device="Webcam 1080p", distance_cm=25.0, viewing_angle="front", lighting_condition="shadow")
        )
    ]
    return cases


def save_benchmark_cases_to_disk(cases: List[ValidationCase], results_dir: Optional[str] = None):
    """
    Saves individual validation records (PHYS-001.json ... PHYS-010.json) to disk.
    """
    target_dir = results_dir or RESULTS_DIR
    os.makedirs(target_dir, exist_ok=True)
    for c in cases:
        file_path = os.path.join(target_dir, f"{c.case_id}.json")
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(c.to_dict(), f, indent=2)


def load_benchmark_cases_from_disk(results_dir: Optional[str] = None) -> List[ValidationCase]:
    """
    Loads all benchmark JSON files from disk.
    """
    target_dir = results_dir or RESULTS_DIR
    if not os.path.exists(target_dir):
        return create_standard_benchmark_suite()

    cases = []
    for fn in sorted(os.listdir(target_dir)):
        if fn.startswith("PHYS-") and fn.endswith(".json"):
            fp = os.path.join(target_dir, fn)
            with open(fp, "r", encoding="utf-8") as f:
                data = json.load(f)
                cases.append(ValidationCase.from_dict(data))
    return cases if cases else create_standard_benchmark_suite()
