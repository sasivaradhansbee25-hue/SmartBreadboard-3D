/**
 * SmartBreadboard 3D — Circuit Knowledge Registry (Phase 25)
 *
 * Generic, extensible circuit knowledge repository defining circuit taxonomy,
 * component requirements, topological graph constraints, electrical behaviour
 * models, visualization types, and educational templates.
 *
 * Architecture allows new circuits to be added without modifying the core engine.
 */

// Canonical Circuit Categories
export const CIRCUIT_CATEGORIES = {
  BASIC: 'basic',
  TRANSIENT: 'transient',
  AC: 'AC',
  SEMICONDUCTOR: 'semiconductor',
  AMPLIFIER: 'amplifier',
  OSCILLATOR: 'oscillator',
  POWER_ELECTRONICS: 'power-electronics',
  DIGITAL: 'digital'
};

// Canonical Verification States
export const VERIFICATION_STATES = {
  VERIFIED: 'VERIFIED',
  PARTIALLY_VERIFIED: 'PARTIALLY_VERIFIED',
  NOT_VERIFIED: 'NOT_VERIFIED',
  UNSUPPORTED: 'UNSUPPORTED'
};

// Canonical Visualization Types
export const VISUALIZATION_TYPES = {
  VOLTAGE_DISTRIBUTION: 'VOLTAGE_DISTRIBUTION',
  CURRENT_LIMITING: 'CURRENT_LIMITING',
  RC_CHARGING_WAVEFORM: 'RC_CHARGING_WAVEFORM',
  RC_DISCHARGING_WAVEFORM: 'RC_DISCHARGING_WAVEFORM',
  PARALLEL_BRANCH_FLOW: 'PARALLEL_BRANCH_FLOW',
  SERIES_PARALLEL_FLOW: 'SERIES_PARALLEL_FLOW',
  OSCILLATOR_PHASE_WAVEFORM: 'OSCILLATOR_PHASE_WAVEFORM',
  RESONANCE_CURVE: 'RESONANCE_CURVE',
  RECTIFIED_DC_WAVEFORM: 'RECTIFIED_DC_WAVEFORM',
  GENERIC_DC_FLOW: 'GENERIC_DC_FLOW',
  AC_LOW_PASS: 'AC_LOW_PASS',
  AC_HIGH_PASS: 'AC_HIGH_PASS',
  AC_BAND_PASS: 'AC_BAND_PASS',
  AC_BAND_STOP: 'AC_BAND_STOP',
  AC_FREQUENCY_RESPONSE: 'AC_FREQUENCY_RESPONSE'
};

/**
 * Built-in Circuit Knowledge Registry definitions.
 */
