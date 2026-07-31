import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow, isToday, isTomorrow, parseISO } from "date-fns"
import type { SeverityLevel } from "@/types"

// ===== CLASSNAME UTILITY =====
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ===== DATE UTILITIES =====
export function formatDate(date: string | Date, fmt = "dd MMM yyyy") {
  const d = typeof date === "string" ? parseISO(date) : date
  return format(d, fmt)
}

export function formatDateTime(date: string | Date) {
  const d = typeof date === "string" ? parseISO(date) : date
  return format(d, "dd MMM yyyy, hh:mm a")
}

export function formatTime(date: string | Date) {
  const d = typeof date === "string" ? parseISO(date) : date
  return format(d, "hh:mm a")
}

export function getRelativeTime(date: string | Date) {
  const d = typeof date === "string" ? parseISO(date) : date
  if (isToday(d)) return `Today, ${format(d, "hh:mm a")}`
  if (isTomorrow(d)) return `Tomorrow, ${format(d, "hh:mm a")}`
  return formatDistanceToNow(d, { addSuffix: true })
}

// ===== SEVERITY UTILITIES =====
export const SEVERITY_CONFIG: Record<SeverityLevel, {
  label: string;
  labelHi: string;
  labelGu: string;
  color: string;
  bg: string;
  border: string;
  icon: string;
  priority: number;
}> = {
  emergency: {
    label: "Emergency",
    labelHi: "आपातकाल",
    labelGu: "ઇમર્જન્સી",
    color: "text-emergency",
    bg: "bg-emergency/10",
    border: "border-emergency/30",
    icon: "🚨",
    priority: 1,
  },
  urgent: {
    label: "Urgent",
    labelHi: "अत्यावश्यक",
    labelGu: "તાત્કાલિક",
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/30",
    icon: "⚠️",
    priority: 2,
  },
  routine: {
    label: "Routine",
    labelHi: "साधारण",
    labelGu: "સામાન્ય",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/30",
    icon: "📋",
    priority: 3,
  },
  self_care: {
    label: "Self Care",
    labelHi: "स्वयं देखभाल",
    labelGu: "સ્વ-સંભાળ",
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/30",
    icon: "💚",
    priority: 4,
  },
}

// ===== STOCK STATUS =====
export const STOCK_STATUS_CONFIG = {
  adequate: { label: "Adequate", color: "text-success", bg: "bg-success/10" },
  low: { label: "Low Stock", color: "text-warning", bg: "bg-warning/10" },
  critical: { label: "Critical", color: "text-emergency", bg: "bg-emergency/10" },
  expired: { label: "Expired", color: "text-destructive", bg: "bg-destructive/10" },
}

// ===== APPOINTMENT STATUS =====
export const APPOINTMENT_STATUS_CONFIG = {
  scheduled: { label: "Scheduled", color: "text-primary", bg: "bg-primary/10" },
  confirmed: { label: "Confirmed", color: "text-secondary", bg: "bg-secondary/10" },
  in_progress: { label: "In Progress", color: "text-warning", bg: "bg-warning/10" },
  completed: { label: "Completed", color: "text-success", bg: "bg-success/10" },
  cancelled: { label: "Cancelled", color: "text-destructive", bg: "bg-destructive/10" },
  missed: { label: "Missed", color: "text-muted-foreground", bg: "bg-muted" },
}

// ===== ROLE CONFIG =====
export const ROLE_CONFIG = {
  patient: {
    label: "Patient",
    labelHi: "मरीज़",
    labelGu: "દર્દી",
    color: "text-primary",
    dashboardPath: "/dashboard/patient",
  },
  asha_worker: {
    label: "ASHA Worker",
    labelHi: "आशा कार्यकर्ता",
    labelGu: "આશા કાર્યકર",
    color: "text-accent",
    dashboardPath: "/dashboard/asha",
  },
  phc_doctor: {
    label: "PHC Doctor",
    labelHi: "PHC डॉक्टर",
    labelGu: "PHC ડૉક્ટર",
    color: "text-secondary",
    dashboardPath: "/dashboard/doctor",
  },
  district_officer: {
    label: "District Health Officer",
    labelHi: "जिला स्वास्थ्य अधिकारी",
    labelGu: "જિલ્લા આરોગ્ય અધિકારી",
    color: "text-warning",
    dashboardPath: "/dashboard/admin",
  },
  admin: {
    label: "System Admin",
    labelHi: "सिस्टम एडमिन",
    labelGu: "સિસ્ટમ એડમિન",
    color: "text-destructive",
    dashboardPath: "/dashboard/admin",
  },
}

// ===== NUMBER FORMATTERS =====
export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toString()
}

export function formatPercentage(value: number, total: number): string {
  if (total === 0) return "0%"
  return `${Math.round((value / total) * 100)}%`
}

// ===== HEALTH SCORE COLOR =====
export function getHealthScoreColor(score: number): string {
  if (score >= 80) return "text-success"
  if (score >= 60) return "text-warning"
  if (score >= 40) return "text-orange-500"
  return "text-emergency"
}

export function getHealthScoreLabel(score: number): string {
  if (score >= 80) return "Excellent"
  if (score >= 60) return "Good"
  if (score >= 40) return "Fair"
  return "Poor"
}

// ===== BLOOD PRESSURE =====
export function classifyBP(systolic: number, diastolic: number): { label: string; color: string } {
  if (systolic >= 180 || diastolic >= 120) return { label: "Hypertensive Crisis", color: "text-emergency" }
  if (systolic >= 140 || diastolic >= 90) return { label: "High BP (Stage 2)", color: "text-emergency" }
  if (systolic >= 130 || diastolic >= 80) return { label: "High BP (Stage 1)", color: "text-warning" }
  if (systolic >= 120 && diastolic < 80) return { label: "Elevated", color: "text-warning" }
  return { label: "Normal", color: "text-success" }
}

// ===== BLOOD SUGAR =====
export function classifyBloodSugar(value: number, fasting: boolean): { label: string; color: string } {
  if (fasting) {
    if (value >= 126) return { label: "Diabetic", color: "text-emergency" }
    if (value >= 100) return { label: "Pre-Diabetic", color: "text-warning" }
    return { label: "Normal", color: "text-success" }
  } else {
    if (value >= 200) return { label: "Diabetic", color: "text-emergency" }
    if (value >= 140) return { label: "Pre-Diabetic", color: "text-warning" }
    return { label: "Normal", color: "text-success" }
  }
}

// ===== TRUNCATE TEXT =====
export function truncate(text: string, maxLength = 100): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

// ===== DEBOUNCE =====
export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number) {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}

// ===== GENERATE AVATAR URL =====
export function getAvatarUrl(name: string, size = 80): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&size=${size}`
}

// ===== MOCK DATA GENERATORS =====
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

// ===== LANGUAGE LABELS =====
export const LANGUAGE_OPTIONS = [
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "hi", label: "हिंदी", flag: "🇮🇳" },
  { value: "gu", label: "ગુજરાતી", flag: "🇮🇳" },
]

// ===== CHART COLORS =====
export const CHART_COLORS = {
  primary: "#0F766E",
  secondary: "#14B8A6",
  accent: "#22C55E",
  warning: "#F59E0B",
  emergency: "#DC2626",
  purple: "#7C3AED",
  blue: "#2563EB",
  pink: "#DB2777",
  orange: "#EA580C",
}

// ===== TIME SLOTS =====
export const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM",
]
