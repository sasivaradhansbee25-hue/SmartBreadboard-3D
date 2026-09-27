"""
SmartBreadboard 3D — Semiconductor Device Registry (Phase 30)
Defines supported semiconductor device models (PN Diodes, LEDs, Rectifiers, Bridge Rectifiers)
along with physical Shockley parameters, safe numerical bounds, dynamic capacitance parameters,
and educational descriptions.
"""

from typing import Dict, Any, Optional

# Boltzmann constant k (J/K) and elementary charge q (C)
KB = 1.380649e-23
Q_ELEM = 1.602176634e-19

def compute_thermal_voltage(temp_kelvin: float = 300.0) -> float:
    """Calculates thermal voltage V_T = kT / q (approx 25.85 mV at 300 K)."""
    return (KB * max(temp_kelvin, 1.0)) / Q_ELEM

THERMAL_VOLTAGE_300K = compute_thermal_voltage(300.0)

# Built-in Canonical Semiconductor Device Definitions
SEMICONDUCTOR_REGISTRY: Dict[str, Dict[str, Any]] = {
    # 1. Standard Fast-Switching Small-Signal Diode (1N4148 / 1N914)
    "1N4148": {
        "model": "1N4148",
        "family": "PN_DIODE",
        "display_name": "1N4148 Small-Signal Fast Switching Diode",
        "category": "diode",
        "anode_terminal": "anode",
        "cathode_terminal": "cathode",
        "parameters": {
            "Is": 2.52e-9,        # Saturation current (A)
            "n": 1.752,           # Emission / Ideality factor
            "temperature_k": 300.0,
            "Rs": 0.568,          # Series parasitic bulk resistance (Ω)
            "Cj0": 4.0e-12,       # Zero-bias junction capacitance (4 pF)
            "V0": 0.75,           # Built-in junction potential (V)
            "M": 0.333,           # Grading coefficient
            "tau_t": 5.0e-9       # Transit time (5 ns)
        },
        "nominal_forward_voltage": 0.70,
        "max_forward_current": 0.20, # 200 mA
        "description": "Standard silicon planar high-speed switching diode for logic gates and wave shaping.",
        "educational_law": "Shockley Diode Equation: I_D = Is * [ exp(V_D / (n * V_T)) - 1 ]"
    },

    # 2. General-Purpose Power Rectifier Diode (1N4007 / 1N4001)
    "1N4007": {
        "model": "1N4007",
        "family": "RECTIFIER_DIODE",
        "display_name": "1N4007 1A Power Rectifier Diode",
        "category": "rectifier",
        "anode_terminal": "anode",
        "cathode_terminal": "cathode",
        "parameters": {
            "Is": 7.06e-9,
            "n": 1.95,
            "temperature_k": 300.0,
            "Rs": 0.042,
            "Cj0": 18.0e-12,      # 18 pF
            "V0": 0.65,
            "M": 0.38,
            "tau_t": 5.0e-6       # 5 µs recovery transit time
        },
        "nominal_forward_voltage": 0.85,
        "max_forward_current": 1.0,  # 1 A
        "description": "Standard 1A power rectifier diode designed for AC-to-DC mains line rectification.",
        "educational_law": "Half-Wave & Full-Wave Power Rectification"
    },

    # 3. Standard Red Light Emitting Diode (LED)
    "LED_RED": {
        "model": "LED_RED",
        "family": "LED",
        "display_name": "Red Light Emitting Diode (GaAsP)",
        "category": "led",
        "anode_terminal": "anode",
        "cathode_terminal": "cathode",
        "parameters": {
            "Is": 1.0e-15,        # Very low saturation current due to direct bandgap
            "n": 2.1,             # Higher ideality factor for optoelectronic recombination
            "temperature_k": 300.0,
            "Rs": 4.5,            # Bulk series resistance (Ω)
            "Cj0": 25.0e-12,      # 25 pF
            "V0": 1.8,
            "M": 0.33,
            "tau_t": 1.0e-8
        },
        "nominal_forward_voltage": 1.95,
        "max_forward_current": 0.03, # 30 mA max continuous
        "description": "Direct bandgap GaAsP semiconductor emitting red photons (~630nm) under forward bias.",
        "educational_law": "Electroluminescent Recombination: Photon Energy E = h * c / lambda"
    },

    # 4. Standard Green Light Emitting Diode (LED)
    "LED_GREEN": {
        "model": "LED_GREEN",
        "family": "LED",
        "display_name": "Green Light Emitting Diode (GaP/InGaN)",
        "category": "led",
        "anode_terminal": "anode",
        "cathode_terminal": "cathode",
        "parameters": {
            "Is": 1.0e-18,
            "n": 2.4,
            "temperature_k": 300.0,
            "Rs": 6.0,
            "Cj0": 20.0e-12,
            "V0": 2.2,
            "M": 0.33,
            "tau_t": 1.0e-8
        },
        "nominal_forward_voltage": 2.25,
        "max_forward_current": 0.025,
        "description": "Wide bandgap semiconductor emitting green photons (~525nm).",
        "educational_law": "Electroluminescent Recombination"
    },

    # 5. Generic Default PN Diode Model
    "GENERIC_DIODE": {
        "model": "GENERIC_DIODE",
        "family": "PN_DIODE",
        "display_name": "Generic Silicon PN Junction Diode",
        "category": "diode",
        "anode_terminal": "anode",
        "cathode_terminal": "cathode",
        "parameters": {
            "Is": 1.0e-14,
            "n": 1.0,
            "temperature_k": 300.0,
            "Rs": 0.1,
            "Cj0": 2.0e-12,
            "V0": 0.7,
            "M": 0.5,
            "tau_t": 1.0e-9
        },
        "nominal_forward_voltage": 0.70,
        "max_forward_current": 0.5,
        "description": "Idealized textbook Shockley PN diode model.",
        "educational_law": "Shockley PN Junction Equation"
    }
}

def get_semiconductor_definition(model_or_type: str) -> Dict[str, Any]:
    """Retrieves semiconductor model parameters, falling back to generic defaults."""
    key = str(model_or_type).upper()
    if key in SEMICONDUCTOR_REGISTRY:
        return SEMICONDUCTOR_REGISTRY[key]
    
    if "RED" in key and "LED" in key:
        return SEMICONDUCTOR_REGISTRY["LED_RED"]
    elif "GREEN" in key and "LED" in key:
        return SEMICONDUCTOR_REGISTRY["LED_GREEN"]
    elif "LED" in key:
        return SEMICONDUCTOR_REGISTRY["LED_RED"]
    elif "4007" in key or "4001" in key or "RECTIFIER" in key:
        return SEMICONDUCTOR_REGISTRY["1N4007"]
    elif "4148" in key or "914" in key or "DIODE" in key:
        return SEMICONDUCTOR_REGISTRY["1N4148"]
    else:
        return SEMICONDUCTOR_REGISTRY["GENERIC_DIODE"]
