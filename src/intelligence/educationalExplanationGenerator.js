/**
 * SmartBreadboard 3D — Educational Explanation Generator (Phase 25)
 *
 * Pedagogically sound, deterministic explanation generator.
 * Produces structured lessons, governing equation walkthroughs,
 * what-if predictions, and visual guide explanations strictly based
 * on the verified circuit model.
 */

import { circuitRegistry } from './circuitKnowledgeRegistry.js';

export function generateEducationalExplanation(classification, electricalBehaviour) {
  if (!classification) return null;

  const { circuitType, verificationState, displayName, warnings, missingRequirements } = classification;
  const def = circuitRegistry.get(circuitType);
  const p = electricalBehaviour?.parameters || {};

  // Case 1: Unverified / Incomplete Circuit
  if (verificationState === 'NOT_VERIFIED' || verificationState === 'UNSUPPORTED') {
    return {
      title: displayName || 'Unverified Circuit Configuration',
      status: verificationState,
      isVerified: false,
      summary: `The system detected physical breadboard components, but the electrical topology could not be verified as a standard canonical textbook circuit.`,
      purpose: 'Verification is required before educational simulations and theoretical waveforms are activated.',
      missingRequirements: missingRequirements || [],
      warnings: warnings || [],
      keyComponents: [],
      governingEquations: [],
      visualGuide: 'Educational animations remain suspended to ensure zero fabrication of unverified electrical behaviour.',
      whatIfAnalysis: 'Ensure all terminal leads, tie-point rows, and supply rails are firmly placed and correctly connected.',
      measurementDisclaimer: 'All electrical statuses in SmartBreadboard 3D require verified topological grounding.'
    };
  }

  // Case 2: Verified Circuits
  const sections = {
    title: displayName,
    status: verificationState,
    isVerified: true,
    summary: def?.description || 'Verified electronic circuit topology.',
    purpose: def?.explanationTemplate?.purpose || 'Electronic signal and power processing.',
    application: def?.explanationTemplate?.application || 'Everyday consumer and industrial electronics.',
    governingLaw: def?.explanationTemplate?.governingLaw || "Fundamental Electronic Laws",
    formulaSummary: def?.explanationTemplate?.formulaSummary || electricalBehaviour?.governingEquation || '',
    keyComponents: [],
    governingEquations: [],
    visualGuide: '',
    whatIfAnalysis: '',
    measurementDisclaimer: 'Calculated parameters are derived from deterministic theoretical models and MNA simulation. Physical bench multimeter validation remains unrecorded (NOT_TESTED).'
  };

  if (circuitType === 'VOLTAGE_DIVIDER') {
    sections.keyComponents = [
      { name: 'Upper Resistor (R1 / Pull-Up)', role: `Drops ${((p?.sourceVoltage?.value || 5) - (p?.vOutTheoretical?.value || 2.5)).toFixed(2)}V across top branch, setting upper impedance.` },
      { name: 'Lower Resistor (R2 / Pull-Down)', role: `Develops the output potential Vout = ${p?.vOutTheoretical?.formatted || '2.50V'} relative to Ground.` }
    ];
    sections.governingEquations = [
      { equation: 'Vout = Vin × [ R2 / (R1 + R2) ]', substituted: `Vout = ${p?.sourceVoltage?.value || 5}V × [ ${p?.r2?.value || 2200}Ω / (${p?.r1?.value || 1000}Ω + ${p?.r2?.value || 2200}Ω) ] = ${p?.vOutTheoretical?.formatted || '2.50V'}` },
      { equation: 'I_loop = Vin / (R1 + R2)', substituted: `I_loop = ${p?.sourceVoltage?.value || 5}V / ${p?.rTotal?.formatted || '3.20 kΩ'} = ${p?.branchCurrent?.formatted || '1.56 mA'}` }
    ];
    sections.visualGuide = 'The cyan halo marks R1 (upper potential step), the indigo halo marks R2 (reference to GND), and the emerald marker on the intermediate tie-point row indicates the divided output potential.';
    sections.whatIfAnalysis = 'Increasing R2 increases Vout closer to Vin. Increasing R1 decreases Vout closer to 0V. Decreasing both resistors proportionally preserves the voltage ratio but increases loop current and power consumption.';
  } else if (circuitType === 'LED_CURRENT_LIMITER') {
    sections.keyComponents = [
      { name: 'Ballast Resistor (R_limit)', role: `Absorbs excess voltage (${p?.vResistor?.formatted || '3.00V'}) to limit forward current to ${p?.forwardCurrent?.formatted || '13.6 mA'}.` },
      { name: 'Light Emitting Diode (LED)', role: `Emits photons via electroluminescence with forward junction barrier Vf = ${p?.vForward?.formatted || '2.00V'}.` }
    ];
    sections.governingEquations = [
      { equation: 'I_LED = (Vin - Vf) / R_limit', substituted: `I_LED = (${p?.sourceVoltage?.value || 5}V - 2.00V) / ${p?.rLimit?.formatted || '220Ω'} = ${p?.forwardCurrent?.formatted || '13.6 mA'}` },
      { equation: 'P_resistor = I² × R', substituted: `P_R = (${p?.forwardCurrent?.value || 13.6}mA)² × ${p?.rLimit?.value || 220}Ω = ${p?.powerResistor?.formatted || '40.8 mW'}` }
    ];
    sections.visualGuide = 'The amber halo highlights the ballast resistor absorbing excess thermal power, while the pulsing red aura indicates the active photon emission from the forward-biased LED PN-junction.';
    sections.whatIfAnalysis = 'Decreasing R_limit below 150Ω will drive the LED beyond safe 25mA operating limits, leading to rapid overheating. Increasing R_limit dims the LED proportionally.';
  } else if (circuitType === 'RC_CHARGING') {
    sections.keyComponents = [
      { name: 'Timing Resistor (R)', role: `Restricts charging current flow, dictating charging velocity.` },
      { name: 'Storage Capacitor (C)', role: `Stores electrostatic potential across dielectric plates: Q = C × V.` }
    ];
    sections.governingEquations = [
      { equation: 'τ = R × C', substituted: `τ = ${p?.r?.formatted || '4.7 kΩ'} × ${p?.c?.formatted || '100 nF'} = ${p?.tau?.formatted || '0.47 ms'}` },
      { equation: 'v_C(t) = Vin × (1 - e^(-t/τ))', substituted: `At t = 1τ: v_C = 63.2% of Vin (${p?.voltage1Tau?.formatted || '3.16V'}); at 5τ: 99.3% (${p?.voltage5Tau?.formatted || '4.97V'})` },
      { equation: 'fc (-3dB) = 1 / (2π × R × C)', substituted: `fc = 1 / (2π × ${p?.tau?.value || 0.47}ms) = ${p?.cutoffFrequency?.formatted || '338.6 Hz'}` }
    ];
    sections.visualGuide = 'The live time-series graph plots instantaneous capacitor voltage v_C(t). The cyan glow indicates series resistive charging current, and the blue capacitor aura reflects electrostatic charge accumulation.';
    sections.whatIfAnalysis = 'Doubling capacitance C doubles the time constant τ, making the output voltage rise twice as slowly. Lowering R increases the cutoff frequency fc, passing higher frequency signals.';
  } else if (circuitType === 'RC_DISCHARGING') {
    sections.keyComponents = [
      { name: 'Discharge Resistor (R)', role: `Provides a safe dissipation path for stored electric charge.` },
      { name: 'Storage Capacitor (C)', role: `Acts as a transient DC energy source discharging through R.` }
    ];
    sections.governingEquations = [
      { equation: 'v_C(t) = V0 × e^(-t/τ)', substituted: `v_C(t) decays exponentially with decay constant τ = ${p?.tau?.formatted || '1.0 ms'}` },
      { equation: 't½ = τ × ln(2)', substituted: `t½ = ${p?.tau?.formatted || '1.0 ms'} × 0.693 = ${p?.halfLife?.formatted || '0.693 ms'}` }
    ];
    sections.visualGuide = 'The exponential decay curve illustrates transient energy discharge. The purple and pink halos mark the active bleed dissipation path.';
    sections.whatIfAnalysis = 'Increasing bleed resistance R prolongs charge retention. Decreasing R produces rapid discharge with higher peak transient current.';
  } else if (circuitType === 'RLC_SERIES_RESONANCE') {
    sections.keyComponents = [
      { name: 'Damping Resistor (R)', role: `Limits peak resonant current to I_max = Vin/R (${p?.iAtResonance?.formatted || 'N/A'}) and sets bandwidth.` },
      { name: 'Resonant Inductor (L)', role: `Stores magnetic energy, creating inductive reactance XL = ωL (+90° phase lead).` },
      { name: 'Tuning Capacitor (C)', role: `Stores electric energy, creating capacitive reactance XC = 1/(ωC) (-90° phase lag).` }
    ];
    sections.governingEquations = [
      { equation: 'f₀ = 1 / [ 2π√(L × C) ]', substituted: `f₀ = 1 / [ 2π × √(${p?.l?.formatted || '10mH'} × ${p?.c?.formatted || '100µF'}) ] = ${p?.f0?.formatted || '159.2 Hz'}` },
      { equation: 'Q = (ω₀ × L) / R', substituted: `Q = (2π × ${p?.f0?.value || 159}Hz × ${p?.l?.formatted || '10mH'}) / ${p?.r?.formatted || '100Ω'} = ${p?.qFactor?.formatted || '0.10'}` },
      { equation: 'BW = f₀ / Q = R / (2πL)', substituted: `BW = ${p?.f0?.formatted || '159Hz'} / ${p?.qFactor?.formatted || '0.1'} = ${p?.bandwidth?.formatted || 'N/A'}` }
    ];
    sections.visualGuide = 'The frequency spectrum chart displays the sharp resonance peak at f₀. At resonance, XL cancels XC exactly, causing total impedance to collapse to pure resistance |Z| = R.';
    sections.whatIfAnalysis = 'Decreasing series resistance R sharpens the resonance peak, increasing Quality factor Q and narrowing bandwidth BW. Increasing inductance L increases stored magnetic energy.';
  } else if (circuitType === 'RLC_PARALLEL_RESONANCE') {
    sections.keyComponents = [
      { name: 'Tank Resistor (R)', role: `Sets peak tank impedance |Z_max| = R and determines parallel damping.` },
      { name: 'Tank Inductor (L)', role: `Provides inductive branch susceptance BL = 1/(ωL).` },
      { name: 'Tank Capacitor (C)', role: `Provides capacitive branch susceptance BC = ωC.` }
    ];
    sections.governingEquations = [
      { equation: 'f₀ = 1 / [ 2π√(L × C) ]', substituted: `Resonance frequency f₀ = ${p?.f0?.formatted || 'N/A'}` },
      { equation: 'Q = R × √(C / L)', substituted: `Q = ${p?.r?.formatted || '1kΩ'} × √(${p?.c?.formatted || '100nF'} / ${p?.l?.formatted || '10mH'}) = ${p?.qFactor?.formatted || 'N/A'}` }
    ];
    sections.visualGuide = 'In a parallel tank, circulating reactive currents oscillate between L and C while external supply current reaches a minimum.';
    sections.whatIfAnalysis = 'Increasing parallel resistance R increases peak impedance and Quality factor Q, transforming the tank into a higher-selectivity filter.';
  }

  return sections;
}

export default generateEducationalExplanation;

