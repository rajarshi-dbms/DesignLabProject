"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/lib/AuthContext"

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About ICD" },
    { href: "/learn", label: "Learn" },
    { href: "/practice", label: "Practice" },
    ...(isAuthenticated ? [{ href: "/dashboard", label: "Dashboard" }] : []),
  ]

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(10, 6, 3, 0.92)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(212, 175, 55, 0.15)",
      padding: "0 2rem",
    }}>
      <div style={{
        maxWidth: "1200px", margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "68px",
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px", height: "36px",
            background: "linear-gradient(135deg, #9B7D1A, #D4AF37)",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.1rem",
          }}>🪷</div>
          <span className="font-display" style={{ fontSize: "1.3rem", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.5px" }}>
            NrityanGuru
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${pathname === link.href ? "active" : ""}`}
              style={{ textDecoration: "none" }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {isAuthenticated ? (
            <>
              <span style={{
                color: "var(--text-muted)", fontSize: "0.85rem",
                display: "flex", alignItems: "center", gap: "6px"
              }}>
                <span style={{
                  width: "8px", height: "8px", borderRadius: "50%",
                  background: "#48bb78", display: "inline-block"
                }} />
                {user?.username}
              </span>
              <button
                onClick={handleLogout}
                className="btn-outline-gold"
                style={{ padding: "8px 20px", fontSize: "0.85rem" }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ textDecoration: "none" }}>
                <button className="btn-outline-gold" style={{ padding: "8px 20px", fontSize: "0.85rem" }}>
                  Login
                </button>
              </Link>
              <Link href="/register" style={{ textDecoration: "none" }}>
                <button className="btn-gold" style={{ padding: "8px 20px", fontSize: "0.85rem" }}>
                  <span>Join Free</span>
                </button>
              </Link>
            </>
          )}

          {/* Hamburger for mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-menu-btn"
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--gold)", fontSize: "1.5rem", display: "none",
            }}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: "rgba(10,6,3,0.98)", borderTop: "1px solid rgba(212,175,55,0.15)",
          padding: "1rem 2rem 1.5rem",
        }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link"
              style={{ display: "block", padding: "0.75rem 0", textDecoration: "none", borderBottom: "1px solid rgba(212,175,55,0.08)" }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  )
}
