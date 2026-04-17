"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useAuth } from "@/lib/AuthContext"
import { useRouter } from "next/navigation"
import { practiceAPI } from "@/lib/api"

const MUDRA_TIPS: Record<string, string[]> = {
  Pataka: ["Extend all four fingers fully", "Keep thumb folded neatly inward", "Wrist should be straight", "Palm faces away from body"],
  Tripataka: ["Bend ring finger at first joint", "Keep other three fingers straight", "Thumb remains folded", "Hold the position steady"],
  Ardhapataka: ["Extend index and middle fingers", "Separate them slightly like a V", "Keep ring finger and pinky closed", "Thumb should rest on ring finger"],
  Kartarimukha: ["Extend index and little fingers", "Keep middle and ring fingers down", "Thumb rests on middle finger", "Wrist rotation defines the gesture"],
  Mayura: ["Touch thumb tip to index finger tip lightly", "Other fingers remain gently spread", "Rotate wrist to suggest peacock's beak", "Elbow should be at shoulder height"],
  Ardhachandra: ["Open palm fully with all fingers spread", "Stretch each finger to maximum extension", "Wrist slightly bent backward", "Fingers curved like a crescent moon"],
}

const MUDRAS_LIST = Object.keys(MUDRA_TIPS)

type AnalysisResult = {
  predicted_mudra: string
  confidence: number
  errors?: string[]
  suggestions?: string[]
  meaning?: string
  description?: string
  sanskrit_name?: string
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.readAsDataURL(blob)
  })
}

