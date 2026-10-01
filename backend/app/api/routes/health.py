"""
Health and root API routes.
"""

from fastapi import APIRouter
from app.schemas.prediction import HealthResponse, RootResponse
from app.services.inference_service import inference_service

router = APIRouter(tags=["Health"])


@router.get(
    "/",
    response_model=RootResponse,
    summary="API Root",
    description="Returns basic API information and status.",
)
async def root() -> RootResponse:
    return RootResponse(
        message="NeuroVision AI API",
        status="running",
        version="1.0.0",
    )


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health Check",
    description="Returns service health status including model loading state and compute device.",
)
async def health_check() -> HealthResponse:
    return HealthResponse(
        status="healthy" if inference_service.model_loaded else "degraded",
        model_loaded=inference_service.model_loaded,
        device=str(inference_service.device),
    )
