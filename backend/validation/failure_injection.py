"""
backend/validation/failure_injection.py — Controlled Hardware & Circuit Failure Injection (Phase 23)

Simulates and evaluates controlled laboratory fault scenarios:
- Scenario A: Removed Wire (open circuit topology change)
- Scenario B: Shifted Resistor Terminal (terminal relocation / ambiguity)
- Scenario C: Removed Power Source (blocked simulation safety)
- Scenario D: Unsupported Component (detection marked UNKNOWN)
- Scenario E: Ambiguous Visual View (marks AMBIGUOUS instead of guessing)
- Scenario F: Manual Component Value Change (triggers re-simulation & cache invalidation)
"""

from typing import Dict, Any, List, Optional
from .schema import ValidationCase, ValidationStatus, PhysicalComponent, PhysicalConnection


def inject_removed_wire_fault(base_case: ValidationCase, wire_id: str) -> ValidationCase:
    """
    Scenario A: Injects a removed jumper wire.
    Expected: Software netlist drops the connection and detects open branch or floating node.
    """
    case_dict = base_case.to_dict()
    case_dict["case_id"] = f"{base_case.case_id}_FAULT_WIRE"
    case_dict["description"] = f"Failure Injection: Removed wire {wire_id}"
    case_dict["connections"] = [c for c in case_dict.get("connections", []) if c.get("id") != wire_id]
    case_dict["status"] = ValidationStatus.NOT_TESTED
    return ValidationCase.from_dict(case_dict)


def inject_shifted_terminal_fault(base_case: ValidationCase, component_id: str, new_end_hole: str) -> ValidationCase:
    """
    Scenario B: Injects a moved component leg.
    Expected: Verification detects terminal mismatch and triggers ambiguity / node remapping.
    """
    case_dict = base_case.to_dict()
    case_dict["case_id"] = f"{base_case.case_id}_FAULT_SHIFT"
    case_dict["description"] = f"Failure Injection: Shifted {component_id} terminal to {new_end_hole}"
    for comp in case_dict.get("components", []):
        if comp.get("id") == component_id:
            comp["end_hole"] = new_end_hole
    case_dict["status"] = ValidationStatus.NOT_TESTED
    return ValidationCase.from_dict(case_dict)


def inject_removed_power_fault(base_case: ValidationCase) -> ValidationCase:
    """
    Scenario C: Injects a missing DC power source.
    Expected: Pre-simulation safety validator reports INVALID netlist (missing power source) and blocks MNA.
    """
    case_dict = base_case.to_dict()
    case_dict["case_id"] = f"{base_case.case_id}_FAULT_NO_POWER"
    case_dict["description"] = "Failure Injection: Disconnected DC power supply"
    case_dict["power_source"]["measured_voltage_v"] = 0.0
    case_dict["power_source"]["nominal_voltage_v"] = 0.0
    case_dict["status"] = ValidationStatus.NOT_TESTED
    return ValidationCase.from_dict(case_dict)


def inject_unsupported_component_fault(base_case: ValidationCase, comp_id: str = "UNK_IC_1") -> ValidationCase:
    """
    Scenario D: Adds an unrecognized or unsupported physical component.
    Expected: Marked as UNKNOWN component, requiring user definition before MNA execution.
    """
    case_dict = base_case.to_dict()
    case_dict["case_id"] = f"{base_case.case_id}_FAULT_UNSUPPORTED"
    case_dict["description"] = f"Failure Injection: Added unsupported component {comp_id}"
    case_dict["components"].append({
        "id": comp_id,
        "type": "unsupported_ic",
        "nominal_value": None,
        "measured_value": None,
        "unit": "",
        "start_hole": "D10",
        "end_hole": "D15",
        "tolerance_percent": 0.0,
        "notes": "Unsupported active IC package"
    })
    case_dict["status"] = ValidationStatus.NOT_TESTED
    return ValidationCase.from_dict(case_dict)


def inject_ambiguous_placement_fault(base_case: ValidationCase, comp_id: str) -> ValidationCase:
    """
    Scenario E: Visual occlusion or diagonal placement causing hole ambiguity.
    Expected: Software flags terminal as AMBIGUOUS rather than guessing an incorrect hole.
    """
    case_dict = base_case.to_dict()
    case_dict["case_id"] = f"{base_case.case_id}_FAULT_AMBIGUOUS"
    case_dict["description"] = f"Failure Injection: Ambiguous camera angle for {comp_id}"
    for comp in case_dict.get("components", []):
        if comp.get("id") == comp_id:
            comp["end_hole"] = "AMBIGUOUS"
    case_dict["status"] = ValidationStatus.NOT_TESTED
    return ValidationCase.from_dict(case_dict)


def inject_manual_value_change(base_case: ValidationCase, comp_id: str, new_value: float) -> ValidationCase:
    """
    Scenario F: User manually edits component value (e.g. 220Ω -> 1000Ω).
    Expected: Digital Twin updates, cached MNA invalidates, and new branch currents are calculated.
    """
    case_dict = base_case.to_dict()
    case_dict["case_id"] = f"{base_case.case_id}_FAULT_MANUAL_VAL"
    case_dict["description"] = f"Failure Injection: Manually changed {comp_id} value to {new_value} Ω"
    for comp in case_dict.get("components", []):
        if comp.get("id") == comp_id:
            comp["nominal_value"] = new_value
            comp["measured_value"] = new_value
    case_dict["status"] = ValidationStatus.NOT_TESTED
    return ValidationCase.from_dict(case_dict)
