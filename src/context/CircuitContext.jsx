import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockCircuits } from '../data/mockCircuits';
import { demoCircuits } from '../data/demoCircuits';
import { requestDcSimulation } from '../services/analysisService';

const CircuitContext = createContext(null);

export function CircuitProvider({ children }) {
  const [activeCircuit, setActiveCircuit] = useState(mockCircuits[0]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageMeta, setImageMeta] = useState(null);
  const [isAnalyzingReal, setIsAnalyzingReal] = useState(false);
  const [realAnalysisError, setRealAnalysisError] = useState(null);

  // Electrical Solver & Simulation Extensions
  const [simulation, setSimulation] = useState({
    mode: 'dc',
    running: false,
    time: 0,
    timestep: 0.001,
    speed: 1.0
  });

  // User-supplied simulation power source state
  const [simulationSource, setSimulationSource] = useState(null); // { type, value, unit, positiveNode, negativeNode, source: 'user_simulated' }

  const [measurements, setMeasurements] = useState({});
  const [solverStatus, setSolverStatus] = useState('IDLE'); // 'IDLE', 'SOLVED', 'ERROR', 'INPUT_REQUIRED', 'POWER_REQUIRED'
  const [solverError, setSolverError] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [timeSeriesData, setTimeSeriesData] = useState([]);

  // Solve circuit whenever activeCircuit or simulationSource changes
  useEffect(() => {
    let isMounted = true;
    async function runSolver() {
      if (!activeCircuit) return;

      // Construct combined netlist with active or simulated power source
      const currentSources = [...(activeCircuit.power_sources || [])];
      if (simulationSource) {
        currentSources.push({
          id: "V_SIMULATED",
          type: simulationSource.type || "dc_voltage",
          voltage: parseFloat(simulationSource.value || 12.0),
          positive_node: simulationSource.positiveNode,
          negative_node: simulationSource.negativeNode,
          source: simulationSource.source || "user_simulated"
        });
      }

      const netlistToSolve = {
        ...activeCircuit,
        power_sources: currentSources
      };

      const res = await requestDcSimulation(netlistToSolve);
      if (isMounted && res) {
        if (res.status === 'SOLVED' || res.success) {
          setMeasurements(res.measurements || {});
          setSolverStatus('SOLVED');
          setSolverError(null);
        } else if (res.error) {
          setSolverStatus(res.error.code === 'POWER_SOURCE_REQUIRED' ? 'POWER_REQUIRED' : 'ERROR');
          setSolverError(res.error);
        }
      }
    }
    runSolver();
    return () => { isMounted = false; };
  }, [activeCircuit, simulationSource]);

  const setRealCircuitData = (realData) => {
    if (realData.imageMeta) {
      setImageMeta(realData.imageMeta);
    }
    if (realData.originalImage) {
      setUploadedImage(realData.originalImage);
    }

    const netlist = realData.netlist || {};
    const components = netlist.components || realData.mapped_components || [];
    
    const formattedCircuit = {
      id: netlist.circuit_id || 'circ_real_detected',
      name: 'Real AI Scanned Circuit',
      source: 'real',
      metadata: netlist.metadata || { source: 'real', created_at: new Date().toISOString() },
      nodes: netlist.nodes || [],
      nets: netlist.nets || [],
      nets_summary: netlist.nets_summary || [],
      components: components,
      power_sources: netlist.power_sources || [],
      validity: netlist.validity || { status: 'PASS', warnings: [] },
      detections: realData.detections || []
    };

    setActiveCircuit(formattedCircuit);
    setSimulationSource(null);
  };

  const setMockCircuitData = (mockCirc) => {
    setActiveCircuit(mockCirc);
    setUploadedImage(null);
    setImageMeta(null);
    setRealAnalysisError(null);
    setSimulationSource(null);
  };

  const loadDemoCircuit = (demoIndex = 0) => {
    const demo = demoCircuits[demoIndex] || demoCircuits[0];
    setActiveCircuit(demo);
    setUploadedImage(null);
    setImageMeta(null);
    setRealAnalysisError(null);
    setSimulationSource(null);
  };

  const applySimulationPower = (sourceObj) => {
    setSimulationSource({
      type: sourceObj.type || "dc_voltage",
      value: parseFloat(sourceObj.voltage || sourceObj.value || 12.0),
      unit: sourceObj.unit || "V",
      positiveNode: sourceObj.positiveNode,
      negativeNode: sourceObj.negativeNode,
      source: "user_simulated"
    });
  };

  const resetSimulationPower = () => {
    setSimulationSource(null);
    setSimulation(prev => ({ ...prev, running: false, time: 0 }));
    setTimeSeriesData([]);
  };

  const updateComponentValue = (compId, newValue, newUnit = "Ω") => {
    if (!activeCircuit) return;

    let numVal = parseFloat(newValue);
    if (isNaN(numVal)) numVal = 1000;

    let multiplier = 1.0;
    const u = (newUnit || '').trim();
    if (u === 'kΩ') multiplier = 1e3;
    else if (u === 'MΩ') multiplier = 1e6;
    else if (u === 'mF') multiplier = 1e-3;
    else if (u === 'µF' || u === 'uF') multiplier = 1e-6;
    else if (u === 'nF') multiplier = 1e-9;
    else if (u === 'pF') multiplier = 1e-12;
    else if (u === 'mH') multiplier = 1e-3;
    else if (u === 'µH' || u === 'uH') multiplier = 1e-6;

    const siVal = numVal * multiplier;
    const displayFmt = `${newValue} ${newUnit}`;

    const updatedComponents = activeCircuit.components.map(c => {
      if (c.id === compId || c.designator === compId) {
        return {
          ...c,
          value: siVal,
          unit: newUnit,
          displayValue: displayFmt,
          formatted_value: displayFmt,
          user_override_value: displayFmt,
          valueSource: 'user_confirmed',
          needsConfirmation: false,
          confidence: 1.0
        };
      }
      return c;
    });

    setActiveCircuit({
      ...activeCircuit,
      components: updatedComponents
    });
  };


  const updateComponentTerminals = (compId, newHole1, newHole2) => {
    if (!activeCircuit) return;

    const updatedComponents = activeCircuit.components.map(c => {
      if (c.id === compId || c.designator === compId) {
        return {
          ...c,
          hole1: newHole1,
          hole2: newHole2,
          start_hole: newHole1,
          end_hole: newHole2,
          node1: `NODE_HOLE_${newHole1}`,
          node2: `NODE_HOLE_${newHole2}`
        };
      }
      return c;
    });

    setActiveCircuit({
      ...activeCircuit,
      components: updatedComponents
    });
  };

  return (
    <CircuitContext.Provider value={{
      activeCircuit,
      setActiveCircuit,
      uploadedImage,
      setUploadedImage,
      imageMeta,
      setImageMeta,
      isAnalyzingReal,
      setIsAnalyzingReal,
      realAnalysisError,
      setRealAnalysisError,
      setRealCircuitData,
      setMockCircuitData,
      loadDemoCircuit,
      updateComponentValue,
      updateComponentTerminals,
      simulationSource,
      applySimulationPower,
      resetSimulationPower,
      simulation,
      setSimulation,
      measurements,
      setMeasurements,
      solverStatus,
      setSolverStatus,
      solverError,
      setSolverError,
      selectedComponent,
      setSelectedComponent,
      timeSeriesData,
      setTimeSeriesData
    }}>
      {children}
    </CircuitContext.Provider>
  );
}

export function useCircuit() {
  const context = useContext(CircuitContext);
  if (!context) {
    throw new Error('useCircuit must be used within a CircuitProvider');
  }
  return context;
}
