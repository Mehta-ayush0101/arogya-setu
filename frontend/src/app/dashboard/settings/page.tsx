"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { DashboardSidebar, DashboardHeader } from "@/components/layout/DashboardLayout"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage } from "@/contexts/LanguageContext"
import { useTheme } from "next-themes"
import { Bell, Globe, Moon, Sun, Shield, Smartphone, Volume2, User, Save, Check } from "lucide-react"
import { toast } from "sonner"
import { LANGUAGE_OPTIONS } from "@/lib/utils"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
  const { user, updateUser } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const { theme, setTheme } = useTheme()
  const [saved, setSaved] = useState(false)
  const [notifications, setNotifications] = useState({
    sms: true,
    whatsapp: true,
    push: true,
    appointments: true,
    medicines: true,
    healthTips: false,
  })

  const handleSave = () => {
    setSaved(true)
    toast.success("Settings saved successfully!")
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <div className="flex-1 lg:ml-64 flex flex-col">
        <DashboardHeader title="Settings" subtitle="Manage your preferences" />
        <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-2xl">

          {/* Language */}
          <div className="premium-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Language</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {LANGUAGE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setLanguage(opt.value as "en" | "hi" | "gu")}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                    language === opt.value ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/40"
                  )}
                >
                  <span className="text-2xl">{opt.flag}</span>
                  <span className="text-sm font-medium">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Appearance */}
          <div className="premium-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Moon className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Appearance</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "light", label: "Light", icon: <Sun className="w-5 h-5" /> },
                { value: "dark", label: "Dark", icon: <Moon className="w-5 h-5" /> },
                { value: "system", label: "System", icon: <Smartphone className="w-5 h-5" /> },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTheme(opt.value)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                    theme === opt.value ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/40"
                  )}
                >
                  {opt.icon}
                  <span className="text-sm font-medium">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="premium-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Notifications</h3>
            </div>
            <div className="space-y-4">
              {[
                { key: "sms", label: "SMS Alerts", description: "Receive SMS for appointments and emergencies" },
                { key: "whatsapp", label: "WhatsApp Notifications", description: "Appointment reminders via WhatsApp" },
                { key: "push", label: "Push Notifications", description: "Browser and app push notifications" },
                { key: "appointments", label: "Appointment Reminders", description: "24hr and 1hr before appointment" },
                { key: "medicines", label: "Medicine Reminders", description: "Daily medicine dose reminders" },
                { key: "healthTips", label: "Daily Health Tips", description: "AI-curated health tips" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                    className={cn(
                      "relative w-11 h-6 rounded-full transition-colors",
                      notifications[item.key as keyof typeof notifications] ? "bg-primary" : "bg-muted"
                    )}
                    role="switch"
                    aria-checked={notifications[item.key as keyof typeof notifications]}
                  >
                    <span className={cn(
                      "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform",
                      notifications[item.key as keyof typeof notifications] ? "translate-x-5" : "translate-x-0"
                    )} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="premium-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Privacy & Security</h3>
            </div>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors text-sm font-medium">
                Change Password
              </button>
              <button className="w-full text-left px-4 py-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors text-sm font-medium">
                View Audit Log
              </button>
              <button className="w-full text-left px-4 py-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors text-sm font-medium">
                Download My Data
              </button>
              <button className="w-full text-left px-4 py-3 bg-emergency/5 text-emergency rounded-xl hover:bg-emergency/10 transition-colors text-sm font-medium">
                Delete My Account
              </button>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? "Saved!" : "Save Settings"}
          </button>

        </main>
      </div>
    </div>
  )
}
