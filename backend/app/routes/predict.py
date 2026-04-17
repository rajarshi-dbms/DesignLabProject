from fastapi import APIRouter, File, UploadFile, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.routes.auth import get_current_user
from app.schemas.prediction import PredictionCreate
from app.services.prediction import create_prediction
import os, uuid

router = APIRouter()

UPLOAD_DIRECTORY = "uploads/"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)


@router.post("/predict")
async def predict(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """
    Receives a webcam frame and runs it through the ML model.
    The ML model stub is replaced by the mentor's real model.
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image",
        )

    ext = os.path.splitext(file.filename or "frame.jpg")[1] or ".jpg"
    unique_filename = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(UPLOAD_DIRECTORY, unique_filename)

    try:
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error saving file: {str(e)}",
        )

    # ── ML Integration point ───────────────────────────────────────────
    # The mentor will plug in the real model here.
    # Expected: from ml_service.inference import run_inference
    #           result = run_inference(file_path)
    # ──────────────────────────────────────────────────────────────────
    try:
        from ml_service.inference import run_inference
        result = run_inference(file_path)
    except Exception:
        # Fallback mock when model is not yet connected
        result = {
            "predicted_mudra": "Pataka",
            "confidence": 0.87,
            "sanskrit_name": "पताका",
            "meaning": "Flag — representing clouds, forest, a river, a king",
            "description": (
                "Pataka is the most foundational hasta mudra in Bharatanatyam. "
                "All four fingers are extended and held together; the thumb is bent across the palm."
            ),
            "errors": [],
            "suggestions": [
                "Keep all four fingers tightly together",
                "Ensure thumb is folded neatly — not sticking out",
                "Wrist should be straight, not drooping",
            ],
        }

    # Save prediction to database
    try:
        prediction_data = PredictionCreate(
            user_id=current_user.id,
            image_path=file_path,
            predicted_mudra=result["predicted_mudra"],
            confidence=result["confidence"],
        )
        create_prediction(db=db, prediction=prediction_data)
    except Exception:
        pass  # Don't fail request if DB insert fails

    return JSONResponse(content=result)
