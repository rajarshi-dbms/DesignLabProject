"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/AuthContext"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Placeholder video data — replaced by mentor's real videos from DB
const PLACEHOLDER_VIDEOS = [
  {
    id: 1, category: "Foundations",
    title: "Introduction to Bharatanatyam", duration: "12:34", level: "Beginner",
    instructor: "To be added by mentor",
    thumbnail: "🎬",
    description: "An overview of the dance form — its history, structure, and what you'll learn on this platform.",
  },
  {
    id: 2, category: "Adavus",
    title: "Tatta Adavu — All 8 Variants", duration: "24:10", level: "Beginner",
    instructor: "To be added by mentor",
    thumbnail: "🦶",
    description: "Master the foundational footwork sequences of Tatta Adavu with clear breakdowns of all 8 variants.",
  },
  {
    id: 3, category: "Adavus",
    title: "Natta Adavu — Variants 1-4", duration: "18:45", level: "Beginner",
    instructor: "To be added by mentor",
    thumbnail: "🤸",
    description: "Stretching movements of hands and legs — the second adavu in the classical curriculum.",
  },
  {
    id: 4, category: "Mudras",
    title: "Asamyuta Hastas — Single Hand Mudras", duration: "31:20", level: "Intermediate",
    instructor: "To be added by mentor",
    thumbnail: "🤲",
    description: "Comprehensive lesson on all 28 single-hand gestures with meanings and practice drills.",
  },
  {
    id: 5, category: "Mudras",
    title: "Samyuta Hastas — Double Hand Mudras", duration: "28:00", level: "Intermediate",
    instructor: "To be added by mentor",
    thumbnail: "👐",
    description: "The24 double-hand gestures and their contextual usage in dance compositions.",
  },
  {
    id: 6, category: "Abhinaya",
    title: "Navarasas — Mastering Facial Expressions", duration: "22:15", level: "Intermediate",
    instructor: "To be added by mentor",
    thumbnail: "😊",
    description: "Step-by-step training for all nine emotional expressions with mirror exercises.",
  },
  {
    id: 7, category: "Compositions",
    title: "Alaripu — The Opening Invocation", duration: "35:50", level: "Intermediate",
    instructor: "To be added by mentor",
    thumbnail: "🌸",
    description: "Learn the complete Alaripu — the first composition in the Margam recital sequence.",
  },
  {
    id: 8, category: "Compositions",
    title: "Jatiswaram — Pure Dance Composition", duration: "42:00", level: "Advanced",
    instructor: "To be added by mentor",
    thumbnail: "🎵",
    description: "An advanced pure-dance composition set to classical Carnatic music with complex footwork.",
  },
  {
    id: 9, category: "Advanced",
    title: "Varnam — The Centerpiece", duration: "58:30", level: "Advanced",
    instructor: "To be added by mentor",
    thumbnail: "👑",
    description: "The crown jewel of Bharatanatyam — combining nritta, nritya and abhinaya in one grand composition.",
  },
]

const CATEGORIES = ["All", "Foundations", "Adavus", "Mudras", "Abhinaya", "Compositions", "Advanced"]
const LEVELS = ["All Levels", "Beginner", "Intermediate", "Advanced"]
const levelColor: Record<string, string> = {
  Beginner: "#22c55e", Intermediate: "#f59e0b", Advanced: "#ef4444",
}

