"""
backend/tests/test_supply_configuration.py — Unit Tests for Phase 24.2 Manual Supply Configuration & Simulation Control

Requirements (Section 15):
1. valid supply
2. missing positive node
3. missing ground
4. same positive and ground node
5. invalid voltage
6. unknown node
7. ambiguous node
8. stale circuit signature
9. blocked topology
10. successful MNA simulation
11. failed MNA simulation
12. simulation invalidation after topology change
"""

import unittest
import copy
from core.supply_configuration import (
    configure_supply,
    validate_supply_configuration,
    build_supply_source,
    is_supply_configuration_current,
    invalidate_supply_configuration,
    build_simulation_ready_circuit,
    clear_supply_configuration,
    get_supply_configuration,
    run_deterministic_mna_simulation,
    STATUS_NOT_CONFIGURED,
    STATUS_INVALID_NODE,
    STATUS_SAME_NODE,
    STATUS_INVALID_VOLTAGE,
    STATUS_VALID,
    STATUS_BLOCKED,
    STATUS_ERROR,
    STATUS_SOLVED,
    REASON_SUPPLY_REQUIRED,
    REASON_POSITIVE_NODE_NOT_SELECTED,
    REASON_GROUND_NODE_NOT_SELECTED,
    REASON_AMBIGUOUS_CIRCUIT,
    REASON_UNKNOWN_COMPONENT,
    REASON_INVALID_SUPPLY_NODE,
    REASON_SAME_SUPPLY_REFERENCE,
    REASON_INVALID_VOLTAGE,
    REASON_STALE_CIRCUIT_SIGNATURE,
    REASON_STALE_CIRCUIT,
    REASON_SOLVER_ERROR
)


def create_mock_verified_circuit():
    """Builds a verified test circuit with R1 (220 ohms) and LED1 (red) in series."""
    return {
        "status": "READY",
        "circuit_signature": "SIG_BASE_TEST_12345678",
        "base_circuit_signature": "SIG_BASE_TEST_12345678",
        "simulation_ready": False,
        "simulation_readiness_reason": REASON_SUPPLY_REQUIRED,
        "components": [
            {
                "id": "R1",
                "designator": "R1",
                "type": "resistor",
                "value": 220.0,
                "unit": "Ω",
                "status": "VERIFIED",
                "terminals": [
                    {"terminal": "terminal_1", "hole": "E10", "node": "NODE_1"},
                    {"terminal": "terminal_2", "hole": "E15", "node": "NODE_2"}
                ]
            },
            {
                "id": "LED1",
                "designator": "LED1",
                "type": "led",
                "value": 2.0,
                "unit": "V",
                "status": "VERIFIED",
                "terminals": [
                    {"terminal": "anode", "hole": "E15", "node": "NODE_2"},
                    {"terminal": "cathode", "hole": "E20", "node": "NODE_3"}
                ]
            }
        ],
        "nodes": [
            {"node_id": "NODE_1", "members": ["R1.terminal_1"]},
            {"node_id": "NODE_2", "members": ["R1.terminal_2", "LED1.anode"]},
            {"node_id": "NODE_3", "members": ["LED1.cathode"]}
        ],
        "connections": [
            {"component_id": "R1", "terminal": "terminal_1", "node_id": "NODE_1", "hole": "E10"},
            {"component_id": "R1", "terminal": "terminal_2", "node_id": "NODE_2", "hole": "E15"},
            {"component_id": "LED1", "terminal": "anode", "node_id": "NODE_2", "hole": "E15"},
            {"component_id": "LED1", "terminal": "cathode", "node_id": "NODE_3", "hole": "E20"}
        ]
    }


