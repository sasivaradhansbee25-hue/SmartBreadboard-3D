"""
SmartBreadboard 3D — Multi-Pass Component Value Consensus Engine
Performs multi-pass crop image preprocessing, multi-pass OCR candidate extraction,
resistor color-band fusion, confidence scoring, and candidate consensus aggregation.
"""

import base64
import cv2
import numpy as np
from typing import Dict, Any, List, Optional, Tuple
from cv.value_parser import parse_component_value, format_si_value
from cv.resistor_color import analyze_resistor_color

def preprocess_crop_variants(cv_img: np.ndarray) -> List[Tuple[str, np.ndarray]]:
    """
    Generates multi-pass preprocessed image variants for OCR from a component crop:
    1. Upscaled 3x (Inter-Cubic)
    2. Grayscale
    3. CLAHE Contrast Enhanced
    4. Sharpened
    5. Adaptive Threshold
    6. OTSU Binarized Threshold
    7. Inverted OTSU Threshold
    """
    if cv_img is None or cv_img.size == 0:
        return []

    variants = []

    # 1. Upscale 3x
    h, w = cv_img.shape[:2]
    upscaled = cv2.resize(cv_img, (w * 3, h * 3), interpolation=cv2.INTER_CUBIC)
    variants.append(("upscaled_color", upscaled))

    # 2. Grayscale
    gray = cv2.cvtColor(upscaled, cv2.COLOR_BGR2GRAY)
    variants.append(("grayscale", gray))

    # 3. CLAHE Contrast Enhancement
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(gray)
    variants.append(("clahe", enhanced))

    # 4. Sharpened
    kernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]], dtype=np.float32)
    sharpened = cv2.filter2D(enhanced, -1, kernel)
    variants.append(("sharpened", sharpened))

    # 5. Adaptive Threshold
    adaptive_thresh = cv2.adaptiveThreshold(
        enhanced, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
    )
    variants.append(("adaptive_thresh", adaptive_thresh))

    # 6. OTSU Binarized Threshold
    blur = cv2.GaussianBlur(gray, (3, 3), 0)
    _, otsu_thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    variants.append(("otsu_thresh", otsu_thresh))

    # 7. Inverted OTSU
    inv_otsu = cv2.bitwise_not(otsu_thresh)
    variants.append(("inv_otsu", inv_otsu))

    return variants


def normalize_ocr_text(raw_text: str) -> str:
    """
    Normalizes OCR text string by correcting common character misrecognitions.
    Examples: 'IK' -> '1K', '1KΩ' -> '1K', '100 uF' -> '100UF'
    """
    if not raw_text:
        return ""

    s = raw_text.strip().upper()

    # Common OCR misreadings
    s = s.replace("O", "0") if len(s) > 1 and "OHM" not in s else s
    s = s.replace("IK", "1K").replace("I K", "1K")
    s = s.replace("I0", "10").replace("l0", "10")
    s = s.replace("lK", "1K").replace("LK", "1K")
    s = s.replace(" ", "")
    s = s.replace("OHM", "").replace("Ω", "").replace("FARAD", "").replace("HENRY", "")

    return s


