"""
Image validation utilities.
Includes extension, MIME type, and domain-specific Brain MRI validation.
"""

from pathlib import Path
import cv2
import numpy as np

ALLOWED_EXTENSIONS: set[str] = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_CONTENT_TYPES: set[str] = {"image/jpeg", "image/png", "image/webp"}


def validate_file_extension(filename: str) -> bool:
    """Check if the file has an allowed image extension."""
    ext = Path(filename).suffix.lower()
    return ext in ALLOWED_EXTENSIONS


def validate_content_type(content_type: str | None) -> bool:
    """Check if the content type is an allowed image type."""
    if content_type is None:
        return False
    return content_type.lower() in ALLOWED_CONTENT_TYPES


def validate_mri_image(image_bytes: bytes) -> tuple[bool, str | None]:
    """
    Validate whether the uploaded image is a plausible brain MRI scan.
    Rejects non-MRI images such as colorful photographs, documents, screenshots,
    blank/solid images, or arbitrary non-medical objects.

    Returns:
        (is_valid: bool, error_message: str | None)
    """
    if not image_bytes:
        return False, "Uploaded image file is empty."

    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        return False, "Unable to decode the uploaded file. Please provide a valid image (JPG, PNG, or WEBP)."

    h, w = img.shape[:2]
    if h < 64 or w < 64:
        return False, "Image resolution is too low to be a valid brain MRI scan (minimum 64x64 pixels required)."

    # 1. Color variance check: MRI scans are monochromatic/grayscale imaging modalities.
    # We calculate the mean difference across R, G, and B color channels.
    b, g, r = cv2.split(img)
    diff = (
        np.mean(np.abs(r.astype(float) - g.astype(float)))
        + np.mean(np.abs(g.astype(float) - b.astype(float)))
        + np.mean(np.abs(r.astype(float) - b.astype(float)))
    ) / 3.0

    # Allow slight channel divergence for compression artifacts in JPEG, but reject colorful photos
    if diff > 16.0:
        return (
            False,
            "Invalid image: The uploaded file contains significant color information. "
            "Please upload a genuine grayscale Brain MRI scan.",
        )

    # 2. Dynamic range and contrast check: blank, solid, or flat images have near-zero standard deviation
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    std_dev = float(np.std(gray))
    if std_dev < 12.0:
        return (
            False,
            "Invalid image: The uploaded image lacks sufficient structural contrast. "
            "Please ensure you upload a clear Brain MRI scan.",
        )

    # 3. Structural & Anatomical Contour Check (head presence)
    _, binary = cv2.threshold(gray, 10, 255, cv2.THRESH_BINARY)
    contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    if not contours:
        return (
            False,
            "Invalid image: No brain anatomical structure could be detected. "
            "Please upload a valid Brain MRI scan.",
        )

    largest = max(contours, key=cv2.contourArea)
    area = cv2.contourArea(largest)
    area_ratio = area / float(h * w)

    # Brain contour should occupy a reasonable portion of the scan
    if area_ratio < 0.08:
        return (
            False,
            "Invalid image: The detected anatomical area is too small for a brain MRI scan.",
        )

    # 4. Background border check: MRI scans have a dark/black background perimeter (air)
    border_pixels = np.concatenate([
        gray[0 : max(1, int(h * 0.04)), :].flatten(),
        gray[min(h - 1, int(h * 0.96)) :, :].flatten(),
        gray[:, 0 : max(1, int(w * 0.04))].flatten(),
        gray[:, min(w - 1, int(w * 0.96)) :].flatten(),
    ])
    mean_border = float(np.mean(border_pixels))
    dark_border_fraction = float(np.mean(border_pixels < 40))

    # Reject images with bright/white document backgrounds or without dark border perimeter
    if mean_border > 130.0 or dark_border_fraction < 0.20:
        return (
            False,
            "Invalid image: The image does not exhibit typical Brain MRI characteristics "
            "(expected a dark background surrounding the brain structure).",
        )

    return True, None
