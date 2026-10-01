# NeuroVision AI — Backend API

FastAPI backend for Brain Tumor MRI Classification using an EfficientNet-B0 deep learning model.

## Features
- **FastAPI** with async architecture and interactive Swagger documentation at `/docs`
- **PyTorch** inference using transfer-learned EfficientNet-B0 with custom classifier
- **Deterministic Preprocessing**: Conservative brain contour crop, CLAHE contrast enhancement, 256x256 bicubic resize, and ImageNet normalization
- **Model Lifespan Management**: Model is loaded once on server startup and evaluated in `torch.no_grad()` mode
- **Automated Device Selection**: Automatically switches between CUDA GPU and CPU
- **Security & Validation**: In-memory file processing, mime-type verification, payload size guard, and CORS control

## Architecture

```
backend/
├── app/
│   ├── main.py                  # FastAPI entry point & lifespan
│   ├── api/routes/
│   │   ├── health.py            # GET / and GET /health
│   │   └── prediction.py        # POST /api/v1/predict
│   ├── core/
│   │   ├── config.py            # Pydantic Settings
│   │   └── logging_config.py    # Structured logging
│   ├── models/
│   │   └── classifier.py        # EfficientNet-B0 architecture
│   ├── schemas/
│   │   └── prediction.py        # Pydantic request & response models
│   ├── services/
│   │   ├── inference_service.py # Model loading & inference execution
│   │   └── preprocessing_service.py # Brain crop, CLAHE & tensor transforms
│   └── utils/
│       └── image_utils.py       # Extension & MIME validation
├── model/
│   └── brain_tumor_model.pth    # Trained PyTorch model checkpoint
├── tests/
│   ├── conftest.py              # TestClient and image fixtures
│   └── test_api.py              # Unit & integration tests
├── requirements.txt
├── Dockerfile
└── .env.example
```

## Setup & Running Locally

1. Create and activate a Python 3.10+ virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Ensure the model checkpoint is placed at `backend/model/brain_tumor_model.pth`.

4. Start the server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

5. Explore the interactive API documentation:
   Open [http://localhost:8000/docs](http://localhost:8000/docs) in your browser.

## Running Tests

```bash
pytest tests/ -v
```
