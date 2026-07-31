"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { DashboardSidebar, DashboardHeader } from "@/components/layout/DashboardLayout"
import { Calendar, Clock, Video, User, Check, X, Loader2, Plus, Filter, Phone } from "lucide-react"
import { cn, TIME_SLOTS, formatDate } from "@/lib/utils"
import { toast } from "sonner"
import Link from "next/link"

const DOCTORS = [
  { id: "d1", name: "Dr. Priya Sharma", specialty: "General Medicine", phc: "Devgadh PHC", available: true, rating: 4.8, languages: ["Gujarati", "Hindi"] },
  { id: "d2", name: "Dr. Ramesh Patel", specialty: "Pediatrics", phc: "Kadana CHC", available: true, rating: 4.6, languages: ["Gujarati"] },
  { id: "d3", name: "Dr. Meena Agrawal", specialty: "Gynecology", phc: "Devgadh PHC", available: false, rating: 4.9, languages: ["Hindi", "English"] },
  { id: "d4", name: "Dr. Ajay Singh", specialty: "General Medicine", phc: "Zalod PHC", available: true, rating: 4.4, languages: ["Hindi"] },
]

const EXISTING_APPOINTMENTS = [
  { id: "a1", doctor: "Dr. Priya Sharma", date: "2024-11-12", time: "10:00 AM", type: "teleconsult", status: "confirmed", symptoms: "Fever and headache" },
  { id: "a2", doctor: "Dr. Ramesh Patel", date: "2024-11-18", time: "11:30 AM", type: "in_person", status: "scheduled", symptoms: "Child vaccination" },
  { id: "a3", doctor: "Dr. Priya Sharma", date: "2024-10-28", time: "09:30 AM", type: "teleconsult", status: "completed", symptoms: "Follow-up for typhoid" },
]

