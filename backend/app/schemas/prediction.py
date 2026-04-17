from pydantic import BaseModel
from typing import Optional

class PredictionBase(BaseModel):
    predicted_mudra: str
    confidence: float

class PredictionCreate(PredictionBase):
    user_id: int
    image_path: str

class Prediction(PredictionBase):
    id: int
    user_id: int
    image_path: str
    created_at: str

    class Config:
        orm_mode = True
