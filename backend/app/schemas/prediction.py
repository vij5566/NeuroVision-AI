"""
Pydantic schemas for API request/response models.
"""

from pydantic import BaseModel, Field


# Class descriptions — informational, non-medical
CLASS_DESCRIPTIONS: dict[str, str] = {
    "glioma": (
        "A category of brain tumor originating from glial cells. "
        "Gliomas can vary in aggressiveness and location within the brain."
    ),
    "meningioma": (
        "A tumor arising from the meninges, the protective membranes "
        "surrounding the brain and spinal cord. Often slow-growing."
    ),
    "notumor": (
        "No tumor detected. The model did not identify tumor-like "
        "features in the analyzed MRI image."
    ),
    "pituitary": (
        "A tumor involving the pituitary gland, located at the base "
        "of the brain. These tumors can affect hormone production."
    ),
}


class PredictionResponse(BaseModel):
    """Response schema for the prediction endpoint."""

    prediction: str = Field(
        ..., description="Predicted class name", examples=["glioma"]
    )
    confidence: float = Field(
        ..., description="Confidence score (0-1)", ge=0.0, le=1.0, examples=[0.942]
    )
    probabilities: dict[str, float] = Field(
        ..., description="Probability distribution across all classes"
    )
    class_descriptions: dict[str, str] = Field(
        default=CLASS_DESCRIPTIONS,
        description="Informational descriptions of each class",
    )
    model_name: str = Field(
        default="EfficientNet-B0", description="Model architecture used"
    )
    image_size: str = Field(
        default="256x256", description="Input image dimensions"
    )
    inference_time_ms: float = Field(
        ..., description="Inference time in milliseconds", examples=[45.2]
    )
    gradcam_heatmap: str | None = Field(
        default=None,
        description="Base64-encoded Grad-CAM attention heatmap overlay image",
    )


class HealthResponse(BaseModel):
    """Response schema for the health endpoint."""

    status: str = Field(..., description="Service health status", examples=["healthy"])
    model_loaded: bool = Field(
        ..., description="Whether the ML model is loaded and ready"
    )
    device: str = Field(
        ..., description="Compute device (cpu/cuda)", examples=["cpu"]
    )


class RootResponse(BaseModel):
    """Response schema for the root endpoint."""

    message: str = Field(..., description="API name", examples=["NeuroVision AI API"])
    status: str = Field(..., description="API status", examples=["running"])
    version: str = Field(..., description="API version", examples=["1.0.0"])


class ErrorResponse(BaseModel):
    """Response schema for error responses."""

    detail: str = Field(..., description="Error description")
