"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/AuthContext"
import { useRouter } from "next/navigation"
import { practiceAPI } from "@/lib/api"
import Link from "next/link"

const MOCK_STATS = {
  total_sessions: 24,
  mudras_practiced: 6,
  avg_confidence: 0.76,
  top_mudra: "Pataka",
  streak_days: 5,
  time_practiced_mins: 148,
}

const MOCK_HISTORY = [
  { id: 1, mudra: "Pataka", confidence: 0.91, timestamp: "2026-04-16T14:20:00Z", errors: [] },
  { id: 2, mudra: "Tripataka", confidence: 0.74, timestamp: "2026-04-16T14:18:00Z", errors: ["Thumb not folded"] },
  { id: 3, mudra: "Mayura", confidence: 0.68, timestamp: "2026-04-16T13:55:00Z", errors: ["Elbow too low", "Finger pinch not tight"] },
  { id: 4, mudra: "Ardhachandra", confidence: 0.88, timestamp: "2026-04-15T10:30:00Z", errors: [] },
  { id: 5, mudra: "Kartarimukha", confidence: 0.62, timestamp: "2026-04-15T10:20:00Z", errors: ["Index and pinky not separated enough"] },
  { id: 6, mudra: "Pataka", confidence: 0.95, timestamp: "2026-04-14T09:10:00Z", errors: [] },
]

