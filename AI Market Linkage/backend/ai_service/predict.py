import logging
from pathlib import Path
from typing import Dict

import numpy as np
import tensorflow as tf
from django.conf import settings
from tensorflow.keras.preprocessing.image import img_to_array, load_img

CLASS_NAMES = ["Damaged", "Old", "Ripe", "Unripe"]
GRADE_MAP = {
    "Ripe": "Grade A",
    "Unripe": "Grade B",
    "Old": "Grade C",
    "Damaged": "Reject",
}

MODEL_PATH = Path(getattr(settings, "AI_CLASSIFIER_MODEL_PATH", settings.BASE_DIR / "ai_service" / "model" / "tomato_classifier.h5"))

_MODEL = None
logger = logging.getLogger(__name__)


def _get_model() -> tf.keras.Model:
    global _MODEL
    if _MODEL is None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError(f"Tomato classifier model not found at: {MODEL_PATH}")
        try:
            # compile=False avoids requiring training-only metadata/objects.
            _MODEL = tf.keras.models.load_model(MODEL_PATH, compile=False)
            logger.info("Tomato classifier loaded from %s", MODEL_PATH)
        except Exception as exc:
            logger.exception("Failed to load tomato classifier model")
            raise RuntimeError(f"Failed to load tomato classifier model: {exc}") from exc
    return _MODEL


def predict_tomato(image_path: str) -> Dict[str, float | str]:
    model = _get_model()

    image = load_img(image_path, target_size=(224, 224))
    image_array = img_to_array(image) / 255.0
    image_array = np.expand_dims(image_array, axis=0)

    prediction = model.predict(image_array, verbose=0)[0]
    class_index = int(np.argmax(prediction))
    predicted_class = CLASS_NAMES[class_index]
    confidence = float(prediction[class_index])

    return {
        "class": predicted_class,
        "confidence": round(confidence, 4),
        "grade": GRADE_MAP[predicted_class],
    }
