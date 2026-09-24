import React, { useRef, useEffect } from 'react';

/**
 * SmartBreadboard 3D — Multi-Domain Waveform & Spectrum Canvas (Phase 25 & 26)
 *
 * Renders:
 * 1. Time-Domain Transient Curves (RC charging / discharging step responses)
 * 2. Frequency-Domain Resonance Spectra (Bode magnitude dB / linear, f0, flow, fhigh markers)
 */
export default function WaveformCanvas({ waveform, width = 480, height = 200, title = 'Signal Spectrum' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !waveform || !waveform.points || waveform.points.length === 0) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const padding = { top: 25, right: 25, bottom: 35, left: 48 };
    const graphW = width - padding.left - padding.right;
    const graphH = height - padding.top - padding.bottom;

    // Background
    ctx.fillStyle = '#0f172a'; // Slate 900
    ctx.fillRect(0, 0, width, height);

    // Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;

    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (graphH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    for (let j = 0; j <= 5; j++) {
      const x = padding.left + (graphW / 5) * j;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.stroke();
    }

    const points = waveform.points;
    const isFrequencyDomain = waveform.type === 'frequency_response';

    if (isFrequencyDomain) {
      // Frequency Domain Bode Spectrum
      const minF = points[0].frequencyHz || 1;
      const maxF = points[points.length - 1].frequencyHz || 1000;
      const logMin = Math.log10(minF);
      const logMax = Math.log10(maxF);

      const magValues = points.map(p => p.magnitudeDb !== undefined ? p.magnitudeDb : p.currentMagnitudeMa || 0);
      const minMag = Math.min(...magValues, -40);
      const maxMag = Math.max(...magValues, 0);

      const getX = (f) => padding.left + ((Math.log10(Math.max(f, minF)) - logMin) / (logMax - logMin || 1)) * graphW;
      const getY = (db) => padding.top + graphH - ((db - minMag) / (maxMag - minMag || 1)) * graphH;

      // Draw f0, fLow, fHigh markers if available
      if (waveform.f0Hz) {
        const markers = [
          { f: waveform.f0Hz, label: `f₀ = ${waveform.f0Hz < 1000 ? waveform.f0Hz + 'Hz' : (waveform.f0Hz/1000).toFixed(2)+'kHz'}`, color: '#f59e0b' },
          { f: waveform.fLowHz, label: 'f_low (-3dB)', color: 'rgba(56, 189, 248, 0.6)' },
          { f: waveform.fHighHz, label: 'f_high (-3dB)', color: 'rgba(56, 189, 248, 0.6)' }
        ];

        markers.forEach(m => {
          if (m.f && m.f >= minF && m.f <= maxF) {
            const x = getX(m.f);
            ctx.strokeStyle = m.color;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(x, padding.top);
            ctx.lineTo(x, height - padding.bottom);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = m.color;
            ctx.font = '9px Inter, sans-serif';
            ctx.fillText(m.label, x + 3, padding.top + 10);
          }
        });
      }

      // Draw Frequency Gradient Area
      const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
      gradient.addColorStop(0, 'rgba(245, 158, 11, 0.35)');
      gradient.addColorStop(1, 'rgba(245, 158, 11, 0.0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(getX(points[0].frequencyHz), getY(minMag));
      points.forEach(p => {
        const db = p.magnitudeDb !== undefined ? p.magnitudeDb : p.currentMagnitudeMa;
        ctx.lineTo(getX(p.frequencyHz), getY(db));
      });
      ctx.lineTo(getX(points[points.length - 1].frequencyHz), getY(minMag));
      ctx.closePath();
      ctx.fill();

      // Draw Main Frequency Curve Line
      ctx.strokeStyle = '#f59e0b'; // Amber 500
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      points.forEach((p, idx) => {
        const db = p.magnitudeDb !== undefined ? p.magnitudeDb : p.currentMagnitudeMa;
        const x = getX(p.frequencyHz);
        const y = getY(db);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Y-Axis Labels
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${maxMag.toFixed(0)} dB`, padding.left - 6, padding.top + 10);
      ctx.fillText(`${minMag.toFixed(0)} dB`, padding.left - 6, height - padding.bottom);

      // X-Axis Labels (Log frequencies)
      ctx.textAlign = 'center';
      ctx.fillText(`${minF.toFixed(0)}Hz`, padding.left, height - padding.bottom + 16);
      ctx.fillText(`${(maxF >= 1000 ? (maxF/1000).toFixed(0)+'kHz' : maxF.toFixed(0)+'Hz')}`, width - padding.right, height - padding.bottom + 16);
      ctx.fillText('Frequency (Log Scale)', width / 2, height - 6);

    } else {
      // Time Domain Transient Curve
      const maxTime = points[points.length - 1].timeMs || 5;
      const maxV = Math.max(...points.map(p => p.voltageV || 0), 5);

      const getX = (t) => padding.left + (t / maxTime) * graphW;
      const getY = (v) => padding.top + graphH - (v / (maxV * 1.1 || 1)) * graphH;

      if (waveform.tauMs) {
        const tau = waveform.tauMs;
        const tauList = [
          { t: tau, label: '1τ (63.2%)', color: 'rgba(56, 189, 248, 0.6)' },
          { t: 3 * tau, label: '3τ (95.0%)', color: 'rgba(129, 140, 248, 0.4)' },
          { t: 5 * tau, label: '5τ (99.3%)', color: 'rgba(16, 185, 129, 0.4)' }
        ];

        tauList.forEach(item => {
          if (item.t <= maxTime) {
            const x = getX(item.t);
            ctx.strokeStyle = item.color;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(x, padding.top);
            ctx.lineTo(x, height - padding.bottom);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = item.color;
            ctx.font = '10px Inter, sans-serif';
            ctx.fillText(item.label, x + 4, padding.top + 12);
          }
        });
      }

      const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
      gradient.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
      gradient.addColorStop(1, 'rgba(56, 189, 248, 0.0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(getX(points[0].timeMs || 0), getY(0));
      points.forEach(p => {
        ctx.lineTo(getX(p.timeMs || 0), getY(p.voltageV || 0));
      });
      ctx.lineTo(getX(points[points.length - 1].timeMs || maxTime), getY(0));
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#38bdf8'; // Cyan 400
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      points.forEach((p, idx) => {
        const x = getX(p.timeMs || 0);
        const y = getY(p.voltageV || 0);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${(maxV).toFixed(1)}V`, padding.left - 6, padding.top + 10);
      ctx.fillText('0.0V', padding.left - 6, height - padding.bottom);

      ctx.textAlign = 'center';
      ctx.fillText('0', padding.left, height - padding.bottom + 16);
      ctx.fillText(`${maxTime.toFixed(1)} ms`, width - padding.right, height - padding.bottom + 16);
      ctx.fillText(waveform.xAxis || 'Time (ms)', width / 2, height - 6);
    }

  }, [waveform, width, height]);

  return (
    <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full animate-pulse ${waveform.type === 'frequency_response' ? 'bg-amber-400' : 'bg-cyan-400'}`}></span>
          {waveform.name || title}
        </span>
        {waveform.tauMs && (
          <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            τ = {waveform.tauMs} ms
          </span>
        )}
        {waveform.f0Hz && (
          <span className="text-[11px] font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
            f₀ = {waveform.f0Hz < 1000 ? `${waveform.f0Hz} Hz` : `${(waveform.f0Hz/1000).toFixed(3)} kHz`}
          </span>
        )}
      </div>

      <div className="relative flex justify-center">
        <canvas
          ref={canvasRef}
          style={{ width: `${width}px`, height: `${height}px` }}
          className="rounded-lg"
        />
      </div>
    </div>
  );
}
