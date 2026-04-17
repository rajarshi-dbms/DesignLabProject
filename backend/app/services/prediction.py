from app.models.prediction import Prediction
from app.schemas.prediction import PredictionCreate
from sqlalchemy.orm import Session

def create_prediction(db: Session, prediction: PredictionCreate):
    db_prediction = Prediction(
        user_id=prediction.user_id,
        image_path=prediction.image_path,
        predicted_mudra=prediction.predicted_mudra,
        confidence=prediction.confidence
    )
    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)
    return db_prediction

def get_predictions_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(Prediction).filter(Prediction.user_id == user_id).offset(skip).limit(limit).all()
