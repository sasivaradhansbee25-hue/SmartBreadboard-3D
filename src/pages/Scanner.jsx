import React, { useState } from 'react';
import { Scan, Upload, Camera, FileText, CheckCircle2, ShieldAlert, Sparkles, Layers, Eye, Box, AlertTriangle, Cpu } from 'lucide-react';
import { mockCircuits } from '../data/mockCircuits';
import { useCircuit } from '../context/CircuitContext';
import Breadboard3DCanvas from '../components/Breadboard3DCanvas';
import { API_BASE_URL } from '../services/api';

const CLASS_COLOR_BADGES = {
  resistor: { bg: 'rgba(249, 115, 22, 0.15)', border: '#f97316', text: '#f97316' },
  diode_rectifier: { bg: 'rgba(217, 70, 239, 0.15)', border: '#d946ef', text: '#d946ef' },
  ic_chip: { bg: 'rgba(234, 179, 8, 0.15)', border: '#eab308', text: '#eab308' },
  wire: { bg: 'rgba(56, 189, 248, 0.15)', border: '#38bdf8', text: '#38bdf8' },
  capacitor: { bg: 'rgba(59, 130, 246, 0.15)', border: '#3b82f6', text: '#3b82f6' },
  led: { bg: 'rgba(34, 197, 94, 0.15)', border: '#22c55e', text: '#22c55e' }
};

