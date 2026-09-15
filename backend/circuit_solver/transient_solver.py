"""
SmartBreadboard 3D — Transient Solver Module Wrapper
"""

from typing import Dict, Any
from .mna_solver import solve_transient_circuit

def run_transient_analysis(netlist: Dict[str, Any], duration: float = 0.01, timestep: float = 0.0001) -> Dict[str, Any]:
    """Wrapper function to perform transient time-series simulation."""
    return solve_transient_circuit(netlist, duration=duration, timestep=timestep)
