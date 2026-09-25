/**
 * SmartBreadboard 3D — AC Analysis Service (Phase 26 & 27)
 *
 * Consumes backend Complex MNA endpoints with seamless client-side offline fallback.
 * Scientific Integrity: is_measured is strictly false, source is 'mna_simulation'.
 */

import { apiRequest } from './api.js';
import { analyzeClientGeneralizedAcCircuit } from '../intelligence/acAnalysisEngine.js';

export async function requestAcAnalysis(netlist, analysisOptions = {}) {
  const payload = {
    netlist,
    analysis: {
      start_frequency_hz: analysisOptions.startFrequency || 10.0,
      stop_frequency_hz: analysisOptions.stopFrequency || 100000.0,
      points: analysisOptions.points || 80,
      sweep_type: analysisOptions.sweepType || 'log',
      topology_type: analysisOptions.topologyType || 'series'
    },
    response: {
      input_node: analysisOptions.inputNode || null,
      output_node: analysisOptions.outputNode || null
    }
  };

  try {
    const res = await apiRequest('/ac/analyze', 'POST', payload);
    if (res && res.status === 'success') {
      return {
        ...res,
        source: 'mna_simulation',
        is_measured: false
      };
    }
  } catch (err) {
    // Graceful offline fallback using deterministic client-side AC engine
  }

  // Client-Side Deterministic Complex MNA Fallback
  const clientRes = analyzeClientGeneralizedAcCircuit(netlist, {
    startFrequency: payload.analysis.start_frequency_hz,
    stopFrequency: payload.analysis.stop_frequency_hz,
    points: payload.analysis.points,
    sweepType: payload.analysis.sweep_type,
    topologyType: payload.analysis.topology_type,
    inputNode: payload.response.input_node,
    outputNode: payload.response.output_node
  });

  return {
    status: 'success',
    analysis_type: 'AC_FREQUENCY_DOMAIN',
    circuit_type: clientRes.behavior || 'AC_GENERAL_NETWORK',
    behavior: clientRes.behavior,
    primary_candidate: clientRes.primaryCandidate,
    frequency_response: clientRes.frequencyResponse,
    shape_analysis: clientRes.shapeAnalysis,
    cutoff: clientRes.cutoff,
    resonance: clientRes.resonance,
    sweep: clientRes.sweep,
    source: 'mna_simulation',
    is_measured: false
  };
}