const MUDRA_PROGRESS = [
  { name: "Pataka", mastery: 0.91, sessions: 8 },
  { name: "Tripataka", mastery: 0.74, sessions: 5 },
  { name: "Ardhachandra", mastery: 0.88, sessions: 4 },
  { name: "Mayura", mastery: 0.68, sessions: 3 },
  { name: "Kartarimukha", mastery: 0.62, sessions: 3 },
  { name: "Ardhapataka", mastery: 0.45, sessions: 1 },
]

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function confColor(c: number) {
  return c >= 0.8 ? "#22c55e" : c >= 0.6 ? "#f59e0b" : "#ef4444"
}

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState(MOCK_STATS)
  const [history, setHistory] = useState(MOCK_HISTORY)
  const [tab, setTab] = useState<"overview" | "history" | "progress">("overview")
  const [loadingStats, setLoadingStats] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return }
    // Try to load real stats from API, fall back to mock
    setLoadingStats(true)
    practiceAPI.getStats()
      .then((res) => setStats(res.data))
      .catch(() => {/* use mock */})
      .finally(() => setLoadingStats(false))

    practiceAPI.getHistory(10)
      .then((res) => setHistory(res.data))
      .catch(() => {/* use mock */})
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  const masteryLabel = (m: number) => {
    if (m >= 0.85) return { label: "Mastered", color: "#22c55e" }
    if (m >= 0.7) return { label: "Proficient", color: "#f59e0b" }
    if (m >= 0.5) return { label: "Learning", color: "#60a5fa" }
    return { label: "Beginner", color: "#a78bfa" }
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", paddingTop: "68px" }}>
      {/* Header */}
      <div style={{
        padding: "3rem 2rem 2.5rem",
        background: `radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,175,55,0.08) 0%, transparent 70%), var(--bg-secondary)`,
        borderBottom: "1px solid rgba(212,175,55,0.12)",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <div className="badge badge-gold" style={{ marginBottom: "0.75rem" }}>👤 My Dashboard</div>
            <h1 className="font-display" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "var(--text-primary)" }}>
              Namaste, <span className="text-gradient-gold">{user?.username || "Dancer"}</span> 🙏
            </h1>
            <p style={{ color: "var(--text-muted)", marginTop: "0.4rem" }}>
              Track your progress · Practice smarter · Master Bharatanatyam
            </p>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link href="/practice" style={{ textDecoration: "none" }}>
              <button className="btn-gold" style={{ padding: "12px 28px" }}>
                <span>🤖 Start Practice</span>
              </button>
            </Link>
            <Link href="/learn" style={{ textDecoration: "none" }}>
              <button className="btn-outline-gold" style={{ padding: "12px 28px" }}>
                🎬 Watch Lessons
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 2rem 5rem" }}>
        {/* ── STAT CARDS ─── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "1rem", marginBottom: "2.5rem",
        }}>
          {[
            { icon: "🎯", value: stats.total_sessions, label: "Sessions" },
            { icon: "🤲", value: stats.mudras_practiced, label: "Mudras Practiced" },
            { icon: "📈", value: `${Math.round(stats.avg_confidence * 100)}%`, label: "Avg Accuracy" },
            { icon: "🔥", value: stats.streak_days, label: "Day Streak" },
            { icon: "⏱️", value: `${stats.time_practiced_mins}m`, label: "Time Practiced" },
            { icon: "⭐", value: stats.top_mudra, label: "Best Mudra" },
          ].map((s, i) => (
            <div key={i} className="glass-card glass-card-hover" style={{ padding: "1.5rem", textAlign: "center" }}>
              <div style={{ fontSize: "1.8rem", marginBottom: "0.4rem" }}>{s.icon}</div>
              <div className="font-display" style={{
                fontSize: typeof s.value === "number" ? "2rem" : "1.3rem",
                color: "var(--gold)", fontWeight: 700, lineHeight: 1.1,
              }}>
                {s.value}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── TABS ──────── */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem" }}>
          {(["overview", "history", "progress"] as const).map((t) => (
            <button key={t} className={`tab-btn ${tab === t ? "active" : ""}`}
              onClick={() => setTab(t)} style={{ textTransform: "capitalize" }}>
              {t === "overview" ? "📊 Overview" : t === "history" ? "🕐 History" : "📈 Progress"}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ──── */}
        {tab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            {/* Recent activity */}
            <div className="glass-card" style={{ padding: "1.75rem" }}>
              <h3 className="font-display" style={{ color: "var(--gold)", marginBottom: "1.25rem", fontSize: "1.1rem" }}>
                🕐 Recent Activity
              </h3>
              {history.slice(0, 4).map((h, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 0",
                  borderBottom: i < 3 ? "1px solid rgba(212,175,55,0.08)" : "none",
                }}>
                  <div>
                    <div style={{ fontSize: "0.9rem", color: "var(--text-primary)", fontWeight: 500 }}>{h.mudra}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{timeAgo(h.timestamp)}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {h.errors.length === 0 ? (
                      <span style={{ fontSize: "0.78rem", color: "#22c55e" }}>✓ Perfect</span>
                    ) : (
                      <span style={{ fontSize: "0.78rem", color: "#f59e0b" }}>⚠ {h.errors.length} error{h.errors.length > 1 ? "s" : ""}</span>
                    )}
                    <span style={{
                      fontWeight: 700, fontSize: "0.85rem",
                      color: confColor(h.confidence),
                    }}>
                      {Math.round(h.confidence * 100)}%
                    </span>
                  </div>
                </div>
              ))}
              <Link href="#" onClick={() => setTab("history")} style={{ textDecoration: "none" }}>
                <p style={{ color: "var(--gold)", fontSize: "0.85rem", marginTop: "1rem", cursor: "pointer" }}>
                  View all →
                </p>
              </Link>
            </div>

            {/* Quick mudra mastery */}
            <div className="glass-card" style={{ padding: "1.75rem" }}>
              <h3 className="font-display" style={{ color: "var(--gold)", marginBottom: "1.25rem", fontSize: "1.1rem" }}>
                🤲 Mudra Mastery
              </h3>
              {MUDRA_PROGRESS.slice(0, 4).map((m, i) => (
                <div key={i} style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span style={{ fontSize: "0.88rem", color: "var(--text-primary)" }}>{m.name}</span>
                    <span style={{ fontSize: "0.78rem", color: confColor(m.mastery), fontWeight: 600 }}>
                      {Math.round(m.mastery * 100)}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{
                      width: `${m.mastery * 100}%`,
                      background: `linear-gradient(90deg, ${confColor(m.mastery)}, ${confColor(m.mastery)}aa)`,
                    }} />
                  </div>
                </div>
              ))}
              <Link href="#" onClick={() => setTab("progress")} style={{ textDecoration: "none" }}>
                <p style={{ color: "var(--gold)", fontSize: "0.85rem", marginTop: "0.5rem", cursor: "pointer" }}>
                  Full progress →
                </p>
              </Link>
            </div>

            {/* Streak calendar stub */}
            <div className="glass-card" style={{ padding: "1.75rem", gridColumn: "1 / -1" }}>
              <h3 className="font-display" style={{ color: "var(--gold)", marginBottom: "1.25rem", fontSize: "1.1rem" }}>
                🔥 Practice Streak — {stats.streak_days} Days
              </h3>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {Array.from({ length: 30 }).map((_, i) => {
                  const active = i >= 30 - stats.streak_days
                  const partial = ! active && Math.random() > 0.6
                  return (
                    <div key={i} title={`Day ${i + 1}`} style={{
                      width: "28px", height: "28px", borderRadius: "6px",
                      background: active
                        ? "linear-gradient(135deg, var(--saffron), var(--gold))"
                        : partial ? "rgba(212,175,55,0.2)" : "rgba(212,175,55,0.05)",
                      cursor: "default",
                      transition: "transform 0.2s",
                    }}
                      onMouseEnter={(e) => ((e.target as HTMLElement).style.transform = "scale(1.15)")}
                      onMouseLeave={(e) => ((e.target as HTMLElement).style.transform = "scale(1)")}
                    />
                  )
                })}
              </div>
              <div style={{ display: "flex", gap: "1.5rem", marginTop: "1rem" }}>
                {[{ c: "linear-gradient(135deg,var(--saffron),var(--gold))", l: "Practiced" }, { c: "rgba(212,175,55,0.2)", l: "Partial" }, { c: "rgba(212,175,55,0.05)", l: "Missed" }].map((l, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: l.c }} />
                    {l.l}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── HISTORY ───── */}
        {tab === "history" && (
          <div className="glass-card" style={{ padding: "1.75rem" }}>
            <h3 className="font-display" style={{ color: "var(--gold)", marginBottom: "1.5rem", fontSize: "1.1rem" }}>
              🕐 Practice History
            </h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(212,175,55,0.2)" }}>
                    {["Mudra", "Confidence", "Status", "Errors", "Time"].map((h) => (
                      <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", color: "var(--gold)", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, i) => (
                    <tr key={i}
                      style={{ borderBottom: "1px solid rgba(212,175,55,0.06)", transition: "background 0.2s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(212,175,55,0.04)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "0.85rem 1rem", color: "var(--text-primary)", fontWeight: 500 }}>{item.mudra}</td>
                      <td style={{ padding: "0.85rem 1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ width: "60px" }} className="progress-bar">
                            <div className="progress-fill" style={{ width: `${item.confidence * 100}%`, background: confColor(item.confidence) }} />
                          </div>
                          <span style={{ color: confColor(item.confidence), fontWeight: 600 }}>
                            {Math.round(item.confidence * 100)}%
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "0.85rem 1rem" }}>
                        {item.errors.length === 0
                          ? <span className="badge badge-green">✓ Perfect</span>
                          : <span className="badge badge-saffron">⚠ Needs Work</span>}
                      </td>
                      <td style={{ padding: "0.85rem 1rem", color: "var(--text-muted)", maxWidth: "250px" }}>
                        {item.errors.length === 0 ? "—" : item.errors.join(", ")}
                      </td>
                      <td style={{ padding: "0.85rem 1rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                        {timeAgo(item.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── PROGRESS ──── */}
        {tab === "progress" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className="glass-card" style={{ padding: "1.75rem" }}>
              <h3 className="font-display" style={{ color: "var(--gold)", marginBottom: "1.5rem", fontSize: "1.1rem" }}>
                📈 Mudra Mastery Progress
              </h3>
              {MUDRA_PROGRESS.map((m, i) => {
                const ml = masteryLabel(m.mastery)
                return (
                  <div key={i} style={{ marginBottom: "1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <div>
                        <span className="font-display" style={{ color: "var(--text-primary)", fontSize: "1rem" }}>{m.name}</span>
                        <span className="badge" style={{
                          marginLeft: "10px",
                          background: `${ml.color}20`, color: ml.color, border: `1px solid ${ml.color}40`,
                        }}>
                          {ml.label}
                        </span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ color: confColor(m.mastery), fontWeight: 700, fontSize: "1.1rem" }}>
                          {Math.round(m.mastery * 100)}%
                        </span>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{m.sessions} sessions</div>
                      </div>
                    </div>
                    <div className="progress-bar" style={{ height: "8px" }}>
                      <div className="progress-fill" style={{
                        width: `${m.mastery * 100}%`,
                        background: `linear-gradient(90deg, ${confColor(m.mastery)}, ${confColor(m.mastery)}bb)`,
                      }} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Recommendations */}
            <div className="glass-card" style={{ padding: "1.75rem", borderColor: "rgba(232,130,45,0.3)" }}>
              <h3 className="font-display" style={{ color: "var(--saffron)", marginBottom: "1.25rem", fontSize: "1.1rem" }}>
                💡 Recommendations
              </h3>
              {[
                { icon: "🎯", title: "Focus on Kartarimukha", desc: "Your lowest-scoring mudra. Practice the scissor-finger separation daily." },
                { icon: "📚", title: "Watch Mayura Tutorial", desc: "Mastering the peacock gesture will improve your abhinaya significantly." },
                { icon: "🔥", title: "Maintain your streak", desc: "5-day streak! Keep going — 10 days unlocks advanced content." },
              ].map((r, i) => (
                <div key={i} style={{
                  display: "flex", gap: "12px", alignItems: "flex-start",
                  padding: "12px 0", borderBottom: i < 2 ? "1px solid rgba(212,175,55,0.08)" : "none",
                }}>
                  <span style={{ fontSize: "1.5rem" }}>{r.icon}</span>
                  <div>
                    <div style={{ color: "var(--text-primary)", fontWeight: 500, marginBottom: "3px" }}>{r.title}</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
