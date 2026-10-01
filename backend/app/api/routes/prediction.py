"""
Prediction API route.
Handles MRI image upload, validation, and inference.
"""

from fastapi import APIRouter, File, HTTPException, UploadFile
from app.core.config import get_settings
from app.core.logging_config import get_logger
from app.schemas.prediction import CLASS_DESCRIPTIONS, ErrorResponse, PredictionResponse
from app.services.inference_service import inference_service
from app.utils.image_utils import (
    validate_content_type,
    validate_file_extension,
    validate_mri_image,
)

logger = get_logger(__name__)
settings = get_settings()

router = APIRouter(tags=["Prediction"])


@router.post(
    "/predict",
    response_model=PredictionResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Invalid image file"},
        413: {"model": ErrorResponse, "description": "File too large"},
        503: {"model": ErrorResponse, "description": "Model not available"},
        500: {"model": ErrorResponse, "description": "Inference error"},
    },
    summary="Classify Brain MRI",
    description=(
        "Upload a brain MRI image for classification. "
        "The model predicts one of four classes: glioma, meningioma, notumor, pituitary. "
        "Returns the predicted class, confidence score, and probability distribution."
    ),
)
async def predict(file: UploadFile = File(..., description="Brain MRI image file")) -> PredictionResponse:
    """Classify an uploaded brain MRI image."""

    # Validate file exists and has a name
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file was uploaded.")

    # Validate file extension
    if not validate_file_extension(file.filename):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Supported formats: JPG, JPEG, PNG, WEBP.",
        )

    # Validate content type
    if not validate_content_type(file.content_type):
        raise HTTPException(
            status_code=400,
            detail="Invalid content type. Please upload a valid image file.",
        )

    # Check if model is loaded
    if not inference_service.model_loaded:
        raise HTTPException(
            status_code=503,
            detail=(
                "Model is not currently available. "
                "Please ensure the model file is placed in the correct directory "
                "and restart the server."
            ),
        )

    # Read file bytes
    try:
        image_bytes = await file.read()
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Unable to read the uploaded file.",
        )

    # Validate file size
    if len(image_bytes) > settings.max_file_size_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {settings.MAX_FILE_SIZE_MB}MB.",
        )

    # Validate non-empty file
    if len(image_bytes) == 0:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is empty.",
        )

    # Domain-specific Brain MRI verification
    is_valid_mri, mri_error_msg = validate_mri_image(image_bytes)
    if not is_valid_mri:
        logger.warning(f"Rejected non-MRI upload '{file.filename}': {mri_error_msg}")
        raise HTTPException(
            status_code=400,
            detail=mri_error_msg,
        )

    # Run inference
    try:
        result = inference_service.predict(image_bytes)
    except ValueError as e:
        logger.error(f"Image processing error: {e}")
        raise HTTPException(
            status_code=400,
            detail="Unable to process the uploaded image. Please ensure it is a valid MRI image.",
        )
    except RuntimeError as e:
        logger.error(f"Inference error: {e}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred during inference. Please try again.",
        )
    except Exception as e:
        logger.error(f"Unexpected error during prediction: {e}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred. Please try again.",
        )

    # Return structured response
    return PredictionResponse(
        prediction=result["prediction"],
        confidence=result["confidence"],
        probabilities=result["probabilities"],
        class_descriptions=CLASS_DESCRIPTIONS,
        model_name=result["model_name"],
        image_size=result["image_size"],
        inference_time_ms=result["inference_time_ms"],
    )
