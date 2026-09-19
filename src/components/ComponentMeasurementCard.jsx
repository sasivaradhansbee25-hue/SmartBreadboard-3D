import React from 'react';
import { useCircuit } from '../context/CircuitContext';

export default function ComponentMeasurementCard({ onOpenValueModal, onOpenCorrectionModal }) {
  const { selectedComponent, measurements, activeCircuit, simulationSource, simulationResult, solverStatus, solverError } = useCircuit();

  if (!selectedComponent) {
    return (
      <div style={{
        background: 'var(--surface-color, #0f172a)',
        border: '1px dashed var(--border-color, #334155)',
        borderRadius: '10px',
        padding: '1.25rem',
        textAlign: 'center',
        color: '#94a3b8'
      }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔍</div>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>Click any component in the 3D Breadboard or list to measure voltage, current & power.</p>
      </div>
    );
  }

  const compId = selectedComponent.name || selectedComponent.designator || selectedComponent.id || 'C1';
  const cType = (selectedComponent.type || selectedComponent.class || 'Component').toUpperCase();

  // Retrieve solver measurement if available
  const m = measurements[compId] || measurements[selectedComponent.id] || {};
  const compObj = activeCircuit?.components?.find(c => (c.id === compId || c.designator === compId)) || selectedComponent;
  const elec = selectedComponent.electrical || null;

  const isSolved = (solverStatus === 'SOLVED' || simulationResult?.solver_status === 'SOLVED');

  const valDisplay = compObj?.displayValue || compObj?.user_override_value || compObj?.formatted_value || compObj?.detected_value || selectedComponent.value || '1 kΩ';
  const valueSource = compObj?.valueSource || selectedComponent.valueSource || 'detected';
  const needsConf = compObj?.needsConfirmation || false;

  const rawV = (elec && elec.voltage !== undefined) ? elec.voltage : (m.voltage !== undefined ? m.voltage : (m.voltageDrop !== undefined ? Math.abs(m.voltageDrop) : undefined));
  const rawI = (elec && elec.current !== undefined) ? elec.current : m.current;
  const rawP = (elec && elec.power !== undefined) ? elec.power : m.power;

  const voltageDrop = isSolved && rawV !== undefined ? `${rawV.toFixed(2)} V` : (isSolved ? 'N/A' : '—');
  const currentDisplay = isSolved && rawI !== undefined ? `${(rawI * 1000).toFixed(2)} mA` : (isSolved ? 'N/A' : '—');
  const powerMw = isSolved && rawP !== undefined ? rawP * 1000 : 0;
  const powerDisplay = isSolved && rawP !== undefined ? `${powerMw.toFixed(2)} mW` : (isSolved ? 'N/A' : '—');

  const termA = m.terminalVoltages?.A !== undefined ? `${m.terminalVoltages.A.toFixed(2)} V` : (m.voltage_a !== undefined ? `${m.voltage_a.toFixed(2)} V` : '0.00 V');
  const termB = m.terminalVoltages?.B !== undefined ? `${m.terminalVoltages.B.toFixed(2)} V` : (m.voltage_b !== undefined ? `${m.voltage_b.toFixed(2)} V` : '0.00 V');

  const sourceOrigin = simulationSource ? "User Simulated" : (activeCircuit?.source === 'real' ? "Reconstructed from uploaded image" : "Built-in demonstration circuit");

  // Source attribution label formatting
  const sourceLabelMap = {
    'ocr': 'Multi-Pass OCR',
    'ocr_consensus': 'OCR Consensus',
    'color_code': 'Color Code',
    'ocr_color_fusion': 'OCR + Color Code Fusion',
    'user_confirmed': 'User Confirmed',
    'user_required': 'Uncertain AI Value',
    'detected': 'Detected'
  };

  const isHighPower = powerMw > 1000; // >1W power warning per Req 14

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      border: `1px solid ${needsConf ? '#f59e0b' : '#3b82f6'}`,
      borderRadius: '10px',
      padding: '1.25rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '1.1rem' }}>{compId} — {cType}</h4>
            {/* Confidence Badge */}
            {needsConf ? (
              <span style={{ fontSize: '0.7rem', background: '#78350f', color: '#fef08a', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>
                ⚠️ CONFIRM VALUE
              </span>
            ) : (
              <span style={{ fontSize: '0.7rem', background: '#064e3b', color: '#6ee7b7', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>
                ● HIGH CONFIDENCE
              </span>
            )}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            Value Source: <strong style={{ color: '#cbd5e1' }}>{sourceLabelMap[valueSource] || valueSource}</strong>
          </div>
        </div>
        <div>
          <button
            onClick={() => onOpenValueModal && onOpenValueModal(compObj)}
            style={{
              background: needsConf ? '#f59e0b' : '#334155',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              padding: '0.3rem 0.7rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: needsConf ? '0 0 8px rgba(245,158,11,0.5)' : 'none'
            }}
          >
            {needsConf ? '⚠️ Set Value' : '✏ Edit Value'}
          </button>
        </div>
      </div>

      {/* Solver Status Banner when NOT_RUN or ERROR */}
      {!isSolved && (
        <div style={{
          background: solverStatus === 'NOT_RUN' || simulationResult?.solver_status === 'NOT_RUN' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${solverStatus === 'NOT_RUN' || simulationResult?.solver_status === 'NOT_RUN' ? '#f59e0b' : '#ef4444'}`,
          borderRadius: '6px',
          padding: '0.5rem 0.75rem',
          marginBottom: '0.75rem',
          fontSize: '0.8rem',
          color: solverStatus === 'NOT_RUN' || simulationResult?.solver_status === 'NOT_RUN' ? '#fef08a' : '#fca5a5'
        }}>
          {solverStatus === 'NOT_RUN' || simulationResult?.solver_status === 'NOT_RUN' ? (
            <span>⏸ <strong>Simulation: NOT RUN</strong> — {simulationResult?.reason || solverError?.message || 'No power source detected in photograph. Add simulated power source for electrical analysis.'}</span>
          ) : (
            <span>⚠️ <strong>Simulation: ERROR</strong> — {solverError?.message || simulationResult?.reason || 'Circuit solver error.'}</span>
          )}
        </div>
      )}

      {/* Power Sanity Warning */}
      {isHighPower && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid #ef4444',
          borderRadius: '6px',
          padding: '0.5rem 0.75rem',
          marginBottom: '0.75rem',
          fontSize: '0.8rem',
          color: '#fca5a5'
        }}>
          ⚠️ <strong>HIGH POWER CHECK:</strong> {compId} would dissipate approximately {(powerMw / 1000).toFixed(2)} W. Please verify component value.
        </div>
      )}

      {/* Main Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Resistance / Value</div>
          <div style={{ fontSize: '1rem', fontWeight: '600', color: '#38bdf8' }}>{valDisplay}</div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Voltage Drop</div>
          <div style={{ fontSize: '1rem', fontWeight: '600', color: '#10b981' }}>{voltageDrop}</div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Current</div>
          <div style={{ fontSize: '1rem', fontWeight: '600', color: '#fbbf24' }}>{currentDisplay}</div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Power Dissipation</div>
          <div style={{ fontSize: '1rem', fontWeight: '600', color: '#f43f5e' }}>{powerDisplay}</div>
        </div>
      </div>

      {/* Terminals Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        background: 'rgba(0,0,0,0.2)',
        padding: '0.5rem 0.75rem',
        borderRadius: '6px',
        fontSize: '0.8rem',
        color: '#cbd5e1'
      }}>
        <span>Terminal A: <strong>{termA}</strong> ({compObj?.hole1 || compObj?.start_hole || 'Hole A'})</span>
        <span>Terminal B: <strong>{termB}</strong> ({compObj?.hole2 || compObj?.end_hole || 'Hole B'})</span>
      </div>

      <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.75rem', textAlign: 'center' }}>
        Simulation result — not a physical measurement.
      </div>
    </div>
  );
}

