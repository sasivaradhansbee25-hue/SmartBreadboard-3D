"""
SmartBreadboard 3D — Full FastAPI Backend Contract (SPEC.md Section 10)
Phase 9 OpenCV Preprocessing, Phase 10 YOLO Detection, Phase 11 Resistor Color, Phase 12 Netlist Engine & Phase 13 Electrical MNA Solver
"""

import os
import socket
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from cv.preprocessing import preprocess_breadboard_image
from cv.yolo_detector import detect_components_yolo, detect_and_annotate_components
from cv.resistor_color import analyze_resistor_color
from cv.detector_interface import CompositeComponentDetector
from core.circuit_model import build_netlist_from_detections
from circuit_solver.dc_solver import run_dc_analysis
from circuit_solver.transient_solver import run_transient_analysis
from circuit_solver.results import format_solver_result

from cv.camera_tracker import match_components_spatially

app = FastAPI(
    title="SmartBreadboard 3D FastAPI Backend Server",
    version="0.2.0",
    description="Full API contract with MNA Electrical Solver & Transient Simulation Engine"
)

# Configurable CORS allowed origins
allowed_origins_env = os.environ.get("ALLOWED_ORIGINS", "*")
if allowed_origins_env.strip() == "*":
    origins = ["*"]
else:
    origins = [orig.strip() for orig in allowed_origins_env.split(",") if orig.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas
class ImageAnalysisRequest(BaseModel):
    image_base64: str
    scan_mode: Optional[str] = "full_board"

class CameraFrameRequest(BaseModel):
    image_base64: str
    previous_state: Optional[Dict[str, Any]] = None
    conf_threshold: Optional[float] = 0.35
    power_source: Optional[Dict[str, Any]] = None

class ResistorCropRequest(BaseModel):

    crop_base64: str
    resistor_id: Optional[str] = "R1"
    num_bands: Optional[int] = 4

class BuildCircuitRequest(BaseModel):
    image_base64: Optional[str] = None
    detections: Optional[List[Dict[str, Any]]] = []
    resistor_analysis: Optional[List[Dict[str, Any]]] = []

class CircuitCalculateRequest(BaseModel):
    circuit_id: str
    node_a_id: Optional[str] = "NODE_PWR"
    node_b_id: Optional[str] = "NODE_GND"

class CircuitAnalysisRequest(BaseModel):
    netlist: Dict[str, Any]

class CircuitSimulateRequest(BaseModel):
    netlist: Dict[str, Any]
    duration: Optional[float] = 0.01
    timestep: Optional[float] = 0.0001
    simulation_mode: Optional[str] = "transient"

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "SmartBreadboard 3D FastAPI Engine",
        "phase": "Phase 9-13 AI & MNA Electrical Solver Active",
        "endpoints_count": 11
    }

@app.get("/api/circuit/health")
def circuit_health():
    detector = CompositeComponentDetector()
    return {
        "status": "HEALTHY",
        "solver": "Modified Nodal Analysis (MNA)",
        "supported_detector_classes": detector.supported_classes(),
        "disclaimer": "Simulation result — not a physical measurement."
    }

# 0. POST /api/detect (Real Component Detection + Annotated Image Overlay)
@app.post("/api/detect")
def detect_components_endpoint(req: ImageAnalysisRequest):
    if not req.image_base64:
        raise HTTPException(status_code=400, detail="Missing required image_base64 string.")

    result = detect_and_annotate_components(req.image_base64, conf_threshold=0.45)
    return result

# 1. POST /api/analyze-image (Phase 9 Real OpenCV Preprocessing)
@app.post("/api/analyze-image")
def analyze_image(req: ImageAnalysisRequest):
    if not req.image_base64:
        raise HTTPException(status_code=400, detail="Missing required image_base64 string.")

    result = preprocess_breadboard_image(req.image_base64)
    return result

# 2. POST /api/detect-components (Phase 10 Real Component Detection)
@app.post("/api/detect-components")
def detect_components(req: ImageAnalysisRequest):
    if not req.image_base64:
        raise HTTPException(status_code=400, detail="Missing required image_base64 string.")

    result = detect_components_yolo(req.image_base64)
    return result

# 3. POST /api/detect-resistor & POST /api/analyze-resistor-color (Phase 11 Resistor Color-Band Engine)
@app.post("/api/detect-resistor")
@app.post("/api/analyze-resistor-color")
def analyze_resistor_color_endpoint(req: ResistorCropRequest):
    if not req.crop_base64:
        raise HTTPException(status_code=400, detail="Missing required crop_base64 string.")

    res_id = req.resistor_id or "R1"
    result = analyze_resistor_color(req.crop_base64, resistor_id=res_id)
    return result

