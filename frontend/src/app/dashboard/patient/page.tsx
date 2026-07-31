"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { DashboardSidebar, DashboardHeader } from "@/components/layout/DashboardLayout"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage } from "@/contexts/LanguageContext"
import {
  Heart, Activity, Calendar, Pill, Mic, AlertTriangle,
  TrendingUp, TrendingDown, Clock, MapPin, ArrowRight,
  Phone, Shield, Zap, CheckCircle, ChevronRight
} from "lucide-react"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line
} from "recharts"
import { CHART_COLORS, getHealthScoreColor, getHealthScoreLabel, formatDate } from "@/lib/utils"
import { cn } from "@/lib/utils"

// ===== MOCK DATA =====
const vitalsHistory = [
  { date: "Oct 1", bp: 122, sugar: 95, hr: 72 },
  { date: "Oct 8", bp: 128, sugar: 102, hr: 75 },
  { date: "Oct 15", bp: 118, sugar: 98, hr: 70 },
  { date: "Oct 22", bp: 125, sugar: 105, hr: 73 },
  { date: "Oct 29", bp: 120, sugar: 97, hr: 71 },
  { date: "Nov 5", bp: 116, sugar: 93, hr: 68 },
]

const upcomingAppointments = [
  { id: "a1", doctor: "Dr. Priya Sharma", type: "Teleconsult", date: "Nov 12, 2024", time: "10:00 AM", status: "confirmed", phc: "Devgadh PHC" },
  { id: "a2", doctor: "Dr. Ramesh Patel", type: "Follow-up", date: "Nov 18, 2024", time: "11:30 AM", status: "scheduled", phc: "Kadana CHC" },
]

const medicines = [
  { name: "Metformin 500mg", dosage: "1 tablet after meals", frequency: "Twice daily", remaining: 14, total: 30, refillDate: "Nov 20" },
  { name: "Amlodipine 5mg", dosage: "1 tablet in morning", frequency: "Once daily", remaining: 7, total: 30, refillDate: "Nov 14" },
  { name: "Iron + Folic Acid", dosage: "1 tablet", frequency: "Once daily", remaining: 25, total: 60, refillDate: "Dec 5" },
]

const healthTimeline = [
  { date: "Nov 5", event: "BP checked: 116/78 - Normal", type: "success", icon: "💚" },
  { date: "Nov 1", event: "Blood sugar: 93 mg/dL - Normal", type: "success", icon: "💚" },
  { date: "Oct 28", event: "Teleconsult with Dr. Sharma - Completed", type: "info", icon: "📞" },
  { date: "Oct 22", event: "Typhoid vaccine administered", type: "info", icon: "💉" },
  { date: "Oct 15", event: "AI Triage: Fever - Routine care recommended", type: "warning", icon: "🤖" },
]

