"""
SmartBreadboard 3D — Manual Supply Configuration & Simulation Control (Phase 24.2)
Implements deterministic supply configuration, validation, and simulation gating
between Photo-to-Circuit Mapping and the MNA solver.

Rules:
1. Positive node must exist in verified circuit.
2. Ground node must exist in verified circuit.
3. Positive and ground cannot be the same node.
4. Voltage must be finite and within supported range (0.1 V to 100.0 V).
5. User explicitly chooses the supply nodes. No LLM or AI guessing of VCC or GND.
6. Supply configuration becomes part of the circuit signature.
7. Changing supply configuration or circuit topology invalidates previous simulation results.
8. Simulation blocked when circuit is ambiguous, has unknown components, or supply is invalid.
9. Single source of truth: 3D Digital Twin and live graphs consume the same simulationResult.
10. Scientific integrity: simulation results are marked as simulated, physical validation NOT PERFORMED.
"""

import copy
import hashlib
import math
from datetime import datetime
from typing import Dict, Any, List, Optional, Set, Tuple, Union

try:
    from backend.circuit_solver.mna_solver import solve_dc_circuit
    from backend.circuit_solver.component_models import SolverResult
    from backend.circuit_solver.transient_mna import solve_transient_mna
except ImportError:
    from circuit_solver.mna_solver import solve_dc_circuit
    from circuit_solver.component_models import SolverResult
    from circuit_solver.transient_mna import solve_transient_mna


# Standard machine-readable status codes
STATUS_NOT_CONFIGURED = "NOT_CONFIGURED"
STATUS_INVALID_NODE = "INVALID_NODE"
STATUS_SAME_NODE = "SAME_NODE"
STATUS_INVALID_VOLTAGE = "INVALID_VOLTAGE"
STATUS_VALID = "VALID"
STATUS_BLOCKED = "BLOCKED"
STATUS_ERROR = "ERROR"
STATUS_SOLVED = "SOLVED"

# Standard deterministic machine-readable reason codes
REASON_SUPPLY_REQUIRED = "SUPPLY_CONFIGURATION_REQUIRED"
REASON_POSITIVE_NODE_NOT_SELECTED = "POSITIVE_NODE_NOT_SELECTED"
REASON_GROUND_NODE_NOT_SELECTED = "GROUND_NODE_NOT_SELECTED"
REASON_INVALID_SUPPLY_NODE = "INVALID_SUPPLY_NODE"
REASON_SAME_SUPPLY_REFERENCE = "SAME_SUPPLY_REFERENCE"
REASON_INVALID_VOLTAGE = "INVALID_VOLTAGE"
REASON_STALE_CIRCUIT_SIGNATURE = "STALE_CIRCUIT_SIGNATURE"
REASON_STALE_CIRCUIT = "STALE_CIRCUIT"
REASON_AMBIGUOUS_CIRCUIT = "AMBIGUOUS_CIRCUIT"
REASON_UNKNOWN_COMPONENT = "UNKNOWN_COMPONENT"
REASON_BLOCKED_CIRCUIT = "BLOCKED_CIRCUIT"
REASON_SOLVER_ERROR = "SOLVER_ERROR"


def _extract_circuit_nodes(circuit_state: Dict[str, Any]) -> Set[str]:
    """Extracts all valid canonical electrical node IDs from circuit state."""
    node_ids: Set[str] = set()
    if not isinstance(circuit_state, dict):
        return node_ids

    # 1. From nodes list / dict
    raw_nodes = circuit_state.get("nodes", [])
    if isinstance(raw_nodes, dict):
        for k in raw_nodes.keys():
            if k and str(k) not in ["UNRESOLVED", "UNKNOWN", "AMBIGUOUS"]:
                node_ids.add(str(k))
    elif isinstance(raw_nodes, list):
        for n in raw_nodes:
            if isinstance(n, dict):
                nid = n.get("node_id") or n.get("id")
                if nid and str(nid) not in ["UNRESOLVED", "UNKNOWN", "AMBIGUOUS"]:
                    node_ids.add(str(nid))
            elif isinstance(n, str) and n not in ["UNRESOLVED", "UNKNOWN", "AMBIGUOUS"]:
                node_ids.add(n)

    # 2. From connections
    for conn in circuit_state.get("connections", []):
        nid = conn.get("node_id")
        if nid and str(nid) not in ["UNRESOLVED", "UNKNOWN", "AMBIGUOUS"]:
            node_ids.add(str(nid))

    # 3. From component terminals
    for comp in circuit_state.get("components", []):
        for term in comp.get("terminals", []):
            nid = term.get("node")
            if nid and str(nid) not in ["UNRESOLVED", "UNKNOWN", "AMBIGUOUS"]:
                node_ids.add(str(nid))
        if comp.get("node1") and str(comp["node1"]) not in ["UNRESOLVED", "UNKNOWN", "AMBIGUOUS"]:
            node_ids.add(str(comp["node1"]))
        if comp.get("node2") and str(comp["node2"]) not in ["UNRESOLVED", "UNKNOWN", "AMBIGUOUS"]:
            node_ids.add(str(comp["node2"]))

    return node_ids