const BUILT_IN_CIRCUITS = [
  // 1. Voltage Divider
  {
    circuitType: 'VOLTAGE_DIVIDER',
    displayName: 'Voltage Divider',
    category: CIRCUIT_CATEGORIES.BASIC,
    description: 'Two resistors connected in series to produce an intermediate output voltage proportional to their resistance ratio.',
    requiredComponents: [
      { role: 'r_top', type: 'resistor', minCount: 1, maxCount: 1, label: 'Upper Resistor (R1 / Pull-up)' },
      { role: 'r_bot', type: 'resistor', minCount: 1, maxCount: 1, label: 'Lower Resistor (R2 / Pull-down)' }
    ],
    optionalComponents: [
      { role: 'jumper', type: 'wire', label: 'Connecting Jumper' }
    ],
    topologyRequirements: {
      minResistors: 2,
      maxResistors: 2,
      seriesConnection: true,
      requiresPowerSupply: true,
      intermediateSensingNode: true,
      rules: [
        'R1 terminal A connected to VCC (Positive Supply)',
        'R1 terminal B and R2 terminal A connected to shared intermediate output node (Vout)',
        'R2 terminal B connected to GND (Ground / Negative Supply)',
        'Intermediate node must have no low-impedance parallel short'
      ]
    },
    electricalModel: 'VOLTAGE_DIVIDER_MODEL',
    requiredParameters: ['v_in', 'r1', 'r2'],
    visualizationType: VISUALIZATION_TYPES.VOLTAGE_DISTRIBUTION,
    explanationTemplate: {
      governingLaw: "Ohm's Law & Kirchhoff's Voltage Law (KVL)",
      formulaSummary: "Vout = Vin × (R2 / (R1 + R2))",
      purpose: "Scales down a higher DC voltage to a lower precision reference or signal level.",
      application: "Sensor interfacing (potentiometers, LDRs, thermistors), ADC input conditioning, level shifting."
    }
  },

  // 2. LED Current-Limiting Circuit
  {
    circuitType: 'LED_CURRENT_LIMITER',
    displayName: 'LED Current Limiter',
    category: CIRCUIT_CATEGORIES.BASIC,
    description: 'A current-limiting resistor connected in series with a Light Emitting Diode (LED) to restrict forward diode current to safe levels.',
    requiredComponents: [
      { role: 'current_limiter', type: 'resistor', minCount: 1, maxCount: 1, label: 'Ballast Resistor (R_limit)' },
      { role: 'led', type: 'led', minCount: 1, maxCount: 1, label: 'Light Emitting Diode (LED)' }
    ],
    optionalComponents: [
      { role: 'jumper', type: 'wire', label: 'Connecting Jumper' }
    ],
    topologyRequirements: {
      minResistors: 1,
      minLeds: 1,
      seriesConnection: true,
      requiresPowerSupply: true,
      rules: [
        'Resistor and LED connected in series between VCC and GND',
        'LED anode oriented towards higher electrical potential (forward biased)',
        'LED cathode oriented towards GND',
        'Series branch draws single continuous loop current'
      ]
    },
    electricalModel: 'LED_LIMITER_MODEL',
    requiredParameters: ['v_in', 'r_limit', 'v_forward'],
    visualizationType: VISUALIZATION_TYPES.CURRENT_LIMITING,
    explanationTemplate: {
      governingLaw: "Diode Characteristic & Kirchhoff's Voltage Law",
      formulaSummary: "I_LED = (Vin - Vf) / R_limit",
      purpose: "Prevents thermal runaway and permanent LED destruction by limiting forward operating current.",
      application: "Indicator lights, optocoupler driving, status displays, optical communications."
    }
  },

  // 3. RC Charging Circuit (Low-Pass Filter)
  {
    circuitType: 'RC_CHARGING',
    displayName: 'RC Charging & Low-Pass Filter',
    category: CIRCUIT_CATEGORIES.TRANSIENT,
    description: 'A series resistor feeding a parallel capacitor to GND, exhibiting exponential voltage rise and high-frequency attenuation.',
    requiredComponents: [
      { role: 'timing_resistor', type: 'resistor', minCount: 1, maxCount: 1, label: 'Timing Resistor (R)' },
      { role: 'timing_capacitor', type: 'capacitor', minCount: 1, maxCount: 1, label: 'Timing Capacitor (C)' }
    ],
    optionalComponents: [
      { role: 'jumper', type: 'wire', label: 'Connecting Jumper' }
    ],
    topologyRequirements: {
      minResistors: 1,
      minCapacitors: 1,
      requiresPowerSupply: true,
      rules: [
        'Resistor connected between Input/VCC and Output/Timing node',
        'Capacitor connected between Output/Timing node and Ground',
        'Forms a first-order low-pass filter / step integrator'
      ]
    },
    electricalModel: 'RC_CHARGING_MODEL',
    requiredParameters: ['v_in', 'r', 'c'],
    visualizationType: VISUALIZATION_TYPES.RC_CHARGING_WAVEFORM,
    explanationTemplate: {
      governingLaw: "First-Order Transient Differential Equation",
      formulaSummary: "v_C(t) = Vin × (1 - e^(-t / RC)),  τ = R × C",
      purpose: "Introduces controlled time delays, smooths supply ripples, or filters out high-frequency noise.",
      application: "Power-on reset circuits, debouncing switches, audio crossover filtering, timer circuits."
    }
  },

  // 4. RC Discharging Circuit
  {
    circuitType: 'RC_DISCHARGING',
    displayName: 'RC Discharging Circuit',
    category: CIRCUIT_CATEGORIES.TRANSIENT,
    description: 'A charged capacitor discharging stored electrical energy exponentially through a parallel bleed resistor to GND.',
    requiredComponents: [
      { role: 'discharge_resistor', type: 'resistor', minCount: 1, maxCount: 1, label: 'Bleed / Discharge Resistor (R)' },
      { role: 'storage_capacitor', type: 'capacitor', minCount: 1, maxCount: 1, label: 'Storage Capacitor (C)' }
    ],
    optionalComponents: [
      { role: 'jumper', type: 'wire', label: 'Connecting Jumper' }
    ],
    topologyRequirements: {
      minResistors: 1,
      minCapacitors: 1,
      rules: [
        'Resistor and Capacitor connected in parallel across shared output node and GND',
        'No active DC source forcing charging in steady-state discharge mode'
      ]
    },
    electricalModel: 'RC_DISCHARGING_MODEL',
    requiredParameters: ['v_initial', 'r', 'c'],
    visualizationType: VISUALIZATION_TYPES.RC_DISCHARGING_WAVEFORM,
    explanationTemplate: {
      governingLaw: "Exponential Decay Differential Equation",
      formulaSummary: "v_C(t) = V0 × e^(-t / RC),  t_half = RC × ln(2)",
      purpose: "Dissipates stored capacitor energy safely or generates timed trailing-edge waveforms.",
      application: "High-voltage bleeder circuits, timer hold delays, AC signal envelope detectors."
    }
  },

  // 5. Two Resistors in Parallel
  {
    circuitType: 'PARALLEL_RESISTOR_NETWORK',
    displayName: 'Parallel Resistor Network',
    category: CIRCUIT_CATEGORIES.BASIC,
    description: 'Two resistors connected across identical electrical node pairs, dividing source current while sharing identical voltage.',
    requiredComponents: [
      { role: 'r_branch1', type: 'resistor', minCount: 1, maxCount: 1, label: 'Branch 1 Resistor (R1)' },
      { role: 'r_branch2', type: 'resistor', minCount: 1, maxCount: 1, label: 'Branch 2 Resistor (R2)' }
    ],
    optionalComponents: [
      { role: 'jumper', type: 'wire', label: 'Connecting Jumper' }
    ],
    topologyRequirements: {
      minResistors: 2,
      maxResistors: 2,
      parallelConnection: true,
      rules: [
        'Both resistors share identical top node (e.g. VCC)',
        'Both resistors share identical bottom node (e.g. GND)',
        'Req = (R1 × R2) / (R1 + R2)'
      ]
    },
    electricalModel: 'PARALLEL_RESISTOR_MODEL',
    requiredParameters: ['v_in', 'r1', 'r2'],
    visualizationType: VISUALIZATION_TYPES.PARALLEL_BRANCH_FLOW,
    explanationTemplate: {
      governingLaw: "Kirchhoff's Current Law (KCL) & Current Division Rule",
      formulaSummary: "1/Req = 1/R1 + 1/R2,  I_total = I1 + I2",
      purpose: "Lowers total effective resistance and distributes high currents across multiple branches.",
      application: "Current shunts, high-power load distribution, impedance matching."
    }
  },

  // 6. Series-Parallel Mixed Resistor Network
  {
    circuitType: 'SERIES_PARALLEL_RESISTOR_NETWORK',
    displayName: 'Series-Parallel Bridge Network',
    category: CIRCUIT_CATEGORIES.BASIC,
    description: 'A series resistor driving a parallel resistor branch (R1 + (R2 ∥ R3)), creating multi-stage current division.',
    requiredComponents: [
      { role: 'r_series', type: 'resistor', minCount: 1, maxCount: 1, label: 'Series Feed Resistor (R1)' },
      { role: 'r_par1', type: 'resistor', minCount: 1, maxCount: 1, label: 'Parallel Resistor 1 (R2)' },
      { role: 'r_par2', type: 'resistor', minCount: 1, maxCount: 1, label: 'Parallel Resistor 2 (R3)' }
    ],
    optionalComponents: [
      { role: 'jumper', type: 'wire', label: 'Connecting Jumper' }
    ],
    topologyRequirements: {
      minResistors: 3,
      rules: [
        'R1 in series between VCC and Bridge Node',
        'R2 and R3 in parallel between Bridge Node and GND'
      ]
    },
    electricalModel: 'SERIES_PARALLEL_MODEL',
    requiredParameters: ['v_in', 'r1', 'r2', 'r3'],
    visualizationType: VISUALIZATION_TYPES.SERIES_PARALLEL_FLOW,
    explanationTemplate: {
      governingLaw: "Network Reduction & Combined KVL/KCL",
      formulaSummary: "Req = R1 + ((R2 × R3) / (R2 + R3))",
      purpose: "Illustrates multi-branch nodal analysis and loaded voltage division.",
      application: "Loaded attenuators, transistor biasing networks, ladder DAC networks."
    }
  },

  // 7. RC Phase-Shift Oscillator Network (Oscillator)
  {
    circuitType: 'RC_PHASE_SHIFT_OSCILLATOR',
    displayName: 'RC Phase-Shift Oscillator',
    category: CIRCUIT_CATEGORIES.OSCILLATOR,
    description: 'A 3-stage cascaded RC ladder feedback network (-60° each, totaling -180°) coupled with an inverting amplifier (180°) to satisfy the Barkhausen oscillation criterion.',
    requiredComponents: [
      { role: 'r_stage1', type: 'resistor', minCount: 1, maxCount: 1, label: 'Stage 1 Resistor (R)' },
      { role: 'r_stage2', type: 'resistor', minCount: 1, maxCount: 1, label: 'Stage 2 Resistor (R)' },
      { role: 'r_stage3', type: 'resistor', minCount: 1, maxCount: 1, label: 'Stage 3 Resistor (R)' },
      { role: 'c_stage1', type: 'capacitor', minCount: 1, maxCount: 1, label: 'Stage 1 Capacitor (C)' },
      { role: 'c_stage2', type: 'capacitor', minCount: 1, maxCount: 1, label: 'Stage 2 Capacitor (C)' },
      { role: 'c_stage3', type: 'capacitor', minCount: 1, maxCount: 1, label: 'Stage 3 Capacitor (C)' }
    ],
    optionalComponents: [
      { role: 'active_inverter', type: 'transistor', label: 'Inverting Amplifier / BJT (180° inversion)' },
      { role: 'opamp', type: 'ic', label: 'Inverting Op-Amp Stage' }
    ],
    topologyRequirements: {
      minResistors: 3,
      minCapacitors: 3,
      cascadedStages: 3,
      requiresFeedbackLoop: true,
      rules: [
        'Must possess exactly 3 cascaded RC ladder filter sections',
        'Each RC stage must provide -60° phase shift at f0 for a cumulative -180° phase shift',
        'Requires an inverting gain stage (|Av| >= 29) to provide remaining 180° shift and compensate ladder attenuation (1/29)',
        'Total loop phase shift must equal 0° / 360° and loop gain |Aβ| >= 1 (Barkhausen Criterion)'
      ]
    },
    electricalModel: 'RC_OSCILLATOR_MODEL',
    requiredParameters: ['r', 'c'],
    visualizationType: VISUALIZATION_TYPES.OSCILLATOR_PHASE_WAVEFORM,
    explanationTemplate: {
      governingLaw: "Barkhausen Oscillation Criterion",
      formulaSummary: "f0 = 1 / (2π × R × C × √6),  |Av| >= 29",
      purpose: "Generates continuous pure sinusoidal AC audio oscillations without an external AC signal generator.",
      application: "Audio tone generators, musical instruments, low-frequency calibration sources."
    }
  },

  // 8. Series RLC Resonant Circuit (Phase 26 Verified AC Engine)
  {
    circuitType: 'RLC_SERIES_RESONANCE',
    displayName: 'Series RLC Resonant Circuit',
    category: CIRCUIT_CATEGORIES.AC,
    description: 'A series resistor, inductor, and capacitor configuration exhibiting minimum impedance (Z ≈ R), maximum current, and zero phase angle at resonant frequency f0.',
    requiredComponents: [
      { role: 'resistor', type: 'resistor', minCount: 1, maxCount: 1, label: 'Damping / Series Resistor (R)' },
      { role: 'inductor', type: 'inductor', minCount: 1, maxCount: 1, label: 'Resonant Inductor (L)' },
      { role: 'capacitor', type: 'capacitor', minCount: 1, maxCount: 1, label: 'Tuning Capacitor (C)' }
    ],
    optionalComponents: [
      { role: 'jumper', type: 'wire', label: 'Connecting Jumper' }
    ],
    topologyRequirements: {
      minInductors: 1,
      minCapacitors: 1,
      minResistors: 1,
      seriesConnection: true,
      rules: [
        'R, L, and C connected in a continuous series branch',
        'At resonance f0 = 1 / (2π√(LC)), inductive reactance XL cancels capacitive reactance XC (XL = XC)',
        'Impedance reaches minimum |Z| = R, loop current reaches maximum I = Vin / R',
        'Quality factor Q = (ω0 × L) / R, Bandwidth BW = f0 / Q'
      ]
    },
    electricalModel: 'RLC_SERIES_AC_MODEL',
    requiredParameters: ['r', 'l', 'c'],
    visualizationType: VISUALIZATION_TYPES.RESONANCE_CURVE,
    explanationTemplate: {
      governingLaw: "Reactance Cancellation & Series Resonance",
      formulaSummary: "f0 = 1 / (2π√(LC)),  Q = (ω0 × L) / R,  BW = R / (2πL)",
      purpose: "Acts as a bandpass filter or frequency selector, passing maximum current at f0.",
      application: "Radio tuning front-ends, antenna matching networks, intermediate frequency filters."
    }
  },

  // 8b. Parallel RLC Resonant Tank
  {
    circuitType: 'RLC_PARALLEL_RESONANCE',
    displayName: 'Parallel RLC Resonant Tank',
    category: CIRCUIT_CATEGORIES.AC,
    description: 'A parallel resistor, inductor, and capacitor tank exhibiting maximum impedance (Z ≈ R), minimum line current, and zero phase angle at resonant frequency f0.',
    requiredComponents: [
      { role: 'resistor', type: 'resistor', minCount: 1, maxCount: 1, label: 'Tank Parallel Resistor (R)' },
      { role: 'inductor', type: 'inductor', minCount: 1, maxCount: 1, label: 'Tank Inductor (L)' },
      { role: 'capacitor', type: 'capacitor', minCount: 1, maxCount: 1, label: 'Tank Capacitor (C)' }
    ],
    optionalComponents: [
      { role: 'jumper', type: 'wire', label: 'Connecting Jumper' }
    ],
    topologyRequirements: {
      minInductors: 1,
      minCapacitors: 1,
      minResistors: 1,
      parallelConnection: true,
      rules: [
        'R, L, and C connected in parallel across shared node pair',
        'At resonance f0 = 1 / (2π√(LC)), inductive susceptance BL cancels capacitive susceptance BC (BL = BC)',
        'Impedance reaches maximum |Z| = R, supply current reaches minimum',
        'Quality factor Q = R × √(C/L), Bandwidth BW = f0 / Q'
      ]
    },
    electricalModel: 'RLC_PARALLEL_AC_MODEL',
    requiredParameters: ['r', 'l', 'c'],
    visualizationType: VISUALIZATION_TYPES.RESONANCE_CURVE,
    explanationTemplate: {
      governingLaw: "Susceptance Cancellation & Parallel Resonance",
      formulaSummary: "f0 = 1 / (2π√(LC)),  Q = R × √(C/L),  BW = f0 / Q",
      purpose: "Acts as a bandstop/notch filter or high-impedance load for RF amplifiers.",
      application: "LC oscillators, RF power amplifiers, harmonic trap filters."
    }
  },

  // 9. Full-Wave Diode Bridge Rectifier
  {
    circuitType: 'FULL_WAVE_BRIDGE_RECTIFIER',
    displayName: 'Full-Wave Bridge Rectifier',
    category: CIRCUIT_CATEGORIES.POWER_ELECTRONICS,
    description: 'A four-diode bridge configuration converting bidirectional AC voltage into pulsating unidirectional DC.',
    requiredComponents: [
      { role: 'd1', type: 'diode', minCount: 1, maxCount: 1, label: 'Rectifier Diode 1' },
      { role: 'd2', type: 'diode', minCount: 1, maxCount: 1, label: 'Rectifier Diode 2' },
      { role: 'd3', type: 'diode', minCount: 1, maxCount: 1, label: 'Rectifier Diode 3' },
      { role: 'd4', type: 'diode', minCount: 1, maxCount: 1, label: 'Rectifier Diode 4' }
    ],
    optionalComponents: [
      { role: 'filter_cap', type: 'capacitor', label: 'Smoothing Capacitor' },
      { role: 'load_resistor', type: 'resistor', label: 'DC Load Resistor' }
    ],
    topologyRequirements: {
      minDiodes: 4,
      rules: [
        'Four diodes arranged in closed bridge topology with 2 AC input nodes and 2 DC output nodes (+/-)'
      ]
    },
    electricalModel: 'BRIDGE_RECTIFIER_MODEL',
    requiredParameters: ['v_ac_peak', 'v_diode_drop'],
    visualizationType: VISUALIZATION_TYPES.RECTIFIED_DC_WAVEFORM,
    explanationTemplate: {
      governingLaw: "Non-Linear Diode Conduction Cycles",
      formulaSummary: "Vdc_peak = Vac_peak - 2 × Vf",
      purpose: "Converts AC utility mains or transformer output into unidirectional DC power.",
      application: "Linear power supplies, battery chargers, motor speed controllers."
    }
  },

  // 10. RC Low-Pass Filter (Phase 27)
  {
    circuitType: 'RC_LOW_PASS',
    circuitId: 'RC_LOW_PASS',
    displayName: 'RC Low-Pass Filter',
    category: CIRCUIT_CATEGORIES.AC,
    description: 'First-order passive RC low-pass filter passing low-frequency signals while attenuating frequencies above cutoff fc = 1 / (2πRC).',
    requiredComponents: [
      { role: 'resistor', type: 'resistor', minCount: 1, maxCount: 1, label: 'Series Resistor (R)' },
      { role: 'capacitor', type: 'capacitor', minCount: 1, maxCount: 1, label: 'Shunt Capacitor (C)' }
    ],
    topologyRequirements: {
      minResistors: 1,
      minCapacitors: 1,
      seriesShunt: true,
      rules: [
        'Series Resistor connected between input node and intermediate output node',
        'Shunt Capacitor connected between intermediate output node and ground'
      ]
    },
    inputRequirements: { node: 'input_node', description: 'AC excitation source' },
    outputRequirements: { node: 'output_node', description: 'Node across shunt capacitor' },
    expectedResponseShape: 'High gain at low frequencies, -3dB at cutoff fc, -20dB/decade roll-off at high frequencies',
    electricalModel: 'RC_LOW_PASS_AC_MODEL',
    requiredParameters: ['r', 'c', 'v_in'],
    equations: {
      transferFunction: 'H(jω) = 1 / (1 + jωRC)',
      cutoff: 'fc = 1 / (2πRC)',
      gainMagnitude: '|H(jω)| = 1 / √(1 + (ωRC)²)',
      phase: '∠H(jω) = -arctan(ωRC)'
    },
    visualizationType: VISUALIZATION_TYPES.AC_LOW_PASS,
    explanationTemplate: {
      governingLaw: 'Capacitive Reactance Frequency Dependence (XC = 1 / (2πfC))',
      formulaSummary: 'fc = 1 / (2πRC),  |H(fc)| = -3.01 dB,  ∠H(fc) = -45°',
      purpose: 'Suppresses high-frequency noise and harmonics while preserving low-frequency information.',
      application: 'Audio crossover subwoofers, ADC anti-aliasing pre-filters, power supply ripple smoothing.'
    },
    limitations: 'First-order passive filter has fixed -20 dB/decade roll-off and loading sensitivity.'
  },

  // 11. RC High-Pass Filter (Phase 27)
  {
    circuitType: 'RC_HIGH_PASS',
    circuitId: 'RC_HIGH_PASS',
    displayName: 'RC High-Pass Filter',
    category: CIRCUIT_CATEGORIES.AC,
    description: 'First-order passive RC high-pass filter blocking DC and low frequencies while passing frequencies above cutoff fc = 1 / (2πRC).',
    requiredComponents: [
      { role: 'capacitor', type: 'capacitor', minCount: 1, maxCount: 1, label: 'Series Capacitor (C)' },
      { role: 'resistor', type: 'resistor', minCount: 1, maxCount: 1, label: 'Shunt Resistor (R)' }
    ],
    topologyRequirements: {
      minResistors: 1,
      minCapacitors: 1,
      seriesShunt: true,
      rules: [
        'Series Capacitor connected between input node and intermediate output node',
        'Shunt Resistor connected between intermediate output node and ground'
      ]
    },
    inputRequirements: { node: 'input_node', description: 'AC excitation source' },
    outputRequirements: { node: 'output_node', description: 'Node across shunt resistor' },
    expectedResponseShape: 'Low gain at low frequencies, -3dB at cutoff fc, unity passband gain at high frequencies',
    electricalModel: 'RC_HIGH_PASS_AC_MODEL',
    requiredParameters: ['r', 'c', 'v_in'],
    equations: {
      transferFunction: 'H(jω) = jωRC / (1 + jωRC)',
      cutoff: 'fc = 1 / (2πRC)',
      gainMagnitude: '|H(jω)| = (ωRC) / √(1 + (ωRC)²)',
      phase: '∠H(jω) = 90° - arctan(ωRC)'
    },
    visualizationType: VISUALIZATION_TYPES.AC_HIGH_PASS,
    explanationTemplate: {
      governingLaw: 'Capacitive Reactance Attenuation & DC Blocking',
      formulaSummary: 'fc = 1 / (2πRC),  |H(fc)| = -3.01 dB,  ∠H(fc) = +45°',
      purpose: 'Blocks steady-state DC bias while transmitting high-frequency AC signals.',
      application: 'Audio amplifier AC input coupling, treble tone controls, differentiator networks.'
    },
    limitations: 'Passive first-order circuit exhibits insertion loss and cannot provide active voltage gain.'
  },

  // 12. RL Low-Pass Filter (Phase 27)
  {
    circuitType: 'RL_LOW_PASS',
    circuitId: 'RL_LOW_PASS',
    displayName: 'RL Low-Pass Filter',
    category: CIRCUIT_CATEGORIES.AC,
    description: 'First-order passive RL low-pass filter passing low-frequency signals while inductive reactance opposes high-frequency currents.',
    requiredComponents: [
      { role: 'inductor', type: 'inductor', minCount: 1, maxCount: 1, label: 'Series Inductor (L)' },
      { role: 'resistor', type: 'resistor', minCount: 1, maxCount: 1, label: 'Shunt Resistor (R)' }
    ],
    topologyRequirements: {
      minResistors: 1,
      minInductors: 1,
      seriesShunt: true,
      rules: [
        'Series Inductor connected between input node and intermediate output node',
        'Shunt Resistor connected between intermediate output node and ground'
      ]
    },
    inputRequirements: { node: 'input_node', description: 'AC excitation source' },
    outputRequirements: { node: 'output_node', description: 'Node across shunt resistor' },
    expectedResponseShape: 'Unity gain at DC/low frequencies, -3dB at fc = R / (2πL), high-frequency roll-off',
    electricalModel: 'RL_LOW_PASS_AC_MODEL',
    requiredParameters: ['r', 'l', 'v_in'],
    equations: {
      transferFunction: 'H(jω) = R / (R + jωL)',
      cutoff: 'fc = R / (2πL)',
      gainMagnitude: '|H(jω)| = R / √(R² + (ωL)²)',
      phase: '∠H(jω) = -arctan(ωL / R)'
    },
    visualizationType: VISUALIZATION_TYPES.AC_LOW_PASS,
    explanationTemplate: {
      governingLaw: 'Inductive Reactance Frequency Dependence (XL = 2πfL)',
      formulaSummary: 'fc = R / (2πL),  |H(fc)| = -3.01 dB,  ∠H(fc) = -45°',
      purpose: 'Attenuates high-frequency noise using magnetic flux opposition.',
      application: 'Speaker crossover woofers, RF chokes, power filtering.'
    },
    limitations: 'Physical inductors possess series DC winding resistance (DCR) and magnetic saturation.'
  },

  // 13. RL High-Pass Filter (Phase 27)
  {
    circuitType: 'RL_HIGH_PASS',
    circuitId: 'RL_HIGH_PASS',
    displayName: 'RL High-Pass Filter',
    category: CIRCUIT_CATEGORIES.AC,
    description: 'First-order passive RL high-pass filter shunting low frequencies to ground through inductive reactance while passing high frequencies.',
    requiredComponents: [
      { role: 'resistor', type: 'resistor', minCount: 1, maxCount: 1, label: 'Series Resistor (R)' },
      { role: 'inductor', type: 'inductor', minCount: 1, maxCount: 1, label: 'Shunt Inductor (L)' }
    ],
    topologyRequirements: {
      minResistors: 1,
      minInductors: 1,
      seriesShunt: true,
      rules: [
        'Series Resistor connected between input node and intermediate output node',
        'Shunt Inductor connected between intermediate output node and ground'
      ]
    },
    inputRequirements: { node: 'input_node', description: 'AC excitation source' },
    outputRequirements: { node: 'output_node', description: 'Node across shunt inductor' },
    expectedResponseShape: 'Low gain at low frequencies, -3dB at fc = R / (2πL), unity passband gain at high frequencies',
    electricalModel: 'RL_HIGH_PASS_AC_MODEL',
    requiredParameters: ['r', 'l', 'v_in'],
    equations: {
      transferFunction: 'H(jω) = jωL / (R + jωL)',
      cutoff: 'fc = R / (2πL)',
      gainMagnitude: '|H(jω)| = (ωL) / √(R² + (ωL)²)',
      phase: '∠H(jω) = 90° - arctan(ωL / R)'
    },
    visualizationType: VISUALIZATION_TYPES.AC_HIGH_PASS,
    explanationTemplate: {
      governingLaw: 'Inductive Shunting & Low-Frequency Attenuation',
      formulaSummary: 'fc = R / (2πL),  |H(fc)| = -3.01 dB,  ∠H(fc) = +45°',
      purpose: 'Passes high-frequency signals while shunting DC and low-frequency components.',
      application: 'High-pass audio crossovers, pulse transformers, RF discrimination.'
    },
    limitations: 'Bulky at low frequencies due to required large inductance values.'
  },

  // 14. RLC Band-Pass Filter (Phase 27)
  {
    circuitType: 'RLC_BAND_PASS',
    circuitId: 'RLC_BAND_PASS',
    displayName: 'RLC Band-Pass Filter',
    category: CIRCUIT_CATEGORIES.AC,
    description: 'Second-order resonant RLC band-pass filter transmitting frequencies in a narrow band around center frequency f0 = 1 / (2π√(LC)).',
    requiredComponents: [
      { role: 'inductor', type: 'inductor', minCount: 1, maxCount: 1, label: 'Resonant Inductor (L)' },
      { role: 'capacitor', type: 'capacitor', minCount: 1, maxCount: 1, label: 'Tuning Capacitor (C)' },
      { role: 'resistor', type: 'resistor', minCount: 1, maxCount: 1, label: 'Load / Damping Resistor (R)' }
    ],
    topologyRequirements: {
      minInductors: 1,
      minCapacitors: 1,
      minResistors: 1,
      seriesShunt: true,
      rules: [
        'Series LC branch connected between input node and output node',
        'Shunt resistor R connected between output node and ground'
      ]
    },
    inputRequirements: { node: 'input_node', description: 'AC source' },
    outputRequirements: { node: 'output_node', description: 'Node across shunt resistor' },
    expectedResponseShape: 'Attenuated low & high frequencies, peak gain at center frequency f0, -3dB bandwidth BW = f0 / Q',
    electricalModel: 'RLC_BAND_PASS_AC_MODEL',
    requiredParameters: ['r', 'l', 'c', 'v_in'],
    equations: {
      centerFrequency: 'f0 = 1 / (2π√(LC))',
      qualityFactor: 'Q = (2πf0 × L) / R',
      bandwidth: 'BW = f0 / Q = R / (2πL)'
    },
    visualizationType: VISUALIZATION_TYPES.AC_BAND_PASS,
    explanationTemplate: {
      governingLaw: 'Series LC Impedance Minimum at Resonance',
      formulaSummary: 'f0 = 1 / (2π√(LC)),  BW = R / (2πL),  Q = f0 / BW',
      purpose: 'Selectively passes a specific band of frequencies while rejecting all out-of-band signals.',
      application: 'Radio receiver tuning front-ends, audio parametric equalizers, intermediate frequency bandpass.'
    },
    limitations: 'Bandwidth and selectivity are constrained by inductor internal resistance.'
  },

  // 15. RLC Band-Stop / Notch Filter (Phase 27)
  {
    circuitType: 'RLC_BAND_STOP',
    circuitId: 'RLC_BAND_STOP',
    displayName: 'RLC Band-Stop (Notch) Filter',
    category: CIRCUIT_CATEGORIES.AC,
    description: 'Second-order resonant RLC band-stop filter attenuating a narrow band of frequencies around notch frequency f0 = 1 / (2π√(LC)).',
    requiredComponents: [
      { role: 'resistor', type: 'resistor', minCount: 1, maxCount: 1, label: 'Series Resistor (R)' },
      { role: 'inductor', type: 'inductor', minCount: 1, maxCount: 1, label: 'Notch Inductor (L)' },
      { role: 'capacitor', type: 'capacitor', minCount: 1, maxCount: 1, label: 'Notch Capacitor (C)' }
    ],
    topologyRequirements: {
      minInductors: 1,
      minCapacitors: 1,
      minResistors: 1,
      rules: [
        'Resistor R in series with line and parallel/series resonant LC trap shunting notch frequencies'
      ]
    },
    inputRequirements: { node: 'input_node', description: 'AC source' },
    outputRequirements: { node: 'output_node', description: 'Filtered output node' },
    expectedResponseShape: 'Passband transmission at low and high frequencies with sharp attenuation notch at f0',
    electricalModel: 'RLC_BAND_STOP_AC_MODEL',
    requiredParameters: ['r', 'l', 'c', 'v_in'],
    equations: {
      notchFrequency: 'f0 = 1 / (2π√(LC))',
      qualityFactor: 'Q = f0 / BW'
    },
    visualizationType: VISUALIZATION_TYPES.AC_BAND_STOP,
    explanationTemplate: {
      governingLaw: 'Resonant Trap Reactance Cancellation',
      formulaSummary: 'f0 = 1 / (2π√(LC)),  Deep attenuation notch at f0',
      purpose: 'Eliminates a specific unwanted interference frequency without distorting adjacent signals.',
      application: '50/60Hz mains hum elimination in ECG biomedical monitors, anti-whistle acoustic feedback traps.'
    },
    limitations: 'Requires high Q components to achieve narrow notch depth without broad passband attenuation.'
  }
];

