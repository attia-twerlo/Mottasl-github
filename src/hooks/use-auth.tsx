"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"

interface User {
  email: string
  name?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, name?: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/signup"]
  const isPublicRoute = publicRoutes.includes(pathname)

  useEffect(() => {
    // Check for existing authentication on mount
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    const userEmail = localStorage.getItem("userEmail")
    const userName = localStorage.getItem("userName")

    if (isAuthenticated === "true" && userEmail) {
      setUser({
        email: userEmail,
        name: userName || undefined
      })
    }

    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Enhanced redirect logic with better error handling
    if (!isLoading) {
      const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
      const userEmail = localStorage.getItem("userEmail")
      
      // More robust authentication check
      const isValidAuth = isAuthenticated && userEmail && user
      
      if (!isValidAuth && !isPublicRoute) {
        // User is not properly authenticated and trying to access protected route
        console.log('Redirecting to login: not authenticated')
        navigate("/login", { replace: true })
      } else if (isValidAuth && isPublicRoute) {
        // User is authenticated but on public route, redirect to dashboard
        console.log('Redirecting to dashboard: already authenticated')
        navigate("/", { replace: true })
      }
    }
  }, [isLoading, isPublicRoute, navigate, user])

  const login = (email: string, name?: string) => {
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("userEmail", email)
    if (name) {
      localStorage.setItem("userName", name)
    }
    
    setUser({ email, name })
  }

  const logout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userName")
    setUser(null)
    navigate("/login")
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
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
