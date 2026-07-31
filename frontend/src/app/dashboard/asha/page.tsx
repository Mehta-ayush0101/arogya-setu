"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { DashboardSidebar, DashboardHeader } from "@/components/layout/DashboardLayout"
import { Home, Users, Package, UserCheck, CheckCircle, Clock, AlertTriangle, Map, Plus, Search, Phone, Camera } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const HOME_VISITS = [
  { id: "v1", patient: "Kamla Ben", village: "Hadgood", address: "House 14, Near Well", time: "09:00 AM", type: "Pregnancy Check", status: "completed", priority: "high" },
  { id: "v2", patient: "Baby Raju (6 months)", village: "Kadana", address: "Tribal Colony", time: "10:30 AM", type: "Vaccination", status: "pending", priority: "high" },
  { id: "v3", patient: "Sukhabhai Gamit", village: "Fatepura", address: "Main Road", time: "12:00 PM", type: "TB Medicines", status: "pending", priority: "medium" },
  { id: "v4", patient: "Shantabhai Patel", village: "Limkheda", address: "Patel Falia", time: "02:00 PM", type: "BP Check", status: "pending", priority: "low" },
]

const MEDICINE_STOCK = [
  { id: "m1", name: "ORS Packets", quantity: 45, minLevel: 100, expiryDate: "2025-06-30", status: "low" },
  { id: "m2", name: "Paracetamol 500mg", quantity: 280, minLevel: 200, expiryDate: "2025-12-31", status: "adequate" },
  { id: "m3", name: "Iron Folic Acid", quantity: 18, minLevel: 80, expiryDate: "2025-03-15", status: "critical" },
  { id: "m4", name: "Chloroquine Tabs", quantity: 90, minLevel: 60, expiryDate: "2025-09-20", status: "adequate" },
  { id: "m5", name: "Albendazole", quantity: 12, minLevel: 50, expiryDate: "2024-12-01", status: "expired" },
  { id: "m6", name: "Vitamin A", quantity: 65, minLevel: 100, expiryDate: "2025-08-10", status: "low" },
]

const PATIENTS_LIST = [
  { id: "p1", name: "Kamla Ben Gamit", age: 24, condition: "Pregnancy (7 months)", nextVisit: "2024-11-12", status: "active", phone: "+91 98765 43210" },
  { id: "p2", name: "Baby Raju Vasava", age: 0, condition: "Vaccination pending (6 months)", nextVisit: "2024-11-10", status: "urgent", phone: "+91 87654 32109" },
  { id: "p3", name: "Sukhabhai Gamit", age: 52, condition: "Tuberculosis (DOTS therapy)", nextVisit: "2024-11-12", status: "active", phone: "+91 76543 21098" },
  { id: "p4", name: "Manjula Rathwa", age: 38, condition: "Diabetes + Hypertension", nextVisit: "2024-11-15", status: "stable", phone: "+91 65432 10987" },
  { id: "p5", name: "Shantabhai Patel", age: 67, condition: "Hypertension", nextVisit: "2024-11-14", status: "stable", phone: "+91 54321 09876" },
]

function StockStatusBadge({ status }: { status: string }) {
  const config: Record<string, string> = {
    adequate: "bg-success/10 text-success",
    low: "bg-warning/10 text-warning",
    critical: "bg-emergency/10 text-emergency font-bold",
    expired: "bg-destructive/10 text-destructive",
  }
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold capitalize", config[status])}>
      {status}
    </span>
  )
}

