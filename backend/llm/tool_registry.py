"""
SmartBreadboard 3D — LLM Tool Registry & Schema Validation (Phase 20.2 & 20.17)
Provides schema definitions, argument validation, and execution routing for deterministic tools.
Protects against prompt injection and unauthorized execution.
"""

from typing import Dict, Any, List, Optional
from core.circuit_tools import AVAILABLE_CIRCUIT_TOOLS, execute_circuit_tool

# JSON Schemas compatible with OpenAI / Gemini Function Calling format
TOOL_SCHEMAS = [
    {
        "name": "get_verified_circuit",
        "description": "Returns the complete verified circuit including all verified components, nodes, power supply, and validity.",
        "parameters": {
            "type": "object",
            "properties": {},
            "required": []
        }
    },
    {
        "name": "get_component",
        "description": "Returns detailed verified telemetry for a specific component by ID (e.g. 'R1', 'LED1', 'W1').",
        "parameters": {
            "type": "object",
            "properties": {
                "component_id": {
                    "type": "string",
                    "description": "The unique component designator or identifier (e.g. 'R1', 'LED1')."
                }
            },
            "required": ["component_id"]
        }
    },
    {
        "name": "get_component_connections",
        "description": "Returns the electrical nodes and adjacent connected components for a given component.",
        "parameters": {
            "type": "object",
            "properties": {
                "component_id": {
                    "type": "string",
                    "description": "The designator of the component to inspect connections for."
                }
            },
            "required": ["component_id"]
        }
    },
    {
        "name": "get_electrical_node",
        "description": "Returns the tie-point breadboard holes and connected component pins for a specific electrical node.",
        "parameters": {
            "type": "object",
            "properties": {
                "node_id": {
                    "type": "string",
                    "description": "The electrical node identifier (e.g. 'NODE_COL_10_TOP', 'NODE_POWER_VCC', 'NODE_GROUND')."
                }
            },
            "required": ["node_id"]
        }
    },
    {
        "name": "get_topology",
        "description": "Returns graph-based series, parallel, junction, and fault topology analysis.",
        "parameters": {
            "type": "object",
            "properties": {},
            "required": []
        }
    },
    {
        "name": "get_simulation_results",
        "description": "Returns verified numerical simulation results (voltages, branch currents, powers) from MNA solver.",
        "parameters": {
            "type": "object",
            "properties": {},
            "required": []
        }
    },
    {
        "name": "get_faults",
        "description": "Returns all detected circuit anomalies such as short circuits, open loops, or floating disconnected pins.",
        "parameters": {
            "type": "object",
            "properties": {},
            "required": []
        }
    },
    {
        "name": "get_component_measurements",
        "description": "Returns simulated voltage drop, branch current, and power dissipation for a specific component.",
        "parameters": {
            "type": "object",
            "properties": {
                "component_id": {
                    "type": "string",
                    "description": "The designator of the component (e.g. 'R1', 'LED1')."
                }
            },
            "required": ["component_id"]
        }
    },
    {
        "name": "get_terminal_mapping",
        "description": "Returns terminal positions, lead coordinates, and mapped breadboard holes for a component.",
        "parameters": {
            "type": "object",
            "properties": {
                "component_id": {
                    "type": "string",
                    "description": "The designator of the component."
                }
            },
            "required": ["component_id"]
        }
    },
    {
        "name": "get_hole_mapping",
        "description": "Returns start_hole and end_hole tie-point identifiers for a component.",
        "parameters": {
            "type": "object",
            "properties": {
                "component_id": {
                    "type": "string",
                    "description": "The designator of the component."
                }
            },
            "required": ["component_id"]
        }
    },
    {
        "name": "get_verification_diagnostics",
        "description": "Returns computer vision verification summary, breakdown, and rejection reasons.",
        "parameters": {
            "type": "object",
            "properties": {},
            "required": []
        }
    },
    {
        "name": "get_netlist_status",
        "description": "Returns netlist validity status (VALID / INVALID) and validation reason.",
        "parameters": {
            "type": "object",
            "properties": {},
            "required": []
        }
    },
    {
        "name": "get_solver_status",
        "description": "Returns MNA solver execution status (SOLVED, NOT_RUN, ERROR) and reason.",
        "parameters": {
            "type": "object",
            "properties": {},
            "required": []
        }
    },
    {
        "name": "get_ar_state",
        "description": "Returns AR tracking registration, homography matrix, and camera alignment metrics.",
        "parameters": {
            "type": "object",
            "properties": {},
            "required": []
        }
    },
    {
        "name": "simulate_verified_circuit",
        "description": "Executes the deterministic Modified Nodal Analysis (MNA) simulation on the verified circuit after pre-validation checks. Returns node voltages, branch currents, component power dissipation, and solver status.",
        "parameters": {
            "type": "object",
            "properties": {
                "force_rerun": {
                    "type": "boolean",
                    "description": "Optional flag to bypass cache and force re-running numerical solver."
                }
            },
            "required": []
        }
    },
    {
        "name": "get_correction_suggestions",
        "description": "Analyzes verified circuit state, detects ambiguous terminal mappings, unknown components, or short circuits, and returns deterministic correction suggestions for 1-click user confirmation.",
        "parameters": {
            "type": "object",
            "properties": {
                "component_id": {
                    "type": "string",
                    "description": "Optional component identifier to filter correction suggestions."
                }
            },
            "required": []
        }
    },
    {
        "name": "apply_circuit_correction",
        "description": "Applies a user-confirmed deterministic circuit correction with signature validation, topology rebuilding, and simulation cache invalidation.",
        "parameters": {
            "type": "object",
            "properties": {
                "proposal_id": {
                    "type": "string",
                    "description": "Unique proposal identifier."
                },
                "diagnostic_id": {
                    "type": "string",
                    "description": "Diagnostic identifier that generated the proposal."
                },
                "component_id": {
                    "type": "string",
                    "description": "Target component identifier."
                },
                "correction_type": {
                    "type": "string",
                    "description": "Correction action type (e.g. TERMINAL_HOLE_REMAP, USER_COMPONENT_DEFINITION)."
                },
                "circuit_signature": {
                    "type": "string",
                    "description": "Circuit topology hash signature for versioning protection."
                },
                "hole1": {
                    "type": "string",
                    "description": "Start breadboard tie-point hole."
                },
                "hole2": {
                    "type": "string",
                    "description": "End breadboard tie-point hole."
                },
                "user_confirmed": {
                    "type": "boolean",
                    "description": "Flag certifying explicit user confirmation."
                }
            },
            "required": ["component_id", "user_confirmed"]
        }
    },
    {
        "name": "get_visual_grounding",
        "description": "Returns the complete authoritative Visual Grounding Model for the active circuit, including verified components, canonical breadboard hole locations, physical-to-electrical connection mappings, nodes, and diagnostic states.",
        "parameters": {
            "type": "object",
            "properties": {},
            "required": []
        }
    }
]


