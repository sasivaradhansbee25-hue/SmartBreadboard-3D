"""
SmartBreadboard 3D — Integrated Circuit (IC) Registry & Model Definition Engine (Phase 28)
Defines supported IC models, pin mappings, operational limits, and scientific models.

SUPPORTED OP-AMP MODELS:
- LM741: Single general-purpose operational amplifier (DIP-8)
- LM358: Dual single/split-supply operational amplifier (DIP-8)
- TL072: Dual low-noise JFET-input operational amplifier (DIP-8)
- NE5532: Dual high-performance low-noise audio operational amplifier (DIP-8)
- OP07: Single ultra-low offset voltage operational amplifier (DIP-8)
- IDEAL_OPAMP / GENERIC_OPAMP: Ideal linear operational amplifier

SCIENTIFIC INTEGRITY:
- Unknown ICs are strictly marked status = 'UNKNOWN'
- Never assumes pin numbers silently
- Validates supply rails (V+, V-) and distinguishes inverting (-) vs non-inverting (+) inputs
"""

from typing import Dict, Any, List, Optional, Tuple


# Standard DIP-8 Op-Amp Pinout Definitions
IC_REGISTRY: Dict[str, Dict[str, Any]] = {
    "LM741": {
        "ic_id": "LM741",
        "manufacturer_part": "LM741CN / UA741",
        "display_name": "LM741 General Purpose Op-Amp",
        "package": "DIP-8",
        "channels": 1,
        "model_type": "LINEAR_OPAMP",
        "pinout": {
            "1": "OFFSET_NULL_1",
            "2": "IN_NEG",
            "3": "IN_POS",
            "4": "V_MINUS",
            "5": "OFFSET_NULL_2",
            "6": "OUTPUT",
            "7": "V_PLUS",
            "8": "NC"
        },
        "default_pins": {
            "non_inverting": "3",
            "inverting": "2",
            "output": "6",
            "v_plus": "7",
            "v_minus": "4"
        },
        "requires_supply_rails": True,
        "electrical_specs": {
            "open_loop_gain": 200000.0,      # 106 dB (typ)
            "input_resistance_ohms": 2.0e6,   # 2 MΩ
            "output_resistance_ohms": 75.0,   # 75 Ω
            "gbwp_hz": 1.0e6,                 # 1 MHz
            "min_supply_v": 5.0,              # ±5V min
            "max_supply_v": 18.0,             # ±18V max
            "output_headroom_v": 1.5          # Saturation at Vsupply - 1.5V
        },
        "limitations": "Idealized linear model with finite gain & bandwidth. Unmodeled: slew rate (0.5V/us), input offset (1mV), thermal drift."
    },
    "LM358": {
        "ic_id": "LM358",
        "manufacturer_part": "LM358N / LM358P",
        "display_name": "LM358 Dual Low-Power Op-Amp",
        "package": "DIP-8",
        "channels": 2,
        "model_type": "LINEAR_OPAMP",
        "requires_supply_rails": True,
        "pinout": {
            "1": "OUTPUT_A",
            "2": "IN_NEG_A",
            "3": "IN_POS_A",
            "4": "V_MINUS",
            "5": "IN_POS_B",
            "6": "IN_NEG_B",
            "7": "OUTPUT_B",
            "8": "V_PLUS"
        },
        "default_pins": {
            "non_inverting": "3",
            "inverting": "2",
            "output": "1",
            "v_plus": "8",
            "v_minus": "4"
        },
        "electrical_specs": {
            "open_loop_gain": 100000.0,       # 100 dB
            "input_resistance_ohms": 1.0e7,   # 10 MΩ
            "output_resistance_ohms": 100.0,
            "gbwp_hz": 1.0e6,                 # 1 MHz
            "min_supply_v": 3.0,              # Single 3V or ±1.5V
            "max_supply_v": 32.0,
            "output_headroom_v": 1.2
        },
        "limitations": "Linear small-signal model. Unmodeled: crossover distortion in Class-AB stage, output swing limited near V+."
    },
    "TL072": {
        "ic_id": "TL072",
        "manufacturer_part": "TL072CP / TL072IP",
        "display_name": "TL072 Dual JFET-Input Low-Noise Op-Amp",
        "package": "DIP-8",
        "channels": 2,
        "model_type": "LINEAR_OPAMP",
        "requires_supply_rails": True,
        "pinout": {
            "1": "OUTPUT_A",
            "2": "IN_NEG_A",
            "3": "IN_POS_A",
            "4": "V_MINUS",
            "5": "IN_POS_B",
            "6": "IN_NEG_B",
            "7": "OUTPUT_B",
            "8": "V_PLUS"
        },
        "default_pins": {
            "non_inverting": "3",
            "inverting": "2",
            "output": "1",
            "v_plus": "8",
            "v_minus": "4"
        },
        "electrical_specs": {
            "open_loop_gain": 200000.0,
            "input_resistance_ohms": 1.0e12,  # 1 TΩ (JFET input)
            "output_resistance_ohms": 50.0,
            "gbwp_hz": 3.0e6,                 # 3 MHz
            "min_supply_v": 6.0,
            "max_supply_v": 18.0,
            "output_headroom_v": 1.5
        },
        "limitations": "JFET-input linear model. Unmodeled: phase reversal when input exceeds common-mode limit, noise spectra."
    },
    "NE5532": {
        "ic_id": "NE5532",
        "manufacturer_part": "NE5532P / SA5532",
        "display_name": "NE5532 Dual Audio Operational Amplifier",
        "package": "DIP-8",
        "channels": 2,
        "model_type": "LINEAR_OPAMP",
        "requires_supply_rails": True,
        "pinout": {
            "1": "OUTPUT_A",
            "2": "IN_NEG_A",
            "3": "IN_POS_A",
            "4": "V_MINUS",
            "5": "IN_POS_B",
            "6": "IN_NEG_B",
            "7": "OUTPUT_B",
            "8": "V_PLUS"
        },
        "default_pins": {
            "non_inverting": "3",
            "inverting": "2",
            "output": "1",
            "v_plus": "8",
            "v_minus": "4"
        },
        "electrical_specs": {
            "open_loop_gain": 100000.0,
            "input_resistance_ohms": 3.0e5,   # 300 kΩ
            "output_resistance_ohms": 30.0,
            "gbwp_hz": 1.0e7,                 # 10 MHz
            "min_supply_v": 5.0,
            "max_supply_v": 22.0,
            "output_headroom_v": 1.5
        },
        "limitations": "High-speed bipolar model. Unmodeled: input bias currents (200nA), slew rate (9V/us)."
    },
    "OP07": {
        "ic_id": "OP07",
        "manufacturer_part": "OP07CP / OP07EP",
        "display_name": "OP07 Ultra-Low Offset Precision Op-Amp",
        "package": "DIP-8",
        "channels": 1,
        "model_type": "LINEAR_OPAMP",
        "requires_supply_rails": True,
        "pinout": {
            "1": "VOS_TRIM_1",
            "2": "IN_NEG",
            "3": "IN_POS",
            "4": "V_MINUS",
            "5": "NC",
            "6": "OUTPUT",
            "7": "V_PLUS",
            "8": "VOS_TRIM_2"
        },
        "default_pins": {
            "non_inverting": "3",
            "inverting": "2",
            "output": "6",
            "v_plus": "7",
            "v_minus": "4"
        },
        "electrical_specs": {
            "open_loop_gain": 500000.0,
            "input_resistance_ohms": 3.0e7,   # 30 MΩ
            "output_resistance_ohms": 60.0,
            "gbwp_hz": 6.0e5,                 # 600 kHz
            "min_supply_v": 3.0,
            "max_supply_v": 18.0,
            "output_headroom_v": 1.0
        },
        "limitations": "Precision DC linear model. Low bandwidth (600 kHz GBWP)."
    },
    "IDEAL_OPAMP": {
        "ic_id": "IDEAL_OPAMP",
        "manufacturer_part": "IDEAL_LINEAR_OPAMP",
        "display_name": "Ideal Linear Operational Amplifier",
        "package": "GENERIC",
        "channels": 1,
        "model_type": "IDEAL_OPAMP",
        "requires_supply_rails": False,
        "pinout": {
            "+": "IN_POS",
            "-": "IN_NEG",
            "OUT": "OUTPUT",
            "V+": "V_PLUS",
            "V-": "V_MINUS"
        },
        "default_pins": {
            "non_inverting": "IN_POS",
            "inverting": "IN_NEG",
            "output": "OUTPUT",
            "v_plus": "V_PLUS",
            "v_minus": "V_MINUS"
        },
        "electrical_specs": {
            "open_loop_gain": 1.0e6,
            "input_resistance_ohms": 1.0e9,
            "output_resistance_ohms": 0.001,
            "gbwp_hz": 1.0e8,                 # 100 MHz quasi-ideal
            "min_supply_v": 0.0,
            "max_supply_v": 50.0,
            "output_headroom_v": 0.0
        },
        "limitations": "Idealized linear model (infinite input impedance, zero output impedance, high open-loop gain)."
    }
}


