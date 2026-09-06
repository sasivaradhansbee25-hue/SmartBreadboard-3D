"""
SmartBreadboard 3D — Calculation Endpoints Router (SPEC.md Section 10 & 13)
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from core.resistance_engine import solve_equivalent_resistance
from core.capacitance_engine import solve_equivalent_capacitance

router = APIRouter(prefix="/api/calculate", tags=["calculate"])

class CalculateRequest(BaseModel):
    circuit_id: str
    node_a_id: Optional[str] = "NODE_PWR"
    node_b_id: Optional[str] = "NODE_GND"
    components: Optional[List[Dict[str, Any]]] = []

@router.post("/resistance")
def calculate_resistance(req: CalculateRequest):
    result = solve_equivalent_resistance(req.components or [], req.node_a_id, req.node_b_id)
    return {
        "circuit_id": req.circuit_id,
        "source": "mock",
        "node_a": req.node_a_id,
        "node_b": req.node_b_id,
        "equivalent_resistance_ohms": result["ohms"],
        "equivalent_resistance_formatted": result["formatted"],
        "method": result["method"]
    }

@router.post("/capacitance")
def calculate_capacitance(req: CalculateRequest):
    result = solve_equivalent_capacitance(req.components or [], req.node_a_id, req.node_b_id)
    return {
        "circuit_id": req.circuit_id,
        "source": "mock",
        "node_a": req.node_a_id,
        "node_b": req.node_b_id,
        "equivalent_capacitance_farads": result["farads"],
        "equivalent_capacitance_formatted": result["formatted"],
        "method": result["method"]
    }
