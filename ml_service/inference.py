"""
Service layer for ML inference
"""
from typing import Dict
import os

def run_inference(image_path: str) -> Dict:
    """
    Run inference on an image and return results
    """
    # Import here to avoid loading PyTorch unless needed
    from .model import predict_mudra
    
    # Validate input
    if not os.path.exists(image_path):
        return {
            "error": f"Image file not found: {image_path}",
            "predicted_mudra": "Error",
            "confidence": 0.0,
            "sanskrit_name": "",
            "meaning": "Image file not found",
            "description": ""
        }
    
    # Run prediction
    result = predict_mudra(image_path)
    
    return result
