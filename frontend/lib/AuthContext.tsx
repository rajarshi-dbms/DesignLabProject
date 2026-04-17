"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { api } from "./api"

interface User {
  id: number
  username: string
  email: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load token from localStorage on mount
    const storedToken = localStorage.getItem("nrityan_token")
    const storedUser = localStorage.getItem("nrityan_user")
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    const response = await api.post("/auth/login", { username, password })
    const { access_token } = response.data

    // Fetch user profile
    api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`
    const profileRes = await api.get("/auth/me")
    const userData = profileRes.data

    setToken(access_token)
    setUser(userData)
    localStorage.setItem("nrityan_token", access_token)
    localStorage.setItem("nrityan_user", JSON.stringify(userData))
  }

  const register = async (username: string, email: string, password: string) => {
    await api.post("/auth/register", { username, email, password })
    // Auto-login after registration
    await login(username, password)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("nrityan_token")
    localStorage.removeItem("nrityan_user")
    delete api.defaults.headers.common["Authorization"]
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
