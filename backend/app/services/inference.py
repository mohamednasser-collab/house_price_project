import joblib
import pandas as pd

from app.core.config import settings

_model = None


def load_model():
    """Load the model once (called at startup)."""
    global _model
    _model = joblib.load(settings.model_path)
    return _model


def get_model():
    if _model is None:
        raise RuntimeError("Model not loaded. Call load_model() at startup.")
    return _model


def predict(df: pd.DataFrame) -> float:
    model = get_model()
    prediction = model.predict(df)
    return float(prediction[0])