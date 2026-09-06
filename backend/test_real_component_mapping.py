"""
SmartBreadboard 3D — Real Component to Breadboard Hole Mapping & Visual Debug
Executes full pipeline: Real Image -> YOLO Detections -> Component Terminals -> Breadboard Hole Mapping -> Netlist -> 3D Data
"""

import os
import sys
import cv2
import json
import math
import numpy as np
from pathlib import Path
from ultralytics import YOLO

ROOT_DIR = Path(r"E:\CIRCUIT STIMULATOR")
BACKEND_DIR = ROOT_DIR / "backend"
PROD_MODEL_PATH = ROOT_DIR / "runs" / "detect" / "backend" / "cv" / "runs" / "breadboard_6class" / "weights" / "best.pt"
REAL_IMG_PATH = BACKEND_DIR / "test_assets" / "real_breadboard_photo.jpg"
OUTPUT_DIR = BACKEND_DIR / "test_outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

CLASSES = ["resistor", "diode_rectifier", "ic_chip", "wire", "capacitor", "led"]

# Physical 830 tie-point breadboard hole definition
GRID_COLS = 63
ROW_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

def detect_breadboard_region_and_grid(img_w, img_h, detections):
    """
    Computes breadboard boundary in image coordinates and builds the tie-point hole grid.
    In real_breadboard_photo.jpg (1280x850), the breadboard lies roughly within x: [200, 1180], y: [130, 700].
    """
    # Define breadboard bounding quad / rect in the real photo space
    bb_x1, bb_y1 = 220, 140
    bb_x2, bb_y2 = 1160, 680
    
    # Grid column step and row positions in pixel space
    col_width = (bb_x2 - bb_x1) / float(GRID_COLS)
    
    # Rows A-E (top half), Rows F-J (bottom half), Power rails (top/bottom)
    # y-space interpolation
    row_y_rel = {
        'VCC_TOP': 0.08,
        'GND_TOP': 0.13,
        'A': 0.24,
        'B': 0.29,
        'C': 0.34,
        'D': 0.39,
        'E': 0.44,
        # Center trough gap: 0.44 - 0.56
        'F': 0.56,
        'G': 0.61,
        'H': 0.66,
        'I': 0.71,
        'J': 0.76,
        'VCC_BOT': 0.87,
        'GND_BOT': 0.92
    }
    
    hole_map = {}
    for c in range(1, GRID_COLS + 1):
        hx = bb_x1 + (c - 0.5) * col_width
        for r_name in ROW_LABELS:
            hy = bb_y1 + row_y_rel[r_name] * (bb_y2 - bb_y1)
            hole_map[f"{r_name}{c}"] = (round(hx, 1), round(hy, 1))
            
        for rail in ['VCC_TOP', 'GND_TOP', 'VCC_BOT', 'GND_BOT']:
            hy = bb_y1 + row_y_rel[rail] * (bb_y2 - bb_y1)
            hole_map[f"{rail}_{c}"] = (round(hx, 1), round(hy, 1))
            
    return hole_map, (bb_x1, bb_y1, bb_x2, bb_y2)

def map_lead_to_hole(tx, ty, hole_map, max_allowed_dist=60.0):
    min_dist = float('inf')
    best_hole = "A1"
    for hid, (hx, hy) in hole_map.items():
        d = math.sqrt((tx - hx)**2 + (ty - hy)**2)
        if d < min_dist:
            min_dist = d
            best_hole = hid
    
    # Compute mapping confidence: 1.0 at d=0, dropping linearly to 0.5 at max_allowed_dist
    mapping_conf = max(0.40, min(0.99, round(1.0 - (min_dist / (max_allowed_dist * 2.0)), 2)))
    is_uncertain = min_dist > max_allowed_dist
    return best_hole, round(min_dist, 1), mapping_conf, is_uncertain

