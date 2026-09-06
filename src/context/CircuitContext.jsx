import React, { createContext, useContext, useState } from 'react';
import { mockCircuits } from '../data/mockCircuits';

const CircuitContext = createContext(null);

export function CircuitProvider({ children }) {
  const [activeCircuit, setActiveCircuit] = useState(mockCircuits[0]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageMeta, setImageMeta] = useState(null); // { origW, origH, procW, procH }
  const [isAnalyzingReal, setIsAnalyzingReal] = useState(false);
  const [realAnalysisError, setRealAnalysisError] = useState(null);

  const setRealCircuitData = (realData) => {
    // realData: { originalImage, detections, mapped_components, netlist, source: "real", imageMeta }
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

    console.log("==================================================");
    console.log("YOLO COMPONENTS:", realData.detections);
    console.log("NETLIST COMPONENTS:", components);
    console.log("CONTEXT COMPONENTS:", formattedCircuit.components);
    console.log("==================================================");

    setActiveCircuit(formattedCircuit);
  };

  const setMockCircuitData = (mockCirc) => {
    setActiveCircuit(mockCirc);
    setUploadedImage(null);
    setImageMeta(null);
    setRealAnalysisError(null);
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
      setMockCircuitData
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
