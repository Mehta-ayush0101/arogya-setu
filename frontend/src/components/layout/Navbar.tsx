"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext"
import { useAuth } from "@/contexts/AuthContext"
import { LANGUAGE_OPTIONS } from "@/lib/utils"
import { Moon, Sun, Menu, X, Phone, Globe, ChevronDown } from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

export function Navbar() {
  const { t, language, setLanguage } = useLanguage()
  const { isAuthenticated, user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const roleToPath = (role?: string) => {
    if (role === "patient") return "/dashboard/patient"
    if (role === "phc_doctor") return "/dashboard/doctor"
    if (role === "asha_worker") return "/dashboard/asha"
    if (role === "admin" || role === "district_officer") return "/dashboard/admin"
    return "/dashboard/patient"
  }

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-primary text-lg leading-none">ArogyaSetu</p>
              <p className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">Rural AI</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { href: "/#features", label: "Features" },
              { href: "/#how-it-works", label: "How It Works" },
              { href: "/#success-stories", label: "Stories" },
              { href: "/#faq", label: "FAQ" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-primary rounded-lg hover:bg-primary/5 transition-all"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Emergency */}
            <a
              href="tel:108"
              className="hidden sm:flex items-center gap-1.5 bg-emergency/10 text-emergency border border-emergency/20 rounded-xl px-3 py-1.5 text-sm font-semibold hover:bg-emergency hover:text-white transition-all duration-200"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>108</span>
            </a>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 p-2 rounded-xl hover:bg-muted transition-colors text-sm font-medium"
                aria-label="Change language"
              >
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="hidden sm:inline text-muted-foreground uppercase text-xs font-semibold">{language}</span>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-900 border border-border rounded-xl shadow-xl p-1 min-w-[140px] z-50"
                >
                  {LANGUAGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setLanguage(opt.value as "en"|"hi"|"gu"); setLangOpen(false) }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors flex items-center gap-2 ${
                        language === opt.value ? "bg-primary/10 text-primary font-semibold" : ""
                      }`}
                    >
                      <span>{opt.flag}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-xl hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark"
                ? <Sun className="w-4 h-4 text-warning" />
                : <Moon className="w-4 h-4 text-muted-foreground" />
              }
            </button>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  href={roleToPath(user?.role)}
                  className="btn-primary py-2 px-4 text-sm"
                >
                  Dashboard
                </Link>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/auth/login" className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary rounded-xl hover:bg-muted transition-all">
                  Login
                </Link>
                <Link href="/auth/register" className="btn-primary py-2 px-4 text-sm">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border/50 py-4 space-y-1"
          >
            {[
              { href: "/#features", label: "Features" },
              { href: "/#how-it-works", label: "How It Works" },
              { href: "/#success-stories", label: "Stories" },
              { href: "/#faq", label: "FAQ" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-base font-medium text-foreground/80 hover:text-primary rounded-xl hover:bg-primary/5 transition-all"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-2 px-4">
              <a
                href="tel:108"
                className="flex items-center justify-center gap-2 bg-emergency/10 text-emergency border border-emergency/20 rounded-xl py-3 font-semibold"
              >
                <Phone className="w-4 h-4" />
                Emergency: 108
              </a>
              {!isAuthenticated && (
                <>
                  <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="text-center py-3 font-medium border border-border rounded-xl hover:bg-muted transition-colors">
                    Login
                  </Link>
                  <Link href="/auth/register" onClick={() => setMobileOpen(false)} className="btn-primary text-center">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}