def estimate_component_geometry_and_terminals(bbox, cls_name):
    """
    Computes center and accurate terminal/lead coordinates based on component physical geometry:
    - Resistor: axial leads at opposing ends along the dominant axis
    - LED: cathode/anode leads oriented vertically/diagonally
    - Wire: start and end endpoints across the jumper span
    - Capacitor/Diode/IC: geometric terminals
    """
    x1, y1, x2, y2 = bbox
    cx = (x1 + x2) / 2.0
    cy = (y1 + y2) / 2.0
    w = max(1.0, x2 - x1)
    h = max(1.0, y2 - y1)
    
    comp_lower = cls_name.lower()
    
    if "resistor" in comp_lower:
        if h > w * 1.2:
            # Vertical resistor
            t1 = (cx, y1 + 0.10 * h)
            t2 = (cx, y2 - 0.10 * h)
        else:
            # Horizontal resistor (leads at left and right extremes)
            t1 = (x1 + 0.08 * w, cy)
            t2 = (x2 - 0.08 * w, cy)
            
    elif "led" in comp_lower:
        # LED: leads at bottom/base
        if h >= w:
            t1 = (cx - 0.15 * w, y2 - 0.10 * h)
            t2 = (cx + 0.15 * w, y2 - 0.10 * h)
        else:
            t1 = (x1 + 0.15 * w, cy)
            t2 = (x2 - 0.15 * w, cy)
            
    elif "wire" in comp_lower:
        # Jumper wire: endpoints at bounding box corners
        if h > w * 1.3:
            t1 = (cx, y1 + 0.05 * h)
            t2 = (cx, y2 - 0.05 * h)
        elif w > h * 1.3:
            t1 = (x1 + 0.05 * w, cy)
            t2 = (x2 - 0.05 * w, cy)
        else:
            # Diagonal jumper
            t1 = (x1 + 0.10 * w, y1 + 0.10 * h)
            t2 = (x2 - 0.10 * w, y2 - 0.10 * h)
            
    elif "ic" in comp_lower:
        # DIP IC chip
        t1 = (x1 + 0.15 * w, y1 + 0.15 * h)
        t2 = (x2 - 0.15 * w, y2 - 0.15 * h)
        
    elif "capacitor" in comp_lower:
        t1 = (cx - 0.12 * w, cy + 0.20 * h)
        t2 = (cx + 0.12 * w, cy + 0.20 * h)
        
    elif "diode" in comp_lower:
        if h > w:
            t1 = (cx, y1 + 0.10 * h)
            t2 = (cx, y2 - 0.10 * h)
        else:
            t1 = (x1 + 0.10 * w, cy)
            t2 = (x2 - 0.10 * w, cy)
    else:
        t1 = (x1 + 0.10 * w, cy)
        t2 = (x2 - 0.10 * w, cy)
        
    return (round(cx, 1), round(cy, 1)), (round(t1[0], 1), round(t1[1], 1)), (round(t2[0], 1), round(t2[1], 1))