def extract_value_consensus_from_crop(
    crop_base64: str, comp_type: str = "resistor", comp_id: str = "R1"
) -> Dict[str, Any]:
    """
    Main Consensus & Value Fusion Engine.
    Executes multi-pass preprocessing, multi-pass OCR, resistor color fusion,
    candidate scoring, confidence determination, and solver gate flagging.
    """
    if not crop_base64:
        return build_fallback_response(comp_type, comp_id, "Missing image crop.")

    try:
        clean_b64 = crop_base64.split(",")[1] if "," in crop_base64 else crop_base64
        img_bytes = base64.b64decode(clean_b64)
        np_arr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if img is None or img.size == 0:
            return build_fallback_response(comp_type, comp_id, "Unreadable crop image.")

        # 1. Preprocess Crop Variants
        variants = preprocess_crop_variants(img)

        # 2. Multi-Pass OCR Extraction
        raw_ocr_texts = []

        try:
            import pytesseract
            for var_name, var_img in variants:
                try:
                    text = pytesseract.image_to_string(var_img, config="--psm 6").strip()
                    if text:
                        raw_ocr_texts.append(text)
                except Exception:
                    pass
        except ImportError:
            # Fallback if tesseract binary is not present in local python env
            pass

        # 3. Parse OCR Candidates
        candidate_counts: Dict[float, Dict[str, Any]] = {}

        for raw_t in raw_ocr_texts:
            norm_t = normalize_ocr_text(raw_t)
            si_val, unit, formatted = parse_component_value(norm_t, comp_type)
            if si_val is not None and si_val > 0:
                key = round(float(si_val), 9)
                if key not in candidate_counts:
                    candidate_counts[key] = {
                        "value": float(si_val),
                        "unit": unit,
                        "displayValue": formatted,
                        "count": 0,
                        "raw_texts": []
                    }
                candidate_counts[key]["count"] += 1
                candidate_counts[key]["raw_texts"].append(raw_t)

        total_ocr_hits = sum(item["count"] for item in candidate_counts.values())

        # 4. Secondary Source: Resistor Color Code Detection
        color_res = None
        if "resistor" in comp_type.lower() or comp_id.startswith("R"):
            try:
                color_res = analyze_resistor_color(crop_base64, resistor_id=comp_id)
            except Exception as e:
                print(f"[Consensus] Resistor color detection warning: {e}")

        color_value = None
        color_conf = 0.0
        color_fmt = ""
        if color_res and color_res.get("status") == "success" and color_res.get("detected_value"):
            det_val = color_res["detected_value"]
            if det_val.get("resistance_ohms"):
                color_value = float(det_val["resistance_ohms"])
                color_conf = float(det_val.get("confidence", 0.8))
                color_fmt = det_val.get("formatted_value", format_si_value(color_value, "Ω"))

        # 5. Build Aggregated Raw Candidates List
        raw_candidates_list = []

        # Add OCR candidates
        for key, item in candidate_counts.items():
            ocr_prob = item["count"] / max(total_ocr_hits, 1)
            raw_candidates_list.append({
                "value": item["value"],
                "unit": item["unit"],
                "displayValue": item["displayValue"],
                "confidence": round(ocr_prob * 0.9, 2),
                "source": "ocr",
                "raw_text": item["raw_texts"][0]
            })

        # Add Color candidate if present
        if color_value is not None:
            found_cand = False
            for cand in raw_candidates_list:
                if abs(cand["value"] - color_value) / max(color_value, 1e-6) < 0.05:
                    cand["confidence"] = min(0.98, max(cand["confidence"], color_conf) + 0.1)
                    cand["source"] = "ocr_color_fusion"
                    found_cand = True
                    break

            if not found_cand:
                raw_candidates_list.append({
                    "value": color_value,
                    "unit": "Ω",
                    "displayValue": color_fmt,
                    "confidence": round(color_conf, 2),
                    "source": "color_code",
                    "raw_text": "Color bands"
                })

        # Sort candidates by confidence descending
        raw_candidates_list.sort(key=lambda x: x["confidence"], reverse=True)

        # 6. Consensus Decision Logic
        if raw_candidates_list:
            top_candidate = raw_candidates_list[0]
            top_conf = top_candidate["confidence"]
            top_val = top_candidate["value"]
            top_unit = top_candidate["unit"]
            top_fmt = top_candidate["displayValue"]
            top_src = top_candidate["source"]

            # Disagreement check
            disagreement = False
            if len(raw_candidates_list) > 1:
                second_candidate = raw_candidates_list[1]
                if second_candidate["confidence"] >= 0.5 and (top_conf - second_candidate["confidence"]) < 0.2:
                    disagreement = True

            needs_confirmation = (top_conf < 0.85) or disagreement

            # Standardize valueSource per Requirement Section 16
            if top_src == "ocr_color_fusion":
                final_source = "ocr_color_fusion"
            elif top_src == "color_code":
                final_source = "color_code"
            elif top_conf >= 0.85:
                final_source = "ocr_consensus"
            else:
                final_source = "ocr"

            if needs_confirmation:
                final_source = "user_required"

            return {
                "id": comp_id,
                "type": comp_type,
                "value": top_val if not needs_confirmation else None,
                "unit": top_unit,
                "displayValue": top_fmt,
                "valueSource": final_source,
                "confidence": round(top_conf, 2),
                "needsConfirmation": needs_confirmation,
                "rawCandidates": raw_candidates_list
            }

    except Exception as e:
        print(f"[Consensus] Value consensus failure: {e}")

    return build_fallback_response(comp_type, comp_id, "Consensus processing failure.")


def build_fallback_response(comp_type: str, comp_id: str, reason: str) -> Dict[str, Any]:
    """Helper to generate fallback user_required response when value is uncertain."""
    default_unit = "Ω" if "resistor" in comp_type.lower() else ("F" if "cap" in comp_type.lower() else ("H" if "ind" in comp_type.lower() else "V"))
    return {
        "id": comp_id,
        "type": comp_type,
        "value": None,
        "unit": default_unit,
        "displayValue": "Not confidently detected",
        "valueSource": "user_required",
        "confidence": 0.0,
        "needsConfirmation": True,
        "rawCandidates": []
    }
