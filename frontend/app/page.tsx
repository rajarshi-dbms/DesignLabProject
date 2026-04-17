"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"

const mudras = [
  { name: "Pataka", sanskrit: "पताका", meaning: "Flag", fingers: "All four fingers extended, thumb folded" },
  { name: "Tripataka", sanskrit: "त्रिपताका", meaning: "Three parts of a flag", fingers: "Ring finger bent, others extended" },
  { name: "Ardhapataka", sanskrit: "अर्धपताका", meaning: "Half flag", fingers: "Two fingers extended and separated" },
  { name: "Kartarimukha", sanskrit: "कर्तरीमुख", meaning: "Scissors face", fingers: "Index & little finger extended, others closed" },
  { name: "Mayura", sanskrit: "मयूर", meaning: "Peacock", fingers: "Thumb touching index finger tip" },
  { name: "Ardhachandra", sanskrit: "अर्धचंद्र", meaning: "Half moon", fingers: "Open palm with fingers stretched" },
]

const stats = [
  { value: "28", label: "Hasta Mudras", icon: "🤲" },
  { value: "15", label: "Adavus", icon: "🦶" },
  { value: "9", label: "Navrasas", icon: "😊" },
  { value: "58", label: "Variants", icon: "✨" },
]

const features = [
  { icon: "🎬", title: "Video Tutorials", desc: "Curated lessons from expert instructors covering all aspects of Bharatanatyam" },
  { icon: "🤖", title: "AI Practice Mode", desc: "Real-time mudra detection via your webcam with instant corrective feedback" },
  { icon: "📊", title: "Progress Dashboard", desc: "Track your learning journey with detailed analytics and session history" },
  { icon: "🏆", title: "Structured Curriculum", desc: "Graded content from basics to advanced compositions for all skill levels" },
]

