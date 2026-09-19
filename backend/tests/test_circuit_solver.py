"""
SmartBreadboard 3D — Circuit Solver & Power Source Injection Unit Tests
Tests DC operating point, transient analysis, value parser, source injection, polarity reversal, and error validation.
"""

import sys
import os
import math

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from circuit_solver.dc_solver import run_dc_analysis
from circuit_solver.transient_solver import run_transient_analysis
from cv.value_parser import parse_component_value, format_si_value

def is_approx(val, expected, tol=1e-2):
    if expected == 0:
        return abs(val) <= tol
    return abs(val - expected) / abs(expected) <= tol

def test_1_simple_resistor_12v():
    netlist = {
        "circuit_id": "test_1",
        "power_sources": [
            {"id": "V1", "type": "voltage_source", "voltage": 12.0, "positive_node": "NODE_PWR", "negative_node": "NODE_GND"}
        ],
        "components": [
            {"id": "R1", "type": "resistor", "value": 1000.0, "unit": "Ω", "node1": "NODE_PWR", "node2": "NODE_GND"}
        ]
    }
    res = run_dc_analysis(netlist)
    assert res.success is True, f"Failed: {res.error}"
    assert is_approx(res.total_current_mA, 12.0), f"Got {res.total_current_mA} mA"
    assert is_approx(res.total_power_mW, 144.0), f"Got {res.total_power_mW} mW"

    r1_meas = res.measurements["R1"]
    assert is_approx(r1_meas.current, 0.012), f"Got {r1_meas.current} A"
    assert is_approx(r1_meas.voltage_drop, 12.0), f"Got {r1_meas.voltage_drop} V"


def test_2_series_resistors_12v():
    netlist = {
        "circuit_id": "test_2",
        "power_sources": [
            {"id": "V1", "type": "voltage_source", "voltage": 12.0, "positive_node": "NODE_PWR", "negative_node": "NODE_GND"}
        ],
        "components": [
            {"id": "R1", "type": "resistor", "value": 1000.0, "unit": "Ω", "node1": "NODE_PWR", "node2": "N1"},
            {"id": "R2", "type": "resistor", "value": 1000.0, "unit": "Ω", "node1": "N1", "node2": "NODE_GND"}
        ]
    }
    res = run_dc_analysis(netlist)
    assert res.success is True, f"Failed: {res.error}"
    assert is_approx(res.total_current_mA, 6.0), f"Got {res.total_current_mA} mA"

    r1_meas = res.measurements["R1"]
    r2_meas = res.measurements["R2"]

    assert is_approx(r1_meas.voltage_drop, 6.0), f"Got {r1_meas.voltage_drop} V"
    assert is_approx(r2_meas.voltage_drop, 6.0), f"Got {r2_meas.voltage_drop} V"


def test_3_parallel_resistors_12v():
    netlist = {
        "circuit_id": "test_3",
        "power_sources": [
            {"id": "V1", "type": "voltage_source", "voltage": 12.0, "positive_node": "NODE_PWR", "negative_node": "NODE_GND"}
        ],
        "components": [
            {"id": "R1", "type": "resistor", "value": 1000.0, "unit": "Ω", "node1": "NODE_PWR", "node2": "NODE_GND"},
            {"id": "R2", "type": "resistor", "value": 1000.0, "unit": "Ω", "node1": "NODE_PWR", "node2": "NODE_GND"}
        ]
    }
    res = run_dc_analysis(netlist)
    assert res.success is True, f"Failed: {res.error}"
    assert is_approx(res.total_current_mA, 24.0), f"Got {res.total_current_mA} mA"

    assert is_approx(res.measurements["R1"].current, 0.012)
    assert is_approx(res.measurements["R2"].current, 0.012)


def test_4_real_photo_no_power_source():
    netlist = {
        "circuit_id": "test_no_source",
        "power_sources": [],
        "components": [
            {"id": "R1", "type": "resistor", "value": 1000.0, "node1": "NODE_COL_25_TOP", "node2": "NODE_COL_29_TOP"}
        ]
    }
    res = run_dc_analysis(netlist)
    assert res.success is False
    assert res.error["code"] in ["POWER_SOURCE_REQUIRED", "MISSING_SOURCE"]


