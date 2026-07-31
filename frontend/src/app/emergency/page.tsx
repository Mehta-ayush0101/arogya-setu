"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/layout/Navbar"
import { Phone, MapPin, AlertTriangle, Clock, Navigation, Users, Hospital, Loader2, CheckCircle, X } from "lucide-react"
import { toast } from "sonner"

const NEARBY_PHCS = [
  { id: "p1", name: "Devgadh Baria PHC", distance: 3.2, phone: "02673-234567", type: "PHC", available: true, doctors: 2 },
  { id: "p2", name: "Kadana Community Health Centre", distance: 8.5, phone: "02676-245678", type: "CHC", available: true, doctors: 4 },
  { id: "p3", name: "Dahod District Hospital", distance: 22.1, phone: "02673-280000", type: "Hospital", available: true, doctors: 12 },
]

const EMERGENCY_CONTACTS = [
  { name: "National Ambulance", number: "108", icon: "🚑", description: "Free 24/7 ambulance" },
  { name: "Police Emergency", number: "100", icon: "🚔", description: "Law enforcement" },
  { name: "Women Helpline", number: "1091", icon: "👩", description: "Women in distress" },
  { name: "Child Helpline", number: "1098", icon: "👶", description: "Child emergency" },
  { name: "Mental Health", number: "iCall", icon: "🧠", description: "Mental health support" },
  { name: "Poison Control", number: "1800-116-117", icon: "☠️", description: "Poison emergencies" },
]

