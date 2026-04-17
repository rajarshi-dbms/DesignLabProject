from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.routes.auth import get_current_user
from app.models.video import Video
from typing import Optional

router = APIRouter()

# Seed data — placeholder until mentor plugs in real videos
SEED_VIDEOS = [
    {"id": 1, "title": "Introduction to Bharatanatyam", "category": "Foundations", "level": "Beginner", "duration": "12:34", "description": "History, structure, and overview of the platform.", "instructor": "To be added by mentor", "video_url": None, "thumbnail_emoji": "🎬"},
    {"id": 2, "title": "Tatta Adavu — All 8 Variants", "category": "Adavus", "level": "Beginner", "duration": "24:10", "description": "Master the foundational footwork sequences of Tatta Adavu.", "instructor": "To be added by mentor", "video_url": None, "thumbnail_emoji": "🦶"},
    {"id": 3, "title": "Natta Adavu — Variants 1–4", "category": "Adavus", "level": "Beginner", "duration": "18:45", "description": "Stretching movements of hands and legs — the second adavu.", "instructor": "To be added by mentor", "video_url": None, "thumbnail_emoji": "🤸"},
    {"id": 4, "title": "Asamyuta Hastas — Single Hand Mudras", "category": "Mudras", "level": "Intermediate", "duration": "31:20", "description": "All 28 single-hand gestures with meanings and practice drills.", "instructor": "To be added by mentor", "video_url": None, "thumbnail_emoji": "🤲"},
    {"id": 5, "title": "Samyuta Hastas — Double Hand Mudras", "category": "Mudras", "level": "Intermediate", "duration": "28:00", "description": "The 24 double-hand gestures and their contextual usage.", "instructor": "To be added by mentor", "video_url": None, "thumbnail_emoji": "👐"},
    {"id": 6, "title": "Navarasas — Mastering Facial Expressions", "category": "Abhinaya", "level": "Intermediate", "duration": "22:15", "description": "Step-by-step training for all nine emotional expressions.", "instructor": "To be added by mentor", "video_url": None, "thumbnail_emoji": "😊"},
    {"id": 7, "title": "Alaripu — The Opening Invocation", "category": "Compositions", "level": "Intermediate", "duration": "35:50", "description": "Learn the complete Alaripu — the first Margam composition.", "instructor": "To be added by mentor", "video_url": None, "thumbnail_emoji": "🌸"},
    {"id": 8, "title": "Jatiswaram — Pure Dance Composition", "category": "Compositions", "level": "Advanced", "duration": "42:00", "description": "Advanced pure-dance composition set to Carnatic music.", "instructor": "To be added by mentor", "video_url": None, "thumbnail_emoji": "🎵"},
    {"id": 9, "title": "Varnam — The Centerpiece", "category": "Advanced", "level": "Advanced", "duration": "58:30", "description": "The crown jewel of Bharatanatyam — nritta + nritya + abhinaya.", "instructor": "To be added by mentor", "video_url": None, "thumbnail_emoji": "👑"},
]


@router.get("/videos")
def get_videos(
    category: Optional[str] = Query(None),
    level: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
):
    """
    Returns list of tutorial videos.
    When the mentor integrates real videos they will come from the DB.
    Until then, returns placeholder seed data.
    """
    results = SEED_VIDEOS
    if category:
        results = [v for v in results if v["category"].lower() == category.lower()]
    if level:
        results = [v for v in results if v["level"].lower() == level.lower()]
    if search:
        results = [v for v in results if search.lower() in v["title"].lower()]
    return results


@router.get("/videos/categories")
def get_categories():
    cats = list({v["category"] for v in SEED_VIDEOS})
    return sorted(cats)


@router.get("/videos/{video_id}")
def get_video(video_id: int):
    video = next((v for v in SEED_VIDEOS if v["id"] == video_id), None)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    return video
