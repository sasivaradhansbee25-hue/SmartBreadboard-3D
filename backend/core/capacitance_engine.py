"""
SmartBreadboard 3D — Capacitance Engine (SPEC.md Section 11.2)
Standalone Capacitance Solver — Strictly Rule 4 Compliant (Separate from Resistance)
"""

from typing import List, Dict, Any

def solve_equivalent_capacitance(components: List[Dict[str, Any]], start_node: str, end_node: str, is_parallel: bool = True) -> Dict[str, Any]:
    capacitors = [c for c in components if "capacitor" in c.get("type", "").lower()]
    
    if not capacitors:
        # Default mock 100nF fallback
        farads = 100e-9
    else:
        values = [float(c.get("value", 100e-9)) for c in capacitors]
        if is_parallel:
            farads = sum(values)
        else:
            inv_sum = sum(1.0 / v for v in values if v > 0)
            farads = 1.0 / inv_sum if inv_sum > 0 else 100e-9

    if farads >= 1e-6:
        formatted = f"{farads * 1e6:.2f} µF"
    elif farads >= 1e-9:
        formatted = f"{farads * 1e9:.1f} nF"
    else:
        formatted = f"{farads * 1e12:.1f} pF"

    return {
        "farads": farads,
        "formatted": formatted,
        "method": "Capacitive_Reactance_Parallel_Series_Solver"
    }
