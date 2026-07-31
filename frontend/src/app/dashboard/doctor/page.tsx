"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DashboardSidebar, DashboardHeader } from "@/components/layout/DashboardLayout"
import { Users, Calendar, ClipboardList, TrendingUp, Clock, CheckCircle, AlertTriangle, Video, Filter, Search, BarChart2 } from "lucide-react"
import { cn, formatDate, formatTime } from "@/lib/utils"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { CHART_COLORS } from "@/lib/utils"

const TODAY_APPOINTMENTS = [
  { id: "a1", patient: "Ramila Patel", age: 35, village: "Hadgood", time: "09:00 AM", type: "teleconsult", severity: "urgent", status: "waiting", symptoms: "Fever, headache, 3 days" },
  { id: "a2", patient: "Gopal Singh", age: 58, village: "Kadana", time: "09:30 AM", type: "in_person", severity: "routine", status: "in_progress", symptoms: "Diabetes follow-up" },
  { id: "a3", patient: "Meena Bai", age: 28, village: "Fatepura", time: "10:00 AM", type: "teleconsult", severity: "routine", status: "scheduled", symptoms: "Pregnancy check, 6 months" },
  { id: "a4", patient: "Raju Gamit", age: 45, village: "Devgadh", time: "10:30 AM", type: "in_person", severity: "urgent", status: "scheduled", symptoms: "Chest pain since morning" },
  { id: "a5", patient: "Savita Ben", age: 62, village: "Limkheda", time: "11:00 AM", type: "teleconsult", severity: "routine", status: "scheduled", symptoms: "BP medication review" },
]

const weeklyAppointmentsData = [
  { day: "Mon", completed: 12, cancelled: 1 },
  { day: "Tue", completed: 15, cancelled: 2 },
  { day: "Wed", completed: 10, cancelled: 1 },
  { day: "Thu", completed: 18, cancelled: 0 },
  { day: "Fri", completed: 14, cancelled: 3 },
  { day: "Sat", completed: 8, cancelled: 1 },
]

function SeverityBadge({ severity }: { severity: string }) {
  const config: Record<string, string> = {
    emergency: "bg-emergency/10 text-emergency",
    urgent: "bg-warning/10 text-warning",
    routine: "bg-primary/10 text-primary",
    self_care: "bg-success/10 text-success",
  }
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold capitalize", config[severity] || config.routine)}>
      {severity}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, string> = {
    waiting: "bg-warning/10 text-warning",
    in_progress: "bg-primary/10 text-primary animate-pulse",
    scheduled: "bg-muted text-muted-foreground",
    completed: "bg-success/10 text-success",
  }
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold capitalize", config[status] || "")}>
      {status.replace("_", " ")}
    </span>
  )
}

export default function DoctorDashboard() {
  const [selectedPatient, setSelectedPatient] = useState<typeof TODAY_APPOINTMENTS[0] | null>(null)
  const [search, setSearch] = useState("")

  const filtered = TODAY_APPOINTMENTS.filter(a =>
    a.patient.toLowerCase().includes(search.toLowerCase()) ||
    a.symptoms.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <div className="flex-1 lg:ml-64 flex flex-col">
        <DashboardHeader title="Doctor Dashboard" subtitle="Dr. Priya Sharma • Devgadh PHC" />
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <Calendar className="w-5 h-5" />, label: "Today's Appointments", value: "8", sub: "2 urgent" },
              { icon: <ClipboardList className="w-5 h-5" />, label: "Pending Reviews", value: "4", sub: "AI triage results" },
              { icon: <CheckCircle className="w-5 h-5" />, label: "Completed Today", value: "3", sub: "of 8 scheduled" },
              { icon: <Users className="w-5 h-5" />, label: "Total Patients", value: "248", sub: "Registered" },
            ].map((stat) => (
              <div key={stat.label} className="premium-card p-5">
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-3">
                  {stat.icon}
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm font-medium">{stat.label}</p>
                <p className="text-xs text-muted-foreground">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Appointment Queue */}
            <div className="lg:col-span-2 premium-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Today's Queue</h3>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search patient..."
                    className="pl-9 pr-3 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary w-40 sm:w-48"
                  />
                </div>
              </div>
              <div className="space-y-2">
                {filtered.map((appt) => (
                  <motion.button
                    key={appt.id}
                    onClick={() => setSelectedPatient(selectedPatient?.id === appt.id ? null : appt)}
                    whileHover={{ scale: 1.01 }}
                    className={cn(
                      "w-full p-3 rounded-xl border text-left transition-all",
                      selectedPatient?.id === appt.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30 bg-muted/20"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center min-w-[48px]">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs font-medium">{appt.time}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm">{appt.patient}</span>
                          <span className="text-xs text-muted-foreground">Age {appt.age} • {appt.village}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{appt.symptoms}</p>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <SeverityBadge severity={appt.severity} />
                        <StatusBadge status={appt.status} />
                      </div>
                      {appt.type === "teleconsult" && (
                        <Video className="w-4 h-4 text-primary flex-shrink-0" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Patient Detail Panel */}
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {selectedPatient ? (
                  <motion.div
                    key={selectedPatient.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="premium-card p-5 space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                        <span className="font-bold text-primary">{selectedPatient.patient[0]}</span>
                      </div>
                      <div>
                        <p className="font-bold">{selectedPatient.patient}</p>
                        <p className="text-sm text-muted-foreground">Age {selectedPatient.age} • {selectedPatient.village}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-1.5 border-b border-border/50">
                        <span className="text-muted-foreground">Appointment</span>
                        <span className="font-medium">{selectedPatient.time}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-border/50">
                        <span className="text-muted-foreground">Type</span>
                        <span className="font-medium capitalize">{selectedPatient.type.replace("_", " ")}</span>
                      </div>
                      <div className="py-1.5 border-b border-border/50">
                        <p className="text-muted-foreground mb-1">Symptoms</p>
                        <p className="font-medium">{selectedPatient.symptoms}</p>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <SeverityBadge severity={selectedPatient.severity} />
                        <span className="text-xs text-muted-foreground flex items-center">AI Triage Result</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {selectedPatient.type === "teleconsult" ? (
                        <button className="btn-primary w-full flex items-center justify-center gap-2">
                          <Video className="w-4 h-4" /> Start Video Consult
                        </button>
                      ) : (
                        <button className="btn-primary w-full flex items-center justify-center gap-2">
                          <CheckCircle className="w-4 h-4" /> Start Consultation
                        </button>
                      )}
                      <button className="w-full border border-border rounded-xl py-2 text-sm font-medium hover:bg-muted transition-colors">
                        View Full History
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="premium-card p-6 text-center text-muted-foreground"
                  >
                    <ClipboardList className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Select a patient to view details</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Weekly Chart */}
              <div className="premium-card p-5">
                <h4 className="font-semibold text-sm mb-3">This Week</h4>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={weeklyAppointmentsData} barSize={8}>
                    <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "11px" }} />
                    <Bar dataKey="completed" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} name="Completed" />
                    <Bar dataKey="cancelled" fill={CHART_COLORS.emergency} radius={[4, 4, 0, 0]} name="Cancelled" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