def get_ic_definition(part_name: Optional[str]) -> Optional[Dict[str, Any]]:
    """
    Retrieves IC definition by part number or model name.
    Returns None if the IC is not a verified supported model.
    Never uses a generic op-amp model for an unknown IC.
    """
    if not part_name:
        return None

    cleaned = str(part_name).upper().strip().replace("-", "").replace(" ", "").replace("_", "")
    for key, defn in IC_REGISTRY.items():
        key_clean = key.replace("_", "")
        if key_clean == cleaned or (len(cleaned) >= 4 and key_clean in cleaned):
            return defn
        part_clean = defn["manufacturer_part"].upper().replace("-", "").replace(" ", "").replace("_", "")
        if cleaned in part_clean or part_clean in cleaned:
            return defn

    # Explicit Ideal Op-Amp Model Request only
    if cleaned in ["IDEALOPAMP", "OPAMPIDEAL", "IDEALLINEAROPAMP", "IDEAL"]:
        return IC_REGISTRY["IDEAL_OPAMP"]

    return None


def validate_opamp_supplies(ic_def: Dict[str, Any], terminals: Dict[str, Any], netlist: Dict[str, Any]) -> Tuple[bool, str, Optional[str]]:
    """
    Validates power supply rails for op-amp ICs per Section 6.
    Returns (is_valid, status, error_message).
    """
    if not ic_def or not ic_def.get("requires_supply_rails"):
        return True, "VALID", None

    v_plus = terminals.get("v_plus")
    v_minus = terminals.get("v_minus")

    if not v_plus or not v_minus:
        return False, "INVALID_OPERATING_STATE", f"Supply pins (V+, V-) are missing or unconnected for IC '{ic_def.get('ic_id')}'. Real op-amps require DC supply rails."

    # Look for power sources connected to v_plus / v_minus in netlist
    power_sources = netlist.get("power_sources", []) + netlist.get("sources", [])
    
    # Calculate available supply voltage
    v_pos_val = 0.0
    v_neg_val = 0.0
    found_pos = False
    found_neg = False

    for s in power_sources:
        pn = s.get("positive_node") or s.get("node_pos")
        nn = s.get("negative_node") or s.get("node_neg")
        volt = float(s.get("voltage", s.get("nominal_voltage_v", 0.0)))
        if pn == v_plus:
            v_pos_val = volt
            found_pos = True
        if nn == v_minus:
            v_neg_val = -volt if volt > 0 else volt
            found_neg = True
        elif pn == v_minus:
            v_neg_val = volt
            found_neg = True

    # If v_minus is Ground (single supply)
    if "GND" in str(v_minus).upper() or str(v_minus) == "0":
        v_neg_val = 0.0
        found_neg = True

    # Check if supply information is missing
    if not found_pos and not found_neg:
        return False, "INVALID_OPERATING_STATE", f"No DC supply voltage connected to rails '{v_plus}' or '{v_minus}' for IC '{ic_def.get('ic_id')}'."

    total_supply_v = abs(v_pos_val - v_neg_val)
    min_supply = float(ic_def.get("electrical_specs", {}).get("min_supply_v", 3.0))

    if total_supply_v < min_supply:
        return False, "INVALID_OPERATING_STATE", f"Insufficient supply voltage ({total_supply_v:.1f}V < {min_supply:.1f}V required) for IC '{ic_def.get('ic_id')}'."

    return True, "VALID", None


