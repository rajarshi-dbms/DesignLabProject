import axios from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
})

// Response interceptor — auto-logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("nrityan_token")
      localStorage.removeItem("nrityan_user")
      delete api.defaults.headers.common["Authorization"]
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

// ── Auth ──────────────────────────────────────────────────────────────
export const authAPI = {
  login: (username: string, password: string) =>
    api.post("/auth/login", { username, password }),
  register: (username: string, email: string, password: string) =>
    api.post("/auth/register", { username, email, password }),
  me: () => api.get("/auth/me"),
}

// ── Videos ───────────────────────────────────────────────────────────
export const videosAPI = {
  getAll: (category?: string) =>
    api.get("/videos", { params: category ? { category } : {} }),
  getById: (id: number) => api.get(`/videos/${id}`),
  getCategories: () => api.get("/videos/categories"),
}

// ── Practice / Predict ────────────────────────────────────────────────
export const practiceAPI = {
  analyzeFrame: (imageBlob: Blob) => {
    const form = new FormData()
    form.append("file", imageBlob, "frame.jpg")
    return api.post("/predict", form, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  },
  getHistory: (limit = 20) => api.get("/history", { params: { limit } }),
  getStats: () => api.get("/progress/stats"),
}

export default api
