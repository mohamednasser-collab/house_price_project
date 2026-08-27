# House Price Prediction — End-to-End ML Web App

An end-to-end machine learning product that predicts house prices in India from raw,
messy listing data. The pipeline covers data cleaning, model training and evaluation,
a FastAPI backend, and a React + TypeScript frontend.

![Home Page](docs/screenshot-home.png)
![Result Page](docs/screenshot-result.png)

## Overview

Real estate listings are scraped and messy: prices are written as text ("42 Lac", "1.2 Cr"),
areas mix sqft/sqyrd/sqm, and many fields have missing values. This project cleans that data,
trains a regression model to predict property price, and serves it through a web app where
a user fills in property details and gets an instant price estimate.

## Architecture

Jupyter Notebook (train)
│ joblib.dump()
▼
house_price.pkl ──copy──► backend/models/house_price.pkl
│
▼
FastAPI backend (POST /predict)
│
▼
React frontend (form → result page)


## Tech Stack

- **Data & ML:** Python, pandas, scikit-learn, matplotlib, seaborn, Jupyter
- **Backend:** FastAPI, Pydantic, uvicorn, pytest
- **Frontend:** React, TypeScript, Vite, React Router

## Project Structure

house_price_project/
│
├── notebooks/
│   ├── data/
│   │   └── house_prices.csv
│   └── house_price_model.ipynb
│
├── models/
│   ├── house_price.pkl
│   └── locations.json
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   │   └── routes/
│   │   │       └── prediction.py
│   │   ├── core/
│   │   │   └── config.py
│   │   ├── schemas/
│   │   │   └── prediction.py
│   │   ├── services/
│   │   │   ├── preprocessing.py
│   │   │   └── inference.py
│   │   └── utils/
│   │       └── logging_config.py
│   │
│   ├── models/
│   │   └── house_price.pkl
│   │
│   ├── tests/
│   │   └── test_prediction.py
│   │
│   ├── conftest.py
│   ├── requirements.txt
│   ├── .env
│   ├── .env.example
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── predictionClient.ts
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── HomePage.css
│   │   │   ├── ResultPage.tsx
│   │   │   ├── ResultPage.css
│   │   │   └── NotFoundPage.tsx
│   │   ├── types/
│   │   │   └── prediction.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
│
├── docs/
│   ├── screenshot-home.png
│   └── screenshot-result.png
│
├── .gitignore
└── README.md



## Dataset

**House Price** by Juhi Bhojani — [kaggle.com/datasets/juhibhojani/house-price](https://www.kaggle.com/datasets/juhibhojani/house-price)

~187,000 real property listings from India. Download it before running the notebook:

```bash
pip install kaggle
# Get your API token: Kaggle → Settings → API → "Create New Token"
# Place kaggle.json in C:\Users\<you>\.kaggle\ (Windows) or ~/.kaggle/ (macOS/Linux)
kaggle datasets download -d juhibhojani/house-price -p notebooks/data --unzip
```

Or download manually from the link above and place `house_prices.csv` in `notebooks/data/`.

## Setup & Run

### 1. Notebook (train the model)

```bash
cd notebooks
python -m venv ../.venv
../.venv/Scripts/activate       # Windows
# source ../.venv/bin/activate  # macOS / Linux
pip install jupyter pandas numpy scikit-learn matplotlib seaborn
```

Open `house_price_model.ipynb` and run all cells (Kernel → Restart & Run All). This produces
`house_price.pkl` and `locations.json`.

Copy the outputs to their required locations:

```bash
cp notebooks/house_price.pkl models/house_price.pkl
cp notebooks/locations.json models/locations.json
cp notebooks/house_price.pkl backend/models/house_price.pkl
```

### 2. Backend (FastAPI)

```bash
cd backend
pip install fastapi "uvicorn[standard]" pydantic pydantic-settings pandas scikit-learn joblib pytest httpx
```

Create `backend/.env` from `backend/.env.example`:
VITE_API_BASE_URL=http://localhost:8000



```bash
npm run dev
# open http://localhost:5173
```

Make sure the backend (port 8000) is running before submitting the form.

## Environment Variables

| Variable | File | Description |
|---|---|---|
| `MODEL_PATH` | `backend/.env` | Path to the trained `.pkl` model |
| `ALLOWED_ORIGINS` | `backend/.env` | CORS origin allowed to call the API |
| `VITE_API_BASE_URL` | `frontend/.env` | Base URL of the backend API |

## API Reference

**`GET /health`**

```bash
curl http://localhost:8000/health
```
```json
{"status": "ok"}
```

**`POST /predict`**

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```
```json
{"predicted_price": 8714327.09}
```

## Model Metrics

Evaluated on a held-out 20% test set (~35,500 rows):

| Model | MAE (INR) | RMSE (INR) | R² |
|---|---|---|---|
| Linear Regression | 4,119,119 | 6,688,682 | 0.683 |
| **Random Forest** ✅ | **1,126,441** | **3,052,490** | **0.934** |

**Random Forest** was selected as the final model. Property price depends on non-linear
interactions between location, area, and amenities that a linear model cannot capture —
this is reflected in the large R² gap (0.934 vs 0.683) and the lower error on every metric.

## License

This project was built as part of a student ML/web development exercise.
