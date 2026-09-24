/**
 * SmartBreadboard 3D — Electrical Behaviour Model (Phase 25)
 *
 * Deterministic electrical models calculating theoretical circuit parameters,
 * time-domain waveform series, and transient metrics for verified circuits.
 *
 * SCIENTIFIC INTEGRITY RULES:
 * 1. Every parameter explicitly designates source ('theoretical_model' | 'mna_simulation').
 * 2. Theoretical values are NEVER labeled as 'measured'.
 * 3. Handles metric prefixes (kΩ, µF, nF, mA, mW) transparently.
 */

import { parseComponentValue } from '../utils/valueParser.js';

/**
 * Extracts numerical value from component record.
 */
function extractNumericValue(comp, defaultVal = 1000.0) {
  if (!comp) return defaultVal;
  if (typeof comp.value === 'number' && !isNaN(comp.value)) return comp.value;

  const raw = comp.user_override_value || comp.detected_value || comp.value || comp.formatted_value;
  if (!raw) return defaultVal;

  const parsed = parseComponentValue(String(raw));
  if (parsed && typeof parsed.numericValue === 'number' && !isNaN(parsed.numericValue)) {
    return parsed.numericValue;
  }
  const num = parseFloat(String(raw).replace(/[^0-9.]/g, ''));
  return !isNaN(num) && num > 0 ? num : defaultVal;
}

/**
 * Extracts voltage supply value from circuit or simulation.
 */
function extractSupplyVoltage(netlist, simulationResult) {
  if (simulationResult && typeof simulationResult.source_voltage === 'number') {
    return simulationResult.source_voltage;
  }
  const ps = netlist?.power_sources?.[0] || netlist?.power_supply;
  if (ps && typeof ps.voltage === 'number') return ps.voltage;
  if (ps && typeof ps.nominal_voltage_v === 'number') return ps.nominal_voltage_v;
  return 5.0; // Default nominal 5.0V test bench rail
}

/**
 * Calculates theoretical electrical behaviour for a classified circuit.
 */
