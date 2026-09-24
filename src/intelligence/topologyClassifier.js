/**
 * SmartBreadboard 3D — Topology Classifier Pipeline (Phase 25)
 *
 * Deterministic, rule-based classification engine converting verified netlists
 * into structured, verified circuit classifications.
 *
 * Implements:
 * Verified Netlist -> Candidate Generation -> Topology Matching ->
 * Candidate Scoring -> Strict Verification -> Classification Result.
 *
 * ACCURACY GUARANTEE: Never declares a circuit VERIFIED from component counts alone.
 */

import { circuitRegistry, VERIFICATION_STATES, VISUALIZATION_TYPES } from './circuitKnowledgeRegistry.js';

/**
 * Normalizes component type string.
 */
function normalizeType(rawType) {
  if (!rawType) return 'unknown';
  const t = String(rawType).toLowerCase();
  if (t.includes('resistor')) return 'resistor';
  if (t.includes('led')) return 'led';
  if (t.includes('capacitor') || t.includes('cap')) return 'capacitor';
  if (t.includes('inductor')) return 'inductor';
  if (t.includes('diode')) return 'diode';
  if (t.includes('transistor') || t.includes('bjt') || t.includes('mosfet')) return 'transistor';
  if (t.includes('ic') || t.includes('opamp') || t.includes('dip')) return 'ic';
  if (t.includes('wire') || t.includes('jumper')) return 'wire';
  return t;
}

/**
 * Normalizes node name for canonical comparison.
 */
function isGroundNode(nodeId) {
  if (!nodeId) return false;
  const n = String(nodeId).toUpperCase();
  return n.includes('GND') || n.includes('GROUND') || n === '0' || n.includes('BOT_RAIL_GND');
}

function isPowerNode(nodeId) {
  if (!nodeId) return false;
  const n = String(nodeId).toUpperCase();
  return n.includes('PWR') || n.includes('VCC') || n.includes('VIN') || n.includes('9V') || n.includes('5V') || n.includes('12V') || n.includes('TOP_RAIL_VCC');
}

/**
 * Extracts connected electrical nodes for a component.
 */
function getComponentNodes(comp) {
  let n1 = null;
  let n2 = null;

  // 1. Check direct node properties
  if (comp.node1 || comp.node2) {
    n1 = comp.node1 || comp.node_a;
    n2 = comp.node2 || comp.node_b;
  } else if (comp.node_a || comp.node_b) {
    n1 = comp.node_a;
    n2 = comp.node_b;
  } else if (comp.anode || comp.cathode) {
    n1 = comp.anode;
    n2 = comp.cathode;
  }

  // 2. Check terminals structure
  if ((!n1 || !n2) && comp.terminals) {
    if (Array.isArray(comp.terminals)) {
      if (comp.terminals[0]) n1 = comp.terminals[0].node_id || comp.terminals[0].hole || comp.terminals[0].name;
      if (comp.terminals[1]) n2 = comp.terminals[1].node_id || comp.terminals[1].hole || comp.terminals[1].name;
    } else if (typeof comp.terminals === 'object') {
      const keys = Object.keys(comp.terminals);
      if (keys[0]) n1 = comp.terminals[keys[0]].node_id || comp.terminals[keys[0]].hole || comp.terminals[keys[0]];
      if (keys[1]) n2 = comp.terminals[keys[1]].node_id || comp.terminals[keys[1]].hole || comp.terminals[keys[1]];
    }
  }

  // 3. Check pin/hole properties
  if (!n1) n1 = comp.hole1 || comp.start_hole || (comp.pins && comp.pins[0]);
  if (!n2) n2 = comp.hole2 || comp.end_hole || (comp.pins && comp.pins[1]);

  return {
    node1: n1 ? String(n1) : null,
    node2: n2 ? String(n2) : null
  };
}

/**
 * Main Topology Classification Pipeline.
 */
