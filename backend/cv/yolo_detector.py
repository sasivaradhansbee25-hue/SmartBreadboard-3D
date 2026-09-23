"""
SmartBreadboard 3D — YOLO Component Detector Engine (Phase 10 Real AI Pipeline)
Executes neural network tensor inference (ONNX Runtime / PyTorch YOLOv8), bounding box scaling,
confidence scoring, confidence warning flagging, and component region crop extraction.
"""

import cv2
import numpy as np
import base64
import os
from pathlib import Path

# Resolve base backend directory relative to this file (backend/cv/yolo_detector.py -> backend)
BASE_DIR = Path(__file__).resolve().parent.parent

# Model path resolution order:
# 1. YOLO_MODEL_PATH environment variable (if provided and file exists)
# 2. backend/models/best.pt (Primary production model)
# 3. backend/cv/weights/best.pt (Secondary internal weights)
# 4. backend/cv/weights/yolov8n_breadboard.pt (Fallback model)

MODEL_PATH_ENV = os.environ.get("YOLO_MODEL_PATH")
MODEL_PATH_PROD = BASE_DIR / "models" / "best.pt"
MODEL_PATH_CV_BEST = BASE_DIR / "cv" / "weights" / "best.pt"
MODEL_PATH_FALLBACK = BASE_DIR / "cv" / "weights" / "yolov8n_breadboard.pt"

if MODEL_PATH_ENV and os.path.exists(MODEL_PATH_ENV):
    MODEL_PATH_PT = os.path.abspath(MODEL_PATH_ENV)
    MODEL_SOURCE_LOG = f"YOLO_MODEL_PATH env var ({MODEL_PATH_ENV})"
elif MODEL_PATH_PROD.exists():
    MODEL_PATH_PT = str(MODEL_PATH_PROD)
    MODEL_SOURCE_LOG = "backend/models/best.pt"
elif MODEL_PATH_CV_BEST.exists():
    MODEL_PATH_PT = str(MODEL_PATH_CV_BEST)
    MODEL_SOURCE_LOG = "backend/cv/weights/best.pt"
else:
    MODEL_PATH_PT = str(MODEL_PATH_FALLBACK)
    MODEL_SOURCE_LOG = "backend/cv/weights/yolov8n_breadboard.pt"

print(f"[YOLO Detector] Selected model path: {MODEL_PATH_PT} (Source: {MODEL_SOURCE_LOG})")

MODEL_PATH_ONNX = None  # Use verified PyTorch YOLOv8n best.pt model directly
_YOLO_MODEL_CACHE = None

# Target fine-tuned Phase 10 model classes per SPEC
CLASSES = [
    "resistor",         # Index 0
    "diode_rectifier",  # Index 1
    "ic_chip",          # Index 2
    "wire",             # Index 3
    "capacitor",        # Index 4
    "led"               # Index 5
]

def crop_component_region(cv_img: np.ndarray, bbox: list[int]) -> str:
    """
    Extracts localized component region crop and encodes to Base64 PNG data URL.
    """
    x1, y1, x2, y2 = bbox
    h, w = cv_img.shape[:2]

    x1_pad = max(0, x1 - 4)
    y1_pad = max(0, y1 - 4)
    x2_pad = min(w, x2 + 4)
    y2_pad = min(h, y2 + 4)

    crop = cv_img[y1_pad:y2_pad, x1_pad:x2_pad]
    if crop.size == 0:
        crop = cv_img

    _, buffer = cv2.imencode('.png', crop)
    crop_b64 = base64.b64encode(buffer).decode('utf-8')
    return f"data:image/png;base64,{crop_b64}"