export default function PracticePage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [cameraOn, setCameraOn] = useState(false)
  const [capturing, setCapturing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [history, setHistory] = useState<AnalysisResult[]>([])
  const [selectedMudra, setSelectedMudra] = useState(MUDRAS_LIST[0])
  const [mode, setMode] = useState<"manual" | "live">("manual")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [sessionCount, setSessionCount] = useState(0)
  const [avgConfidence, setAvgConfidence] = useState(0)

  useEffect(() => {
    if (!isAuthenticated) router.push("/login")
  }, [isAuthenticated, router])

  useEffect(() => {
    return () => {
      stopCamera()
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const startCamera = async () => {
    setError("")
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: "user" },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setCameraOn(true)
    } catch (err) {
      setError("Cannot access camera. Please allow camera permissions and try again.")
    }
  }

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setCameraOn(false)
    setCapturing(false)
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
  }

  const captureFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return null
    const canvas = canvasRef.current
    const video = videoRef.current
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    const ctx = canvas.getContext("2d")!
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    return new Promise<Blob | null>((res) => canvas.toBlob((b) => res(b), "image/jpeg", 0.85))
  }, [])

  const analyze = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const blob = await captureFrame()
      if (!blob) { setError("Could not capture frame."); return }

      // Call backend ML endpoint
      const res = await practiceAPI.analyzeFrame(blob)
      const data: AnalysisResult = res.data

      // Merge with tips for selected mudra if not enough suggestions
      if (!data.suggestions || data.suggestions.length === 0) {
        data.suggestions = MUDRA_TIPS[data.predicted_mudra] || MUDRA_TIPS[selectedMudra]
      }

      setResult(data)
      setHistory((h) => [data, ...h].slice(0, 10))
      setSessionCount((c) => c + 1)
      setAvgConfidence((prev) => {
        const total = prev * (sessionCount) + data.confidence
        return total / (sessionCount + 1)
      })
    } catch (err: any) {
      const msg = err?.response?.data?.detail
      if (msg) {
        setError(msg)
      } else {
        // ML not connected — show mock result for UI demo
        const mockMudras = ["Pataka", "Tripataka", "Mayura", "Ardhachandra"]
        const mock: AnalysisResult = {
          predicted_mudra: mockMudras[Math.floor(Math.random() * mockMudras.length)],
          confidence: 0.65 + Math.random() * 0.3,
          errors: ["Thumb position slightly off", "Wrist angle needs adjustment"],
          suggestions: MUDRA_TIPS[selectedMudra],
          meaning: "Practice mode — ML model not connected",
          description: "Connect the ML model to get real-time analysis.",
          sanskrit_name: "पताका",
        }
        setResult(mock)
        setHistory((h) => [mock, ...h].slice(0, 10))
        setSessionCount((c) => c + 1)
      }
    } finally {
      setLoading(false)
    }
  }, [captureFrame, selectedMudra, sessionCount])

  const startCountdownCapture = () => {
    let c = 3
    setCountdown(c)
    const interval = setInterval(() => {
      c--
      if (c <= 0) {
        clearInterval(interval)
        setCountdown(null)
        analyze()
      } else {
        setCountdown(c)
      }
    }, 1000)
  }

  const toggleLiveMode = () => {
    if (capturing) {
      setCapturing(false)
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
    } else {
      setCapturing(true)
      intervalRef.current = setInterval(analyze, 3000)
    }
  }

  const confidenceColor = (c: number) =>
    c >= 0.8 ? "#22c55e" : c >= 0.6 ? "#f59e0b" : "#ef4444"

  if (!isAuthenticated) return null

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", paddingTop: "68px" }}>
      {/* Header */}
      <div style={{
        padding: "3rem 2rem 2rem", textAlign: "center",
        background: `radial-gradient(ellipse 70% 50% at 50% 0%, rgba(212,175,55,0.08) 0%, transparent 70%), var(--bg-secondary)`,
        borderBottom: "1px solid rgba(212,175,55,0.12)",
      }}>
        <div className="badge badge-gold" style={{ marginBottom: "1rem" }}>🤖 AI Practice Mode</div>
        <h1 className="font-display" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
          Live Mudra <span className="text-gradient-gold">Recognition</span>
        </h1>
        <p style={{ color: "var(--text-muted)", maxWidth: "550px", margin: "0 auto" }}>
          Show a mudra to your camera. Our AI will identify it and provide corrective feedback in real time.
        </p>
      </div>

      <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "2rem", display: "grid", gridTemplateColumns: "1fr 380px", gap: "2rem" }}>

        {/* ── LEFT: Camera ── */}
        <div>
          {/* Mode switcher */}
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
            {(["manual", "live"] as const).map((m) => (
              <button key={m} className={`tab-btn ${mode === m ? "active" : ""}`}
                onClick={() => { setMode(m); if (capturing) toggleLiveMode() }}
                style={{ textTransform: "capitalize" }}>
                {m === "manual" ? "📸 Manual Capture" : "🔴 Live Stream"}
              </button>
            ))}
          </div>

          {/* Mudra selector */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Practice Mudra:
            </label>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {MUDRAS_LIST.map((m) => (
                <button key={m} onClick={() => setSelectedMudra(m)}
                  className={`tab-btn ${selectedMudra === m ? "active" : ""}`}
                  style={{ fontSize: "0.82rem", padding: "6px 14px" }}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Camera view */}
          <div className="camera-frame" style={{ aspectRatio: "16/9", position: "relative", background: "#0a0603" }}>
            <video
              ref={videoRef}
              playsInline
              muted
              style={{ width: "100%", height: "100%", objectFit: "cover", display: cameraOn ? "block" : "none" }}
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />

            {!cameraOn && (
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: "1rem",
              }}>
                <div style={{ fontSize: "4rem" }}>📷</div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Camera is off</p>
                <button className="btn-gold" onClick={startCamera} style={{ padding: "12px 32px" }}>
                  <span>Enable Camera</span>
                </button>
              </div>
            )}

            {/* Countdown overlay */}
            {countdown !== null && (
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(0,0,0,0.5)",
              }}>
                <div className="font-display" style={{
                  fontSize: "8rem", color: "var(--gold)",
                  textShadow: "0 0 40px rgba(212,175,55,0.5)",
                }}>
                  {countdown}
                </div>
              </div>
            )}

            {/* Live indicator */}
            {capturing && (
              <div style={{
                position: "absolute", top: "12px", left: "12px",
                background: "rgba(0,0,0,0.7)", borderRadius: "50px",
                padding: "4px 12px", display: "flex", alignItems: "center", gap: "6px",
                fontSize: "0.78rem",
              }}>
                <div style={{
                  width: "8px", height: "8px", borderRadius: "50%",
                  background: "#ef4444",
                  animation: "pulse-gold 1.5s ease-in-out infinite",
                }} />
                <span style={{ color: "#fff" }}>LIVE</span>
              </div>
            )}

            {/* Loading overlay */}
            {loading && (
              <div style={{
                position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(0,0,0,0.4)",
              }}>
                <div className="spinner" />
              </div>
            )}
          </div>

          {/* Controls */}
          {cameraOn && (
            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", flexWrap: "wrap" }}>
              {mode === "manual" ? (
                <button
                  className="btn-gold"
                  onClick={startCountdownCapture}
                  disabled={loading || countdown !== null}
                  style={{ flex: 1, padding: "12px" }}
                >
                  <span>📸 Capture &amp; Analyze</span>
                </button>
              ) : (
                <button
                  onClick={toggleLiveMode}
                  className={capturing ? "btn-outline-gold" : "btn-gold"}
                  style={{ flex: 1, padding: "12px" }}
                >
                  {capturing ? "⏹ Stop Live" : <span>🔴 Start Live Analysis</span>}
                </button>
              )}
              <button className="btn-outline-gold" onClick={stopCamera} style={{ padding: "12px 24px" }}>
                📷 Off
              </button>
            </div>
          )}

          {error && (
            <div style={{
              marginTop: "1rem",
              background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)",
              borderRadius: "10px", padding: "12px 16px", color: "#f87171", fontSize: "0.9rem",
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Tips for selected mudra */}
          <div className="glass-card" style={{ marginTop: "1.5rem", padding: "1.5rem" }}>
            <h3 className="font-display" style={{ color: "var(--gold)", marginBottom: "1rem", fontSize: "1.1rem" }}>
              📖 Tips for {selectedMudra}
            </h3>
            <ul style={{ listStyle: "none" }}>
              {MUDRA_TIPS[selectedMudra]?.map((tip, i) => (
                <li key={i} style={{
                  display: "flex", gap: "8px", alignItems: "flex-start",
                  padding: "8px 0", borderBottom: i < MUDRA_TIPS[selectedMudra].length - 1 ? "1px solid rgba(212,175,55,0.08)" : "none",
                }}>
                  <span style={{ color: "var(--gold)", fontSize: "0.9rem", marginTop: "1px" }}>◆</span>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.88rem", lineHeight: 1.6 }}>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── RIGHT: Results panel ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Session stats */}
          <div className="glass-card" style={{ padding: "1.5rem" }}>
            <h3 className="font-display" style={{ color: "var(--gold)", marginBottom: "1rem", fontSize: "1rem" }}>📊 Session Stats</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={{ textAlign: "center" }}>
                <div className="font-display" style={{ fontSize: "2.2rem", color: "var(--gold)", lineHeight: 1 }}>{sessionCount}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Analyses</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div className="font-display" style={{ fontSize: "2.2rem", color: confidenceColor(avgConfidence), lineHeight: 1 }}>
                  {sessionCount > 0 ? `${Math.round(avgConfidence * 100)}%` : "—"}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Avg Accuracy</div>
              </div>
            </div>
          </div>

          {/* Result card */}
          {result ? (
            <div className="glass-card" style={{ padding: "1.5rem", borderColor: `${confidenceColor(result.confidence)}40` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <h3 className="font-display" style={{ color: "var(--gold)", fontSize: "1rem" }}>🤖 AI Analysis</h3>
                <span className="badge" style={{
                  background: `${confidenceColor(result.confidence)}20`,
                  color: confidenceColor(result.confidence),
                  border: `1px solid ${confidenceColor(result.confidence)}40`,
                }}>
                  {Math.round(result.confidence * 100)}% confidence
                </span>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "4px" }}>DETECTED MUDRA</div>
                <div className="font-display" style={{ fontSize: "1.6rem", color: "var(--text-primary)" }}>
                  {result.predicted_mudra}
                </div>
                {result.sanskrit_name && (
                  <div className="font-devanagari" style={{ fontSize: "1.1rem", color: "var(--gold)", marginTop: "4px" }}>
                    {result.sanskrit_name}
                  </div>
                )}
              </div>

              {/* Confidence bar */}
              <div className="progress-bar" style={{ marginBottom: "1rem" }}>
                <div className="progress-fill" style={{
                  width: `${result.confidence * 100}%`,
                  background: `linear-gradient(90deg, ${confidenceColor(result.confidence)}, ${confidenceColor(result.confidence)}aa)`,
                }} />
              </div>

              {/* Errors */}
              {result.errors && result.errors.length > 0 && (
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ fontSize: "0.78rem", color: "#f87171", marginBottom: "6px", fontWeight: 600 }}>
                    ⚠️ CORRECTIONS NEEDED
                  </div>
                  {result.errors.map((e, i) => (
                    <div key={i} style={{
                      display: "flex", gap: "8px", fontSize: "0.85rem",
                      color: "var(--text-muted)", padding: "4px 0",
                    }}>
                      <span style={{ color: "#f87171" }}>✗</span> {e}
                    </div>
                  ))}
                </div>
              )}

              {/* Suggestions */}
              {result.suggestions && result.suggestions.length > 0 && (
                <div>
                  <div style={{ fontSize: "0.78rem", color: "#22c55e", marginBottom: "6px", fontWeight: 600 }}>
                    💡 SUGGESTIONS
                  </div>
                  {result.suggestions.slice(0, 3).map((s, i) => (
                    <div key={i} style={{
                      display: "flex", gap: "8px", fontSize: "0.83rem",
                      color: "var(--text-muted)", padding: "4px 0",
                    }}>
                      <span style={{ color: "#22c55e" }}>✓</span> {s}
                    </div>
                  ))}
                </div>
              )}

              {result.description && (
                <p style={{ marginTop: "1rem", fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.6, fontStyle: "italic" }}>
                  {result.description}
                </p>
              )}
            </div>
          ) : (
            <div className="glass-card" style={{ padding: "2rem", textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🤲</div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Enable your camera and perform a mudra. The AI will analyze your gesture and provide feedback.
              </p>
            </div>
          )}

          {/* History */}
          {history.length > 0 && (
            <div className="glass-card" style={{ padding: "1.5rem" }}>
              <h3 className="font-display" style={{ color: "var(--gold)", marginBottom: "1rem", fontSize: "1rem" }}>
                🕐 Recent Analyses
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {history.slice(0, 5).map((h, i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 0", borderBottom: "1px solid rgba(212,175,55,0.08)",
                  }}>
                    <span style={{ fontSize: "0.88rem", color: "var(--text-primary)" }}>{h.predicted_mudra}</span>
                    <span style={{ fontSize: "0.78rem", color: confidenceColor(h.confidence), fontWeight: 600 }}>
                      {Math.round(h.confidence * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Responsive styles */}
      <style jsx>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: 1fr 380px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
