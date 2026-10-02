"""
NeuroVision AI — Brain MRI Classification API

FastAPI application entry point.
Loads the ML model once at startup and serves prediction endpoints.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.logging_config import setup_logging, get_logger
from app.api.routes import health, prediction
from app.services.inference_service import inference_service

settings = get_settings()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: load model on startup, cleanup on shutdown."""
    setup_logging(debug=settings.DEBUG)
    logger.info(f"Starting {settings.APP_NAME}")
    logger.info(f"Debug mode: {settings.DEBUG}")

    # Load model once at startup
    try:
        inference_service.load_model()
    except RuntimeError as e:
        logger.error(f"Model loading failed: {e}")
        logger.warning("Server will start but predictions will be unavailable.")

    yield

    # Cleanup on shutdown
    logger.info(f"Shutting down {settings.APP_NAME}")


app = FastAPI(
    title=settings.APP_NAME,
    description=(
        "Brain MRI Classification API using EfficientNet-B0. "
        "Classifies brain MRI images into: glioma, meningioma, no tumor, pituitary. "
        "Research/Educational use only — not a medical diagnostic tool."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
origins = settings.allowed_origins_list
has_wildcard = "*" in origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if has_wildcard else origins,
    allow_credentials=False if has_wildcard else True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router)
app.include_router(prediction.router, prefix=settings.API_PREFIX)
