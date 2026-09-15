"""
SmartBreadboard 3D — Solver Results Formatter
Formats solver dataclasses into API-compliant JSON dictionaries per SPEC.md Section 10.
"""

from typing import Dict, Any
from .component_models import SolverResult

def format_solver_result(res: SolverResult) -> Dict[str, Any]:
    """Converts a SolverResult dataclass instance into a clean JSON serializable dictionary."""
    if not res.success:
        return {
            "success": False,
            "circuit_id": res.circuit_id,
            "source": res.source,
            "error": res.error or {
                "code": "SOLVER_ERROR",
                "message": "Circuit solver encountered an unspecified error."
            },
            "warnings": res.warnings
        }

    formatted_measurements = {}
    for comp_id, m in res.measurements.items():
        formatted_measurements[comp_id] = {
            "id": m.id,
            "type": m.type,
            "value": m.value,
            "unit": m.unit,
            "formatted_value": m.formatted_value,
            "terminalVoltages": {
                "A": m.voltage_a,
                "B": m.voltage_b
            },
            "voltageDrop": m.voltage_drop,
            "current": m.current,
            "power": m.power,
            "state": m.state,
            "valueSource": m.value_source
        }

    return {
        "success": True,
        "circuit_id": res.circuit_id,
        "source": res.source,
        "simulation_mode": res.simulation_mode,
        "status": "SOLVED",
        "node_voltages": res.node_voltages,
        "measurements": formatted_measurements,
        "total_current_mA": res.total_current_mA,
        "total_power_mW": res.total_power_mW,
        "warnings": res.warnings
    }