export function calculateCircuitBehaviour(classification, netlist, simulationResult = null) {
  if (!classification || classification.verificationState === 'NOT_VERIFIED' || classification.verificationState === 'UNSUPPORTED') {
    return {
      status: classification?.verificationState || 'UNAVAILABLE',
      circuitType: classification?.circuitType || 'UNKNOWN',
      parameters: {},
      waveforms: [],
      notes: classification?.warnings || []
    };
  }

  const { circuitType, matchedComponents } = classification;
  const vSupply = extractSupplyVoltage(netlist, simulationResult);

  switch (circuitType) {
    // -----------------------------------------------------------------------
    // 1. VOLTAGE DIVIDER
    // -----------------------------------------------------------------------
    case 'VOLTAGE_DIVIDER': {
      const rTopComp = matchedComponents?.r_top;
      const rBotComp = matchedComponents?.r_bot;
      const r1 = extractNumericValue(rTopComp, 1000.0);
      const r2 = extractNumericValue(rBotComp, 2200.0);

      const rTotal = r1 + r2;
      const dividerRatio = r2 / rTotal;
      const vOutTheoretical = vSupply * dividerRatio;
      const currentA = vSupply / rTotal;
      const currentMa = currentA * 1000.0;
      const pR1Mw = Math.pow(currentA, 2) * r1 * 1000.0;
      const pR2Mw = Math.pow(currentA, 2) * r2 * 1000.0;
      const pTotalMw = vSupply * currentA * 1000.0;

      // Extract MNA simulation comparison if available
      const mnaVout = simulationResult?.node_voltages?.[classification.parameters?.node_vout] ?? null;

      return {
        status: 'SOLVED_THEORETICAL',
        circuitType,
        sourceVoltage: { value: vSupply, unit: 'V', label: 'Supply Voltage (Vin)', source: 'nominal_supply', is_measured: false },
        parameters: {
          r1: { value: r1, unit: 'Ω', formatted: `${r1.toFixed(1)} Ω`, label: 'Upper Resistor (R1)', source: 'component_value', is_measured: false },
          r2: { value: r2, unit: 'Ω', formatted: `${r2.toFixed(1)} Ω`, label: 'Lower Resistor (R2)', source: 'component_value', is_measured: false },
          rTotal: { value: rTotal, unit: 'Ω', formatted: `${rTotal.toFixed(1)} Ω`, label: 'Total Resistance (Req)', source: 'theoretical_model', is_measured: false },
          dividerRatio: { value: dividerRatio, unit: '', formatted: `${(dividerRatio * 100).toFixed(2)} %`, label: 'Divider Ratio (R2 / Rtotal)', source: 'theoretical_model', is_measured: false },
          vOutTheoretical: { value: vOutTheoretical, unit: 'V', formatted: `${vOutTheoretical.toFixed(3)} V`, label: 'Theoretical Output (Vout)', source: 'theoretical_model', is_measured: false },
          vOutMna: mnaVout !== null ? { value: mnaVout, unit: 'V', formatted: `${mnaVout.toFixed(3)} V`, label: 'MNA Simulated (Vout)', source: 'mna_simulation', is_measured: false } : null,
          branchCurrent: { value: currentMa, unit: 'mA', formatted: `${currentMa.toFixed(2)} mA`, label: 'Divider Loop Current', source: 'theoretical_model', is_measured: false },
          powerR1: { value: pR1Mw, unit: 'mW', formatted: `${pR1Mw.toFixed(2)} mW`, label: 'R1 Power Dissipation', source: 'theoretical_model', is_measured: false },
          powerR2: { value: pR2Mw, unit: 'mW', formatted: `${pR2Mw.toFixed(2)} mW`, label: 'R2 Power Dissipation', source: 'theoretical_model', is_measured: false },
          powerTotal: { value: pTotalMw, unit: 'mW', formatted: `${pTotalMw.toFixed(2)} mW`, label: 'Total Circuit Power', source: 'theoretical_model', is_measured: false }
        },
        waveforms: [
          {
            name: 'Voltage Distribution Profile',
            type: 'bar',
            xAxis: 'Node',
            yAxis: 'Potential (V)',
            points: [
              { label: 'Vin (VCC)', value: vSupply },
              { label: 'Vout (Midpoint)', value: vOutTheoretical },
              { label: 'GND (0V)', value: 0.0 }
            ]
          }
        ],
        governingEquation: 'Vout = Vin × [ R2 / (R1 + R2) ]'
      };
    }

    // -----------------------------------------------------------------------
    // 2. LED CURRENT LIMITER
    // -----------------------------------------------------------------------
    case 'LED_CURRENT_LIMITER': {
      const rComp = matchedComponents?.r_limit;
      const ledComp = matchedComponents?.led;
      const rLimit = extractNumericValue(rComp, 220.0);
      const vForwardNominal = 2.0; // Standard 2.0V forward drop for Red/Green/Yellow LEDs

      const vResistor = Math.max(0, vSupply - vForwardNominal);
      const currentA = vSupply > vForwardNominal ? vResistor / rLimit : 0.0;
      const currentMa = currentA * 1000.0;
      const pResistorMw = Math.pow(currentA, 2) * rLimit * 1000.0;
      const pLedMw = vForwardNominal * currentA * 1000.0;
      const isSafe = currentMa <= 25.0; // Standard 20mA nominal, 25mA max safe continuous limit

      return {
        status: 'SOLVED_THEORETICAL',
        circuitType,
        sourceVoltage: { value: vSupply, unit: 'V', label: 'Supply Voltage (Vin)', source: 'nominal_supply', is_measured: false },
        parameters: {
          rLimit: { value: rLimit, unit: 'Ω', formatted: `${rLimit.toFixed(1)} Ω`, label: 'Ballast Resistor (R_limit)', source: 'component_value', is_measured: false },
          vForward: { value: vForwardNominal, unit: 'V', formatted: `${vForwardNominal.toFixed(2)} V`, label: 'LED Forward Voltage (Vf)', source: 'theoretical_model', is_measured: false },
          vResistor: { value: vResistor, unit: 'V', formatted: `${vResistor.toFixed(2)} V`, label: 'Voltage Across Resistor (Vin - Vf)', source: 'theoretical_model', is_measured: false },
          forwardCurrent: { value: currentMa, unit: 'mA', formatted: `${currentMa.toFixed(2)} mA`, label: 'LED Operating Current (If)', source: 'theoretical_model', is_measured: false },
          powerResistor: { value: pResistorMw, unit: 'mW', formatted: `${pResistorMw.toFixed(2)} mW`, label: 'Resistor Power Loss', source: 'theoretical_model', is_measured: false },
          powerLed: { value: pLedMw, unit: 'mW', formatted: `${pLedMw.toFixed(2)} mW`, label: 'LED Optical & Thermal Power', source: 'theoretical_model', is_measured: false },
          safetyStatus: { value: isSafe ? 'SAFE' : 'OVERCURRENT_WARNING', unit: '', formatted: isSafe ? 'SAFE (≤ 25 mA)' : 'DANGER (> 25 mA OVERCURRENT)', label: 'Operating Safety State', source: 'theoretical_model', is_measured: false }
        },
        waveforms: [],
        governingEquation: 'I_LED = (Vin - Vf) / R_limit'
      };
    }

    // -----------------------------------------------------------------------
    // 3. RC CHARGING (LOW-PASS FILTER)
    // -----------------------------------------------------------------------
    case 'RC_CHARGING': {
      const rComp = matchedComponents?.r;
      const cComp = matchedComponents?.c;
      const r = extractNumericValue(rComp, 4700.0);
      let c = extractNumericValue(cComp, 100e-9); // default 100 nF
      // Guard against raw nF or µF values read as integer
      if (c > 1.0) {
        c = c * 1e-6; // assume microfarads if > 1
      }

      const tauSeconds = r * c;
      const tauMs = tauSeconds * 1000.0;
      const cutoffFreqHz = 1.0 / (2.0 * Math.PI * r * c);
      const maxEnergyUj = 0.5 * c * Math.pow(vSupply, 2) * 1e6;

      // Generate 50-point exponential step response waveform over 0 to 5 tau
      const numPoints = 60;
      const tMax = 5.0 * tauSeconds;
      const timePoints = [];

      for (let i = 0; i <= numPoints; i++) {
        const t = (i / numPoints) * tMax;
        const v = vSupply * (1.0 - Math.exp(-t / tauSeconds));
        const tauRatio = t / tauSeconds;
        timePoints.push({
          timeS: t,
          timeMs: Number((t * 1000.0).toFixed(3)),
          voltageV: Number(v.toFixed(3)),
          percentCharge: Number(((v / vSupply) * 100).toFixed(1)),
          tauMultiple: Number(tauRatio.toFixed(2))
        });
      }

      return {
        status: 'SOLVED_THEORETICAL',
        circuitType,
        sourceVoltage: { value: vSupply, unit: 'V', label: 'Step Input Voltage (Vin)', source: 'nominal_supply', is_measured: false },
        parameters: {
          r: { value: r, unit: 'Ω', formatted: `${r >= 1000 ? (r / 1000).toFixed(2) + ' kΩ' : r.toFixed(1) + ' Ω'}`, label: 'Timing Resistor (R)', source: 'component_value', is_measured: false },
          c: { value: c, unit: 'F', formatted: `${c < 1e-6 ? (c * 1e9).toFixed(1) + ' nF' : (c * 1e6).toFixed(2) + ' µF'}`, label: 'Timing Capacitor (C)', source: 'component_value', is_measured: false },
          tau: { value: tauMs, unit: 'ms', formatted: `${tauMs < 1 ? (tauMs * 1000).toFixed(1) + ' µs' : tauMs.toFixed(3) + ' ms'}`, label: 'Time Constant (τ = RC)', source: 'theoretical_model', is_measured: false },
          cutoffFrequency: { value: cutoffFreqHz, unit: 'Hz', formatted: `${cutoffFreqHz >= 1000 ? (cutoffFreqFreq => (cutoffFreqFreq / 1000).toFixed(2) + ' kHz')(cutoffFreqHz) : cutoffFreqHz.toFixed(1) + ' Hz'}`, label: 'Cutoff Frequency (-3dB fc)', source: 'theoretical_model', is_measured: false },
          voltage1Tau: { value: vSupply * 0.632, unit: 'V', formatted: `${(vSupply * 0.632).toFixed(3)} V (63.2%)`, label: 'Voltage at 1τ (63.2%)', source: 'theoretical_model', is_measured: false },
          voltage3Tau: { value: vSupply * 0.950, unit: 'V', formatted: `${(vSupply * 0.950).toFixed(3)} V (95.0%)`, label: 'Voltage at 3τ (95.0%)', source: 'theoretical_model', is_measured: false },
          voltage5Tau: { value: vSupply * 0.993, unit: 'V', formatted: `${(vSupply * 0.993).toFixed(3)} V (99.3% Steady State)`, label: 'Voltage at 5τ (Steady State)', source: 'theoretical_model', is_measured: false },
          storedEnergy: { value: maxEnergyUj, unit: 'µJ', formatted: `${maxEnergyUj.toFixed(3)} µJ`, label: 'Max Stored Energy (½ C Vin²)', source: 'theoretical_model', is_measured: false }
        },
        waveforms: [
          {
            name: 'Capacitor Voltage Step Charging Curve v_C(t)',
            type: 'time_series',
            xAxis: 'Time (ms)',
            yAxis: 'Capacitor Voltage (V)',
            tauMs: Number(tauMs.toFixed(3)),
            points: timePoints
          }
        ],
        governingEquation: 'v_C(t) = Vin × [ 1 - e^(-t / RC) ]'
      };
    }

    // -----------------------------------------------------------------------
    // 4. RC DISCHARGING
    // -----------------------------------------------------------------------
    case 'RC_DISCHARGING': {
      const rComp = matchedComponents?.r;
      const cComp = matchedComponents?.c;
      const r = extractNumericValue(rComp, 4700.0);
      let c = extractNumericValue(cComp, 100e-9);
      if (c > 1.0) c = c * 1e-6;

      const vInitial = vSupply || 5.0;
      const tauSeconds = r * c;
      const tauMs = tauSeconds * 1000.0;
      const halfLifeMs = tauMs * Math.LN2;

      const numPoints = 60;
      const tMax = 5.0 * tauSeconds;
      const timePoints = [];

      for (let i = 0; i <= numPoints; i++) {
        const t = (i / numPoints) * tMax;
        const v = vInitial * Math.exp(-t / tauSeconds);
        timePoints.push({
          timeS: t,
          timeMs: Number((t * 1000.0).toFixed(3)),
          voltageV: Number(v.toFixed(3)),
          percentRemaining: Number(((v / vInitial) * 100).toFixed(1)),
          tauMultiple: Number((t / tauSeconds).toFixed(2))
        });
      }

      return {
        status: 'SOLVED_THEORETICAL',
        circuitType,
        sourceVoltage: { value: vInitial, unit: 'V', label: 'Initial Capacitor Voltage (V0)', source: 'nominal_supply', is_measured: false },
        parameters: {
          r: { value: r, unit: 'Ω', formatted: `${r >= 1000 ? (r / 1000).toFixed(2) + ' kΩ' : r.toFixed(1) + ' Ω'}`, label: 'Discharge Resistor (R)', source: 'component_value', is_measured: false },
          c: { value: c, unit: 'F', formatted: `${c < 1e-6 ? (c * 1e9).toFixed(1) + ' nF' : (c * 1e6).toFixed(2) + ' µF'}`, label: 'Discharge Capacitor (C)', source: 'component_value', is_measured: false },
          tau: { value: tauMs, unit: 'ms', formatted: `${tauMs.toFixed(3)} ms`, label: 'Decay Constant (τ = RC)', source: 'theoretical_model', is_measured: false },
          halfLife: { value: halfLifeMs, unit: 'ms', formatted: `${halfLifeMs.toFixed(3)} ms`, label: 'Voltage Half-Life (t½ = τ ln 2)', source: 'theoretical_model', is_measured: false },
          voltage1Tau: { value: vInitial * 0.368, unit: 'V', formatted: `${(vInitial * 0.368).toFixed(3)} V (36.8%)`, label: 'Voltage at 1τ (36.8%)', source: 'theoretical_model', is_measured: false },
          voltage5Tau: { value: vInitial * 0.007, unit: 'V', formatted: `${(vInitial * 0.007).toFixed(3)} V (0.7% Fully Discharged)`, label: 'Voltage at 5τ (Full Discharge)', source: 'theoretical_model', is_measured: false }
        },
        waveforms: [
          {
            name: 'Capacitor Voltage Exponential Decay Curve v_C(t)',
            type: 'time_series',
            xAxis: 'Time (ms)',
            yAxis: 'Capacitor Voltage (V)',
            tauMs: Number(tauMs.toFixed(3)),
            points: timePoints
          }
        ],
        governingEquation: 'v_C(t) = V0 × e^(-t / RC)'
      };
    }

    // -----------------------------------------------------------------------
    // 5. PARALLEL RESISTORS
    // -----------------------------------------------------------------------
    case 'PARALLEL_RESISTOR_NETWORK': {
      const r1 = extractNumericValue(matchedComponents?.r1, 10000.0);
      const r2 = extractNumericValue(matchedComponents?.r2, 10000.0);
      const rEq = (r1 * r2) / (r1 + r2);
      const iTotalA = vSupply / rEq;
      const i1A = vSupply / r1;
      const i2A = vSupply / r2;

      return {
        status: 'SOLVED_THEORETICAL',
        circuitType,
        sourceVoltage: { value: vSupply, unit: 'V', label: 'Parallel Voltage (Vin)', source: 'nominal_supply', is_measured: false },
        parameters: {
          r1: { value: r1, unit: 'Ω', formatted: `${r1 >= 1000 ? (r1 / 1000).toFixed(2) + ' kΩ' : r1.toFixed(1) + ' Ω'}`, label: 'Branch 1 Resistor (R1)', source: 'component_value', is_measured: false },
          r2: { value: r2, unit: 'Ω', formatted: `${r2 >= 1000 ? (r2 / 1000).toFixed(2) + ' kΩ' : r2.toFixed(1) + ' Ω'}`, label: 'Branch 2 Resistor (R2)', source: 'component_value', is_measured: false },
          rEq: { value: rEq, unit: 'Ω', formatted: `${rEq >= 1000 ? (rEq / 1000).toFixed(2) + ' kΩ' : rEq.toFixed(1) + ' Ω'}`, label: 'Equivalent Resistance (Req = R1 ∥ R2)', source: 'theoretical_model', is_measured: false },
          iTotal: { value: iTotalA * 1000.0, unit: 'mA', formatted: `${(iTotalA * 1000.0).toFixed(2)} mA`, label: 'Total Source Current', source: 'theoretical_model', is_measured: false },
          i1: { value: i1A * 1000.0, unit: 'mA', formatted: `${(i1A * 1000.0).toFixed(2)} mA`, label: 'Branch 1 Current (I1)', source: 'theoretical_model', is_measured: false },
          i2: { value: i2A * 1000.0, unit: 'mA', formatted: `${(i2A * 1000.0).toFixed(2)} mA`, label: 'Branch 2 Current (I2)', source: 'theoretical_model', is_measured: false }
        },
        waveforms: [],
        governingEquation: '1/Req = 1/R1 + 1/R2,  I_total = I1 + I2'
      };
    }

    // -----------------------------------------------------------------------
    // 6. SERIES-PARALLEL BRIDGE
    // -----------------------------------------------------------------------
    case 'SERIES_PARALLEL_RESISTOR_NETWORK': {
      const r1 = extractNumericValue(matchedComponents?.r_series, 1000.0);
      const r2 = extractNumericValue(matchedComponents?.r_par1, 2200.0);
      const r3 = extractNumericValue(matchedComponents?.r_par2, 4700.0);

      const rPar = (r2 * r3) / (r2 + r3);
      const rTotal = r1 + rPar;
      const iTotalA = vSupply / rTotal;
      const vBridge = iTotalA * rPar;

      return {
        status: 'SOLVED_THEORETICAL',
        circuitType,
        sourceVoltage: { value: vSupply, unit: 'V', label: 'Supply Voltage (Vin)', source: 'nominal_supply', is_measured: false },
        parameters: {
          r1: { value: r1, unit: 'Ω', formatted: `${(r1 / 1000).toFixed(2)} kΩ`, label: 'Series Resistor (R1)', source: 'component_value', is_measured: false },
          r2: { value: r2, unit: 'Ω', formatted: `${(r2 / 1000).toFixed(2)} kΩ`, label: 'Parallel Resistor (R2)', source: 'component_value', is_measured: false },
          r3: { value: r3, unit: 'Ω', formatted: `${(r3 / 1000).toFixed(2)} kΩ`, label: 'Parallel Resistor (R3)', source: 'component_value', is_measured: false },
          rPar: { value: rPar, unit: 'Ω', formatted: `${(rPar / 1000).toFixed(2)} kΩ`, label: 'Parallel Bank (R2 ∥ R3)', source: 'theoretical_model', is_measured: false },
          rTotal: { value: rTotal, unit: 'Ω', formatted: `${(rTotal / 1000).toFixed(2)} kΩ`, label: 'Total Equivalent Resistance (Req)', source: 'theoretical_model', is_measured: false },
          vBridge: { value: vBridge, unit: 'V', formatted: `${vBridge.toFixed(3)} V`, label: 'Bridge Node Voltage', source: 'theoretical_model', is_measured: false },
          iTotal: { value: iTotalA * 1000.0, unit: 'mA', formatted: `${(iTotalA * 1000.0).toFixed(2)} mA`, label: 'Total Current', source: 'theoretical_model', is_measured: false }
        },
        waveforms: [],
        governingEquation: 'Req = R1 + [ (R2 × R3) / (R2 + R3) ]'
      };
    }

    default:
      return {
        status: 'UNAVAILABLE',
        circuitType,
        parameters: {},
        waveforms: [],
        notes: ['No specific theoretical behavioural formula registered for this custom topology.']
      };
  }
}

export default calculateCircuitBehaviour;
