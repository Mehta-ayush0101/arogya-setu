"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import type { User, AuthState, UserRole } from "@/types"

interface AuthContextType extends AuthState {
  login: (email: string, password: string, role: UserRole) => Promise<boolean>
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

// Mock users for demo
const MOCK_USERS: Record<string, { user: User; password: string }> = {
  "patient@demo.com": {
    password: "demo123",
    user: {
      id: "usr_001",
      name: "Ramila Patel",
      email: "patient@demo.com",
      phone: "+91 98765 43210",
      role: "patient",
      village: "Hadgood",
      district: "Dahod",
      state: "Gujarat",
      language: "gu",
      isVerified: true,
      createdAt: "2024-01-15T00:00:00Z",
      updatedAt: "2024-10-01T00:00:00Z",
    },
  },
  "doctor@demo.com": {
    password: "demo123",
    user: {
      id: "usr_002",
      name: "Dr. Priya Sharma",
      email: "doctor@demo.com",
      phone: "+91 87654 32109",
      role: "phc_doctor",
      district: "Dahod",
      state: "Gujarat",
      language: "hi",
      isVerified: true,
      createdAt: "2023-06-10T00:00:00Z",
      updatedAt: "2024-10-01T00:00:00Z",
    },
  },
  "asha@demo.com": {
    password: "demo123",
    user: {
      id: "usr_003",
      name: "Savita Bhen",
      email: "asha@demo.com",
      phone: "+91 76543 21098",
      role: "asha_worker",
      village: "Kadana",
      district: "Mahisagar",
      state: "Gujarat",
      language: "gu",
      isVerified: true,
      createdAt: "2023-03-20T00:00:00Z",
      updatedAt: "2024-10-01T00:00:00Z",
    },
  },
  "admin@demo.com": {
    password: "demo123",
    user: {
      id: "usr_004",
      name: "District Health Officer",
      email: "admin@demo.com",
      phone: "+91 65432 10987",
      role: "admin",
      district: "Dahod",
      state: "Gujarat",
      language: "en",
      isVerified: true,
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2024-10-01T00:00:00Z",
    },
  },
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    // Check for stored auth
    try {
      const stored = localStorage.getItem("arogya_auth")
      if (stored) {
        const parsed = JSON.parse(stored)
        setState({
          user: parsed.user,
          token: parsed.token,
          isAuthenticated: true,
          isLoading: false,
        })
        return
      }
    } catch {
      // ignore
    }
    setState(prev => ({ ...prev, isLoading: false }))
  }, [])

  const login = async (email: string, password: string, _role: UserRole): Promise<boolean> => {
    const mock = MOCK_USERS[email.toLowerCase()]
    if (!mock || mock.password !== password) {
      return false
    }
    const token = `mock_token_${Date.now()}`
    const authData = { user: mock.user, token }
    localStorage.setItem("arogya_auth", JSON.stringify(authData))
    setState({
      user: mock.user,
      token,
      isAuthenticated: true,
      isLoading: false,
    })
    return true
  }

  const logout = () => {
    localStorage.removeItem("arogya_auth")
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false })
  }

  const updateUser = (updates: Partial<User>) => {
    if (!state.user) return
    const updated = { ...state.user, ...updates }
    const authData = { user: updated, token: state.token }
    localStorage.setItem("arogya_auth", JSON.stringify(authData))
    setState(prev => ({ ...prev, user: updated }))
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}

export { AuthContext }