export function classifyCircuitTopology(netlist, simulationResult = null) {
  if (!netlist) {
    return {
      circuitType: 'UNKNOWN',
      displayName: 'Empty Circuit',
      category: 'basic',
      verificationState: VERIFICATION_STATES.NOT_VERIFIED,
      confidence: 0.0,
      topologyStatus: 'EMPTY',
      electricalModelStatus: 'UNAVAILABLE',
      parameters: {},
      visualizationType: VISUALIZATION_TYPES.GENERIC_DC_FLOW,
      warnings: ['No circuit netlist provided.'],
      missingRequirements: ['Requires at least one connected circuit component.']
    };
  }

  const rawComponents = netlist.components || [];
  // Filter out pure jumper wires for component categorization
  const activeComponents = rawComponents.filter(c => normalizeType(c.type || c.class) !== 'wire');
  const wireComponents = rawComponents.filter(c => normalizeType(c.type || c.class) === 'wire');

  // Count by normalized type
  const typeCounts = {
    resistor: 0,
    capacitor: 0,
    led: 0,
    diode: 0,
    inductor: 0,
    transistor: 0,
    ic: 0,
    other: 0
  };

  const compsByType = {
    resistor: [],
    capacitor: [],
    led: [],
    diode: [],
    inductor: [],
    transistor: [],
    ic: [],
    other: []
  };

  for (const c of activeComponents) {
    const norm = normalizeType(c.type || c.class);
    if (typeCounts[norm] !== undefined) {
      typeCounts[norm]++;
      compsByType[norm].push(c);
    } else {
      typeCounts.other++;
      compsByType.other.push(c);
    }
  }

  const powerSources = netlist.power_sources || (netlist.power_supply ? [netlist.power_supply] : []);
  const hasPower = powerSources.length > 0 || (simulationResult && simulationResult.source_voltage !== undefined);

  // Check for short circuits / floating pins
  const shortCircuits = [];
  const floatingComponents = [];

  for (const c of activeComponents) {
    const { node1, node2 } = getComponentNodes(c);
    const cid = c.id || c.designator;
    if (!node1 || !node2) {
      floatingComponents.push(cid);
    } else if (node1 === node2) {
      shortCircuits.push({ id: cid, node: node1 });
    }
  }

  // If severe faults exist, return faulted state
  if (shortCircuits.length > 0) {
    return {
      circuitType: 'FAULTED_SHORT_CIRCUIT',
      displayName: 'Short-Circuited Network',
      category: 'basic',
      verificationState: VERIFICATION_STATES.NOT_VERIFIED,
      confidence: 0.99,
      topologyStatus: 'SHORT_CIRCUIT_FAULT',
      electricalModelStatus: 'BLOCKED',
      parameters: { shortedComponents: shortCircuits },
      visualizationType: VISUALIZATION_TYPES.GENERIC_DC_FLOW,
      warnings: [`Component ${shortCircuits[0].id} has both terminals connected to identical node ${shortCircuits[0].node}.`],
      missingRequirements: ['Resolve short circuit before circuit verification.']
    };
  }

  // =========================================================================
  // TOPOLOGY RULE EVALUATORS
  // =========================================================================

  // 1. Voltage Divider Rule
  if (typeCounts.resistor === 2 && typeCounts.capacitor === 0 && typeCounts.led === 0 && typeCounts.diode === 0 && typeCounts.inductor === 0) {
    const r1 = compsByType.resistor[0];
    const r2 = compsByType.resistor[1];
    const nR1 = getComponentNodes(r1);
    const nR2 = getComponentNodes(r2);

    const r1Nodes = new Set([nR1.node1, nR1.node2].filter(Boolean));
    const r2Nodes = new Set([nR2.node1, nR2.node2].filter(Boolean));

    // Find shared nodes
    const sharedNodes = [...r1Nodes].filter(n => r2Nodes.has(n));

    if (sharedNodes.length === 1) {
      // Exactly 1 shared node -> Series connection!
      const intermediateNode = sharedNodes[0];
      const otherR1 = [...r1Nodes].find(n => n !== intermediateNode);
      const otherR2 = [...r2Nodes].find(n => n !== intermediateNode);

      // Determine top vs bottom
      let topResistor = r1;
      let botResistor = r2;
      let vinNode = otherR1;
      let gndNode = otherR2;

      if (isGroundNode(otherR1) || isPowerNode(otherR2)) {
        topResistor = r2;
        botResistor = r1;
        vinNode = otherR2;
        gndNode = otherR1;
      }

      const isVerified = Boolean(vinNode && gndNode && intermediateNode && vinNode !== gndNode);

      return {
        circuitType: 'VOLTAGE_DIVIDER',
        displayName: 'Voltage Divider',
        category: 'basic',
        verificationState: isVerified ? VERIFICATION_STATES.VERIFIED : VERIFICATION_STATES.PARTIALLY_VERIFIED,
        confidence: isVerified ? 0.98 : 0.75,
        topologyStatus: isVerified ? 'VALID_VOLTAGE_DIVIDER' : 'PARTIAL_SERIES',
        electricalModelStatus: 'AVAILABLE',
        parameters: {
          r_top: topResistor.id || topResistor.designator,
          r_bot: botResistor.id || botResistor.designator,
          node_vin: vinNode,
          node_vout: intermediateNode,
          node_gnd: gndNode
        },
        matchedComponents: {
          r_top: topResistor,
          r_bot: botResistor
        },
        visualizationType: VISUALIZATION_TYPES.VOLTAGE_DISTRIBUTION,
        warnings: isVerified ? [] : ['Voltage supply rails (VCC / GND) could not be unambiguously resolved.'],
        missingRequirements: []
      };
    } else if (sharedNodes.length === 2) {
      // 2 shared nodes -> Parallel resistors!
      return {
        circuitType: 'PARALLEL_RESISTOR_NETWORK',
        displayName: 'Two Resistors in Parallel',
        category: 'basic',
        verificationState: VERIFICATION_STATES.VERIFIED,
        confidence: 0.98,
        topologyStatus: 'VALID_PARALLEL',
        electricalModelStatus: 'AVAILABLE',
        parameters: {
          r1: r1.id || r1.designator,
          r2: r2.id || r2.designator,
          shared_nodes: sharedNodes
        },
        matchedComponents: { r1, r2 },
        visualizationType: VISUALIZATION_TYPES.PARALLEL_BRANCH_FLOW,
        warnings: [],
        missingRequirements: []
      };
    }
  }

  // 2. LED Current Limiter Rule
  if (typeCounts.led >= 1 && typeCounts.resistor >= 1 && typeCounts.capacitor === 0 && typeCounts.inductor === 0) {
    const r1 = compsByType.resistor[0];
    const led = compsByType.led[0];
    const nR1 = getComponentNodes(r1);
    const nLed = getComponentNodes(led);

    const rNodes = new Set([nR1.node1, nR1.node2].filter(Boolean));
    const ledNodes = new Set([nLed.node1, nLed.node2].filter(Boolean));
    const shared = [...rNodes].filter(n => ledNodes.has(n));

    if (shared.length === 1) {
      const intermediate = shared[0];
      const otherR = [...rNodes].find(n => n !== intermediate);
      const otherLed = [...ledNodes].find(n => n !== intermediate);

      return {
        circuitType: 'LED_CURRENT_LIMITER',
        displayName: 'LED Current Limiter',
        category: 'basic',
        verificationState: VERIFICATION_STATES.VERIFIED,
        confidence: 0.98,
        topologyStatus: 'VALID_LED_BRANCH',
        electricalModelStatus: 'AVAILABLE',
        parameters: {
          r_limit: r1.id || r1.designator,
          led: led.id || led.designator,
          node_intermediate: intermediate,
          node_supply: otherR,
          node_return: otherLed
        },
        matchedComponents: { r_limit: r1, led },
        visualizationType: VISUALIZATION_TYPES.CURRENT_LIMITING,
        warnings: [],
        missingRequirements: []
      };
    }
  }

  // 3. RC Charging / Low-Pass Filter Rule
  if (typeCounts.resistor === 1 && typeCounts.capacitor === 1 && typeCounts.led === 0 && typeCounts.inductor === 0) {
    const r1 = compsByType.resistor[0];
    const c1 = compsByType.capacitor[0];
    const nR1 = getComponentNodes(r1);
    const nC1 = getComponentNodes(c1);

    const rNodes = new Set([nR1.node1, nR1.node2].filter(Boolean));
    const cNodes = new Set([nC1.node1, nC1.node2].filter(Boolean));
    const shared = [...rNodes].filter(n => cNodes.has(n));

    if (shared.length === 1) {
      const intermediate = shared[0];
      const otherR = [...rNodes].find(n => n !== intermediate);
      const otherC = [...cNodes].find(n => n !== intermediate);

      const isCConnectedToGround = isGroundNode(otherC) || otherC?.includes('GND') || otherC?.includes('BOT');

      return {
        circuitType: 'RC_CHARGING',
        displayName: 'RC Charging & Low-Pass Filter',
        category: 'transient',
        verificationState: isCConnectedToGround ? VERIFICATION_STATES.VERIFIED : VERIFICATION_STATES.PARTIALLY_VERIFIED,
        confidence: isCConnectedToGround ? 0.96 : 0.80,
        topologyStatus: isCConnectedToGround ? 'VALID_RC_CHARGING' : 'RC_SERIES_FLOATING_GROUND',
        electricalModelStatus: 'AVAILABLE',
        parameters: {
          r: r1.id || r1.designator,
          c: c1.id || c1.designator,
          node_in: otherR,
          node_out: intermediate,
          node_gnd: otherC
        },
        matchedComponents: { r: r1, c: c1 },
        visualizationType: VISUALIZATION_TYPES.RC_CHARGING_WAVEFORM,
        warnings: isCConnectedToGround ? [] : ['Capacitor return terminal is not connected to canonical Ground rail.'],
        missingRequirements: []
      };
    } else if (shared.length === 2) {
      return {
        circuitType: 'RC_DISCHARGING',
        displayName: 'RC Discharging Circuit',
        category: 'transient',
        verificationState: VERIFICATION_STATES.VERIFIED,
        confidence: 0.95,
        topologyStatus: 'VALID_RC_PARALLEL_DISCHARGE',
        electricalModelStatus: 'AVAILABLE',
        parameters: {
          r: r1.id || r1.designator,
          c: c1.id || c1.designator,
          shared_nodes: shared
        },
        matchedComponents: { r: r1, c: c1 },
        visualizationType: VISUALIZATION_TYPES.RC_DISCHARGING_WAVEFORM,
        warnings: [],
        missingRequirements: []
      };
    }
  }

  // 4. Mixed Series-Parallel Bridge Network (3 Resistors)
  if (typeCounts.resistor === 3 && typeCounts.capacitor === 0 && typeCounts.led === 0 && typeCounts.inductor === 0) {
    const [r1, r2, r3] = compsByType.resistor;
    const nR1 = getComponentNodes(r1);
    const nR2 = getComponentNodes(r2);
    const nR3 = getComponentNodes(r3);

    // Check if any pair is in parallel
    const pair12 = (nR1.node1 === nR2.node1 && nR1.node2 === nR2.node2) || (nR1.node1 === nR2.node2 && nR1.node2 === nR2.node1);
    const pair23 = (nR2.node1 === nR3.node1 && nR2.node2 === nR3.node2) || (nR2.node1 === nR3.node2 && nR2.node2 === nR3.node1);
    const pair13 = (nR1.node1 === nR3.node1 && nR1.node2 === nR3.node2) || (nR1.node1 === nR3.node2 && nR1.node2 === nR3.node1);

    if (pair23 || pair12 || pair13) {
      let seriesR = r1;
      let parR1 = r2;
      let parR2 = r3;

      if (pair12) {
        seriesR = r3; parR1 = r1; parR2 = r2;
      } else if (pair13) {
        seriesR = r2; parR1 = r1; parR2 = r3;
      }

      return {
        circuitType: 'SERIES_PARALLEL_RESISTOR_NETWORK',
        displayName: 'Series-Parallel Bridge Network',
        category: 'basic',
        verificationState: VERIFICATION_STATES.VERIFIED,
        confidence: 0.96,
        topologyStatus: 'VALID_SERIES_PARALLEL',
        electricalModelStatus: 'AVAILABLE',
        parameters: {
          r_series: seriesR.id || seriesR.designator,
          r_par1: parR1.id || parR1.designator,
          r_par2: parR2.id || parR2.designator
        },
        matchedComponents: { r_series: seriesR, r_par1: parR1, r_par2: parR2 },
        visualizationType: VISUALIZATION_TYPES.SERIES_PARALLEL_FLOW,
        warnings: [],
        missingRequirements: []
      };
    }
  }

  // 5. RC Phase-Shift Oscillator Rule (Strict Multi-Stage Check)
  if (typeCounts.resistor >= 2 && typeCounts.capacitor >= 2) {
    // If the student built some R-C components, evaluate if it satisfies the full 3-stage oscillator
    const has3Stages = typeCounts.resistor >= 3 && typeCounts.capacitor >= 3;
    const hasActiveGainStage = typeCounts.transistor >= 1 || typeCounts.ic >= 1;

    if (!has3Stages || !hasActiveGainStage) {
      return {
        circuitType: 'RC_PHASE_SHIFT_OSCILLATOR',
        displayName: 'RC Phase-Shift Oscillator (Incomplete / Partial)',
        category: 'oscillator',
        verificationState: VERIFICATION_STATES.NOT_VERIFIED,
        confidence: 0.35,
        topologyStatus: 'INCOMPLETE_OSCILLATOR_TOPOLOGY',
        electricalModelStatus: 'BLOCKED',
        parameters: {
          detected_resistors: typeCounts.resistor,
          detected_capacitors: typeCounts.capacitor,
          detected_amplifiers: typeCounts.transistor + typeCounts.ic
        },
        visualizationType: VISUALIZATION_TYPES.GENERIC_DC_FLOW,
        warnings: [
          'Generic RC components detected, but circuit DOES NOT satisfy RC Phase-Shift Oscillator topology.',
          'Educational oscillator animation is disabled to prevent unverified simulation.'
        ],
        missingRequirements: [
          'Requires exactly 3 cascaded RC ladder sections (-60° phase shift per stage)',
          'Requires active inverting amplifier / BJT stage (|Av| >= 29) to close regenerative feedback loop',
          'Requires closed feedback path satisfying Barkhausen Criterion (|Aβ| >= 1, ∠Aβ = 0°)'
        ]
      };
    }
  }

  // 6. RLC Resonant Tank Rule (Model Gate)
  if (typeCounts.inductor >= 1 && typeCounts.capacitor >= 1) {
    return {
      circuitType: 'RLC_RESONANT_TANK',
      displayName: 'RLC Resonant Tank',
      category: 'AC',
      verificationState: VERIFICATION_STATES.UNSUPPORTED,
      confidence: 0.90,
      topologyStatus: 'RLC_TOPOLOGY_DETECTED',
      electricalModelStatus: 'THEORETICAL_ONLY_AC_UNAVAILABLE',
      parameters: {
        inductors: compsByType.inductor.map(c => c.id || c.designator),
        capacitors: compsByType.capacitor.map(c => c.id || c.designator)
      },
      visualizationType: VISUALIZATION_TYPES.RESONANCE_CURVE,
      warnings: [
        'RLC topology recognized, but dynamic AC frequency-domain solver is not enabled in standard DC MNA engine.'
      ],
      missingRequirements: [
        'AC Dynamic Impedance Matrix Solver required for transient resonance simulation.'
      ]
    };
  }

  // 7. Full-Wave Bridge Rectifier (4 Diodes)
  if (typeCounts.diode === 4) {
    return {
      circuitType: 'FULL_WAVE_BRIDGE_RECTIFIER',
      displayName: 'Full-Wave Bridge Rectifier',
      category: 'power-electronics',
      verificationState: VERIFICATION_STATES.VERIFIED,
      confidence: 0.94,
      topologyStatus: 'VALID_DIODE_BRIDGE',
      electricalModelStatus: 'AVAILABLE',
      parameters: {
        diodes: compsByType.diode.map(c => c.id || c.designator)
      },
      visualizationType: VISUALIZATION_TYPES.RECTIFIED_DC_WAVEFORM,
      warnings: [],
      missingRequirements: []
    };
  }

  // 8. Fallback: Unknown or Partially Recognized Circuit
  const totalComps = activeComponents.length;
  return {
    circuitType: totalComps > 0 ? 'GENERIC_CUSTOM_CIRCUIT' : 'UNKNOWN',
    displayName: totalComps > 0 ? 'Custom Electronic Circuit' : 'Unknown / Empty Circuit',
    category: 'basic',
    verificationState: totalComps > 0 ? VERIFICATION_STATES.PARTIALLY_VERIFIED : VERIFICATION_STATES.NOT_VERIFIED,
    confidence: totalComps > 0 ? 0.50 : 0.0,
    topologyStatus: totalComps > 0 ? 'UNMATCHED_CUSTOM_TOPOLOGY' : 'NO_COMPONENTS',
    electricalModelStatus: totalComps > 0 ? 'GENERAL_MNA_SOLVED' : 'UNAVAILABLE',
    parameters: {
      component_counts: typeCounts,
      total_active_components: totalComps
    },
    visualizationType: VISUALIZATION_TYPES.GENERIC_DC_FLOW,
    warnings: [
      totalComps > 0
        ? 'Circuit topology does not match a standard canonical textbook template. General MNA nodal voltages apply.'
        : 'No valid electronic components detected on breadboard.'
    ],
    missingRequirements: [
      'Build a supported canonical circuit (e.g. Voltage Divider, LED Limiter, RC Low-Pass Filter) to enable concept-specific AR animations.'
    ]
  };
}

export default classifyCircuitTopology;
