import React, { useRef, useEffect, useState } from 'react';

/**
 * SmartBreadboard 3D — Multi-Domain Waveform & Spectrum Canvas (Phase 25, 26, & 27)
 *
 * Renders:
 * 1. Time-Domain Transient Curves (RC charging / discharging step responses)
 * 2. Generalized Frequency-Domain Spectra with switchable display modes:
 *    - Magnitude (dB)
 *    - Magnitude (Linear)
 *    - Phase (°)
 *    - Impedance (|Z| Ω)
 *    - Current (mA)
 * 3. Cutoff (-3dB), Resonance (f0), Peak, and Notch markers.
 */
export default function WaveformCanvas({ waveform, width = 480, height = 220, title = 'Signal Spectrum' }) {
  const canvasRef = useRef(null);
  const [activeMode, setActiveMode] = useState('magDb'); // 'magDb' | 'magLin' | 'phase' | 'impedance' | 'current'

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !waveform || !waveform.points || waveform.points.length === 0) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const padding = { top: 25, right: 25, bottom: 35, left: 54 };
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
      // Frequency Domain Spectrum
      const minF = points[0].frequencyHz || 1;
      const maxF = points[points.length - 1].frequencyHz || 1000;
      const logMin = Math.log10(minF);
      const logMax = Math.log10(maxF);

      // Extract values according to active display mode
      let yValues = [];
      let yUnit = 'dB';
      let lineColor = '#f59e0b'; // Amber
      let gradientTop = 'rgba(245, 158, 11, 0.35)';

      if (activeMode === 'magDb') {
        yValues = points.map(p => p.magnitudeDb !== undefined ? p.magnitudeDb : (p.gainDb !== undefined ? p.gainDb : 0));
        yUnit = 'dB';
        lineColor = '#f59e0b';
        gradientTop = 'rgba(245, 158, 11, 0.35)';
      } else if (activeMode === 'magLin') {
        yValues = points.map(p => p.gainMagnitude !== undefined ? p.gainMagnitude : (p.magnitudeV !== undefined ? p.magnitudeV : 1));
        yUnit = '';
        lineColor = '#10b981'; // Emerald
        gradientTop = 'rgba(16, 185, 129, 0.35)';
      } else if (activeMode === 'phase') {
        yValues = points.map(p => p.phaseDeg !== undefined ? p.phaseDeg : 0);
        yUnit = '°';
        lineColor = '#818cf8'; // Indigo
        gradientTop = 'rgba(129, 140, 248, 0.35)';
      } else if (activeMode === 'impedance') {
        yValues = points.map(p => p.impedanceMagnitudeOhms !== undefined ? p.impedanceMagnitudeOhms : 0);
        yUnit = 'Ω';
        lineColor = '#a855f7'; // Purple
        gradientTop = 'rgba(168, 85, 247, 0.35)';
      } else if (activeMode === 'current') {
        yValues = points.map(p => p.currentMagnitudeMa !== undefined ? p.currentMagnitudeMa : (p.currentMagnitudeMa || 0));
        yUnit = 'mA';
        lineColor = '#38bdf8'; // Cyan
        gradientTop = 'rgba(56, 189, 248, 0.35)';
      }

      let minY = Math.min(...yValues);
      let maxY = Math.max(...yValues);

      if (activeMode === 'magDb') {
        minY = Math.min(minY, -40);
        maxY = Math.max(maxY, 0);
      } else if (activeMode === 'magLin') {
        minY = 0;
        maxY = Math.max(maxY, 1.0);
      } else if (activeMode === 'phase') {
        minY = Math.min(minY, -90);
        maxY = Math.max(maxY, 90);
      } else {
        if (maxY === minY) maxY = minY + 1;
      }

      const getX = (f) => padding.left + ((Math.log10(Math.max(f, minF)) - logMin) / (logMax - logMin || 1)) * graphW;
      const getY = (val) => padding.top + graphH - ((val - minY) / (maxY - minY || 1)) * graphH;

      // Draw Cutoff & Resonance Markers
      const markers = [];
      if (waveform.fcHz) {
        markers.push({ f: waveform.fcHz, label: `fc = ${waveform.fcHz < 1000 ? waveform.fcHz + 'Hz' : (waveform.fcHz/1000).toFixed(2)+'kHz'}`, color: '#38bdf8' });
      }
      if (waveform.f0Hz) {
        markers.push({ f: waveform.f0Hz, label: `f₀ = ${waveform.f0Hz < 1000 ? waveform.f0Hz + 'Hz' : (waveform.f0Hz/1000).toFixed(2)+'kHz'}`, color: '#f59e0b' });
      }
      if (waveform.fLowHz) {
        markers.push({ f: waveform.fLowHz, label: 'f_low (-3dB)', color: 'rgba(56, 189, 248, 0.6)' });
      }
      if (waveform.fHighHz) {
        markers.push({ f: waveform.fHighHz, label: 'f_high (-3dB)', color: 'rgba(56, 189, 248, 0.6)' });
      }

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

      // Draw Gradient Fill Area
      const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
      gradient.addColorStop(0, gradientTop);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(getX(points[0].frequencyHz), getY(minY));
      points.forEach((p, idx) => {
        ctx.lineTo(getX(p.frequencyHz), getY(yValues[idx]));
      });
      ctx.lineTo(getX(points[points.length - 1].frequencyHz), getY(minY));
      ctx.closePath();
      ctx.fill();

      // Draw Main Spectrum Line
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      points.forEach((p, idx) => {
        const x = getX(p.frequencyHz);
        const y = getY(yValues[idx]);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Y-Axis Labels
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${maxY.toFixed(activeMode === 'magLin' ? 2 : 0)} ${yUnit}`, padding.left - 6, padding.top + 10);
      ctx.fillText(`${minY.toFixed(activeMode === 'magLin' ? 2 : 0)} ${yUnit}`, padding.left - 6, height - padding.bottom);

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

  }, [waveform, width, height, activeMode]);

  const isFrequencyDomain = waveform?.type === 'frequency_response';

  return (
    <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 shadow-xl backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full animate-pulse ${isFrequencyDomain ? 'bg-amber-400' : 'bg-cyan-400'}`}></span>
          {waveform?.name || title}
        </span>

        {isFrequencyDomain && (
          <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 rounded-lg border border-slate-800 text-[10px]">
            <button
              onClick={() => setActiveMode('magDb')}
              className={`px-2 py-0.5 rounded ${activeMode === 'magDb' ? 'bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/40' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Mag (dB)
            </button>
            <button
              onClick={() => setActiveMode('magLin')}
              className={`px-2 py-0.5 rounded ${activeMode === 'magLin' ? 'bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/40' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Mag (Lin)
            </button>
            <button
              onClick={() => setActiveMode('phase')}
              className={`px-2 py-0.5 rounded ${activeMode === 'phase' ? 'bg-indigo-500/20 text-indigo-400 font-semibold border border-indigo-500/40' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Phase (°)
            </button>
            <button
              onClick={() => setActiveMode('impedance')}
              className={`px-2 py-0.5 rounded ${activeMode === 'impedance' ? 'bg-purple-500/20 text-purple-400 font-semibold border border-purple-500/40' : 'text-slate-400 hover:text-slate-200'}`}
            >
              |Z| (Ω)
            </button>
            <button
              onClick={() => setActiveMode('current')}
              className={`px-2 py-0.5 rounded ${activeMode === 'current' ? 'bg-cyan-500/20 text-cyan-400 font-semibold border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'}`}
            >
              I (mA)
            </button>
          </div>
        )}

        {waveform?.tauMs && (
          <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            τ = {waveform.tauMs} ms
          </span>
        )}
        {waveform?.fcHz && (
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
            fc = {waveform.fcHz < 1000 ? `${waveform.fcHz} Hz` : `${(waveform.fcHz/1000).toFixed(3)} kHz`}
          </span>
        )}
        {waveform?.f0Hz && (
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