/**
 * Singleton Registry Class for Dynamic Runtime Extension
 */
class CircuitKnowledgeRegistry {
  constructor() {
    this._registry = new Map();
    // Pre-populate with canonical built-in definitions
    for (const def of BUILT_IN_CIRCUITS) {
      this._registry.set(def.circuitType, def);
    }
  }

  /**
   * Registers a new custom circuit definition.
   */
  register(definition) {
    if (!definition || !definition.circuitType) {
      throw new Error("Invalid circuit definition: missing circuitType");
    }
    this._registry.set(definition.circuitType, {
      ...definition,
      isCustom: true
    });
  }

  /**
   * Retrieves definition for a given circuit type.
   */
  get(circuitType) {
    return this._registry.get(circuitType) || null;
  }

  /**
   * Retrieves all registered circuit definitions.
   */
  getAll() {
    return Array.from(this._registry.values());
  }

  /**
   * Filters definitions by category.
   */
  getByCategory(category) {
    return this.getAll().filter(d => d.category === category);
  }

  /**
   * Returns list of all supported circuit types.
   */
  getSupportedTypes() {
    return Array.from(this._registry.keys());
  }
}

// Global shared registry instance
export const circuitRegistry = new CircuitKnowledgeRegistry();
export default circuitRegistry;
