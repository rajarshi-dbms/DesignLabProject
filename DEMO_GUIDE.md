# NrityanGuru — Complete Supervisor Demonstration Guide

---

## 1. How to Start the Application

Open **two terminals** side by side.

### Terminal 1 — Backend API (port 8000)
```bash
cd ~/Desktop/DesignLabProject/backend
source venv/bin/activate
export SECRET_KEY="nrityan-guru-secret-key-change-in-production"
export DATABASE_URL="sqlite:///./mudra.db"
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Terminal 2 — Frontend UI (port 3000)
```bash
cd ~/Desktop/DesignLabProject/frontend
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 2. Registration & Login — Step by Step

### Registering a New Account (`/register`)

1. Open `http://localhost:3000/register`
2. Fill in **Username**, **Email**, and **Password**
3. A **real-time password strength bar** changes colour: red → orange → yellow → green (logic in `frontend/app/register/page.tsx`)
4. The **Confirm Password** field immediately turns red-bordered if it doesn't match — no submit required
5. Click **Create Account** — a spinner appears while the request is in-flight
6. On success you are **auto-logged-in** and redirected to `/dashboard`

**Backend chain for register:**
- `POST /api/auth/register` → `backend/app/routes/auth.py`
- Service `backend/app/services/auth.py` → **bcrypt** hashes the password → **SQLAlchemy** inserts into the `users` table
- Immediately calls `POST /api/auth/login` to get a **JWT token**
- Token in `localStorage` (`nrityan_token`); user object in `nrityan_user`
- `AuthContext` (`frontend/lib/AuthContext.tsx`) propagates login state across every page

### Logging In (`/login`)

1. Open `http://localhost:3000/login`
2. Enter **Username** and **Password**; toggle the 👁️ button to show/hide
3. Click **Sign In** → redirected to `/dashboard` on success
4. Wrong credentials → red error banner: `"Invalid username or password"`

> **Note:** JWT tokens expire after **24 hours**. The Axios interceptor in `frontend/lib/api.ts` catches any `401 Unauthorized` response automatically and redirects to `/login`.

---

## 3. All Pages — What They Do & Where the Code Lives

### Page 1 — Home (`/`)
**File:** `frontend/app/page.tsx`

| Section | Description |
|---|---|
| Animated Hero | Headline + CTA buttons. Floating card cycles mudra names every 3 s via `setInterval` in `useEffect` |
| Stats Strip | "28 Mudras · 15 Adavus · 9 Navrasas · 58 Variants" in animated cards |
| Features Grid | Four cards: Video Tutorials, AI Practice, Progress Dashboard, Curriculum |
| Mudra Showcase | Clickable grid of 6 mudras with Sanskrit name, meaning, finger description |
| CTA Banner | "Begin Your Sacred Journey" — leads to `/register` |

---

### Page 2 — About ICD (`/about`)
**File:** `frontend/app/about/page.tsx`

Four tabs (switched by `useState`, no page reload):

| Tab | Content |
|---|---|
| **Overview** | 6 info cards — Origins, Nritta/Nritya/Natya, Music & Rhythm, Costume, Margam structure, Hasta Mudras |
| **Adavus** | Full 15-adavu table with name, variant count, description (matches IIT KGP slides) |
| **Positions** | 5 sthanakas — Samapada, Aramandi, Muzhumandi, Swastika, Prenkhana |
| **Navarasas** | All 9 emotions (Sringara → Shanta) with emoji, Sanskrit name and meaning |

---

### Page 3 — Video Library (`/learn`)
**File:** `frontend/app/learn/page.tsx`

- **Search bar** — filters video titles in real time as you type
- **Level filter** — All / Beginner / Intermediate / Advanced
- **Category tabs** — Foundations, Adavus, Mudras, Abhinaya, Compositions, Advanced
- **Video cards** — thumbnail emoji, title, duration badge, difficulty colour, description, instructor name
- Clicking **▶ Watch** opens a **modal** with a placeholder player
- Unauthenticated users clicking Watch are redirected to `/login`

