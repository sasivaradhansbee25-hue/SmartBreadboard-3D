"""
SmartBreadboard 3D — Circuit Solver Component Models
Defines internal component schemas, normalized SI units, and electrical data classes.
"""

from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field

@dataclass
class Component:
    id: str
    type: str  # 'resistor', 'capacitor', 'inductor', 'led', 'diode', 'voltage_source', 'current_source', 'wire'
    node1: str
    node2: str
    value: float  # In SI units (Ohm, Farad, Henry, Volt, Ampere)
    unit: str
    raw_value: Optional[str] = None
    value_source: str = "detected"  # 'detected', 'ocr', 'user_override', 'user_required', 'default'
    properties: Dict[str, Any] = field(default_factory=dict)
    holes: List[str] = field(default_factory=list)

@dataclass
class Node:
    id: str
    label: str
    voltage: float = 0.0
    is_ground: bool = False
    is_power: bool = False

@dataclass
class ComponentMeasurement:
    id: str
    type: str
    value: float
    unit: str
    formatted_value: str
    node1: str
    node2: str
    voltage_a: float
    voltage_b: float
    voltage_drop: float
    current: float  # In Amperes (positive from node1 to node2)
    power: float    # In Watts
    state: Optional[str] = None  # e.g., 'ON', 'OFF', 'CHARGING', 'DISCHARGING'
    value_source: str = "detected"

@dataclass
class SolverResult:
    success: bool
    circuit_id: str
    source: str
    simulation_mode: str
    node_voltages: Dict[str, float]
    measurements: Dict[str, ComponentMeasurement]
    total_current_mA: float
    total_power_mW: float
    warnings: List[str] = field(default_factory=list)
    error: Optional[Dict[str, Any]] = None
