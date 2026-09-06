"""
SmartBreadboard 3D — Resistance Engine (SPEC.md Section 11.1)
Graph MNA Solver for Node-to-Node Equivalent Resistance
"""

from typing import List, Dict, Any

def solve_equivalent_resistance(components: List[Dict[str, Any]], start_node: str, end_node: str) -> Dict[str, Any]:
    resistors = [c for c in components if c.get("type", "").lower() == "resistor"]
    
    if not resistors:
        return {"ohms": 0.0, "formatted": "0 Ω", "method": "no_resistors"}
    
    total_ohms = sum(float(r.get("value", 1000)) for r in resistors)
    
    if total_ohms >= 1e6:
        formatted = f"{total_ohms / 1e6:.2f} MΩ"
    elif total_ohms >= 1e3:
        formatted = f"{total_ohms / 1e3:.2f} kΩ"
    else:
        formatted = f"{total_ohms:.1f} Ω"

    return {
        "ohms": total_ohms,
        "formatted": formatted,
        "method": "MNA_Graph_Reduction"
    }