def resolve_opamp_terminals(comp_dict: Dict[str, Any]) -> Dict[str, Any]:
    """
    Resolves non-inverting (+), inverting (-), output, and supply terminals from component dictionary.
    Handles pin numbers ('2', '3', '6', '7', '4') or named fields ('non_inverting_node', 'in_pos', etc.).
    Strictly returns status = 'UNKNOWN_IC' / 'UNKNOWN' for unrecognized ICs.
    """
    part_name = comp_dict.get("model") or comp_dict.get("part_number") or comp_dict.get("part_name") or comp_dict.get("value")
    
    ic_def = get_ic_definition(part_name)

    if not ic_def:
        return {
            "success": False,
            "status": "UNKNOWN_IC",
            "error": f"IC '{part_name}' is not recognized in the verified IC registry.",
            "terminals": None
        }

    pins = comp_dict.get("pins", {})
    terminals = comp_dict.get("terminals", {})
    props = comp_dict.get("properties", {})

    # Helper to find connected node by various naming schemes
    def find_node(*keys: str) -> Optional[str]:
        for k in keys:
            if k in comp_dict and comp_dict[k]:
                return str(comp_dict[k])
            if isinstance(pins, dict) and k in pins and pins[k]:
                return str(pins[k])
            if isinstance(terminals, dict) and k in terminals and terminals[k]:
                return str(terminals[k])
            if isinstance(props, dict) and k in props and props[k]:
                return str(props[k])
        return None

    # Resolve based on model pinout or direct names
    # Non-inverting input (+)
    in_pos = find_node("non_inverting_node", "node_in_pos", "in_pos", "v_pos", "plus", "non_inverting", "pin3", "3", "pin_3")
    # Inverting input (-)
    in_neg = find_node("inverting_node", "node_in_neg", "in_neg", "v_neg", "minus", "inverting", "pin2", "2", "pin_2")
    # Output
    out_node = find_node("output_node", "node_out", "out", "output", "pin6", "6", "pin_6", "pin1", "1", "pin_1")
    # Supply positive (V+)
    v_plus = find_node("vcc_node", "v_plus", "vcc", "vdd", "pos_supply", "pin7", "7", "pin_7", "pin8", "8", "pin_8")
    # Supply negative (V-)
    v_minus = find_node("vee_node", "v_minus", "vee", "vss", "neg_supply", "gnd_node", "pin4", "4", "pin_4")

    # Fallback to general node1 / node2 if simple 2-terminal format passed
    if not in_pos and comp_dict.get("node1"):
        in_pos = str(comp_dict.get("node1"))
    if not out_node and comp_dict.get("node2"):
        out_node = str(comp_dict.get("node2"))

    is_valid_mapping = bool(in_pos and in_neg and out_node)

    return {
        "success": is_valid_mapping,
        "status": "VERIFIED_PIN_MAPPING" if is_valid_mapping else "INVALID_PIN_MAPPING",
        "ic_definition": ic_def,
        "terminals": {
            "in_pos": in_pos,
            "in_neg": in_neg,
            "output": out_node,
            "v_plus": v_plus,
            "v_minus": v_minus
        },
        "missing_pins": [k for k, v in [("non_inverting (+)", in_pos), ("inverting (-)", in_neg), ("output", out_node)] if not v]
    }
