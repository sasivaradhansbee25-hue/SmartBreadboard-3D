import React, { useState } from 'react';
import { Box, Play, RotateCcw, ShieldAlert, Zap, Info, Sliders, Eye, FileCode, Sparkles } from 'lucide-react';
import { mockCircuits } from '../data/mockCircuits';
import { useCircuit } from '../context/CircuitContext';
import Schematic2DRenderer from '../components/Schematic2DRenderer';
import Breadboard3DCanvas from '../components/Breadboard3DCanvas';

export default function Simulator() {
  const { activeCircuit, setActiveCircuit, setMockCircuitData } = useCircuit();
  const [viewMode, setViewMode] = useState('3d'); // Default to 3D Viewport
  const [activeProbePin, setActiveProbePin] = useState(null);
  const [probeReadout, setProbeReadout] = useState({ voltage: '0.00 V', node: 'Ground Rail', current: '0.0 mA' });
  const [isSimulating, setIsSimulating] = useState(true);

  const isReal = activeCircuit.source === 'real';

  const handlePinClick = (pinName, voltageVal, nodeLabel) => {
    setActiveProbePin(pinName);
    setProbeReadout({
      voltage: `${voltageVal} V`,
      node: nodeLabel,
      current: voltageVal > 0 ? `${(voltageVal / 1.45).toFixed(1)} mA` : '0.0 mA'
    });
  };

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="page-title">
              <Box size={28} style={{ color: 'var(--accent-cyan)' }} />
              2D / 3D Interactive Breadboard Simulator Workspace
            </h1>
            <p className="page-subtitle">
              Interactive 2D breadboard tie-point grid, 2D IEEE schematic graph, and Three.js 3D WebGL viewport.
            </p>
          </div>
          <div>
            {isReal ? (
              <span className="code-pill" style={{ background: 'rgba(34, 197, 94, 0.15)', color: 'var(--accent-emerald)', borderColor: 'var(--accent-emerald)' }}>
                <Sparkles size={14} /> Data Source: REAL AI
              </span>
            ) : (
              <span className="mock-badge">
                <ShieldAlert size={14} /> Data Source: Mock Demo
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Circuit Selection & Control Toolbar */}
      <div className="card" style={{ marginBottom: '1.25rem', padding: '0.85rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Target Circuit:</span>
            
            {isReal ? (
              <span className="code-pill" style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', borderColor: 'var(--accent-emerald)' }}>
                Real Scanned Netlist ({activeCircuit.components?.length || 0} Components)
              </span>
            ) : (
              <select
                value={activeCircuit.id}
                onChange={(e) => setMockCircuitData(mockCircuits.find(c => c.id === e.target.value) || mockCircuits[0])}
                className="input-field"
                style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.85rem' }}
              >
                {mockCircuits.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}

            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className="btn btn-primary"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
            >
              <Play size={14} /> {isSimulating ? 'Simulation Active' : 'Start Simulation'}
            </button>
          </div>

          {/* View Mode Toolbar: 2D Breadboard | 2D Schematic | 3D Interactive Three.js */}
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setViewMode('3d')}
              className="btn btn-secondary"
              style={{
                fontSize: '0.8rem',
                padding: '0.4rem 0.75rem',
                borderColor: viewMode === '3d' ? 'var(--accent-cyan)' : 'var(--border-color)',
                background: viewMode === '3d' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.03)',
                color: 'var(--accent-cyan)'
              }}
            >
              <Eye size={14} /> 3D Three.js Viewport
            </button>
            <button
              onClick={() => setViewMode('breadboard')}
              className="btn btn-secondary"
              style={{
                fontSize: '0.8rem',
                padding: '0.4rem 0.75rem',
                borderColor: viewMode === 'breadboard' ? 'var(--accent-cyan)' : 'var(--border-color)',
                background: viewMode === 'breadboard' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.03)'
              }}
            >
              <Box size={14} /> 2D Breadboard
            </button>
            <button
              onClick={() => setViewMode('schematic')}
              className="btn btn-secondary"
              style={{
                fontSize: '0.8rem',
                padding: '0.4rem 0.75rem',
                borderColor: viewMode === 'schematic' ? 'var(--accent-cyan)' : 'var(--border-color)',
                background: viewMode === 'schematic' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.03)'
              }}
            >
              <FileCode size={14} /> 2D Schematic
            </button>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === '3d' ? (
        <div style={{ marginBottom: '1.5rem' }}>
          <Breadboard3DCanvas circuit={activeCircuit} />
        </div>
      ) : viewMode === 'schematic' ? (
        <div style={{ marginBottom: '1.5rem' }}>
          <Schematic2DRenderer circuit={activeCircuit} />
        </div>
      ) : (
        /* 2D Breadboard Tie-Point Grid Overlay View */
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>2D Tie-Point Voltage Probe Workspace</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Click tie-point holes to probe node voltage</span>
          </div>

          <div style={{
            position: 'relative',
            background: '#080c14',
            borderRadius: '8px',
            padding: '1.5rem',
            overflowX: 'auto',
            border: '1px solid var(--border-color)'
          }}>
            {/* Visual Tie-Point Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', minWidth: '700px' }}>
              {/* Power Rail Top */}
              <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(239, 68, 68, 0.08)', padding: '0.4rem', borderRadius: '4px', borderLeft: '3px solid #ef4444' }}>
                <span style={{ fontSize: '0.75rem', width: '60px', color: '#ef4444', fontWeight: '700' }}>VCC (+5V)</span>
                {[...Array(25)].map((_, i) => (
                  <button
                    key={`vcc-${i}`}
                    onClick={() => handlePinClick(`VCC_${i+1}`, 5.0, 'VCC (+5V Power Rail)')}
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '3px',
                      border: '1px solid #ef4444',
                      background: activeProbePin === `VCC_${i+1}` ? '#ef4444' : 'rgba(239, 68, 68, 0.2)',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>

              {/* Main Grid Rows A-E */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '4px' }}>
                {['A', 'B', 'C', 'D', 'E'].map(row => (
                  <div key={row} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', width: '25px', color: 'var(--text-muted)', fontWeight: '600' }}>{row}</span>
                    {[...Array(25)].map((_, i) => (
                      <button
                        key={`${row}${i+1}`}
                        onClick={() => handlePinClick(`${row}${i+1}`, (i === 9 || i === 21) ? 2.1 : 0.0, `Node ${row}${i+1}`)}
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '3px',
                          border: '1px solid var(--border-color)',
                          background: activeProbePin === `${row}${i+1}` ? 'var(--accent-cyan)' : '#0f172a',
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>

              {/* Center Channel Trough Divider */}
              <div style={{ height: '10px', background: '#1e293b', borderRadius: '2px', textAlign: 'center', fontSize: '0.65rem', color: 'var(--text-muted)', lineHeight: '10px' }}>
                DIP Center Channel Divider (E-F Isolation)
              </div>

              {/* Main Grid Rows F-J */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '4px' }}>
                {['F', 'G', 'H', 'I', 'J'].map(row => (
                  <div key={row} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', width: '25px', color: 'var(--text-muted)', fontWeight: '600' }}>{row}</span>
                    {[...Array(25)].map((_, i) => (
                      <button
                        key={`${row}${i+1}`}
                        onClick={() => handlePinClick(`${row}${i+1}`, 0.0, `Node ${row}${i+1}`)}
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '3px',
                          border: '1px solid var(--border-color)',
                          background: activeProbePin === `${row}${i+1}` ? 'var(--accent-cyan)' : '#0f172a',
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>

              {/* Power Rail Bottom */}
              <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(59, 130, 246, 0.08)', padding: '0.4rem', borderRadius: '4px', borderLeft: '3px solid #3b82f6' }}>
                <span style={{ fontSize: '0.75rem', width: '60px', color: '#3b82f6', fontWeight: '700' }}>GND (0V)</span>
                {[...Array(25)].map((_, i) => (
                  <button
                    key={`gnd-${i}`}
                    onClick={() => handlePinClick(`GND_${i+1}`, 0.0, 'GND (0V Ground Rail)')}
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '3px',
                      border: '1px solid #3b82f6',
                      background: activeProbePin === `GND_${i+1}` ? '#3b82f6' : 'rgba(59, 130, 246, 0.2)',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Voltage Probe Readout Drawer */}
      <div className="card-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="card">
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Zap size={16} style={{ color: 'var(--accent-amber)' }} /> Voltage Probe Telemetry
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Probed Hole:</span>
              <span style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>{activeProbePin || 'None (Click Grid Pin)'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Electrical Node:</span>
              <span>{probeReadout.node}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Node Voltage:</span>
              <span style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>{probeReadout.voltage}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Branch Current:</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{probeReadout.current}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Info size={16} /> Netlist Node Structure
          </h3>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Total Components: <strong style={{ color: '#fff' }}>{activeCircuit.components?.length || 0}</strong> | Total Nodes: <strong style={{ color: '#fff' }}>{activeCircuit.nodes?.length || 0}</strong>
          </div>
          <div style={{ marginTop: '0.5rem', maxHeight: '100px', overflowY: 'auto', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '4px' }}>
            {activeCircuit.components?.map(c => (
              <div key={c.id}>
                {c.id} ({c.type}): {c.node1} ({c.hole1}) &lt;-&gt; {c.node2} ({c.hole2})
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
