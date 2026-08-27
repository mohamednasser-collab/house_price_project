from fastapi.testclient import TestClient

from app.main import app


def test_health_check():
    with TestClient(app) as client:
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}


def test_predict_valid_input():
    payload = {
        "location": "thane",
        "carpet_area_sqft": 650,
        "floor_num": 5,
        "bathroom": 2,
        "balcony": 1,
        "car_parking": 1,
        "furnishing": "Semi-Furnished",
        "transaction": "Resale",
        "ownership": "Freehold",
        "facing": "East"
    }
    with TestClient(app) as client:
        response = client.post("/predict", json=payload)
        assert response.status_code == 200
        assert "predicted_price" in response.json()
        assert response.json()["predicted_price"] > 0


def test_predict_invalid_input():
    payload = {
        "location": "thane",
        "floor_num": 5,
        "bathroom": 2,
        "balcony": 1,
        "car_parking": 1,
        "furnishing": "Semi-Furnished",
        "transaction": "Resale",
        "ownership": "Freehold",
        "facing": "East"
    }
    with TestClient(app) as client:
        response = client.post("/predict", json=payload)
        assert response.status_code == 422