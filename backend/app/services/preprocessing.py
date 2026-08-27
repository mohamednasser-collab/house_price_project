import pandas as pd

from app.schemas.prediction import PredictionRequest


def request_to_dataframe(request: PredictionRequest) -> pd.DataFrame:
    """
    Convert a PredictionRequest into a single-row DataFrame
    with exactly the column names used during training.
    """
    row = {
        "carpet_area_sqft": request.carpet_area_sqft,
        "floor_num": request.floor_num,
        "bathroom": request.bathroom,
        "balcony": request.balcony,
        "car_parking": request.car_parking,
        "location_grouped": request.location,
        "Furnishing": request.furnishing,
        "Transaction": request.transaction,
        "Ownership": request.ownership,
        "facing": request.facing,
    }
    return pd.DataFrame([row])