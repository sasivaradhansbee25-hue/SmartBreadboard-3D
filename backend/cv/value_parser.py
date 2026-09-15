"""
SmartBreadboard 3D — Engineering Value Parser
Converts component marking strings (e.g., '1K', '4.7K', '220R', '100uF', '104', '10mH') into numerical SI values and formatted strings.
"""

import re
from typing import Tuple, Optional, Dict, Any

def parse_component_value(val_str: str, comp_type: str = "resistor") -> Tuple[Optional[float], str, str]:
    """
    Parses a component value string into (numeric_si_value, standard_unit, formatted_string).
    Returns (None, "", "user_required") if unparsable.
    """
    if not val_str or not isinstance(val_str, str):
        return None, "", "user_required"

    s = val_str.strip().replace(" ", "").upper()
    comp_type = comp_type.lower()

    # 0. Check descriptive strings
    if "wire" in comp_type or "jumper" in comp_type or "JUMPER" in s or "WIRE" in s:
        return 0.001, "Ω", "Jumper Wire"
    if "led" in comp_type or "LED" in s or "RED" in s:
        return 2.0, "V", "2.00 V (LED)"
    if "diode" in comp_type or "1N4007" in s:
        return 0.7, "V", "0.70 V (Diode)"

    # 1. Check for capacitor 3-digit code e.g. "104", "473", "103"
    if comp_type in ["capacitor", "cap"] and re.match(r"^\d{3}$", s):
        digits = [int(c) for c in s]
        val_pf = (digits[0] * 10 + digits[1]) * (10 ** digits[2])
        val_farads = val_pf * 1e-12
        return val_farads, "F", format_si_value(val_farads, "F")

    # 2. Extract numeric prefix and multiplier suffix
    # Standard multipliers
    # p = 1e-12, n = 1e-9, u/µ = 1e-6, m = 1e-3, k/K = 1e3, M = 1e6, G = 1e9
    # Format e.g., 4.7K, 4K7, 220R, 100uF, 10mH

    # Replace unicode micro µ with U
    s = s.replace("Μ", "U").replace("Micro", "U").replace("OHM", "").replace("Ω", "").replace("FARAD", "").replace("HENRY", "")

    # Handle R/K/M inline decimal notation like 4K7 -> 4.7K, 2R2 -> 2.2R
    inline_match = re.match(r"^(\d+)([RKMKMUFP])(\d+)$", s)
    if inline_match:
        integer_part, mult_char, decimal_part = inline_match.groups()
        s = f"{integer_part}.{decimal_part}{mult_char}"

    # Extract general float and suffix
    match = re.match(r"^([0-9\.]+)\s*([A-Z]*)$", s)
    if not match:
        return None, "", "user_required"

    num_part, suffix = match.groups()
    try:
        base_val = float(num_part)
    except ValueError:
        return None, "", "user_required"

    multiplier = 1.0
    unit = "Ω" if "resistor" in comp_type else ("F" if "cap" in comp_type else ("H" if "ind" in comp_type else "unit"))

    # Process suffix multiplier
    if suffix.startswith("P"):
        multiplier = 1e-12
        unit = "F"
    elif suffix.startswith("N"):
        multiplier = 1e-9
        unit = "F"
    elif suffix.startswith("U"):
        multiplier = 1e-6
        unit = "F"
    elif suffix.startswith("M") and "MH" in s:
        multiplier = 1e-3
        unit = "H"
    elif suffix.startswith("M") and "CAP" in comp_type:
        multiplier = 1e-6
        unit = "F"
    elif suffix.startswith("M") and ("K" not in suffix):
        # Could be mega (M) or milli (m) depending on component
        if "resistor" in comp_type:
            multiplier = 1e6
            unit = "Ω"
        elif "inductor" in comp_type:
            multiplier = 1e-3
            unit = "H"
    elif suffix.startswith("K"):
        multiplier = 1e3
        unit = "Ω"
    elif suffix.startswith("R"):
        multiplier = 1.0
        unit = "Ω"

    si_val = base_val * multiplier
    formatted = format_si_value(si_val, unit)
    return si_val, unit, formatted

def format_si_value(val: float, unit: str = "Ω") -> str:
    """Formats a float SI value into human readable string (e.g. 1000 -> '1.00 kΩ')."""
    if val is None:
        return "Unknown"
    abs_v = abs(val)
    if abs_v == 0:
        return f"0 {unit}"

    if unit in ["Ω", "Ohm", "ohms"]:
        if abs_v >= 1e6:
            return f"{val/1e6:.2f} MΩ"
        elif abs_v >= 1e3:
            return f"{val/1e3:.2f} kΩ"
        else:
            return f"{val:.2f} Ω"

    elif unit in ["F", "Farad", "farads"]:
        if abs_v >= 1.0:
            return f"{val:.2f} F"
        elif abs_v >= 1e-3:
            return f"{val*1e3:.2f} mF"
        elif abs_v >= 1e-6:
            return f"{val*1e6:.2f} µF"
        elif abs_v >= 1e-9:
            return f"{val*1e9:.2f} nF"
        else:
            return f"{val*1e12:.2f} pF"

    elif unit in ["H", "Henry", "henries"]:
        if abs_v >= 1.0:
            return f"{val:.2f} H"
        elif abs_v >= 1e-3:
            return f"{val*1e3:.2f} mH"
        elif abs_v >= 1e-6:
            return f"{val*1e6:.2f} µH"
        else:
            return f"{val:.2f} H"

    elif unit in ["V", "Volt"]:
        if abs_v >= 1.0:
            return f"{val:.2f} V"
        else:
            return f"{val*1e3:.2f} mV"

    elif unit in ["A", "Ampere"]:
        if abs_v >= 1.0:
            return f"{val:.2f} A"
        elif abs_v >= 1e-3:
            return f"{val*1e3:.2f} mA"
        else:
            return f"{val*1e6:.2f} µA"

    elif unit in ["W", "Watt"]:
        if abs_v >= 1.0:
            return f"{val:.2f} W"
        elif abs_v >= 1e-3:
            return f"{val*1e3:.2f} mW"
        else:
            return f"{val*1e6:.2f} µW"

    return f"{val:.2f} {unit}"