def compute_supply_signature(base_signature: str, supply: Optional[Dict[str, Any]]) -> str:
    """
    Computes deterministic SHA-256 circuit signature that incorporates the supply configuration.
    Rule: Supply configuration must become part of the circuit signature.
    Rule: Changing supply configuration automatically yields a different signature.
    """
    if not base_signature:
        base_signature = "BASE_EMPTY_CIRCUIT"

    if not supply or not supply.get("enabled") or supply.get("status") != STATUS_VALID:
        return base_signature

    src = str(supply.get("source_id", "V1"))
    src_type = str(supply.get("source_type", "DC_VOLTAGE"))
    pos = str(supply.get("positive_node", ""))
    gnd = str(supply.get("ground_node", ""))
    v = float(supply.get("voltage", 0.0))

    serialized = f"BASE={base_signature};SUPPLY={src_type}:{src}:{pos}->{gnd}@{v:.4f}V"
    return hashlib.sha256(serialized.encode("utf-8")).hexdigest()[:24]


def is_supply_configuration_current(
    supply_config: Optional[Dict[str, Any]],
    current_circuit_signature: Optional[str]
) -> bool:
    """
    Checks whether the supply configuration is fresh and matches the current circuit signature.
    Returns False if circuit changed or supply was not verified.
    """
    if not supply_config or not isinstance(supply_config, dict):
        return False
    if not supply_config.get("enabled") or supply_config.get("status") != STATUS_VALID:
        return False
    cfg_sig = supply_config.get("circuit_signature")
    if not cfg_sig or not current_circuit_signature:
        return False
    return cfg_sig == current_circuit_signature


def build_supply_source(supply_config: Dict[str, Any]) -> Dict[str, Any]:
    """Builds normalized power source model for MNA netlist from supply config."""
    return {
        "id": supply_config.get("source_id", "V1"),
        "type": "voltage_source",
        "source_type": supply_config.get("source_type", "DC_VOLTAGE"),
        "positive_node": supply_config.get("positive_node"),
        "negative_node": supply_config.get("ground_node"),
        "ground_node": supply_config.get("ground_node"),
        "voltage": float(supply_config.get("voltage", 5.0))
    }


