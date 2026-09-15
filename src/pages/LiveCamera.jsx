import React, { useState, useEffect, useRef, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useCircuit } from '../context/CircuitContext';
import { requestLiveCameraAnalysis } from '../services/analysisService';
import { API_BASE_URL, WS_BASE_URL } from '../services/api';
import Breadboard3DCanvas from '../components/Breadboard3DCanvas';
import ComponentMeasurementCard from '../components/ComponentMeasurementCard';
import PowerSourcePanel from '../components/PowerSourcePanel';
import SimulationControls from '../components/SimulationControls';
import ValueInputModal from '../components/ValueInputModal';
import UserCorrectionModal from '../components/UserCorrectionModal';
import { Camera, CameraOff, RefreshCw, Zap, Layers, Smartphone, Monitor, QrCode, Wifi, CheckCircle2 } from 'lucide-react';

export default function LiveCamera() {
  const {
    activeCircuit,
    setActiveCircuit,
    measurements,
    runElectricalAnalysis,
    setSelectedComponent,
    simulationSource
  } = useCircuit();

  // Camera Source Mode: 'phone' (Default flagship) | 'laptop'
  const [cameraSource, setCameraSource] = useState('phone');

  // Phone Camera WebRTC & Session State
  const [sessionId, setSessionId] = useState('');
  const [lanIp, setLanIp] = useState('');
  const [phoneConnected, setPhoneConnected] = useState(false);

  // Camera Stream Lifecycle State: 'idle' | 'requesting' | 'connected' | 'video_ready' | 'error'
  const [cameraStatus, setCameraStatus] = useState('idle');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [compareMode, setCompareMode] = useState(true);
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });

  // Analysis & Tracking State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanStatus, setScanStatus] = useState('idle'); // idle, scanning, stable, desynced, error
  const [events, setEvents] = useState([]);
  const [latestToast, setLatestToast] = useState(null);
  const [previousState, setPreviousState] = useState(null);
  const [detections, setDetections] = useState([]);

  // Modals
  const [valueModalComp, setValueModalComp] = useState(null);
  const [correctionModalComp, setCorrectionModalComp] = useState(null);

  // DOM & WebRTC Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const streamRef = useRef(null);
  const sampleTimer = useRef(null);
  const wsRef = useRef(null);
  const pcRef = useRef(null);

  // 1. Generate Session ID & Fetch LAN IP for Phone Pairing
  const generateNewSession = useCallback(() => {
    const newId = 'SB3D-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setSessionId(newId);
    setPhoneConnected(false);
    return newId;
  }, []);

  useEffect(() => {
    generateNewSession();

    // Fetch Laptop LAN IP from backend for QR code generation
    fetch(`${API_BASE_URL}/api/lan-ip`)
      .then(res => res.json())
      .then(data => {
        if (data && data.lan_ip) {
          setLanIp(data.lan_ip);
        }
      })
      .catch(e => {
        console.warn("Could not fetch LAN IP, falling back to window.location.hostname:", e);
      });
  }, [generateNewSession]);

  // Phone Camera WebRTC Signaling Connection
  const initPhoneSignaling = useCallback((sessId) => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    if (pcRef.current) {
      pcRef.current.close();
    }

    const wsUrl = `${WS_BASE_URL}/ws/camera/${sessId}?role=laptop`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("[Laptop] WebRTC signaling connected for session:", sessId);
    };

    ws.onmessage = async (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === 'peer_status') {
          if (msg.status === 'connected') {
            console.log("[Laptop] Phone connected to pairing session!");
            setPhoneConnected(true);
            setCameraStatus('connected');
          } else if (msg.status === 'disconnected') {
            console.log("[Laptop] Phone disconnected");
            setPhoneConnected(false);
            setCameraStatus('idle');
            setScanStatus('idle');
          }
        } else if (msg.type === 'offer') {
          console.log("[Laptop] Received WebRTC offer from phone");
          setCameraStatus('connected');
          const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
          });
          pcRef.current = pc;

          pc.ontrack = (e) => {
            console.log("[Laptop] Received remote video stream track from phone!");
            if (videoRef.current && e.streams[0]) {
              videoRef.current.srcObject = e.streams[0];
              videoRef.current.play().catch(err => console.warn("Remote video play error:", err));
              checkVideoReady();
            }
          };

          pc.onicecandidate = (e) => {
            if (e.candidate && ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: 'ice_candidate', candidate: e.candidate }));
            }
          };

          await pc.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp: msg.sdp }));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'answer', sdp: answer.sdp }));
            console.log("[Laptop] Sent WebRTC SDP answer to phone");
          }
        } else if (msg.type === 'ice_candidate' && pcRef.current && msg.candidate) {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(msg.candidate));
        }
      } catch (e) {
        console.warn("[Laptop WS] Error processing message:", e);
      }
    };

    ws.onerror = (e) => {
      console.warn("[Laptop WS] Error:", e);
    };

    ws.onclose = () => {
      console.log("[Laptop WS] Closed");
    };
  }, []);

  useEffect(() => {
    if (cameraSource === 'phone' && sessionId && !isDemoMode) {
      initPhoneSignaling(sessionId);
    }

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (pcRef.current) pcRef.current.close();
    };
  }, [cameraSource, sessionId, isDemoMode, initPhoneSignaling]);

  // Check if video is truly ready with valid dimensions and frame data
  const checkVideoReady = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
      setVideoDimensions({ width: video.videoWidth, height: video.videoHeight });
      setCameraStatus('video_ready');
      setCameraActive(true);
      setScanStatus('scanning');
    }
  }, []);

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.warn("Video play error on metadata load:", e));
    }
    checkVideoReady();
  };

  const handleVideoCanPlay = () => {
    checkVideoReady();
  };

  // 2. Start Physical Laptop Webcam Fallback
  const startLaptopCamera = async () => {
    stopCamera();
    setCameraError(null);
    setIsDemoMode(false);
    setCameraSource('laptop');
    setCameraStatus('requesting');

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Webcam API (navigator.mediaDevices.getUserMedia) is not supported in this browser.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "environment" },
        audio: false
      });

      const tracks = stream.getVideoTracks();
      if (!tracks || tracks.length === 0 || !tracks[0].enabled) {
        throw new Error("Webcam stream acquired but no active video track found.");
      }

      streamRef.current = stream;
      setCameraStatus('connected');

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.warn("video.play() warning:", playErr);
        }
      }

      checkVideoReady();
    } catch (err) {
      console.warn("Laptop camera start error:", err);
      setCameraError(err.message || "Failed to access laptop webcam. Please check permissions or try Demo Camera mode.");
      setCameraStatus('error');
      setCameraActive(false);
    }
  };

  // 3. Stop Camera Stream
  const stopCamera = useCallback(() => {
    if (sampleTimer.current) {
      clearInterval(sampleTimer.current);
      sampleTimer.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
    if (overlayRef.current) {
      const ctx = overlayRef.current.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);
    }
    setCameraActive(false);
    setCameraStatus('idle');
    setScanStatus('idle');
    setDetections([]);
    setVideoDimensions({ width: 0, height: 0 });
  }, []);

  // 4. Enable Demo Camera Mode
  const startDemoMode = async () => {
    stopCamera();
    setIsDemoMode(true);
    setCameraError(null);
    setCameraStatus('idle');
    setScanStatus('scanning');
    analyzeFrameFromAsset();
  };

  // 5. Capture Frame from Video / Canvas (Works for both Phone WebRTC & Laptop Webcam)
  const captureFrameBase64 = () => {
    if (isDemoMode) {
      return null;
    }

    if (!videoRef.current || !canvasRef.current || cameraStatus !== 'video_ready') {
      return null;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || video.paused || video.ended || video.videoWidth === 0 || video.videoHeight === 0) {
      return null;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.85);
  };

  // 6. Draw Bounding Box Visual Overlay over Camera Preview
  const drawOverlayDetections = (dets, imgW = 800, imgH = 600) => {
    if (!overlayRef.current) return;
    const overlay = overlayRef.current;
    const ctx = overlay.getContext('2d');
    if (!ctx) return;

    const width = overlay.clientWidth || 800;
    const height = overlay.clientHeight || 600;
    if (overlay.width !== width || overlay.height !== height) {
      overlay.width = width;
      overlay.height = height;
    }

    ctx.clearRect(0, 0, overlay.width, overlay.height);

    if (!dets || dets.length === 0) return;

    const sourceW = (videoRef.current && videoRef.current.videoWidth > 0) ? videoRef.current.videoWidth : imgW;
    const sourceH = (videoRef.current && videoRef.current.videoHeight > 0) ? videoRef.current.videoHeight : imgH;

    const scaleX = overlay.width / max(sourceW, 1);
    const scaleY = overlay.height / max(sourceH, 1);

    dets.forEach(d => {
      const bbox = d.bbox || d.bbox_pixels || [100, 100, 200, 200];
      const x1 = bbox[0] * scaleX;
      const y1 = bbox[1] * scaleY;
      const bw = (bbox[2] - bbox[0]) * scaleX;
      const bh = (bbox[3] - bbox[1]) * scaleY;
      const label = `${d.id || d.designator || 'Comp'}: ${d.class || d.type || 'Component'} (${Math.round((d.confidence || 0.9) * 100)}%)`;

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.strokeRect(x1, y1, bw, bh);

      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(x1, max(0, y1 - 24), ctx.measureText(label).width + 12, 24);

      ctx.fillStyle = '#f8fafc';
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText(label, x1 + 6, max(16, y1 - 8));
    });
  };

  // 7. Analyze Single Frame via FastAPI `/api/camera/analyze`
  const processFrameAnalysis = async (frameB64) => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);

    try {
      let b64Payload = frameB64;

      if (!b64Payload || isDemoMode) {
        b64Payload = await fetchDemoAssetBase64();
      }

      if (!b64Payload) {
        setIsAnalyzing(false);
        return;
      }

      const pSource = simulationSource ? {
        id: "V_USER_SIMULATED",
        type: "dc",
        voltage: simulationSource.value || 12.0,
        positive_node: simulationSource.positiveNode || "NET_VCC (+5V)",
        negative_node: simulationSource.negativeNode || "NET_GND (0V)",
        source: "user_simulated"
      } : null;

      const res = await requestLiveCameraAnalysis(b64Payload, previousState, pSource);

      if (res && res.status === 'success') {
        setDetections(res.detections || []);
        drawOverlayDetections(res.detections || []);

        if (res.change_events && res.change_events.length > 0) {
          setEvents(prev => [...res.change_events, ...prev].slice(0, 10));
          setLatestToast(res.change_events[0]);
          setTimeout(() => setLatestToast(null), 4000);
        }

        setScanStatus(res.stable ? 'stable' : 'desynced');

        if (res.netlist) {
          const updatedNetlist = {
            ...res.netlist,
            source: cameraSource === 'phone' ? 'phone_webrtc' : 'laptop_camera',
            power_supply: simulationSource ? { voltage: simulationSource.value } : { voltage: 12.0 }
          };
          setActiveCircuit(updatedNetlist);
          setPreviousState({ components: res.mapped_components || [] });

          if (res.electrical_analysis && res.electrical_analysis.measurements) {
            runElectricalAnalysis();
          }
        }
      }
    } catch (e) {
      console.warn("Live camera analysis error:", e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeFrameFromAsset = () => {
    processFrameAnalysis(null);
  };

  // 8. Frame Sampling Loop (3–5 FPS async max)
  useEffect(() => {
    if (cameraStatus === 'video_ready' && !isDemoMode) {
      sampleTimer.current = setInterval(() => {
        const frame = captureFrameBase64();
        if (frame) {
          processFrameAnalysis(frame);
        }
      }, 350); // ~3 FPS for optimal temporal stability
    } else {
      if (sampleTimer.current) clearInterval(sampleTimer.current);
    }

    return () => {
      if (sampleTimer.current) clearInterval(sampleTimer.current);
    };
  }, [cameraStatus, isDemoMode, previousState, simulationSource]);

  useEffect(() => {
    return () => {
      stopCamera();
      if (wsRef.current) wsRef.current.close();
      if (pcRef.current) pcRef.current.close();
    };
  }, [stopCamera]);

  const comps = activeCircuit?.components || [];
  const hostForQr = lanIp || window.location.hostname;
  const phoneCameraUrl = `http://${hostForQr}:5173/phone-camera?session=${sessionId}`;

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1600px', margin: '0 auto', color: '#f8fafc' }}>
      {/* Top Header / Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Zap style={{ color: '#38bdf8' }} size={26} />
            LIVE CIRCUIT DIGITAL TWIN
          </h2>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.88rem', color: '#94a3b8' }}>
            Phone Camera WebRTC → AI Feature Tracking → Topology Reconstruction → Live MNA 3D Digital Twin
          </p>
        </div>

        {/* Live Status Bar */}
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          {/* Camera Source Selector Pills */}
          <div style={{
            display: 'flex',
            background: '#1e293b',
            padding: '3px',
            borderRadius: '20px',
            border: '1px solid #334155'
          }}>
            <button
              onClick={() => { setCameraSource('phone'); setIsDemoMode(false); }}
              style={{
                background: cameraSource === 'phone' && !isDemoMode ? '#2563eb' : 'transparent',
                color: cameraSource === 'phone' && !isDemoMode ? '#fff' : '#94a3b8',
                border: 'none',
                borderRadius: '16px',
                padding: '0.3rem 0.8rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Smartphone size={14} /> PHONE CAMERA
            </button>
            <button
              onClick={() => { setCameraSource('laptop'); setIsDemoMode(false); startLaptopCamera(); }}
              style={{
                background: cameraSource === 'laptop' && !isDemoMode ? '#2563eb' : 'transparent',
                color: cameraSource === 'laptop' && !isDemoMode ? '#fff' : '#94a3b8',
                border: 'none',
                borderRadius: '16px',
                padding: '0.3rem 0.8rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Monitor size={14} /> LAPTOP CAMERA
            </button>
          </div>

          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: cameraStatus === 'video_ready' ? '#064e3b' : (cameraStatus === 'connected' || cameraStatus === 'requesting' ? '#78350f' : '#334155'),
            color: cameraStatus === 'video_ready' ? '#6ee7b7' : (cameraStatus === 'connected' || cameraStatus === 'requesting' ? '#fde047' : '#cbd5e1'),
            padding: '0.4rem 0.8rem',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 600
          }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: cameraStatus === 'video_ready' ? '#10b981' : (cameraStatus === 'connected' || cameraStatus === 'requesting' ? '#eab308' : '#64748b')
            }}></span>
            {cameraStatus === 'video_ready' ? (cameraSource === 'phone' ? '🟢 PHONE CAMERA READY' : '🟢 LAPTOP CAMERA READY') : 
             cameraStatus === 'connected' ? '🟡 STREAM CONNECTED' :
             cameraStatus === 'requesting' ? '🟡 CONNECTING CAMERA...' :
             isDemoMode ? 'DEMO CAMERA MODE' : 'CAMERA STANDBY'}
          </span>

          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: scanStatus === 'stable' ? '#064e3b' : (scanStatus === 'desynced' ? '#78350f' : '#1e293b'),
            color: scanStatus === 'stable' ? '#6ee7b7' : (scanStatus === 'desynced' ? '#fde047' : '#94a3b8'),
            padding: '0.4rem 0.8rem',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 600
          }}>
            {scanStatus === 'stable' ? '● CIRCUIT STABLE' : (scanStatus === 'desynced' ? '🟡 DESYNC DETECTED' : '○ STANDBY')}
          </span>
        </div>
      </div>

      {/* Floating Change Event Toast */}
      {latestToast && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          zIndex: 9999,
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          border: '1px solid #818cf8',
          borderRadius: '8px',
          padding: '0.8rem 1.2rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          color: '#e0e7ff',
          fontSize: '0.9rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem'
        }}>
          <span style={{ fontSize: '1.2rem' }}>⚡</span>
          <span>{latestToast}</span>
        </div>
      )}

      {/* Main Split Grid (Live Camera | 3D Digital Twin) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: compareMode ? '1fr 1fr' : '1fr',
        gap: '1.25rem',
        marginBottom: '1.5rem'
      }}>
        {/* LEFT: Live Camera Preview / Phone QR Pairing */}
        <div style={{
          background: '#0f172a',
          border: '1px solid #334155',
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
        }}>
          {/* Card Header */}
          <div style={{
            background: '#1e293b',
            padding: '0.75rem 1rem',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #334155'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.95rem' }}>
              {cameraSource === 'phone' ? <Smartphone size={18} style={{ color: '#38bdf8' }} /> : <Camera size={18} style={{ color: '#38bdf8' }} />}
              <span>{cameraSource === 'phone' ? '📱 PHONE CAMERA STREAM' : '📷 LAPTOP WEBCAM SCANNER'}</span>
            </div>

            {/* Toolbar Buttons */}
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {cameraSource === 'phone' && (
                <button
                  onClick={() => { const newSess = generateNewSession(); initPhoneSignaling(newSess); }}
                  style={{
                    background: '#334155',
                    color: '#cbd5e1',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.4rem 0.8rem',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <RefreshCw size={14} /> New QR
                </button>
              )}

              {cameraSource === 'laptop' && (
                cameraStatus === 'idle' ? (
                  <button
                    onClick={startLaptopCamera}
                    style={{
                      background: '#2563eb',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <Camera size={14} /> Start Camera
                  </button>
                ) : (
                  <button
                    onClick={stopCamera}
                    style={{
                      background: '#dc2626',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <CameraOff size={14} /> Stop Camera
                  </button>
                )
              )}

              <button
                onClick={startDemoMode}
                style={{
                  background: isDemoMode ? '#7c3aed' : '#334155',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                📺 Demo Mode
              </button>

              <button
                onClick={() => setCompareMode(!compareMode)}
                style={{
                  background: '#334155',
                  color: '#cbd5e1',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                ⇄ Compare View
              </button>
            </div>
          </div>

          {/* Camera Video Container / QR Pairing Card */}
          <div style={{ position: 'relative', width: '100%', height: '420px', background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            
            {/* Always mounted video element for receiving WebRTC remote stream or Laptop webcam */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              onLoadedMetadata={handleVideoLoadedMetadata}
              onCanPlay={handleVideoCanPlay}
              onPlaying={checkVideoReady}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: (cameraStatus === 'video_ready' || cameraStatus === 'connected') && !isDemoMode ? 'block' : 'none'
              }}
            />

            {/* Bounding Box Visual Overlay */}
            <canvas
              ref={overlayRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                display: (cameraActive || isDemoMode) ? 'block' : 'none'
              }}
            />

            {/* Phone Camera QR Pairing Screen (Shown when PHONE CAMERA is selected and phone is not yet streaming) */}
            {cameraSource === 'phone' && cameraStatus !== 'video_ready' && !isDemoMode && (
              <div style={{
                textAlign: 'center',
                padding: '1.5rem',
                color: '#f8fafc',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.8rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontWeight: 600, fontSize: '0.95rem' }}>
                  <QrCode size={20} />
                  <span>CONNECT PHONE CAMERA</span>
                </div>

                <div style={{
                  background: '#ffffff',
                  padding: '12px',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  display: 'inline-block'
                }}>
                  <QRCodeSVG value={phoneCameraUrl} size={160} level="M" includeMargin={false} />
                </div>

                <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                  Scan QR with your phone or visit:
                  <div style={{ color: '#38bdf8', fontWeight: 600, marginTop: '2px', fontFamily: 'monospace' }}>
                    {phoneCameraUrl}
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: phoneConnected ? '#064e3b' : 'rgba(30, 41, 59, 0.8)',
                  color: phoneConnected ? '#6ee7b7' : '#fbbf24',
                  padding: '0.35rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  border: '1px solid #334155'
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: phoneConnected ? '#10b981' : '#f59e0b' }}></span>
                  {phoneConnected ? 'Phone Joined Session! Awaiting WebRTC Video...' : `Session: ${sessionId} — Waiting for phone connection...`}
                </div>
              </div>
            )}

            {/* Laptop Camera Standby State */}
            {cameraSource === 'laptop' && cameraStatus === 'idle' && !isDemoMode && (
              <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                <Camera size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#94a3b8' }}>Laptop Webcam Disconnected</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', maxWidth: '340px' }}>
                  Click <strong>Start Camera</strong> to enable laptop webcam or switch to <strong>PHONE CAMERA</strong> mode.
                </p>
                {cameraError && (
                  <div style={{ marginTop: '1rem', color: '#f87171', fontSize: '0.85rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.6rem 1rem', borderRadius: '6px', border: '1px solid #ef4444' }}>
                    ⚠️ {cameraError}
                  </div>
                )}
              </div>
            )}

            {/* Demo Mode Asset Image */}
            {isDemoMode && (
              <img
                src="/src/assets/real_breadboard_photo.jpg"
                alt="Demo Breadboard Circuit"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={(e) => {
                  e.currentTarget.src = "https://raw.githubusercontent.com/ultralytics/yolov5/master/data/images/bus.jpg";
                }}
              />
            )}

            {/* Development / Video Diagnostic Bar */}
            {cameraStatus === 'video_ready' && !isDemoMode && (
              <div style={{
                position: 'absolute',
                bottom: '8px',
                left: '8px',
                background: 'rgba(15, 23, 42, 0.8)',
                color: '#38bdf8',
                padding: '0.25rem 0.6rem',
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontFamily: 'monospace',
                pointerEvents: 'none',
                border: '1px solid rgba(56, 189, 248, 0.3)'
              }}>
                📷 READY: {videoDimensions.width}×{videoDimensions.height} px | Source: {cameraSource.toUpperCase()} | ReadyState: {videoRef.current?.readyState || 4}
              </div>
            )}

            {/* Hidden canvas for frame capture */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>

          {/* Camera Footer Controls */}
          <div style={{ padding: '0.75rem 1rem', background: '#0f172a', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Detections: <strong style={{ color: '#38bdf8' }}>{detections.length} components</strong>
            </span>

            <button
              onClick={() => processFrameAnalysis(captureFrameBase64())}
              disabled={isAnalyzing}
              style={{
                background: '#0284c7',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '0.4rem 1rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <RefreshCw size={14} className={isAnalyzing ? 'spin' : ''} />
              {isAnalyzing ? 'Analyzing Frame...' : 'Scan / Re-Analyze'}
            </button>
          </div>
        </div>

        {/* RIGHT: Live 3D Digital Twin Canvas */}
        <div style={{
          background: '#0f172a',
          border: '1px solid #3b82f6',
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
        }}>
          <div style={{
            background: '#1e293b',
            padding: '0.75rem 1rem',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #334155'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.95rem' }}>
              <Layers size={18} style={{ color: '#60a5fa' }} />
              <span>🧊 LIVE 3D DIGITAL TWIN</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>
              ● REAL-TIME SYNCHRONIZED
            </span>
          </div>

          <div style={{ height: '420px', position: 'relative' }}>
            <Breadboard3DCanvas />
          </div>

          <div style={{ padding: '0.75rem 1rem', background: '#0f172a', borderTop: '1px solid #1e293b' }}>
            <SimulationControls />
          </div>
        </div>
      </div>

      {/* Middle Grid: Power Source Setup & Electrical Component Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {/* Power Source Panel */}
        <PowerSourcePanel />

        {/* Component Measurement Inspector */}
        <ComponentMeasurementCard
          onOpenValueModal={(c) => setValueModalComp(c)}
          onOpenCorrectionModal={(c) => setCorrectionModalComp(c)}
        />
      </div>

      {/* Bottom Component Table & Real-Time Events */}
      <div style={{
        background: '#0f172a',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '1.25rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#f8fafc' }}>
            📋 AI RECONSTRUCTED COMPONENTS & TOPOLOGY
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Click any row to focus component in 3D simulator
          </span>
        </div>

        {comps.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
            No components detected yet. Scan QR code with phone camera or enable Demo Mode to scan circuit.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#1e293b', color: '#94a3b8', borderBottom: '1px solid #334155' }}>
                  <th style={{ padding: '0.6rem 0.8rem' }}>ID</th>
                  <th style={{ padding: '0.6rem 0.8rem' }}>Type</th>
                  <th style={{ padding: '0.6rem 0.8rem' }}>Value</th>
                  <th style={{ padding: '0.6rem 0.8rem' }}>Terminals</th>
                  <th style={{ padding: '0.6rem 0.8rem' }}>Voltage Drop</th>
                  <th style={{ padding: '0.6rem 0.8rem' }}>Current</th>
                  <th style={{ padding: '0.6rem 0.8rem' }}>Power</th>
                  <th style={{ padding: '0.6rem 0.8rem' }}>Confidence</th>
                  <th style={{ padding: '0.6rem 0.8rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {comps.map((c) => {
                  const cid = c.id || c.designator;
                  const m = measurements[cid] || measurements[c.id] || {};
                  const needsConf = c.needsConfirmation || false;
                  const valDisp = c.displayValue || c.user_override_value || c.formatted_value || c.detected_value || '1 kΩ';

                  return (
                    <tr
                      key={cid}
                      onClick={() => setSelectedComponent(c)}
                      style={{
                        borderBottom: '1px solid #1e293b',
                        cursor: 'pointer',
                        background: 'transparent',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <td style={{ padding: '0.6rem 0.8rem', fontWeight: 600, color: '#38bdf8' }}>{cid}</td>
                      <td style={{ padding: '0.6rem 0.8rem', color: '#f8fafc', textTransform: 'capitalize' }}>{c.type}</td>
                      <td style={{ padding: '0.6rem 0.8rem', fontWeight: 600, color: needsConf ? '#f59e0b' : '#f8fafc' }}>
                        {valDisp}
                      </td>
                      <td style={{ padding: '0.6rem 0.8rem', color: '#cbd5e1' }}>
                        {c.hole1 || c.start_hole || 'A1'} ↔ {c.hole2 || c.end_hole || 'A2'}
                      </td>
                      <td style={{ padding: '0.6rem 0.8rem', color: '#10b981' }}>
                        {m.voltageDrop !== undefined ? `${m.voltageDrop.toFixed(2)} V` : '0.00 V'}
                      </td>
                      <td style={{ padding: '0.6rem 0.8rem', color: '#fbbf24' }}>
                        {m.current !== undefined ? `${(m.current * 1000).toFixed(2)} mA` : '0.00 mA'}
                      </td>
                      <td style={{ padding: '0.6rem 0.8rem', color: '#f43f5e' }}>
                        {m.power !== undefined ? `${(m.power * 1000).toFixed(2)} mW` : '0.00 mW'}
                      </td>
                      <td style={{ padding: '0.6rem 0.8rem' }}>
                        {needsConf ? (
                          <span style={{ color: '#f59e0b', fontWeight: 600 }}>⚠️ Confirm</span>
                        ) : (
                          <span style={{ color: '#34d399', fontWeight: 600 }}>● {Math.round((c.val_confidence || c.confidence || 0.9) * 100)}%</span>
                        )}
                      </td>
                      <td style={{ padding: '0.6rem 0.8rem' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setValueModalComp(c);
                          }}
                          style={{
                            background: '#334155',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '0.2rem 0.5rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          }}
                        >
                          ✏ Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#64748b', textAlign: 'center' }}>
          Electrical values are calculated from reconstructed topology, component values and source conditions. They are not direct physical measurements.
        </div>
      </div>

      {/* Value Input Modal */}
      {valueModalComp && (
        <ValueInputModal
          component={valueModalComp}
          onClose={() => setValueModalComp(null)}
        />
      )}

      {/* User Terminal Correction Modal */}
      {correctionModalComp && (
        <UserCorrectionModal
          component={correctionModalComp}
          onClose={() => setCorrectionModalComp(null)}
        />
      )}
    </div>
  );
}

// Helper to fetch Base64 string for Demo Mode asset
async function fetchDemoAssetBase64() {
  try {
    const response = await fetch('/src/assets/real_breadboard_photo.jpg');
    if (!response.ok) return null;
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    return null;
  }
}

function max(a, b) {
  return a > b ? a : b;
}


