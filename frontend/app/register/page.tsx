"use client"

import { useState, FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/AuthContext"

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleChange = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const validatePassword = (p: string) => {
    if (p.length < 8) return "Password must be at least 8 characters"
    return null
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    const passErr = validatePassword(form.password)
    if (passErr) { setError(passErr); return }
    if (form.password !== form.confirm) { setError("Passwords do not match"); return }
    setLoading(true)
    try {
      await register(form.username, form.email, form.password)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const strength = (() => {
    const p = form.password
    if (!p) return 0
    let s = 0
    if (p.length >= 8) s++
    if (/[A-Z]/.test(p)) s++
    if (/[0-9]/.test(p)) s++
    if (/[^A-Za-z0-9]/.test(p)) s++
    return s
  })()

  const strengthColor = ["#ef4444","#f97316","#eab308","#22c55e"][strength - 1] || "#ef4444"
  const strengthLabel = ["Weak","Fair","Good","Strong"][strength - 1] || ""

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: "6rem 1rem 2rem",
      background: `
        radial-gradient(ellipse 60% 50% at 70% 10%, rgba(212,175,55,0.06) 0%, transparent 60%),
        radial-gradient(ellipse 40% 40% at 20% 80%, rgba(139,26,26,0.06) 0%, transparent 50%),
        var(--bg-primary)
      `,
    }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🌺</div>
          <h1 className="font-display" style={{ fontSize: "2.2rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
            Join NrityanGuru
          </h1>
          <p style={{ color: "var(--text-muted)" }}>Begin your path to mastering Bharatanatyam</p>
        </div>

        <div className="glass-card" style={{ padding: "2.5rem" }}>
          {error && (
            <div style={{
              background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)",
              borderRadius: "10px", padding: "12px 16px",
              color: "#f87171", fontSize: "0.9rem", marginBottom: "1.5rem",
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Username
              </label>
              <input
                id="reg-username"
                type="text"
                value={form.username}
                onChange={(e) => handleChange("username", e.target.value)}
                placeholder="choose_a_username"
                required
                className="input-dark"
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Email Address
              </label>
              <input
                id="reg-email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="you@example.com"
                required
                className="input-dark"
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="reg-password"
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="Minimum 8 characters"
                  required
                  className="input-dark"
                  style={{ paddingRight: "44px" }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
              {/* Strength bar */}
              {form.password && (
                <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ flex: 1, display: "flex", gap: "4px" }}>
                    {[0,1,2,3].map(i => (
                      <div key={i} style={{
                        flex: 1, height: "3px", borderRadius: "2px",
                        background: i < strength ? strengthColor : "rgba(212,175,55,0.1)",
                        transition: "background 0.3s",
                      }} />
                    ))}
                  </div>
                  <span style={{ fontSize: "0.75rem", color: strengthColor, fontWeight: 500 }}>{strengthLabel}</span>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div style={{ marginBottom: "1.75rem" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Confirm Password
              </label>
              <input
                id="reg-confirm"
                type={showPass ? "text" : "password"}
                value={form.confirm}
                onChange={(e) => handleChange("confirm", e.target.value)}
                placeholder="Repeat your password"
                required
                className="input-dark"
                style={{
                  borderColor: form.confirm && form.confirm !== form.password
                    ? "rgba(239,68,68,0.5)" : undefined
                }}
              />
              {form.confirm && form.confirm !== form.password && (
                <span style={{ fontSize: "0.78rem", color: "#f87171", marginTop: "4px", display: "block" }}>
                  Passwords do not match
                </span>
              )}
            </div>

            <button
              id="reg-submit"
              type="submit"
              disabled={loading}
              className="btn-gold"
              style={{ width: "100%", fontSize: "1rem", padding: "14px", opacity: loading ? 0.7 : 1 }}
            >
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                {loading ? (
                  <><div className="spinner" style={{ width: "18px", height: "18px", borderWidth: "2px" }} /> Creating account…</>
                ) : "🌺 Create Account"}
              </span>
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "1.5rem 0" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(212,175,55,0.15)" }} />
            <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Already have an account?</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(212,175,55,0.15)" }} />
          </div>

          <Link href="/login" style={{ textDecoration: "none" }}>
            <button className="btn-outline-gold" style={{ width: "100%", padding: "12px" }}>
              Sign In Instead
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
