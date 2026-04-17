# NrityanGuru - Indian Classical Dance AI Platform

![NrityanGuru Banner](frontend/public/placeholder-mudra.jpg)

**NrityanGuru** is a modern, interactive web application dedicated to the learning and practice of Indian Classical Dance (specifically Bharatanatyam). It bridges the ancient, sacred traditions of Indian classical arts with cutting-edge artificial intelligence, offering students a platform to learn theory, watch curated video tutorials, and practice *mudras* (hand gestures) with real-time AI computer vision feedback.

---

## 🏗️ Technology Stack

This application is built using a modern, decoupled **Client-Server architecture**.

### Frontend (User Interface)
* **Next.js 13+ (React)**: The core framework for the frontend. Next.js was chosen for its robust routing, optimized rendering, and excellent developer experience.
* **TypeScript**: Used throughout the frontend for strong typing, reducing runtime errors, and providing self-documenting code.
* **Tailwind CSS**: A utility-first CSS framework used for rapid UI development. The configuration includes a custom aesthetic palette (Gold, Saffron, Maroon) and bespoke animations.
* **Axios**: Used for making HTTP requests to the backend API, with request/response interceptors for seamless JWT authentication handling.
* **HTML5 Canvas / MediaDevices API**: Utilized heavily in the `/practice` route to hijack the user's webcam, capture video frames, and render the live video feed.

### Backend (API & Business Logic)
* **FastAPI (Python)**: An immensely fast, modern web framework for building APIs. Chosen because of Python's unmatched ecosystem for Machine Learning integration.
* **Uvicorn**: An ASGI web server implementation for Python, used to serve the FastAPI application natively with high asynchronous performance.
* **SQLAlchemy (ORM)**: The Object Relational Mapper used to translate Python classes into database tables and manage database interactions seamlessly.
* **SQLite / PostgreSQL**: Currently configured with developmental SQLite (file-based database) but structured seamlessly for production PostgreSQL via environment variables.
* **PyJWT & Passlib**: Used for cryptographic operations, primarily generating JSON Web Tokens and hashing user passwords securely using bcrypt.

### Machine Learning Integration Point (ML Service)
* Currently implemented as a mocked plugin inside the predict route. It is designed to act as a seamless hand-off point for a PyTorch/TensorFlow computer vision model.

---

## 📐 System & Programming Principles

### 1. Architectural Patterns
* **Separation of Concerns (SoC)**: The system is strictly divided into `frontend` and `backend` repositories. They communicate exclusively over RESTful HTTP endpoints.
* **Service Layer Pattern**: Inside the backend, business logic is decoupled from routing. Routes (`app/routes/`) handle HTTP requests, while Services (`app/services/`) handle database transaction logic.

### 2. Design & UI Principles
* **Glassmorphism**: The UI heavily utilizes backdrop-filters and semi-transparent backgrounds to create a "glass" effect, conveying a premium and modern feel.
* **Component-Based Architecture**: The UI is broken down into reusable components (e.g., `<Navbar />`), ensuring the `dry` (Don't Repeat Yourself) principle.
* **Responsive Design**: All grids and flexboxes dynamically scale. It ensures the application is perfectly usable on 4K monitors, laptops, and mobile devices.

### 3. State Management & Authentication
* **JWT (JSON Web Tokens)**: The platform uses stateless authentication. 
  1. The user logs in. 
  2. The backend verifies encrypted credentials and issues an Access Token securely signed by a `SECRET_KEY`.
  3. The frontend stores this token in `localStorage` and includes it in the `Authorization: Bearer <token>` header of every subsequent Axios request.
* **React Context API (`AuthContext`)**: Global state management is handled natively via React Context to track authenticated users across different routes without prop-drilling.

---

## 🛠️ Advanced Technical Terminology Explained

If you are expanding this project for production, here are several terms and integrations prepared or referenced in the architecture:

* **Webhooks / Event-Driven AI**: Right now, ML inference is *synchronous* (the user waits while the backend processes the image). For extremely large ML models, you would implement **Webhooks**—the frontend uploads the image, the backend replies "Processing", and sends a webhook (an HTTP POST) to the frontend or opens a WebSocket when the AI analysis is actually complete.
* **Docker**: There are `Dockerfile`s stubbed in both the frontend and backend. Docker containerizes the application, ensuring that "it works on my machine" translates to "it works perfectly on the server."
* **Kubernetes (K8s) / infra/**: If this platform grew to thousands of simultaneous dancers analyzing mudras, a single server would crash. Kubernetes is an orchestration tool that would spin up multiple identical "pods" of the FastAPI backend and auto-scale them dynamically based on user load. The `/infra` folder is reserved for deployment manifests like these.
* **ASGI (Asynchronous Server Gateway Interface)**: Unlike older synchronous Python servers, FastAPI is asynchronous. This means while waiting for the database to save a user's practice history, the server can simultaneously process another user's incoming image frame.

---

## 📁 Directory Structure

```text
DesignLabProject/
├── frontend/                     # Next.js React Application
│   ├── app/                      # Next.js App Router (Pages & Layouts)
│   │   ├── about/page.tsx        # ICD Theory, Adavus, Navarasas
│   │   ├── dashboard/page.tsx    # User analytics and progress tracking
│   │   ├── learn/page.tsx        # Video tutorial library
│   │   ├── login/page.tsx        # Auth page
│   │   ├── practice/page.tsx     # Webcam AI inference UI
│   │   ├── register/page.tsx     # Auth page
│   │   ├── globals.css           # Tailwind + Custom CSS animations
│   │   └── layout.tsx            # Root layout containing Context Providers
│   ├── components/               # Reusable React components (Navbar)
│   ├── lib/                      # Utilities (Axios client, AuthContext)
│   └── tailwind.config.js        # Design tokens (Colors, Fonts)
│
├── backend/                      # FastAPI Python Application
│   ├── main.py                   # FastAPI Application Entry Point
│   ├── requirements.txt          # Python dependencies
│   ├── app/                      
│   │   ├── database.py           # Engine & Session configuration
│   │   ├── models/               # SQLAlchemy ORM Models (User, Prediction, Video)
│   │   ├── routes/               # HTTP Endpoints (auth.py, predict.py, videos.py)
│   │   ├── schemas/              # Pydantic Models (Data Validation & Serialization)
│   │   └── services/             # CRUD Operations for DB
│
├── ml_service/                   # Mentor's Machine Learning Drop-in Folder
│   ├── model.py                  # PyTorch/TF neural network definitions
│   └── inference.py              # Contains `run_inference(image_path)` hook
│
└── infra/                        # DevOps / Kubernetes / Docker orchestration config
```

---

## 🚀 How to Run Locally

### 1. Start the Backend API (FastAPI)
The backend runs on Python and acts as the bridge connecting the database, the ML model, and the frontend.

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment and activate it
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the local development server (runs on http://localhost:8000)
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Start the Frontend App (Next.js)
Open a new, separate terminal window.

```bash
# Navigate to the frontend directory
cd frontend

# Install Node modules
npm install --legacy-peer-deps

# Start the development server (runs on http://localhost:3000)
npm run dev
```

### 3. Usage
Navigate to **http://localhost:3000** in your web browser. 
* To test the practice route, register an account, log in, navigate to **Practice**, and grant the browser camera permissions. 
* *Note: The video tutorials and the live ML model are currently utilizing placeholder mock data until integrated by the ML team.*