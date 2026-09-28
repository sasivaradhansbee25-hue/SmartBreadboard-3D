"""
ground_truth_schema.py — Ground Truth Schema for Real Hardware Validation (Phase 23)

Defines deterministic data structures for physical breadboard ground truth:
- Ground-truth component ID
- Component type
- Actual terminal holes
- Actual orientation
- Actual electrical nodes
- Actual jumper wires
- Expected topology
- Expected simulation state

Strict Rules:
- Never automatically correct ground truth.
- Never fabricate missing measurements.
- If a result is unknown or ambiguous, mark it UNKNOWN/AMBIGUOUS.
"""

from enum import Enum
from typing import Dict, Any, List, Optional, Union
from dataclasses import dataclass, field, asdict


class Orientation(str, Enum):
    HORIZONTAL = "HORIZONTAL"
    VERTICAL = "VERTICAL"
    DIAGONAL = "DIAGONAL"
    UNKNOWN = "UNKNOWN"
    AMBIGUOUS = "AMBIGUOUS"


class TopologyPattern(str, Enum):
    SINGLE_COMPONENT = "SINGLE_COMPONENT"
    SERIES = "SERIES"
    PARALLEL = "PARALLEL"
    VOLTAGE_DIVIDER = "VOLTAGE_DIVIDER"
    NODE_MERGE = "NODE_MERGE"
    BRIDGE = "BRIDGE"
    UNKNOWN = "UNKNOWN"
    AMBIGUOUS = "AMBIGUOUS"


@dataclass
class GroundTruthComponent:
    """Ground truth definition for a physical component."""
    id: str                                    # e.g., 'R1', 'LED1'
    type: str                                  # 'resistor', 'led', 'capacitor', 'wire', etc.
    nominal_value: Optional[float] = None      # e.g., 220.0
    measured_value: Optional[float] = None     # actual multimeter reading (None if not measured, do not fabricate)
    unit: str = "Ω"
    terminal_holes: List[str] = field(default_factory=list)  # e.g. ['A10', 'A14']
    orientation: str = Orientation.HORIZONTAL.value
    electrical_nodes: Dict[str, str] = field(default_factory=dict)  # e.g. {'terminal_1': 'NODE_VCC', 'terminal_2': 'NODE_MID'}
    tolerance_percent: float = 5.0
    notes: str = ""

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'GroundTruthComponent':
        return cls(
            id=data["id"],
            type=data["type"],
            nominal_value=data.get("nominal_value"),
            measured_value=data.get("measured_value"),
            unit=data.get("unit", "Ω"),
            terminal_holes=list(data.get("terminal_holes", [])),
            orientation=data.get("orientation", Orientation.HORIZONTAL.value),
            electrical_nodes=dict(data.get("electrical_nodes", {})),
            tolerance_percent=float(data.get("tolerance_percent", 5.0)),
            notes=data.get("notes", "")
        )


@dataclass
class GroundTruthWire:
    """Ground truth jumper wire connection."""
    id: str
    start_hole: str
    end_hole: str
    color: str = "blue"
    wire_type: str = "solid_core_jumper"
    electrical_node: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'GroundTruthWire':
        return cls(
            id=data["id"],
            start_hole=data["start_hole"],
            end_hole=data["end_hole"],
            color=data.get("color", "blue"),
            wire_type=data.get("wire_type", "solid_core_jumper"),
            electrical_node=data.get("electrical_node")
        )


@dataclass
class GroundTruthTopology:
    """Ground truth electrical topology definition."""
    pattern: str = TopologyPattern.SINGLE_COMPONENT.value
    series_groups: List[List[str]] = field(default_factory=list)      # e.g. [['R1', 'LED1']]
    parallel_groups: List[List[str]] = field(default_factory=list)    # e.g. [['R1', 'R2']]
    electrical_nodes: Dict[str, List[str]] = field(default_factory=dict) # e.g. {'NODE_1': ['R1.1', 'W1.1']}
    is_closed_loop: bool = True
    short_circuits: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'GroundTruthTopology':
        return cls(
            pattern=data.get("pattern", TopologyPattern.SINGLE_COMPONENT.value),
            series_groups=list(data.get("series_groups", [])),
            parallel_groups=list(data.get("parallel_groups", [])),
            electrical_nodes=dict(data.get("electrical_nodes", {})),
            is_closed_loop=data.get("is_closed_loop", True),
            short_circuits=list(data.get("short_circuits", []))
        )