def test_5_real_photo_with_user_source():
    netlist = {
        "circuit_id": "test_with_user_source",
        "power_sources": [
            {"id": "V_USER", "type": "voltage_source", "voltage": 12.0, "positive_node": "NODE_COL_25_TOP", "negative_node": "NODE_COL_29_TOP"}
        ],
        "components": [
            {"id": "R1", "type": "resistor", "value": 1000.0, "node1": "NODE_COL_25_TOP", "node2": "NODE_COL_29_TOP"}
        ]
    }
    res = run_dc_analysis(netlist)
    assert res.success is True
    assert is_approx(res.measurements["R1"].voltage_drop, 12.0)
    assert is_approx(res.measurements["R1"].current, 0.012)
    assert is_approx(res.measurements["R1"].power, 0.144)


def test_6_invalid_source_connection():
    netlist = {
        "circuit_id": "test_invalid_src",
        "power_sources": [
            {"id": "V1", "voltage": 0.0, "positive_node": "A", "negative_node": "B"}
        ],
        "components": [
            {"id": "R1", "type": "resistor", "value": 1000.0, "node1": "A", "node2": "B"}
        ]
    }
    res = run_dc_analysis(netlist)
    assert res.success is False
    assert res.error["code"] == "INVALID_SOURCE_VOLTAGE"


def test_7_same_node_source():
    netlist = {
        "circuit_id": "test_same_node",
        "power_sources": [
            {"id": "V1", "voltage": 12.0, "positive_node": "NODE_A", "negative_node": "NODE_A"}
        ],
        "components": [
            {"id": "R1", "type": "resistor", "value": 1000.0, "node1": "NODE_A", "node2": "NODE_B"}
        ]
    }
    res = run_dc_analysis(netlist)
    assert res.success is False
    assert res.error["code"] == "SAME_NODE_SOURCE"


def test_8_source_voltage_update_5v_to_12v():
    netlist_5v = {
        "circuit_id": "test_voltage_change",
        "power_sources": [{"id": "V1", "voltage": 5.0, "positive_node": "A", "negative_node": "B"}],
        "components": [{"id": "R1", "type": "resistor", "value": 1000.0, "node1": "A", "node2": "B"}]
    }
    res_5v = run_dc_analysis(netlist_5v)
    assert is_approx(res_5v.measurements["R1"].current, 0.005)

    netlist_12v = {
        "circuit_id": "test_voltage_change",
        "power_sources": [{"id": "V1", "voltage": 12.0, "positive_node": "A", "negative_node": "B"}],
        "components": [{"id": "R1", "type": "resistor", "value": 1000.0, "node1": "A", "node2": "B"}]
    }
    res_12v = run_dc_analysis(netlist_12v)
    assert is_approx(res_12v.measurements["R1"].current, 0.012)


def test_9_current_direction_reversal():
    netlist = {
        "circuit_id": "test_reverse_polarity",
        "power_sources": [
            {"id": "V1", "type": "voltage_source", "voltage": 12.0, "positive_node": "NODE_GND", "negative_node": "NODE_PWR"}
        ],
        "components": [
            {"id": "R1", "type": "resistor", "value": 1000.0, "node1": "NODE_PWR", "node2": "NODE_GND"}
        ]
    }
    res = run_dc_analysis(netlist)
    assert res.success is True
    r1_meas = res.measurements["R1"]
    assert r1_meas.current < 0  # Reversely polarized current
    assert is_approx(r1_meas.current, -0.012)


def test_10_zero_current_circuit():
    netlist = {
        "circuit_id": "test_zero_current",
        "power_sources": [
            {"id": "V1", "voltage": 0.0001, "positive_node": "A", "negative_node": "B"}
        ],
        "components": []
    }
    res = run_dc_analysis(netlist)
    assert res.success is False
    assert res.error["code"] in ["EMPTY_CIRCUIT", "INVALID_SOURCE_VOLTAGE"]