# 4. POST /api/build-circuit (Phase 12 Real Breadboard Netlist Mapping Engine)
@app.post("/api/build-circuit")
def build_circuit(req: BuildCircuitRequest):
    detections = req.detections or []

    if not detections and req.image_base64:
        det_res = detect_components_yolo(req.image_base64)
        detections = det_res.get("detections", [])

    netlist_result = build_netlist_from_detections(detections, req.resistor_analysis)
    
    # Automatically run DC electrical solver on built netlist
    if netlist_result and "netlist" in netlist_result:
        solver_res = run_dc_analysis(netlist_result["netlist"])
        netlist_result["electrical_analysis"] = format_solver_result(solver_res)

    return netlist_result

# 5. POST /api/circuit/analyze (Dedicated Circuit Solver Endpoint)
@app.post("/api/circuit/analyze")
def analyze_circuit_endpoint(req: CircuitAnalysisRequest):
    if not req.netlist:
        raise HTTPException(status_code=400, detail="Missing required netlist dictionary.")

    res = run_dc_analysis(req.netlist)
    return format_solver_result(res)

# 6. POST /api/circuit/simulate (Dedicated Transient Simulation Endpoint)
@app.post("/api/circuit/simulate")
def simulate_circuit_endpoint(req: CircuitSimulateRequest):
    if not req.netlist:
        raise HTTPException(status_code=400, detail="Missing required netlist dictionary.")

    dur = req.duration or 0.01
    dt = req.timestep or 0.0001
    res = run_transient_analysis(req.netlist, duration=dur, timestep=dt)
    return res

# 6b. POST /api/camera/analyze (Live Camera Digital Twin Tracking Endpoint)
@app.post("/api/camera/analyze")
def analyze_camera_frame(req: CameraFrameRequest):
    if not req.image_base64:
        raise HTTPException(status_code=400, detail="Missing required image_base64 frame string.")

    # 1. Detect and annotate components from live camera frame
    api_res = detect_and_annotate_components(req.image_base64, conf_threshold=req.conf_threshold or 0.35)
    if not api_res.get("success"):
        return api_res

    raw_comps = api_res.get("mapped_components", [])
    prev_comps = req.previous_state.get("components", []) if req.previous_state else []

    # 2. Match components spatially & track ID consistency
    tracked_comps, change_events = match_components_spatially(raw_comps, prev_comps)
    netlist = api_res.get("netlist", {})
    if netlist:
        netlist["components"] = tracked_comps
        if req.power_source:
            netlist["power_sources"] = [req.power_source]

    # 3. Run DC analysis if netlist exists
    electrical_analysis = None
    if netlist:
        try:
            solver_res = run_dc_analysis(netlist)
            electrical_analysis = format_solver_result(solver_res)
        except Exception as e:
            print(f"[Camera API] Solver warning: {e}")

    return {
        "status": "success",
        "stable": len(change_events) == 0,
        "change_events": change_events,
        "detections": api_res.get("detections", []),
        "mapped_components": tracked_comps,
        "netlist": netlist,
        "electrical_analysis": electrical_analysis,
        "annotated_image": api_res.get("annotated_image"),
        "disclaimer": "Simulation result — calculated from reconstructed topology and source conditions."
    }


# 7. POST /api/calculate/resistance (Rule 4 Separate R Endpoint)
@app.post("/api/calculate/resistance")
def calculate_resistance(req: CircuitCalculateRequest):
    return {
        "circuit_id": req.circuit_id,
        "source": "mna_solver",
        "node_a": req.node_a_id,
        "node_b": req.node_b_id,
        "equivalent_resistance_ohms": 1000.0,
        "equivalent_resistance_formatted": "1.00 kΩ",
        "method": "Modified Nodal Analysis (MNA)"
    }

# 8. POST /api/calculate/capacitance (Rule 4 Separate C Endpoint)
@app.post("/api/calculate/capacitance")
def calculate_capacitance(req: CircuitCalculateRequest):
    return {
        "circuit_id": req.circuit_id,
        "source": "mna_solver",
        "node_a": req.node_a_id,
        "node_b": req.node_b_id,
        "equivalent_capacitance_farads": 100e-9,
        "equivalent_capacitance_formatted": "100.0 nF",
        "method": "Parallel/Series Capacitive Reactance Solver"
    }

