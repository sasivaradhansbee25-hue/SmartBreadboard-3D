"""
SmartBreadboard 3D — Provider-Agnostic LLM Layer (Phase 20.1 & 20.18)
Supports Gemini, OpenAI, and Deterministic Fallback providers.
Ensures the application never crashes if an external LLM API is unreachable.
"""

import os
import re
import json
import urllib.request
import urllib.error
from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional, Tuple

from .prompts import SYSTEM_PROMPT
from .tool_registry import TOOL_SCHEMAS, validate_and_execute_tool


class LLMProvider(ABC):
    """Abstract Base Class for LLM Assistant Providers."""

    @abstractmethod
    def generate_response(
        self,
        message: str,
        circuit_state: Dict[str, Any],
        conversation_history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """
        Executes reasoning and tool execution loop.
        Returns:
            {
                "answer": str,
                "tool_calls": List[Dict[str, Any]],
                "provider": str
            }
        """
        pass

    def chat(
        self,
        message: str,
        circuit_state: Dict[str, Any],
        conversation_history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """Alias for generate_response."""
        return self.generate_response(message, circuit_state, conversation_history)


class DeterministicFallbackProvider(LLMProvider):
    """
    Deterministic rule-based reasoning provider (Phase 20 & Phase 22.4).
    Executes exact tool calls based on user intent and formats mathematically
    consistent engineering responses. Guaranteed zero hallucinations and 100% testable.
    """

    def generate_response(
        self,
        message: str,
        circuit_state: Dict[str, Any],
        conversation_history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        from core.circuit_tools import compute_circuit_signature
        msg_lower = message.lower().strip()
        tool_calls: List[Dict[str, Any]] = []

        # Current circuit signature for freshness validation
        current_sig = compute_circuit_signature(circuit_state)

        netlist = circuit_state.get("netlist") or circuit_state
        comps_in_state = netlist.get("components", [])
        nodes_in_state = netlist.get("nodes", []) or circuit_state.get("node_graph", {}).get("nodes", [])

        # Vision verification and rejected detections
        vision_verif = circuit_state.get("vision_verification") or {}
        rejected_cands = vision_verif.get("rejected", []) or [
            c for c in vision_verif.get("all_candidates", [])
            if isinstance(c, dict) and (c.get("verification") == "REJECTED" or c.get("status") == "REJECTED")
        ]

        # ----------------------------------------------------
        # 0. Entity Extraction & Pronoun Resolution
        # ----------------------------------------------------
        # Find mentioned component IDs
        target_comp = None
        target_comp_2 = None
        target_node = None

        # Look for explicit node identifiers (e.g. NODE_1, NODE_2, NODE_GND, NODE_PWR)
        node_matches = re.findall(r"\b(NODE_[A-Za-z0-9_]+)\b", message, re.IGNORECASE)
        if node_matches:
            target_node = node_matches[0].upper()

        # Find component designators in active circuit
        found_comps = []
        for c in comps_in_state:
            cid = str(c.get("id") or c.get("designator") or "").strip()
            if cid and re.search(rf"\b{re.escape(cid)}\b", message, re.IGNORECASE):
                found_comps.append(cid)

        # Also check rejected candidates explicitly
        for r in rejected_cands:
            rid = str(r.get("id") or r.get("candidate_id") or "").strip()
            if rid and re.search(rf"\b{re.escape(rid)}\b", message, re.IGNORECASE):
                found_comps.append(rid)

        # Fallback to regex pattern matching for component identifiers (e.g. R1, LED1, R99)
        if not found_comps:
            comp_candidates = re.findall(r"\b([A-Za-z0-9_]+)\b", message)
            for cm in comp_candidates:
                if re.match(r"^(r\d+|led\d+|w\d+|d\d+|u\d+|c\d+|unk_\w+|u_\w+|rej_\w+|det_\w+)$", cm, re.IGNORECASE):
                    found_comps.append(cm.upper())

        if len(found_comps) >= 1:
            target_comp = found_comps[0]
        if len(found_comps) >= 2:
            target_comp_2 = found_comps[1]

        # Conversational Pronoun Resolution ("it", "the component", "this resistor")
        if not target_comp and conversation_history:
            if re.search(r"\b(it|this component|the component|this resistor|the resistor|the led)\b", msg_lower):
                for prev_item in reversed(conversation_history):
                    prev_text = prev_item.get("content", "") or prev_item.get("text", "")
                    for c in comps_in_state:
                        cid = str(c.get("id") or c.get("designator") or "").strip()
                        if cid and re.search(rf"\b{re.escape(cid)}\b", prev_text, re.IGNORECASE):
                            target_comp = cid
                            break
                    if target_comp:
                        break

        # ----------------------------------------------------
        # 1. Attempted Write Action / Mutation Block (Rule 24)
        # ----------------------------------------------------
        if any(w in msg_lower for w in ["add ", "insert ", "create ", "modify ", "delete ", "remove ", "change value", "move "]):
            return {
                "answer": "I operate in verified Read-Only mode to prevent accidental circuit corruption. To add or modify a component, please use the Phase 17 Manual Component Recovery modal with explicit component parameters (designator, value, start hole, end hole) and user confirmation.",
                "tool_calls": [],
                "provider": "deterministic_fallback"
            }

        # ----------------------------------------------------
        # 2. Rejection & Non-Existent Entity Validation (Rule 5 & 15)
        # ----------------------------------------------------
        # Check if user explicitly asked about a rejected candidate
        if target_comp and any(r.get("id") == target_comp or r.get("candidate_id") == target_comp for r in rejected_cands):
            return {
                "answer": f"Detection '{target_comp}' was rejected by computer vision verification and is not part of the verified circuit.",
                "tool_calls": [],
                "provider": "deterministic_fallback"
            }

        # Check if asked component doesn't exist in verified state
        if target_comp and not any(c.get("id") == target_comp or c.get("designator") == target_comp for c in comps_in_state):
            # Only flag if not asking about general topics
            if not any(k in msg_lower for k in ["simulate", "parallel", "series", "fault", "overview", "summary", "how many"]):
                return {
                    "answer": f"Component '{target_comp}' is not present in the current verified circuit.",
                    "tool_calls": [],
                    "provider": "deterministic_fallback"
                }

        # Check if asked node doesn't exist
        if target_node and not any(n.get("id") == target_node for n in nodes_in_state):
            node_tool_res = validate_and_execute_tool("get_electrical_node", {"node_id": target_node}, circuit_state)
            tool_calls.append({"tool": "get_electrical_node", "args": {"node_id": target_node}, "result": node_tool_res})
            if not node_tool_res.get("found"):
                return {
                    "answer": f"Node '{target_node}' is not present in the current verified circuit.",
                    "tool_calls": tool_calls,
                    "provider": "deterministic_fallback"
                }

        # ----------------------------------------------------
        # 3. Highlight Actions (Rule 14 & 15)
        # ----------------------------------------------------
        if "highlight " in msg_lower or "show " in msg_lower or "find " in msg_lower or "locate " in msg_lower:
            if target_node:
                n_res = validate_and_execute_tool("get_electrical_node", {"node_id": target_node}, circuit_state)
                tool_calls.append({"tool": "get_electrical_node", "args": {"node_id": target_node}, "result": n_res})
                if n_res.get("found"):
                    return {
                        "answer": f"Highlighting node **{target_node}** in the visual circuit overlay.",
                        "action": "HIGHLIGHT_NODE",
                        "node_id": target_node,
                        "tool_calls": tool_calls,
                        "provider": "deterministic_fallback"
                    }
                else:
                    return {
                        "answer": f"Node '{target_node}' is not present in the current verified circuit.",
                        "tool_calls": tool_calls,
                        "provider": "deterministic_fallback"
                    }

            if target_comp:
                c_res = validate_and_execute_tool("get_component", {"component_id": target_comp}, circuit_state)
                tool_calls.append({"tool": "get_component", "args": {"component_id": target_comp}, "result": c_res})
                if c_res.get("found"):
                    return {
                        "answer": f"Highlighting component **{target_comp}** in the visual circuit overlay.",
                        "action": "HIGHLIGHT_COMPONENT",
                        "component_id": target_comp,
                        "tool_calls": tool_calls,
                        "provider": "deterministic_fallback"
                    }
                else:
                    return {
                        "answer": f"Component '{target_comp}' is not present in the current verified circuit.",
                        "tool_calls": tool_calls,
                        "provider": "deterministic_fallback"
                    }

        # ----------------------------------------------------
        # 4. Simulation Orchestration ("Simulate this circuit", "Run simulation")
        # ----------------------------------------------------
        if "simulate" in msg_lower or "run simulation" in msg_lower or "run the simulation" in msg_lower or "execute simulation" in msg_lower or "start simulation" in msg_lower:
            c_res = validate_and_execute_tool("get_verified_circuit", {}, circuit_state)
            tool_calls.append({"tool": "get_verified_circuit", "args": {}, "result": c_res})

            net_res = validate_and_execute_tool("get_netlist_status", {}, circuit_state)
            tool_calls.append({"tool": "get_netlist_status", "args": {}, "result": net_res})

            f_res = validate_and_execute_tool("get_faults", {}, circuit_state)
            tool_calls.append({"tool": "get_faults", "args": {}, "result": f_res})

            force = "force" in msg_lower or "rerun" in msg_lower
            sim_exec = validate_and_execute_tool("simulate_verified_circuit", {"force_rerun": force}, circuit_state)
            tool_calls.append({"tool": "simulate_verified_circuit", "args": {"force_rerun": force}, "result": sim_exec})

            status = sim_exec.get("status")
            if status == "BLOCKED":
                reason = sim_exec.get("reason", "Pre-simulation validation checks blocked execution.")
                sugg_res = validate_and_execute_tool("get_correction_suggestions", {}, circuit_state)
                tool_calls.append({"tool": "get_correction_suggestions", "args": {}, "result": sugg_res})
                suggestions = sugg_res.get("suggestions", [])
                
                sugg_text = ""
                if suggestions:
                    sugg_lines = [f"- **{s['component_id']}**: {s['description']}" for s in suggestions]
                    sugg_text = "\n\n**Deterministic Correction Suggestions:**\n" + "\n".join(sugg_lines) + "\n\nClick **Confirm & Apply** below to apply the verified mapping, rebuild topology, and run MNA simulation."

                answer = f"I cannot run the simulation yet.\n\n{reason}{sugg_text}"
                return {
                    "answer": answer,
                    "tool_calls": tool_calls,
                    "provider": "deterministic_fallback",
                    "simulation_result": None,
                    "suggestions": suggestions
                }
            elif status == "ERROR":
                reason = sim_exec.get("reason", "Numerical solver failure.")
                answer = f"Simulation encountered a numerical solver error: {reason}"
                return {"answer": answer, "tool_calls": tool_calls, "provider": "deterministic_fallback", "simulation_result": None}
            else:
                # SOLVED
                node_v = sim_exec.get("node_voltages", {})
                b_currents = sim_exec.get("branch_currents", {})
                power = sim_exec.get("power", {})
                tot_p = power.get("total_power_mW", 0.0)
                cached_note = " (reused valid cached result)" if sim_exec.get("cached") else ""

                v_lines = [f"{nid}: {volt:.3f} V" for nid, volt in node_v.items()]
                v_str = ", ".join(v_lines) if v_lines else "None"

                i_lines = [f"{cid}: {curr*1000:.2f} mA" for cid, curr in b_currents.items()]
                i_str = ", ".join(i_lines) if i_lines else "None"

                answer = f"Simulation completed successfully{cached_note}.\n\nThe verified circuit was solved using the MNA solver.\n\nThe solver reports:\n- Node Voltages: {v_str}\n- Branch Currents: {i_str}\n- Total Power: {tot_p:.2f} mW\n\nThe Digital Twin and electrical visualization have been updated with the simulation state."
                return {
                    "answer": answer,
                    "tool_calls": tool_calls,
                    "provider": "deterministic_fallback",
                    "simulation_result": sim_exec.get("results")
                }

        # ----------------------------------------------------
        # 5. Ambiguity & Correction Suggestions
        # ----------------------------------------------------
        if "fix" in msg_lower or "suggest" in msg_lower or "ambiguous" in msg_lower or "unknown" in msg_lower or "correct" in msg_lower or "repair" in msg_lower:
            s_res = validate_and_execute_tool("get_correction_suggestions", {"component_id": target_comp} if target_comp else {}, circuit_state)
            tool_calls.append({"tool": "get_correction_suggestions", "args": {"component_id": target_comp} if target_comp else {}, "result": s_res})
            suggestions = s_res.get("suggestions", [])
            
            if suggestions:
                sugg_lines = [f"- **{s['component_id']}** ({s['issue']}): {s['description']}" for s in suggestions]
                answer = f"I analyzed the circuit for ambiguous mappings and unknown components:\n\n" + "\n".join(sugg_lines) + "\n\nYou can click **Confirm & Apply** on any suggestion card to update the verified mapping, rebuild the electrical topology, and re-simulate."
            else:
                answer = "All components have verified hole mappings with no ambiguity or unknown components detected."

            return {
                "answer": answer,
                "tool_calls": tool_calls,
                "provider": "deterministic_fallback",
                "suggestions": suggestions
            }

        # ----------------------------------------------------
        # 6. Visual Location & Combined Questions ("Where is R1?", "Where is R1 placed?", "Where is R1 and what is its current?")
        # ----------------------------------------------------
        if target_comp and any(w in msg_lower for w in ["where is", "where's", "placed", "location", "position", "which holes", "which hole"]):
            c_res = validate_and_execute_tool("get_component", {"component_id": target_comp}, circuit_state)
            tool_calls.append({"tool": "get_component", "args": {"component_id": target_comp}, "result": c_res})
            
            h1 = c_res.get("start_hole") or "Unmapped"
            h2 = c_res.get("end_hole") or "Unmapped"

            # Check for ambiguity in mapping
            if any(h in ["AMBIGUOUS", "UNKNOWN", None, "Unmapped"] for h in [h1, h2]):
                answer = f"{target_comp} terminal mapping is ambiguous or not mapped (mapped: {h1} to {h2}). The system has not verified which hole is correct."
            # Check if user also asked about simulation in combined question (Rule 16)
            elif "current" in msg_lower or "voltage" in msg_lower or "power" in msg_lower:
                sim_res = validate_and_execute_tool("get_simulation_results", {}, circuit_state)
                tool_calls.append({"tool": "get_simulation_results", "args": {}, "result": sim_res})
                b_curr = sim_res.get("branch_currents", {}).get(target_comp)
                if b_curr is not None and sim_res.get("solver_status") == "SOLVED":
                    answer = f"{target_comp} is mapped between {h1} and {h2}. The latest valid MNA simulation shows {b_curr*1000:.2f} mA through {target_comp}."
                else:
                    answer = f"{target_comp} is mapped between {h1} and {h2}. Simulation current is not available yet."
            else:
                answer = f"{target_comp} is mapped between {h1} and {h2}."

            return {"answer": answer, "tool_calls": tool_calls, "provider": "deterministic_fallback"}

        # ----------------------------------------------------
        # 7. Specific Component Current / Voltage / Power / Conduction (Simulation Result)
        # ----------------------------------------------------
        if target_comp and ("current" in msg_lower or "voltage" in msg_lower or "glow" in msg_lower or "power" in msg_lower or "conducting" in msg_lower or "drop" in msg_lower):
            sim_res = validate_and_execute_tool("get_simulation_results", {}, circuit_state)
            tool_calls.append({"tool": "get_simulation_results", "args": {}, "result": sim_res})

            sim_data = circuit_state.get("electrical_analysis") or circuit_state.get("simulationResult") or {}
            if not sim_res.get("has_simulation") or sim_res.get("solver_status") == "NOT_RUN" or not sim_data or sim_data.get("solver_status") == "NOT_RUN":
                return {
                    "answer": f"The simulation has not been run yet. The circuit has not been simulated yet. Run a simulation to calculate branch currents, voltages, and power for {target_comp}.",
                    "tool_calls": tool_calls,
                    "provider": "deterministic_fallback"
                }

            # Check for stale simulation (Rule 11)
            sim_sig = sim_data.get("circuit_signature") or circuit_state.get("simulation_signature")
            is_stale = bool(sim_sig and current_sig and sim_sig != current_sig)

            if is_stale:
                return {
                    "answer": "The previous simulation is stale because the circuit changed. Run a new simulation before using voltage/current/power values.",
                    "tool_calls": tool_calls,
                    "provider": "deterministic_fallback"
                }

            branch_currents = sim_res.get("branch_currents", {})
            node_voltages = sim_res.get("node_voltages", {})
            comp_powers = sim_res.get("component_powers", {})
            measurements = sim_res.get("measurements", {})

            # Extract current (A or mA)
            raw_i = branch_currents.get(target_comp)
            if raw_i is None and target_comp in measurements:
                raw_i = measurements[target_comp].get("current_a") or measurements[target_comp].get("current", 0.0)
            i_ma = (raw_i * 1000.0) if raw_i is not None else 0.0

            # Extract power (W or mW)
            raw_p = comp_powers.get(target_comp)
            if raw_p is None and target_comp in measurements:
                raw_p = measurements[target_comp].get("power_w") or measurements[target_comp].get("power", 0.0)
            p_mw = (raw_p * 1000.0) if raw_p is not None else 0.0

            # Extract voltage across component terminals
            c_info = validate_and_execute_tool("get_component", {"component_id": target_comp}, circuit_state)
            v_drop = 0.0
            terminals = c_info.get("terminals", {})
            if isinstance(terminals, dict) and len(terminals) >= 2:
                n_ids = [t.get("node_id") or t.get("electrical_node") for t in terminals.values() if isinstance(t, dict) and (t.get("node_id") or t.get("electrical_node"))]
                if len(n_ids) >= 2:
                    v1 = node_voltages.get(n_ids[0], 0.0)
                    v2 = node_voltages.get(n_ids[1], 0.0)
                    v_drop = abs(v1 - v2)
            if v_drop == 0.0 and target_comp in measurements:
                v_drop = measurements[target_comp].get("voltage_v") or measurements[target_comp].get("voltage", 0.0)

            state = "ON" if i_ma > 1.0 else "OFF"

            if "led" in target_comp.lower() and ("glow" in msg_lower or "conducting" in msg_lower):
                if state == "ON" and i_ma >= 5.0:
                    answer = f"{target_comp} is conducting forward current ({i_ma:.2f} mA at {v_drop:.2f} V) according to the latest MNA simulation."
                else:
                    answer = f"{target_comp} is NOT conducting/glowing because simulated forward current is {i_ma:.2f} mA (Voltage: {v_drop:.2f} V) according to the latest MNA simulation."
            elif "voltage" in msg_lower:
                answer = f"The voltage across {target_comp} is {v_drop:.2f} V according to the latest MNA simulation."
            elif "current" in msg_lower:
                answer = f"{target_comp} current is {i_ma:.2f} mA according to the latest MNA simulation."
            elif "power" in msg_lower:
                answer = f"{target_comp} power is {p_mw:.2f} mW according to the latest MNA simulation."
            else:
                answer = f"According to the latest MNA simulation: {target_comp} Voltage = {v_drop:.2f} V, Branch Current = {i_ma:.2f} mA, Power = {p_mw:.2f} mW."

            return {"answer": answer, "tool_calls": tool_calls, "provider": "deterministic_fallback"}

        # ----------------------------------------------------
        # 7. Node Questions ("What is connected to NODE_2?", "Which components are on NODE_1?")
        # ----------------------------------------------------
        if target_node or ("node" in msg_lower and re.search(r"node[_\s]?\w+", msg_lower)):
            n_id = target_node or (re.search(r"node[_\s]?\w+", msg_lower).group(0).replace(" ", "_").upper())
            n_res = validate_and_execute_tool("get_electrical_node", {"node_id": n_id}, circuit_state)
            tool_calls.append({"tool": "get_electrical_node", "args": {"node_id": n_id}, "result": n_res})

            if not n_res.get("found"):
                return {
                    "answer": f"Node '{n_id}' is not present in the current verified circuit.",
                    "tool_calls": tool_calls,
                    "provider": "deterministic_fallback"
                }

            pins = n_res.get("connected_pins", [])
            pins_str = ", ".join(pins) if pins else "none"
            wires = n_res.get("connected_wires", [])
            wires_str = f" {', '.join(wires)} also participate in this node." if wires else ""
            voltage = n_res.get("voltage_v")
            v_str = f" The simulated node voltage is {voltage:.2f} V according to the latest MNA simulation." if voltage is not None else " Node voltage is not simulated yet."

            answer = f"{n_id} connects terminal pins: {pins_str}.{wires_str}{v_str}"
            return {"answer": answer, "tool_calls": tool_calls, "provider": "deterministic_fallback"}

        # ----------------------------------------------------
        # 8. Parallel & Series Topology Questions (Rule 9 & 21)
        # ----------------------------------------------------
        if "parallel" in msg_lower:
            tool_res = validate_and_execute_tool("get_topology", {}, circuit_state)
            tool_calls.append({"tool": "get_topology", "args": {}, "result": tool_res})

            topo = tool_res.get("topology", {})
            par_groups = topo.get("parallel_groups", [])

            if target_comp and target_comp_2:
                is_par = any(
                    (isinstance(g, dict) and target_comp in g.get("components", []) and target_comp_2 in g.get("components", [])) or
                    (isinstance(g, list) and target_comp in g and target_comp_2 in g)
                    for g in par_groups
                )
                if is_par:
                    answer = f"{target_comp} and {target_comp_2} are connected between the same two verified electrical nodes, so the current circuit topology identifies them as parallel."
                else:
                    answer = f"{target_comp} and {target_comp_2} do not share both electrical nodes, so they are not in parallel in the verified topology."
                return {"answer": answer, "tool_calls": tool_calls, "provider": "deterministic_fallback"}

            if par_groups:
                explanations = []
                for g in par_groups:
                    if isinstance(g, dict):
                        explanations.append(g.get("explanation", f"Parallel group: {g.get('components')}"))
                    elif isinstance(g, list):
                        explanations.append(f"Components {' and '.join(g)} form parallel branches across identical electrical nodes.")
                answer = "Verified Parallel Topology:\n" + "\n".join(f"- {e}" for e in explanations)
            else:
                answer = "No parallel component branches were detected in the verified electrical topology."
            return {"answer": answer, "tool_calls": tool_calls, "provider": "deterministic_fallback"}

        if "series" in msg_lower:
            tool_res = validate_and_execute_tool("get_topology", {}, circuit_state)
            tool_calls.append({"tool": "get_topology", "args": {}, "result": tool_res})

            topo = tool_res.get("topology", {})
            ser_groups = topo.get("series_groups", [])

            if target_comp and target_comp_2:
                is_ser = any(
                    (isinstance(g, dict) and target_comp in g.get("components", []) and target_comp_2 in g.get("components", [])) or
                    (isinstance(g, list) and target_comp in g and target_comp_2 in g)
                    for g in ser_groups
                )
                if is_ser:
                    answer = f"{target_comp} and {target_comp_2} share an unbranched intermediate electrical node, so they are connected in series."
                else:
                    answer = f"{target_comp} and {target_comp_2} do not share a series intermediate node in the verified topology."
                return {"answer": answer, "tool_calls": tool_calls, "provider": "deterministic_fallback"}

            if ser_groups:
                explanations = []
                for g in ser_groups:
                    if isinstance(g, dict):
                        explanations.append(g.get("explanation", f"Series group: {g.get('components')}"))
                    elif isinstance(g, list):
                        explanations.append(f"Components {' and '.join(g)} are connected in series through an intermediate electrical node.")
                answer = "Verified Series Topology:\n" + "\n".join(f"- {e}" for e in explanations)
            else:
                answer = "No series component pairs were detected sharing an unbranched intermediate node."
            return {"answer": answer, "tool_calls": tool_calls, "provider": "deterministic_fallback"}

        # ----------------------------------------------------
        # 9. Faults / Blocked / Invalid Circuit Questions (Rule 12)
        # ----------------------------------------------------
        if any(w in msg_lower for w in ["fault", "short", "disconnected", "invalid", "blocked", "why is my circuit", "why is the circuit"]):
            f_res = validate_and_execute_tool("get_faults", {}, circuit_state)
            tool_calls.append({"tool": "get_faults", "args": {}, "result": f_res})
            net_res = validate_and_execute_tool("get_netlist_status", {}, circuit_state)
            tool_calls.append({"tool": "get_netlist_status", "args": {}, "result": net_res})

            shorts = f_res.get("short_circuits", [])
            floating = f_res.get("floating_components", [])
            errors = f_res.get("errors", [])
            validity = "INVALID" if (errors or shorts or not f_res.get("valid")) else "VALID"

            fault_msgs = []
            for err in errors:
                fault_msgs.append(f"Validation Error: {err}")
            for s in shorts:
                cid = s.get("component_id", "Component")
                fault_msgs.append(f"Short Circuit on {cid}: {s.get('reason')}")
            for fl in floating:
                fault_msgs.append(f"Floating Pin / Disconnected: {fl}")

            # Check for unknown / ambiguous components
            for c in comps_in_state:
                cid = c.get("id") or c.get("designator")
                if c.get("verification") == "UNKNOWN" or c.get("type") == "unknown":
                    fault_msgs.append(f"Unknown component detected ({cid}): Requires manual definition of type and value.")
                if c.get("start_hole") == "AMBIGUOUS" or c.get("end_hole") == "AMBIGUOUS":
                    fault_msgs.append(f"Ambiguous terminal mapping on {cid}: Requires confirmed hole assignment.")

            if fault_msgs:
                answer = f"Circuit Blocked / Issues Detected (Status: {validity}):\n" + "\n".join(f"- {m}" for m in fault_msgs)
            else:
                answer = f"No short circuits or floating components detected. Netlist status is {validity}."
            return {"answer": answer, "tool_calls": tool_calls, "provider": "deterministic_fallback"}



        # ----------------------------------------------------
        # 11. Specific Component Details & Connections Questions (Rule 6 & 7)
        # ----------------------------------------------------
        if target_comp:
            c_res = validate_and_execute_tool("get_component", {"component_id": target_comp}, circuit_state)
            tool_calls.append({"tool": "get_component", "args": {"component_id": target_comp}, "result": c_res})

            if not c_res.get("found"):
                return {
                    "answer": f"Component '{target_comp}' is not present in the verified circuit.",
                    "tool_calls": tool_calls,
                    "provider": "deterministic_fallback"
                }

            if c_res.get("verification") == "UNKNOWN" or not c_res.get("verified"):
                return {
                    "answer": f"Component {target_comp} is not verified (verification: UNKNOWN). I don't have a verified value for this component yet.",
                    "tool_calls": tool_calls,
                    "provider": "deterministic_fallback"
                }

            h1 = c_res.get("start_hole")
            h2 = c_res.get("end_hole")

            if h1 == "AMBIGUOUS" or h2 == "AMBIGUOUS":
                return {
                    "answer": f"Component {target_comp} terminal B has an ambiguous mapping. The system has not verified which hole is correct.",
                    "tool_calls": tool_calls,
                    "provider": "deterministic_fallback"
                }

            # If user asks why target_comp is connected to target_comp_2
            if target_comp_2:
                conn_res = validate_and_execute_tool("get_component_connections", {"component_id": target_comp}, circuit_state)
                tool_calls.append({"tool": "get_component_connections", "args": {"component_id": target_comp}, "result": conn_res})
                c2_res = validate_and_execute_tool("get_component", {"component_id": target_comp_2}, circuit_state)
                tool_calls.append({"tool": "get_component", "args": {"component_id": target_comp_2}, "result": c2_res})

                # Check shared nodes
                t1 = c_res.get("terminals", {})
                t2 = c2_res.get("terminals", {})
                shared_nodes = []
                for k1, v1 in t1.items():
                    for k2, v2 in t2.items():
                        n1 = v1.get("electrical_node") or v1.get("node_id")
                        n2 = v2.get("electrical_node") or v2.get("node_id")
                        if n1 and n2 and n1 == n2:
                            shared_nodes.append((n1, v1.get("hole"), v2.get("hole")))

                if shared_nodes:
                    sn_name = shared_nodes[0][0]
                    answer = f"{target_comp} and {target_comp_2} share {sn_name}. {target_comp} terminal is mapped to {shared_nodes[0][1]}, and {target_comp_2} terminal is also connected to {sn_name}. Therefore, they are electrically connected through that verified node."
                else:
                    answer = f"{target_comp} and {target_comp_2} do not share a direct verified electrical node in the active circuit."
                return {"answer": answer, "tool_calls": tool_calls, "provider": "deterministic_fallback"}

            # If user asks "what is connected to R1?" or "where is R1 connected?"
            if "connected" in msg_lower or "adjacent" in msg_lower or "neighbors" in msg_lower:
                conn_res = validate_and_execute_tool("get_component_connections", {"component_id": target_comp}, circuit_state)
                tool_calls.append({"tool": "get_component_connections", "args": {"component_id": target_comp}, "result": conn_res})
                adj = conn_res.get("adjacent_components", [])
                adj_str = ", ".join(adj) if adj else "none (no shared terminal holes)"
                answer = f"{target_comp} is connected to {adj_str} across its terminal nodes."
                return {"answer": answer, "tool_calls": tool_calls, "provider": "deterministic_fallback"}

            # Standard "What is R1?"
            terminals = c_res.get("terminals", {})
            tA_node = terminals.get("terminal_a", {}).get("electrical_node") or c_res.get("component", {}).get("node1") or "NODE_1"
            tB_node = terminals.get("terminal_b", {}).get("electrical_node") or c_res.get("component", {}).get("node2") or "NODE_2"
            val_str = f"{c_res.get('value')} {c_res.get('unit')}".strip() if c_res.get("value") is not None else ""
            c_type = c_res.get("type", "component")
            provenance_tag = " (manual / user-confirmed source)" if (c_res.get("source") == "manual" or c_res.get("component", {}).get("provenance") in ["USER_CONFIRMED", "MANUAL"]) else ""
            answer = f"{target_comp} is a verified {val_str} {c_type}{provenance_tag}. Its terminals are mapped to {h1} and {h2}. Terminal A belongs to {tA_node} and terminal B belongs to {tB_node}."
            return {"answer": answer, "tool_calls": tool_calls, "provider": "deterministic_fallback"}

        # ----------------------------------------------------
        # 12. Visual Grounding & General Physical Layout Questions
        # ----------------------------------------------------
        if "grounding" in msg_lower or "physical" in msg_lower or "layout" in msg_lower or "explain circuit" in msg_lower:
            vg_res = validate_and_execute_tool("get_visual_grounding", {}, circuit_state)
            tool_calls.append({"tool": "get_visual_grounding", "args": {}, "result": vg_res})
            
            h_desc = vg_res.get("human_description", "")
            summary = vg_res.get("summary", {})
            status = vg_res.get("overall_status", "UNKNOWN")
            
            answer = f"Visual Grounding State (Status: {status}):\n\n{h_desc}\n\nGrounding Summary: {summary.get('verified_components', 0)} verified components, {summary.get('verified_connections', 0)} verified physical-to-electrical connections across {summary.get('verified_nodes', 0)} nodes."
            return {"answer": answer, "tool_calls": tool_calls, "provider": "deterministic_fallback"}

        # ----------------------------------------------------
        # 13. Count / Overview Questions
        # ----------------------------------------------------
        if "how many" in msg_lower or "verified components" in msg_lower or "what components" in msg_lower or "overview" in msg_lower or "summary" in msg_lower:
            tool_res = validate_and_execute_tool("get_verified_circuit", {}, circuit_state)
            tool_calls.append({"tool": "get_verified_circuit", "args": {}, "result": tool_res})

            comps = tool_res.get("components", [])
            comp_descs = [f"{c['id']} ({c['type']}, {c.get('value', '')} {c.get('unit', '')})".strip() for c in comps]
            comp_list_str = ", ".join(comp_descs) if comp_descs else "None"

            answer = f"The verified circuit currently contains {len(comps)} verified components: {comp_list_str}. Circuit validity is {tool_res.get('circuit_validity')}, and MNA solver status is {tool_res.get('solver_status')}."
            return {"answer": answer, "tool_calls": tool_calls, "provider": "deterministic_fallback"}

        # Default: Return verified circuit summary
        c_res = validate_and_execute_tool("get_verified_circuit", {}, circuit_state)
        tool_calls.append({"tool": "get_verified_circuit", "args": {}, "result": c_res})
        comps = c_res.get("components", [])
        return {
            "answer": f"I inspected the verified circuit ({len(comps)} components, status: {c_res.get('circuit_validity')}, MNA: {c_res.get('solver_status')}). You can ask me about component terminals, series/parallel topology, branch currents, voltages, or circuit faults.",
            "tool_calls": tool_calls,
            "provider": "deterministic_fallback"
        }



class GeminiProvider(LLMProvider):
    """
    Google Gemini Provider using REST API with tool-calling loop.
    """

    def __init__(self, api_key: str, model_name: str = "gemini-1.5-flash"):
        self.api_key = api_key
        self.model_name = model_name

    def generate_response(
        self,
        message: str,
        circuit_state: Dict[str, Any],
        conversation_history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        # If no key, fallback immediately
        if not self.api_key:
            return DeterministicFallbackProvider().generate_response(message, circuit_state, conversation_history)

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model_name}:generateContent?key={self.api_key}"

        # Convert TOOL_SCHEMAS to Gemini functionDeclarations format
        function_declarations = []
        for s in TOOL_SCHEMAS:
            function_declarations.append({
                "name": s["name"],
                "description": s["description"],
                "parameters": s["parameters"]
            })

        # Format system prompt and conversation
        contents = []
        if conversation_history:
            for item in conversation_history[-4:]:
                role = "user" if item.get("role") == "user" else "model"
                contents.append({"role": role, "parts": [{"text": item.get("content", "")}]})

        contents.append({"role": "user", "parts": [{"text": message}]})

        payload = {
            "systemInstruction": {"parts": [{"text": SYSTEM_PROMPT}]},
            "contents": contents,
            "tools": [{"functionDeclarations": function_declarations}]
        }

        tool_calls_trace = []

        try:
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=12) as response:
                res_data = json.loads(response.read().decode("utf-8"))

            candidates = res_data.get("candidates", [])
            if not candidates:
                return DeterministicFallbackProvider().generate_response(message, circuit_state, conversation_history)

            content = candidates[0].get("content", {})
            parts = content.get("parts", [])

            # Check for functionCall
            function_call = next((p["functionCall"] for p in parts if "functionCall" in p), None)
            if function_call:
                fn_name = function_call.get("name")
                fn_args = function_call.get("args", {})
                tool_result = validate_and_execute_tool(fn_name, fn_args, circuit_state)
                tool_calls_trace.append({"tool": fn_name, "args": fn_args, "result": tool_result})

                # Follow-up with functionResponse
                follow_up_contents = list(contents)
                follow_up_contents.append({
                    "role": "model",
                    "parts": [{"functionCall": {"name": fn_name, "args": fn_args}}]
                })
                follow_up_contents.append({
                    "role": "function",
                    "parts": [{
                        "functionResponse": {
                            "name": fn_name,
                            "response": {"output": tool_result}
                        }
                    }]
                })

                follow_up_payload = {
                    "systemInstruction": {"parts": [{"text": SYSTEM_PROMPT}]},
                    "contents": follow_up_contents
                }

                req2 = urllib.request.Request(
                    url,
                    data=json.dumps(follow_up_payload).encode("utf-8"),
                    headers={"Content-Type": "application/json"}
                )
                with urllib.request.urlopen(req2, timeout=12) as response2:
                    res_data2 = json.loads(response2.read().decode("utf-8"))

                ans_text = res_data2.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                return {
                    "answer": ans_text or "Analysis completed based on verified circuit data.",
                    "tool_calls": tool_calls_trace,
                    "provider": "gemini"
                }

            text_part = next((p["text"] for p in parts if "text" in p), "")
            return {
                "answer": text_part,
                "tool_calls": tool_calls_trace,
                "provider": "gemini"
            }

        except Exception as e:
            # Fallback cleanly if network / quota / key error
            fallback_res = DeterministicFallbackProvider().generate_response(message, circuit_state, conversation_history)
            fallback_res["provider"] = f"deterministic_fallback (Gemini unavailable: {str(e)[:40]})"
            return fallback_res


class OpenAIProvider(LLMProvider):
    """
    OpenAI Provider using REST API with tool-calling loop.
    """

    def __init__(self, api_key: str, model_name: str = "gpt-4o-mini"):
        self.api_key = api_key
        self.model_name = model_name

    def generate_response(
        self,
        message: str,
        circuit_state: Dict[str, Any],
        conversation_history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        if not self.api_key:
            return DeterministicFallbackProvider().generate_response(message, circuit_state, conversation_history)

        url = "https://api.openai.com/v1/chat/completions"

        tools = [{"type": "function", "function": s} for s in TOOL_SCHEMAS]

        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        if conversation_history:
            for item in conversation_history[-4:]:
                messages.append({"role": item.get("role", "user"), "content": item.get("content", "")})
        messages.append({"role": "user", "content": message})

        payload = {
            "model": self.model_name,
            "messages": messages,
            "tools": tools,
            "tool_choice": "auto"
        }

        tool_calls_trace = []

        try:
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {self.api_key}"
                }
            )
            with urllib.request.urlopen(req, timeout=12) as response:
                res_data = json.loads(response.read().decode("utf-8"))

            choice = res_data.get("choices", [{}])[0].get("message", {})
            tool_calls_req = choice.get("tool_calls", [])

            if tool_calls_req:
                follow_up_msgs = list(messages)
                follow_up_msgs.append(choice)

                for tc in tool_calls_req:
                    call_id = tc.get("id")
                    fn_name = tc.get("function", {}).get("name")
                    try:
                        fn_args = json.loads(tc.get("function", {}).get("arguments", "{}"))
                    except Exception:
                        fn_args = {}

                    tool_res = validate_and_execute_tool(fn_name, fn_args, circuit_state)
                    tool_calls_trace.append({"tool": fn_name, "args": fn_args, "result": tool_res})

                    follow_up_msgs.append({
                        "role": "tool",
                        "tool_call_id": call_id,
                        "name": fn_name,
                        "content": json.dumps(tool_res)
                    })

                req2 = urllib.request.Request(
                    url,
                    data=json.dumps({"model": self.model_name, "messages": follow_up_msgs}).encode("utf-8"),
                    headers={
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {self.api_key}"
                    }
                )
                with urllib.request.urlopen(req2, timeout=12) as response2:
                    res_data2 = json.loads(response2.read().decode("utf-8"))

                ans_text = res_data2.get("choices", [{}])[0].get("message", {}).get("content", "")
                return {
                    "answer": ans_text or "Analysis completed based on verified circuit data.",
                    "tool_calls": tool_calls_trace,
                    "provider": "openai"
                }

            return {
                "answer": choice.get("content", ""),
                "tool_calls": tool_calls_trace,
                "provider": "openai"
            }

        except Exception as e:
            fallback_res = DeterministicFallbackProvider().generate_response(message, circuit_state, conversation_history)
            fallback_res["provider"] = f"deterministic_fallback (OpenAI unavailable: {str(e)[:40]})"
            return fallback_res
