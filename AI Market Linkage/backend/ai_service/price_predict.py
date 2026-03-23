"""
AI price prediction module for agricultural produce.

Loads a trained RandomForestRegressor once (singleton) and exposes
predict_price() for use in API views and serializers.
"""

import logging
import pickle
from pathlib import Path
from typing import Union

from django.conf import settings

from .location_normalization import normalize_location_for_model

logger = logging.getLogger(__name__)

# Configurable via Django settings; defaults to sibling price_model/ directory.
_PRICE_MODEL_DIR = Path(
    getattr(
        settings,
        "AI_PRICE_MODEL_DIR",
        Path(settings.BASE_DIR) / "ai_service" / "price_model",
    )
)
_MODEL_PATH = _PRICE_MODEL_DIR / "price_model.pkl"
_ENCODERS_PATH = _PRICE_MODEL_DIR / "encoders.pkl"

_price_model = None
_price_encoders: dict | None = None


def _load_artifacts() -> tuple:
    """Load model and encoders once and cache them in module-level singletons."""
    global _price_model, _price_encoders

    if _price_model is not None:
        return _price_model, _price_encoders

    if not _MODEL_PATH.exists():
        raise FileNotFoundError(f"Price model not found at: {_MODEL_PATH}")
    if not _ENCODERS_PATH.exists():
        raise FileNotFoundError(f"Price encoders not found at: {_ENCODERS_PATH}")

    try:
        with open(_MODEL_PATH, "rb") as f:
            _price_model = pickle.load(f)  # noqa: S301 – trusted internal artifact
        with open(_ENCODERS_PATH, "rb") as f:
            _price_encoders = pickle.load(f)  # noqa: S301
        logger.info("Price model loaded from %s", _MODEL_PATH)
    except Exception as exc:
        _price_model = None
        _price_encoders = None
        raise RuntimeError(f"Failed to load price model artifacts: {exc}") from exc

    return _price_model, _price_encoders


def _encode(encoders: dict, feature: str, value: str, *, allow_fallback: bool = False) -> int:
    """Return the integer index for a categorical value."""
    mapping: dict[str, int] = encoders.get(feature, {})
    normalized = str(value).strip().title()

    if normalized in mapping:
        return mapping[normalized]

    # Case-insensitive search
    lower_map = {k.lower(): v for k, v in mapping.items()}
    if normalized.lower() in lower_map:
        return lower_map[normalized.lower()]

    if allow_fallback:
        logger.warning("Unknown %s value '%s'; using fallback encoding.", feature, value)
        return max(len(mapping) // 2, 0)

    raise ValueError(
        f"Unsupported {feature} '{value}'. Supported values: {', '.join(sorted(mapping.keys()))}"
    )


def predict_price(
    crop: str,
    location: str,
    grade: str,
    quantity: Union[int, float],
) -> float:
    """
    Predict the recommended selling price per unit (USD).

    Args:
        crop:     Crop name, e.g. "Tomatoes", "Maize".
        location: Province or city, e.g. "Harare", "Bulawayo".
        grade:    Quality grade – "Grade A", "Grade B", "Grade C", or "Reject".
        quantity: Quantity in kg (or the native unit of the listing).

    Returns:
        Recommended price per unit as a float, rounded to 2 decimal places.

    Raises:
        FileNotFoundError: If model artifacts are missing.
        RuntimeError:      If the model files cannot be loaded.
    """
    model, encoders = _load_artifacts()

    known_locations = list(encoders.get("location", {}).keys())
    normalized_location, strategy = normalize_location_for_model(location, known_locations)
    if strategy != "exact":
        logger.warning(
            "Location normalized using %s: '%s' -> '%s'",
            strategy,
            location,
            normalized_location,
        )

    features = [[
        _encode(encoders, "crop", crop),
        _encode(encoders, "location", normalized_location),
        _encode(encoders, "grade", grade),
        float(quantity),
    ]]

    price = model.predict(features)[0]
    return round(float(price), 2)
