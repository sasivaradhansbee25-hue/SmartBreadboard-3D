"""
SmartBreadboard 3D — Centralized Python Mock Circuits Module (SPEC.md Section 13 & 14)
Tagged strictly with "source": "mock" per AGENTS.md Rule 1
Contains all 5 required sample mock circuits.
"""

MOCK_SOURCE_TAG = "mock"

MOCK_CIRCUITS_DATA = [
    {
        "circuit_id": "circ-001",
        "metadata": {
            "name": "1. 5V -> R1 -> LED -> GND (Single Branch)",
            "source": MOCK_SOURCE_TAG,
            "created_at": "2026-08-30T14:22:10Z"
        },
        "power_supply": {"voltage": 5.0, "current_limit": 0.5},
        "nodes": [
            {"id": "NODE_PWR", "label": "VCC (+5V)", "voltage": 5.0, "type": "power"},
            {"id": "NODE_LED_ANODE", "label": "R1-D1 Junction", "voltage": 2.0, "type": "internal"},
            {"id": "NODE_GND", "label": "Ground (0V)", "voltage": 0.0, "type": "ground"}
        ],
        "components": [
            {
                "id": "comp-1",
                "designator": "R1",
                "type": "resistor",
                "detected_value": "220 Ω",
                "user_override_value": "220 Ω",
                "value": 220,
                "unit": "ohm",
                "tolerance": 0.05,
                "node1": "NODE_PWR",
                "node2": "NODE_LED_ANODE",
                "pins": ["A15", "F15"]
            },
            {
                "id": "comp-2",
                "designator": "D1",
                "type": "led",
                "detected_value": "2.0V Forward Drop",
                "user_override_value": "2.0V Forward Drop",
                "value": 2.0,
                "unit": "volt",
                "tolerance": 0.0,
                "node1": "NODE_LED_ANODE",
                "node2": "NODE_GND",
                "pins": ["G15", "G18"]
            }
        ]
    },
    {
        "circuit_id": "circ-002",
        "metadata": {
            "name": "2. Two Resistors in Series (R1 + R2)",
            "source": MOCK_SOURCE_TAG,
            "created_at": "2026-08-30T15:10:00Z"
        },
        "power_supply": {"voltage": 9.0, "current_limit": 0.5},
        "nodes": [
            {"id": "NODE_9V", "label": "VCC (+9V)", "voltage": 9.0, "type": "power"},
            {"id": "NODE_MID", "label": "Series Midpoint", "voltage": 6.18, "type": "internal"},
            {"id": "NODE_GND", "label": "Ground (0V)", "voltage": 0.0, "type": "ground"}
        ],
        "components": [
            {
                "id": "comp-201",
                "designator": "R1",
                "type": "resistor",
                "detected_value": "1 kΩ",
                "user_override_value": "1 kΩ",
                "value": 1000,
                "unit": "ohm",
                "tolerance": 0.05,
                "node1": "NODE_9V",
                "node2": "NODE_MID"
            },
            {
                "id": "comp-202",
                "designator": "R2",
                "type": "resistor",
                "detected_value": "2.2 kΩ",
                "user_override_value": "2.2 kΩ",
                "value": 2200,
                "unit": "ohm",
                "tolerance": 0.05,
                "node1": "NODE_MID",
                "node2": "NODE_GND"
            }
        ]
    },
    {
        "circuit_id": "circ-003",
        "metadata": {
            "name": "3. Two Resistors in Parallel (R1 ∥ R2)",
            "source": MOCK_SOURCE_TAG,
            "created_at": "2026-08-30T15:45:30Z"
        },
        "power_supply": {"voltage": 5.0, "current_limit": 0.2},
        "nodes": [
            {"id": "NODE_5V", "label": "VCC (+5V)", "voltage": 5.0, "type": "power"},
            {"id": "NODE_GND", "label": "Ground (0V)", "voltage": 0.0, "type": "ground"}
        ],
        "components": [
            {
                "id": "comp-301",
                "designator": "R1",
                "type": "resistor",
                "detected_value": "10 kΩ",
                "user_override_value": "10 kΩ",
                "value": 10000,
                "unit": "ohm",
                "node1": "NODE_5V",
                "node2": "NODE_GND"
            },
            {
                "id": "comp-302",
                "designator": "R2",
                "type": "resistor",
                "detected_value": "10 kΩ",
                "user_override_value": "10 kΩ",
                "value": 10000,
                "unit": "ohm",
                "node1": "NODE_5V",
                "node2": "NODE_GND"
            }
        ]
    },
    {
        "circuit_id": "circ-004",
        "metadata": {
            "name": "4. Mixed Resistor Network (Multi-Branch Bridge)",
            "source": MOCK_SOURCE_TAG,
            "created_at": "2026-08-30T16:30:15Z"
        },
        "power_supply": {"voltage": 12.0, "current_limit": 0.5},
        "nodes": [
            {"id": "NODE_12V", "label": "VCC (+12V)", "voltage": 12.0, "type": "power"},
            {"id": "NODE_BRIDGE", "label": "Bridge Node", "voltage": 7.18, "type": "internal"},
            {"id": "NODE_GND", "label": "Ground (0V)", "voltage": 0.0, "type": "ground"}
        ],
        "components": [
            {"id": "comp-401", "designator": "R1", "type": "resistor", "detected_value": "1 kΩ", "value": 1000, "node1": "NODE_12V", "node2": "NODE_BRIDGE"},
            {"id": "comp-402", "designator": "R2", "type": "resistor", "detected_value": "2.2 kΩ", "value": 2200, "node1": "NODE_BRIDGE", "node2": "NODE_GND"},
            {"id": "comp-403", "designator": "R3", "type": "resistor", "detected_value": "4.7 kΩ", "value": 4700, "node1": "NODE_BRIDGE", "node2": "NODE_GND"}
        ]
    },
    {
        "circuit_id": "circ-005",
        "metadata": {
            "name": "5. Resistors + Capacitors Combined (RC Filter)",
            "source": MOCK_SOURCE_TAG,
            "created_at": "2026-08-30T16:50:12Z"
        },
        "power_supply": {"voltage": 5.0, "current_limit": 0.1},
        "nodes": [
            {"id": "NODE_IN", "label": "Signal Input (5V)", "voltage": 5.0, "type": "input"},
            {"id": "NODE_OUT", "label": "Filtered Output (fc = 338.6Hz)", "voltage": 3.53, "type": "output"},
            {"id": "NODE_GND", "label": "Ground (0V)", "voltage": 0.0, "type": "ground"}
        ],
        "components": [
            {"id": "comp-501", "designator": "R1", "type": "resistor", "detected_value": "4.7 kΩ", "value": 4700, "node1": "NODE_IN", "node2": "NODE_OUT"},
            {"id": "comp-502", "designator": "C1", "type": "capacitor", "detected_value": "100 nF", "value": 100e-9, "node1": "NODE_OUT", "node2": "NODE_GND"}
        ]
    }
]
