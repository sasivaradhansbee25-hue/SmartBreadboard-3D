"""
SmartBreadboard 3D — LLM Service Factory (Phase 20.1)
Resolves the configured LLM provider securely from environment variables.
"""

import os
from typing import Optional
from .provider import LLMProvider, GeminiProvider, OpenAIProvider, DeterministicFallbackProvider

_ACTIVE_PROVIDER: Optional[LLMProvider] = None


def get_assistant_service() -> LLMProvider:
    """
    Returns the active LLM Provider based on available environment variables:
    1. GEMINI_API_KEY -> GeminiProvider
    2. OPENAI_API_KEY -> OpenAIProvider
    3. Fallback -> DeterministicFallbackProvider (100% offline & rule-based)
    """
    global _ACTIVE_PROVIDER
    if _ACTIVE_PROVIDER is not None:
        return _ACTIVE_PROVIDER

    gemini_key = os.environ.get("GEMINI_API_KEY")
    openai_key = os.environ.get("OPENAI_API_KEY")

    if gemini_key:
        _ACTIVE_PROVIDER = GeminiProvider(api_key=gemini_key)
    elif openai_key:
        _ACTIVE_PROVIDER = OpenAIProvider(api_key=openai_key)
    else:
        _ACTIVE_PROVIDER = DeterministicFallbackProvider()

    return _ACTIVE_PROVIDER


def set_custom_provider(provider: LLMProvider):
    """Overrides active provider for testing / mock evaluation."""
    global _ACTIVE_PROVIDER
    _ACTIVE_PROVIDER = provider
