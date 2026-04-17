from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.routes.auth import get_current_user
from app.models.prediction import Prediction
from typing import List

router = APIRouter()


@router.get("/history")
def get_history(
    limit: int = Query(default=20, le=100),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Return the authenticated user's practice history."""
    records = (
        db.query(Prediction)
        .filter(Prediction.user_id == current_user.id)
        .order_by(Prediction.created_at.desc())
        .limit(limit)
        .all()
    )
    return [
        {
            "id": r.id,
            "mudra": r.predicted_mudra,
            "confidence": r.confidence,
            "timestamp": str(r.created_at),
            "errors": [],
        }
        for r in records
    ]


@router.get("/progress/stats")
def get_stats(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Aggregate stats for the dashboard."""
    records = (
        db.query(Prediction)
        .filter(Prediction.user_id == current_user.id)
        .all()
    )
    if not records:
        return {
            "total_sessions": 0,
            "mudras_practiced": 0,
            "avg_confidence": 0,
            "top_mudra": "—",
            "streak_days": 0,
            "time_practiced_mins": 0,
        }

    mudra_counts: dict = {}
    total_conf = 0.0
    for r in records:
        mudra_counts[r.predicted_mudra] = mudra_counts.get(r.predicted_mudra, 0) + 1
        total_conf += r.confidence

    top_mudra = max(mudra_counts, key=mudra_counts.get)
    avg_conf = total_conf / len(records)

    # Simple streak: count consecutive days from today
    from datetime import date, timedelta
    dates = sorted({r.created_at.date() for r in records if r.created_at}, reverse=True)
    streak = 0
    expected = date.today()
    for d in dates:
        if d == expected or d == expected - timedelta(days=1):
            streak += 1
            expected = d - timedelta(days=1)
        else:
            break

    return {
        "total_sessions": len(records),
        "mudras_practiced": len(mudra_counts),
        "avg_confidence": round(avg_conf, 3),
        "top_mudra": top_mudra,
        "streak_days": streak,
        "time_practiced_mins": len(records) * 3,  # ~3 min per session estimate
    }