export default function Scanner() {
  const {
    activeCircuit,
    uploadedImage,
    setUploadedImage,
    isAnalyzingReal,
    setIsAnalyzingReal,
    realAnalysisError,
    setRealAnalysisError,
    setRealCircuitData
  } = useCircuit();

  const [selectedSample, setSelectedSample] = useState(mockCircuits[0]);
  const [annotatedImage, setAnnotatedImage] = useState(null);
  const [detections, setDetections] = useState([]);
  const [mappedComponents, setMappedComponents] = useState([]);
  const [netsSummary, setNetsSummary] = useState([]);
  const [counts, setCounts] = useState({
    resistor: 0,
    diode_rectifier: 0,
    ic_chip: 0,
    wire: 0,
    capacitor: 0,
    led: 0
  });

  const handleSelectSample = (circ) => {
    setSelectedSample(circ);
    setUploadedImage(null);
    setAnnotatedImage(null);
    setDetections([]);
    setMappedComponents([]);
    setNetsSummary([]);
    setCounts({ resistor: 0, diode_rectifier: 0, ic_chip: 0, wire: 0, capacitor: 0, led: 0 });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const dataUrl = evt.target?.result;
        setUploadedImage(dataUrl);
        setAnnotatedImage(null);
        setDetections([]);
        setMappedComponents([]);
        setNetsSummary([]);
        setCounts({ resistor: 0, diode_rectifier: 0, ic_chip: 0, wire: 0, capacitor: 0, led: 0 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunDetection = async () => {
    let imgToAnalyze = uploadedImage;

    if (!imgToAnalyze && selectedSample?.thumbnail) {
      try {
        const resp = await fetch(selectedSample.thumbnail);
        const blob = await resp.blob();
        imgToAnalyze = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        setUploadedImage(imgToAnalyze);
      } catch (err) {
        console.warn("Could not load sample image as base64:", err);
      }
    }

    if (!imgToAnalyze) {
      alert("Please upload or select a breadboard image first.");
      return;
    }

    setIsAnalyzingReal(true);
    setRealAnalysisError(null);

    try {
      console.log("Calling YOLO Detection & Grid Mapping API:", `${API_BASE_URL}/api/detect`);

      const resp = await fetch(`${API_BASE_URL}/api/detect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_base64: imgToAnalyze })
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Detection API error (HTTP ${resp.status}): ${text}`);
      }

      const data = await resp.json();
      console.log("================ BACKEND & FRONTEND DETECTIONS ================");
      console.log("BACKEND DETECTIONS:", data.detections);
      console.log("FRONTEND DETECTIONS:", data.detections);
      console.log("DETECTION COUNTS BY CLASS:", data.counts);
      if (data.detections) {
        data.detections.forEach((d, idx) => {
          console.log(`[#${idx+1}] class: ${d.class_name || d.class}, conf: ${d.confidence}, bbox: [${d.bbox_pixels?.join(', ')}]`);
        });
      }
      console.log("===============================================================");

      if (!data.success && data.error) {
        throw new Error(`YOLO Detection Failed: ${data.error}`);
      }

      setAnnotatedImage(data.annotated_image);
      setDetections(data.detections || []);
      setMappedComponents(data.mapped_components || []);
      setNetsSummary(data.nets_summary || []);
      setCounts(data.counts || { resistor: 0, diode_rectifier: 0, ic_chip: 0, wire: 0, capacitor: 0, led: 0 });

      // Synchronize with CircuitContext
      setRealCircuitData({
        originalImage: imgToAnalyze,
        detections: data.detections || [],
        mapped_components: data.mapped_components || [],
        netlist: data.netlist || {},
        imageMeta: data.image_meta,
        source: 'real'
      });

      setIsAnalyzingReal(false);
    } catch (err) {
      console.error("YOLO Detection Error:", err);
      let msg = err.message || "Failed to execute YOLO detection.";
      if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
        msg = `Backend server unavailable at ${API_BASE_URL}. Please ensure FastAPI backend is running.`;
      }
      setRealAnalysisError(msg);
      setIsAnalyzingReal(false);
    }
  };

  const currentDisplayImage = uploadedImage || selectedSample.thumbnail;
  const totalDetections = detections.length;
  const isRealActive = activeCircuit?.source === 'real';

  return (
    <div style={{ paddingBottom: '2.5rem' }}>
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="page-title">
              <Scan size={28} style={{ color: 'var(--accent-cyan)' }} />
              Real Breadboard Image → 3D Reconstruction
            </h1>
            <p className="page-subtitle">
              End-to-end physical circuit reconstruction: Real Photo → YOLOv8 Detections → Grid Lead Mapping → Netlist → Three.js 3D Breadboard.
            </p>
          </div>
          <div>
            {annotatedImage ? (
              <span className="code-pill" style={{ background: 'rgba(34, 197, 94, 0.15)', color: 'var(--accent-emerald)', borderColor: 'var(--accent-emerald)' }}>
                <Sparkles size={14} /> Detections: {totalDetections} Found
              </span>
            ) : (
              <span className="mock-badge">
                <ShieldAlert size={14} /> Ready for Detection
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Development Sample Selector & Upload */}
      <div className="card" style={{ marginBottom: '1.25rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Samples:</span>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {mockCircuits.map(c => (
                <button
                  key={c.id}
                  onClick={() => handleSelectSample(c)}
                  className="btn btn-secondary"
                  style={{
                    padding: '0.35rem 0.65rem',
                    fontSize: '0.8rem',
                    borderColor: selectedSample.id === c.id && !uploadedImage ? 'var(--accent-cyan)' : 'var(--border-color)',
                    background: selectedSample.id === c.id && !uploadedImage ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.03)'
                  }}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label className="btn btn-secondary" style={{ cursor: 'pointer', padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
              <Upload size={15} /> Upload Photo
              <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
            <button 
              onClick={handleRunDetection}
              disabled={isAnalyzingReal}
              className="btn btn-primary"
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}
            >
              <Sparkles size={15} /> {isAnalyzingReal ? 'Analyzing Circuit...' : 'Analyze Real Image'}
            </button>
          </div>
        </div>

        {realAnalysisError && (
          <div style={{ marginTop: '0.75rem', padding: '0.65rem', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--accent-red)', color: 'var(--accent-red)', fontSize: '0.85rem' }}>
            ⚠ {realAnalysisError}
          </div>
        )}
      </div>

      {/* Step 7: Visual Debug Pipeline Monitor */}
      <div className="card" style={{ marginBottom: '1.25rem', padding: '1rem 1.25rem', background: 'rgba(15, 23, 42, 0.95)', border: '1px solid var(--accent-cyan)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} style={{ color: 'var(--accent-cyan)' }} />
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff', margin: 0 }}>
              Step 7 — Visual Debug Pipeline Monitor
            </h3>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span className="code-pill" style={{ borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}>
              YOLO detections: {detections.length}
            </span>
            <span className="code-pill" style={{ borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}>
              Mapped components: {mappedComponents.length}
            </span>
            <span className="code-pill" style={{ borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}>
              Netlist components: {activeCircuit?.components?.length || 0}
            </span>
            <span className="code-pill" style={{ borderColor: 'var(--accent-emerald)', color: 'var(--accent-emerald)' }}>
              3D components: {activeCircuit?.components?.length || 0}
            </span>
          </div>
        </div>

        {/* Component breakdown list */}
        {mappedComponents.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
            {mappedComponents.map((comp, idx) => {
              const badge = CLASS_COLOR_BADGES[comp.type] || { border: '#fff', text: '#fff' };
              return (
                <div 
                  key={comp.id || idx}
                  style={{
                    padding: '0.35rem 0.65rem',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: `1px solid ${badge.border}`,
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-mono)',
                    color: '#e2e8f0'
                  }}
                >
                  <strong style={{ color: badge.text }}>{comp.designator || `C${idx+1}`}</strong> - {comp.type} - {(comp.confidence * 100).toFixed(0)}% 
                  <span style={{ color: 'var(--text-muted)', marginLeft: '0.35rem' }}>({comp.start_hole || comp.hole1} → {comp.end_hole || comp.hole2})</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Awaiting scan to monitor component flow through YOLO → Backend → Netlist → CircuitContext → 3D Mesh.
          </div>
        )}
      </div>

      {/* Visual Validation Side-by-Side: (A) Real Photo + YOLO vs (B) 3D Reconstructed Breadboard */}
      <div className="card-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '1.5rem' }}>
        {/* Left Column: Image with YOLO Bounding Boxes */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <h2 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)' }}>
              <Camera size={16} /> 
              (A) REAL IMAGE & YOLO DETECTIONS
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {uploadedImage ? 'Custom Photo' : selectedSample.name}
            </span>
          </div>

          <div style={{
            position: 'relative',
            borderRadius: '8px',
            overflow: 'hidden',
            background: '#040711',
            border: '1px solid var(--border-color)',
            height: '420px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem'
          }}>
            {annotatedImage ? (
              <img 
                src={annotatedImage} 
                alt="YOLO Detected Bounding Box Output" 
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            ) : isAnalyzingReal ? (
              <div style={{ textAlign: 'center', color: 'var(--accent-cyan)' }}>
                <div style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '0.5rem' }}>Running YOLO Neural Detection...</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Classifying Resistors, Wires, LEDs, Diodes, ICs, Capacitors</div>
              </div>
            ) : (
              <img 
                src={currentDisplayImage} 
                alt="Original Breadboard Input" 
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            )}
          </div>
        </div>

        {/* Right Column: 3D Reconstructed Breadboard Scene */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <h2 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-emerald)' }}>
              <Box size={16} /> 
              (B) 3D RECONSTRUCTED BREADBOARD
            </h2>
            <span className="code-pill" style={{ fontSize: '0.75rem', color: isRealActive ? 'var(--accent-emerald)' : 'var(--accent-cyan)', borderColor: isRealActive ? 'var(--accent-emerald)' : 'var(--accent-cyan)' }}>
              {isRealActive ? 'Real 3D Mesh' : 'Mock 3D Mesh'}
            </span>
          </div>

          <div style={{ height: '420px', borderRadius: '8px', overflow: 'hidden' }}>
            <Breadboard3DCanvas circuit={activeCircuit} />
          </div>
        </div>
      </div>

      {/* Component Hole Mapping & Generated Netlist Breakdown */}
      <div className="card-grid" style={{ gridTemplateColumns: '3fr 2fr', marginBottom: '1.5rem' }}>
        {/* Mapped Components Table */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu size={16} style={{ color: 'var(--accent-cyan)' }} />
              Component Position & Hole Mapping
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {mappedComponents.length > 0 ? `${mappedComponents.length} Components Resolved` : 'Awaiting Detection'}
            </span>
          </div>

          {mappedComponents.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Click "Analyze Real Image" to run YOLO detection and map leads to physical breadboard tie-points.
            </div>
          ) : (
            <div style={{ overflowX: 'auto', maxHeight: '280px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.5rem' }}>Designator</th>
                    <th style={{ padding: '0.5rem' }}>Type</th>
                    <th style={{ padding: '0.5rem' }}>Start Hole</th>
                    <th style={{ padding: '0.5rem' }}>End Hole</th>
                    <th style={{ padding: '0.5rem' }}>Conf</th>
                    <th style={{ padding: '0.5rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mappedComponents.map((c, i) => {
                    const badgeMeta = CLASS_COLOR_BADGES[c.type] || { text: '#fff' };
                    return (
                      <tr key={c.id || i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '0.5rem', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>
                          {c.designator}
                        </td>
                        <td style={{ padding: '0.5rem', color: badgeMeta.text, textTransform: 'capitalize' }}>
                          {c.type}
                        </td>
                        <td style={{ padding: '0.5rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                          {c.start_hole || c.hole1}
                        </td>
                        <td style={{ padding: '0.5rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                          {c.end_hole || c.hole2}
                        </td>
                        <td style={{ padding: '0.5rem', fontFamily: 'var(--font-mono)', color: c.confidence >= 0.7 ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
                          {(c.confidence * 100).toFixed(0)}%
                        </td>
                        <td style={{ padding: '0.5rem' }}>
                          {c.uncertain_mapping ? (
                            <span style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                              <AlertTriangle size={12} /> Mapping Uncertain
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                              <CheckCircle2 size={12} /> Verified
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Electrical Netlist Synthesis */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={16} style={{ color: 'var(--accent-emerald)' }} />
              Generated Electrical Netlist
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {netsSummary.length} Electrical Nets
            </span>
          </div>

          {netsSummary.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No netlist generated yet. Run detection to synthesize electrical node connectivity.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '280px', overflowY: 'auto' }}>
              {netsSummary.map((netStr, idx) => {
                const parts = netStr.split(':');
                const netName = parts[0];
                const pinList = parts.slice(1).join(':');
                return (
                  <div 
                    key={idx}
                    style={{
                      padding: '0.55rem 0.75rem',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      fontSize: '0.82rem'
                    }}
                  >
                    <div style={{ fontWeight: '700', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', marginBottom: '0.2rem' }}>
                      {netName}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                      Connected Pins: <span style={{ color: '#fff' }}>{pinList || 'None'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
