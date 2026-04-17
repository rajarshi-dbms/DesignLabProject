"use client"

import { useState, FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/AuthContext"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await login(username, password)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Invalid username or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: "6rem 1rem 2rem",
      background: `
        radial-gradient(ellipse 60% 50% at 30% 20%, rgba(212,175,55,0.06) 0%, transparent 60%),
        radial-gradient(ellipse 40% 40% at 80% 80%, rgba(232,130,45,0.05) 0%, transparent 50%),
        var(--bg-primary)
      `,
    }}>
      <div style={{ width: "100%", maxWidth: "440px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🪷</div>
          <h1 className="font-display" style={{ fontSize: "2.2rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
            Welcome Back
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            Continue your Bharatanatyam journey
          </p>
        </div>

        {/* Form card */}
        <div className="glass-card" style={{ padding: "2.5rem" }}>
          {error && (
            <div style={{
              background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)",
              borderRadius: "10px", padding: "12px 16px",
              color: "#f87171", fontSize: "0.9rem", marginBottom: "1.5rem",
              display: "flex", alignItems: "center", gap: "8px",
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>
                Username
              </label>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your_username"
                required
                className="input-dark"
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "1.75rem" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="login-password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-dark"
                  style={{ paddingRight: "44px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--text-muted)", fontSize: "1rem",
                  }}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-gold"
              style={{ width: "100%", fontSize: "1rem", padding: "14px", opacity: loading ? 0.7 : 1 }}
            >
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                {loading ? (
                  <>
                    <div className="spinner" style={{ width: "18px", height: "18px", borderWidth: "2px" }} />
                    Signing in…
                  </>
                ) : "Sign In"}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: "flex", alignItems: "center", gap: "1rem",
            margin: "1.5rem 0",
          }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(212,175,55,0.15)" }} />
            <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>OR</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(212,175,55,0.15)" }} />
          </div>

          <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
            New to NrityanGuru?{" "}
            <Link href="/register" style={{ color: "var(--gold)", textDecoration: "none", fontWeight: 500 }}>
              Create an account →
            </Link>
          </p>
        </div>

        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.78rem", marginTop: "1.5rem" }}>
          By signing in you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
