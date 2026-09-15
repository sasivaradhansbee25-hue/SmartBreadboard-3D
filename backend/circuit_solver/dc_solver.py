"""
SmartBreadboard 3D — DC Solver Module Wrapper
"""

from typing import Dict, Any
from .mna_solver import solve_dc_circuit
from .component_models import SolverResult

def run_dc_analysis(netlist: Dict[str, Any]) -> SolverResult:
    """Wrapper function to perform DC operating point analysis."""
    return solve_dc_circuit(netlist)
