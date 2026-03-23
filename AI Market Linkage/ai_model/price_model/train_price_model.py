"""
Train a price recommendation model for agricultural produce.

Usage:
    cd ai_model/price_model
    python train_price_model.py

Outputs (written to the same directory as this script):
    price_model.pkl  - Trained RandomForestRegressor
    encoders.pkl     - Categorical label mappings {crop, location, grade}

Dataset assumptions:
    quantity -> kg
    price    -> USD per kg
"""

import logging
import pickle
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)

SCRIPT_DIR = Path(__file__).parent
DATA_PATH = SCRIPT_DIR / "data" / "prices.csv"
MODEL_OUT = SCRIPT_DIR / "price_model.pkl"
ENCODERS_OUT = SCRIPT_DIR / "encoders.pkl"


def load_data() -> pd.DataFrame:
    if not DATA_PATH.exists():
        raise FileNotFoundError(f"Dataset not found at: {DATA_PATH}")

    df = pd.read_csv(DATA_PATH)
    df.columns = df.columns.str.strip().str.lower()

    # Normalise text columns
    for col in ("crop", "location", "grade"):
        df[col] = df[col].astype(str).str.strip().str.title()

    df["quantity"] = pd.to_numeric(df["quantity"], errors="coerce")
    df["price"] = pd.to_numeric(df["price"], errors="coerce")
    df = df.dropna(subset=["crop", "location", "grade", "quantity", "price"])

    logger.info("Loaded %d rows from %s", len(df), DATA_PATH)
    return df


def build_encoders(df: pd.DataFrame) -> dict:
    """Build label-index mappings for each categorical column."""
    encoders: dict[str, dict[str, int]] = {}
    for col in ("crop", "location", "grade"):
        unique_vals = sorted(df[col].unique())
        encoders[col] = {v: i for i, v in enumerate(unique_vals)}
        logger.info("Encoder '%s': %s", col, list(encoders[col].keys()))
    return encoders


def encode_and_build_features(df: pd.DataFrame, encoders: dict) -> tuple[np.ndarray, np.ndarray]:
    df = df.copy()
    for col in ("crop", "location", "grade"):
        df[f"{col}_enc"] = df[col].map(encoders[col]).fillna(0).astype(int)

    X = df[["crop_enc", "location_enc", "grade_enc", "quantity"]].values
    y = df["price"].values
    return X, y


def train(X: np.ndarray, y: np.ndarray) -> RandomForestRegressor:
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.15, random_state=42
    )

    model = RandomForestRegressor(
        n_estimators=200,
        max_depth=10,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    logger.info("Validation  MAE=$%.4f  R²=%.4f", mae, r2)

    return model


def save_artifacts(model: RandomForestRegressor, encoders: dict) -> None:
    with open(MODEL_OUT, "wb") as f:
        pickle.dump(model, f)
    logger.info("Model saved  → %s", MODEL_OUT)

    with open(ENCODERS_OUT, "wb") as f:
        pickle.dump(encoders, f)
    logger.info("Encoders saved → %s", ENCODERS_OUT)


if __name__ == "__main__":
    df = load_data()
    encoders = build_encoders(df)
    X, y = encode_and_build_features(df, encoders)
    model = train(X, y)
    save_artifacts(model, encoders)
    logger.info("Training complete.")