class TestManualSupplyConfiguration(unittest.TestCase):
    """Verifies all Phase 24.2 specifications for manual power supply configuration."""

    def test_01_valid_supply(self):
        """1. Valid supply: user selects verified positive node, ground node, and positive voltage."""
        circuit = create_mock_verified_circuit()
        supply = configure_supply(circuit, positive_node="NODE_1", ground_node="NODE_3", voltage=5.0)

        self.assertEqual(supply["status"], STATUS_VALID)
        self.assertTrue(supply["enabled"])
        self.assertEqual(supply["positive_node"], "NODE_1")
        self.assertEqual(supply["ground_node"], "NODE_3")
        self.assertEqual(supply["voltage"], 5.0)

        val_res = validate_supply_configuration(circuit)
        self.assertTrue(val_res["valid"])
        self.assertEqual(val_res["status"], STATUS_VALID)

        stored = get_supply_configuration(circuit)
        self.assertEqual(stored["status"], STATUS_VALID)
        self.assertTrue(circuit["simulation_ready"])

        # Test build_supply_source
        src = build_supply_source(supply)
        self.assertEqual(src["type"], "voltage_source")
        self.assertEqual(src["voltage"], 5.0)
        self.assertEqual(src["positive_node"], "NODE_1")
        self.assertEqual(src["negative_node"], "NODE_3")

    def test_02_missing_positive_node(self):
        """2. Missing positive node: validation fails when positive node is unselected or missing."""
        circuit = create_mock_verified_circuit()
        val_res = validate_supply_configuration(circuit, positive_node="", ground_node="NODE_3", voltage=5.0)
        self.assertFalse(val_res["valid"])
        self.assertEqual(val_res["reason"], REASON_POSITIVE_NODE_NOT_SELECTED)

    def test_03_missing_ground(self):
        """3. Missing ground: validation fails when ground reference node is not selected."""
        circuit = create_mock_verified_circuit()
        val_res = validate_supply_configuration(circuit, positive_node="NODE_1", ground_node="", voltage=5.0)
        self.assertFalse(val_res["valid"])
        self.assertEqual(val_res["reason"], REASON_GROUND_NODE_NOT_SELECTED)

    def test_04_same_positive_and_ground_node(self):
        """4. Same positive and ground node: rejects short circuit reference."""
        circuit = create_mock_verified_circuit()
        supply = configure_supply(circuit, positive_node="NODE_1", ground_node="NODE_1", voltage=5.0)

        self.assertEqual(supply["status"], STATUS_SAME_NODE)
        val_res = validate_supply_configuration(circuit)
        self.assertFalse(val_res["valid"])
        self.assertEqual(val_res["status"], STATUS_SAME_NODE)
        self.assertEqual(val_res["reason"], REASON_SAME_SUPPLY_REFERENCE)

    def test_05_invalid_voltage(self):
        """5. Invalid voltage: non-numeric, 0V, negative, or >100V rejected."""
        circuit = create_mock_verified_circuit()

        # Zero volts
        supply_zero = configure_supply(circuit, "NODE_1", "NODE_3", 0.0)
        self.assertEqual(supply_zero["status"], STATUS_INVALID_VOLTAGE)

        # Negative volts
        supply_neg = configure_supply(circuit, "NODE_1", "NODE_3", -3.3)
        self.assertEqual(supply_neg["status"], STATUS_INVALID_VOLTAGE)

        # Non-numeric
        supply_nan = configure_supply(circuit, "NODE_1", "NODE_3", "abc")
        self.assertEqual(supply_nan["status"], STATUS_INVALID_VOLTAGE)

        # Excessive voltage (>100V)
        supply_high = configure_supply(circuit, "NODE_1", "NODE_3", 150.0)
        self.assertEqual(supply_high["status"], STATUS_INVALID_VOLTAGE)

    def test_06_unknown_node(self):
        """6. Unknown node: node not in verified circuit nodes rejected."""
        circuit = create_mock_verified_circuit()
        val_res = validate_supply_configuration(circuit, positive_node="NODE_UNKNOWN_99", ground_node="NODE_3", voltage=5.0)
        self.assertFalse(val_res["valid"])
        self.assertEqual(val_res["reason"], REASON_INVALID_SUPPLY_NODE)

    def test_07_ambiguous_node(self):
        """7. Ambiguous node: nodes labeled UNRESOLVED or AMBIGUOUS are rejected."""
        circuit = create_mock_verified_circuit()
        val_res = validate_supply_configuration(circuit, positive_node="UNRESOLVED", ground_node="NODE_3", voltage=5.0)
        self.assertFalse(val_res["valid"])
        self.assertEqual(val_res["reason"], REASON_INVALID_SUPPLY_NODE)

    def test_08_stale_circuit_signature(self):
        """8. Stale circuit signature: rejects supply if signature does not match circuit state."""
        circuit = create_mock_verified_circuit()
        configure_supply(circuit, "NODE_1", "NODE_3", 5.0)
        supply = circuit["supply"]

        # Current check
        self.assertTrue(is_supply_configuration_current(supply, circuit["circuit_signature"]))
        self.assertFalse(is_supply_configuration_current(supply, "OUTDATED_STALE_SIG_999"))

        # Validation check
        val_res = validate_supply_configuration(circuit, circuit_signature="OUTDATED_STALE_SIG_999")
        self.assertFalse(val_res["valid"])
        self.assertEqual(val_res["reason"], REASON_STALE_CIRCUIT_SIGNATURE)

    def test_09_blocked_topology(self):
        """9. Blocked topology: ambiguous circuit status or unknown component blocks simulation."""
        circuit = create_mock_verified_circuit()
        circuit["status"] = "AMBIGUOUS"

        val_res = validate_supply_configuration(circuit, positive_node="NODE_1", ground_node="NODE_3", voltage=5.0)
        self.assertFalse(val_res["valid"])
        self.assertEqual(val_res["status"], STATUS_BLOCKED)
        self.assertEqual(val_res["reason"], REASON_AMBIGUOUS_CIRCUIT)

        # Simulation also blocked
        sim_res = run_deterministic_mna_simulation(circuit)
        self.assertEqual(sim_res["status"], STATUS_BLOCKED)
        self.assertEqual(sim_res["reason"], REASON_AMBIGUOUS_CIRCUIT)

    def test_10_successful_mna_simulation(self):
        """10. Successful MNA simulation: returns solved voltages, currents, power, and waveforms."""
        circuit = create_mock_verified_circuit()
        configure_supply(circuit, "NODE_1", "NODE_3", 5.0)

        sim_res = run_deterministic_mna_simulation(circuit)
        self.assertEqual(sim_res["status"], STATUS_SOLVED)
        self.assertIn("NODE_1", sim_res["node_voltages"])
        self.assertIn("R1", sim_res["component_currents"])
        self.assertIn("R1", sim_res["component_voltages"])
        self.assertIn("R1", sim_res["component_power"])
        self.assertIn("waveforms", sim_res)
        self.assertIn("time", sim_res)
        self.assertEqual(sim_res["source"], "deterministic_mna_solver")
        self.assertEqual(sim_res["physical_validation_status"], "NOT PERFORMED")

    def test_11_failed_mna_simulation(self):
        """11. Failed MNA simulation: unconfigured circuit returns clear failure state."""
        circuit = create_mock_verified_circuit()
        clear_supply_configuration(circuit)

        sim_res = run_deterministic_mna_simulation(circuit)
        self.assertEqual(sim_res["status"], STATUS_BLOCKED)
        self.assertIsNotNone(sim_res["error_code"])
        self.assertIsNone(sim_res["simulation_signature"])

    def test_12_simulation_invalidation_after_topology_change(self):
        """12. Simulation invalidation after topology change: invalidates cached result and supply."""
        circuit = create_mock_verified_circuit()
        configure_supply(circuit, "NODE_1", "NODE_3", 5.0)

        sim_res = run_deterministic_mna_simulation(circuit)
        self.assertEqual(sim_res["status"], STATUS_SOLVED)
        self.assertIsNotNone(circuit["simulation_result"])

        # Topology change triggers invalidate_supply_configuration
        invalidate_supply_configuration(circuit)
        self.assertIsNone(circuit["simulation_result"])
        self.assertEqual(circuit["simulation_status"], "NOT_RUN")
        self.assertIsNone(circuit["simulation_signature"])
        self.assertFalse(circuit["supply"]["enabled"])


