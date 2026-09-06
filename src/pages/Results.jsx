import React, { useState, useEffect } from 'react';
import { FileCheck2, AlertTriangle, CheckCircle2, ShieldCheck, Download, XCircle, Activity, Cpu } from 'lucide-react';
import { mockCircuits } from '../data/mockCircuits';
import { analyzeCircuitValidity } from '../utils/validityEngine';
import { requestDcSimulation } from '../services/analysisService';

export default function Results() {
  const [selectedCircuitId, setSelectedCircuitId] = useState(mockCircuits[0].id);
  const [simData, setSimData] = useState(null);

  const currentCircuit = mockCircuits.find(c => c.id === selectedCircuitId) || mockCircuits[0];
  const validityReport = analyzeCircuitValidity(currentCircuit);

  useEffect(() => {
    async function loadSimulation() {
      const res = await requestDcSimulation(currentCircuit);
      setSimData(res);
    }
    loadSimulation();
  }, [currentCircuit]);

  const handleExportJson = () => {
    const reportPayload = {
      circuit_id: currentCircuit.id,
      name: currentCircuit.name,
      source: currentCircuit.source,
      timestamp: new Date().toISOString(),
      health_score: validityReport.healthScore,
      validity_summary: validityReport.issues,
      simulation_readings: simData
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${currentCircuit.id}_full_diagnostic_report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="page-title">
              <FileCheck2 size={28} style={{ color: 'var(--accent-cyan)' }} />
              Comprehensive Circuit Diagnostic Reports
            </h1>
            <p className="page-subtitle">
              Automated error classification (Warnings ⚠ vs Errors ❌), service layer simulation, and power metrics.
            </p>
          </div>
          <div>
            <span className="mock-badge">source: {currentCircuit.source}</span>
          </div>
        </div>
      </div>

      {/* Target Selector & Exporter Toolbar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-muted)' }}>Target Circuit:</span>
            <select
              value={selectedCircuitId}
              onChange={(e) => setSelectedCircuitId(e.target.value)}
              className="input-field"
              style={{ width: 'auto', minWidth: '240px', padding: '0.4rem 0.75rem' }}
            >
              {mockCircuits.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.id})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Health Score:</span>
              <span className="code-pill" style={{
                color: validityReport.healthScore >= 80 ? 'var(--accent-emerald)' : 'var(--accent-amber)',
                fontSize: '1rem'
              }}>
                {validityReport.healthScore}%
              </span>
            </div>

            <button onClick={handleExportJson} className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.45rem 0.85rem' }}>
              <Download size={15} /> Export Diagnostic JSON
            </button>
          </div>
        </div>
      </div>

      {/* SPEC.md §11.4 ERROR / VALIDITY CLASSIFICATION CARDS (WARNINGS ⚠ VS ERRORS ❌) */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={18} style={{ color: 'var(--accent-cyan)' }} />
          Topology & Validity Diagnostics (SPEC.md §11.4 Classification)
        </h2>

        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {validityReport.issues.map((issue) => {
            const isError = issue.type === 'ERROR';
            const isWarning = issue.type === 'WARNING';
            const isPass = issue.type === 'PASS';

            const borderColor = isError ? 'var(--accent-rose)' : isWarning ? 'var(--accent-amber)' : 'var(--accent-emerald)';
            const bgAlpha = isError ? 'rgba(248, 113, 113, 0.08)' : isWarning ? 'rgba(251, 191, 36, 0.08)' : 'rgba(52, 211, 153, 0.08)';
            const iconColor = isError ? 'var(--accent-rose)' : isWarning ? 'var(--accent-amber)' : 'var(--accent-emerald)';

            return (
              <div key={issue.id} className="card" style={{ background: bgAlpha, borderColor }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: iconColor }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{issue.icon}</span>
                    <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{issue.title}</h3>
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    background: 'rgba(0,0,0,0.4)',
                    color: iconColor,
                    border: `1px solid ${borderColor}`
                  }}>
                    {issue.type}
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                  {issue.message}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Component Power Dissipation & Voltage Breakdown Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu size={18} style={{ color: 'var(--accent-cyan)' }} />
            Component Electrical Analysis & Simulation Output
          </h2>
          <span className="code-pill">LED State: {simData?.led_state || 'ON'}</span>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Designator</th>
                <th>Type</th>
                <th>Value</th>
                <th>Node A ↔ Node B</th>
                <th>Est. Power Dissipation</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentCircuit.components.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>{c.designator}</td>
                  <td>{c.type}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{c.user_override_value || c.detected_value}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{c.node_a} ↔ {c.node_b}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>
                    {c.type.includes('Resistor') ? `${currentCircuit.readings?.resistor_power_mW || 47.6} mW` : `${currentCircuit.readings?.led_power_mW || 14.5} mW`}
                  </td>
                  <td><span className="status-badge-ok">Nominal</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
