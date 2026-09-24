/**
 * SmartBreadboard 3D — AC Analysis Service (Phase 26)
 *
 * Consumes backend Complex MNA endpoints with seamless client-side offline fallback.
 */

import { apiRequest } from './api.js';
import { runClientFrequencySweep, analyzeClientResonance } from '../intelligence/acAnalysisEngine.js';

export async function requestAcAnalysis(netlist, analysisOptions = {}) {
  const payload = {
    netlist,
    analysis: {
      start_frequency_hz: analysisOptions.startFrequency || 10.0,
      stop_frequency_hz: analysisOptions.stopFrequency || 100000.0,
      points: analysisOptions.points || 80,
      sweep_type: analysisOptions.sweepType || 'log',
      topology_type: analysisOptions.topologyType || 'series'
    }
  };

  try {
    const res = await apiRequest('/ac/analyze', 'POST', payload);
    if (res && res.status === 'success') {
      return res;
    }
  } catch (err) {
    // Graceful offline fallback using deterministic client-side AC engine
  }

  // Client-Side Deterministic Complex MNA Fallback
  const sweep = runClientFrequencySweep(
    netlist,
    payload.analysis.start_frequency_hz,
    payload.analysis.stop_frequency_hz,
    payload.analysis.points,
    payload.analysis.sweep_type
  );

  const isParallel = payload.analysis.topology_type === 'parallel';
  const resonance = analyzeClientResonance(sweep, isParallel);

  return {
    status: 'success',
    analysis_type: 'AC_FREQUENCY_DOMAIN',
    circuit_type: resonance.resonanceDetected ? 'RLC_RESONANCE' : 'AC_GENERAL_NETWORK',
    sweep,
    resonance,
    source: 'mna_simulation',
    is_measured: false
  };
}