class TestSupplyConfigurationAPI(unittest.TestCase):
    """Verifies FastAPI HTTP endpoints for Phase 24.2."""

    @classmethod
    def setUpClass(cls):
        from fastapi.testclient import TestClient
        from main import app
        cls.client = TestClient(app)

    def test_api_supply_validate_endpoint(self):
        """Tests POST /api/circuit/supply/validate endpoint."""
        circuit = create_mock_verified_circuit()

        # Valid supply validation
        res = self.client.post("/api/circuit/supply/validate", json={
            "positive_node": "NODE_1",
            "ground_node": "NODE_3",
            "voltage": 5.0,
            "circuit_state": circuit
        })
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["valid"])
        self.assertEqual(data["supply"]["positive_node"], "NODE_1")

        # Invalid supply validation (short circuit)
        res_bad = self.client.post("/api/circuit/supply/validate", json={
            "positive_node": "NODE_1",
            "ground_node": "NODE_1",
            "voltage": 5.0,
            "circuit_state": circuit
        })
        self.assertEqual(res_bad.status_code, 400)
        data_bad = res_bad.json()
        self.assertFalse(data_bad["valid"])
        self.assertEqual(data_bad["reason"], REASON_SAME_SUPPLY_REFERENCE)

    def test_api_supply_configure_and_simulate_flow(self):
        """Tests full API flow: configure supply -> simulate -> clear supply."""
        circuit = create_mock_verified_circuit()

        # 1. Configure supply
        res = self.client.post("/api/circuit/supply/configure", json={
            "positive_node": "NODE_1",
            "ground_node": "NODE_3",
            "voltage": 5.0,
            "circuit_state": circuit
        })
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], STATUS_VALID)
        self.assertTrue(data["simulation_ready"])
        self.assertEqual(data["supply"]["voltage"], 5.0)

        # 2. Get active supply
        get_res = self.client.get("/api/circuit/supply")
        self.assertEqual(get_res.status_code, 200)
        get_data = get_res.json()
        self.assertEqual(get_data["supply"]["positive_node"], "NODE_1")

        # 3. Simulate circuit
        sim_res = self.client.post("/api/circuit/simulate", json={
            "circuit_state": circuit
        })
        self.assertEqual(sim_res.status_code, 200)
        sim_data = sim_res.json()
        self.assertEqual(sim_data["status"], STATUS_SOLVED)
        self.assertIn("node_voltages", sim_data)
        self.assertIn("component_currents", sim_data)
        self.assertIn("component_voltages", sim_data)
        self.assertIn("component_power", sim_data)
        self.assertIn("waveforms", sim_data)

        # 4. Clear supply
        clear_res = self.client.post("/api/circuit/supply/clear", json={
            "circuit_state": circuit
        })
        self.assertEqual(clear_res.status_code, 200)
        clear_data = clear_res.json()
        self.assertEqual(clear_data["supply"]["status"], STATUS_NOT_CONFIGURED)
        self.assertFalse(clear_data["simulation_ready"])

    def test_api_simulate_blocks_unconfigured_supply(self):
        """Simulation endpoint rejects unconfigured circuits with 400 and machine-readable reason."""
        circuit = create_mock_verified_circuit()
        clear_supply_configuration(circuit)

        sim_res = self.client.post("/api/circuit/simulate", json={
            "circuit_state": circuit
        })
        self.assertEqual(sim_res.status_code, 400)
        data = sim_res.json()
        self.assertIn(data["status"], [STATUS_BLOCKED, STATUS_ERROR])
        self.assertIsNotNone(data.get("reason") or data.get("error_code"))

    def test_13_rlc_circuit_simulation(self):
        """
        Phase 24.3: Validates deterministic MNA simulation for RLC circuit
        (Resistor R1, Inductor L1, Capacitor C1, and Jumper Wire W1).
        Verifies physically correct DC steady-state operating point:
        - Inductor acts as short circuit (V_L ≈ 0, I_L = branch current).
        - Capacitor acts as open circuit (I_C = 0, V_C = charged voltage).
        - No fake waveforms or oscillations.
        """
        rlc_circuit = {
            "status": "READY",
            "circuit_signature": "SIG_RLC_CIRCUIT_VERIFIED_7788",
            "base_circuit_signature": "SIG_RLC_CIRCUIT_VERIFIED_7788",
            "components": [
                {
                    "id": "R1",
                    "designator": "R1",
                    "type": "resistor",
                    "value": 100.0,
                    "unit": "Ω",
                    "status": "VERIFIED",
                    "terminals": [
                        {"terminal": "terminal_1", "hole": "A10", "node": "NODE_1"},
                        {"terminal": "terminal_2", "hole": "E15", "node": "NODE_2"}
                    ]
                },
                {
                    "id": "L1",
                    "designator": "L1",
                    "type": "inductor",
                    "value": 0.01,  # 10 mH
                    "unit": "H",
                    "status": "VERIFIED",
                    "terminals": [
                        {"terminal": "terminal_1", "hole": "D15", "node": "NODE_2"},
                        {"terminal": "terminal_2", "hole": "D20", "node": "NODE_3"}
                    ]
                },
                {
                    "id": "W1",
                    "designator": "W1",
                    "type": "wire",
                    "value": 0.001,
                    "unit": "Ω",
                    "status": "VERIFIED",
                    "terminals": [
                        {"terminal": "terminal_1", "hole": "C20", "node": "NODE_3"},
                        {"terminal": "terminal_2", "hole": "C22", "node": "NODE_4"}
                    ]
                },
                {
                    "id": "C1",
                    "designator": "C1",
                    "type": "capacitor",
                    "value": 10e-6,  # 10 uF
                    "unit": "F",
                    "status": "VERIFIED",
                    "terminals": [
                        {"terminal": "terminal_1", "hole": "E22", "node": "NODE_4"},
                        {"terminal": "terminal_2", "hole": "E30", "node": "NODE_GND"}
                    ]
                }
            ],
            "nodes": ["NODE_1", "NODE_2", "NODE_3", "NODE_4", "NODE_GND"]
        }

        # Configure supply: +5.0 V between NODE_1 and NODE_GND
        configure_supply(rlc_circuit, positive_node="NODE_1", ground_node="NODE_GND", voltage=5.0)
        self.assertTrue(rlc_circuit["simulation_ready"])

        # Execute deterministic MNA simulation
        res = run_deterministic_mna_simulation(rlc_circuit)
        self.assertEqual(res["status"], STATUS_SOLVED)
        self.assertEqual(res["physical_validation_status"], "NOT PERFORMED")

        # 1. Node voltages verification
        nv = res["node_voltages"]
        self.assertEqual(nv["NODE_GND"], 0.0)
        self.assertAlmostEqual(nv["NODE_1"], 5.0, places=2)

        # In series DC steady-state with capacitor C1 blocking DC current:
        # I = 0 everywhere through the series branch
        ci = res["component_currents"]
        cv = res["component_voltages"]
        cp = res["component_power"]

        # Capacitor holds full 5V DC charge across plates, zero current
        self.assertAlmostEqual(ci["C1"], 0.0, places=5)
        self.assertAlmostEqual(cp["C1"], 0.0, places=5)
        self.assertAlmostEqual(cv["C1"], 5.0, places=2)

        # Inductor has zero voltage drop in DC steady state
        self.assertAlmostEqual(cv["L1"], 0.0, places=4)
        self.assertAlmostEqual(cp["L1"], 0.0, places=5)

        # Resistor has zero current and zero drop since series capacitor blocks DC
        self.assertAlmostEqual(ci["R1"], 0.0, places=5)
        self.assertAlmostEqual(cp["R1"], 0.0, places=5)

        # 2. Waveforms contain all required RLC signals
        wf = res["waveforms"]
        self.assertIn("V(NODE_1)", wf)
        self.assertIn("V(NODE_2)", wf)
        self.assertIn("I(R1)", wf)
        self.assertIn("I(L1)", wf)
        self.assertIn("I(C1)", wf)
        self.assertIn("P(R1)", wf)
        self.assertIn("P(L1)", wf)
        self.assertIn("P(C1)", wf)

        # 3. Waveform integrity: DC steady state is constant across time points (no fake oscillations)
        time_pts = res["time"]
        self.assertEqual(len(time_pts), 6)
        self.assertEqual(wf["V(NODE_1)"], [5.0] * len(time_pts))

    def test_14_rlc_stale_signature_rejection(self):
        """
        Phase 24.3: Changing RLC component value or connections invalidates
        previous simulation and rejects stale simulation requests.
        """
        rlc_circuit = {
            "status": "READY",
            "circuit_signature": "SIG_RLC_BASE_1",
            "base_circuit_signature": "SIG_RLC_BASE_1",
            "components": [
                {
                    "id": "R1",
                    "type": "resistor",
                    "value": 100.0,
                    "terminals": [
                        {"terminal": "t1", "hole": "A10", "node": "NODE_1"},
                        {"terminal": "t2", "hole": "E15", "node": "NODE_2"}
                    ]
                },
                {
                    "id": "L1",
                    "type": "inductor",
                    "value": 0.01,
                    "terminals": [
                        {"terminal": "t1", "hole": "D15", "node": "NODE_2"},
                        {"terminal": "t2", "hole": "D20", "node": "NODE_GND"}
                    ]
                }
            ],
            "nodes": ["NODE_1", "NODE_2", "NODE_GND"]
        }

        configure_supply(rlc_circuit, positive_node="NODE_1", ground_node="NODE_GND", voltage=5.0)
        orig_sig = rlc_circuit["circuit_signature"]

        # Simulate with matching signature -> SOLVED
        res_ok = run_deterministic_mna_simulation(rlc_circuit, expected_signature=orig_sig)
        self.assertEqual(res_ok["status"], STATUS_SOLVED)

        # Simulate with stale signature -> BLOCKED
        res_stale = run_deterministic_mna_simulation(rlc_circuit, expected_signature="SIG_OUTDATED_STALE_123")
        self.assertEqual(res_stale["status"], STATUS_BLOCKED)
        self.assertEqual(res_stale["reason"], REASON_STALE_CIRCUIT)

    def test_15_rlc_reset_simulation(self):
        """
        Phase 24.3: Reset simulation functionality clears active supply
        configuration, restores base signature, and invalidates simulation results.
        """
        rlc_circuit = {
            "status": "READY",
            "circuit_signature": "SIG_RLC_BASE_ORIG",
            "base_circuit_signature": "SIG_RLC_BASE_ORIG",
            "components": [
                {
                    "id": "R1",
                    "type": "resistor",
                    "value": 100.0,
                    "terminals": [
                        {"terminal": "t1", "hole": "A10", "node": "NODE_1"},
                        {"terminal": "t2", "hole": "E15", "node": "NODE_2"}
                    ]
                },
                {
                    "id": "C1",
                    "type": "capacitor",
                    "value": 10e-6,
                    "terminals": [
                        {"terminal": "t1", "hole": "D15", "node": "NODE_2"},
                        {"terminal": "t2", "hole": "D20", "node": "NODE_GND"}
                    ]
                }
            ],
            "nodes": ["NODE_1", "NODE_2", "NODE_GND"]
        }

        # 1. Configure and solve
        configure_supply(rlc_circuit, positive_node="NODE_1", ground_node="NODE_GND", voltage=5.0)
        res = run_deterministic_mna_simulation(rlc_circuit)
        self.assertEqual(res["status"], STATUS_SOLVED)
        self.assertIsNotNone(rlc_circuit.get("simulation_result"))

        # 2. Reset / clear supply
        cleared = clear_supply_configuration(rlc_circuit)
        self.assertEqual(cleared["status"], STATUS_NOT_CONFIGURED)
        self.assertFalse(cleared["enabled"])

        # 3. Assert simulation state is completely reset
        self.assertIsNone(rlc_circuit.get("simulation_result"))
        self.assertEqual(rlc_circuit.get("simulation_status"), "NOT_RUN")
        self.assertFalse(rlc_circuit.get("simulation_ready"))
        self.assertEqual(rlc_circuit.get("circuit_signature"), "SIG_RLC_BASE_ORIG")

    def test_16_rlc_transient_initialization_and_time_stepping(self):
        """
        Phase 24.4: Deterministic RLC transient initialization and time step consistency.
        At t=0, initial conditions: V_C(0) = 0, I_L(0) = 0, I_R(0) = 0, P(0) = 0.
        All 101 points generated with uniform timestep dt = 0.0001s.
        """
        rlc_circuit = {
            "status": "READY",
            "circuit_signature": "SIG_RLC_TR_1",
            "base_circuit_signature": "SIG_RLC_TR_1",
            "components": [
                {
                    "id": "R1",
                    "type": "resistor",
                    "value": 100.0,
                    "terminals": [
                        {"terminal": "t1", "hole": "A10", "node": "NODE_1"},
                        {"terminal": "t2", "hole": "E15", "node": "NODE_2"}
                    ]
                },
                {
                    "id": "L1",
                    "type": "inductor",
                    "value": 0.01,
                    "terminals": [
                        {"terminal": "t1", "hole": "D15", "node": "NODE_2"},
                        {"terminal": "t2", "hole": "D20", "node": "NODE_3"}
                    ]
                },
                {
                    "id": "C1",
                    "type": "capacitor",
                    "value": 10e-6,
                    "terminals": [
                        {"terminal": "t1", "hole": "C20", "node": "NODE_3"},
                        {"terminal": "t2", "hole": "C25", "node": "NODE_GND"}
                    ]
                }
            ],
            "nodes": ["NODE_1", "NODE_2", "NODE_3", "NODE_GND"]
        }

        configure_supply(rlc_circuit, positive_node="NODE_1", ground_node="NODE_GND", voltage=5.0)
        res = run_deterministic_mna_simulation(
            rlc_circuit,
            simulation_mode="transient",
            duration=0.01,
            timestep=0.0001
        )

        self.assertEqual(res["status"], STATUS_SOLVED)
        self.assertEqual(res["physical_validation_status"], "NOT PERFORMED")
        self.assertEqual(res["timestep"], 0.0001)
        self.assertEqual(res["duration"], 0.01)

        time_pts = res["time"]
        self.assertEqual(len(time_pts), 101)
        self.assertEqual(time_pts[0], 0.0)
        self.assertAlmostEqual(time_pts[-1], 0.01, places=6)

        # Check initial state variables at t=0
        cv = res["component_voltages"]
        ci = res["component_currents"]
        cp = res["component_power"]

        self.assertEqual(cv["C1"][0], 0.0)
        self.assertEqual(ci["L1"][0], 0.0)
        self.assertEqual(ci["R1"][0], 0.0)
        self.assertEqual(cv["R1"][0], 0.0)
        self.assertEqual(cp["R1"][0], 0.0)
        self.assertEqual(cp["L1"][0], 0.0)
        self.assertEqual(cp["C1"][0], 0.0)

    def test_17_rlc_transient_capacitor_charging_and_inductor_evolution(self):
        """
        Phase 24.4: Capacitor voltage and inductor current evolve according to
        numerical time-domain solutions (not fake sine waves or forced DC steady-state).
        """
        rlc_circuit = {
            "status": "READY",
            "circuit_signature": "SIG_RLC_EVOL_1",
            "base_circuit_signature": "SIG_RLC_EVOL_1",
            "components": [
                {
                    "id": "R1",
                    "type": "resistor",
                    "value": 100.0,
                    "terminals": [
                        {"terminal": "t1", "hole": "A10", "node": "NODE_1"},
                        {"terminal": "t2", "hole": "E15", "node": "NODE_2"}
                    ]
                },
                {
                    "id": "L1",
                    "type": "inductor",
                    "value": 0.01,
                    "terminals": [
                        {"terminal": "t1", "hole": "D15", "node": "NODE_2"},
                        {"terminal": "t2", "hole": "D20", "node": "NODE_3"}
                    ]
                },
                {
                    "id": "C1",
                    "type": "capacitor",
                    "value": 10e-6,
                    "terminals": [
                        {"terminal": "t1", "hole": "C20", "node": "NODE_3"},
                        {"terminal": "t2", "hole": "C25", "node": "NODE_GND"}
                    ]
                }
            ],
            "nodes": ["NODE_1", "NODE_2", "NODE_3", "NODE_GND"]
        }

        configure_supply(rlc_circuit, positive_node="NODE_1", ground_node="NODE_GND", voltage=5.0)
        res = run_deterministic_mna_simulation(rlc_circuit, simulation_mode="transient")

        vc = res["component_voltages"]["C1"]
        il = res["component_currents"]["L1"]
        ir = res["component_currents"]["R1"]

        # 1. Capacitor charges up monotonically towards 5.0 V
        self.assertLess(vc[1], vc[10])
        self.assertLess(vc[10], vc[50])
        self.assertGreater(vc[-1], 4.95)

        # 2. Inductor current starts at 0, peaks, then decays as capacitor reaches charge
        max_il = max(il)
        self.assertGreater(max_il, 0.02)
        self.assertLess(il[-1], max_il / 10.0)

        # 3. In series RLC, branch current is strictly identical through R, L, C for every step
        ic = res["component_currents"]["C1"]
        for k in range(len(res["time"])):
            self.assertAlmostEqual(ir[k], il[k], places=6)
            self.assertAlmostEqual(il[k], ic[k], places=6)

    def test_18_rlc_transient_power_calculation(self):
        """
        Phase 24.4: Power trajectories P_R(t), P_L(t), P_C(t) satisfy P(t) = V(t) * I(t).
        """
        rlc_circuit = {
            "status": "READY",
            "circuit_signature": "SIG_RLC_POW_1",
            "base_circuit_signature": "SIG_RLC_POW_1",
            "components": [
                {
                    "id": "R1",
                    "type": "resistor",
                    "value": 100.0,
                    "terminals": [
                        {"terminal": "t1", "hole": "A10", "node": "NODE_1"},
                        {"terminal": "t2", "hole": "E15", "node": "NODE_2"}
                    ]
                },
                {
                    "id": "L1",
                    "type": "inductor",
                    "value": 0.01,
                    "terminals": [
                        {"terminal": "t1", "hole": "D15", "node": "NODE_2"},
                        {"terminal": "t2", "hole": "D20", "node": "NODE_3"}
                    ]
                },
                {
                    "id": "C1",
                    "type": "capacitor",
                    "value": 10e-6,
                    "terminals": [
                        {"terminal": "t1", "hole": "C20", "node": "NODE_3"},
                        {"terminal": "t2", "hole": "C25", "node": "NODE_GND"}
                    ]
                }
            ],
            "nodes": ["NODE_1", "NODE_2", "NODE_3", "NODE_GND"]
        }

        configure_supply(rlc_circuit, positive_node="NODE_1", ground_node="NODE_GND", voltage=5.0)
        res = run_deterministic_mna_simulation(rlc_circuit, simulation_mode="transient")

        cp = res["component_power"]
        cv = res["component_voltages"]
        ci = res["component_currents"]

        for k in range(len(res["time"])):
            expected_pr = cv["R1"][k] * ci["R1"][k]
            expected_pl = cv["L1"][k] * ci["L1"][k]
            expected_pc = cv["C1"][k] * ci["C1"][k]

            self.assertAlmostEqual(cp["R1"][k], expected_pr, places=5)
            self.assertAlmostEqual(cp["L1"][k], expected_pl, places=5)
            self.assertAlmostEqual(cp["C1"][k], expected_pc, places=5)

    def test_19_rlc_transient_deterministic_repeatability(self):
        """
        Phase 24.4: Running transient simulation repeatedly produces exact deterministic results.
        """
        rlc_circuit = {
            "status": "READY",
            "circuit_signature": "SIG_RLC_REPEAT",
            "base_circuit_signature": "SIG_RLC_REPEAT",
            "components": [
                {
                    "id": "R1",
                    "type": "resistor",
                    "value": 100.0,
                    "terminals": [
                        {"terminal": "t1", "hole": "A10", "node": "NODE_1"},
                        {"terminal": "t2", "hole": "E15", "node": "NODE_2"}
                    ]
                },
                {
                    "id": "L1",
                    "type": "inductor",
                    "value": 0.01,
                    "terminals": [
                        {"terminal": "t1", "hole": "D15", "node": "NODE_2"},
                        {"terminal": "t2", "hole": "D20", "node": "NODE_3"}
                    ]
                },
                {
                    "id": "C1",
                    "type": "capacitor",
                    "value": 10e-6,
                    "terminals": [
                        {"terminal": "t1", "hole": "C20", "node": "NODE_3"},
                        {"terminal": "t2", "hole": "C25", "node": "NODE_GND"}
                    ]
                }
            ],
            "nodes": ["NODE_1", "NODE_2", "NODE_3", "NODE_GND"]
        }

        configure_supply(rlc_circuit, positive_node="NODE_1", ground_node="NODE_GND", voltage=5.0)
        res1 = run_deterministic_mna_simulation(rlc_circuit, simulation_mode="transient")
        res2 = run_deterministic_mna_simulation(rlc_circuit, simulation_mode="transient")

        self.assertEqual(res1["time"], res2["time"])
        self.assertEqual(res1["component_voltages"], res2["component_voltages"])
        self.assertEqual(res1["component_currents"], res2["component_currents"])
        self.assertEqual(res1["component_power"], res2["component_power"])
        self.assertEqual(res1["waveforms"], res2["waveforms"])

    def test_20_rlc_transient_stale_signature_rejection(self):
        """
        Phase 24.4: Stale signature rejects transient simulation request.
        """
        rlc_circuit = {
            "status": "READY",
            "circuit_signature": "SIG_RLC_STALE_ORIG",
            "base_circuit_signature": "SIG_RLC_STALE_ORIG",
            "components": [
                {
                    "id": "R1",
                    "type": "resistor",
                    "value": 100.0,
                    "terminals": [
                        {"terminal": "t1", "hole": "A10", "node": "NODE_1"},
                        {"terminal": "t2", "hole": "E15", "node": "NODE_2"}
                    ]
                },
                {
                    "id": "C1",
                    "type": "capacitor",
                    "value": 10e-6,
                    "terminals": [
                        {"terminal": "t1", "hole": "D15", "node": "NODE_2"},
                        {"terminal": "t2", "hole": "D20", "node": "NODE_GND"}
                    ]
                }
            ],
            "nodes": ["NODE_1", "NODE_2", "NODE_GND"]
        }

        configure_supply(rlc_circuit, positive_node="NODE_1", ground_node="NODE_GND", voltage=5.0)

        # Correct signature -> SOLVED
        res_ok = run_deterministic_mna_simulation(
            rlc_circuit,
            expected_signature=rlc_circuit["circuit_signature"],
            simulation_mode="transient"
        )
        self.assertEqual(res_ok["status"], STATUS_SOLVED)

        # Stale signature -> BLOCKED
        res_stale = run_deterministic_mna_simulation(
            rlc_circuit,
            expected_signature="SIG_OUTDATED_STALE_123",
            simulation_mode="transient"
        )
        self.assertEqual(res_stale["status"], STATUS_BLOCKED)
        self.assertEqual(res_stale["reason"], REASON_STALE_CIRCUIT)


if __name__ == "__main__":
    unittest.main()

