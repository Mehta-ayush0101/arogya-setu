"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { DashboardSidebar, DashboardHeader } from "@/components/layout/DashboardLayout"
import {
  BarChart2, Users, Calendar, Package, TrendingUp, TrendingDown,
  AlertTriangle, Activity, MapPin, Download, RefreshCw, Filter
} from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, Legend
} from "recharts"
import { CHART_COLORS } from "@/lib/utils"
import Link from "next/link"

// ===== MOCK DATA =====
const monthlyStats = [
  { month: "Jun", appointments: 420, consultations: 380, emergencies: 18 },
  { month: "Jul", appointments: 480, consultations: 440, emergencies: 22 },
  { month: "Aug", appointments: 510, consultations: 475, emergencies: 19 },
  { month: "Sep", appointments: 460, consultations: 420, emergencies: 25 },
  { month: "Oct", appointments: 530, consultations: 495, emergencies: 21 },
  { month: "Nov", appointments: 390, consultations: 360, emergencies: 14 },
]

const diseaseData = [
  { name: "Malaria", value: 285, color: CHART_COLORS.primary },
  { name: "Diarrhea", value: 220, color: CHART_COLORS.secondary },
  { name: "TB", value: 180, color: CHART_COLORS.warning },
  { name: "Anemia", value: 165, color: CHART_COLORS.accent },
  { name: "Diabetes", value: 140, color: CHART_COLORS.purple },
  { name: "Hypertension", value: 120, color: CHART_COLORS.orange },
]

const phcPerformance = [
  { phc: "Devgadh PHC", patients: 1240, satisfaction: 92, avgWait: 18 },
  { phc: "Kadana CHC", patients: 980, satisfaction: 88, avgWait: 22 },
  { phc: "Limkheda PHC", patients: 760, satisfaction: 95, avgWait: 15 },
  { phc: "Zalod PHC", patients: 890, satisfaction: 85, avgWait: 28 },
  { phc: "Fatepura PHC", patients: 620, satisfaction: 90, avgWait: 20 },
]

const medicineAlerts = [
  { medicine: "ORS Packets", phc: "Kadana CHC", stock: 24, minStock: 100, urgency: "critical" },
  { medicine: "Paracetamol 500mg", phc: "Zalod PHC", stock: 65, minStock: 200, urgency: "low" },
  { medicine: "Chloroquine Tablets", phc: "Devgadh PHC", stock: 45, minStock: 150, urgency: "low" },
  { medicine: "Iron Folic Acid", phc: "Limkheda PHC", stock: 12, minStock: 80, urgency: "critical" },
]

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: {cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; percent: number}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return percent > 0.05 ? (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="600">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null
}

