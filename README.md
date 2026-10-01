# NeuroVision AI

> **Research/Educational Use Only** — This application is a machine-learning research demonstration and is not a medical diagnostic tool. Predictions should not be used for medical decisions. Always consult a qualified healthcare professional for medical evaluation.

---

## Overview

**NeuroVision AI** is a production-style, full-stack deep learning web application designed for multiclass Brain Tumor MRI classification. Users can upload a brain MRI scan (JPG, PNG, or WEBP), and the system executes real-time inference using a transfer-learned **EfficientNet-B0** convolutional neural network.

The system returns:
- **Predicted Class** (`glioma`, `meningioma`, `notumor`, or `pituitary`)
- **Confidence Score**
- **Complete Probability Distribution** across all four classes
- **Domain Context** explaining the predicted category

---

## Features

- **Modern Medical-AI Frontend**: Built with React, Vite, and Tailwind CSS. Features dark theme aesthetics, glassmorphism cards, drag-and-drop file upload, live image preview, animated loaders, and responsive probability distribution charts.
- **Robust FastAPI Backend**: Clean modular architecture separating routing, schemas, model execution, and preprocessing services.
- **Exact Pipeline Reproduction**: Backend mirrors the training preprocessing pipeline identically (conservative brain crop, CLAHE enhancement, bicubic resize, and ImageNet normalization).
- **Single-Load Lifespan Pattern**: The PyTorch model checkpoint is loaded once into memory during server startup and evaluated under `torch.no_grad()` to maximize throughput.
- **Hardware Agnostic**: Automatic device selection using CUDA acceleration when available, with seamless fallback to CPU.
- **Explainable AI (Grad-CAM)**: Real-time Gradient-weighted Class Activation Mapping hooks into `model.features[-1]` to compute spatial attention heatmaps. The frontend offers an interactive toggle between Heatmap Overlay and Side-by-Side comparison to show exactly which cranial regions influenced the prediction.
- **Exportable Clinical Diagnostic Report (PDF)**: 1-click clinical summary report generator featuring side-by-side visual evidence, primary findings, full probability distribution, pathology notes, and browser print-to-PDF formatting.
- **Interactive Model Specs & Benchmark Dashboard**: Built-in modal presenting 2-stage transfer learning architecture, Focal Loss formulation, test confusion matrix (1,600 test scans), macro F1 (95.4%), and parameter statistics.
- **1-Click Demo Gallery**: Built-in sample gallery with verified MRI scans across all four classes enables instant testing without needing local image files.
- **Robust Out-of-Distribution Guard**: Automated physical MRI validation rejects non-MRI uploads (color photos, documents, screenshots, blank images) with clear medical guidance.
- **Production-Ready Defensive API**: Mime-type checking, file extension validation, payload size enforcement, structured error handling without stack trace leakage, and configurable CORS.
- **Docker Support**: Multi-stage Dockerfiles for both backend and frontend, orchestratable via `docker compose`.

---

## Architecture

```
React (Vite + Tailwind CSS)
   ↓  (multipart/form-data upload)
FastAPI (/api/v1/predict)
   ↓  (In-memory buffer)
Preprocessing Service
   ├─ Conservative Brain Crop (OpenCV contour detection)
   ├─ CLAHE Enhancement (LAB color space)
   ├─ Resize to 256×256 (Bicubic)
   └─ ImageNet Normalization (mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
   ↓  (Tensor shape [1, 3, 256, 256])
EfficientNet-B0 (Inference Service)
   ↓  (Softmax activation)
Prediction & Probabilities
   ↓  (Pydantic Response Model)
Interactive UI Visualization
```

---

## Model

- **Architecture**: `EfficientNet-B0` with transfer learning
- **Classifier Head**:
  - `Dropout(p=0.4, inplace=True)`
  - `Linear(in_features=1280, out_features=4)`
- **Loss Function**: Focal Loss ($\gamma = 2.0$)
- **Checkpoint Location**: `backend/model/brain_tumor_model.pth`

---

## Classes

| Index | Class Name | Description |
|---|---|---|
| `0` | **Glioma** | A category of brain tumor originating from glial cells. |
| `1` | **Meningioma** | A tumor arising from the meninges surrounding the brain and spinal cord. |
| `2` | **No Tumor** | No tumor detected in the analyzed MRI scan. |
| `3` | **Pituitary** | A tumor involving the pituitary gland at the base of the brain. |

---

## Preprocessing

Inference follows the exact deterministic steps established during model training:

1. **Brain Region Crop**: Image converted to grayscale; threshold applied (threshold=10) to segment foreground brain from black background; largest contour detected and bounded with ~10% safety padding.
2. **CLAHE**: Image converted to LAB space; Contrast Limited Adaptive Histogram Equalization (`clipLimit=2.0`, `tileGridSize=(8,8)`) applied to L channel; converted back to RGB.
3. **Resize**: Resized to 256×256 pixels using bicubic interpolation.
4. **Tensor Conversion**: Normalized to $[0, 1]$ floating-point tensor.
5. **ImageNet Normalization**:
   - `mean = [0.485, 0.456, 0.406]`
   - `std = [0.229, 0.224, 0.225]`

---

## API Endpoints

