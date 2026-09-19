import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { mockCircuits } from '../data/mockCircuits';
import { demoCircuits } from '../data/demoCircuits';
import { requestDcSimulation } from '../services/analysisService';
import { parseComponentValue, formatEngineeringValue } from '../utils/valueParser';

const CircuitContext = createContext(null);
const MAX_HISTORY_LENGTH = 20;

export function CircuitProvider({ children }) {
  const [activeCircuit, setActiveCircuit] = useState(mockCircuits[0]);
  const [originalScannedCircuit, setOriginalScannedCircuit] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageMeta, setImageMeta] = useState(null);
  const [isAnalyzingReal, setIsAnalyzingReal] = useState(false);
  const [realAnalysisError, setRealAnalysisError] = useState(null);

  // View vs Edit Mode State
  const [isEditMode, setIsEditMode] = useState(false);

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

  // Normalized electrical simulation result & 3D Digital Twin payload
  const [simulationResult, setSimulationResult] = useState(null);
  const [measurements, setMeasurements] = useState({});
  const [solverStatus, setSolverStatus] = useState('IDLE'); // 'IDLE', 'SOLVED', 'ERROR', 'NOT_RUN', 'POWER_REQUIRED'
  const [solverError, setSolverError] = useState(null);

  // Selection & Net Highlight State (Single Source of Truth)
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [selectedNet, setSelectedNet] = useState(null);
  const [timeSeriesData, setTimeSeriesData] = useState([]);

  // Digital Circuit Modification History Stack (Undo / Redo)
  const [historyStack, setHistoryStack] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedoActionRef = useRef(false);

  // What-If Simulation State
  const [whatIfState, setWhatIfState] = useState({
    active: false,
    targetComponent: null,
    originalValue: '',
    candidateValue: '',
    originalSimulationResult: null,
    whatIfSimulationResult: null
  });

  // 1. Solve circuit whenever activeCircuit or simulationSource changes
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
        setSimulationResult(res);
        if (res.status === 'SOLVED' || res.solver_status === 'SOLVED' || res.success) {
          setMeasurements(res.measurements || {});
          setSolverStatus('SOLVED');
          setSolverError(null);
        } else if (res.solver_status === 'NOT_RUN' || res.status === 'NOT_RUN') {
          setMeasurements(res.measurements || {});
          setSolverStatus(res.error?.code === 'POWER_SOURCE_REQUIRED' ? 'POWER_REQUIRED' : 'NOT_RUN');
          setSolverError(res.error || { message: res.reason || 'Simulation not run' });
        } else if (res.error) {
          setSolverStatus(res.error.code === 'POWER_SOURCE_REQUIRED' ? 'POWER_REQUIRED' : 'ERROR');
          setSolverError(res.error);
        }
      }
    }
    runSolver();
    return () => { isMounted = false; };
  }, [activeCircuit, simulationSource]);

  // Push snapshot to undo history
  const pushHistorySnapshot = useCallback((circuitSnapshot) => {
    if (isUndoRedoActionRef.current) {
      isUndoRedoActionRef.current = false;
      return;
    }

    setHistoryStack(prevStack => {
      const nextStack = prevStack.slice(0, historyIndex + 1);
      nextStack.push(JSON.parse(JSON.stringify(circuitSnapshot)));
      if (nextStack.length > MAX_HISTORY_LENGTH) {
        nextStack.shift();
      }
      return nextStack;
    });

    setHistoryIndex(prev => Math.min(prev + 1, MAX_HISTORY_LENGTH - 1));
  }, [historyIndex]);

  // Set real circuit data from AI scanning
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
      wires: netlist.wires || [],
      power_sources: netlist.power_sources || [],
      validity: netlist.validity || { status: 'PASS', warnings: [] },
      solver_status: netlist.solver_status,
      solver_reason: netlist.solver_reason,
      detections: realData.detections || []
    };

    setActiveCircuit(formattedCircuit);
    setOriginalScannedCircuit(JSON.parse(JSON.stringify(formattedCircuit)));
    setHistoryStack([JSON.parse(JSON.stringify(formattedCircuit))]);
    setHistoryIndex(0);
    setSimulationSource(null);
    if (realData.electrical_analysis || realData.simulationResult || netlist.electrical_analysis) {
      setSimulationResult(realData.electrical_analysis || realData.simulationResult || netlist.electrical_analysis);
    }
  };

  const setMockCircuitData = (mockCirc) => {
    setActiveCircuit(mockCirc);
    setOriginalScannedCircuit(JSON.parse(JSON.stringify(mockCirc)));
    setHistoryStack([JSON.parse(JSON.stringify(mockCirc))]);
    setHistoryIndex(0);
    setUploadedImage(null);
    setImageMeta(null);
    setRealAnalysisError(null);
    setSimulationSource(null);
    setSimulationResult(null);
  };

  const loadDemoCircuit = (demoIndex = 0) => {
    const demo = demoCircuits[demoIndex] || demoCircuits[0];
    setActiveCircuit(demo);
    setOriginalScannedCircuit(JSON.parse(JSON.stringify(demo)));
    setHistoryStack([JSON.parse(JSON.stringify(demo))]);
    setHistoryIndex(0);
    setUploadedImage(null);
    setImageMeta(null);
    setRealAnalysisError(null);
    setSimulationSource(null);
    setSimulationResult(null);
  };

  // 2. Component Value Editing & Digital Modification
  const applyDigitalComponentValue = (compId, rawValue, rawUnit = 'Ω') => {
    if (!activeCircuit) return { success: false, error: 'No active circuit' };

    const targetComp = activeCircuit.components?.find(c => (c.id === compId || c.designator === compId));
    if (!targetComp) return { success: false, error: `Component ${compId} not found` };

    // Strict value parsing and validation
    const parsed = parseComponentValue(rawValue, targetComp.type || 'resistor');
    if (!parsed.isValid) {
      return { success: false, error: parsed.error || 'Invalid component value' };
    }

    const updatedComponents = activeCircuit.components.map(c => {
      if (c.id === compId || c.designator === compId) {
        return {
          ...c,
          value: parsed.siValue,
          unit: parsed.unit,
          displayValue: parsed.formatted,
          formatted_value: parsed.formatted,
          user_override_value: parsed.formatted,
          valueSource: 'user_confirmed',
          needsConfirmation: false,
          confidence: 1.0
        };
      }
      return c;
    });

    const newCircuit = {
      ...activeCircuit,
      components: updatedComponents
    };

    pushHistorySnapshot(newCircuit);
    setActiveCircuit(newCircuit);

    // Update selectedComponent if it matches
    if (selectedComponent && (selectedComponent.id === compId || selectedComponent.designator === compId)) {
      setSelectedComponent(prev => ({
        ...prev,
        value: parsed.siValue,
        unit: parsed.unit,
        displayValue: parsed.formatted,
        formatted_value: parsed.formatted,
        user_override_value: parsed.formatted
      }));
    }

    return { success: true, formatted: parsed.formatted };
  };

  // 3. Digital Wire Manipulation (Add / Remove Digital Jumper Wires)
  const addDigitalWire = (hole1, hole2) => {
    if (!activeCircuit || !hole1 || !hole2) return;

    const wireId = `W_DIGITAL_${Date.now().toString().slice(-4)}`;
    const newWire = {
      id: wireId,
      designator: wireId,
      type: 'wire',
      is_digital: true,
      hole1: hole1,
      hole2: hole2,
      start_hole: hole1,
      end_hole: hole2,
      node1: `NODE_HOLE_${hole1}`,
      node2: `NODE_HOLE_${hole2}`
    };

    const newWires = [...(activeCircuit.wires || []), newWire];
    const newCircuit = {
      ...activeCircuit,
      wires: newWires
    };

    pushHistorySnapshot(newCircuit);
    setActiveCircuit(newCircuit);
  };

  const removeDigitalWire = (wireId) => {
    if (!activeCircuit || !wireId) return;

    const newWires = (activeCircuit.wires || []).filter(w => w.id !== wireId && w.designator !== wireId);
    const newCircuit = {
      ...activeCircuit,
      wires: newWires
    };

    pushHistorySnapshot(newCircuit);
    setActiveCircuit(newCircuit);
  };

  // 4. Undo / Redo / Reset Functions
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < historyStack.length - 1;

  const undoDigitalEdit = () => {
    if (!canUndo) return;
    const targetIdx = historyIndex - 1;
    const snapshot = historyStack[targetIdx];
    if (snapshot) {
      isUndoRedoActionRef.current = true;
      setHistoryIndex(targetIdx);
      setActiveCircuit(JSON.parse(JSON.stringify(snapshot)));
    }
  };

  const redoDigitalEdit = () => {
    if (!canRedo) return;
    const targetIdx = historyIndex + 1;
    const snapshot = historyStack[targetIdx];
    if (snapshot) {
      isUndoRedoActionRef.current = true;
      setHistoryIndex(targetIdx);
      setActiveCircuit(JSON.parse(JSON.stringify(snapshot)));
    }
  };

  const resetDigitalChanges = () => {
    if (originalScannedCircuit) {
      const resetSnapshot = JSON.parse(JSON.stringify(originalScannedCircuit));
      pushHistorySnapshot(resetSnapshot);
      setActiveCircuit(resetSnapshot);
      setSelectedComponent(null);
      setSelectedNet(null);
    }
  };

  // 5. What-If Simulation Engine
  const startWhatIf = async (targetComp, candidateVal) => {
    if (!activeCircuit || !targetComp) return;

    const parsed = parseComponentValue(candidateVal, targetComp.type || 'resistor');
    if (!parsed.isValid) return;

    const originalVal = targetComp.user_override_value || targetComp.displayValue || targetComp.formatted_value || `${targetComp.value} ${targetComp.unit || 'Ω'}`;

    // Clone circuit and apply candidate value for What-If
    const whatIfComponents = activeCircuit.components.map(c => {
      if (c.id === targetComp.id || c.designator === targetComp.designator) {
        return {
          ...c,
          value: parsed.siValue,
          unit: parsed.unit,
          displayValue: parsed.formatted,
          formatted_value: parsed.formatted,
          user_override_value: parsed.formatted
        };
      }
      return c;
    });

    const whatIfCircuit = {
      ...activeCircuit,
      components: whatIfComponents
    };

    // Run simulation for What-If without overwriting authoritative simulationResult
    const whatIfRes = await requestDcSimulation(whatIfCircuit);

    setWhatIfState({
      active: true,
      targetComponent: targetComp,
      originalValue: originalVal,
      candidateValue: parsed.formatted,
      originalSimulationResult: simulationResult,
      whatIfSimulationResult: whatIfRes
    });
  };

  const applyWhatIfToCircuit = () => {
    if (!whatIfState.active || !whatIfState.targetComponent) return;

    applyDigitalComponentValue(
      whatIfState.targetComponent.id || whatIfState.targetComponent.designator,
      whatIfState.candidateValue
    );

    setWhatIfState({
      active: false,
      targetComponent: null,
      originalValue: '',
      candidateValue: '',
      originalSimulationResult: null,
      whatIfSimulationResult: null
    });
  };

  const cancelWhatIf = () => {
    setWhatIfState({
      active: false,
      targetComponent: null,
      originalValue: '',
      candidateValue: '',
      originalSimulationResult: null,
      whatIfSimulationResult: null
    });
  };

  // 6. Net Selection & Highlighting
  const selectNet = (netId) => {
    setSelectedNet(prev => (prev === netId ? null : netId));
  };

  // 7. Versioned Save / Load Digital Circuit Schema
  const exportDigitalCircuitJson = () => {
    if (!activeCircuit) return null;

    const schema = {
      schema_version: 1,
      project: "SmartBreadboard3D",
      created_at: new Date().toISOString(),
      circuit_id: activeCircuit.id || 'circ_custom',
      metadata: activeCircuit.metadata || { source: 'digital_export' },
      power_sources: activeCircuit.power_sources || [],
      simulation_source: simulationSource,
      components: (activeCircuit.components || []).map(c => ({
        id: c.id,
        designator: c.designator,
        type: c.type,
        value: c.value,
        unit: c.unit,
        formatted_value: c.formatted_value || c.displayValue,
        user_override_value: c.user_override_value,
        hole1: c.hole1 || c.start_hole,
        hole2: c.hole2 || c.end_hole,
        node1: c.node1,
        node2: c.node2,
        is_digital: c.is_digital || false
      })),
      wires: activeCircuit.wires || []
    };

    return JSON.stringify(schema, null, 2);
  };

  const importDigitalCircuitJson = (jsonStringOrObj) => {
    try {
      const data = typeof jsonStringOrObj === 'string' ? JSON.parse(jsonStringOrObj) : jsonStringOrObj;
      if (!data || !data.components) {
        return { success: false, error: 'Invalid circuit file format: missing components' };
      }

      const importedCircuit = {
        id: data.circuit_id || 'circ_imported',
        name: data.project ? `Imported (${data.project})` : 'Imported Circuit',
        source: 'imported',
        metadata: data.metadata || { source: 'imported', created_at: new Date().toISOString() },
        nodes: data.nodes || [],
        nets: data.nets || [],
        components: data.components || [],
        wires: data.wires || [],
        power_sources: data.power_sources || [],
        validity: { status: 'PASS', warnings: [] }
      };

      setActiveCircuit(importedCircuit);
      setOriginalScannedCircuit(JSON.parse(JSON.stringify(importedCircuit)));
      pushHistorySnapshot(importedCircuit);
      if (data.simulation_source) {
        setSimulationSource(data.simulation_source);
      }
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
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

  return (
    <CircuitContext.Provider value={{
      activeCircuit,
      setActiveCircuit,
      originalScannedCircuit,
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
      isEditMode,
      setIsEditMode,
      applyDigitalComponentValue,
      addDigitalWire,
      removeDigitalWire,
      undoDigitalEdit,
      redoDigitalEdit,
      resetDigitalChanges,
      canUndo,
      canRedo,
      whatIfState,
      startWhatIf,
      applyWhatIfToCircuit,
      cancelWhatIf,
      selectedNet,
      selectNet,
      exportDigitalCircuitJson,
      importDigitalCircuitJson,
      simulationSource,
      applySimulationPower,
      resetSimulationPower,
      simulation,
      setSimulation,
      simulationResult,
      setSimulationResult,
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
