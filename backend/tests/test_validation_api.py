"""
test_validation_api.py — Unit tests for Phase 24A Physical Validation API Endpoints

Tests:
1. GET /api/validation/summary (benchmark counts, software verification status, not tested indicator)
2. GET /api/validation/benchmarks (full list of 10 cases)
3. GET /api/validation/benchmarks/PHYS-001 (single case details)
4. GET /api/validation/benchmarks/PHYS-999 (404 not found)
5. GET /api/validation/failure-injection (6 controlled fault scenarios)
6. GET /api/validation/report (generated markdown report text)
"""

import sys
import os
import unittest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app


class TestValidationAPI(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)

    def test_01_validation_summary(self):
        resp = self.client.get("/api/validation/summary")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["total_benchmarks"], 10)
        self.assertEqual(data["not_tested"], 10)
        self.assertEqual(data["physical_validation_status"], "NOT PERFORMED")
        self.assertTrue(data["software_verified"])
        self.assertGreaterEqual(data["software_tests_passing"], 170)

    def test_02_validation_benchmarks_list(self):
        resp = self.client.get("/api/validation/benchmarks")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["count"], 10)
        self.assertEqual(len(data["benchmarks"]), 10)
        self.assertEqual(data["benchmarks"][0]["case_id"], "PHYS-001")
        self.assertEqual(data["benchmarks"][9]["case_id"], "PHYS-010")

    def test_03_validation_benchmark_single(self):
        resp = self.client.get("/api/validation/benchmarks/PHYS-001")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["case_id"], "PHYS-001")
        self.assertEqual(data["circuit_name"], "5V_Resistor_LED")
        self.assertEqual(data["status"], "NOT_TESTED")
        self.assertEqual(len(data["components"]), 2)

    def test_04_validation_benchmark_not_found(self):
        resp = self.client.get("/api/validation/benchmarks/PHYS-999")
        self.assertEqual(resp.status_code, 404)

    def test_05_failure_injection_scenarios(self):
        resp = self.client.get("/api/validation/failure-injection")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["count"], 6)
        scenarios = data["scenarios"]
        scenario_ids = [s["scenario_id"] for s in scenarios]
        self.assertIn("FAULT-A", scenario_ids)
        self.assertIn("FAULT-B", scenario_ids)
        self.assertIn("FAULT-C", scenario_ids)
        self.assertIn("FAULT-D", scenario_ids)
        self.assertIn("FAULT-E", scenario_ids)
        self.assertIn("FAULT-F", scenario_ids)

    def test_06_validation_report_endpoint(self):
        resp = self.client.get("/api/validation/report")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("markdown", data)
        self.assertIn("Physical Validation & Reliability Report", data["markdown"])
        self.assertEqual(data["physical_validation_status"], "NOT PERFORMED")


if __name__ == "__main__":
    unittest.main()