### 1. Root
- **`GET /`**
- Returns basic API metadata and service status.
```json
{
  "message": "NeuroVision AI API",
  "status": "running",
  "version": "1.0.0"
}
```

### 2. Health Check
- **`GET /health`**
- Returns health status, compute device, and whether the model checkpoint is loaded.
```json
{
  "status": "healthy",
  "model_loaded": true,
  "device": "cpu"
}
```

### 3. Prediction
- **`POST /api/v1/predict`**
- **Content-Type**: `multipart/form-data`
- **Field**: `file` (JPG, JPEG, PNG, WEBP; max 10MB)
```json
{
  "prediction": "glioma",
  "confidence": 0.942,
  "probabilities": {
    "glioma": 0.942,
    "meningioma": 0.028,
    "notumor": 0.011,
    "pituitary": 0.019
  },
  "class_descriptions": {
    "glioma": "A category of brain tumor originating from glial cells...",
    "meningioma": "A tumor arising from the meninges...",
    "notumor": "No tumor detected...",
    "pituitary": "A tumor involving the pituitary gland..."
  },
  "model_name": "EfficientNet-B0",
  "image_size": "256x256",
  "inference_time_ms": 42.5
}
```

Interactive OpenAPI documentation is automatically available at **`http://localhost:8000/docs`**.

---

## Project Structure

```
NeuroVision AI/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   │       ├── health.py             # Root and /health endpoints
│   │   │       └── prediction.py         # /predict multipart endpoint
│   │   ├── core/
│   │   │   ├── config.py                 # Pydantic Settings
│   │   │   └── logging_config.py         # Formatted console logging
│   │   ├── models/
│   │   │   └── classifier.py             # EfficientNet-B0 architecture
│   │   ├── schemas/
│   │   │   └── prediction.py             # Pydantic request/response schemas
│   │   ├── services/
│   │   │   ├── inference_service.py      # Model loader & forward pass
│   │   │   └── preprocessing_service.py  # Brain crop, CLAHE, transforms
│   │   ├── utils/
│   │   │   └── image_utils.py            # Extension & MIME validators
│   │   └── main.py                       # FastAPI application & lifespan
│   │
│   ├── model/
│   │   └── brain_tumor_model.pth         # PyTorch trained weights
│   ├── tests/
│   │   ├── conftest.py                   # Test fixtures & synthetic images
│   │   └── test_api.py                   # Pytest test suite
│   ├── requirements.txt                  # Strict backend dependencies
│   ├── Dockerfile                        # Multi-stage container file
│   ├── .env.example                      # Configuration template
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx                # Top navigation header
│   │   │   ├── HeroSection.jsx           # Landing hero banner
│   │   │   ├── UploadCard.jsx            # Drag-and-drop zone
│   │   │   ├── ImagePreview.jsx          # Selected image preview card
│   │   │   ├── AnalysisLoader.jsx        # Inference loading animation
│   │   │   ├── PredictionResult.jsx      # Results display card
│   │   │   ├── ProbabilityChart.jsx      # Horizontal probability bars
│   │   │   ├── Disclaimer.jsx            # Research/Educational disclaimer
│   │   │   └── Footer.jsx                # App footer
│   │   ├── hooks/
│   │   │   └── usePrediction.js          # File & API state machine hook
│   │   ├── services/
│   │   │   └── api.js                    # Fetch client for backend
│   │   ├── utils/
│   │   │   └── constants.js              # Class names, colors, limits
│   │   ├── App.jsx                       # Main reactive view orchestrator
│   │   ├── main.jsx                      # Vite entry point
│   │   └── index.css                     # Tailwind styling & animations
│   ├── index.html
│   ├── vite.config.js
│   ├── nginx.conf                        # Production Nginx reverse proxy
│   ├── Dockerfile
│   ├── package.json
│   └── README.md
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## Environment Variables

### Backend (`backend/.env`)
```bash
MODEL_PATH=./model/brain_tumor_model.pth
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
MAX_FILE_SIZE_MB=10
API_PREFIX=/api/v1
DEBUG=false
```

### Frontend (`frontend/.env`)
```bash
VITE_API_BASE_URL=http://localhost:8000
```

---

## Running Locally

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+** & `npm`

### 2. Backend Setup
```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the backend
uvicorn app.main:app --reload --port 8000
```
Backend API will be accessible at: `http://localhost:8000` (Docs: `http://localhost:8000/docs`).

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Frontend will be accessible at: `http://localhost:5173`.

---

## Running Tests

Execute backend API tests with `pytest`:
```bash
cd backend
pytest tests/ -v
```

---

## Docker Deployment

To build and launch the complete stack with a single command:
```bash
docker compose up --build
```
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`

---

## Limitations

- The model classifies exclusively among the 4 trained classes (`glioma`, `meningioma`, `notumor`, `pituitary`). Non-brain or out-of-distribution images will still map to one of these classes.
- Model performance depends upon proper MRI slice orientation and typical structural imaging sequences (T1-weighted, contrast-enhanced T1, or T2).

---

## Disclaimer

**RESEARCH & EDUCATIONAL USE ONLY**:
This application is developed strictly for educational, scientific, and research purposes. It is **not** a certified medical diagnostic device and must **not** be used to guide clinical decisions, medical treatment, or patient diagnosis. Always consult a qualified medical professional for health evaluation.