def get_tool_definitions() -> List[Dict[str, Any]]:
    """Returns list of all available tool schemas."""
    return TOOL_SCHEMAS


def validate_tool_arguments(tool_name: str, arguments: Dict[str, Any]) -> tuple[bool, Optional[str]]:
    """Validates arguments against schema for tool."""
    schema = next((s for s in TOOL_SCHEMAS if s["name"] == tool_name), None)
    if not schema:
        return False, f"Unknown tool: {tool_name}"
    
    required = schema.get("parameters", {}).get("required", [])
    for req in required:
        if req not in arguments or arguments[req] is None or arguments[req] == "":
            return False, f"Missing required parameter '{req}' for tool '{tool_name}'."
    return True, None


def execute_assistant_tool(
    tool_name: str,
    circuit_state: Dict[str, Any],
    arguments: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """Execute assistant tool with arguments and circuit state."""
    args = arguments or {}
    is_valid, err = validate_tool_arguments(tool_name, args)
    if not is_valid:
        return {"status": "error", "error": err}
    return validate_and_execute_tool(tool_name, args, circuit_state)


def validate_and_execute_tool(
    tool_name: str,
    tool_args: Dict[str, Any],
    circuit_state: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Validates tool arguments against registered schemas and executes the tool securely.
    Guarantees that arbitrary functions or unauthorized actions cannot be invoked.
    """
    if tool_name not in AVAILABLE_CIRCUIT_TOOLS:
        return {
            "status": "error",
            "error": f"Tool '{tool_name}' is not a registered circuit tool."
        }

    # Security check: Ensure component_id and node_id are strings without injection characters
    clean_args = {}
    for k, v in tool_args.items():
        if isinstance(v, str):
            clean_val = "".join(ch for ch in v if ch.isalnum() or ch in "_-.")
            clean_args[k] = clean_val
        else:
            clean_args[k] = v

    return execute_circuit_tool(tool_name, clean_args, circuit_state)
