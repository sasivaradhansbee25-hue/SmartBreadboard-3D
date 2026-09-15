import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, RefreshCw, Zap, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function PhoneCamera() {
  const [sessionId, setSessionId] = useState('');
  const [status, setStatus] = useState('idle'); // idle, requesting, connecting_ws, connecting_webrtc, streaming, error
  const [errorMessage, setErrorMessage] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const wsRef = useRef(null);
  const pcRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get('session');
    if (s) {
      setSessionId(s);
    } else {
      setSessionId('SB3D-' + Math.random().toString(36).substring(2, 8).toUpperCase());
    }
  }, []);

  const stopPhoneStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    setStatus('idle');
  };

  const startPhoneCamera = async () => {
    stopPhoneStream();
    setErrorMessage(null);
    setStatus('requesting');

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported in this browser. Please use a modern mobile browser (Chrome/Safari).");
      }

      // 1. Request environment/rear camera stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.warn("Video play error on phone:", playErr);
        }
      }

      setStatus('connecting_ws');

      // 2. Connect to FastAPI WebSocket signaling server
      const backendHost = window.location.hostname === 'localhost' ? 'localhost:8000' : `${window.location.hostname}:8000`;
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${wsProtocol}//${backendHost}/ws/camera/${sessionId}?role=phone`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("[Phone] WebSocket connected to laptop session:", sessionId);
        setStatus('connecting_webrtc');
        initWebRTCConnection(stream, ws);
      };

      ws.onmessage = async (event) => {
        try {
          const msg = JSON.parse(event.data);
          const pc = pcRef.current;

          if (msg.type === 'peer_status') {
            if (msg.status === 'connected' && streamRef.current && wsRef.current) {
              console.log("[Phone] Laptop connected to session. Restarting WebRTC offer...");
              initWebRTCConnection(streamRef.current, wsRef.current);
            } else if (msg.status === 'disconnected') {
              console.log("[Phone] Laptop disconnected");
              setStatus('connecting_webrtc');
            }
          } else if (msg.type === 'answer' && pc) {
            console.log("[Phone] Received SDP answer from laptop");
            await pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: msg.sdp }));
          } else if (msg.type === 'ice_candidate' && pc && msg.candidate) {
            await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
          }
        } catch (e) {
          console.warn("[Phone WS] Message error:", e);
        }
      };

      ws.onerror = (e) => {
        console.warn("[Phone WS] Error:", e);
        setErrorMessage("Signaling server connection error. Ensure laptop backend is running.");
        setStatus('error');
      };

      ws.onclose = () => {
        console.log("[Phone WS] Closed");
      };
    } catch (err) {
      console.warn("[Phone] Camera error:", err);
      setErrorMessage(err.message || "Failed to access phone camera. Please grant camera permissions.");
      setStatus('error');
    }
  };

  const initWebRTCConnection = async (stream, ws) => {
    try {
      if (pcRef.current) {
        pcRef.current.close();
      }

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });
      pcRef.current = pc;

      // Add camera tracks to peer connection
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      // Relay local ICE candidates to laptop via WebSocket
      pc.onicecandidate = (event) => {
        if (event.candidate && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: 'ice_candidate',
            candidate: event.candidate
          }));
        }
      };

      pc.onconnectionstatechange = () => {
        console.log("[Phone WebRTC] Connection state:", pc.connectionState);
        if (pc.connectionState === 'connected') {
          setStatus('streaming');
        } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
          setStatus('connecting_webrtc');
        }
      };

      // Create WebRTC SDP offer and send to laptop
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'offer',
          sdp: offer.sdp
        }));
        console.log("[Phone] WebRTC offer sent to laptop");
      }
    } catch (e) {
      console.warn("[Phone WebRTC] Init error:", e);
      setErrorMessage("Failed to establish WebRTC peer connection.");
      setStatus('error');
    }
  };

  useEffect(() => {
    return () => {
      stopPhoneStream();
    };
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#020617',
      color: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Mobile Top Header */}
      <header style={{
        background: '#0f172a',
        padding: '0.85rem 1.25rem',
        borderBottom: '1px solid #1e293b',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1rem', color: '#f8fafc' }}>
          <Zap style={{ color: '#38bdf8' }} size={20} />
          <span>SmartBreadboard <span style={{ color: '#38bdf8' }}>3D</span></span>
        </div>

        <span style={{
          fontSize: '0.75rem',
          padding: '0.25rem 0.6rem',
          borderRadius: '12px',
          background: status === 'streaming' ? '#064e3b' : '#334155',
          color: status === 'streaming' ? '#6ee7b7' : '#94a3b8',
          fontWeight: 600
        }}>
          {status === 'streaming' ? '🟢 STREAMING LIVE' : '📱 PHONE CAMERA'}
        </span>
      </header>

      {/* Main Content Body */}
      <main style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {/* Session Badge */}
        <div style={{
          background: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '10px',
          padding: '0.75rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>PAIRING SESSION</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#38bdf8', fontFamily: 'monospace' }}>{sessionId}</div>
          </div>

          <div style={{ fontSize: '0.8rem', color: status === 'streaming' ? '#34d399' : '#fbbf24', fontWeight: 600 }}>
            {status === 'streaming' ? '● LAPTOP CONNECTED' :
             status === 'connecting_webrtc' ? '🟡 WAITING FOR LAPTOP' :
             status === 'connecting_ws' ? '🟡 CONNECTING WS' : '○ STANDBY'}
          </div>
        </div>

        {/* Live Camera Video Container */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '65vh',
          background: '#090d16',
          borderRadius: '12px',
          overflow: 'hidden',
          border: status === 'streaming' ? '2px solid #10b981' : '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: (status === 'requesting' || status === 'connecting_ws' || status === 'connecting_webrtc' || status === 'streaming') ? 'block' : 'none'
            }}
          />

          {status === 'idle' && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
              <Camera size={56} style={{ marginBottom: '1rem', opacity: 0.6 }} />
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#f8fafc', fontSize: '1.2rem' }}>Wireless Phone Camera</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', maxWidth: '280px', lineHeight: 1.4 }}>
                SmartBreadboard needs access to your rear camera to scan the physical breadboard circuit.
              </p>
            </div>
          )}

          {status === 'requesting' && (
            <div style={{ position: 'absolute', textAlign: 'center', color: '#38bdf8' }}>
              <RefreshCw size={36} className="spin" style={{ marginBottom: '0.5rem' }} />
              <div>Requesting Camera Access...</div>
            </div>
          )}

          {status === 'connecting_webrtc' && (
            <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(15, 23, 42, 0.85)', color: '#fbbf24', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
              🟡 Waiting for laptop peer to accept stream...
            </div>
          )}

          {status === 'streaming' && (
            <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(6, 78, 59, 0.9)', color: '#6ee7b7', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></span>
              LIVE STREAMING TO LAPTOP
            </div>
          )}

          {errorMessage && (
            <div style={{ position: 'absolute', margin: '1rem', color: '#f87171', background: 'rgba(239, 68, 68, 0.15)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #ef4444', fontSize: '0.85rem', textAlign: 'center' }}>
              ⚠️ {errorMessage}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {status === 'idle' || status === 'error' ? (
            <button
              onClick={startPhoneCamera}
              style={{
                flex: 1,
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '0.85rem',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)'
              }}
            >
              <Camera size={20} /> ENABLE REAR CAMERA
            </button>
          ) : (
            <button
              onClick={stopPhoneStream}
              style={{
                flex: 1,
                background: '#dc2626',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '0.85rem',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <CameraOff size={20} /> STOP STREAMING
            </button>
          )}
        </div>

        {/* Info Banner */}
        <div style={{ fontSize: '0.78rem', color: '#64748b', textAlign: 'center', lineHeight: 1.4, padding: '0.5rem' }}>
          <ShieldCheck size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle', color: '#38bdf8' }} />
          Point phone camera steadily at your physical breadboard. The laptop workstation handles all AI detection & 3D simulation.
        </div>
      </main>
    </div>
  );
}