export default function LearnPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [category, setCategory] = useState("All")
  const [level, setLevel] = useState("All Levels")
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<typeof PLACEHOLDER_VIDEOS[0] | null>(null)

  const filtered = PLACEHOLDER_VIDEOS.filter((v) => {
    const matchCat = category === "All" || v.category === category
    const matchLvl = level === "All Levels" || v.level === level
    const matchSearch = !search || v.title.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchLvl && matchSearch
  })

  const handleWatch = (v: typeof PLACEHOLDER_VIDEOS[0]) => {
    if (!isAuthenticated) { router.push("/login"); return }
    setSelected(v)
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", paddingTop: "68px" }}>
      {/* Header */}
      <div style={{
        padding: "4rem 2rem 3rem", textAlign: "center",
        background: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,175,55,0.08) 0%, transparent 70%), var(--bg-secondary)`,
        borderBottom: "1px solid rgba(212,175,55,0.12)",
      }}>
        <div className="badge badge-gold" style={{ marginBottom: "1rem" }}>🎬 Video Library</div>
        <h1 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "var(--text-primary)", marginBottom: "0.75rem" }}>
          Learn <span className="text-gradient-gold">Bharatanatyam</span>
        </h1>
        <p style={{ color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto", lineHeight: 1.7 }}>
          Expert-curated video lessons from foundation to advanced. Videos are provided by our mentor and will be available once integrated.
        </p>

        {!isAuthenticated && (
          <div className="glass-card" style={{
            display: "inline-flex", alignItems: "center", gap: "12px",
            padding: "12px 24px", marginTop: "1.5rem",
            borderColor: "rgba(232,130,45,0.4)",
          }}>
            <span>🔒</span>
            <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              <Link href="/login" style={{ color: "var(--gold)", textDecoration: "none" }}>Sign in</Link> to watch full videos
            </span>
          </div>
        )}
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 2rem 5rem" }}>
        {/* Search + Filters */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem", alignItems: "center" }}>
          <input
            type="text"
            placeholder="🔍 Search videos…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-dark"
            style={{ flex: "1 1 250px", maxWidth: "350px" }}
          />
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {LEVELS.map((l) => (
              <button key={l} className={`tab-btn ${level === l ? "active" : ""}`}
                onClick={() => setLevel(l)} style={{ padding: "8px 16px", fontSize: "0.82rem" }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Category tabs */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
          {CATEGORIES.map((c) => (
            <button key={c} className={`tab-btn ${category === c ? "active" : ""}`}
              onClick={() => setCategory(c)}>
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {filtered.map((v) => (
            <div key={v.id} className="glass-card glass-card-hover" style={{ overflow: "hidden" }}>
              {/* Thumbnail */}
              <div style={{
                height: "160px",
                background: `linear-gradient(135deg, rgba(20,12,4,0.9), rgba(139,26,26,0.3))`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "3.5rem", position: "relative",
                borderBottom: "1px solid rgba(212,175,55,0.15)",
              }}>
                {v.thumbnail}
                <div style={{
                  position: "absolute", bottom: "10px", right: "10px",
                  background: "rgba(0,0,0,0.7)", borderRadius: "6px",
                  padding: "3px 8px", fontSize: "0.75rem", color: "var(--text-muted)",
                }}>
                  ⏱ {v.duration}
                </div>
                <div style={{
                  position: "absolute", top: "10px", left: "10px",
                }}>
                  <span className="badge badge-gold" style={{ fontSize: "0.7rem" }}>{v.category}</span>
                </div>
              </div>

              <div style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <h3 className="font-display" style={{ fontSize: "1.05rem", color: "var(--text-primary)", flex: 1, lineHeight: 1.3 }}>
                    {v.title}
                  </h3>
                  <span style={{
                    fontSize: "0.72rem", fontWeight: 600, color: levelColor[v.level],
                    background: `${levelColor[v.level]}20`, borderRadius: "50px",
                    padding: "3px 10px", border: `1px solid ${levelColor[v.level]}40`,
                    marginLeft: "8px", whiteSpace: "nowrap",
                  }}>
                    {v.level}
                  </span>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.84rem", lineHeight: 1.6, marginBottom: "1rem" }}>
                  {v.description}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>👤 {v.instructor}</span>
                  <button
                    onClick={() => handleWatch(v)}
                    className="btn-gold"
                    style={{ padding: "8px 20px", fontSize: "0.85rem" }}
                  >
                    <span>{isAuthenticated ? "▶ Watch" : "🔒 Login"}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
            <p>No videos found for your search. Try adjusting filters.</p>
          </div>
        )}
      </div>

      {/* Video player modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div
            className="glass-card"
            style={{ maxWidth: "700px", width: "90%", padding: "2rem" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 className="font-display" style={{ fontSize: "1.4rem", color: "var(--gold)" }}>{selected.title}</h2>
              <button onClick={() => setSelected(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "1.5rem" }}>✕</button>
            </div>

            {/* Placeholder video player */}
            <div style={{
              background: "#000", borderRadius: "12px", height: "320px",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              border: "1px solid rgba(212,175,55,0.2)",
            }}>
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>{selected.thumbnail}</div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", textAlign: "center", maxWidth: "350px" }}>
                🎬 Video player will be integrated by the mentor.<br />
                The actual video content will be loaded from the database.
              </p>
              <div className="badge badge-saffron" style={{ marginTop: "1rem" }}>
                ⏳ Coming Soon
              </div>
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.7 }}>{selected.description}</p>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", flexWrap: "wrap" }}>
                <span className="badge badge-gold">📂 {selected.category}</span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>⏱ {selected.duration}</span>
                <span style={{ fontSize: "0.82rem", color: levelColor[selected.level], fontWeight: 500 }}>● {selected.level}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
