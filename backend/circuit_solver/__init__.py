"""
SmartBreadboard 3D — Engineering Circuit Solver Package
Provides Modified Nodal Analysis (MNA), DC operating point solver, transient numerical simulator, and netlist validation.
"""

from .mna_solver import solve_dc_circuit, solve_transient_circuit
from .transient_mna import solve_transient_mna
from .transient_behavior import analyze_transient_circuit, classify_transient_topology, extract_waveform_metrics
from .nonlinear_transient_mna import solve_nonlinear_transient_mna, DiodeNonlinearModel, BJTNonlinearModel
from .semiconductor_behavior import analyze_semiconductor_circuit, classify_semiconductor_topology, extract_semiconductor_metrics
from .semiconductor_registry import get_semiconductor_definition, SEMICONDUCTOR_REGISTRY
from .bjt_registry import get_bjt_definition, BJT_REGISTRY
from .bjt_behavior import analyze_bjt_circuit, classify_bjt_topology, extract_bjt_metrics
from .netlist_parser import parse_circuit_netlist
from .validation import validate_circuit_netlist

__all__ = [
    "solve_dc_circuit",
    "solve_transient_circuit",
    "solve_transient_mna",
    "analyze_transient_circuit",
    "classify_transient_topology",
    "extract_waveform_metrics",
    "solve_nonlinear_transient_mna",
    "DiodeNonlinearModel",
    "BJTNonlinearModel",
    "analyze_semiconductor_circuit",
    "classify_semiconductor_topology",
    "extract_semiconductor_metrics",
    "get_semiconductor_definition",
    "SEMICONDUCTOR_REGISTRY",
    "get_bjt_definition",
    "BJT_REGISTRY",
    "analyze_bjt_circuit",
    "classify_bjt_topology",
    "extract_bjt_metrics",
    "parse_circuit_netlist",
    "validate_circuit_netlist"
]