def nms_bounding_boxes(boxes: list, scores: list, iou_threshold: float = 0.45) -> list[int]:
    """
    Non-Maximum Suppression (NMS) to eliminate overlapping redundant bounding box predictions.
    """
    if not boxes:
        return []

    boxes_np = np.array(boxes)
    scores_np = np.array(scores)

    x1 = boxes_np[:, 0]
    y1 = boxes_np[:, 1]
    x2 = boxes_np[:, 2]
    y2 = boxes_np[:, 3]

    areas = (x2 - x1 + 1) * (y2 - y1 + 1)
    order = scores_np.argsort()[::-1]

    keep = []
    while order.size > 0:
        i = order[0]
        keep.append(i)

        xx1 = np.maximum(x1[i], x1[order[1:]])
        yy1 = np.maximum(y1[i], y1[order[1:]])
        xx2 = np.minimum(x2[i], x2[order[1:]])
        yy2 = np.minimum(y2[i], y2[order[1:]])

        w = np.maximum(0.0, xx2 - xx1 + 1)
        h = np.maximum(0.0, yy2 - yy1 + 1)
        inter = w * h

        ovr = inter / (areas[i] + areas[order[1:]] - inter)
        inds = np.where(ovr <= iou_threshold)[0]
        order = order[inds + 1]

    return keep

def detect_components_yolo(image_input: bytes | str, conf_threshold: float = 0.45) -> dict:
    """
    Main entry point for Phase 10 YOLO Component Detection.
    Executes neural network tensor inference on Phase 9 normalized image matrices.
    Returns real bounding boxes, class labels, confidence scores, and crop regions.
    No hardcoded fallbacks or mock data.
    """
    try:
        if isinstance(image_input, np.ndarray):
            cv_img = image_input
        elif isinstance(image_input, str):
            if ',' in image_input:
                image_input = image_input.split(',')[1]
            image_bytes = base64.b64decode(image_input)
            nparr = np.frombuffer(image_bytes, np.uint8)
            cv_img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        elif isinstance(image_input, bytes):
            nparr = np.frombuffer(image_input, np.uint8)
            cv_img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        else:
            cv_img = None

        if cv_img is None:
            return {
                "status": "error",
                "error": "Failed to decode input bytes into valid OpenCV matrix.",
                "source": "yolo_detector",
                "detections_count": 0,
                "detections": []
            }

        img_h, img_w = cv_img.shape[:2]

        use_onnx = bool(MODEL_PATH_ONNX and os.path.exists(MODEL_PATH_ONNX))
        use_pt = bool(MODEL_PATH_PT and os.path.exists(MODEL_PATH_PT))

        detections = []
        raw_boxes = []
        raw_scores = []
        raw_classes = []

        if use_onnx:
            import onnxruntime as ort
            session = ort.InferenceSession(MODEL_PATH_ONNX)
            input_name = session.get_inputs()[0].name

            # Preprocess image tensor to 640x640 RGB float32
            blob = cv2.dnn.blobFromImage(cv_img, 1/255.0, (640, 640), swapRB=True, crop=False)
            outputs = session.run(None, {input_name: blob})

            # Parse YOLOv8 ONNX output shape [1, 4 + num_classes, 8400]
            output = outputs[0][0] # (4 + num_classes) x 8400
            num_classes = output.shape[0] - 4

            for col in range(output.shape[1]):
                scores_vec = output[4:4 + num_classes, col]
                class_id = int(np.argmax(scores_vec))
                score = float(scores_vec[class_id])

                if score >= conf_threshold:
                    xc, yc, w, h = output[0:4, col]
                    x1 = int((xc - w/2) * (img_w / 640.0))
                    y1 = int((yc - h/2) * (img_h / 640.0))
                    x2 = int((xc + w/2) * (img_w / 640.0))
                    y2 = int((yc + h/2) * (img_h / 640.0))

                    raw_boxes.append([max(0, x1), max(0, y1), min(img_w, x2), min(img_h, y2)])
                    raw_scores.append(score)
                    cls_name = CLASSES[class_id] if class_id < len(CLASSES) else f"class_{class_id}"
                    raw_classes.append(cls_name)

        elif use_pt:
            global _YOLO_MODEL_CACHE
            if _YOLO_MODEL_CACHE is None:
                from ultralytics import YOLO
                _YOLO_MODEL_CACHE = YOLO(MODEL_PATH_PT)
            model = _YOLO_MODEL_CACHE
            results = model(cv_img, conf=conf_threshold, verbose=False)

            for r in results:
                for box in r.boxes:
                    x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                    score = float(box.conf[0].cpu().numpy())
                    cls_id = int(box.cls[0].cpu().numpy())

                    raw_boxes.append([int(x1), int(y1), int(x2), int(y2)])
                    raw_scores.append(score)
                    cls_name = CLASSES[cls_id] if cls_id < len(CLASSES) else f"class_{cls_id}"
                    raw_classes.append(cls_name)

        # Step 3: Apply Non-Maximum Suppression (NMS) Filtering
        keep_indices = nms_bounding_boxes(raw_boxes, raw_scores, iou_threshold=0.45)

        for det_idx, idx in enumerate(keep_indices, 1):
            bbox = raw_boxes[idx]
            score = round(raw_scores[idx], 2)
            cls_name = raw_classes[idx]

            x1, y1, x2, y2 = bbox
            bw = x2 - x1
            bh = y2 - y1

            bbox_norm = [
                round(x1 / img_w, 4),
                round(y1 / img_h, 4),
                round(bw / img_w, 4),
                round(bh / img_h, 4)
            ]

            crop_b64 = crop_component_region(cv_img, bbox)

            detections.append({
                "id": f"det-{det_idx}",
                "class": cls_name,
                "confidence": score,
                "confidence_warning": score < 0.65,
                "bbox_pixels": bbox,
                "bbox_normalized": bbox_norm,
                "crop_base64": crop_b64
            })

        return {
            "status": "detected",
            "source": "yolo_onnx" if use_onnx else ("yolo_pt" if use_pt else "yolo_neural_tensor"),
            "model_version": "yolov8n-breadboard-v1",
            "weights_loaded": use_onnx or use_pt,
            "detections_count": len(detections),
            "detections": detections
        }

    except Exception as e:
        return {
            "status": "error",
            "error": f"YOLO detection failure: {str(e)}",
            "source": "yolo_detector",
            "detections_count": 0,
            "detections": []
        }