export default function AshaDashboard() {
  const [activeTab, setActiveTab] = useState("visits")
  const [scanMode, setScanMode] = useState(false)

  const tabs = [
    { id: "visits", label: "Home Visits", icon: <Home className="w-4 h-4" /> },
    { id: "medicines", label: "Medicine Stock", icon: <Package className="w-4 h-4" /> },
    { id: "patients", label: "My Patients", icon: <Users className="w-4 h-4" /> },
  ]

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <div className="flex-1 lg:ml-64 flex flex-col">
        <DashboardHeader title="ASHA Worker Dashboard" subtitle="Savita Bhen • Kadana Village, Mahisagar" />
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="premium-card p-5">
              <Home className="w-5 h-5 text-primary mb-3" />
              <p className="text-2xl font-bold">4</p>
              <p className="text-sm font-medium">Today's Visits</p>
              <p className="text-xs text-muted-foreground">1 completed</p>
            </div>
            <div className="premium-card p-5">
              <UserCheck className="w-5 h-5 text-success mb-3" />
              <p className="text-2xl font-bold">24</p>
              <p className="text-sm font-medium">Assigned Patients</p>
              <p className="text-xs text-muted-foreground">3 urgent follow-ups</p>
            </div>
            <div className="premium-card p-5 border-warning/30">
              <Package className="w-5 h-5 text-warning mb-3" />
              <p className="text-2xl font-bold text-warning">3</p>
              <p className="text-sm font-medium">Stock Alerts</p>
              <p className="text-xs text-muted-foreground">1 critical, 1 expired</p>
            </div>
            <div className="premium-card p-5">
              <CheckCircle className="w-5 h-5 text-accent mb-3" />
              <p className="text-2xl font-bold">18</p>
              <p className="text-sm font-medium">Completed (Month)</p>
              <p className="text-xs text-muted-foreground">94% success rate</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px",
                  activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Home Visits Tab */}
          {activeTab === "visits" && (
            <div className="space-y-3">
              {HOME_VISITS.map((visit) => (
                <motion.div
                  key={visit.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "premium-card p-4",
                    visit.status === "completed" && "opacity-60"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                      visit.status === "completed" ? "bg-success/10" : visit.priority === "high" ? "bg-emergency/10" : "bg-primary/10"
                    )}>
                      {visit.status === "completed"
                        ? <CheckCircle className="w-5 h-5 text-success" />
                        : visit.priority === "high"
                        ? <AlertTriangle className="w-5 h-5 text-emergency" />
                        : <Clock className="w-5 h-5 text-primary" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-sm">{visit.patient}</p>
                          <p className="text-xs text-muted-foreground">{visit.type} • {visit.time}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Map className="w-3 h-3" /> {visit.village} — {visit.address}
                          </p>
                        </div>
                        <span className={cn(
                          "text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0",
                          visit.status === "completed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                        )}>
                          {visit.status === "completed" ? "Done" : "Pending"}
                        </span>
                      </div>
                      {visit.status === "pending" && (
                        <div className="flex gap-2 mt-2.5">
                          <button className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Mark Complete
                          </button>
                          <a href={`tel:${visit.id}`} className="border border-border rounded-xl py-1.5 px-3 text-xs flex items-center gap-1 hover:bg-muted transition-colors">
                            <Phone className="w-3.5 h-3.5" /> Call
                          </a>
                          <button className="border border-border rounded-xl py-1.5 px-3 text-xs flex items-center gap-1 hover:bg-muted transition-colors">
                            <Map className="w-3.5 h-3.5" /> Navigate
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Medicine Stock Tab */}
          {activeTab === "medicines" && (
            <div className="space-y-4">
              {/* Scan Button */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Track medicine inventory by barcode or QR</p>
                <button
                  onClick={() => { setScanMode(!scanMode); toast.info("Camera scanner opened (demo)") }}
                  className="flex items-center gap-2 bg-primary/10 text-primary rounded-xl px-4 py-2 text-sm font-semibold hover:bg-primary hover:text-white transition-all"
                >
                  <Camera className="w-4 h-4" /> Scan Barcode
                </button>
              </div>

              {/* Alerts */}
              <div className="bg-emergency/5 border border-emergency/20 rounded-xl p-4">
                <p className="font-semibold text-emergency text-sm mb-2">⚠️ Critical Stock Alerts</p>
                <p className="text-xs text-muted-foreground">Iron Folic Acid: Only 18 units (min: 80). Request immediately!</p>
              </div>

              {/* Stock Table */}
              <div className="premium-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        {["Medicine", "Stock", "Min Level", "Expiry", "Status", "Action"].map(h => (
                          <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {MEDICINE_STOCK.map((med) => (
                        <tr key={med.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                          <td className="py-3 px-4 font-medium">{med.name}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden hidden sm:block">
                                <div
                                  className={cn("h-full rounded-full", med.status === "adequate" ? "bg-success" : med.status === "low" ? "bg-warning" : "bg-emergency")}
                                  style={{ width: `${Math.min((med.quantity / med.minLevel) * 100, 100)}%` }}
                                />
                              </div>
                              <span className={cn(
                                "font-semibold",
                                med.status === "critical" ? "text-emergency" : med.status === "low" ? "text-warning" : ""
                              )}>{med.quantity}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">{med.minLevel}</td>
                          <td className={cn("py-3 px-4 text-xs", med.status === "expired" ? "text-emergency font-bold" : "text-muted-foreground")}>{med.expiryDate}</td>
                          <td className="py-3 px-4"><StockStatusBadge status={med.status} /></td>
                          <td className="py-3 px-4">
                            {(med.status === "critical" || med.status === "low") && (
                              <button
                                onClick={() => toast.success(`Request sent for ${med.name}!`)}
                                className="text-xs text-primary font-semibold hover:underline"
                              >
                                Request
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Patients Tab */}
          {activeTab === "patients" && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input placeholder="Search patient..." className="input-field pl-9" />
              </div>
              {PATIENTS_LIST.map((patient) => (
                <motion.div
                  key={patient.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="premium-card p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-primary text-sm">{patient.name[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm">{patient.name}</p>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-semibold",
                          patient.status === "urgent" ? "bg-emergency/10 text-emergency" :
                          patient.status === "active" ? "bg-primary/10 text-primary" :
                          "bg-success/10 text-success"
                        )}>
                          {patient.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{patient.condition}</p>
                      <p className="text-xs text-muted-foreground">Next visit: {patient.nextVisit}</p>
                    </div>
                    <a href={`tel:${patient.phone}`} className="w-9 h-9 bg-primary/10 text-primary rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all flex-shrink-0">
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
