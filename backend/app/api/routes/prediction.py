from fastapi import APIRouter, HTTPException

from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.services.preprocessing import request_to_dataframe
from app.services.inference import predict

router = APIRouter()


@router.get("/health")
def health_check():
    return {"status": "ok"}


@router.post("/predict", response_model=PredictionResponse)
def predict_price(request: PredictionRequest):
    try:
        df = request_to_dataframe(request)
        predicted_price = predict(df)
        return PredictionResponse(predicted_price=predicted_price)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))