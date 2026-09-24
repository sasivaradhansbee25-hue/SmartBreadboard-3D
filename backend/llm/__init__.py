"""
SmartBreadboard 3D — LLM Circuit Assistant Module (Phase 20)
Provides provider abstraction, deterministic tool registry, strict system prompts,
and conversational reasoning over verified circuit intelligence.
"""

from .llm_service import get_assistant_service
from .agent import CircuitAssistantAgent
from .prompts import SYSTEM_PROMPT

__all__ = ["get_assistant_service", "CircuitAssistantAgent", "SYSTEM_PROMPT"]