def invalidate_supply_configuration(circuit_state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Invalidates supply configuration and cached simulation results whenever circuit topology changes.
    """
    if not isinstance(circuit_state, dict):
        return {}

    supply = circuit_state.get("supply")
    if supply and isinstance(supply, dict):
        supply["status"] = STATUS_NOT_CONFIGURED
        supply["enabled"] = False

    circuit_state["simulation_result"] = None
    circuit_state["simulation_status"] = "NOT_RUN"
    circuit_state["simulation_signature"] = None
    circuit_state["simulation_error"] = None
    circuit_state["simulation_ready"] = False
    circuit_state["simulation_readiness_reason"] = REASON_SUPPLY_REQUIRED

    return supply or {}


def validate_supply_configuration(
    circuit_state: Dict[str, Any],
    positive_node: Optional[str] = None,
    ground_node: Optional[str] = None,
    voltage: Optional[Union[float, int, str]] = None,
    circuit_signature: Optional[str] = None
) -> Dict[str, Any]:
    """
    Validates power supply configuration and circuit readiness deterministically.
    Supports inspecting circuit_state directly or validating explicit parameters.
    """
    if not isinstance(circuit_state, dict):
        return {
            "valid": False,
            "status": STATUS_BLOCKED,
            "reason": REASON_AMBIGUOUS_CIRCUIT,
            "error_code": REASON_AMBIGUOUS_CIRCUIT,
            "message": "Circuit state is invalid or missing."
        }

    # 1. Circuit-level ambiguity check
    state_status = str(circuit_state.get("status", "")).upper()
    sim_reason = str(circuit_state.get("simulation_readiness_reason", "")).upper()

    if state_status in ["AMBIGUOUS", "BLOCKED"] or "AMBIGUOUS" in sim_reason:
        return {
            "valid": False,
            "status": STATUS_BLOCKED,
            "reason": REASON_AMBIGUOUS_CIRCUIT,
            "error_code": REASON_AMBIGUOUS_CIRCUIT,
            "message": "Circuit contains unresolved ambiguity and cannot be safely simulated."
        }

    # 2. Check for unknown or unresolved components
    comps = circuit_state.get("components", [])
    if not comps:
        return {
            "valid": False,
            "status": STATUS_BLOCKED,
            "reason": "NO_COMPONENTS",
            "error_code": "NO_COMPONENTS",
            "message": "Circuit has no detected or mapped components."
        }

    for c in comps:
        ctype = str(c.get("type", c.get("class", ""))).upper()
        cstatus = str(c.get("status", "")).upper()
        if ctype in ["UNKNOWN", "UNSUPPORTED"] or cstatus in ["UNKNOWN", "AMBIGUOUS"]:
            return {
                "valid": False,
                "status": STATUS_BLOCKED,
                "reason": REASON_UNKNOWN_COMPONENT,
                "error_code": REASON_UNKNOWN_COMPONENT,
                "message": f"Component '{c.get('id', 'unknown')}' is unknown or unresolved."
            }
        # Check terminals for missing holes or unresolved nodes
        for term in c.get("terminals", []):
            if not term.get("hole") or term.get("node") in ["UNRESOLVED", "UNKNOWN", "AMBIGUOUS"]:
                return {
                    "valid": False,
                    "status": STATUS_BLOCKED,
                    "reason": REASON_AMBIGUOUS_CIRCUIT,
                    "error_code": REASON_AMBIGUOUS_CIRCUIT,
                    "message": f"Component '{c.get('id')}' has unmapped terminal '{term.get('terminal')}'. Please resolve terminal mapping."
                }

    if "UNKNOWN" in sim_reason or "UNSUPPORTED" in sim_reason:
        return {
            "valid": False,
            "status": STATUS_BLOCKED,
            "reason": REASON_UNKNOWN_COMPONENT,
            "error_code": REASON_UNKNOWN_COMPONENT,
            "message": "Circuit contains unknown or unsupported components."
        }

    # 3. Resolve supply parameters
    supply_in_state = circuit_state.get("supply") or {}
    pos_node = positive_node if positive_node is not None else supply_in_state.get("positive_node")
    gnd_node = ground_node if ground_node is not None else supply_in_state.get("ground_node")
    volt_val = voltage if voltage is not None else supply_in_state.get("voltage")
    chk_sig = circuit_signature or supply_in_state.get("circuit_signature")

    # Positive node check
    if not pos_node:
        return {
            "valid": False,
            "status": STATUS_NOT_CONFIGURED,
            "reason": REASON_POSITIVE_NODE_NOT_SELECTED,
            "error_code": REASON_POSITIVE_NODE_NOT_SELECTED,
            "message": "Positive supply node (VCC) has not been selected."
        }

    # Ground node check
    if not gnd_node:
        return {
            "valid": False,
            "status": STATUS_NOT_CONFIGURED,
            "reason": REASON_GROUND_NODE_NOT_SELECTED,
            "error_code": REASON_GROUND_NODE_NOT_SELECTED,
            "message": "Ground / reference node (GND) has not been selected."
        }

    valid_nodes = _extract_circuit_nodes(circuit_state)

    # Rule 1: Positive node must exist in verified circuit
    if str(pos_node) not in valid_nodes:
        return {
            "valid": False,
            "status": STATUS_INVALID_NODE,
            "reason": REASON_INVALID_SUPPLY_NODE,
            "error_code": REASON_INVALID_SUPPLY_NODE,
            "message": f"Positive supply node '{pos_node}' does not exist in verified circuit."
        }

    # Rule 2: Ground node must exist in verified circuit
    if str(gnd_node) not in valid_nodes:
        return {
            "valid": False,
            "status": STATUS_INVALID_NODE,
            "reason": REASON_INVALID_SUPPLY_NODE,
            "error_code": REASON_INVALID_SUPPLY_NODE,
            "message": f"Ground / reference node '{gnd_node}' does not exist in verified circuit."
        }

    # Rule 3: Positive and ground cannot be the same node
    if str(pos_node) == str(gnd_node):
        return {
            "valid": False,
            "status": STATUS_SAME_NODE,
            "reason": REASON_SAME_SUPPLY_REFERENCE,
            "error_code": REASON_SAME_SUPPLY_REFERENCE,
            "message": "Positive supply node and ground node cannot be the same node (short circuit)."
        }

    # Rules 4 & 5: Voltage must be finite, numeric, and between 0.1V and 100.0V
    if volt_val is None or isinstance(volt_val, bool):
        return {
            "valid": False,
            "status": STATUS_INVALID_VOLTAGE,
            "reason": REASON_INVALID_VOLTAGE,
            "error_code": REASON_INVALID_VOLTAGE,
            "message": "Supply voltage must be a valid numeric value."
        }

    try:
        f_voltage = float(volt_val)
        if math.isnan(f_voltage) or math.isinf(f_voltage):
            return {
                "valid": False,
                "status": STATUS_INVALID_VOLTAGE,
                "reason": REASON_INVALID_VOLTAGE,
                "error_code": REASON_INVALID_VOLTAGE,
                "message": "Supply voltage must be finite."
            }
    except (ValueError, TypeError):
        return {
            "valid": False,
            "status": STATUS_INVALID_VOLTAGE,
            "reason": REASON_INVALID_VOLTAGE,
            "error_code": REASON_INVALID_VOLTAGE,
            "message": f"Invalid voltage value: '{volt_val}'."
        }

    if f_voltage < 0.1 or f_voltage > 100.0:
        return {
            "valid": False,
            "status": STATUS_INVALID_VOLTAGE,
            "reason": REASON_INVALID_VOLTAGE,
            "error_code": REASON_INVALID_VOLTAGE,
            "message": f"Voltage must be between 0.1V and 100.0V for safe simulation (received {f_voltage}V)."
        }

    # Signature freshness check
    curr_sig = circuit_state.get("circuit_signature", "")
    if chk_sig and curr_sig and chk_sig != curr_sig and chk_sig != circuit_state.get("base_circuit_signature"):
        return {
            "valid": False,
            "status": STATUS_BLOCKED,
            "reason": REASON_STALE_CIRCUIT_SIGNATURE,
            "error_code": REASON_STALE_CIRCUIT_SIGNATURE,
            "message": "The circuit changed. Please configure the supply again."
        }

    # Build validated supply object
    supply_dict = {
        "source_type": "DC_VOLTAGE",
        "source_id": "V1",
        "positive_node": str(pos_node),
        "ground_node": str(gnd_node),
        "voltage": float(f_voltage),
        "circuit_signature": curr_sig,
        "configured_at": datetime.utcnow().isoformat() + "Z",
        "reference": "GROUND",
        "enabled": True,
        "status": STATUS_VALID
    }

    return {
        "valid": True,
        "status": STATUS_VALID,
        "reason": None,
        "error_code": None,
        "supply": supply_dict,
        "message": f"✓ Valid supply configuration: {f_voltage:.2f} V ({pos_node} → {gnd_node})"
    }


def configure_supply(
    circuit_state: Dict[str, Any],
    positive_node: str,
    ground_node: str,
    voltage: Union[float, int, str],
    source_type: str = "DC_VOLTAGE"
) -> Dict[str, Any]:
    """
    Configures power supply on circuit state, validates configuration,
    updates circuit signature, and invalidates any previous simulation results.
    """
    if "base_circuit_signature" not in circuit_state:
        circuit_state["base_circuit_signature"] = circuit_state.get("circuit_signature", "")

    val_res = validate_supply_configuration(
        circuit_state,
        positive_node=positive_node,
        ground_node=ground_node,
        voltage=voltage
    )

    if val_res["valid"]:
        supply_obj = val_res["supply"]
    else:
        # Construct unvalidated / error supply state
        try:
            parsed_v = float(voltage) if voltage is not None and not isinstance(voltage, bool) else 0.0
        except (ValueError, TypeError):
            parsed_v = -1.0

        supply_obj = {
            "source_type": source_type,
            "source_id": "V1",
            "positive_node": str(positive_node) if positive_node is not None else None,
            "ground_node": str(ground_node) if ground_node is not None else None,
            "voltage": parsed_v,
            "circuit_signature": circuit_state.get("circuit_signature", ""),
            "configured_at": datetime.utcnow().isoformat() + "Z",
            "reference": "GROUND",
            "enabled": False,
            "status": val_res["status"],
            "reason": val_res["reason"],
            "message": val_res["message"]
        }

    circuit_state["supply"] = supply_obj

    # Update circuit signature with supply
    base_sig = circuit_state["base_circuit_signature"] or circuit_state.get("circuit_signature", "")
    new_sig = compute_supply_signature(base_sig, supply_obj)
    circuit_state["circuit_signature"] = new_sig
    supply_obj["circuit_signature"] = new_sig

    # Invalidate previous simulation results
    circuit_state["simulation_result"] = None
    circuit_state["simulation_status"] = "NOT_RUN"
    circuit_state["simulation_signature"] = None
    circuit_state["simulation_error"] = None

    if val_res["valid"]:
        circuit_state["simulation_ready"] = True
        circuit_state["simulation_readiness_reason"] = "READY_FOR_SIMULATION"
    else:
        circuit_state["simulation_ready"] = False
        circuit_state["simulation_readiness_reason"] = val_res["reason"]

    return supply_obj


def clear_supply_configuration(circuit_state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Clears power supply configuration, restores base signature,
    and invalidates previous simulation results.
    """
    base_sig = circuit_state.get("base_circuit_signature") or circuit_state.get("circuit_signature", "")

    supply_obj = {
        "source_type": "DC_VOLTAGE",
        "source_id": "V1",
        "positive_node": None,
        "ground_node": None,
        "voltage": 0.0,
        "circuit_signature": base_sig,
        "configured_at": datetime.utcnow().isoformat() + "Z",
        "reference": "GROUND",
        "enabled": False,
        "status": STATUS_NOT_CONFIGURED
    }

    circuit_state["supply"] = supply_obj
    circuit_state["circuit_signature"] = base_sig

    # Invalidate previous simulation
    circuit_state["simulation_result"] = None
    circuit_state["simulation_status"] = "NOT_RUN"
    circuit_state["simulation_signature"] = None
    circuit_state["simulation_error"] = None
    circuit_state["simulation_ready"] = False
    circuit_state["simulation_readiness_reason"] = REASON_SUPPLY_REQUIRED

    return supply_obj


def get_supply_configuration(circuit_state: Dict[str, Any]) -> Dict[str, Any]:
    """Retrieves current supply configuration or default unconfigured state."""
    supply = circuit_state.get("supply")
    if supply and isinstance(supply, dict):
        return supply
    return {
        "source_type": "DC_VOLTAGE",
        "source_id": "V1",
        "positive_node": None,
        "ground_node": None,
        "voltage": 0.0,
        "circuit_signature": circuit_state.get("circuit_signature", ""),
        "configured_at": None,
        "reference": "GROUND",
        "enabled": False,
        "status": STATUS_NOT_CONFIGURED
    }


def build_simulation_ready_circuit(circuit_state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Constructs a complete simulation-ready netlist for the existing MNA solver.
    Extracts verified component terminals and binds the configured voltage source.
    """
    supply = circuit_state.get("supply") or {}
    source_model = build_supply_source(supply)

    components_list: List[Dict[str, Any]] = []
    for c in circuit_state.get("components", []):
        cid = c.get("id") or c.get("designator", "C1")
        ctype = c.get("type") or c.get("class", "resistor")

        n1 = c.get("node1")
        n2 = c.get("node2")
        holes: List[str] = []

        terminals = c.get("terminals", [])
        if len(terminals) >= 2:
            n1 = terminals[0].get("node")
            n2 = terminals[1].get("node")
            h1 = terminals[0].get("hole")
            h2 = terminals[1].get("hole")
            if h1: holes.append(h1)
            if h2: holes.append(h2)
        elif len(terminals) == 1:
            n1 = terminals[0].get("node")
            if terminals[0].get("hole"): holes.append(terminals[0]["hole"])

        comp_dict = {
            "id": cid,
            "designator": cid,
            "type": ctype,
            "node1": n1,
            "node2": n2,
            "value": c.get("user_override_value") if c.get("user_override_value") is not None else (c.get("detected_value") or c.get("value")),
            "unit": c.get("unit", "Ω"),
            "properties": c.get("properties", {}),
            "holes": holes,
            "status": c.get("status", "VERIFIED")
        }
        components_list.append(comp_dict)

    nodes_set = _extract_circuit_nodes(circuit_state)
    if source_model.get("positive_node"):
        nodes_set.add(source_model["positive_node"])
    if source_model.get("negative_node"):
        nodes_set.add(source_model["negative_node"])

    netlist = {
        "circuit_id": circuit_state.get("circuit_signature", "sim_circuit"),
        "components": components_list,
        "power_sources": [source_model],
        "sources": [source_model],
        "nodes": sorted(list(nodes_set)),
        "status": "READY",
        "simulation_ready": True,
        "circuit_signature": circuit_state.get("circuit_signature", ""),
        "supply": supply
    }

    return netlist


def run_deterministic_mna_simulation(
    circuit_state: Dict[str, Any],
    expected_signature: Optional[str] = None,
    simulation_mode: Optional[str] = None,
    duration: Optional[float] = None,
    timestep: Optional[float] = None
) -> Dict[str, Any]:
    """
    Executes the MNA simulation engine with full safety checks:
    1. Validates circuit topology and supply configuration.
    2. Enforces signature freshness (rejects stale simulations).
    3. Builds simulation-ready netlist with injected voltage source.
    4. Executes existing deterministic MNA solver (DC or real Transient).
    5. Returns structured electrical results per Section 6 and Section 1 schemas.
    """
    current_sig = circuit_state.get("circuit_signature", "")

    # 1. Validate supply configuration and circuit safety
    val_res = validate_supply_configuration(circuit_state)
    if not val_res["valid"]:
        return {
            "status": STATUS_BLOCKED,
            "circuit_signature": current_sig,
            "error_code": val_res.get("error_code") or val_res.get("reason"),
            "reason": val_res["reason"],
            "message": val_res["message"],
            "detail": val_res["message"],
            "simulation_signature": None
        }

    # 2. Check for signature mismatch / stale circuit
    if expected_signature and expected_signature != current_sig:
        return {
            "status": STATUS_BLOCKED,
            "circuit_signature": current_sig,
            "error_code": REASON_STALE_CIRCUIT,
            "reason": REASON_STALE_CIRCUIT,
            "message": f"Simulation requested with stale signature '{expected_signature}', current is '{current_sig}'.",
            "detail": f"Simulation requested with stale signature '{expected_signature}', current is '{current_sig}'.",
            "simulation_signature": None
        }

    # 3. Build simulation-ready netlist
    netlist = build_simulation_ready_circuit(circuit_state)

    # 4. Check simulation mode: transient vs dc
    mode_str = str(simulation_mode or circuit_state.get("simulation_mode") or "dc").lower()

    if mode_str == "transient":
        t_stop = float(duration if duration is not None else circuit_state.get("transient_config", {}).get("duration", 0.01))
        dt = float(timestep if timestep is not None else circuit_state.get("transient_config", {}).get("dt", 0.0001))

        try:
            transient_res = solve_transient_mna(netlist, t_start=0.0, t_stop=t_stop, dt=dt)
        except Exception as e:
            return {
                "status": STATUS_ERROR,
                "circuit_signature": current_sig,
                "error_code": REASON_SOLVER_ERROR,
                "reason": REASON_SOLVER_ERROR,
                "message": f"Transient solver execution failed: {str(e)}",
                "detail": f"Transient solver execution failed: {str(e)}",
                "simulation_signature": None
            }

        if transient_res.get("status") == "ERROR":
            err_msg = transient_res.get("message", "Transient simulation failed to converge.")
            return {
                "status": STATUS_ERROR,
                "circuit_signature": current_sig,
                "error_code": transient_res.get("error_code", REASON_SOLVER_ERROR),
                "reason": REASON_SOLVER_ERROR,
                "message": err_msg,
                "detail": err_msg,
                "simulation_signature": None
            }

        # Build detailed measurements from last time point for UI compatibility
        time_pts = transient_res["time"]
        node_voltages_last = {nid: vals[-1] for nid, vals in transient_res["node_voltages"].items()}
        branch_currents_last = {cid: vals[-1] for cid, vals in transient_res["component_currents"].items()}
        comp_voltages_last = {cid: vals[-1] for cid, vals in transient_res["component_voltages"].items()}
        comp_power_last = {cid: vals[-1] for cid, vals in transient_res["component_power"].items()}

        detailed_measurements = {}
        for c in circuit_state.get("components", []):
            cid = c.get("id") or c.get("designator", "C1")
            ctype = c.get("type") or c.get("class", "resistor")
            i_val = branch_currents_last.get(cid, 0.0)
            v_val = comp_voltages_last.get(cid, 0.0)
            p_val = comp_power_last.get(cid, 0.0)
            detailed_measurements[cid] = {
                "id": cid,
                "type": ctype,
                "node1": c.get("node1"),
                "node2": c.get("node2"),
                "voltage_drop": round(v_val, 4),
                "current": round(i_val, 6),
                "power": round(p_val, 6),
                "state": "ACTIVE" if abs(i_val) > 1e-4 else ("CHARGED" if abs(v_val) > 0.01 else "STEADY"),
                "direction": "pin1_to_pin2" if i_val >= 0 else "pin2_to_pin1",
                "value": c.get("value"),
                "unit": c.get("unit", "")
            }

        supply_info = circuit_state.get("supply", {})
        source_id = supply_info.get("source_id", "V1")
        src_i = branch_currents_last.get(source_id, 0.0)
        src_v = comp_voltages_last.get(source_id, float(supply_info.get("voltage", 5.0)))
        src_p = comp_power_last.get(source_id, abs(src_v * src_i))

        sim_result = {
            "status": STATUS_SOLVED,
            "circuit_signature": current_sig,
            "simulation_signature": current_sig,
            "supply": {
                "source_type": supply_info.get("source_type", "DC_VOLTAGE"),
                "source_id": source_id,
                "positive_node": supply_info.get("positive_node"),
                "ground_node": supply_info.get("ground_node"),
                "voltage": supply_info.get("voltage")
            },
            "time": time_pts,
            "timestep": dt,
            "duration": round(t_stop, 9),
            "node_voltages": transient_res["node_voltages"],
            "component_currents": transient_res["component_currents"],
            "component_voltages": transient_res["component_voltages"],
            "component_power": transient_res["component_power"],
            "waveforms": transient_res["waveforms"],
            "diagnostics": [],
            "results": {
                "node_voltages": node_voltages_last,
                "branch_currents": branch_currents_last,
                "component_power": comp_power_last,
                "measurements": detailed_measurements,
                "total_current_mA": round(abs(src_i) * 1000.0, 4),
                "total_power_mW": round(abs(src_p) * 1000.0, 4)
            },
            "source": "transient_mna_simulation",
            "is_measured": False,
            "physical_validation_status": "NOT PERFORMED"
        }

        # Store in circuit state
        circuit_state["simulation_result"] = sim_result
        circuit_state["simulation_status"] = STATUS_SOLVED
        circuit_state["simulation_signature"] = current_sig
        circuit_state["simulation_error"] = None

        return sim_result

    # 4b. Invoke deterministic DC MNA solver
    try:
        solver_res: SolverResult = solve_dc_circuit(netlist)
    except Exception as e:
        return {
            "status": STATUS_ERROR,
            "circuit_signature": current_sig,
            "error_code": REASON_SOLVER_ERROR,
            "reason": REASON_SOLVER_ERROR,
            "message": f"Solver matrix execution failed: {str(e)}",
            "detail": f"Solver matrix execution failed: {str(e)}",
            "simulation_signature": None
        }

    if not solver_res.success:
        err_msg = solver_res.error.get("message") if solver_res.error else "Circuit matrix singular or solver failed to converge."
        return {
            "status": STATUS_ERROR,
            "circuit_signature": current_sig,
            "error_code": REASON_SOLVER_ERROR,
            "reason": REASON_SOLVER_ERROR,
            "message": err_msg,
            "detail": err_msg,
            "simulation_signature": None
        }

    # 5. Extract structured node voltages, branch currents, component voltages, and component power
    node_voltages: Dict[str, float] = {}
    for nid, v in solver_res.node_voltages.items():
        node_voltages[nid] = round(float(v), 4)

    branch_currents: Dict[str, float] = {}
    comp_voltages: Dict[str, float] = {}
    component_power: Dict[str, float] = {}
    detailed_measurements: Dict[str, Any] = {}

    for cid, m in solver_res.measurements.items():
        branch_currents[cid] = round(float(m.current), 6)
        comp_voltages[cid] = round(float(m.voltage_drop), 4)
        component_power[cid] = round(float(m.power), 6)
        detailed_measurements[cid] = {
            "id": m.id,
            "type": m.type,
            "node1": m.node1,
            "node2": m.node2,
            "voltage_a": round(float(m.voltage_a), 4),
            "voltage_b": round(float(m.voltage_b), 4),
            "voltage_drop": round(float(m.voltage_drop), 4),
            "current": round(float(m.current), 6),
            "power": round(float(m.power), 6),
            "state": m.state,
            "direction": m.direction,
            "value": m.value,
            "unit": m.unit,
            "formatted_value": m.formatted_value
        }

    # Compute source current for V1
    supply_info = circuit_state.get("supply", {})
    source_id = supply_info.get("source_id", "V1")
    if source_id not in branch_currents:
        src_i = round(solver_res.total_current_mA / 1000.0, 6)
        branch_currents[source_id] = src_i
        comp_voltages[source_id] = round(float(supply_info.get("voltage", 5.0)), 4)
        component_power[source_id] = round(solver_res.total_power_mW / 1000.0, 6)

    # Time series representation for DC steady state
    time_pts = [0.0, 0.002, 0.004, 0.006, 0.008, 0.010]
    waveforms = {
        "node_voltages": {nid: [v] * len(time_pts) for nid, v in node_voltages.items()},
        "component_currents": {cid: [branch_currents[cid]] * len(time_pts) for cid in branch_currents},
        "component_voltages": {cid: [comp_voltages[cid]] * len(time_pts) for cid in comp_voltages},
        "component_power": {cid: [component_power[cid]] * len(time_pts) for cid in component_power}
    }
    # Direct signal waveform traces (e.g. V(NODE_1), I(R1), I(L1), I(C1), P(R1))
    for nid, v in node_voltages.items():
        waveforms[f"V({nid})"] = [v] * len(time_pts)
    for cid in branch_currents:
        waveforms[f"I({cid})"] = [branch_currents[cid] * 1000.0] * len(time_pts) # in mA
    for cid in comp_voltages:
        waveforms[f"V({cid})"] = [comp_voltages[cid]] * len(time_pts)
    for cid in component_power:
        waveforms[f"P({cid})"] = [component_power[cid] * 1000.0] * len(time_pts) # in mW

    sim_result = {
        "status": STATUS_SOLVED,
        "circuit_signature": current_sig,
        "simulation_signature": current_sig,
        "supply": {
            "source_type": supply_info.get("source_type", "DC_VOLTAGE"),
            "source_id": supply_info.get("source_id", "V1"),
            "positive_node": supply_info.get("positive_node"),
            "ground_node": supply_info.get("ground_node"),
            "voltage": supply_info.get("voltage")
        },
        "node_voltages": node_voltages,
        "component_currents": branch_currents,
        "component_voltages": comp_voltages,
        "component_power": component_power,
        "time": time_pts,
        "waveforms": waveforms,
        "diagnostics": [],
        "results": {
            "node_voltages": node_voltages,
            "branch_currents": branch_currents,
            "component_power": component_power,
            "measurements": detailed_measurements,
            "total_current_mA": round(solver_res.total_current_mA, 4),
            "total_power_mW": round(solver_res.total_power_mW, 4)
        },
        "source": "deterministic_mna_solver",
        "is_measured": False,
        "physical_validation_status": "NOT PERFORMED"
    }

    # Store in circuit state
    circuit_state["simulation_result"] = sim_result
    circuit_state["simulation_status"] = STATUS_SOLVED
    circuit_state["simulation_signature"] = current_sig
    circuit_state["simulation_error"] = None

    return sim_result