@dataclass
class GroundTruthSimulationState:
    """Ground truth expected simulation state (e.g. MNA results)."""
    expected_status: str = "SOLVED"
    expected_node_voltages: Dict[str, float] = field(default_factory=dict)       # e.g. {'NODE_VCC': 5.0, 'NODE_GND': 0.0}
    expected_branch_currents_ma: Dict[str, float] = field(default_factory=dict)  # e.g. {'R1': 22.7}
    expected_operating_states: Dict[str, str] = field(default_factory=dict)      # e.g. {'LED1': 'ACTIVE_ILLUMINATED'}
    expected_power_mw: Optional[float] = None

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'GroundTruthSimulationState':
        return cls(
            expected_status=data.get("expected_status", "SOLVED"),
            expected_node_voltages=dict(data.get("expected_node_voltages", {})),
            expected_branch_currents_ma=dict(data.get("expected_branch_currents_ma", {})),
            expected_operating_states=dict(data.get("expected_operating_states", {})),
            expected_power_mw=data.get("expected_power_mw")
        )


@dataclass
class GroundTruthCircuit:
    """Complete ground truth circuit description for deterministic hardware validation."""
    circuit_id: str
    name: str
    description: str
    is_physical_test: bool = False             # Set to True ONLY when an actual camera/physical hardware test was performed
    components: List[GroundTruthComponent] = field(default_factory=list)
    jumper_wires: List[GroundTruthWire] = field(default_factory=list)
    electrical_nodes: Dict[str, List[str]] = field(default_factory=dict)
    topology: GroundTruthTopology = field(default_factory=GroundTruthTopology)
    simulation_state: GroundTruthSimulationState = field(default_factory=GroundTruthSimulationState)
    power_source: Optional[Dict[str, Any]] = None
    ar_grounding_state: Optional[Dict[str, Any]] = None
    metadata: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'GroundTruthCircuit':
        comps = [GroundTruthComponent.from_dict(c) for c in data.get("components", [])]
        wires = [GroundTruthWire.from_dict(w) for w in data.get("jumper_wires", [])]
        top = GroundTruthTopology.from_dict(data.get("topology", {}))
        sim = GroundTruthSimulationState.from_dict(data.get("simulation_state", {}))
        return cls(
            circuit_id=data["circuit_id"],
            name=data["name"],
            description=data.get("description", ""),
            is_physical_test=data.get("is_physical_test", False),
            components=comps,
            jumper_wires=wires,
            electrical_nodes=dict(data.get("electrical_nodes", {})),
            topology=top,
            simulation_state=sim,
            power_source=data.get("power_source"),
            ar_grounding_state=data.get("ar_grounding_state"),
            metadata=dict(data.get("metadata", {}))
        )


# ===========================================================================
# STANDARD 5 VALIDATION SCENARIOS FACTORY FUNCTIONS
# ===========================================================================

