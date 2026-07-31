"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { Eye, EyeOff, Loader2, Stethoscope, ArrowRight, Phone } from "lucide-react"
import type { UserRole } from "@/types"

const DEMO_ACCOUNTS = [
  { email: "patient@demo.com", password: "demo123", role: "patient" as UserRole, label: "Patient Demo", color: "bg-primary/10 text-primary" },
  { email: "doctor@demo.com", password: "demo123", role: "phc_doctor" as UserRole, label: "Doctor Demo", color: "bg-secondary/10 text-secondary" },
  { email: "asha@demo.com", password: "demo123", role: "asha_worker" as UserRole, label: "ASHA Demo", color: "bg-accent/10 text-accent" },
  { email: "admin@demo.com", password: "demo123", role: "admin" as UserRole, label: "Admin Demo", color: "bg-warning/10 text-warning" },
]

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>("patient")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const ok = await login(email, password, role)
      if (ok) {
        toast.success("Welcome back! Redirecting to dashboard...")
        const path = {
          patient: "/dashboard/patient",
          phc_doctor: "/dashboard/doctor",
          asha_worker: "/dashboard/asha",
          admin: "/dashboard/admin",
          district_officer: "/dashboard/admin",
        }[role] || "/dashboard/patient"
        router.push(path)
      } else {
        toast.error("Invalid credentials. Try demo accounts below.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async (demo: typeof DEMO_ACCOUNTS[0]) => {
    setIsLoading(true)
    try {
      const ok = await login(demo.email, demo.password, demo.role)
      if (ok) {
        toast.success(`Logged in as ${demo.label}`)
        const path = {
          patient: "/dashboard/patient",
          phc_doctor: "/dashboard/doctor",
          asha_worker: "/dashboard/asha",
          admin: "/dashboard/admin",
          district_officer: "/dashboard/admin",
        }[demo.role] || "/dashboard/patient"
        router.push(path)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div className="text-left">
              <p className="font-bold text-primary text-lg leading-none">ArogyaSetu</p>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Rural AI</p>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-foreground mb-1">Welcome Back</h1>
          <p className="text-muted-foreground text-sm">Sign in to access your healthcare dashboard</p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="premium-card p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role selector */}
            <div>
              <label className="block text-sm font-medium mb-2">I am a...</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "patient", label: "Patient" },
                  { value: "phc_doctor", label: "Doctor" },
                  { value: "asha_worker", label: "ASHA Worker" },
                  { value: "admin", label: "Admin" },
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value as UserRole)}
                    className={`py-2 px-3 rounded-xl border text-sm font-medium transition-all ${
                      role === r.value
                        ? "bg-primary text-white border-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="input-field"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-primary font-medium hover:underline">
              Register here
            </Link>
          </p>
        </motion.div>

        {/* Demo Accounts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 premium-card p-4"
        >
          <p className="text-xs font-medium text-muted-foreground mb-3 text-center">
            🎮 Quick Demo Login (Hackathon Demo)
          </p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((demo) => (
              <button
                key={demo.email}
                onClick={() => handleDemoLogin(demo)}
                disabled={isLoading}
                className={`${demo.color} border rounded-xl py-2 px-3 text-xs font-semibold hover:opacity-80 transition-all`}
              >
                {demo.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Emergency */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-center"
        >
          <a
            href="tel:108"
            className="inline-flex items-center gap-2 text-emergency font-semibold text-sm"
          >
            <Phone className="w-4 h-4" />
            Medical Emergency? Call 108
          </a>
        </motion.div>
      </div>
    </div>
  )
}
