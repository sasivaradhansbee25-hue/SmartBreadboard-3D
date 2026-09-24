"""
SmartBreadboard 3D — Intelligence API Unit Tests (Phase 25)
Tests:
1. GET /api/intelligence/registry returns supported circuit categories and taxonomy.
2. POST /api/intelligence/classify verifies standard Voltage Divider.
3. POST /api/intelligence/classify verifies LED Current Limiter.
4. POST /api/intelligence/classify verifies RC Charging circuit.
5. POST /api/intelligence/classify rejects incomplete RC network as oscillator.
6. POST /api/intelligence/classify handles custom/unknown circuits cleanly.
"""

import unittest
from fastapi.testclient import TestClient
from main import app


class TestIntelligenceAPI(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)

    def test_get_circuit_knowledge_registry(self):
        resp = self.client.get("/api/intelligence/registry")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["status"], "success")
        self.assertIn("basic", data["categories"])
        self.assertIn("oscillator", data["categories"])
        self.assertTrue(len(data["supported_circuits"]) >= 5)

    def test_classify_voltage_divider(self):
        payload = {
            "components": [
                {"id": "R1", "type": "resistor", "value": 1000},
                {"id": "R2", "type": "resistor", "value": 2000}
            ]
        }
        resp = self.client.post("/api/intelligence/classify", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["circuit_type"], "VOLTAGE_DIVIDER")
        self.assertEqual(data["verification_state"], "VERIFIED")
        self.assertEqual(data["confidence"], 0.98)

    def test_classify_led_limiter(self):
        payload = {
            "components": [
                {"id": "R1", "type": "resistor", "value": 220},
                {"id": "LED1", "type": "led"}
            ]
        }
        resp = self.client.post("/api/intelligence/classify", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["circuit_type"], "LED_CURRENT_LIMITER")
        self.assertEqual(data["verification_state"], "VERIFIED")

    def test_classify_rc_charging(self):
        payload = {
            "components": [
                {"id": "R1", "type": "resistor", "value": 4700},
                {"id": "C1", "type": "capacitor", "value": 100e-9}
            ]
        }
        resp = self.client.post("/api/intelligence/classify", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["circuit_type"], "RC_CHARGING")
        self.assertEqual(data["verification_state"], "VERIFIED")

    def test_incomplete_rc_oscillator_rejected(self):
        payload = {
            "components": [
                {"id": "R1", "type": "resistor"},
                {"id": "R2", "type": "resistor"},
                {"id": "C1", "type": "capacitor"},
                {"id": "C2", "type": "capacitor"}
            ]
        }
        resp = self.client.post("/api/intelligence/classify", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["circuit_type"], "RC_PHASE_SHIFT_OSCILLATOR")
        self.assertEqual(data["verification_state"], "NOT_VERIFIED")
        self.assertTrue(len(data.get("missing_requirements", [])) >= 2)


if __name__ == "__main__":
    unittest.main()
