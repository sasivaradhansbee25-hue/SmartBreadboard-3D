"""
SmartBreadboard 3D — Solver Results Formatter & 3D Digital Twin Generator
Formats solver results into normalized electrical simulation schema and 3D digital-twin payloads
per SPEC.md Sections 9 & 10.
"""

from typing import Dict, Any, List, Optional
from .component_models import SolverResult

def format_solver_result(res: SolverResult, netlist: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Converts a SolverResult dataclass instance into a clean normalized JSON serializable dictionary.
    Includes backward compatible fields and the normalized simulation format.
    """
    if not res or not res.success:
        err_msg = res.error.get("message", "Circuit solver encountered an unspecified error.") if (res and res.error) else "Solver did not run"
        err_code = res.error.get("code", "SOLVER_NOT_RUN") if (res and res.error) else "NOT_RUN"
        return {
            "success": False,
            "status": "NOT_RUN" if err_code in ["NOT_RUN", "TOPOLOGY_INCOMPLETE"] else "ERROR",
            "solver_status": "NOT_RUN" if err_code in ["NOT_RUN", "TOPOLOGY_INCOMPLETE"] else "ERROR",
            "analysis_type": "DC",
            "simulation_mode": res.simulation_mode if res else "DC",
            "circuit_id": res.circuit_id if res else (netlist.get("circuit_id", "circ_unknown") if netlist else "circ_unknown"),
            "source": res.source if res else "solver_validation",
            "reason": err_msg,
            "error": res.error if res else {"code": err_code, "message": err_msg},
            "warnings": res.warnings if res else [],
            "nodes": [],
            "node_voltages": {},
            "components": [],
            "measurements": {},
            "total_current_mA": 0.0,
            "total_power_mW": 0.0,
            "digital_twin": build_digital_twin_payload(netlist, solver_result=None, solver_status="NOT_RUN", reason=err_msg) if netlist else None
        }

    # Format nodes list and node voltage map
    nodes_list = []
    for nid, volt in res.node_voltages.items():
        nodes_list.append({
            "id": nid,
            "voltage": round(volt, 4)
        })

    formatted_measurements = {}
    normalized_components = []

    for comp_id, m in res.measurements.items():
        v_drop = abs(m.voltage_drop)
        # Component-specific normalized payload
        comp_obj = {
            "id": m.id,
            "type": m.type.lower(),
            "node1": m.node1,
            "node2": m.node2,
            "voltage": round(v_drop, 4),
            "current": round(m.current, 6),
            "power": round(m.power, 6),
            "direction": m.direction,
            "state": m.state
        }

        if m.forward_voltage is not None:
            comp_obj["forward_voltage"] = m.forward_voltage
        if m.charge is not None:
            comp_obj["charge"] = m.charge
        if m.voltage_difference is not None:
            comp_obj["voltage_difference"] = m.voltage_difference

        normalized_components.append(comp_obj)

        # Legacy backward-compatible measurement structure
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
            "voltage": round(v_drop, 4),
            "current": m.current,
            "power": m.power,
            "state": m.state,
            "direction": m.direction,
            "forward_voltage": m.forward_voltage,
            "charge": m.charge,
            "voltage_difference": m.voltage_difference,
            "valueSource": m.value_source
        }

    dt_payload = build_digital_twin_payload(netlist, solver_result=res, solver_status="SOLVED") if netlist else None

    return {
        "success": True,
        "circuit_id": res.circuit_id,
        "source": res.source,
        "status": "SOLVED",
        "solver_status": "SOLVED",
        "analysis_type": "DC",
        "simulation_mode": res.simulation_mode,
        "node_voltages": res.node_voltages,
        "nodes": nodes_list,
        "components": normalized_components,
        "measurements": formatted_measurements,
        "total_current_mA": res.total_current_mA,
        "total_power_mW": res.total_power_mW,
        "warnings": res.warnings,
        "digital_twin": dt_payload
    }


def build_digital_twin_payload(
    netlist: Optional[Dict[str, Any]],
    solver_result: Optional[SolverResult] = None,
    solver_status: str = "SOLVED",
    reason: Optional[str] = None
) -> Dict[str, Any]:
    """
    Builds the 3D Digital Twin data structure preserving physical breadboard locations,
    hole coordinates, mapping confidences, connectivity, and electrical simulation results.
    """
    if not netlist:
        return {
            "solver_status": solver_status,
            "reason": reason,
            "components": [],
            "wires": [],
            "nodes": []
        }

    raw_components = netlist.get("components", [])
    raw_wires = netlist.get("wires", [])
    raw_nets = netlist.get("nets", [])
    nodes_voltages = solver_result.node_voltages if solver_result and solver_result.success else {}

    # 1. Build Digital Twin Nodes
    dt_nodes = []
    seen_nodes = set()
    for n in raw_nets:
        nid = n.get("net_id") or n.get("id")
        if nid and nid not in seen_nodes:
            seen_nodes.add(nid)
            v = nodes_voltages.get(nid, None)
            dt_nodes.append({
                "id": nid,
                "label": n.get("label", nid),
                "voltage": round(v, 4) if v is not None else None,
                "holes": n.get("holes", []),
                "is_power": "VCC" in str(nid).upper() or "PWR" in str(nid).upper(),
                "is_ground": "GND" in str(nid).upper() or "GROUND" in str(nid).upper()
            })

    for nid, v in nodes_voltages.items():
        if nid not in seen_nodes:
            seen_nodes.add(nid)
            dt_nodes.append({
                "id": nid,
                "label": nid,
                "voltage": round(v, 4),
                "holes": [],
                "is_power": "VCC" in str(nid).upper() or "PWR" in str(nid).upper(),
                "is_ground": "GND" in str(nid).upper() or "GROUND" in str(nid).upper()
            })

    # 2. Build Digital Twin Components
    dt_components = []
    for c in raw_components:
        cid = c.get("id") or c.get("designator") or "COMP"
        des = c.get("designator") or c.get("id") or cid
        ctype = (c.get("type") or "resistor").lower()
        h1 = c.get("start_hole") or c.get("hole1")
        h2 = c.get("end_hole") or c.get("hole2")
        n1 = c.get("node1") or c.get("net1")
        n2 = c.get("node2") or c.get("net2")
        val = c.get("value")
        unit = c.get("unit", "Ω")
        conf = c.get("mapping_confidence", c.get("confidence", 0.9))

        # Get electrical measurement if solver ran successfully
        elec = None
        if solver_result and solver_result.success and solver_result.measurements:
            meas = solver_result.measurements.get(cid) or solver_result.measurements.get(des)
            if meas:
                elec = {
                    "voltage": round(abs(meas.voltage_drop), 4),
                    "voltage_drop": meas.voltage_drop,
                    "current": meas.current,
                    "power": meas.power,
                    "state": meas.state,
                    "direction": meas.direction,
                    "forward_voltage": meas.forward_voltage,
                    "charge": meas.charge,
                    "voltage_difference": meas.voltage_difference
                }

        dt_components.append({
            "id": cid,
            "designator": des,
            "type": ctype,
            "start_hole": h1,
            "end_hole": h2,
            "hole1": h1,
            "hole2": h2,
            "node1": n1,
            "node2": n2,
            "value": val,
            "unit": unit,
            "mapping_confidence": round(float(conf), 2) if conf is not None else 0.9,
            "electrical": elec,
            "electrical_result": elec
        })

    # 3. Build Digital Twin Wires
    dt_wires = []
    for w in raw_wires:
        wid = w.get("id") or w.get("designator") or "W1"
        h1 = w.get("start_hole") or w.get("hole1")
        h2 = w.get("end_hole") or w.get("hole2")
        net = w.get("net") or w.get("net_id") or w.get("node1")

        # Current through wire if available in solver measurements
        wire_current = None
        if solver_result and solver_result.success and solver_result.measurements:
            meas = solver_result.measurements.get(wid)
            if meas:
                wire_current = meas.current

        dt_wires.append({
            "id": wid,
            "start_hole": h1,
            "end_hole": h2,
            "net": net,
            "node1": w.get("node1", net),
            "node2": w.get("node2", net),
            "current": wire_current
        })

    return {
        "solver_status": solver_status,
        "analysis_type": "DC",
        "reason": reason,
        "components": dt_components,
        "wires": dt_wires,
        "nodes": dt_nodes,
        "node_voltages": nodes_voltages
    }
