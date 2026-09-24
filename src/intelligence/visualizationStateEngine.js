/**
 * SmartBreadboard 3D — Visualization State Engine (Phase 25)
 *
 * Decoupled visualization coordinator that converts verified circuit intelligence
 * and electrical behaviour into declarative visualization instructions for
 * AR Camera Overlay, 3D Digital Twin Canvas, and Interactive Learning Panels.
 *
 * GUARANTEE: AR renderers consume these pure visual states without embedding
 * circuit math or electrical solvers.
 */

import { VISUALIZATION_TYPES, VERIFICATION_STATES } from './circuitKnowledgeRegistry.js';

export function generateVisualizationState(classification, electricalBehaviour, netlist) {
  if (!classification || classification.verificationState === VERIFICATION_STATES.NOT_VERIFIED || classification.verificationState === VERIFICATION_STATES.UNSUPPORTED) {
    return {
      status: classification?.verificationState || 'NOT_VERIFIED',
      circuitType: classification?.circuitType || 'UNKNOWN',
      visualizationType: VISUALIZATION_TYPES.GENERIC_DC_FLOW,
      isEducationalAnimationActive: false,
      componentHighlights: {},
      currentFlow: { enabled: false, branches: [] },
      signalFlow: { type: 'DC', active: false },
      nodeVoltages: [],
      waveforms: [],
      transientState: null,
      educationalAnnotations: [],
      warningBanner: {
        type: classification?.verificationState === VERIFICATION_STATES.UNSUPPORTED ? 'UNSUPPORTED' : 'UNVERIFIED',
        title: classification?.displayName || 'Unverified Circuit',
        message: classification?.warnings?.[0] || 'Circuit topology has not been verified. Educational animations disabled.',
        missingRequirements: classification?.missingRequirements || []
      }
    };
  }

  const { circuitType, matchedComponents, parameters } = classification;
  const compHighlights = {};
  const nodeVoltages = [];
  const annotations = [];

  // =========================================================================
  // 1. VOLTAGE DIVIDER VISUALIZATION
  // =========================================================================
  if (circuitType === 'VOLTAGE_DIVIDER') {
    const rTop = matchedComponents?.r_top;
    const rBot = matchedComponents?.r_bot;
    const p = electricalBehaviour?.parameters;

    if (rTop) {
      const cid = rTop.id || rTop.designator;
      compHighlights[cid] = {
        role: 'PULL_UP',
        roleLabel: 'R1 (Upper Branch)',
        color: '#38bdf8', // Cyan
        haloIntensity: 0.8,
        pulseSpeed: 1.0,
        voltageDrop: p?.powerR1 ? `${(p.powerR1.value / 1000).toFixed(2)} mW` : null,
        tooltip: `R1: Drops ${((p?.sourceVoltage?.value || 5) - (p?.vOutTheoretical?.value || 2.5)).toFixed(2)}V across upper branch`
      };
    }

    if (rBot) {
      const cid = rBot.id || rBot.designator;
      compHighlights[cid] = {
        role: 'PULL_DOWN',
        roleLabel: 'R2 (Lower Branch)',
        color: '#818cf8', // Indigo
        haloIntensity: 0.8,
        pulseSpeed: 1.0,
        voltageDrop: p?.vOutTheoretical ? `${p.vOutTheoretical.formatted}` : null,
        tooltip: `R2: Establishes output voltage potential of ${p?.vOutTheoretical?.formatted || 'N/A'}`
      };
    }

    if (parameters?.node_vout) {
      nodeVoltages.push({
        nodeId: parameters.node_vout,
        label: 'Vout (Divided)',
        voltage: p?.vOutTheoretical?.value || 0,
        formatted: p?.vOutTheoretical?.formatted || '0.00 V',
        color: '#10b981', // Emerald
        badge: 'OUTPUT'
      });
    }

    annotations.push({
      id: 'anno-vdiv-1',
      target: parameters?.node_vout || 'Vout',
      title: 'Intermediate Output Node',
      text: `Vout = ${p?.vOutTheoretical?.formatted || '2.50V'} (${p?.dividerRatio?.formatted || '50%'} of Vin)`
    });

    return {
      status: 'VERIFIED',
      circuitType,
      visualizationType: VISUALIZATION_TYPES.VOLTAGE_DISTRIBUTION,
      isEducationalAnimationActive: true,
      componentHighlights: compHighlights,
      currentFlow: {
        enabled: true,
        branches: [
          {
            id: 'branch-vdiv',
            currentMa: p?.branchCurrent?.value || 5.0,
            formatted: p?.branchCurrent?.formatted || '5.00 mA',
            direction: 'FORWARD',
            speed: 1.2,
            color: '#38bdf8'
          }
        ]
      },
      signalFlow: { type: 'DC', active: true },
      nodeVoltages,
      waveforms: electricalBehaviour?.waveforms || [],
      transientState: null,
      educationalAnnotations: annotations,
      warningBanner: null
    };
  }

  // =========================================================================
  // 2. LED CURRENT LIMITER VISUALIZATION
  // =========================================================================
  if (circuitType === 'LED_CURRENT_LIMITER') {
    const rLimit = matchedComponents?.r_limit;
    const led = matchedComponents?.led;
    const p = electricalBehaviour?.parameters;

    if (rLimit) {
      const cid = rLimit.id || rLimit.designator;
      compHighlights[cid] = {
        role: 'CURRENT_BALLAST',
        roleLabel: 'Ballast Resistor',
        color: '#f59e0b', // Amber
        haloIntensity: 0.85,
        pulseSpeed: 1.0,
        tooltip: `R_limit: Restricts loop current to safe ${p?.forwardCurrent?.formatted || '15 mA'}`
      };
    }

    if (led) {
      const cid = led.id || led.designator;
      compHighlights[cid] = {
        role: 'ACTIVE_EMITTER',
        roleLabel: 'Light Emitting Diode',
        color: '#ef4444', // Red
        haloIntensity: 1.2,
        pulseSpeed: 1.5,
        tooltip: `LED: Emitting light at forward drop Vf = ${p?.vForward?.formatted || '2.00 V'}`
      };
    }

    if (parameters?.node_intermediate) {
      nodeVoltages.push({
        nodeId: parameters.node_intermediate,
        label: 'LED Anode',
        voltage: p?.vForward?.value || 2.0,
        formatted: p?.vForward?.formatted || '2.00 V',
        color: '#ef4444',
        badge: 'ANODE'
      });
    }

    return {
      status: 'VERIFIED',
      circuitType,
      visualizationType: VISUALIZATION_TYPES.CURRENT_LIMITING,
      isEducationalAnimationActive: true,
      componentHighlights: compHighlights,
      currentFlow: {
        enabled: true,
        branches: [
          {
            id: 'branch-led',
            currentMa: p?.forwardCurrent?.value || 13.6,
            formatted: p?.forwardCurrent?.formatted || '13.60 mA',
            direction: 'FORWARD',
            speed: 1.5,
            color: '#ef4444'
          }
        ]
      },
      signalFlow: { type: 'DC', active: true },
      nodeVoltages,
      waveforms: [],
      transientState: null,
      educationalAnnotations: [
        {
          id: 'anno-led-1',
          target: led?.id || 'LED1',
          title: 'Current-Limited LED',
          text: `Operating Current: ${p?.forwardCurrent?.formatted || '13.6 mA'} (${p?.safetyStatus?.formatted || 'SAFE'})`
        }
      ],
      warningBanner: null
    };
  }

  // =========================================================================
  // 3. RC CHARGING VISUALIZATION
  // =========================================================================
  if (circuitType === 'RC_CHARGING') {
    const r = matchedComponents?.r;
    const c = matchedComponents?.c;
    const p = electricalBehaviour?.parameters;

    if (r) {
      const cid = r.id || r.designator;
      compHighlights[cid] = {
        role: 'SERIES_TIMING_RESISTOR',
        roleLabel: 'Timing Resistor (R)',
        color: '#06b6d4', // Cyan
        haloIntensity: 0.8,
        pulseSpeed: 1.0,
        tooltip: `R: Sets charging rate τ = RC = ${p?.tau?.formatted || '1.0 ms'}`
      };
    }

    if (c) {
      const cid = c.id || c.designator;
      compHighlights[cid] = {
        role: 'TIMING_CAPACITOR',
        roleLabel: 'Storage Capacitor (C)',
        color: '#3b82f6', // Blue
        haloIntensity: 1.1,
        pulseSpeed: 1.8,
        tooltip: `C: Accumulating electrostatic charge Q = C × Vin`
      };
    }

    if (parameters?.node_out) {
      nodeVoltages.push({
        nodeId: parameters.node_out,
        label: 'Capacitor Potential v_C(t)',
        voltage: p?.voltage1Tau?.value || 3.16,
        formatted: `${p?.voltage1Tau?.formatted || '63.2% at 1τ'}`,
        color: '#3b82f6',
        badge: 'INTEGRATOR'
      });
    }

    return {
      status: 'VERIFIED',
      circuitType,
      visualizationType: VISUALIZATION_TYPES.RC_CHARGING_WAVEFORM,
      isEducationalAnimationActive: true,
      componentHighlights: compHighlights,
      currentFlow: {
        enabled: true,
        branches: [
          {
            id: 'branch-rc-charging',
            currentMa: 2.5,
            formatted: 'Transient Current i(t)',
            direction: 'FORWARD',
            speed: 1.4,
            color: '#3b82f6'
          }
        ]
      },
      signalFlow: { type: 'STEP_TRANSIENT', active: true },
      nodeVoltages,
      waveforms: electricalBehaviour?.waveforms || [],
      transientState: {
        mode: 'CHARGING',
        tauMs: p?.tau?.value || 1.0,
        tauFormatted: p?.tau?.formatted || '1.0 ms',
        cutoffFrequency: p?.cutoffFrequency?.formatted || '159 Hz'
      },
      educationalAnnotations: [
        {
          id: 'anno-rc-1',
          target: c?.id || 'C1',
          title: 'Exponential Charging Curve',
          text: `Reaches 63.2% at t = 1τ (${p?.tau?.formatted || '1ms'}) and 99.3% at 5τ`
        }
      ],
      warningBanner: null
    };
  }

  // =========================================================================
  // 4. RC DISCHARGING VISUALIZATION
  // =========================================================================
  if (circuitType === 'RC_DISCHARGING') {
    const r = matchedComponents?.r;
    const c = matchedComponents?.c;
    const p = electricalBehaviour?.parameters;

    if (r) {
      const cid = r.id || r.designator;
      compHighlights[cid] = {
        role: 'BLEED_RESISTOR',
        roleLabel: 'Discharge Resistor (R)',
        color: '#a855f7', // Purple
        haloIntensity: 0.8,
        pulseSpeed: 1.0,
        tooltip: `R: Dissipates stored energy as thermal heat`
      };
    }

    if (c) {
      const cid = c.id || c.designator;
      compHighlights[cid] = {
        role: 'ENERGY_SOURCE',
        roleLabel: 'Discharging Capacitor (C)',
        color: '#ec4899', // Pink
        haloIntensity: 1.1,
        pulseSpeed: 1.4,
        tooltip: `C: Discharging exponentially v(t) = V0 × e^(-t/RC)`
      };
    }

    return {
      status: 'VERIFIED',
      circuitType,
      visualizationType: VISUALIZATION_TYPES.RC_DISCHARGING_WAVEFORM,
      isEducationalAnimationActive: true,
      componentHighlights: compHighlights,
      currentFlow: {
        enabled: true,
        branches: [
          {
            id: 'branch-rc-discharge',
            currentMa: 1.5,
            formatted: 'Bleed Current i_decay(t)',
            direction: 'FORWARD',
            speed: 1.0,
            color: '#ec4899'
          }
        ]
      },
      signalFlow: { type: 'DECAY_TRANSIENT', active: true },
      nodeVoltages,
      waveforms: electricalBehaviour?.waveforms || [],
      transientState: {
        mode: 'DISCHARGING',
        tauMs: p?.tau?.value || 1.0,
        halfLife: p?.halfLife?.formatted || '0.693 ms'
      },
      educationalAnnotations: [
        {
          id: 'anno-rc-dis-1',
          target: c?.id || 'C1',
          title: 'Exponential Energy Decay',
          text: `Half-life t½ = ${p?.halfLife?.formatted || '0.693 ms'}`
        }
      ],
      warningBanner: null
    };
  }

  // =========================================================================
  // 5. PARALLEL & SERIES-PARALLEL VISUALIZATION
  // =========================================================================
  if (circuitType === 'PARALLEL_RESISTOR_NETWORK' || circuitType === 'SERIES_PARALLEL_RESISTOR_NETWORK') {
    const p = electricalBehaviour?.parameters;
    const comps = matchedComponents || {};

    for (const [k, comp] of Object.entries(comps)) {
      if (comp) {
        const cid = comp.id || comp.designator;
        compHighlights[cid] = {
          role: k.toUpperCase(),
          roleLabel: `${comp.designator || cid}`,
          color: '#14b8a6', // Teal
          haloIntensity: 0.8,
          pulseSpeed: 1.0,
          tooltip: `Branch: ${comp.detected_value || comp.value || 'Resistor'}`
        };
      }
    }

    return {
      status: 'VERIFIED',
      circuitType,
      visualizationType: circuitType === 'PARALLEL_RESISTOR_NETWORK' ? VISUALIZATION_TYPES.PARALLEL_BRANCH_FLOW : VISUALIZATION_TYPES.SERIES_PARALLEL_FLOW,
      isEducationalAnimationActive: true,
      componentHighlights: compHighlights,
      currentFlow: {
        enabled: true,
        branches: [
          {
            id: 'branch-par-main',
            currentMa: p?.iTotal?.value || 10.0,
            formatted: p?.iTotal?.formatted || '10.00 mA',
            direction: 'FORWARD',
            speed: 1.2,
            color: '#14b8a6'
          }
        ]
      },
      signalFlow: { type: 'DC', active: true },
      nodeVoltages,
      waveforms: [],
      transientState: null,
      educationalAnnotations: [
        {
          id: 'anno-par-1',
          target: 'PARALLEL_BANK',
          title: 'Current Division',
          text: `Total Req = ${p?.rEq?.formatted || p?.rTotal?.formatted || 'N/A'}`
        }
      ],
      warningBanner: null
    };
  }

  // Fallback generic state
  return {
    status: 'VERIFIED',
    circuitType,
    visualizationType: VISUALIZATION_TYPES.GENERIC_DC_FLOW,
    isEducationalAnimationActive: true,
    componentHighlights: compHighlights,
    currentFlow: { enabled: true, branches: [] },
    signalFlow: { type: 'DC', active: true },
    nodeVoltages,
    waveforms: [],
    transientState: null,
    educationalAnnotations: [],
    warningBanner: null
  };
}

export default generateVisualizationState;
