"""
Pytest fixtures for backend API tests.
Provides synthetic valid MRI scans and various non-MRI test images.
"""

import io
import cv2
import numpy as np
import pytest
from PIL import Image, ImageDraw
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture(scope="session")
def client():
    """Test client for FastAPI app."""
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def valid_mri_image_bytes():
    """Generate in-memory valid Brain MRI JPEG image (256x256) with anatomical structure."""
    arr = np.zeros((256, 256), dtype=np.uint8)
    # Draw brain parenchyma
    cv2.ellipse(arr, (128, 128), (80, 95), 0, 0, 360, 110, -1)
    # Draw skull border
    cv2.ellipse(arr, (128, 128), (82, 97), 0, 0, 360, 190, 2)
    # Draw ventricles
    cv2.circle(arr, (115, 115), 15, 60, -1)
    cv2.circle(arr, (141, 115), 15, 60, -1)

    # Encode as JPEG
    _, encoded = cv2.imencode(".jpg", arr)
    return encoded.tobytes()


@pytest.fixture
def color_photo_image_bytes():
    """Generate a colorful natural image (blue sky + green field)."""
    arr = np.zeros((256, 256, 3), dtype=np.uint8)
    arr[:128, :, 0] = 220  # Blue
    arr[:128, :, 2] = 40   # Red
    arr[128:, :, 1] = 190  # Green
    _, encoded = cv2.imencode(".jpg", arr)
    return encoded.tobytes()


@pytest.fixture
def white_document_image_bytes():
    """Generate a white document / screenshot with black text."""
    img = Image.new("RGB", (256, 256), color=(250, 250, 250))
    d = ImageDraw.Draw(img)
    d.text((20, 40), "Medical Report Notes\nPatient Name: John Doe", fill=(10, 10, 10))
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG")
    return buffer.getvalue()


@pytest.fixture
def blank_image_bytes():
    """Generate a solid flat gray image with zero contrast."""
    img = Image.new("RGB", (256, 256), color=(128, 128, 128))
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG")
    return buffer.getvalue()


@pytest.fixture
def invalid_text_file_bytes():
    """Generate invalid file bytes (plain text)."""
    return b"This is not a valid MRI image file."
