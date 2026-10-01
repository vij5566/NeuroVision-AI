"""
Grad-CAM (Gradient-weighted Class Activation Mapping) service.
Generates visual attention heatmaps indicating regions of interest for predictions.
Faithfully reproduces the Grad-CAM implementation from training (Cell 48-50).
"""

import base64
import cv2
import numpy as np
import torch
import torch.nn as nn
from app.core.logging_config import get_logger

logger = get_logger(__name__)


class GradCAMService:
    """Computes Grad-CAM attention heatmaps for EfficientNet-B0."""

    def __init__(self):
        self.activations: torch.Tensor | None = None
        self.gradients: torch.Tensor | None = None

    def _save_activation(self, module: nn.Module, input: tuple, output: torch.Tensor) -> None:
        self.activations = output

    def _save_gradient(self, module: nn.Module, grad_input: tuple, grad_output: tuple) -> None:
        self.gradients = grad_output[0]

    def generate_heatmap(
        self,
        model: nn.Module,
        input_tensor: torch.Tensor,
        target_class_idx: int,
        preprocessed_rgb: np.ndarray,
    ) -> str | None:
        """
        Generate base64 data URL for Grad-CAM overlay on the preprocessed MRI image.

        Args:
            model: PyTorch model (EfficientNet-B0)
            input_tensor: Shape (1, 3, 256, 256) on target device
            target_class_idx: Predicted class index (0-3)
            preprocessed_rgb: RGB image array of shape (256, 256, 3), dtype uint8

        Returns:
            Base64 data URL string (e.g. 'data:image/jpeg;base64,...') or None on failure.
        """
        target_layer = model.features[-1]
        forward_hook = target_layer.register_forward_hook(self._save_activation)
        backward_hook = target_layer.register_full_backward_hook(self._save_gradient)

        try:
            with torch.enable_grad():
                # Clone tensor to retain graph if needed
                tensor_clone = input_tensor.clone().requires_grad_(True)
                model.zero_grad()
                output = model(tensor_clone)
                score = output[0, target_class_idx]
                score.backward()

                if self.activations is None or self.gradients is None:
                    logger.warning("Grad-CAM: activations or gradients were not captured.")
                    return None

                activations = self.activations.detach().cpu().squeeze(0)
                gradients = self.gradients.detach().cpu().squeeze(0)

                # Global Average Pooling of gradients over spatial dimensions
                weights = gradients.mean(dim=(1, 2))

                # Weighted sum of activation maps
                cam = (weights[:, None, None] * activations).sum(dim=0)
                cam = torch.relu(cam).numpy()

                # Normalize to [0, 1]
                cam = cam - cam.min()
                cam = cam / (cam.max() + 1e-8)

                # Resize to target image dimensions
                h, w = preprocessed_rgb.shape[:2]
                cam_resized = cv2.resize(cam, (w, h), interpolation=cv2.INTER_CUBIC)

                # Generate ColorMap JET heatmap
                heatmap = np.uint8(255 * cam_resized)
                heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
                heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)

                # Blend overlay: 50% MRI + 50% Heatmap
                overlay = 0.5 * preprocessed_rgb + 0.5 * heatmap
                overlay = np.uint8(np.clip(overlay, 0, 255))

                # Encode overlay to base64 JPEG
                overlay_bgr = cv2.cvtColor(overlay, cv2.COLOR_RGB2BGR)
                success, encoded_buf = cv2.imencode(".jpg", overlay_bgr, [cv2.IMWRITE_JPEG_QUALITY, 90])
                if not success:
                    return None

                base64_str = base64.b64encode(encoded_buf.tobytes()).decode("utf-8")
                return f"data:image/jpeg;base64,{base64_str}"

        except Exception as e:
            logger.error(f"Grad-CAM generation failed: {e}")
            return None
        finally:
            forward_hook.remove()
            backward_hook.remove()
            self.activations = None
            self.gradients = None


gradcam_service = GradCAMService()
