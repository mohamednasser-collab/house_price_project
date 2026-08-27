from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    location: str = Field(..., description="Location grouped, e.g. 'thane' or 'other'")
    carpet_area_sqft: float = Field(..., gt=0)
    floor_num: int
    bathroom: int = Field(..., ge=0)
    balcony: int = Field(..., ge=0)
    car_parking: int = Field(0, ge=0)
    furnishing: str = Field(..., description="'Furnished' | 'Semi-Furnished' | 'Unfurnished'")
    transaction: str = Field(..., description="'New Property' | 'Resale' | 'Other' | 'Rent/Lease'")
    ownership: str = Field(..., description="'Freehold' | 'Co-operative Society' | 'Power Of Attorney' | 'Leasehold'")
    facing: str = Field(..., description="'East' | 'West' | 'North' | 'South' | etc.")


class PredictionResponse(BaseModel):
    predicted_price: float

