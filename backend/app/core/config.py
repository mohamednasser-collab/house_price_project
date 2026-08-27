from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    model_path: str = "models/house_price.pkl"
    allowed_origins: str = "http://localhost:5173"

    class Config:
        env_file = ".env"


settings = Settings()