**To plug in real videos (mentor):**
1. Add actual `video_url` values (YouTube embed / S3 URL) to `SEED_VIDEOS` in `backend/app/routes/videos.py`
2. In the modal inside `frontend/app/learn/page.tsx` replace the placeholder `<div>` with:
```tsx
<iframe src={selected.video_url} allowFullScreen
  style={{ width:"100%", height:"320px", borderRadius:"12px" }} />
```
The entire search, filter, and modal UI already works — only the source URL needs to be real.

---

### Page 4 — AI Practice (`/practice`)
**File:** `frontend/app/practice/page.tsx`

> **Requires login.** Unauthenticated users are redirected to `/login`.

**Left Panel — Camera:**

| Control | What it does |
|---|---|
| Mode switcher | Toggle between 📸 Manual Capture and 🔴 Live Stream |
| Mudra selector | Sets the target gesture; loads tips panel |
| Enable Camera | Calls `navigator.mediaDevices.getUserMedia()` and pipes stream into `<video>` |
| Capture & Analyze | Shows 3→2→1 countdown overlay, captures frame via HTML5 `<canvas>`, sends JPEG to backend |
| Start Live | Auto-captures + sends a frame every 3 seconds via `setInterval` |
| Off button | Stops all camera tracks and clears the stream |

**Right Panel — Results:**

| Section | Content |
|---|---|
| Session Stats | Total analyses, average confidence % |
| AI Analysis card | Detected mudra, Devanagari script, confidence bar (green ≥80% / amber ≥60% / red <60%), errors, suggestions |
| Recent Analyses | Last 5 detections with mudra name + confidence |
| Tips Panel | Static tips for the currently selected mudra from `MUDRA_TIPS` dictionary |

**Full capture-to-result chain:**
1. `captureFrame()` — draws current video frame onto hidden `<canvas>`
2. `canvas.toBlob()` — converts to JPEG binary
3. `practiceAPI.analyzeFrame()` in `frontend/lib/api.ts` — wraps in `FormData`, sends `POST /api/predict` with `Authorization: Bearer <token>`
4. `backend/app/routes/predict.py` — saves image to `uploads/`, calls `run_inference()` from `ml_service/inference.py`
5. Result JSON returned to frontend → rendered in results panel
6. Prediction saved to `predictions` DB table

**To plug in the ML model:**
Open `backend/app/routes/predict.py`, find the `# ML Integration point` comment block, and uncomment:
```python
from ml_service.inference import run_inference
result = run_inference(file_path)
```
Implement `run_inference(image_path: str) -> dict` in `ml_service/inference.py`.
The dict **must** contain: `predicted_mudra`, `confidence`, `sanskrit_name`, `meaning`, `description`, `errors` (list), `suggestions` (list).
Until plugged in, a smart mock response is returned so the UI always demonstrates fully.

---

### Page 5 — Dashboard (`/dashboard`)
**File:** `frontend/app/dashboard/page.tsx`

> **Requires login.** Unauthenticated users are redirected to `/login`.

Three tabs:

**Overview**
- 6 stat cards — Sessions, Mudras Practiced, Avg Accuracy, Day Streak, Time Practiced, Best Mudra
- Recent Activity panel — last 4 sessions, time ago, error count, confidence
- Mudra Mastery panel — progress bars per mudra
- Streak Calendar — 30-day grid (gold tile = practiced, faded = missed)

**History**
- Full table of every practice session: mudra, confidence bar, ✓ Perfect / ⚠ Needs Work badge, error list, timestamp

**Progress**
- Per-mudra mastery label (Mastered / Proficient / Learning / Beginner), progress bar, session count
- Recommendations panel — contextual advice based on weakest mudras

The dashboard tries `GET /api/progress/stats` and `GET /api/history` first; silently falls back to local mock data if the backend is unreachable.

---

## 4. How Data Is Stored

| Data | Table / Location | Written by |
|---|---|---|
| User account | `users` table | `backend/app/services/auth.py` → `create_user()` |
| Password | `users.hashed_password` — **bcrypt hash only, never plain text** | `services/auth.py` |
| JWT token | Browser `localStorage` (client-side only) | `frontend/lib/AuthContext.tsx` |
| Each practice session | `predictions` table | `backend/app/services/prediction.py` → `create_prediction()` |
| Uploaded image frames | `backend/uploads/<uuid>.jpg` on disk | `backend/app/routes/predict.py` |
| Video metadata | `videos` table (seed data) | `backend/app/models/video.py` |