CLASS_COLORS = {
    'resistor': (0, 165, 255),        # Orange
    'diode_rectifier': (255, 0, 255), # Magenta
    'ic_chip': (0, 255, 255),         # Yellow
    'wire': (255, 255, 0),            # Cyan
    'capacitor': (255, 0, 0),         # Blue
    'led': (0, 255, 0)                # Green
}

def detect_and_annotate_components(image_input: bytes | str, conf_threshold: float = 0.45) -> dict:
    """
    Executes YOLO 6-class detection, generates annotated overlay image with visual bounding boxes,
    and runs breadboard grid hole mapping & electrical netlist generation.
    Returns structured detection list, class counts, mapped components, and netlist.
    """
    from core.circuit_model import build_netlist_from_detections

    try:
        if isinstance(image_input, str):
            if ',' in image_input:
                image_input = image_input.split(',')[1]
            image_bytes = base64.b64decode(image_input)
        else:
            image_bytes = image_input

        nparr = np.frombuffer(image_bytes, np.uint8)
        cv_img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if cv_img is None:
            return {
                "success": False,
                "error": "Failed to decode input image",
                "detections": [],
                "counts": {c: 0 for c in CLASSES},
                "mapped_components": [],
                "netlist": None,
                "nets_summary": [],
                "annotated_image": None
            }

        img_h, img_w = cv_img.shape[:2]

        # Step 1: Run detection
        det_output = detect_components_yolo(cv_img, conf_threshold=conf_threshold)
        raw_detections = det_output.get("detections", [])

        annotated_img = cv_img.copy()
        counts = {c: 0 for c in CLASSES}
        formatted_detections = []

        for d in raw_detections:
            cls_name = d["class"]
            conf = d["confidence"]
            bbox = d["bbox_pixels"]
            cls_id = CLASSES.index(cls_name) if cls_name in CLASSES else 0

            if cls_name in counts:
                counts[cls_name] += 1

            formatted_detections.append({
                "id": d.get("id"),
                "class_id": cls_id,
                "class_name": cls_name,
                "class": cls_name,
                "confidence": conf,
                "bbox": bbox,
                "bbox_pixels": bbox,
                "crop_base64": d.get("crop_base64")
            })

        # Step 2: Generate netlist & hole mapping
        netlist = build_netlist_from_detections(formatted_detections, img_w=img_w, img_h=img_h)
        mapped_components = netlist.get("components", [])
        nets_summary = netlist.get("nets_summary", [])

        # Run real MNA Electrical Solver
        from circuit_solver.dc_solver import run_dc_analysis
        from circuit_solver.results import format_solver_result

        solver_res = run_dc_analysis(netlist)
        formatted_sim = format_solver_result(solver_res, netlist=netlist)
        netlist["electrical_analysis"] = formatted_sim
        netlist["simulationResult"] = formatted_sim

        # Step 3: Draw comprehensive Visual Debug Overlay (Bboxes, Centers, Terminals, Mapped Holes)
        for comp in mapped_components:
            cls_name = comp.get("type", "resistor")
            des = comp.get("designator", "COMP")
            conf = comp.get("confidence", 0.90)
            bbox = comp.get("bbox", [0, 0, 10, 10])
            h1 = comp.get("start_hole", "A1")
            h2 = comp.get("end_hole", "A2")

            x1, y1, x2, y2 = bbox
            color = CLASS_COLORS.get(cls_name, (0, 255, 0))

            # 1. Bounding box
            cv2.rectangle(annotated_img, (x1, y1), (x2, y2), color, 2)
            cv2.putText(annotated_img, f"{des}: {cls_name} {conf:.2f}", (x1, max(18, y1 - 6)), cv2.FONT_HERSHEY_SIMPLEX, 0.55, color, 2)

            # 2. Component Center
            cx, cy = int((x1 + x2) / 2), int((y1 + y2) / 2)
            cv2.circle(annotated_img, (cx, cy), 4, (255, 0, 255), -1)

            # 3. Estimated Terminals
            if cls_name in ["resistor", "diode_rectifier"]:
                t1 = (int(x1 + 0.08 * (x2 - x1)), cy)
                t2 = (int(x2 - 0.08 * (x2 - x1)), cy)
            elif cls_name == "led":
                t1 = (int(cx - 0.15 * (x2 - x1)), int(y2 - 0.10 * (y2 - y1)))
                t2 = (int(cx + 0.15 * (x2 - x1)), int(y2 - 0.10 * (y2 - y1)))
            elif cls_name in ["wire", "jumper"]:
                t1 = (int(x1 + 0.10 * (x2 - x1)), int(y1 + 0.10 * (y2 - y1)))
                t2 = (int(x2 - 0.10 * (x2 - x1)), int(y2 - 0.10 * (y2 - y1)))
            else:
                t1 = (x1, cy)
                t2 = (x2, cy)

            cv2.circle(annotated_img, t1, 5, (0, 255, 255), -1)
            cv2.circle(annotated_img, t2, 5, (0, 165, 255), -1)
            cv2.line(annotated_img, t1, t2, (200, 200, 200), 1)

            # 4. Mapped Holes Label
            cv2.putText(annotated_img, f"{h1}..{h2}", (x1, y2 + 18), cv2.FONT_HERSHEY_SIMPLEX, 0.50, (0, 255, 255), 2)

        _, buffer = cv2.imencode('.jpg', annotated_img, [int(cv2.IMWRITE_JPEG_QUALITY), 92])
        ann_b64 = base64.b64encode(buffer).decode('utf-8')

        return {
            "success": True,
            "detections": formatted_detections,
            "counts": counts,
            "mapped_components": mapped_components,
            "netlist": netlist,
            "nets_summary": nets_summary,
            "electrical_analysis": formatted_sim,
            "simulationResult": formatted_sim,
            "annotated_image": f"data:image/jpeg;base64,{ann_b64}",
            "image_meta": {
                "width": img_w,
                "height": img_h
            }
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "detections": [],
            "counts": {c: 0 for c in CLASSES},
            "mapped_components": [],
            "netlist": None,
            "nets_summary": [],
            "annotated_image": None
        }

