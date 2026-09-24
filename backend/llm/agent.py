"""
SmartBreadboard 3D — Circuit Assistant Agent (Phase 20.4 & 20.11)
Maintains short-term conversation context and coordinates tool reasoning loop.
"""

from typing import Dict, Any, List, Optional
from .llm_service import get_assistant_service


class CircuitAssistantAgent:
    """
    Session-aware Circuit Assistant Agent.
    Manages short-term conversation memory and dispatches questions to the active LLM provider.
    """

    def __init__(self, session_id: str = "default_session", max_history: int = 6):
        self.session_id = session_id
        self.max_history = max_history
        self.history: List[Dict[str, str]] = []

    def reset(self):
        """Clears session conversation history."""
        self.history.clear()

    def process_message(
        self,
        user_message: str,
        circuit_state: Optional[Dict[str, Any]] = None,
        context: Optional[Dict[str, Any]] = None,
        conversation_history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """
        Executes a single conversational turn with circuit intelligence tools.
        """
        state = circuit_state if circuit_state is not None else (context or {})
        history = conversation_history if conversation_history is not None else self.history
        if not user_message or not user_message.strip():
            return {
                "answer": "Please ask a question about your verified circuit.",
                "tool_calls": [],
                "circuit_status": state.get("validity", {}).get("status", "UNKNOWN"),
                "simulation_status": state.get("solver_status", "NOT_RUN")
            }

        provider = get_assistant_service()
        response = provider.generate_response(
            message=user_message,
            circuit_state=state,
            conversation_history=history
        )

        answer = response.get("answer", "")
        tool_calls = response.get("tool_calls", [])

        # Update short-term memory (trimmed to max_history)
        self.history.append({"role": "user", "content": user_message})
        self.history.append({"role": "assistant", "content": answer})
        if len(self.history) > self.max_history * 2:
            self.history = self.history[-self.max_history * 2:]

        # Extract circuit state metadata
        netlist = state.get("netlist") or state
        sim = state.get("electrical_analysis") or state.get("simulationResult") or {}
        circuit_status = netlist.get("validity", {}).get("status", "VALID" if netlist.get("components") else "UNKNOWN")
        sim_res = response.get("simulation_result") or state.get("simulationResult") or state.get("electrical_analysis")
        if sim_res and sim_res.get("success"):
            sim_status = "SOLVED"
        else:
            sim_status = netlist.get("solver_status") or sim.get("solver_status", "NOT_RUN")

        res_dict = {
            "answer": answer,
            "tool_calls": tool_calls,
            "circuit_status": circuit_status,
            "simulation_status": sim_status,
            "simulation_result": sim_res,
            "suggestions": response.get("suggestions", []),
            "provider": response.get("provider", "unknown")
        }
        if response.get("action"):
            res_dict["action"] = response.get("action")
        if response.get("component_id"):
            res_dict["component_id"] = response.get("component_id")
        if response.get("node_id"):
            res_dict["node_id"] = response.get("node_id")

        return res_dict


# Global session cache
_GLOBAL_AGENTS: Dict[str, CircuitAssistantAgent] = {}


def get_agent_for_session(session_id: Optional[str] = None) -> CircuitAssistantAgent:
    """Retrieves or creates a session agent instance."""
    sid = session_id or "default_session"
    if sid not in _GLOBAL_AGENTS:
        _GLOBAL_AGENTS[sid] = CircuitAssistantAgent(session_id=sid)
    return _GLOBAL_AGENTS[sid]