Database tables are **auto-created on every startup** by `Base.metadata.create_all()` in `backend/main.py`.
Switch from SQLite to PostgreSQL by changing `DATABASE_URL` env var — no code change needed.

---

## 5. Complete Code File Map

```
frontend/
├── app/
│   ├── page.tsx              ← Home / Landing page
│   ├── about/page.tsx        ← ICD theory, Adavus table, Navarasas, Positions
│   ├── learn/page.tsx        ← Video library, filters, search, modal player
│   ├── practice/page.tsx     ← Webcam + frame capture + AI feedback UI
│   ├── dashboard/page.tsx    ← Stats, history table, mastery bars, streak
│   ├── login/page.tsx        ← Login form + JWT flow
│   ├── register/page.tsx     ← Register form + password strength meter
│   ├── layout.tsx            ← Root layout: AuthProvider + Navbar injected here
│   └── globals.css           ← Entire design system: tokens, animations, glass cards
├── components/
│   └── Navbar.tsx            ← Sticky nav, auth-aware links, mobile hamburger menu
└── lib/
    ├── AuthContext.tsx        ← Global auth state via React Context + localStorage
    └── api.ts                ← Axios client, base URL, JWT auto-injection, 401 interceptor

backend/
├── main.py                   ← FastAPI entry point: routers, CORS, DB table auto-creation
├── app/
│   ├── database.py           ← SQLAlchemy engine, SessionLocal, Base
│   ├── models/
│   │   ├── user.py           ← User ORM model (id, username, email, hashed_password)
│   │   ├── prediction.py     ← Prediction ORM model (user_id, mudra, confidence)
│   │   └── video.py          ← Video ORM model (title, category, level, url)
│   ├── routes/
│   │   ├── auth.py           ← POST /register, POST /login, GET /me + JWT helpers
│   │   ├── predict.py        ← POST /predict ← ML PLUG-IN POINT
│   │   ├── history.py        ← GET /history, GET /progress/stats
│   │   └── videos.py         ← GET /videos, /videos/{id}, /videos/categories
│   ├── schemas/
│   │   ├── user.py           ← Pydantic: UserCreate, UserLogin, User
│   │   └── prediction.py     ← Pydantic: PredictionCreate
│   └── services/
│       ├── auth.py           ← get_user_by_username(), create_user() + bcrypt
│       └── prediction.py     ← create_prediction() DB insert

ml_service/
├── inference.py              ← run_inference(image_path) ← PLUG MODEL HERE
└── model.py                  ← Neural network class definitions

infra/
├── docker-compose.yml        ← Orchestrate frontend + backend + db containers
├── frontend.Dockerfile       ← Production Next.js container image
└── backend.Dockerfile        ← Production FastAPI container image
```

---

## 6. Every Technology & Library Used

### Languages
| Technology | Used For |
|---|---|
| **TypeScript** | All frontend logic — strong typing across pages, components, API calls |
| **Python 3.10** | Backend API, business logic, ML service |
| **CSS3** | Glassmorphism, gradient text, keyframe animations |
| **SQL** | Database queries abstracted through SQLAlchemy ORM |
| **HTML5** | Semantic markup, native `<video>` and `<canvas>` elements |

### Frontend Stack
| Technology | Used For |
|---|---|
| **Next.js 13 (App Router)** | File-based routing, SSR, layout system |
| **React 18** | Component model, hooks: `useState`, `useEffect`, `useRef`, `useCallback`, `useContext` |
| **Tailwind CSS** | Utility-first styling with custom gold/saffron/maroon color tokens |
| **Axios** | HTTP client with request/response interceptors |
| **HTML5 MediaDevices API** | Webcam stream via `getUserMedia()` |
| **HTML5 Canvas API** | Capturing JPEG frames from live video |
| **React Context API** | Global auth state — no Redux needed |
| **localStorage (Web Storage API)** | Persisting JWT token and user object across browser sessions |
| **Google Fonts** | Playfair Display (headings), Inter (body), Noto Sans Devanagari (Sanskrit) |
| **CSS Backdrop Filter** | Glassmorphism effect on all cards and navbar |
| **CSS Custom Properties** | Design tokens (`--gold`, `--saffron`, `--maroon`) used across all components |

