"""
API endpoint tests for NeuroVision AI.
Tests root, health, file validation, non-MRI rejection, and prediction endpoints.
"""

import io


def test_root_endpoint(client):
    """Test GET / returns 200 with API status message."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "NeuroVision AI API"
    assert data["status"] == "running"
    assert "version" in data


def test_health_endpoint(client):
    """Test GET /health returns status, device, and model_loaded flag."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["healthy", "degraded"]
    assert isinstance(data["model_loaded"], bool)
    assert "device" in data


def test_predict_no_file(client):
    """Test POST /api/v1/predict with missing file returns 422 Unprocessable Entity."""
    response = client.post("/api/v1/predict")
    assert response.status_code == 422


def test_predict_invalid_extension(client, invalid_text_file_bytes):
    """Test POST /api/v1/predict with .txt file returns 400 Bad Request."""
    files = {
        "file": ("test.txt", io.BytesIO(invalid_text_file_bytes), "text/plain")
    }
    response = client.post("/api/v1/predict", files=files)
    assert response.status_code == 400
    data = response.json()
    assert "Invalid file type" in data["detail"] or "Invalid content type" in data["detail"]


def test_predict_corrupted_image(client):
    """Test POST /api/v1/predict with corrupted image data returns 400."""
    files = {
        "file": ("corrupt.jpg", io.BytesIO(b"fake-bytes-not-an-image"), "image/jpeg")
    }
    response = client.post("/api/v1/predict", files=files)
    assert response.status_code == 400
    data = response.json()
    assert "Unable to decode" in data["detail"] or "Invalid" in data["detail"]


def test_predict_reject_color_photo(client, color_photo_image_bytes):
    """Test POST /api/v1/predict rejects natural color photos."""
    files = {
        "file": ("nature_photo.jpg", io.BytesIO(color_photo_image_bytes), "image/jpeg")
    }
    response = client.post("/api/v1/predict", files=files)
    assert response.status_code == 400
    data = response.json()
    assert "color information" in data["detail"].lower()


def test_predict_reject_white_document(client, white_document_image_bytes):
    """Test POST /api/v1/predict rejects white document / text screenshot."""
    files = {
        "file": ("document.jpg", io.BytesIO(white_document_image_bytes), "image/jpeg")
    }
    response = client.post("/api/v1/predict", files=files)
    assert response.status_code == 400
    data = response.json()
    assert "typical brain mri characteristics" in data["detail"].lower() or "background" in data["detail"].lower()


def test_predict_reject_blank_image(client, blank_image_bytes):
    """Test POST /api/v1/predict rejects solid blank image with no contrast."""
    files = {
        "file": ("blank.jpg", io.BytesIO(blank_image_bytes), "image/jpeg")
    }
    response = client.post("/api/v1/predict", files=files)
    assert response.status_code == 400
    data = response.json()
    assert "contrast" in data["detail"].lower() or "structure" in data["detail"].lower()


def test_predict_valid_mri_image(client, valid_mri_image_bytes):
    """Test POST /api/v1/predict accepts genuine / anatomical Brain MRI scans."""
    files = {
        "file": ("brain_scan.jpg", io.BytesIO(valid_mri_image_bytes), "image/jpeg")
    }
    response = client.post("/api/v1/predict", files=files)

    if response.status_code == 200:
        data = response.json()
        assert "prediction" in data
        assert data["prediction"] in ["glioma", "meningioma", "notumor", "pituitary"]
        assert 0.0 <= data["confidence"] <= 1.0
        assert "probabilities" in data
        assert len(data["probabilities"]) == 4
        assert "model_name" in data
        assert data["image_size"] == "256x256"
        assert "inference_time_ms" in data
    else:
        assert response.status_code == 503
        data = response.json()
        assert "detail" in data
