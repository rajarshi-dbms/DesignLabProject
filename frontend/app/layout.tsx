import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/lib/AuthContext"
import Navbar from "@/components/Navbar"

export const metadata: Metadata = {
  title: "NrityanGuru — Indian Classical Dance Learning Platform",
  description: "Learn Bharatanatyam with AI-powered mudra recognition. Master adavus, hastas, and bhavas with real-time feedback from cutting-edge computer vision technology.",
  keywords: "Bharatanatyam, Indian Classical Dance, Mudra Recognition, AI Dance, ICD",
  openGraph: {
    title: "NrityanGuru — Learn Bharatanatyam with AI",
    description: "Master the ancient art of Bharatanatyam with AI-guided mudra recognition",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}