### Backend Stack
| Technology | Used For |
|---|---|
| **FastAPI** | Modern ASGI REST framework — auto OpenAPI docs at `/api/docs` |
| **Uvicorn + uvloop** | High-performance ASGI server |
| **SQLAlchemy 2.0** | ORM — Python classes mapped to DB tables |
| **SQLite** (dev) / **PostgreSQL** (prod) | Relational database — switch via `DATABASE_URL` env var |
| **PyJWT** | JWT encoding/decoding (RFC 7519) |
| **bcrypt** | Adaptive password hashing — defeat brute-force & rainbow-table attacks |
| **Pydantic v2** | Request body validation, response serialisation, data contracts |
| **python-multipart** | Parse `multipart/form-data` for image uploads |
| **Pillow** | Image file handling for uploaded frames |
| **python-dotenv** | Load secrets from `.env` files |

### Security & Auth
| Technology | Used For |
|---|---|
| **JWT (JSON Web Tokens)** | Stateless auth — server issues token, client presents on every request |
| **Bearer Token scheme** | `Authorization: Bearer <token>` header on all protected API calls |
| **OAuth2PasswordBearer** | FastAPI dependency that extracts Bearer token from the header |
| **bcrypt** | Password hashing — salted, adaptive cost factor |
| **CORS Middleware** | Allows `localhost:3000` to call `localhost:8000` across origins |

### DevOps & Infrastructure
| Technology | Used For |
|---|---|
| **Docker** | Container images for frontend and backend |
| **Docker Compose** | `infra/docker-compose.yml` orchestrates all services together |
| **Git** | Version control with conventional commit messages |
| **GitHub** | Remote repository hosting (`rajarshi-dbms/DesignLabProject`) |
| **.gitignore** | Excludes `node_modules/`, `venv/`, `*.db`, `uploads/`, `.next/` |

### ML Integration Layer (Ready to Use)
| Technology | Expected Role |
|---|---|
| **PyTorch / TensorFlow** | Training and running the pose/mudra recognition model |
| **OpenCV** | Video frame pre-processing before model inference |
| **NumPy** | Tensor and array manipulation in the ML pipeline |
| **Pillow** | Image resize/normalise before passing to model |

### Architecture & Design Patterns
| Pattern | Where Applied |
|---|---|
| **Separation of Concerns** | Routes / Services / Models / Schemas are all distinct layers |
| **Service Layer Pattern** | All DB logic in `services/`, HTTP handling in `routes/` |
| **Repository Pattern** | DB queries go through service functions, never directly in routes |
| **Context Provider Pattern** | `AuthContext.tsx` wraps the full app tree for global auth state |
| **Interceptor Pattern** | Axios auto-injects JWT on requests; auto-redirects on 401 responses |
| **Graceful Degradation** | ML absent → mock result. API down → local mock data. UI never crashes. |
| **DRY (Don't Repeat Yourself)** | Shared CSS classes (`glass-card`, `btn-gold`, `input-dark`) used everywhere |
| **Component-Based Architecture** | `<Navbar>`, `<AuthProvider>` are isolated, reusable React components |
| **Mobile-First Responsive Design** | `auto-fit minmax()` CSS grids, `flexWrap`, media queries on all layouts |
| **ASGI (Async I/O)** | FastAPI handles concurrent requests non-blockingly — critical for webcam streaming |

---

## 7. Recommended Demo Order for Supervisor

```
Home  →  About ICD (Adavus tab)  →  Learn (show filters + search)
  →  Register  →  Practice (enable camera, perform Pataka)  →  Dashboard
```

This tells a complete story:
**Learn the theory → Watch tutorials → Practice with AI → Track your progress**