def create_single_resistor_scenario() -> GroundTruthCircuit:
    """Scenario 1: Single Resistor circuit on breadboard."""
    return GroundTruthCircuit(
        circuit_id="SCENARIO-1-SINGLE-RESISTOR",
        name="Single Resistor",
        description="A single 1000Ω resistor connected between columns 10 and 15 powered by 5V DC.",
        is_physical_test=False,
        components=[
            GroundTruthComponent(
                id="R1",
                type="resistor",
                nominal_value=1000.0,
                measured_value=None,  # Not fabricated
                unit="Ω",
                terminal_holes=["A10", "A15"],
                orientation=Orientation.HORIZONTAL.value,
                electrical_nodes={"terminal_1": "NODE_VCC", "terminal_2": "NODE_GND"},
                tolerance_percent=5.0
            )
        ],
        jumper_wires=[],
        electrical_nodes={
            "NODE_VCC": ["R1.1", "POWER_PLUS"],
            "NODE_GND": ["R1.2", "POWER_MINUS"]
        },
        topology=GroundTruthTopology(
            pattern=TopologyPattern.SINGLE_COMPONENT.value,
            series_groups=[],
            parallel_groups=[],
            electrical_nodes={
                "NODE_VCC": ["R1.1"],
                "NODE_GND": ["R1.2"]
            },
            is_closed_loop=True
        ),
        simulation_state=GroundTruthSimulationState(
            expected_status="SOLVED",
            expected_node_voltages={"NODE_VCC": 5.0, "NODE_GND": 0.0},
            expected_branch_currents_ma={"R1": 5.0},
            expected_operating_states={"R1": "PASSIVE_CONDUCTING"},
            expected_power_mw=25.0
        ),
        power_source={"voltage_v": 5.0, "positive_hole": "A10", "ground_hole": "A15"},
        ar_grounding_state={"expected_tracking": "ACTIVE", "orientation": "HORIZONTAL"}
    )


def create_resistor_led_series_scenario() -> GroundTruthCircuit:
    """Scenario 2: Resistor + LED in series."""
    return GroundTruthCircuit(
        circuit_id="SCENARIO-2-RESISTOR-LED-SERIES",
        name="Resistor + LED Series",
        description="220Ω resistor in series with red LED, sharing breadboard column 15.",
        is_physical_test=False,
        components=[
            GroundTruthComponent(
                id="R1",
                type="resistor",
                nominal_value=220.0,
                measured_value=None,
                unit="Ω",
                terminal_holes=["A10", "A15"],
                orientation=Orientation.HORIZONTAL.value,
                electrical_nodes={"terminal_1": "NODE_VCC", "terminal_2": "NODE_MID"},
                tolerance_percent=5.0
            ),
            GroundTruthComponent(
                id="LED1",
                type="led",
                nominal_value=None,
                measured_value=None,
                unit="V",
                terminal_holes=["B15", "B20"],
                orientation=Orientation.HORIZONTAL.value,
                electrical_nodes={"anode": "NODE_MID", "cathode": "NODE_GND"},
                tolerance_percent=10.0
            )
        ],
        jumper_wires=[],
        electrical_nodes={
            "NODE_VCC": ["R1.1"],
            "NODE_MID": ["R1.2", "LED1.anode"],
            "NODE_GND": ["LED1.cathode"]
        },
        topology=GroundTruthTopology(
            pattern=TopologyPattern.SERIES.value,
            series_groups=[["R1", "LED1"]],
            parallel_groups=[],
            electrical_nodes={
                "NODE_VCC": ["R1.1"],
                "NODE_MID": ["R1.2", "LED1.anode"],
                "NODE_GND": ["LED1.cathode"]
            },
            is_closed_loop=True
        ),
        simulation_state=GroundTruthSimulationState(
            expected_status="SOLVED",
            expected_node_voltages={"NODE_VCC": 5.0, "NODE_MID": 2.1, "NODE_GND": 0.0},
            expected_branch_currents_ma={"R1": 13.18, "LED1": 13.18},
            expected_operating_states={"LED1": "ACTIVE_ILLUMINATED"},
            expected_power_mw=65.9
        ),
        power_source={"voltage_v": 5.0, "positive_hole": "A10", "ground_hole": "B20"},
        ar_grounding_state={"expected_tracking": "ACTIVE", "orientation": "HORIZONTAL"}
    )


