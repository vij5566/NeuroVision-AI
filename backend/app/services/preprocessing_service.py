"""
Image preprocessing service for brain MRI classification.
Reproduces the exact preprocessing pipeline used during training:
1. Conservative brain-region crop
2. CLAHE enhancement
3. Resize to 256x256 (BICUBIC)
4. Convert to tensor
5. ImageNet normalization
"""

import cv2
import numpy as np
import torch
from app.core.logging_config import get_logger

logger = get_logger(__name__)

# ImageNet normalization statistics — must match training
IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]
TARGET_SIZE = (256, 256)


def crop_brain(image: np.ndarray) -> np.ndarray:
    """
    Conservative brain-region crop using contour detection.

    Steps:
    1. Convert RGB to grayscale
    2. Apply binary threshold to isolate brain from background
    3. Find contours
    4. Select the largest contour (assumed to be the brain)
    5. Calculate bounding box with ~10% padding
    6. Crop within image boundaries

    Args:
        image: RGB numpy array (H, W, 3)

    Returns:
        Cropped RGB numpy array
    """
    if image is None or image.size == 0:
        return image

    gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)

    # Binary threshold to separate brain from dark background
    _, binary = cv2.threshold(gray, 10, 255, cv2.THRESH_BINARY)

    # Find contours
    contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    if not contours:
        logger.debug("No contours found during brain crop, returning original image")
        return image

    # Select the largest contour by area
    largest_contour = max(contours, key=cv2.contourArea)
    x, y, w, h = cv2.boundingRect(largest_contour)

    # Add ~10% padding
    img_h, img_w = image.shape[:2]
    pad_w = int(w * 0.1)
    pad_h = int(h * 0.1)

    # Crop safely within image boundaries
    x1 = max(0, x - pad_w)
    y1 = max(0, y - pad_h)
    x2 = min(img_w, x + w + pad_w)
    y2 = min(img_h, y + h + pad_h)

    cropped = image[y1:y2, x1:x2]

    # Safety check: ensure crop is not empty
    if cropped.size == 0:
        logger.debug("Brain crop resulted in empty image, returning original")
        return image

    return cropped


def apply_clahe(image: np.ndarray) -> np.ndarray:
    """
    Apply CLAHE (Contrast Limited Adaptive Histogram Equalization).

    Steps:
    1. Convert RGB to LAB color space
    2. Apply CLAHE to L (luminance) channel
    3. Convert LAB back to RGB

    Args:
        image: RGB numpy array (H, W, 3)

    Returns:
        Enhanced RGB numpy array
    """
    # Convert RGB to LAB
    lab = cv2.cvtColor(image, cv2.COLOR_RGB2LAB)

    # Apply CLAHE to L channel
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    lab[:, :, 0] = clahe.apply(lab[:, :, 0])

    # Convert LAB back to RGB
    enhanced = cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)
    return enhanced


def preprocess_image(image_bytes: bytes) -> torch.Tensor:
    """
    Full preprocessing pipeline matching training exactly.

    Pipeline:
    1. Decode image bytes to numpy array
    2. Convert BGR to RGB
    3. Conservative brain crop
    4. CLAHE enhancement
    5. Resize to 224x224
    6. Convert to float32 tensor [0, 1]
    7. Normalize with ImageNet statistics
    8. Add batch dimension

    Args:
        image_bytes: Raw image file bytes

    Returns:
        Preprocessed tensor of shape (1, 3, 224, 224)

    Raises:
        ValueError: If image cannot be decoded
    """
    # Decode image bytes
    nparr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if image is None:
        raise ValueError("Unable to decode the uploaded image")

    # Convert BGR (OpenCV default) to RGB
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # Step 1: Conservative brain crop
    image = crop_brain(image)

    # Step 2: CLAHE enhancement
    image = apply_clahe(image)

    # Step 3: Resize to target size
    image = cv2.resize(image, TARGET_SIZE, interpolation=cv2.INTER_CUBIC)

    # Step 4: Convert to float32 and normalize to [0, 1]
    image = image.astype(np.float32) / 255.0

    # Step 5: Convert to tensor (H, W, C) -> (C, H, W)
    tensor = torch.from_numpy(image).permute(2, 0, 1)

    # Step 6: ImageNet normalization
    mean = torch.tensor(IMAGENET_MEAN).view(3, 1, 1)
    std = torch.tensor(IMAGENET_STD).view(3, 1, 1)
    tensor = (tensor - mean) / std

    # Step 7: Add batch dimension -> (1, 3, 224, 224)
    tensor = tensor.unsqueeze(0)

    return tensor
