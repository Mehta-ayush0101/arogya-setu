"use client"

import React from "react"
import { motion } from "framer-motion"
import { DashboardSidebar, DashboardHeader } from "@/components/layout/DashboardLayout"
import { Activity, Heart, Thermometer, Droplets, Weight, Wind, Plus, TrendingUp, TrendingDown } from "lucide-react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts"
import { classifyBP, classifyBloodSugar, CHART_COLORS } from "@/lib/utils"

const VITALS_HISTORY = [
  { date: "Sep 1", bp_sys: 128, bp_dia: 84, hr: 78, temp: 98.6, sugar: 102, weight: 58 },
  { date: "Sep 15", bp_sys: 125, bp_dia: 82, hr: 75, temp: 98.4, sugar: 98, weight: 58.2 },
  { date: "Oct 1", bp_sys: 122, bp_dia: 80, hr: 73, temp: 98.5, sugar: 95, weight: 57.8 },
  { date: "Oct 15", bp_sys: 120, bp_dia: 78, hr: 71, temp: 98.7, sugar: 94, weight: 57.5 },
  { date: "Nov 1", bp_sys: 118, bp_dia: 76, hr: 70, temp: 98.6, sugar: 93, weight: 57.3 },
  { date: "Nov 5", bp_sys: 116, bp_dia: 75, hr: 68, temp: 98.5, sugar: 92, weight: 57.1 },
]

const CURRENT_VITALS = VITALS_HISTORY[VITALS_HISTORY.length - 1]

function VitalCard({ icon, label, value, unit, status, trend }: {
  icon: React.ReactNode; label: string; value: string; unit: string; status: { label: string; color: string }; trend?: "up" | "down"
}) {
  return (
    <div className="premium-card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
          {icon}
        </div>
        {trend && (
          <div className={`text-xs font-medium flex items-center gap-0.5 ${trend === "up" ? "text-success" : "text-emergency"}`}>
            {trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold">{value} <span className="text-base font-normal text-muted-foreground">{unit}</span></p>
      <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
      <span className={`text-xs font-semibold ${status.color}`}>{status.label}</span>
    </div>
  )
}

export default function VitalsPage() {
  const bpStatus = classifyBP(CURRENT_VITALS.bp_sys, CURRENT_VITALS.bp_dia)
  const sugarStatus = classifyBloodSugar(CURRENT_VITALS.sugar, true)

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <div className="flex-1 lg:ml-64 flex flex-col">
        <DashboardHeader title="Vitals Tracker" subtitle="Monitor your health indicators" />
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">

          {/* Current Vitals */}
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Current Readings (Nov 5, 2024)</h2>
            <button className="btn-primary py-2 px-4 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" /> Log Vitals
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <VitalCard
              icon={<Activity className="w-5 h-5" />}
              label="Blood Pressure"
              value={`${CURRENT_VITALS.bp_sys}/${CURRENT_VITALS.bp_dia}`}
              unit="mmHg"
              status={bpStatus}
              trend="up"
            />
            <VitalCard
              icon={<Heart className="w-5 h-5" />}
              label="Heart Rate"
              value={`${CURRENT_VITALS.hr}`}
              unit="bpm"
              status={{ label: "Normal (60-100 bpm)", color: "text-success" }}
              trend="up"
            />
            <VitalCard
              icon={<Thermometer className="w-5 h-5" />}
              label="Temperature"
              value={`${CURRENT_VITALS.temp}`}
              unit="°F"
              status={{ label: "Normal (97-99°F)", color: "text-success" }}
            />
            <VitalCard
              icon={<Droplets className="w-5 h-5" />}
              label="Blood Sugar (Fasting)"
              value={`${CURRENT_VITALS.sugar}`}
              unit="mg/dL"
              status={sugarStatus}
              trend="up"
            />
            <VitalCard
              icon={<Weight className="w-5 h-5" />}
              label="Weight"
              value={`${CURRENT_VITALS.weight}`}
              unit="kg"
              status={{ label: "BMI 21.4 — Normal", color: "text-success" }}
              trend="up"
            />
            <VitalCard
              icon={<Wind className="w-5 h-5" />}
              label="Oxygen Saturation"
              value="98"
              unit="SpO2 %"
              status={{ label: "Normal (95-100%)", color: "text-success" }}
            />
          </div>

          {/* BP Chart */}
          <div className="premium-card p-6">
            <h3 className="font-semibold text-lg mb-4">Blood Pressure Trend (3 Months)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={VITALS_HISTORY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[60, 160]} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: "12px", fontSize: "12px" }} />
                <ReferenceLine y={140} stroke="#DC2626" strokeDasharray="5 5" label={{ value: "High BP", position: "right", fill: "#DC2626", fontSize: 10 }} />
                <ReferenceLine y={90} stroke="#F59E0B" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="bp_sys" stroke={CHART_COLORS.primary} strokeWidth={2.5} dot={{ r: 4 }} name="Systolic" />
                <Line type="monotone" dataKey="bp_dia" stroke={CHART_COLORS.secondary} strokeWidth={2} dot={{ r: 3 }} name="Diastolic" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Sugar + HR Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="premium-card p-6">
              <h3 className="font-semibold mb-4">Blood Sugar Trend</h3>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={VITALS_HISTORY}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis domain={[70, 140]} tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "11px" }} />
                  <ReferenceLine y={126} stroke="#DC2626" strokeDasharray="4 4" />
                  <Line type="monotone" dataKey="sugar" stroke={CHART_COLORS.warning} strokeWidth={2} dot={{ r: 3 }} name="Fasting Sugar" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="premium-card p-6">
              <h3 className="font-semibold mb-4">Heart Rate Trend</h3>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={VITALS_HISTORY}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis domain={[50, 100]} tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "11px" }} />
                  <Line type="monotone" dataKey="hr" stroke={CHART_COLORS.emergency} strokeWidth={2} dot={{ r: 3 }} name="Heart Rate" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}