export default function HomePage() {
  const [activeIdx, setActiveIdx] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((i) => (i + 1) % mudras.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{
        minHeight: "100vh",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden",
        paddingTop: "80px",
        background: `
          radial-gradient(ellipse 80% 60% at 50% -10%, rgba(212,175,55,0.12) 0%, transparent 60%),
          radial-gradient(ellipse 40% 40% at 85% 70%, rgba(232,130,45,0.08) 0%, transparent 50%),
          var(--bg-primary)
        `,
      }}>
        {/* Decorative ring */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: "700px", height: "700px",
          border: "1px solid rgba(212,175,55,0.05)",
          borderRadius: "50%",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: "500px", height: "500px",
          border: "1px solid rgba(212,175,55,0.08)",
          borderRadius: "50%",
          pointerEvents: "none",
        }} />

        <div style={{ textAlign: "center", maxWidth: "860px", padding: "0 2rem", position: "relative", zIndex: 2 }}>
          <div className="badge badge-saffron animate-fade-in" style={{ marginBottom: "1.5rem", fontSize: "0.8rem" }}>
            🪷 Indian Classical Dance Platform
          </div>

          <h1 className="font-display animate-fade-in-up" style={{
            fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
            fontWeight: 700, lineHeight: 1.1,
            color: "#F5E6C8",
            marginBottom: "1rem",
          }}>
            Master the Art of{" "}
            <span className="text-gradient-gold">Bharatanatyam</span>
          </h1>

          <p className="animate-fade-in-up delay-200" style={{
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            color: "var(--text-muted)",
            lineHeight: 1.8,
            maxWidth: "600px",
            margin: "0 auto 2.5rem",
          }}>
            Learn mudras, adavus and bhavas through expert video tutorials
            and AI-guided real-time feedback. Your journey to classical dance begins here.
          </p>

          <div className="animate-fade-in-up delay-300" style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" style={{ textDecoration: "none" }}>
              <button className="btn-gold" style={{ fontSize: "1rem", padding: "14px 40px" }}>
                <span>Start Learning Free</span>
              </button>
            </Link>
            <Link href="/about" style={{ textDecoration: "none" }}>
              <button className="btn-outline-gold" style={{ fontSize: "1rem", padding: "14px 40px" }}>
                Explore Bharatanatyam
              </button>
            </Link>
          </div>

          {/* Floating mudra badge */}
          <div className="animate-fade-in-up delay-500 glass-card animate-float" style={{
            display: "inline-flex", alignItems: "center", gap: "12px",
            padding: "14px 24px", marginTop: "3rem",
            borderRadius: "100px",
          }}>
            <span style={{ fontSize: "1.4rem" }}>🤲</span>
            <div style={{ textAlign: "left" }}>
              <div className="font-display" style={{ color: "var(--gold)", fontSize: "1rem", fontWeight: 600 }}>
                {mudras[activeIdx].name}
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
                {mudras[activeIdx].meaning}
              </div>
            </div>
            <div className="font-devanagari" style={{ color: "var(--gold)", fontSize: "1.2rem", marginLeft: "4px" }}>
              {mudras[activeIdx].sanskrit}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
        }}>
          <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", letterSpacing: "2px" }}>SCROLL</span>
          <div style={{
            width: "1px", height: "40px",
            background: "linear-gradient(to bottom, var(--gold), transparent)",
          }} />
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────── */}
      <section style={{
        padding: "5rem 2rem",
        background: "linear-gradient(180deg, var(--bg-primary), var(--bg-secondary))",
      }}>
        <div style={{
          maxWidth: "1000px", margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.5rem",
        }}>
          {stats.map((s, i) => (
            <div key={i} className="glass-card glass-card-hover" style={{ padding: "2rem", textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>{s.icon}</div>
              <div className="font-display" style={{ fontSize: "3rem", fontWeight: 700, color: "var(--gold)", lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "0.5rem" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section style={{ padding: "5rem 2rem", background: "var(--bg-secondary)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div className="section-header">
            <div className="divider-gold" style={{ margin: "0 auto 1rem" }} />
            <h2 className="font-display">Everything You Need to Learn</h2>
            <p>A complete ecosystem built for serious students of Indian classical dance</p>
          </div>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.5rem",
          }}>
            {features.map((f, i) => (
              <div key={i} className="glass-card glass-card-hover" style={{ padding: "2rem" }}>
                <div style={{
                  width: "52px", height: "52px",
                  background: "rgba(212,175,55,0.1)",
                  border: "1px solid rgba(212,175,55,0.2)",
                  borderRadius: "12px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.5rem", marginBottom: "1rem",
                }}>
                  {f.icon}
                </div>
                <h3 className="font-display" style={{ fontSize: "1.2rem", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                  {f.title}
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.7 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MUDRA SHOWCASE ───────────────────────────────────── */}
      <section style={{ padding: "5rem 2rem", background: "var(--bg-primary)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div className="section-header">
            <div className="divider-gold" style={{ margin: "0 auto 1rem" }} />
            <h2 className="font-display">Asamyuta Hasta Mudras</h2>
            <p>28 single-hand gestures that form the visual language of Bharatanatyam</p>
          </div>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "1rem",
          }}>
            {mudras.map((m, i) => (
              <div key={i} className={`glass-card glass-card-hover ${i === activeIdx ? "border-gold-active" : ""}`}
                style={{
                  padding: "1.5rem",
                  border: i === activeIdx ? "1px solid rgba(212,175,55,0.6)" : undefined,
                  boxShadow: i === activeIdx ? "0 4px 20px rgba(212,175,55,0.2)" : undefined,
                  cursor: "pointer",
                }}
                onClick={() => setActiveIdx(i)}
              >
                <div className="font-devanagari" style={{ fontSize: "1.5rem", color: "var(--gold)", marginBottom: "0.5rem" }}>
                  {m.sanskrit}
                </div>
                <div className="font-display" style={{ fontSize: "1.05rem", color: "var(--text-primary)", marginBottom: "0.25rem" }}>
                  {m.name}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{m.meaning}</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.5rem", lineHeight: 1.5 }}>
                  {m.fingers}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section style={{
        padding: "6rem 2rem", textAlign: "center",
        background: `linear-gradient(135deg, rgba(139,26,26,0.15) 0%, rgba(212,175,55,0.08) 50%, rgba(10,6,3,0) 100%), var(--bg-secondary)`,
      }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h2 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "var(--text-primary)", marginBottom: "1rem" }}>
            Begin Your <span className="text-gradient-gold">Sacred Journey</span>
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", marginBottom: "2.5rem", lineHeight: 1.8 }}>
            Join learners from across India and the world exploring the divine art of Bharatanatyam through modern AI tools.
          </p>
          <Link href="/register" style={{ textDecoration: "none" }}>
            <button className="btn-gold" style={{ fontSize: "1.1rem", padding: "16px 48px" }}>
              <span>🪷 Start for Free</span>
            </button>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{
        borderTop: "1px solid rgba(212,175,55,0.1)",
        padding: "2rem", textAlign: "center",
        color: "var(--text-muted)", fontSize: "0.85rem",
      }}>
        <span className="font-display" style={{ color: "var(--gold)" }}>NrityanGuru</span>
        {" "} · Indian Classical Dance Learning Platform · 2024
      </footer>
    </div>
  )
}
