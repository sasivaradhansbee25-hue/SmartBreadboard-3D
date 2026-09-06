# AGENTS.md — SmartBreadboard 3D persistent rules

## Identity
This project is SmartBreadboard 3D: an engineering/education tool that turns
a photo of a physical breadboard circuit into an interactive 3D simulation
with node-to-node resistance/capacitance calculation. It is NOT a toy demo.

## Hard rules — never violate these
1. Never fake AI/CV detection. Any component/resistor/breadboard detection
   that isn't backed by a real trained model MUST come from a clearly
   labeled mock source (`"source": "mock"` in every mock API response, and
   a visible "Mock Analysis" badge in any UI that displays mock results).
2. Never implement Phase N+1 work while Phase N is still unverified. Stop
   and wait for explicit human confirmation between phases (see SPEC.md §15).
3. Keep these seven modules independent — no module may import internals
   from another; they only talk through the shared Circuit Data Model
   (SPEC.md §9) or the API contract (SPEC.md §10):
   Frontend UI, Webcam, AI Detection, Circuit Data Model, 3D Renderer,
   Circuit Solver (resistance), Capacitance Solver, Simulation Engine.
4. Resistance and capacitance calculation are SEPARATE modules. Do not
   share reduction logic between them — series/parallel combination rules
   are inverse between R and C, sharing code here is a correctness bug.
5. Automatic detection output and manual user correction are stored as
   separate fields (`detected_value` vs `user_override_value`). Never let
   a manual correction silently overwrite the detected value.
6. No dead UI: every button either works or is visibly disabled with a
   "coming soon" tooltip. No lorem ipsum. No placeholder routes that 404.
7. Desktop-first, but Home/Learn/Results must be usable on mobile widths.

## Tech stack (do not substitute without asking)
- Frontend: React + JavaScript (not TypeScript unless asked), Vite, Three.js
  / React Three Fiber, plain CSS (no CSS-in-JS framework unless asked).
- Backend: Python, FastAPI.
- CV/AI (Phase 9+ only): OpenCV, YOLO.
- No database in this prototype. Data access must be abstracted behind a
  service layer so Postgres/Firebase can be added later without touching
  business logic or component code.

## Verification requirement (per Antigravity best practice)
Before marking any phase complete:
- Frontend changes: run `npm run dev`, use the browser tool to click
  through the affected flow, and report what you observed — do not just
  assert it works.
- Backend changes: run `uvicorn main:app --reload` and hit the affected
  endpoint(s) with curl or the browser tool, show the actual response.
- If a test suite exists for the touched module, run it and paste the
  result before claiming the phase is done.

## Source of truth
SPEC.md in this repo root is the full product specification: page-by-page
behavior, the shared Circuit Data Model JSON shape, the FastAPI endpoint
contract, the resistance/capacitance engine requirements, the mock circuit
set, and the 15-phase build order. Re-read the relevant section of SPEC.md
before starting each new phase — do not rely on memory of earlier context.
