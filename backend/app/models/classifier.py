"""
EfficientNet-B0 model architecture for brain tumor classification.
Must exactly match the architecture used during training.
"""

import torch.nn as nn
from torchvision.models import efficientnet_b0


# Class labels — order must match training
CLASS_NAMES: list[str] = ["glioma", "meningioma", "notumor", "pituitary"]
NUM_CLASSES: int = len(CLASS_NAMES)


def create_model(num_classes: int = NUM_CLASSES) -> nn.Module:
    """
    Create EfficientNet-B0 model with custom classifier head.

    The classifier architecture MUST match what was used during training:
    - Dropout(p=0.4)
    - Linear(in_features, num_classes)

    Args:
        num_classes: Number of output classes (default: 4)

    Returns:
        EfficientNet-B0 model with custom classifier
    """
    model = efficientnet_b0(weights=None)

    # Get the input features of the original classifier
    in_features = model.classifier[1].in_features

    # Replace classifier — must match training architecture exactly
    model.classifier = nn.Sequential(
        nn.Dropout(p=0.4, inplace=True),
        nn.Linear(in_features, num_classes),
    )

    return model
