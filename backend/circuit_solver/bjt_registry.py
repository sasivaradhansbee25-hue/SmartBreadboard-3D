"""
SmartBreadboard 3D — BJT Semiconductor Device Registry (Phase 31)
Defines supported Bipolar Junction Transistor device models (NPN_GENERIC, PNP_GENERIC,
2N3904, 2N3906) along with physical Ebers-Moll / Gummel-Poon parameters,
safe numerical bounds, dynamic junction capacitance parameters, and educational descriptions.
"""

from typing import Dict, Any, Optional

# Boltzmann constant k (J/K) and elementary charge q (C)
KB = 1.380649e-23
Q_ELEM = 1.602176634e-19


def compute_thermal_voltage(temp_kelvin: float = 300.0) -> float:
    """Calculates thermal voltage V_T = kT / q (approx 25.85 mV at 300 K)."""
    return (KB * max(temp_kelvin, 1.0)) / Q_ELEM


THERMAL_VOLTAGE_300K = compute_thermal_voltage(300.0)

# Built-in Canonical BJT Device Definitions
BJT_REGISTRY: Dict[str, Dict[str, Any]] = {
    # 1. Generic NPN Small-Signal Transistor
    "NPN_GENERIC": {
        "model": "NPN_GENERIC",
        "polarity": "NPN",
        "family": "BJT",
        "display_name": "Generic NPN Bipolar Junction Transistor",
        "category": "transistor",
        "terminals": ["collector", "base", "emitter"],
        "parameters": {
            "Is": 1.0e-14,         # Transport saturation current (A)
            "beta_f": 100.0,       # Forward current gain beta_F (hFE)
            "beta_r": 2.0,         # Reverse current gain beta_R
            "n_f": 1.0,            # Forward emission coefficient
            "n_r": 1.0,            # Reverse emission coefficient
            "temperature_k": 300.0,
            "v_af": 100.0,         # Forward Early voltage (V)
            "c_je0": 4.0e-12,      # Zero-bias B-E junction capacitance (4 pF)
            "c_jc0": 3.0e-12,      # Zero-bias B-C junction capacitance (3 pF)
            "v_0e": 0.75,          # B-E built-in potential (V)
            "v_0c": 0.70,          # B-C built-in potential (V)
            "m_e": 0.33,           # B-E grading coefficient
            "m_c": 0.33,           # B-C grading coefficient
            "tau_f": 0.3e-9,       # Forward transit time (0.3 ns)
            "tau_r": 10.0e-9       # Reverse transit time (10 ns)
        },
        "nominal_v_be_on": 0.70,
        "nominal_v_ce_sat": 0.20,
        "max_collector_current": 0.20, # 200 mA
        "description": "Textbook idealized NPN BJT governed by non-linear Ebers-Moll transport equations.",
        "educational_law": "Ebers-Moll Model: I_C = Is*(exp(V_BE/V_T) - exp(V_BC/V_T)) - (Is/beta_r)*(exp(V_BC/V_T) - 1)"
    },

    # 2. Canonical 2N3904 NPN General-Purpose Transistor
    "2N3904": {
        "model": "2N3904",
        "polarity": "NPN",
        "family": "BJT",
        "display_name": "2N3904 NPN General Purpose Transistor",
        "category": "transistor",
        "terminals": ["collector", "base", "emitter"],
        "parameters": {
            "Is": 1.4e-14,
            "beta_f": 200.0,
            "beta_r": 4.0,
            "n_f": 1.0,
            "n_r": 1.0,
            "temperature_k": 300.0,
            "v_af": 74.0,
            "c_je0": 4.5e-12,
            "c_jc0": 3.5e-12,
            "v_0e": 0.75,
            "v_0c": 0.70,
            "m_e": 0.35,
            "m_c": 0.33,
            "tau_f": 0.25e-9,
            "tau_r": 15.0e-9
        },
        "nominal_v_be_on": 0.70,
        "nominal_v_ce_sat": 0.20,
        "max_collector_current": 0.20,
        "description": "Ubiquitous NPN small-signal switching and amplifier transistor.",
        "educational_law": "Ebers-Moll Model & Common-Emitter Small-Signal Amplification"
    },

    # 3. Generic PNP Small-Signal Transistor
    "PNP_GENERIC": {
        "model": "PNP_GENERIC",
        "polarity": "PNP",
        "family": "BJT",
        "display_name": "Generic PNP Bipolar Junction Transistor",
        "category": "transistor",
        "terminals": ["collector", "base", "emitter"],
        "parameters": {
            "Is": 1.0e-14,
            "beta_f": 100.0,
            "beta_r": 2.0,
            "n_f": 1.0,
            "n_r": 1.0,
            "temperature_k": 300.0,
            "v_af": 80.0,
            "c_je0": 4.0e-12,
            "c_jc0": 3.0e-12,
            "v_0e": 0.75,
            "v_0c": 0.70,
            "m_e": 0.33,
            "m_c": 0.33,
            "tau_f": 0.3e-9,
            "tau_r": 10.0e-9
        },
        "nominal_v_be_on": -0.70,
        "nominal_v_ce_sat": -0.20,
        "max_collector_current": 0.20,
        "description": "Complementary PNP BJT governed by inverted Ebers-Moll equations.",
        "educational_law": "PNP Complementary Ebers-Moll Transport Equations"
    },

    # 4. Canonical 2N3906 PNP General-Purpose Transistor
    "2N3906": {
        "model": "2N3906",
        "polarity": "PNP",
        "family": "BJT",
        "display_name": "2N3906 PNP General Purpose Transistor",
        "category": "transistor",
        "terminals": ["collector", "base", "emitter"],
        "parameters": {
            "Is": 1.4e-14,
            "beta_f": 180.0,
            "beta_r": 3.0,
            "n_f": 1.0,
            "n_r": 1.0,
            "temperature_k": 300.0,
            "v_af": 65.0,
            "c_je0": 5.0e-12,
            "c_jc0": 4.5e-12,
            "v_0e": 0.75,
            "v_0c": 0.70,
            "m_e": 0.35,
            "m_c": 0.33,
            "tau_f": 0.30e-9,
            "tau_r": 20.0e-9
        },
        "nominal_v_be_on": -0.70,
        "nominal_v_ce_sat": -0.20,
        "max_collector_current": 0.20,
        "description": "Complementary PNP pair to 2N3904 for high-side switching and push-pull stages.",
        "educational_law": "PNP Small-Signal High-Side Switching & Linear Amplification"
    }
}


def get_bjt_definition(model_name: Optional[str] = None) -> Dict[str, Any]:
    """Retrieves BJT device definition by model name or fallback generic NPN."""
    if not model_name:
        return BJT_REGISTRY["NPN_GENERIC"]
    key = str(model_name).upper().strip()
    if "PNP" in key or key == "2N3906":
        return BJT_REGISTRY.get(key, BJT_REGISTRY["PNP_GENERIC"])
    return BJT_REGISTRY.get(key, BJT_REGISTRY["NPN_GENERIC"])
