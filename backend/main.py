from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, predict, history, videos
from app.database import engine, Base

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NrityanGuru — Bharatanatyam AI API",
    description="Backend API for NrityanGuru: Indian Classical Dance learning platform with AI mudra recognition.",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# CORS — allow frontend dev server and production origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*",  # Narrow this in production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──────────────────────────────────────────────────────────
app.include_router(auth.router,    prefix="/api/auth",    tags=["Authentication"])
app.include_router(predict.router, prefix="/api",         tags=["ML Prediction"])
app.include_router(history.router, prefix="/api",         tags=["History & Progress"])
app.include_router(videos.router,  prefix="/api",         tags=["Tutorial Videos"])


@app.get("/", tags=["Health"])
def root():
    return {
        "service": "NrityanGuru API",
        "status": "running",
        "docs": "/api/docs",
    }


@app.get("/api/health", tags=["Health"])
def health():
    return {"status": "ok"}
