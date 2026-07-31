"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage } from "@/contexts/LanguageContext"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, Calendar, Mic, Pill, AlertTriangle,
  BarChart2, Settings, LogOut, Bell, Menu, X, User,
  ClipboardList, Map, UserCheck, Package, Activity,
  HeartPulse, MessageSquare, FileText, Home, Users, Shield
} from "lucide-react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
  badge?: number
}

function getNavItems(role: string): NavItem[] {
  const baseItems: Record<string, NavItem[]> = {
    patient: [
      { href: "/dashboard/patient", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
      { href: "/dashboard/patient/triage", label: "AI Triage", icon: <Mic className="w-5 h-5" /> },
      { href: "/dashboard/patient/appointments", label: "Appointments", icon: <Calendar className="w-5 h-5" /> },
      { href: "/dashboard/patient/health-records", label: "Health Records", icon: <FileText className="w-5 h-5" /> },
      { href: "/dashboard/patient/medicines", label: "Medicines", icon: <Pill className="w-5 h-5" /> },
      { href: "/dashboard/patient/vitals", label: "Vitals", icon: <Activity className="w-5 h-5" /> },
      { href: "/dashboard/patient/chat", label: "AI Chat", icon: <MessageSquare className="w-5 h-5" /> },
      { href: "/emergency", label: "Emergency SOS", icon: <AlertTriangle className="w-5 h-5" /> },
    ],
    phc_doctor: [
      { href: "/dashboard/doctor", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
      { href: "/dashboard/doctor/appointments", label: "Appointments", icon: <Calendar className="w-5 h-5" />, badge: 4 },
      { href: "/dashboard/doctor/patients", label: "Patients", icon: <Users className="w-5 h-5" /> },
      { href: "/dashboard/doctor/triage-queue", label: "Triage Queue", icon: <ClipboardList className="w-5 h-5" />, badge: 2 },
      { href: "/dashboard/doctor/analytics", label: "Analytics", icon: <BarChart2 className="w-5 h-5" /> },
      { href: "/dashboard/doctor/prescriptions", label: "Prescriptions", icon: <FileText className="w-5 h-5" /> },
    ],
    asha_worker: [
      { href: "/dashboard/asha", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
      { href: "/dashboard/asha/home-visits", label: "Home Visits", icon: <Home className="w-5 h-5" /> },
      { href: "/dashboard/asha/patients", label: "My Patients", icon: <Users className="w-5 h-5" /> },
      { href: "/dashboard/asha/medicines", label: "Medicine Stock", icon: <Package className="w-5 h-5" /> },
      { href: "/dashboard/asha/follow-ups", label: "Follow-Ups", icon: <UserCheck className="w-5 h-5" />, badge: 5 },
      { href: "/dashboard/asha/map", label: "Village Map", icon: <Map className="w-5 h-5" /> },
    ],
    admin: [
      { href: "/dashboard/admin", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
      { href: "/dashboard/admin/users", label: "Users", icon: <Users className="w-5 h-5" /> },
      { href: "/dashboard/admin/phcs", label: "PHCs", icon: <HeartPulse className="w-5 h-5" /> },
      { href: "/dashboard/admin/medicines", label: "Medicines", icon: <Package className="w-5 h-5" /> },
      { href: "/dashboard/admin/analytics", label: "Analytics", icon: <BarChart2 className="w-5 h-5" /> },
      { href: "/dashboard/admin/system", label: "System", icon: <Shield className="w-5 h-5" /> },
    ],
    district_officer: [
      { href: "/dashboard/admin", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
      { href: "/dashboard/admin/analytics", label: "Analytics", icon: <BarChart2 className="w-5 h-5" /> },
      { href: "/dashboard/admin/phcs", label: "PHCs", icon: <HeartPulse className="w-5 h-5" /> },
      { href: "/dashboard/admin/users", label: "Users", icon: <Users className="w-5 h-5" /> },
    ],
  }
  return baseItems[role] || baseItems.patient
}

export function DashboardSidebar() {
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = getNavItems(user?.role || "patient")

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 flex items-center gap-3 border-b border-border/50">
        <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-lg">A</span>
        </div>
        {!collapsed && (
          <div>
            <p className="font-bold text-primary text-sm leading-none">ArogyaSetu</p>
            <p className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">Rural AI</p>
          </div>
        )}
      </div>

      {/* User info */}
      {!collapsed && (
        <div className="p-4 border-b border-border/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-foreground truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role?.replace(/_/g, " ")}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "sidebar-nav-item",
                isActive && "active",
                collapsed && "justify-center px-3"
              )}
              title={collapsed ? item.label : undefined}
            >
              {item.icon}
              {!collapsed && <span className="flex-1">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t border-border/30 space-y-1">
        <Link
          href="/dashboard/notifications"
          className={cn("sidebar-nav-item", collapsed && "justify-center px-3")}
          title={collapsed ? "Notifications" : undefined}
        >
          <Bell className="w-5 h-5" />
          {!collapsed && <span>Notifications</span>}
        </Link>
        <Link
          href="/dashboard/settings"
          className={cn("sidebar-nav-item", collapsed && "justify-center px-3")}
          title={collapsed ? "Settings" : undefined}
        >
          <Settings className="w-5 h-5" />
          {!collapsed && <span>Settings</span>}
        </Link>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={cn("sidebar-nav-item w-full", collapsed && "justify-center px-3")}
          title={collapsed ? "Theme" : undefined}
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {!collapsed && <span>Theme</span>}
        </button>
        <button
          onClick={logout}
          className={cn("sidebar-nav-item w-full text-emergency hover:bg-emergency/10 hover:text-emergency", collapsed && "justify-center px-3")}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col fixed top-0 left-0 h-full bg-white dark:bg-card border-r border-border/50 transition-all duration-300 z-40",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 bg-white dark:bg-card border border-border rounded-full p-1 shadow-sm z-50"
        >
          {collapsed ? <Menu className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
        </button>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-6 left-4 z-50 bg-primary text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-button"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden fixed top-0 left-0 h-full w-72 bg-white dark:bg-card border-r border-border z-50"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export function DashboardHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const { user } = useAuth()
  const [notifOpen, setNotifOpen] = useState(false)

  return (
    <header className="bg-white dark:bg-card border-b border-border/50 px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {/* Notifications bell */}
        <button
          onClick={() => setNotifOpen(!notifOpen)}
          className="relative p-2 rounded-xl hover:bg-muted transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-emergency rounded-full" />
        </button>
        {/* User avatar */}
        <div className="w-9 h-9 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
          <User className="w-5 h-5 text-primary" />
        </div>
      </div>
    </header>
  )
}
