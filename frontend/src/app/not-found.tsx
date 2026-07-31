"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Home, ArrowLeft, Search } from "lucide-react"

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center max-w-md mx-auto">
        {/* Animated 404 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <div className="text-8xl font-black text-primary/20 leading-none select-none">404</div>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mt-2" />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-4xl mb-4">🏥</div>
          <h1 className="text-2xl font-bold mb-3">Page Not Found</h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back to healthcare.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-primary flex items-center justify-center gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Link>
            <Link href="/dashboard/patient" className="flex items-center justify-center gap-2 border border-border rounded-xl px-6 py-3 font-semibold hover:bg-muted transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">Emergency? We're always here.</p>
            <a href="tel:108" className="inline-flex items-center gap-2 text-emergency font-bold hover:underline">
              📞 Call Ambulance: 108
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