function StatCard({ icon, label, value, change, changeType }: {
  icon: React.ReactNode; label: string; value: string; change: string; changeType: "up" | "down" | "neutral"
}) {
  return (
    <div className="premium-card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
          {icon}
        </div>
        <span className={`text-xs font-semibold flex items-center gap-0.5 ${
          changeType === "up" ? "text-success" : changeType === "down" ? "text-emergency" : "text-muted-foreground"
        }`}>
          {changeType === "up" ? <TrendingUp className="w-3 h-3" /> : changeType === "down" ? <TrendingDown className="w-3 h-3" /> : null}
          {change}
        </span>
      </div>
      <p className="text-2xl font-bold mb-0.5">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("6m")

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <div className="flex-1 lg:ml-64 flex flex-col">
        <DashboardHeader title="District Health Dashboard" subtitle="Dahod District, Gujarat • Real-time Analytics" />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<Users className="w-5 h-5" />} label="Total Patients" value="24,847" change="+12% this month" changeType="up" />
            <StatCard icon={<Calendar className="w-5 h-5" />} label="Appointments" value="2,530" change="+8% this month" changeType="up" />
            <StatCard icon={<AlertTriangle className="w-5 h-5" />} label="Emergency Cases" value="14" change="-33% vs last month" changeType="up" />
            <StatCard icon={<Package className="w-5 h-5" />} label="Medicine Alerts" value="4" change="2 critical" changeType="down" />
          </div>

          {/* Charts Row 1 */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Monthly Trend */}
            <div className="lg:col-span-2 premium-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Monthly Health Activity</h3>
                <div className="flex items-center gap-2">
                  {["3m", "6m", "1y"].map(r => (
                    <button
                      key={r}
                      onClick={() => setTimeRange(r)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        timeRange === r ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={monthlyStats}>
                  <defs>
                    <linearGradient id="colorAppt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorConsult" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: "12px", fontSize: "12px" }} />
                  <Legend />
                  <Area type="monotone" dataKey="appointments" stroke={CHART_COLORS.primary} fill="url(#colorAppt)" strokeWidth={2} name="Appointments" />
                  <Area type="monotone" dataKey="consultations" stroke={CHART_COLORS.secondary} fill="url(#colorConsult)" strokeWidth={2} name="Consultations" />
                  <Bar dataKey="emergencies" fill={CHART_COLORS.emergency} name="Emergencies" radius={[4, 4, 0, 0]} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Disease Distribution */}
            <div className="premium-card p-6">
              <h3 className="font-semibold text-lg mb-4">Disease Distribution</h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={diseaseData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomizedLabel}
                  >
                    {diseaseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {diseaseData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: d.color }} />
                    <span className="flex-1 text-muted-foreground">{d.name}</span>
                    <span className="font-semibold">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PHC Performance Table */}
          <div className="premium-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">PHC Performance</h3>
              <button className="flex items-center gap-1.5 text-sm text-primary font-medium hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors">
                <Download className="w-4 h-4" /> Export
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {["PHC Name", "Patients (Month)", "Satisfaction", "Avg Wait (min)", "Status"].map(h => (
                      <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {phcPerformance.map((phc) => (
                    <tr key={phc.phc} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-3 font-medium">{phc.phc}</td>
                      <td className="py-3 px-3">{phc.patients.toLocaleString()}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-success rounded-full" style={{ width: `${phc.satisfaction}%` }} />
                          </div>
                          <span>{phc.satisfaction}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">{phc.avgWait} min</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          phc.satisfaction >= 90 ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                        }`}>
                          {phc.satisfaction >= 90 ? "Excellent" : "Good"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Medicine Alerts + AI Usage */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Medicine Alerts */}
            <div className="premium-card p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-warning" />
                Medicine Stock Alerts
              </h3>
              <div className="space-y-3">
                {medicineAlerts.map((alert) => (
                  <div key={`${alert.medicine}-${alert.phc}`} className={`p-3 rounded-xl border ${
                    alert.urgency === "critical" ? "bg-emergency/5 border-emergency/20" : "bg-warning/5 border-warning/20"
                  }`}>
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-medium text-sm">{alert.medicine}</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        alert.urgency === "critical" ? "bg-emergency/10 text-emergency" : "bg-warning/10 text-warning"
                      }`}>
                        {alert.urgency === "critical" ? "⚠️ Critical" : "Low"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{alert.phc}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${alert.urgency === "critical" ? "bg-emergency" : "bg-warning"}`}
                          style={{ width: `${(alert.stock / alert.minStock) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">{alert.stock}/{alert.minStock}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* IBM AI Usage Stats */}
            <div className="premium-card p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                IBM AI Platform Usage
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Voice Triage Queries", value: 1284, max: 2000, icon: "🎙️" },
                  { label: "STT Conversions", value: 986, max: 2000, icon: "🔊" },
                  { label: "AI Diagnoses", value: 845, max: 2000, icon: "🤖" },
                  { label: "TTS Responses", value: 732, max: 2000, icon: "📢" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="flex items-center justify-between mb-1.5 text-sm">
                      <span className="flex items-center gap-2">
                        <span>{stat.icon}</span>
                        <span className="font-medium">{stat.label}</span>
                      </span>
                      <span className="text-primary font-bold">{stat.value.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(stat.value / stat.max) * 100}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-primary/5 rounded-xl text-xs text-muted-foreground">
                📊 This month: 3,847 IBM API calls • Avg response: 1.2s • Uptime: 99.9%
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}
