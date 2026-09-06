# SmartBreadboard 3D — Product Specification

## 1. Executive Summary
SmartBreadboard 3D is an AI-powered electronics learning and circuit-analysis platform. It enables students, engineers, and hobbyists to scan physical breadboards, reconstruct circuit schematics in 3D/2D, simulate electrical behavior, calculate component values, and learn foundational electronics.

## 2. Core Modules & Pages (7 Pages)
1. **Home (`/`)**: Overview dashboard, quick action cards, platform feature highlights, hardware status overview shell.
2. **Scanner (`/scanner`)**: Breadboard image/video scan input interface shell (webcam preview container stub, upload zone).
3. **Analysis (`/analysis`)**: Circuit schematic analyzer view shell, component netlist inspector layout stub.
4. **Simulator (`/simulator`)**: 3D & 2D breadboard simulation workspace view shell with control toolbar stub.
5. **Calculator (`/calculator`)**: Suite of electronic calculators (Resistor Color Codes, Ohm's Law, LED Resistor, Capacitor Codes).
6. **Results (`/results`)**: Scan diagnostic reports, node voltages, test point logs, and safety check stub.
7. **Learn (`/learn`)**: Electronics learning modules, interactive tutorials, component reference library stub.

## 12. Project Folder Structure (§12)
```
CIRCUIT STIMULATOR/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── Layout.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Scanner.jsx
│   │   ├── Analysis.jsx
│   │   ├── Simulator.jsx
│   │   ├── Calculator.jsx
│   │   ├── Results.jsx
│   │   └── Learn.jsx
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── AGENTS.md
└── SPEC.md
```

## 15. Implementation Phase Plan (§15)
- **Phase 1 (Current Scope)**: Complete React UI + navigation, all 7 pages scaffolded and routable.
- **Phase 2**: UI layout enrichment & static mockup details.
- **Phase 3**: Electronics Calculator engine & interactive tools.
- **Phase 4**: 2D Schematic Renderer.
- **Phase 5**: 3D Interactive Three.js breadboard environment.
- **Phase 6**: SPICE/MNA Circuit Solver Engine integration.
- **Phase 7**: Comprehensive Results & Diagnostic Reports.
- **Phase 8**: Interactive Learning & Tutorial engine.
- **Phase 9+**: Computer Vision (CV) & AI Breadboard detection algorithms (`cv/`, `ai/`).
