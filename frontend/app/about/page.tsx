"use client"

import { useState } from "react"

const adavus = [
  { no: 1, name: "Tatta", variants: 8, desc: "The foundational footwork. Feet striking the floor rhythmically — the first adavu learned." },
  { no: 2, name: "Natta", variants: 8, desc: "Stretching movements of hands and legs simultaneously with emphasis on posture alignment." },
  { no: 3, name: "Pakka", variants: 4, desc: "Side-wise or horizontal movements that train lateral weight shifts and balance." },
  { no: 4, name: "Mettu", variants: 4, desc: "Raising the toes or slight jumping with heels striking the floor for rhythmic emphasis." },
  { no: 5, name: "Nattal", variants: 6, desc: "Complex footwork combining strikes and lifts, building stamina and rhythmic precision." },
  { no: 6, name: "Tattal", variants: 5, desc: "Advanced footwork involving syncopated beats and multiple directional shifts." },
  { no: 7, name: "Paikkal", variants: 3, desc: "Circular and rotational leg movements that train hip flexibility and center of gravity." },
  { no: 8, name: "Tei tei dhata", variants: 3, desc: "Compound adavu combining tei tei beats with dhata — a rhythmic composition in itself." },
  { no: 9, name: "Katti Kartari", variants: 1, desc: "Scissor-like leg motions training inner thigh strength and precise leg control." },
  { no: 10, name: "Utsanga", variants: 1, desc: "Movements with arms crossing the body, depicting embraces or complex emotive postures." },
  { no: 11, name: "Mandi", variants: 2, desc: "Deep squatting adavus performed in mandimandi level, requiring exceptional strength." },
  { no: 12, name: "Sarikkal", variants: 3, desc: "Sliding steps that traverse space while maintaining postural integrity and grace." },
  { no: 13, name: "Tirmana", variants: 3, desc: "Concluding adavus used to end sequences, with dynamic footwork and expansive gestures." },
  { no: 14, name: "Sarika", variants: 4, desc: "Combination movements blending footwork with hand gestures for integrated expression." },
  { no: 15, name: "Joining", variants: 3, desc: "Linking adavus that connect different sequences, maintaining flow and continuity." },
]

const positions = [
  { name: "Samapada", desc: "Standing with feet together, weight equally distributed. The position of readiness and respect.", icon: "⚖️" },
  { name: "Aramandi", desc: "Half-sitting position with knees bent outward — the characteristic Bharatanatyam stance.", icon: "🦺" },
  { name: "Muzhumandi", desc: "Full sitting position close to ground. Requires extreme flexibility and inner thigh strength.", icon: "🧎" },
  { name: "Swastika", desc: "Cross-legged stance emphasizing hip openness and symmetric body alignment.", icon: "✙" },
  { name: "Prenkhana", desc: "Swinging posture used for dynamic transitional sequences in performance.", icon: "🌊" },
]

const navrasas = [
  { name: "Sringara", meaning: "Love / Beauty", desc: "The sentiment of love, beauty and attraction — considered the king of all rasas.", emoji: "💕" },
  { name: "Hasya", meaning: "Joy / Laughter", desc: "Humor, light-heartedness and the expression of happiness and comic situations.", emoji: "😊" },
  { name: "Karuna", meaning: "Sorrow / Compassion", desc: "Pathos, grief, and the deep emotion of empathy toward suffering.", emoji: "😢" },
  { name: "Raudra", meaning: "Fury / Rage", desc: "Anger, wrath and fierce determination expressed through powerful movement.", emoji: "😤" },
  { name: "Vira", meaning: "Heroism", desc: "Courage, heroism, confidence and warrior spirit embodied in dynamic postures.", emoji: "⚔️" },
  { name: "Bhayanaka", meaning: "Terror / Fear", desc: "Fear, dread, anxiety — conveyed with wide eyes, trembling and contraction.", emoji: "😨" },
  { name: "Bibhatsa", meaning: "Disgust", desc: "Revulsion and aversion expressed through specific facial micro-expressions.", emoji: "🤢" },
  { name: "Adbhuta", meaning: "Wonder", desc: "Amazement and wonder at the extraordinary, depicted with eyes wide open.", emoji: "🤩" },
  { name: "Shanta", meaning: "Peace / Serenity", desc: "Calmness, tranquility and spiritual bliss — often the culminating state.", emoji: "🧘" },
]

