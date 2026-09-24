"""
backend/validation/schema.py — Physical Validation & Reliability Engineering Data Schema (Phase 23)

Defines data models and status enums for physical hardware benchmarking, multimeter measurements,
camera environment telemetry, tolerance specs, and software vs physical comparison records.
"""

from enum import Enum
from typing import Dict, Any, List, Optional, Union
from dataclasses import dataclass, field, asdict
from datetime import datetime


class ValidationStatus(str, Enum):
    NOT_TESTED = "NOT_TESTED"
    PASS = "PASS"
    FAIL = "FAIL"
    AMBIGUOUS = "AMBIGUOUS"
    MINOR_OFFSET = "MINOR_OFFSET"
    INSUFFICIENT_DATA = "INSUFFICIENT_DATA"


class ARAlignmentStatus(str, Enum):
    PASS = "PASS"
    MINOR_OFFSET = "MINOR_OFFSET"
    FAIL = "FAIL"
    NOT_MEASURED = "NOT_MEASURED"


class DetectionVerificationState(str, Enum):
    VERIFIED = "VERIFIED"
    UNKNOWN = "UNKNOWN"
    AMBIGUOUS = "AMBIGUOUS"
    REJECTED = "REJECTED"


@dataclass
class ToleranceSpec:
    """Component and instrument tolerance specifications."""
    resistor_tolerance_percent: float = 5.0      # Typical 5% metal/carbon film
    multimeter_voltage_accuracy_percent: float = 0.5  # Standard digital multimeter DCV
    multimeter_current_accuracy_percent: float = 1.0  # Standard digital multimeter DCA
    power_supply_tolerance_percent: float = 2.0  # Regulated bench supply tolerance
    breadboard_contact_resistance_ohms: float = 0.05  # Contact resistance estimate
    led_forward_voltage_spread_v: float = 0.2    # Standard forward voltage variation (e.g. 1.9 - 2.3V)


@dataclass
class PhysicalComponent:
    """Ground truth physical component placed on the breadboard."""
    id: str
    type: str                                    # resistor, led, wire, etc.
    nominal_value: Optional[float] = None        # e.g., 220.0
    measured_value: Optional[float] = None       # e.g., 218.4 (multimeter measured resistance)
    unit: str = "Ω"
    start_hole: str = ""                         # e.g., E10
    end_hole: str = ""                           # e.g., E15
    tolerance_percent: float = 5.0
    notes: str = ""


@dataclass
class PhysicalConnection:
    """Physical wire jumper connection."""
    id: str
    start_hole: str
    end_hole: str
    wire_type: str = "jumper"                   # solid_core, flexible, etc.
    color: str = "black"


@dataclass
class PowerSourceConfig:
    """Physical power supply configuration."""
    type: str = "DC"                            # DC, USB_5V, BATTERY_9V
    nominal_voltage_v: float = 5.0
    measured_voltage_v: Optional[float] = None   # Multimeter measured supply rail
    current_limit_ma: Optional[float] = 500.0
    positive_hole: str = "POWER_PLUS"            # or hole id like E1
    ground_hole: str = "POWER_MINUS"             # or hole id like E30


@dataclass
class CameraEnvironment:
    """Physical camera and lighting conditions under test."""
    camera_device: str = "Webcam / Phone Stream"
    resolution: str = "1920x1080"
    frame_rate_fps: float = 30.0
    distance_cm: float = 25.0
    viewing_angle: str = "front"                 # front, slight_left, slight_right, slight_top
    lighting_condition: str = "indoor_bench_led" # indoor_bench_led, daylight, dim, shadow
    breadboard_orientation: str = "horizontal"   # horizontal, vertical


@dataclass
class PhysicalMeasurements:
    """Hardware multimeter ground truth measurements."""
    v_supply_measured_v: Optional[float] = None
    v_resistor_measured_v: Optional[float] = None
    v_led_measured_v: Optional[float] = None
    i_circuit_measured_ma: Optional[float] = None
    r_total_measured_ohms: Optional[float] = None
    temperature_c: Optional[float] = 24.0


