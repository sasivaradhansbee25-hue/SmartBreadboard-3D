import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { CircuitProvider } from './context/CircuitContext';

import Home from './pages/Home';
import Scanner from './pages/Scanner';
import Analysis from './pages/Analysis';
import Simulator from './pages/Simulator';
import Calculator from './pages/Calculator';
import Results from './pages/Results';
import Learn from './pages/Learn';

export default function App() {
  return (
    <CircuitProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/results" element={<Results />} />
            <Route path="/learn" element={<Learn />} />
          </Routes>
        </Layout>
      </Router>
    </CircuitProvider>
  );
}