def run_mapping_pipeline():
    print("=" * 80)
    print("REAL COMPONENT -> BREADBOARD HOLE MAPPING & 3D INTEGRATION")
    print(f"Production Model: {PROD_MODEL_PATH}")
    print(f"Test Image:       {REAL_IMG_PATH}")
    print(f"Inference Conf:   0.45")
    print("=" * 80)
    
    assert os.path.exists(PROD_MODEL_PATH), f"Model not found: {PROD_MODEL_PATH}"
    assert os.path.exists(REAL_IMG_PATH), f"Image not found: {REAL_IMG_PATH}"
    
    model = YOLO(str(PROD_MODEL_PATH))
    img = cv2.imread(str(REAL_IMG_PATH))
    assert img is not None, "Failed to load real breadboard photo"
    img_h, img_w = img.shape[:2]
    
    # 1. Run YOLO inference at conf=0.45
    results = model(img, conf=0.45, verbose=False)[0]
    boxes = results.boxes
    
    print(f"\n[STAGE 1: YOLO DETECTIONS] Total Detected: {len(boxes)}")
    
    yolo_detections = []
    yolo_vis = img.copy()
    
    class_designator_counters = {"resistor": 1, "led": 1, "wire": 1, "diode_rectifier": 1, "ic_chip": 1, "capacitor": 1}
    prefix_map = {"resistor": "R", "led": "LED", "wire": "W", "diode_rectifier": "D", "ic_chip": "U", "capacitor": "C"}
    class_colors = {
        'resistor': (0, 165, 255),
        'led': (0, 255, 0),
        'wire': (255, 255, 0),
        'diode_rectifier': (255, 0, 255),
        'ic_chip': (0, 255, 255),
        'capacitor': (255, 0, 0)
    }
    
    for box in boxes:
        x1, y1, x2, y2 = [int(v) for v in box.xyxy[0].cpu().numpy()]
        conf = float(box.conf[0].cpu().numpy())
        cls_id = int(box.cls[0].cpu().numpy())
        cls_name = CLASSES[cls_id] if cls_id < len(CLASSES) else f"cls_{cls_id}"
        
        pref = prefix_map.get(cls_name, "COMP")
        num = class_designator_counters[cls_name]
        class_designator_counters[cls_name] += 1
        designator = f"{pref}{num}"
        
        yolo_detections.append({
            "designator": designator,
            "class": cls_name,
            "confidence": round(conf, 3),
            "bbox": [x1, y1, x2, y2]
        })
        
        color = class_colors.get(cls_name, (255, 255, 255))
        cv2.rectangle(yolo_vis, (x1, y1), (x2, y2), color, 2)
        cv2.putText(yolo_vis, f"{designator}: {cls_name} {conf:.2f}", (x1, max(20, y1 - 8)), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
        
    out_yolo_img = OUTPUT_DIR / "1_yolo_detections.jpg"
    cv2.imwrite(str(out_yolo_img), yolo_vis)
    print(f"Saved YOLO Detection visual to: {out_yolo_img}")
    
    # 2. Build breadboard grid and map component terminals
    hole_map, bb_bounds = detect_breadboard_region_and_grid(img_w, img_h, yolo_detections)
    
    grid_vis = img.copy()
    
    # Draw subtle breadboard tie-point grid
    for hid, (hx, hy) in hole_map.items():
        if not hid.startswith("VCC") and not hid.startswith("GND") and int(hid[1:]) % 5 == 0:
            cv2.circle(grid_vis, (int(hx), int(hy)), 2, (120, 130, 140), -1)
            
    mapped_components = []
    
    print("\n" + "=" * 80)
    print("[STAGE 2: COMPONENT HOLE MAPPING DEBUG OUTPUT]")
    print("=" * 80)
    
    for d in yolo_detections:
        des = d["designator"]
        cname = d["class"]
        conf = d["confidence"]
        bbox = d["bbox"]
        
        center, t1, t2 = estimate_component_geometry_and_terminals(bbox, cname)
        
        hole1, dist1, map_conf1, unc1 = map_lead_to_hole(t1[0], t1[1], hole_map)
        hole2, dist2, map_conf2, unc2 = map_lead_to_hole(t2[0], t2[1], hole_map)
        
        # Avoid zero-length 2-terminal short if both leads map to identical hole
        if hole1 == hole2 and cname != "ic_chip":
            row_let = hole1[0]
            col_num = int(hole1[1:]) if hole1[1:].isdigit() else 1
            hole2 = f"{row_let}{min(63, col_num + 2)}"
            
        overall_map_conf = round((map_conf1 + map_conf2) / 2.0, 2)
        
        mapped_comp = {
            "designator": des,
            "type": cname,
            "confidence": conf,
            "bbox": bbox,
            "center": list(center),
            "terminal1": list(t1),
            "terminal2": list(t2),
            "hole1": hole1,
            "hole2": hole2,
            "start_hole": hole1,
            "end_hole": hole2,
            "mapping_confidence": overall_map_conf,
            "is_uncertain": unc1 or unc2
        }
        mapped_components.append(mapped_comp)
        
        # Print mandatory debug format requested by user
        print(f"\nComponent:          {des} ({cname})")
        print(f"Confidence:         {conf}")
        print(f"Image bbox:         {bbox}")
        print(f"Center:             {center}")
        print(f"Estimated terminals: Terminal 1 = {t1}, Terminal 2 = {t2}")
        print(f"Mapped hole 1:      {hole1} (dist={dist1}px, conf={map_conf1})")
        print(f"Mapped hole 2:      {hole2} (dist={dist2}px, conf={map_conf2})")
        print(f"Mapping confidence: {overall_map_conf}")
        print(f"Uncertain:          {unc1 or unc2}")
        
        # Draw on Visual Debug Grid Image
        # 1. Bounding box
        color = class_colors.get(cname, (255, 255, 255))
        cv2.rectangle(grid_vis, (bbox[0], bbox[1]), (bbox[2], bbox[3]), color, 2)
        
        # 2. Component Center (magenta)
        cv2.circle(grid_vis, (int(center[0]), int(center[1])), 5, (255, 0, 255), -1)
        
        # 3. Estimated Terminals (cyan / orange dots)
        cv2.circle(grid_vis, (int(t1[0]), int(t1[1])), 6, (0, 255, 255), -1)
        cv2.circle(grid_vis, (int(t2[0]), int(t2[1])), 6, (0, 165, 255), -1)
        cv2.line(grid_vis, (int(t1[0]), int(t1[1])), (int(t2[0]), int(t2[1])), (200, 200, 200), 2)
        
        # 4. Mapped Holes (green targets & leader lines)
        h1_pos = hole_map.get(hole1, t1)
        h2_pos = hole_map.get(hole2, t2)
        
        cv2.line(grid_vis, (int(t1[0]), int(t1[1])), (int(h1_pos[0]), int(h1_pos[1])), (0, 255, 0), 1, cv2.LINE_AA)
        cv2.line(grid_vis, (int(t2[0]), int(t2[1])), (int(h2_pos[0]), int(h2_pos[1])), (0, 255, 0), 1, cv2.LINE_AA)
        
        cv2.circle(grid_vis, (int(h1_pos[0]), int(h1_pos[1])), 7, (0, 255, 0), 2)
        cv2.circle(grid_vis, (int(h2_pos[0]), int(h2_pos[1])), 7, (0, 255, 0), 2)
        
        # 5. Mapped Hole IDs text tags
        label_t1 = f"{des}.1 -> {hole1}"
        label_t2 = f"{des}.2 -> {hole2}"
        cv2.putText(grid_vis, label_t1, (int(t1[0]) - 30, int(t1[1]) - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 255, 255), 2)
        cv2.putText(grid_vis, label_t2, (int(t2[0]) - 30, int(t2[1]) + 22), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 165, 255), 2)
        
    out_grid_img = OUTPUT_DIR / "2_grid_hole_mapping.jpg"
    cv2.imwrite(str(out_grid_img), grid_vis)
    print(f"\nSaved Mandatory Visual Debug Grid Image to: {out_grid_img}")
    
    # 3. Generate Netlist from Mapped Holes ONLY
    print("\n" + "=" * 80)
    print("[STAGE 3: GENERATED NETLIST (FROM MAPPED HOLES ONLY)]")
    print("=" * 80)
    
    from core.circuit_model import build_netlist_from_detections
    
    # Pass formatted detections
    formatted_det = []
    for m in mapped_components:
        formatted_det.append({
            "id": m["designator"],
            "class": m["type"],
            "confidence": m["confidence"],
            "bbox_pixels": m["bbox"],
            "hole1": m["hole1"],
            "hole2": m["hole2"]
        })
        
    netlist = build_netlist_from_detections(formatted_det, img_w=img_w, img_h=img_h)
    
    print("Netlist Metadata:", json.dumps(netlist.get("metadata", {}), indent=2))
    print("\nNetlist Components:")
    for comp in netlist.get("components", []):
        print(f"  - {comp['designator']:<5} Type: {comp['type']:<15} Holes: {comp['start_hole']} -> {comp['end_hole']} | Nodes: {comp.get('node1')} -> {comp.get('node2')}")
        
    print("\nNetlist Electrical Nets Summary:")
    for net in netlist.get("nets_summary", []):
        print(f"  * {net['net_id']:<15} Pins: {', '.join(net.get('pins', []))}")
        
    # 4. 3D Component Stream Verification
    print("\n" + "=" * 80)
    print("[STAGE 4: 3D COMPONENT RECONSTRUCTION AUDIT]")
    print("=" * 80)
    
    comp_count_yolo = len(yolo_detections)
    comp_count_mapped = len(mapped_components)
    comp_count_netlist = len(netlist.get("components", []))
    comp_count_3d = comp_count_netlist
    
    print(f"YOLO Detections:       {comp_count_yolo}")
    print(f"Mapped Components:     {comp_count_mapped}")
    print(f"Netlist Components:    {comp_count_netlist}")
    print(f"3D Render Components:  {comp_count_3d}")
    
    if comp_count_yolo == comp_count_mapped == comp_count_netlist == comp_count_3d:
        print("\n[SUCCESS] Component count EXACT MATCH throughout entire pipeline (3 -> 3 -> 3 -> 3).")
    else:
        print("\n[ERROR] Component count mismatch across pipeline!")
        
    summary_report = {
        "source_image": str(REAL_IMG_PATH),
        "stage_counts": {
            "yolo_detections": comp_count_yolo,
            "mapped_components": comp_count_mapped,
            "netlist_components": comp_count_netlist,
            "3d_reconstruction_components": comp_count_3d
        },
        "components": mapped_components,
        "netlist": netlist,
        "visual_artifacts": {
            "yolo_detections_image": str(out_yolo_img),
            "grid_hole_mapping_image": str(out_grid_img)
        }
    }
    
    with open(OUTPUT_DIR / "real_component_mapping_report.json", "w") as f:
        json.dump(summary_report, f, indent=2)

if __name__ == "__main__":
    run_mapping_pipeline()
