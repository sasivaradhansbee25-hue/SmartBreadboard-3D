// Circuit Analysis & Solver Service Abstraction Layer
// Decouples calculation triggers from UI component code per AGENTS.md

import { apiRequest } from './api';
import { solveNodeToNodeResistance } from '../utils/circuitSolver';
import { calculateParallelCapacitance, calculateSeriesCapacitance } from '../utils/capacitanceEngine';

export async function requestEquivalentResistance(circuit, nodeA, nodeB) {
  const apiRes = await apiRequest('/calculate/resistance', 'POST', {
    circuit_id: circuit.id,
    node_a_id: nodeA,
    node_b_id: nodeB
  });

  if (apiRes && apiRes.equivalent_resistance_ohms) {
    return apiRes;
  }

  // Local solver fallback
  const localRes = solveNodeToNodeResistance(circuit, nodeA, nodeB);
  return {
    equivalent_resistance_ohms: localRes.equivalentOhms,
    equivalent_resistance_formatted: localRes.formatted,
    steps: localRes.steps,
    source: 'mock'
  };
}

export async function requestEquivalentCapacitance(circuit, isParallel = true) {
  const capsFarads = circuit.components
    .filter(c => c.type.includes('Capacitor'))
    .map(c => 100e-9);

  const localRes = isParallel 
    ? calculateParallelCapacitance(capsFarads)
    : calculateSeriesCapacitance(capsFarads);

  return {
    equivalent_capacitance_farads: localRes.totalFarads,
    equivalent_capacitance_formatted: localRes.formatted,
    source: 'mock'
  };
}

export async function requestDcSimulation(circuit) {
  return {
    source: 'mock',
    circuit_id: circuit.id,
    power_supply: circuit.power_supply,
    readings: circuit.readings,
    led_state: 'ON (Glow 2.1V Forward Drop)',
    validity: 'PASS'
  };
}
