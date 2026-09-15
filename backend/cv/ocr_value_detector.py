"""
SmartBreadboard 3D — OCR Component Value Extraction Module
Strips cropped component region, preprocesses with OpenCV, attempts text/value OCR, and uses value_parser for standard values.
"""

import base64
import cv2
import numpy as np
from typing import Dict, Any, Optional, Tuple
from cv.value_consensus import extract_value_consensus_from_crop

def extract_value_from_crop(crop_base64: str, comp_type: str = "resistor", comp_id: str = "R1") -> Dict[str, Any]:
    """
    Attempts to read component markings using multi-pass consensus engine.
    If OCR/color confidence is low or unparsable, returns valueSource = 'user_required' with candidates.
    """
    return extract_value_consensus_from_crop(crop_base64, comp_type, comp_id)

