"""
Inference service for brain tumor classification.
Handles model loading (once at startup) and prediction.
"""

import time
from pathlib import Path

import torch
import torch.nn.functional as F

from app.core.config import get_settings
from app.core.logging_config import get_logger
from app.models.classifier import create_model, CLASS_NAMES
from app.services.preprocessing_service import preprocess_image_and_rgb
from app.services.gradcam_service import gradcam_service

logger = get_logger(__name__)


class InferenceService:
    """
    Singleton-style inference service.
    Loads the model once and provides prediction capability.
    """

    def __init__(self) -> None:
        self.model: torch.nn.Module | None = None
        self.device: torch.device = torch.device(
            "cuda" if torch.cuda.is_available() else "cpu"
        )
        self.model_loaded: bool = False
        self.class_names: list[str] = CLASS_NAMES

    def load_model(self) -> None:
        """
        Load the trained model checkpoint.
        Handles both wrapped (model_state_dict key) and raw state_dict formats.

        Raises:
            FileNotFoundError: If model file doesn't exist
            RuntimeError: If checkpoint cannot be loaded
        """
        settings = get_settings()
        configured_path = Path(settings.MODEL_PATH)

        backend_dir = Path(__file__).resolve().parent.parent.parent
        project_root = backend_dir.parent

        candidate_paths = [
            configured_path,
            backend_dir / configured_path,
            backend_dir / "model" / "brain_tumor_model.pth",
            backend_dir / "model" / "brain_tumor_efficientnet_b0_focal.pth",
            project_root / "brain_tumor_efficientnet_b0_focal.pth",
            project_root / "backend" / "model" / "brain_tumor_model.pth",
            Path("backend/model/brain_tumor_model.pth"),
            Path("model/brain_tumor_model.pth"),
        ]

        model_path = None
        for candidate in candidate_paths:
            if candidate.exists() and candidate.is_file():
                model_path = candidate
                break

        if model_path is None:
            logger.warning(
                f"Model file not found at '{configured_path}'. "
                "The server will start but predictions will be unavailable. "
                "Place brain_tumor_model.pth in the backend/model/ directory."
            )
            self.model_loaded = False
            return

        logger.info(f"Loading model from '{model_path}' on device '{self.device}'")

        try:
            # Create model architecture
            self.model = create_model()

            # Load checkpoint
            checkpoint = torch.load(
                model_path,
                map_location=self.device,
                weights_only=False,
            )

            # Handle different checkpoint formats
            if isinstance(checkpoint, dict) and "model_state_dict" in checkpoint:
                state_dict = checkpoint["model_state_dict"]
                logger.info("Loaded model_state_dict from checkpoint")
            elif isinstance(checkpoint, dict) and "state_dict" in checkpoint:
                state_dict = checkpoint["state_dict"]
                logger.info("Loaded state_dict from checkpoint")
            elif isinstance(checkpoint, dict):
                # Assume the dict itself is the state_dict
                state_dict = checkpoint
                logger.info("Loaded raw state_dict from checkpoint")
            else:
                raise RuntimeError(
                    "Unexpected checkpoint format. Expected a state_dict or "
                    "a dict with 'model_state_dict' key."
                )

            self.model.load_state_dict(state_dict)
            self.model.to(self.device)
            self.model.eval()
            self.model_loaded = True

            logger.info(
                f"Model loaded successfully | Device: {self.device} | "
                f"Classes: {self.class_names}"
            )

        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            self.model = None
            self.model_loaded = False
            raise RuntimeError(f"Model loading failed: {e}") from e

    def predict(self, image_bytes: bytes) -> dict:
        """
        Run inference on uploaded image bytes.

        Args:
            image_bytes: Raw image file bytes

        Returns:
            Dictionary with prediction, confidence, probabilities, and metadata

        Raises:
            RuntimeError: If model is not loaded
            ValueError: If image cannot be processed
        """
        if not self.model_loaded or self.model is None:
            raise RuntimeError(
                "Model is not loaded. Please ensure brain_tumor_model.pth "
                "is in the backend/model/ directory and restart the server."
            )

        start_time = time.time()

        # Preprocess image and retain RGB array for Grad-CAM
        tensor, preprocessed_rgb = preprocess_image_and_rgb(image_bytes)
        tensor = tensor.to(self.device)

        # Run inference
        with torch.no_grad():
            outputs = self.model(tensor)
            probabilities = F.softmax(outputs, dim=1)

        # Extract results
        probs = probabilities.squeeze().cpu().numpy()
        predicted_idx = int(probs.argmax())
        predicted_class = self.class_names[predicted_idx]
        confidence = float(probs[predicted_idx])

        # Compute Grad-CAM visual attention heatmap overlay
        gradcam_overlay = gradcam_service.generate_heatmap(
            model=self.model,
            input_tensor=tensor,
            target_class_idx=predicted_idx,
            preprocessed_rgb=preprocessed_rgb,
        )

        # Build probability dict with all classes
        prob_dict = {
            name: round(float(probs[i]), 4)
            for i, name in enumerate(self.class_names)
        }

        elapsed = time.time() - start_time

        logger.info(
            f"Prediction: {predicted_class} | "
            f"Confidence: {confidence:.4f} | "
            f"Time: {elapsed:.3f}s"
        )

        return {
            "prediction": predicted_class,
            "confidence": round(confidence, 4),
            "probabilities": prob_dict,
            "gradcam_heatmap": gradcam_overlay,
            "model_name": "EfficientNet-B0",
            "image_size": "256x256",
            "inference_time_ms": round(elapsed * 1000, 1),
        }


# Global inference service instance
inference_service = InferenceService()
