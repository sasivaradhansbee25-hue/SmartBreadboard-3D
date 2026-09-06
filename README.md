# SmartBreadboard 3D — AI Electronics Learning & Circuit Analysis Platform

SmartBreadboard 3D turns physical breadboard circuit photos into interactive 3D simulations with node-to-node electrical analysis, 2D/3D breadboard canvas rendering, and electronics calculation tools.

---

## Key Features

1. **7 Core Routable Workstation Pages**:
   - **Home (`/`)**: Overview dashboard, quick metrics, featured sample circuits.
   - **Scanner (`/scanner`)**: Breadboard photo scan simulator & image uploader.
   - **Analysis (`/analysis`)**: Interactive 2D schematic renderer, SPICE netlist inspector, and node-to-node equivalent resistance solver (\(R_{AB}\)).
   - **Simulator (`/simulator`)**: Interactive 2D SVG tie-point breadboard workspace, 2D IEEE schematic graph, and Three.js 3D WebGL viewport.
   - **Calculator (`/calculator`)**: 5-Tab suite (4/5-band resistor color decoder, SMD resistor lookup, capacitor code & C-solver, series/parallel R-solver, 4-variable Ohm's law wheel, and LED power limiter).
   - **Results (`/results`)**: Diagnostic reports with visual error classification (Warnings ⚠ vs Errors ❌), Modified Nodal Analysis (MNA) matrix readouts, and JSON export.
   - **Learn (`/learn`)**: Electronics learning hub with tutorial drawers, guided circuit building exercises with pin validation, component cheat sheets, and breadboard pinout reference.

2. **Strict Rule Compliance (`AGENTS.md`)**:
   - **Mock Source Tagging**: Every mock output tagged with `"source": "mock"` and visible "Mock Analysis" badges.
   - **Separated Overrides**: `detected_value` and `user_override_value` stored and rendered as separate fields.
   - **Standalone Engines**: Resistance and Capacitance engines built as isolated modules to enforce inverse reduction rules (Rule 4).
   - **Service Layer Abstraction**: Data access decoupled behind `src/services/` (`api.js`, `circuitService.js`, `analysisService.js`).

3. **5 Pre-Packaged Sample Circuits (`SPEC.md §14`)**:
   1. `5V -> R1 -> LED -> GND` (basic single branch)
   2. `Two resistors in series` (\(R_1 + R_2\))
   3. `Two resistors in parallel` (\(R_1 \parallel R_2\))
   4. `Mixed resistor network` (multi-branch bridge topology)
   5. `Resistors + capacitors combined` (RC low-pass filter)

---

## Project Structure

```
CIRCUIT STIMULATOR/
├── backend/
│   ├── api/             # FastAPI APIRouters (calculate.py, analyze.py, etc.)
│   ├── core/            # Circuit models, MNA resistance & capacitance engines
│   ├── cv/              # OpenCV & YOLO detection module stubs (Phase 9+)
│   ├── mock/            # Mock circuit dataset (mock_circuits.py)
│   ├── main.py          # FastAPI application server entry point
│   └── requirements.txt # Python dependencies
├── public/              # Static assets (favicon.svg)
├── src/
│   ├── components/      # Reusable UI, Navbar, Footer, 2D & 3D Renderers
│   ├── data/            # Centralized mock circuits dataset (mockCircuits.js)
│   ├── pages/           # 7 Routable workstation page views
│   ├── services/        # Service abstraction layer (api.js, circuitService.js)
│   ├── styles/          # Electronics lab dark theme design system
│   ├── utils/           # Resistance, Capacitance, Circuit Solver, Validity engines
│   ├── App.jsx          # React Router setup
│   └── main.jsx         # React DOM entry point
├── AGENTS.md            # Persistent engineering rules
├── SPEC.md              # Full product specification
├── package.json
└── vite.config.js
```

---

## Running the Application

### 1. Running the Frontend (Vite + React)

```bash
# Navigate to project root
cd "e:\CIRCUIT STIMULATOR"

# Install dependencies
npm install

# Start Vite Dev Server
npm run dev
```
Open your browser at `http://127.0.0.1:5173/`.

### 2. Running the Backend Server (FastAPI + Python)

```bash
# Navigate to backend directory
cd "e:\CIRCUIT STIMULATOR\backend"

# Install Python dependencies
pip install -r requirements.txt

# Launch FastAPI development server
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
Interactive API Documentation will be available at `http://127.0.0.1:8000/docs`.

---

## Build Verification

To verify the production build for frontend deployment:

```bash
npm run build
```
The compiled bundle will be generated in `dist/` with zero errors.