// ===== STAT CARD =====
function StatCard({ icon, label, value, sub, trend, color = "primary" }: {
  icon: React.ReactNode; label: string; value: string; sub?: string; trend?: "up" | "down" | null; color?: string
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="premium-card p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${color}/10`}>
          <div className={`text-${color}`}>{icon}</div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend === "up" ? "text-success" : "text-emergency"}`}>
            {trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-foreground mb-0.5">{value}</p>
      <p className="text-sm font-medium text-foreground/80">{label}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </motion.div>
  )
}

// ===== HEALTH SCORE RING =====
function HealthScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 45
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
        <circle
          cx="50" cy="50" r="45" fill="none" stroke="#0F766E"
          strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-primary">{score}</span>
        <span className="text-xs text-muted-foreground">/ 100</span>
      </div>
    </div>
  )
}

// ===== MAIN PATIENT DASHBOARD =====
export default function PatientDashboard() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const healthScore = 74
  const hour = new Date().getHours()
  const greeting = hour < 12 ? t.goodMorning : hour < 17 ? t.goodAfternoon : t.goodEvening

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <div className="flex-1 lg:ml-64 flex flex-col">
        <DashboardHeader
          title="Patient Dashboard"
          subtitle={`${greeting}, ${user?.name?.split(" ")[0]}!`}
        />
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">

          {/* Welcome Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 w-40 h-full opacity-10">
              <Heart className="w-40 h-40 text-white" />
            </div>
            <div className="relative z-10">
              <p className="text-white/80 text-sm mb-1">{greeting} 👋</p>
              <h2 className="text-xl font-bold mb-2">{user?.name}</h2>
              <p className="text-white/80 text-sm mb-4">
                Your health is looking good today. Keep it up! 🌟
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/dashboard/patient/triage" className="bg-white/20 hover:bg-white/30 text-white rounded-xl px-4 py-2 text-sm font-semibold flex items-center gap-2 transition-all">
                  <Mic className="w-4 h-4" /> AI Triage
                </Link>
                <Link href="/dashboard/patient/appointments" className="bg-white/20 hover:bg-white/30 text-white rounded-xl px-4 py-2 text-sm font-semibold flex items-center gap-2 transition-all">
                  <Calendar className="w-4 h-4" /> Book Appointment
                </Link>
                <Link href="/emergency" className="bg-emergency hover:bg-emergency/90 text-white rounded-xl px-4 py-2 text-sm font-bold flex items-center gap-2 transition-all animate-pulse-slow">
                  <AlertTriangle className="w-4 h-4" /> SOS
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<Heart className="w-5 h-5" />}
              label={t.healthScore}
              value={`${healthScore}/100`}
              sub={getHealthScoreLabel(healthScore)}
              trend="up"
              color="primary"
            />
            <StatCard
              icon={<Calendar className="w-5 h-5" />}
              label="Next Visit"
              value="Nov 12"
              sub="Dr. Priya Sharma"
              color="secondary"
            />
            <StatCard
              icon={<Pill className="w-5 h-5" />}
              label="Active Medicines"
              value="3"
              sub="1 refill needed soon"
              color="accent"
            />
            <StatCard
              icon={<Activity className="w-5 h-5" />}
              label="Last BP"
              value="116/78"
              sub="Normal Range"
              trend="up"
              color="success"
            />
          </div>

          {/* Health Score + Vitals Chart */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Health Score */}
            <div className="premium-card p-6 flex flex-col items-center justify-center gap-4">
              <h3 className="font-semibold text-lg self-start">Health Score</h3>
              <HealthScoreRing score={healthScore} />
              <div className="w-full space-y-2">
                {[
                  { label: "BP Control", value: 85 },
                  { label: "Sugar Control", value: 70 },
                  { label: "Appointments", value: 90 },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-24">{item.label}</span>
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium w-8 text-right">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vitals Chart */}
            <div className="lg:col-span-2 premium-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Vitals History</h3>
                <span className="text-xs text-muted-foreground">Last 6 weeks</span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={vitalsHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: "12px", fontSize: "12px" }} />
                  <Line type="monotone" dataKey="bp" stroke={CHART_COLORS.primary} strokeWidth={2} dot={{ r: 3 }} name="BP (Sys)" />
                  <Line type="monotone" dataKey="sugar" stroke={CHART_COLORS.warning} strokeWidth={2} dot={{ r: 3 }} name="Sugar" />
                  <Line type="monotone" dataKey="hr" stroke={CHART_COLORS.accent} strokeWidth={2} dot={{ r: 3 }} name="Heart Rate" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Appointments + Medicines Row */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Upcoming Appointments */}
            <div className="premium-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Upcoming Appointments</h3>
                <Link href="/dashboard/patient/appointments" className="text-primary text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                  {t.viewAll} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="space-y-3">
                {upcomingAppointments.map((appt) => (
                  <div key={appt.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{appt.doctor}</p>
                      <p className="text-xs text-muted-foreground">{appt.date} • {appt.time}</p>
                      <p className="text-xs text-muted-foreground">{appt.phc} • {appt.type}</p>
                    </div>
                    <span className={cn(
                      "text-xs font-semibold px-2 py-0.5 rounded-full",
                      appt.status === "confirmed" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
                    )}>
                      {appt.status}
                    </span>
                  </div>
                ))}
                <Link
                  href="/dashboard/patient/appointments"
                  className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-border rounded-xl text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors font-medium"
                >
                  + Book New Appointment
                </Link>
              </div>
            </div>

            {/* Medicine Tracker */}
            <div className="premium-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Medicine Tracker</h3>
                <Link href="/dashboard/patient/medicines" className="text-primary text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                  {t.viewAll} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="space-y-3">
                {medicines.map((med) => (
                  <div key={med.name} className="p-3 bg-muted/30 rounded-xl">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-sm">{med.name}</p>
                        <p className="text-xs text-muted-foreground">{med.dosage} • {med.frequency}</p>
                      </div>
                      <span className={cn(
                        "text-xs font-semibold px-2 py-0.5 rounded-full",
                        med.remaining / med.total < 0.3 ? "bg-emergency/10 text-emergency" : "bg-success/10 text-success"
                      )}>
                        {med.remaining} left
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full", med.remaining / med.total < 0.3 ? "bg-emergency" : "bg-success")}
                          style={{ width: `${(med.remaining / med.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">Refill: {med.refillDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Triage Quick Access + Health Timeline */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* AI Triage */}
            <div className="premium-card p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
              <h3 className="font-semibold text-lg mb-4">AI Health Assistant</h3>
              <div className="space-y-3 mb-4">
                <p className="text-sm text-muted-foreground">
                  Feeling unwell? Get instant AI-powered health guidance in Gujarati, Hindi, or English.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Fever", "Headache", "Stomach pain", "Cough"].map((s) => (
                    <Link
                      key={s}
                      href={`/dashboard/patient/triage?symptom=${s}`}
                      className="bg-white dark:bg-card border border-border rounded-xl px-3 py-1.5 text-xs font-medium hover:bg-primary hover:text-white hover:border-primary transition-all"
                    >
                      {s}
                    </Link>
                  ))}
                </div>
              </div>
              <Link href="/dashboard/patient/triage" className="btn-primary flex items-center justify-center gap-2 w-full">
                <Mic className="w-4 h-4" />
                Start Voice Triage
              </Link>
            </div>

            {/* Health Timeline */}
            <div className="premium-card p-6">
              <h3 className="font-semibold text-lg mb-4">Health Timeline</h3>
              <div className="space-y-3">
                {healthTimeline.map((item, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <div className="flex flex-col items-center">
                      <span className="text-lg">{item.icon}</span>
                      {i < healthTimeline.length - 1 && <div className="w-0.5 flex-1 bg-border my-1" />}
                    </div>
                    <div className="pb-1">
                      <p className={cn(
                        "font-medium",
                        item.type === "success" ? "text-success" :
                        item.type === "warning" ? "text-warning" : "text-foreground"
                      )}>
                        {item.event}
                      </p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Emergency Quick Access */}
          <div className="premium-card p-6 bg-emergency/5 border-emergency/20">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emergency rounded-2xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-emergency">Emergency SOS</h3>
                <p className="text-sm text-muted-foreground">
                  One tap to call ambulance, share location, and alert nearest PHC
                </p>
              </div>
              <Link
                href="/emergency"
                className="btn-emergency flex items-center gap-2 flex-shrink-0"
              >
                <Phone className="w-4 h-4" />
                SOS
              </Link>
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}