const tabs = ["Overview", "Adavus", "Positions", "Navarasas"]

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("Overview")

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", paddingTop: "68px" }}>
      {/* Hero banner */}
      <div style={{
        padding: "5rem 2rem 4rem",
        textAlign: "center",
        background: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,175,55,0.1) 0%, transparent 70%), var(--bg-secondary)`,
        borderBottom: "1px solid rgba(212,175,55,0.12)",
      }}>
        <div className="badge badge-gold" style={{ marginBottom: "1.5rem" }}>
          📚 Complete Guide
        </div>
        <h1 className="font-display" style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)", color: "var(--text-primary)", marginBottom: "1rem" }}>
          Indian Classical Dance
          <br />
          <span className="text-gradient-gold">Bharatanatyam</span>
        </h1>
        <p style={{ color: "var(--text-muted)", maxWidth: "700px", margin: "0 auto", fontSize: "1.05rem", lineHeight: 1.8 }}>
          One of India's oldest classical dance forms, rooted in the sacred temples of Tamil Nadu.
          Dating back over 2,000 years, Bharatanatyam is a synthesis of expression (<em>bhava</em>),
          melody (<em>raga</em>), rhythm (<em>tala</em>), and technique (<em>natya</em>).
        </p>

        {/* Quick stats */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center",
          marginTop: "2.5rem",
        }}>
          {[{ v: "2000+", l: "Years Old" }, { v: "15", l: "Adavus" }, { v: "28+28", l: "Hasta Mudras" }, { v: "9", l: "Navarasas" }].map((s, i) => (
            <div key={i} className="glass-card" style={{ padding: "1rem 2rem", textAlign: "center", minWidth: "140px" }}>
              <div className="font-display" style={{ fontSize: "1.8rem", color: "var(--gold)", fontWeight: 700 }}>{s.v}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex", gap: "0.5rem", justifyContent: "center",
        padding: "2rem 1rem 0", flexWrap: "wrap",
      }}>
        {tabs.map(t => (
          <button key={t} className={`tab-btn ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "3rem 2rem 5rem" }}>

        {/* ── OVERVIEW ──── */}
        {activeTab === "Overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
            {[
              {
                icon: "🏛️", title: "Origins & History",
                content: `Bharatanatyam traces its origins to the Devadasi tradition — temple dancers who performed as sacred offerings to deities. Codified in the ancient treatise Natya Shastra by Bharata Muni, the dance form was revived and systematized in the 20th century by luminaries like Rukmini Devi Arundale and Balasaraswati, transforming it from temple courts to concert stages worldwide.`,
              },
              {
                icon: "🎭", title: "Nritta, Nritya & Natya",
                content: `Bharatanatyam encompasses three aspects: Nritta (pure rhythmic movement with no narrative), Nritya (expressive dance combining rhythm and emotion), and Natya (dramatic presentation of stories, usually from Hindu mythology). Mastery across all three is the hallmark of a trained dancer.`,
              },
              {
                icon: "🎶", title: "Music & Rhythm",
                content: `The dance is performed to Carnatic classical music, with the mridangam drum setting the tala (rhythmic cycle) and the vocalist narrating the story. Common talas include Adi (8 beats), Rupaka (6 beats), and Tisra Ekam (3 beats). The nattuvangam — the conductor keeping beat with cymbals — is central to any Bharatanatyam performance.`,
              },
              {
                icon: "👗", title: "Costume & Presentation",
                content: `The classical silk saree is worn in a distinctive style with pleated fabric at the front. Heavy jewellery — necklaces, earrings, maang tikka, and arm bangles — are traditionally crafted in temple jewellery style. The feet are adorned with ghungroo (ankle bells), and the eyes and hands are highlighted with kajal and alta respectively.`,
              },
              {
                icon: "🌸", title: "Margam — The Recital Structure",
                content: `A full Bharatanatyam Margam (journey) follows a defined sequence: Alaripu → Jatiswaram → Shabdam → Varnam → Padams → Tillana → Shlokam. The Varnam is the centrepiece — combining both nritta and abhinaya at length — while Tillana is the joyous, energetic conclusion.`,
              },
              {
                icon: "🤚", title: "Hasta Mudras",
                content: `There are 28 Asamyuta (single hand) and 24 Samyuta (double hand) hasta mudras, each with multiple meanings depending on context. For instance, Pataka (flag) can represent a cloud, forest, wind, river, or a king — the meaning emerges through accompanying expression and context.`,
              },
            ].map((item, i) => (
              <div key={i} className="glass-card glass-card-hover" style={{ padding: "2rem" }}>
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{item.icon}</div>
                <h3 className="font-display" style={{ fontSize: "1.3rem", color: "var(--gold)", marginBottom: "0.75rem" }}>
                  {item.title}
                </h3>
                <p style={{ color: "var(--text-muted)", lineHeight: 1.8, fontSize: "0.92rem" }}>{item.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── ADAVUS ────── */}
        {activeTab === "Adavus" && (
          <div>
            <div className="section-header">
              <h2 className="font-display" style={{ fontSize: "2rem" }}>The 15 Adavus</h2>
              <p>Fundamental footwork sequences — the building blocks of all Bharatanatyam choreography</p>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(212,175,55,0.3)" }}>
                    {["Sl.#", "Adavu Name", "Variants", "Description"].map(h => (
                      <th key={h} style={{ padding: "1rem", textAlign: "left", color: "var(--gold)", fontWeight: 600, fontFamily: "'Playfair Display', serif" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {adavus.map((a, i) => (
                    <tr key={i} style={{
                      borderBottom: "1px solid rgba(212,175,55,0.08)",
                      transition: "background 0.2s",
                    }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(212,175,55,0.04)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "1rem", color: "var(--text-muted)" }}>{a.no}</td>
                      <td style={{ padding: "1rem", color: "var(--text-primary)", fontWeight: 600, fontFamily: "'Playfair Display', serif" }}>{a.name}</td>
                      <td style={{ padding: "1rem" }}>
                        <span className="badge badge-gold">{a.variants}</span>
                      </td>
                      <td style={{ padding: "1rem", color: "var(--text-muted)", maxWidth: "400px", lineHeight: 1.6 }}>{a.desc}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ borderTop: "1px solid rgba(212,175,55,0.3)" }}>
                    <td colSpan={4} style={{ padding: "1rem", textAlign: "right" }}>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Total: </span>
                      <span style={{ color: "var(--gold)", fontWeight: 600 }}>15 Adavus · 58 Variants</span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* ── POSITIONS ─── */}
        {activeTab === "Positions" && (
          <div>
            <div className="section-header">
              <h2 className="font-display" style={{ fontSize: "2rem" }}>Body Positions (Sthanakas)</h2>
              <p>Core standing and sitting postures that define the spatial quality of Bharatanatyam</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
              {positions.map((p, i) => (
                <div key={i} className="glass-card glass-card-hover" style={{ padding: "2rem", display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
                  <div style={{
                    width: "52px", height: "52px", flexShrink: 0,
                    background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.25)",
                    borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.5rem",
                  }}>{p.icon}</div>
                  <div>
                    <h3 className="font-display" style={{ fontSize: "1.15rem", color: "var(--gold)", marginBottom: "0.4rem" }}>{p.name}</h3>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.7 }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="glass-card" style={{ marginTop: "2rem", padding: "2rem" }}>
              <h3 className="font-display" style={{ color: "var(--gold)", marginBottom: "1rem", fontSize: "1.2rem" }}>
                🎯 Physical Demands
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
                {["Precision — every angle is defined", "Balance — single-leg postures", "Strength — deep aramandi squat", "Flexibility — full splits (muzhumandi)", "Body alignment — spine always erect"].map((d, i) => (
                  <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                    <span style={{ color: "var(--gold)", marginTop: "2px" }}>◆</span>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── NAVARASAS ─── */}
        {activeTab === "Navarasas" && (
          <div>
            <div className="section-header">
              <h2 className="font-display" style={{ fontSize: "2rem" }}>The Nine Emotions (Navarasas)</h2>
              <p>Facial expressions (Bhavas) that breathe life, character, and emotion into Bharatanatyam</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "1.25rem" }}>
              {navrasas.map((r, i) => (
                <div key={i} className="glass-card glass-card-hover" style={{ padding: "1.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: "2rem" }}>{r.emoji}</span>
                    <div>
                      <div className="font-display" style={{ fontSize: "1.1rem", color: "var(--gold)" }}>{r.name}</div>
                      <div className="badge badge-saffron" style={{ marginTop: "4px" }}>{r.meaning}</div>
                    </div>
                  </div>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", lineHeight: 1.7 }}>{r.desc}</p>
                </div>
              ))}
            </div>
            <div className="glass-card" style={{ marginTop: "2rem", padding: "2rem", borderColor: "rgba(232,130,45,0.3)" }}>
              <h3 className="font-display" style={{ color: "var(--saffron)", marginBottom: "0.75rem", fontSize: "1.2rem" }}>
                💡 Key Features of Abhinaya (Expression)
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                {[
                  "Eyes (Nayanas) — convey rasa directly to the audience",
                  "Eyebrows (Bhru) — rise and furrow to amplify emotion",
                  "Lips (Adharas) — subtle movements add emotional depth",
                  "Cheeks — used to show joy, anger, and surprise",
                  "Neck (Greeva) — 9 neck movements for expression",
                  "Gaze (Dristi) — 36 distinct eye movements are codified",
                ].map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: "8px", fontSize: "0.88rem", color: "var(--text-muted)" }}>
                    <span style={{ color: "var(--saffron)" }}>◆</span> {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
