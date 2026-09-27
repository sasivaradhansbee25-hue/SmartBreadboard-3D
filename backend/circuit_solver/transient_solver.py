"""
SmartBreadboard 3D — Transient Solver Module Wrapper
"""

from typing import Dict, Any, Optional
from .transient_mna import solve_transient_mna
from .transient_behavior import analyze_transient_circuit

def run_transient_analysis(
    netlist: Dict[str, Any],
    duration: float = 0.01,
    timestep: float = 0.0001,
    source_config: Optional[Dict[str, Any]] = None,
    initial_conditions: Optional[Dict[str, Any]] = None,
    method: str = "backward_euler"
) -> Dict[str, Any]:
    """Wrapper function to perform transient time-domain simulation and behavior analysis."""
    sim_cfg = {
        "t_start": 0.0,
        "t_stop": duration,
        "dt": timestep,
        "method": method
    }
    return analyze_transient_circuit(
        netlist=netlist,
        source_config=source_config,
        simulation_config=sim_cfg,
        initial_conditions=initial_conditions
    )