def create_resistor_led_parallel_scenario() -> GroundTruthCircuit:
    """Scenario 3: Resistor + LED in parallel."""
    return GroundTruthCircuit(
        circuit_id="SCENARIO-3-RESISTOR-LED-PARALLEL",
        name="Resistor + LED Parallel",
        description="1000Ω resistor and LED placed in parallel between column 10 and column 15.",
        is_physical_test=False,
        components=[
            GroundTruthComponent(
                id="R1",
                type="resistor",
                nominal_value=1000.0,
                measured_value=None,
                unit="Ω",
                terminal_holes=["A10", "A15"],
                orientation=Orientation.HORIZONTAL.value,
                electrical_nodes={"terminal_1": "NODE_VCC", "terminal_2": "NODE_GND"},
                tolerance_percent=5.0
            ),
            GroundTruthComponent(
                id="LED1",
                type="led",
                nominal_value=None,
                measured_value=None,
                unit="V",
                terminal_holes=["C10", "C15"],
                orientation=Orientation.HORIZONTAL.value,
                electrical_nodes={"anode": "NODE_VCC", "cathode": "NODE_GND"},
                tolerance_percent=10.0
            )
        ],
        jumper_wires=[],
        electrical_nodes={
            "NODE_VCC": ["R1.1", "LED1.anode"],
            "NODE_GND": ["R1.2", "LED1.cathode"]
        },
        topology=GroundTruthTopology(
            pattern=TopologyPattern.PARALLEL.value,
            series_groups=[],
            parallel_groups=[["R1", "LED1"]],
            electrical_nodes={
                "NODE_VCC": ["R1.1", "LED1.anode"],
                "NODE_GND": ["R1.2", "LED1.cathode"]
            },
            is_closed_loop=True
        ),
        simulation_state=GroundTruthSimulationState(
            expected_status="SOLVED",
            expected_node_voltages={"NODE_VCC": 5.0, "NODE_GND": 0.0},
            expected_branch_currents_ma={"R1": 5.0, "LED1": 20.0},
            expected_operating_states={"LED1": "ACTIVE_ILLUMINATED"},
            expected_power_mw=125.0
        ),
        power_source={"voltage_v": 5.0, "positive_hole": "A10", "ground_hole": "A15"},
        ar_grounding_state={"expected_tracking": "ACTIVE", "orientation": "HORIZONTAL"}
    )


def create_voltage_divider_scenario() -> GroundTruthCircuit:
    """Scenario 4: Voltage Divider with two resistors."""
    return GroundTruthCircuit(
        circuit_id="SCENARIO-4-VOLTAGE-DIVIDER",
        name="Voltage Divider",
        description="Two 10kΩ resistors in series forming a 2:1 voltage divider (V_mid = 2.5V).",
        is_physical_test=False,
        components=[
            GroundTruthComponent(
                id="R1",
                type="resistor",
                nominal_value=10000.0,
                measured_value=None,
                unit="Ω",
                terminal_holes=["A10", "A15"],
                orientation=Orientation.HORIZONTAL.value,
                electrical_nodes={"terminal_1": "NODE_VCC", "terminal_2": "NODE_MID"},
                tolerance_percent=1.0
            ),
            GroundTruthComponent(
                id="R2",
                type="resistor",
                nominal_value=10000.0,
                measured_value=None,
                unit="Ω",
                terminal_holes=["B15", "B20"],
                orientation=Orientation.HORIZONTAL.value,
                electrical_nodes={"terminal_1": "NODE_MID", "terminal_2": "NODE_GND"},
                tolerance_percent=1.0
            )
        ],
        jumper_wires=[],
        electrical_nodes={
            "NODE_VCC": ["R1.1"],
            "NODE_MID": ["R1.2", "R2.1"],
            "NODE_GND": ["R2.2"]
        },
        topology=GroundTruthTopology(
            pattern=TopologyPattern.VOLTAGE_DIVIDER.value,
            series_groups=[["R1", "R2"]],
            parallel_groups=[],
            electrical_nodes={
                "NODE_VCC": ["R1.1"],
                "NODE_MID": ["R1.2", "R2.1"],
                "NODE_GND": ["R2.2"]
            },
            is_closed_loop=True
        ),
        simulation_state=GroundTruthSimulationState(
            expected_status="SOLVED",
            expected_node_voltages={"NODE_VCC": 5.0, "NODE_MID": 2.5, "NODE_GND": 0.0},
            expected_branch_currents_ma={"R1": 0.25, "R2": 0.25},
            expected_operating_states={"R1": "PASSIVE_CONDUCTING", "R2": "PASSIVE_CONDUCTING"},
            expected_power_mw=1.25
        ),
        power_source={"voltage_v": 5.0, "positive_hole": "A10", "ground_hole": "B20"},
        ar_grounding_state={"expected_tracking": "ACTIVE", "orientation": "HORIZONTAL"}
    )