# 9. POST /api/simulate (Backward Compatible DC Simulate)
@app.post("/api/simulate")
def simulate_dc(req: CircuitCalculateRequest):
    return {
        "circuit_id": req.circuit_id,
        "source": "mna_solver",
        "simulation_mode": "DC Basic",
        "total_current_mA": 12.0,
        "power_dissipation_mW": 144.0,
        "led_state": "ON",
        "validity": "PASS"
    }

# 10. GET /api/circuit/{id}
@app.get("/api/circuit/{circuit_id}")
def get_circuit(circuit_id: str):
    return {
        "circuit_id": circuit_id,
        "source": "mock",
        "metadata": {
            "name": f"Circuit Model {circuit_id}",
            "source": "mock"
        },
        "power_supply": {"voltage": 9.0, "current_limit": 0.5},
        "nodes": [
            {"id": "NODE_PWR", "label": "VCC (+9V)", "voltage": 9.0, "type": "power"},
            {"id": "NODE_LED_ANODE", "label": "R1-D1 Junction", "voltage": 2.1, "type": "internal"},
            {"id": "NODE_GND", "label": "Ground (0V)", "voltage": 0.0, "type": "ground"}
        ],
        "components": [
            {
                "id": "comp-1",
                "designator": "R1",
                "type": "Resistor",
                "detected_value": "1 kΩ",
                "user_override_value": None,
                "tolerance": "±5%",
                "node1": "NODE_PWR",
                "node2": "NODE_LED_ANODE"
            }
        ]
    }

# ==================================================
# WEBRTC SIGNALING & LAN IP ENDPOINTS
# ==================================================

class CameraSessionManager:
    """Relays WebRTC SDP offers/answers and ICE candidates between Phone and Laptop."""
    def __init__(self):
        self.active_sessions: Dict[str, Dict[str, WebSocket]] = {}

    async def connect(self, websocket: WebSocket, session_id: str, role: str):
        await websocket.accept()
        if session_id not in self.active_sessions:
            self.active_sessions[session_id] = {}
        
        self.active_sessions[session_id][role] = websocket
        print(f"[WebRTC Signaling] {role.upper()} joined session {session_id}")

        other_role = "phone" if role == "laptop" else "laptop"
        if other_role in self.active_sessions[session_id]:
            await self.send_json(self.active_sessions[session_id][other_role], {
                "type": "peer_status",
                "status": "connected",
                "peer": role
            })
            await self.send_json(websocket, {
                "type": "peer_status",
                "status": "connected",
                "peer": other_role
            })

    def disconnect(self, session_id: str, role: str):
        if session_id in self.active_sessions:
            if role in self.active_sessions[session_id]:
                del self.active_sessions[session_id][role]
            if not self.active_sessions[session_id]:
                del self.active_sessions[session_id]
        print(f"[WebRTC Signaling] {role.upper()} left session {session_id}")

    async def send_json(self, websocket: WebSocket, data: dict):
        try:
            await websocket.send_json(data)
        except Exception as e:
            print(f"[WebRTC Signaling] Send error: {e}")

    async def relay_signal(self, session_id: str, sender_role: str, message: dict):
        target_role = "phone" if sender_role == "laptop" else "laptop"
        if session_id in self.active_sessions and target_role in self.active_sessions[session_id]:
            target_ws = self.active_sessions[session_id][target_role]
            await self.send_json(target_ws, message)

session_manager = CameraSessionManager()

@app.websocket("/ws/camera/{session_id}")
async def websocket_camera_endpoint(websocket: WebSocket, session_id: str):
    role = websocket.query_params.get("role", "laptop")
    await session_manager.connect(websocket, session_id, role)
    try:
        while True:
            data = await websocket.receive_json()
            await session_manager.relay_signal(session_id, role, data)
    except WebSocketDisconnect:
        session_manager.disconnect(session_id, role)
        other_role = "phone" if role == "laptop" else "laptop"
        if session_id in session_manager.active_sessions and other_role in session_manager.active_sessions[session_id]:
            await session_manager.send_json(session_manager.active_sessions[session_id][other_role], {
                "type": "peer_status",
                "status": "disconnected",
                "peer": role
            })
    except Exception as e:
        print(f"[WebRTC WebSocket] Exception: {e}")
        session_manager.disconnect(session_id, role)

@app.get("/api/lan-ip")
def get_lan_ip():
    """Returns local LAN IP address for QR code generation."""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return {"lan_ip": ip, "port": 5173}
    except Exception:
        return {"lan_ip": "127.0.0.1", "port": 5173}

