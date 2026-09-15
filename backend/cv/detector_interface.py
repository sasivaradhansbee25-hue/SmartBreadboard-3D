"""
SmartBreadboard 3D — Extensible Component Detector Architecture
Defines base ComponentDetector interface supporting existing YOLO model, color analysis, and future inductor/source detectors.
"""

from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional

class ComponentDetector(ABC):
    """Abstract Base Class for Component Detectors"""

    @abstractmethod
    def detect(self, image_base64: str, conf_threshold: float = 0.45) -> List[Dict[str, Any]]:
        """Given base64 image, returns list of detected component dictionaries."""
        pass

    @abstractmethod
    def supported_classes(self) -> List[str]:
        """Returns supported component class names."""
        pass


class ExistingYOLODetector(ComponentDetector):
    """Wrapper around existing production YOLOv8n model (6 active classes)."""

    def __init__(self):
        from cv.yolo_detector import detect_components_yolo
        self._yolo_func = detect_components_yolo

    def supported_classes(self) -> List[str]:
        return ["resistor", "diode_rectifier", "ic_chip", "wire", "capacitor", "led"]

    def detect(self, image_base64: str, conf_threshold: float = 0.45) -> List[Dict[str, Any]]:
        res = self._yolo_func(image_base64, conf_threshold=conf_threshold)
        return res.get("detections", [])


class FutureInductorDetector(ComponentDetector):
    """
    Extensible detector for Inductors and specialized components.
    When a trained Inductor YOLO model is available, this module connects directly without breaking core pipeline.
    """

    def __init__(self, model_path: Optional[str] = None):
        self.model_path = model_path

    def supported_classes(self) -> List[str]:
        return ["inductor", "voltage_source", "current_source", "ground"]

    def detect(self, image_base64: str, conf_threshold: float = 0.45) -> List[Dict[str, Any]]:
        # Future implementation when model is available. Returns empty list currently.
        return []


class CompositeComponentDetector(ComponentDetector):
    """Aggregates multiple detectors in sequence."""

    def __init__(self, detectors: Optional[List[ComponentDetector]] = None):
        if detectors is None:
            self.detectors = [ExistingYOLODetector(), FutureInductorDetector()]
        else:
            self.detectors = detectors

    def supported_classes(self) -> List[str]:
        classes = []
        for d in self.detectors:
            classes.extend(d.supported_classes())
        return list(set(classes))

    def detect(self, image_base64: str, conf_threshold: float = 0.45) -> List[Dict[str, Any]]:
        all_detections = []
        for detector in self.detectors:
            try:
                dets = detector.detect(image_base64, conf_threshold=conf_threshold)
                all_detections.extend(dets)
            except Exception as e:
                print(f"[CompositeComponentDetector] Warning: {detector.__class__.__name__} failed: {e}")
        return all_detections
