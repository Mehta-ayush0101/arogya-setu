"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { Eye, EyeOff, Loader2, ArrowRight, Check } from "lucide-react"
import type { UserRole } from "@/types"

const STATES = ["Gujarat", "Maharashtra", "Rajasthan", "Madhya Pradesh", "Chhattisgarh"]
const DISTRICTS_GJ = ["Dahod", "Mahisagar", "Panchmahal", "Narmada", "Tapi", "Dang", "Aravalli", "Sabarkantha"]

export default function RegisterPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "patient" as UserRole,
    village: "",
    district: "Dahod",
    state: "Gujarat",
    language: "gu",
  })

  const update = (key: string, value: string) => setFormData(prev => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    setIsLoading(true)
    // Simulate registration - in production would call API
    await new Promise(r => setTimeout(r, 1000))
    toast.success("Registration successful! Welcome to ArogyaSetu.")
    // Auto-login after registration with demo credentials
    const demoEmailMap: Record<string, string> = {
      patient: "patient@demo.com",
      phc_doctor: "doctor@demo.com",
      asha_worker: "asha@demo.com",
      admin: "admin@demo.com",
    }
    const demoEmail = demoEmailMap[formData.role] || "patient@demo.com"
    const ok = await login(demoEmail, "demo123", formData.role)
    if (ok) {
      const path = {
        patient: "/dashboard/patient",
        phc_doctor: "/dashboard/doctor",
        asha_worker: "/dashboard/asha",
        admin: "/dashboard/admin",
        district_officer: "/dashboard/admin",
      }[formData.role] || "/dashboard/patient"
      router.push(path)
    }
    setIsLoading(false)
  }

  const roles = [
    { value: "patient", label: "Patient", desc: "I need medical care" },
    { value: "asha_worker", label: "ASHA Worker", desc: "Community health worker" },
    { value: "phc_doctor", label: "PHC Doctor", desc: "Primary Health Centre doctor" },
    { value: "admin", label: "Health Officer", desc: "District / Admin officer" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold">Create Your Account</h1>
          <p className="text-muted-foreground text-sm mt-1">Join 2.4 million people on ArogyaSetu</p>
        </motion.div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-1.5 ${s <= step ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  s < step ? "bg-primary border-primary text-white" :
                  s === step ? "border-primary text-primary" :
                  "border-border text-muted-foreground"
                }`}>
                  {s < step ? <Check className="w-3.5 h-3.5" /> : s}
                </div>
                <span className="text-xs font-medium hidden sm:inline">
                  {s === 1 ? "Role" : s === 2 ? "Personal Info" : "Location"}
                </span>
              </div>
              {s < 3 && <div className={`flex-1 h-0.5 ${s < step ? "bg-primary" : "bg-border"}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Form */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="premium-card p-6"
        >
          <form onSubmit={step < 3 ? (e) => { e.preventDefault(); setStep(s => s + 1) } : handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-lg mb-4">Select Your Role</h2>
                <div className="space-y-3">
                  {roles.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => update("role", r.value)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                        formData.role === r.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        formData.role === r.value ? "border-primary" : "border-muted-foreground"
                      }`}>
                        {formData.role === r.value && <div className="w-2 h-2 bg-primary rounded-full" />}
                      </div>
                      <div>
                        <p className="font-medium">{r.label}</p>
                        <p className="text-xs text-muted-foreground">{r.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-lg mb-4">Personal Information</h2>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Your full name"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="your@email.com"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Mobile Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="+91 98765 43210"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => update("password", e.target.value)}
                      placeholder="Min 8 characters"
                      className="input-field pr-10"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Confirm Password</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => update("confirmPassword", e.target.value)}
                    placeholder="Repeat password"
                    className="input-field"
                    required
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-lg mb-4">Location & Language</h2>
                <div>
                  <label className="block text-sm font-medium mb-1.5">State</label>
                  <select
                    value={formData.state}
                    onChange={(e) => update("state", e.target.value)}
                    className="input-field"
                  >
                    {STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">District</label>
                  <select
                    value={formData.district}
                    onChange={(e) => update("district", e.target.value)}
                    className="input-field"
                  >
                    {DISTRICTS_GJ.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Village / Town (Optional)</label>
                  <input
                    type="text"
                    value={formData.village}
                    onChange={(e) => update("village", e.target.value)}
                    placeholder="Your village name"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Preferred Language</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[{ v: "en", l: "English" }, { v: "hi", l: "हिंदी" }, { v: "gu", l: "ગુજરાતી" }].map(({ v, l }) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => update("language", v)}
                        className={`py-2.5 rounded-xl border text-sm font-medium transition-all ${
                          formData.language === v ? "bg-primary text-white border-primary" : "border-border hover:border-primary/50"
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(s => s - 1)}
                  className="flex-1 py-3 border border-border rounded-xl font-medium hover:bg-muted transition-colors"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                {step < 3 ? "Next" : isLoading ? "Creating..." : "Create Account"}
              </button>
            </div>
          </form>
        </motion.div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