@dataclass
class SoftwareResults:
    """Outputs predicted by the software pipeline."""
    components_detected: List[Dict[str, Any]] = field(default_factory=list)
    holes_mapped: Dict[str, List[str]] = field(default_factory=dict)
    netlist_extracted: Dict[str, Any] = field(default_factory=dict)
    mna_node_voltages: Dict[str, float] = field(default_factory=dict)
    mna_branch_currents_ma: Dict[str, float] = field(default_factory=dict)
    mna_total_power_mw: float = 0.0
    ar_alignment_status: ARAlignmentStatus = ARAlignmentStatus.NOT_MEASURED
    ai_grounding_verified: bool = False
    ai_responses: List[Dict[str, str]] = field(default_factory=list)


@dataclass
class MetricComparison:
    """Calculated comparison metrics between software predictions and physical ground truth."""
    detection_tp: int = 0
    detection_fp: int = 0
    detection_fn: int = 0
    detection_precision: Union[float, str] = "INSUFFICIENT_DATA"
    detection_recall: Union[float, str] = "INSUFFICIENT_DATA"
    terminal_mapping_accuracy: Union[float, str] = "INSUFFICIENT_DATA"
    hole_mapping_accuracy: Union[float, str] = "INSUFFICIENT_DATA"
    netlist_match: bool = False
    v_error_abs_v: Optional[float] = None
    v_error_pct: Union[float, str] = "NOT_APPLICABLE"
    i_error_abs_ma: Optional[float] = None
    i_error_pct: Union[float, str] = "NOT_APPLICABLE"
    within_tolerance: bool = False
    tolerance_notes: List[str] = field(default_factory=list)
    discrepancies: List[str] = field(default_factory=list)


@dataclass
class ValidationCase:
    """Complete structured benchmark test record."""
    case_id: str                                 # e.g., PHYS-001
    circuit_name: str                            # e.g., 5V_Resistor_LED
    description: str
    status: ValidationStatus = ValidationStatus.NOT_TESTED
    timestamp: str = field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")
    components: List[PhysicalComponent] = field(default_factory=list)
    connections: List[PhysicalConnection] = field(default_factory=list)
    power_source: PowerSourceConfig = field(default_factory=PowerSourceConfig)
    camera: CameraEnvironment = field(default_factory=CameraEnvironment)
    tolerance_spec: ToleranceSpec = field(default_factory=ToleranceSpec)
    physical_measurements: PhysicalMeasurements = field(default_factory=PhysicalMeasurements)
    software_results: SoftwareResults = field(default_factory=SoftwareResults)
    comparison: MetricComparison = field(default_factory=MetricComparison)
    notes: str = ""

    def to_dict(self) -> Dict[str, Any]:
        """Serializes dataclass to standard JSON-compatible dictionary."""
        return asdict(self)

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'ValidationCase':
        """Deserializes dictionary into ValidationCase dataclass instance."""
        components = [PhysicalComponent(**c) for c in data.get("components", [])]
        connections = [PhysicalConnection(**cn) for cn in data.get("connections", [])]
        power = PowerSourceConfig(**data.get("power_source", {}))
        camera = CameraEnvironment(**data.get("camera", {}))
        tolerance = ToleranceSpec(**data.get("tolerance_spec", {}))
        measurements = PhysicalMeasurements(**data.get("physical_measurements", {}))
        
        sw_data = data.get("software_results", {})
        if "ar_alignment_status" in sw_data and isinstance(sw_data["ar_alignment_status"], str):
            sw_data["ar_alignment_status"] = ARAlignmentStatus(sw_data["ar_alignment_status"])
        software = SoftwareResults(**sw_data)

        comparison = MetricComparison(**data.get("comparison", {}))
        status = ValidationStatus(data.get("status", ValidationStatus.NOT_TESTED))

        return cls(
            case_id=data["case_id"],
            circuit_name=data["circuit_name"],
            description=data.get("description", ""),
            status=status,
            timestamp=data.get("timestamp", datetime.utcnow().isoformat() + "Z"),
            components=components,
            connections=connections,
            power_source=power,
            camera=camera,
            tolerance_spec=tolerance,
            physical_measurements=measurements,
            software_results=software,
            comparison=comparison,
            notes=data.get("notes", "")
        )