export default function EmergencyPage() {
  const [sosActive, setSosActive] = useState(false)
  const [sosStep, setSosStep] = useState(0)
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [countingDown, setCountingDown] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countingDown && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000)
    } else if (countingDown && countdown === 0) {
      triggerSOS()
    }
    return () => clearTimeout(timer)
  }, [countingDown, countdown])

  const getLocation = () => {
    setLocationLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            address: "Tribal Colony, Kadana Village, Mahisagar District, Gujarat",
          })
          setLocationLoading(false)
        },
        () => {
          setLocation({ lat: 23.2156, lng: 73.8456, address: "Kadana Village, Mahisagar, Gujarat" })
          setLocationLoading(false)
        },
        { timeout: 5000 }
      )
    } else {
      setLocation({ lat: 23.2156, lng: 73.8456, address: "Kadana Village, Mahisagar, Gujarat" })
      setLocationLoading(false)
    }
  }

  const startSOSCountdown = () => {
    getLocation()
    setCountingDown(true)
    setCountdown(5)
    toast.warning("SOS activating in 5 seconds... Tap Cancel to stop", { duration: 5000 })
  }

  const cancelSOS = () => {
    setCountingDown(false)
    setCountdown(5)
    toast.info("SOS cancelled")
  }

  const triggerSOS = () => {
    setCountingDown(false)
    setSosActive(true)
    setSosStep(1)
    toast.success("🚨 SOS ACTIVATED — Nearest ambulance notified!")

    // Simulate response
    setTimeout(() => setSosStep(2), 2000)
    setTimeout(() => setSosStep(3), 4000)
  }

  const cancelSOSAlert = () => {
    setSosActive(false)
    setSosStep(0)
    toast.info("Emergency alert cancelled")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="section-container max-w-4xl mx-auto px-4">

          {/* Header */}
          <div className="text-center mb-8 pt-8">
            <div className="inline-flex items-center gap-2 bg-emergency/10 text-emergency rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
              <AlertTriangle className="w-4 h-4" />
              Emergency Services
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">Emergency SOS</h1>
            <p className="text-muted-foreground">One tap to get help. Your location is shared automatically.</p>
          </div>

          {/* BIG SOS BUTTON */}
          <div className="flex justify-center mb-8">
            <AnimatePresence mode="wait">
              {sosActive ? (
                <motion.div
                  key="active"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="text-center"
                >
                  <div className="relative mx-auto w-48 h-48">
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute inset-0 bg-emergency rounded-full"
                    />
                    <div className="relative w-48 h-48 bg-emergency rounded-full flex flex-col items-center justify-center shadow-emergency">
                      <AlertTriangle className="w-12 h-12 text-white mb-1" />
                      <p className="text-white font-bold text-xl">SOS ACTIVE</p>
                    </div>
                  </div>
                  <button onClick={cancelSOSAlert} className="mt-4 flex items-center gap-2 text-muted-foreground hover:text-emergency text-sm font-medium">
                    <X className="w-4 h-4" /> Cancel Emergency Alert
                  </button>
                </motion.div>
              ) : countingDown ? (
                <motion.div key="counting" className="text-center">
                  <div className="relative mx-auto w-48 h-48">
                    <div className="w-48 h-48 bg-emergency/80 rounded-full flex flex-col items-center justify-center shadow-emergency animate-pulse">
                      <p className="text-white text-6xl font-black">{countdown}</p>
                      <p className="text-white text-sm font-medium">seconds</p>
                    </div>
                  </div>
                  <button onClick={cancelSOS} className="mt-4 bg-muted text-foreground px-6 py-3 rounded-xl font-bold text-lg hover:bg-muted/80 transition-colors">
                    CANCEL SOS
                  </button>
                </motion.div>
              ) : (
                <motion.div key="idle" className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startSOSCountdown}
                    className="relative w-48 h-48 bg-emergency rounded-full flex flex-col items-center justify-center shadow-emergency text-white cursor-pointer select-none"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 bg-emergency/30 rounded-full"
                    />
                    <AlertTriangle className="w-12 h-12 mb-1 relative z-10" />
                    <p className="text-2xl font-black relative z-10">SOS</p>
                    <p className="text-sm font-medium relative z-10 opacity-80">Hold to activate</p>
                  </motion.button>
                  <p className="text-xs text-muted-foreground mt-3">
                    5-second delay before activating
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SOS Status */}
          {sosActive && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="premium-card p-5 border-emergency/30 bg-emergency/5 mb-6"
            >
              <h3 className="font-bold text-emergency mb-3">Emergency Response Status</h3>
              <div className="space-y-3">
                {[
                  { step: 1, label: "Alert sent to nearest ambulance (108)", done: sosStep >= 1 },
                  { step: 2, label: "Location shared: " + (location?.address || "Getting location..."), done: sosStep >= 2 },
                  { step: 3, label: "Ambulance dispatched — ETA: 18 minutes", done: sosStep >= 3 },
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-3">
                    {item.done
                      ? <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                      : <Loader2 className="w-5 h-5 text-warning animate-spin flex-shrink-0" />
                    }
                    <p className={`text-sm ${item.done ? "text-foreground" : "text-muted-foreground"}`}>{item.label}</p>
                  </div>
                ))}
              </div>
              {sosStep >= 3 && (
                <div className="mt-4 bg-success/10 border border-success/20 rounded-xl p-3 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-success" />
                  <div>
                    <p className="font-bold text-success">Ambulance on the way!</p>
                    <p className="text-sm text-muted-foreground">Vehicle: GJ-19-ZZ-1234 • Driver: Ramesh • ETA: 18 min</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Location */}
          <div className="premium-card p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" /> Your Location
              </h3>
              <button onClick={getLocation} className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                {locationLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
                Refresh
              </button>
            </div>
            {location ? (
              <div>
                <p className="text-sm font-medium mb-1">{location.address}</p>
                <p className="text-xs text-muted-foreground">GPS: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>
              </div>
            ) : (
              <button onClick={getLocation} className="text-sm text-primary font-medium flex items-center gap-2">
                {locationLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                {locationLoading ? "Getting location..." : "Share My Location"}
              </button>
            )}
          </div>

          {/* Nearby PHCs */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3">Nearest Healthcare Centers</h3>
            <div className="space-y-3">
              {NEARBY_PHCS.map((phc) => (
                <div key={phc.id} className="premium-card p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Hospital className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{phc.name}</p>
                    <p className="text-xs text-muted-foreground">{phc.type} • {phc.distance} km away • {phc.doctors} doctors</p>
                  </div>
                  <a
                    href={`tel:${phc.phone}`}
                    className="flex items-center gap-1.5 bg-primary text-white rounded-xl px-3 py-2 text-xs font-bold hover:bg-primary/90 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Numbers */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Emergency Helplines</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {EMERGENCY_CONTACTS.map((contact) => (
                <a
                  key={contact.number}
                  href={`tel:${contact.number}`}
                  className="premium-card p-4 hover:border-primary/30 transition-all group"
                >
                  <div className="text-2xl mb-2">{contact.icon}</div>
                  <p className="font-bold text-primary text-lg">{contact.number}</p>
                  <p className="font-medium text-sm">{contact.name}</p>
                  <p className="text-xs text-muted-foreground">{contact.description}</p>
                </a>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