def create_jumper_wire_node_merge_scenario() -> GroundTruthCircuit:
    """Scenario 5: Jumper wire merging two distant tie-point columns into one node."""
    return GroundTruthCircuit(
        circuit_id="SCENARIO-5-JUMPER-WIRE-MERGE",
        name="Jumper Wire Node Merge",
        description="Jumper wire W1 connects column 15 to column 25, merging R1 and R2 terminals.",
        is_physical_test=False,
        components=[
            GroundTruthComponent(
                id="R1",
                type="resistor",
                nominal_value=220.0,
                measured_value=None,
                unit="Ω",
                terminal_holes=["A10", "A15"],
                orientation=Orientation.HORIZONTAL.value,
                electrical_nodes={"terminal_1": "NODE_VCC", "terminal_2": "NODE_MERGED"},
                tolerance_percent=5.0
            ),
            GroundTruthComponent(
                id="R2",
                type="resistor",
                nominal_value=220.0,
                measured_value=None,
                unit="Ω",
                terminal_holes=["A25", "A30"],
                orientation=Orientation.HORIZONTAL.value,
                electrical_nodes={"terminal_1": "NODE_MERGED", "terminal_2": "NODE_GND"},
                tolerance_percent=5.0
            )
        ],
        jumper_wires=[
            GroundTruthWire(
                id="W1",
                start_hole="E15",
                end_hole="E25",
                color="yellow",
                wire_type="solid_core_jumper",
                electrical_node="NODE_MERGED"
            )
        ],
        electrical_nodes={
            "NODE_VCC": ["R1.1"],
            "NODE_MERGED": ["R1.2", "W1.start", "W1.end", "R2.1"],
            "NODE_GND": ["R2.2"]
        },
        topology=GroundTruthTopology(
            pattern=TopologyPattern.NODE_MERGE.value,
            series_groups=[["R1", "R2"]],
            parallel_groups=[],
            electrical_nodes={
                "NODE_VCC": ["R1.1"],
                "NODE_MERGED": ["R1.2", "W1.start", "W1.end", "R2.1"],
                "NODE_GND": ["R2.2"]
            },
            is_closed_loop=True
        ),
        simulation_state=GroundTruthSimulationState(
            expected_status="SOLVED",
            expected_node_voltages={"NODE_VCC": 5.0, "NODE_MERGED": 2.5, "NODE_GND": 0.0},
            expected_branch_currents_ma={"R1": 11.36, "R2": 11.36, "W1": 11.36},
            expected_operating_states={"R1": "PASSIVE_CONDUCTING", "R2": "PASSIVE_CONDUCTING"},
            expected_power_mw=56.8
        ),
        power_source={"voltage_v": 5.0, "positive_hole": "A10", "ground_hole": "A30"},
        ar_grounding_state={"expected_tracking": "ACTIVE", "orientation": "HORIZONTAL"}
    )


def get_all_standard_scenarios() -> List[GroundTruthCircuit]:
    """Returns the complete list of standard hardware validation scenarios."""
    return [
        create_single_resistor_scenario(),
        create_resistor_led_series_scenario(),
        create_resistor_led_parallel_scenario(),
        create_voltage_divider_scenario(),
        create_jumper_wire_node_merge_scenario()
    ]