export default function AppointmentsPage() {
  const [view, setView] = useState<"list" | "book">("list")
  const [step, setStep] = useState(1)
  const [selectedDoctor, setSelectedDoctor] = useState<typeof DOCTORS[0] | null>(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [appointmentType, setAppointmentType] = useState<"in_person" | "teleconsult">("teleconsult")
  const [symptoms, setSymptoms] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const handleBook = async () => {
    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 1500))
    setIsSubmitting(false)
    setConfirmed(true)
    toast.success("Appointment booked successfully!")
  }

  const statusConfig: Record<string, { label: string; cls: string }> = {
    confirmed: { label: "Confirmed", cls: "bg-success/10 text-success" },
    scheduled: { label: "Scheduled", cls: "bg-primary/10 text-primary" },
    completed: { label: "Completed", cls: "bg-muted text-muted-foreground" },
    cancelled: { label: "Cancelled", cls: "bg-emergency/10 text-emergency" },
  }

  // Generate next 14 days for date picker
  const today = new Date()
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + i + 1)
    return {
      iso: d.toISOString().split("T")[0],
      day: d.toLocaleDateString("en", { weekday: "short" }),
      date: d.getDate(),
      month: d.toLocaleDateString("en", { month: "short" }),
    }
  })

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <div className="flex-1 lg:ml-64 flex flex-col">
        <DashboardHeader title="Appointments" subtitle="Manage your consultations" />
        <main className="flex-1 p-6 overflow-y-auto">

          {/* Tab Switch */}
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => { setView("list"); setStep(1); setConfirmed(false) }}
              className={cn("px-4 py-2 rounded-xl font-medium text-sm transition-all", view === "list" ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/80")}
            >
              My Appointments
            </button>
            <button
              onClick={() => setView("book")}
              className={cn("px-4 py-2 rounded-xl font-medium text-sm transition-all flex items-center gap-1.5", view === "book" ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/80")}
            >
              <Plus className="w-4 h-4" /> Book New
            </button>
          </div>

          {/* My Appointments List */}
          {view === "list" && (
            <div className="space-y-4">
              {EXISTING_APPOINTMENTS.map((appt) => {
                const cfg = statusConfig[appt.status]
                return (
                  <motion.div
                    key={appt.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="premium-card p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                        {appt.type === "teleconsult" ? <Video className="w-6 h-6 text-primary" /> : <User className="w-6 h-6 text-primary" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between flex-wrap gap-2">
                          <div>
                            <p className="font-semibold">{appt.doctor}</p>
                            <p className="text-sm text-muted-foreground">{formatDate(appt.date)} • {appt.time}</p>
                            <p className="text-sm text-muted-foreground capitalize">{appt.type.replace("_", " ")} • {appt.symptoms}</p>
                          </div>
                          <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", cfg.cls)}>
                            {cfg.label}
                          </span>
                        </div>
                        {appt.status === "confirmed" && appt.type === "teleconsult" && (
                          <div className="mt-3 flex gap-2">
                            <button className="flex items-center gap-1.5 bg-primary/10 text-primary rounded-xl px-3 py-1.5 text-xs font-semibold hover:bg-primary hover:text-white transition-all">
                              <Video className="w-3.5 h-3.5" /> Join Video Call
                            </button>
                            <button className="flex items-center gap-1.5 bg-muted text-muted-foreground rounded-xl px-3 py-1.5 text-xs font-medium hover:bg-muted/80 transition-all">
                              <X className="w-3.5 h-3.5" /> Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}

          {/* Book Appointment Flow */}
          {view === "book" && (
            <div className="max-w-2xl mx-auto">
              {confirmed ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="premium-card p-8 text-center"
                >
                  <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-success" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2 text-success">Appointment Confirmed!</h2>
                  <p className="text-muted-foreground mb-6">
                    Your appointment with <strong>{selectedDoctor?.name}</strong> is confirmed for {selectedDate} at {selectedTime}.
                  </p>
                  <div className="bg-muted rounded-xl p-4 text-sm text-left space-y-2 mb-6">
                    <div className="flex justify-between"><span className="text-muted-foreground">Doctor</span><span className="font-medium">{selectedDoctor?.name}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium">{selectedDate}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="font-medium">{selectedTime}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-medium capitalize">{appointmentType.replace("_", " ")}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Confirmation ID</span><span className="font-mono text-primary">APT-{Math.random().toString(36).substring(2, 8).toUpperCase()}</span></div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => { setView("list"); setConfirmed(false); setStep(1) }} className="flex-1 border border-border rounded-xl py-3 font-medium hover:bg-muted transition-colors">
                      View Appointments
                    </button>
                    {appointmentType === "teleconsult" && (
                      <button className="flex-1 btn-primary flex items-center justify-center gap-2">
                        <Video className="w-4 h-4" /> Test Video Link
                      </button>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {/* Progress steps */}
                  <div className="flex items-center gap-2 mb-2">
                    {["Choose Doctor", "Pick Date & Time", "Confirm"].map((s, i) => (
                      <React.Fragment key={s}>
                        <div className={`flex items-center gap-1.5 text-xs font-medium ${i + 1 <= step ? "text-primary" : "text-muted-foreground"}`}>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border-2 ${i + 1 < step ? "bg-primary border-primary text-white" : i + 1 === step ? "border-primary text-primary" : "border-muted-foreground text-muted-foreground"}`}>
                            {i + 1 < step ? <Check className="w-3 h-3" /> : i + 1}
                          </div>
                          <span className="hidden sm:inline">{s}</span>
                        </div>
                        {i < 2 && <div className={`flex-1 h-0.5 ${i + 1 < step ? "bg-primary" : "bg-border"}`} />}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Step 1: Choose Doctor */}
                  {step === 1 && (
                    <div className="space-y-4">
                      <h2 className="font-semibold text-lg">Select a Doctor</h2>

                      {/* Appointment Type */}
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: "teleconsult", label: "Video Teleconsult", icon: <Video className="w-5 h-5" /> },
                          { value: "in_person", label: "In-Person Visit", icon: <User className="w-5 h-5" /> },
                        ].map((t) => (
                          <button
                            key={t.value}
                            onClick={() => setAppointmentType(t.value as typeof appointmentType)}
                            className={cn(
                              "p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all",
                              appointmentType === t.value ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/40"
                            )}
                          >
                            {t.icon}
                            <span className="text-sm font-medium">{t.label}</span>
                          </button>
                        ))}
                      </div>

                      {/* Doctor Cards */}
                      <div className="space-y-3">
                        {DOCTORS.map((doctor) => (
                          <button
                            key={doctor.id}
                            onClick={() => doctor.available && setSelectedDoctor(doctor)}
                            disabled={!doctor.available}
                            className={cn(
                              "w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-3",
                              !doctor.available && "opacity-50 cursor-not-allowed",
                              selectedDoctor?.id === doctor.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                            )}
                          >
                            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                              <User className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold">{doctor.name}</p>
                              <p className="text-sm text-muted-foreground">{doctor.specialty} • {doctor.phc}</p>
                              <p className="text-xs text-muted-foreground">Languages: {doctor.languages.join(", ")}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-primary">⭐ {doctor.rating}</p>
                              <p className={cn("text-xs font-medium", doctor.available ? "text-success" : "text-emergency")}>
                                {doctor.available ? "Available" : "Unavailable"}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setStep(2)}
                        disabled={!selectedDoctor}
                        className="btn-primary w-full disabled:opacity-50"
                      >
                        Next: Pick Date & Time
                      </button>
                    </div>
                  )}

                  {/* Step 2: Date & Time */}
                  {step === 2 && (
                    <div className="space-y-4">
                      <h2 className="font-semibold text-lg">Select Date & Time</h2>

                      {/* Date Picker */}
                      <div>
                        <p className="text-sm font-medium mb-2">Available Dates</p>
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                          {dates.map((d) => (
                            <button
                              key={d.iso}
                              onClick={() => setSelectedDate(d.iso)}
                              className={cn(
                                "flex-shrink-0 flex flex-col items-center gap-0.5 px-3 py-2.5 rounded-xl border-2 text-xs transition-all min-w-[52px]",
                                selectedDate === d.iso ? "border-primary bg-primary text-white" : "border-border hover:border-primary/40"
                              )}
                            >
                              <span className="font-medium">{d.day}</span>
                              <span className="text-lg font-bold leading-none">{d.date}</span>
                              <span>{d.month}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Time Slots */}
                      {selectedDate && (
                        <div>
                          <p className="text-sm font-medium mb-2">Available Time Slots</p>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {TIME_SLOTS.map((slot) => (
                              <button
                                key={slot}
                                onClick={() => setSelectedTime(slot)}
                                className={cn(
                                  "py-2 px-2 rounded-xl border text-xs font-medium transition-all",
                                  selectedTime === slot ? "bg-primary text-white border-primary" : "border-border hover:border-primary/50"
                                )}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Symptoms */}
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Describe Your Symptoms (Optional)</label>
                        <textarea
                          value={symptoms}
                          onChange={(e) => setSymptoms(e.target.value)}
                          placeholder="Brief description of your symptoms..."
                          className="input-field min-h-[80px] resize-none"
                          rows={3}
                        />
                      </div>

                      <div className="flex gap-3">
                        <button onClick={() => setStep(1)} className="border border-border rounded-xl px-6 py-3 font-medium hover:bg-muted transition-colors">
                          Back
                        </button>
                        <button
                          onClick={() => setStep(3)}
                          disabled={!selectedDate || !selectedTime}
                          className="btn-primary flex-1 disabled:opacity-50"
                        >
                          Review Appointment
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Confirm */}
                  {step === 3 && (
                    <div className="space-y-4">
                      <h2 className="font-semibold text-lg">Confirm Appointment</h2>
                      <div className="premium-card p-5 space-y-3">
                        <div className="flex items-center gap-3 pb-3 border-b border-border/50">
                          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                            <User className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-bold">{selectedDoctor?.name}</p>
                            <p className="text-sm text-muted-foreground">{selectedDoctor?.specialty}</p>
                          </div>
                        </div>
                        {[
                          { label: "Date", value: formatDate(selectedDate) },
                          { label: "Time", value: selectedTime },
                          { label: "Type", value: appointmentType === "teleconsult" ? "Video Teleconsult" : "In-Person Visit" },
                          { label: "PHC", value: selectedDoctor?.phc || "" },
                          { label: "Symptoms", value: symptoms || "Not specified" },
                        ].map(({ label, value }) => (
                          <div key={label} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{label}</span>
                            <span className="font-medium text-right max-w-[200px]">{value}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        📱 You will receive SMS and WhatsApp confirmation on your registered number.
                      </p>
                      <div className="flex gap-3">
                        <button onClick={() => setStep(2)} className="border border-border rounded-xl px-6 py-3 font-medium hover:bg-muted transition-colors">
                          Back
                        </button>
                        <button
                          onClick={handleBook}
                          disabled={isSubmitting}
                          className="btn-primary flex-1 flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                          {isSubmitting ? "Booking..." : "Confirm Booking"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
