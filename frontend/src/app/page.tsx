"use client"

import React, { useEffect, useRef } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { useLanguage } from "@/contexts/LanguageContext"
import {
  Mic, Heart, Calendar, Pill, AlertTriangle, BarChart2,
  Shield, Globe, Phone, Star, ChevronRight, Check, Play,
  Users, MapPin, Activity, Zap, ArrowRight, Quote,
  Stethoscope, Baby, Brain, Leaf
} from "lucide-react"

// ===== ANIMATION VARIANTS =====
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } }
}

// ===== ANIMATED COUNTER =====
function AnimatedCounter({ end, label, suffix = "" }: { end: number; label: string; suffix?: string }) {
  const [count, setCount] = React.useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = end / 60
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 25)
    return () => clearInterval(timer)
  }, [inView, end])

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl lg:text-5xl font-bold text-primary mb-1">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-muted-foreground font-medium">{label}</div>
    </div>
  )
}

// ===== FEATURE CARD =====
function FeatureCard({ icon, title, description, delay = 0 }: {
  icon: React.ReactNode; title: string; description: string; delay?: number
}) {
  return (
    <motion.div
      variants={fadeInUp}
      transition={{ delay, duration: 0.5 }}
      className="premium-card p-6 group cursor-default"
    >
      <div className="w-12 h-12 bg-gradient-to-br from-primary/15 to-secondary/15 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <div className="text-primary">{icon}</div>
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </motion.div>
  )
}

// ===== TESTIMONIAL CARD =====
function TestimonialCard({ quote, name, role, village }: {
  quote: string; name: string; role: string; village: string
}) {
  return (
    <div className="premium-card p-6 flex flex-col gap-4">
      <Quote className="w-8 h-8 text-primary/30" />
      <p className="text-foreground/80 text-sm leading-relaxed italic">{quote}</p>
      <div className="flex items-center gap-3 mt-auto">
        <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
          <span className="text-primary font-bold text-sm">{name[0]}</span>
        </div>
        <div>
          <p className="font-semibold text-sm">{name}</p>
          <p className="text-xs text-muted-foreground">{role} • {village}</p>
        </div>
      </div>
    </div>
  )
}

// ===== HOW IT WORKS STEP =====
function HowItWorksStep({ step, title, description, icon }: {
  step: number; title: string; description: string; icon: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center text-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-button">
          <div className="text-white">{icon}</div>
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold">
          {step}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

// ===== FAQ ITEM =====
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left hover:text-primary transition-colors"
      >
        <span className="font-medium">{question}</span>
        <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${open ? "rotate-90" : ""}`} />
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="text-sm text-muted-foreground leading-relaxed pb-4"
        >
          {answer}
        </motion.div>
      )}
    </div>
  )
}

// ===== MAIN LANDING PAGE =====
export default function LandingPage() {
  const { t } = useLanguage()

  const features = [
    {
      icon: <Mic className="w-6 h-6" />,
      title: "Voice AI Triage",
      description: "Speak in Gujarati or Hindi. Our AI understands your symptoms and gives instant health guidance with severity classification.",
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Severity Classification",
      description: "AI instantly classifies your condition as Emergency, Urgent, Routine or Self-Care with detailed explanation.",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Teleconsult Booking",
      description: "Book video consultations with PHC doctors. Choose your preferred doctor, date, and time. Queue management included.",
    },
    {
      icon: <Pill className="w-6 h-6" />,
      title: "Medicine Tracking",
      description: "ASHA workers track medicine inventory in real-time. Low stock and expiry alerts with barcode scanner support.",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Chronic Care",
      description: "Track BP, diabetes, pregnancy, and vaccinations. Automated follow-up reminders for complete care continuity.",
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Health Dashboard",
      description: "Comprehensive health score, vitals charts, AI suggestions, and complete health timeline — all in one place.",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Offline Mode",
      description: "Works without internet. Stores data locally and auto-syncs when connection is restored. Never miss a case.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Emergency SOS",
      description: "One-tap emergency alert. Share GPS location, find nearest PHC and ambulance with estimated arrival time.",
    },
    {
      icon: <BarChart2 className="w-6 h-6" />,
      title: "District Analytics",
      description: "Health officers get real-time analytics on disease patterns, PHC performance, and village health metrics.",
    },
  ]

  const testimonials = [
    {
      quote: "ArogyaSetu saved my life. I used voice triage at midnight and it told me I needed emergency care. Ambulance arrived in 20 minutes.",
      name: "Ramila Bhen",
      role: "Patient",
      village: "Hadgood, Dahod",
    },
    {
      quote: "Managing medicine stock for 5 villages was impossible before. Now I get alerts before medicines run out. My work became so easy.",
      name: "Savita Kumari",
      role: "ASHA Worker",
      village: "Kadana, Mahisagar",
    },
    {
      quote: "Teleconsultations reduced my travel. I can now see patients from remote villages without them travelling 40km to PHC.",
      name: "Dr. Priya Sharma",
      role: "PHC Doctor",
      village: "Devgadh Baria, Dahod",
    },
    {
      quote: "Disease surveillance has improved 300%. I can track outbreaks and deploy resources in real-time across 120 villages.",
      name: "IAS Rajiv Mehta",
      role: "District Health Officer",
      village: "Dahod District",
    },
  ]

  const faqs = [
    {
      question: "Does ArogyaSetu work without internet?",
      answer: "Yes! ArogyaSetu has full offline support. Patient data, symptom collection, and triage results are stored locally and automatically sync when internet is available.",
    },
    {
      question: "Is the AI diagnosis accurate?",
      answer: "ArogyaSetu uses IBM Granite LLM trained on medical data. It provides guidance with confidence scores. It is a support tool — a doctor always makes the final diagnosis. Emergency cases are escalated immediately.",
    },
    {
      question: "Which languages are supported?",
      answer: "Currently English, Hindi (हिंदी), and Gujarati (ગુજરાતી) are supported. Tribal dialect support (Bhili, Bhilodi, Vasavi) is planned in the next version.",
    },
    {
      question: "How is patient data protected?",
      answer: "All data is encrypted with AES-256. We comply with India's Digital Health Mission (NHP) guidelines. JWT authentication, role-based access, and audit logs ensure full data security.",
    },
    {
      question: "Is there a charge for patients?",
      answer: "ArogyaSetu is completely free for patients and ASHA workers. It is funded through government healthcare schemes and IBM Social Impact initiatives.",
    },
    {
      question: "How do ASHA workers use the app?",
      answer: "ASHA workers get a dedicated dashboard with daily home visit plans, medicine inventory tracking with barcode scanning, follow-up reminders, and a village map view.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden pt-20 lg:pt-28 pb-20 lg:pb-32">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/8 rounded-full blob-filter animate-blob" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-secondary/8 rounded-full blob-filter animate-blob animation-delay-2000" />
          <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-accent/5 rounded-full blob-filter animate-blob animation-delay-4000" />
        </div>

        <div className="section-container relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={stagger}
              className="text-center lg:text-left"
            >
              {/* Badge */}
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
                <Zap className="w-4 h-4" />
                <span>Powered by IBM Granite AI</span>
              </motion.div>

              {/* Title */}
              <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="text-foreground">Healthcare</span>{" "}
                <span className="gradient-text">at Your</span>
                <br />
                <span className="text-foreground">Doorstep</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p variants={fadeInUp} className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                AI-powered healthcare for <strong className="text-foreground">rural and tribal communities</strong>.
                Get instant diagnosis, book teleconsultations, and access medical help —
                in <strong className="text-primary">Gujarati, Hindi, and English</strong>.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
                <Link href="/auth/register" className="btn-primary flex items-center justify-center gap-2 text-base py-4 px-8">
                  Get Free Access
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/auth/login" className="flex items-center justify-center gap-2 py-4 px-8 border border-border rounded-xl font-semibold text-base hover:bg-muted transition-all">
                  <Play className="w-4 h-4" />
                  Watch Demo
                </Link>
              </motion.div>

              {/* Trust indicators */}
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 justify-center lg:justify-start">
                {[
                  { icon: <Shield className="w-4 h-4" />, label: "HIPAA Compliant" },
                  { icon: <Globe className="w-4 h-4" />, label: "3 Languages" },
                  { icon: <Zap className="w-4 h-4" />, label: "Works Offline" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <div className="text-primary">{item.icon}</div>
                    <span>{item.label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: Hero Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative"
            >
              {/* Main card */}
              <div className="relative bg-white dark:bg-card rounded-3xl p-6 shadow-xl border border-border/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">AI Health Assistant</p>
                    <p className="text-xs text-muted-foreground">IBM Granite LLM</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                    <span className="text-xs text-accent font-medium">Live</span>
                  </div>
                </div>

                {/* Fake chat */}
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="w-7 h-7 bg-muted rounded-full flex-shrink-0 flex items-center justify-center text-xs">R</div>
                    <div className="bg-muted rounded-2xl rounded-tl-sm px-3 py-2 text-sm max-w-[200px]">
                      <p className="text-xs text-muted-foreground mb-1">Gujarati</p>
                      <p>mane mathama dard che ane tav aave che</p>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <div className="bg-primary text-white rounded-2xl rounded-tr-sm px-3 py-2 text-sm max-w-[220px]">
                      <p className="font-medium mb-1 text-xs opacity-80">AI Analysis</p>
                      <p>Possible: Malaria or Dengue</p>
                      <p>Severity: <span className="font-bold text-yellow-300">Urgent</span></p>
                    </div>
                    <div className="w-7 h-7 bg-primary/20 rounded-full flex-shrink-0 flex items-center justify-center">
                      <Zap className="w-3 h-3 text-primary" />
                    </div>
                  </div>
                  <div className="bg-warning/10 border border-warning/20 rounded-xl p-2.5 text-xs">
                    <p className="text-warning font-semibold">⚠️ Recommend: Visit PHC today</p>
                    <p className="text-muted-foreground">Nearest: Devgadh PHC (3.2km)</p>
                  </div>
                </div>

                {/* Voice button */}
                <button className="mt-4 w-full flex items-center justify-center gap-2 bg-primary/10 border border-primary/20 text-primary rounded-xl py-2.5 text-sm font-semibold hover:bg-primary hover:text-white transition-all">
                  <Mic className="w-4 h-4" />
                  Speak in Gujarati / Hindi
                </button>
              </div>

              {/* Floating stats */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -top-4 -left-4 bg-white dark:bg-card rounded-2xl px-4 py-3 shadow-xl border border-border"
              >
                <p className="text-2xl font-bold text-primary">98%</p>
                <p className="text-xs text-muted-foreground">AI Accuracy</p>
              </motion.div>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 3.5 }}
                className="absolute -bottom-4 -right-4 bg-white dark:bg-card rounded-2xl px-4 py-3 shadow-xl border border-border"
              >
                <p className="text-2xl font-bold text-accent">2.4M+</p>
                <p className="text-xs text-muted-foreground">Lives Impacted</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== STATISTICS ===== */}
      <section className="py-16 bg-gradient-to-br from-primary to-secondary">
        <div className="section-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { end: 2400000, suffix: "+", label: "Patients Served" },
              { end: 12500, suffix: "+", label: "Villages Covered" },
              { end: 3800, suffix: "+", label: "Doctors Onboard" },
              { end: 98, suffix: "%", label: "Success Rate" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-white mb-1">
                  <AnimatedCounter end={stat.end} suffix={stat.suffix} label="" />
                </div>
                <div className="text-sm text-white/80 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="py-20 lg:py-28">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
              <Zap className="w-4 h-4" />
              <span>Powerful Features</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Everything a Rural Community Needs
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              From AI-powered triage to medicine tracking — ArogyaSetu brings city-level healthcare to every village in India.
            </p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((f, i) => (
              <FeatureCard key={f.title} {...f} delay={i * 0.08} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">How ArogyaSetu Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Simple 4-step process designed for first-time smartphone users and elderly patients.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: 1, icon: <Mic className="w-7 h-7" />, title: "Describe Symptoms", description: "Speak or type your symptoms in Gujarati, Hindi, or English. Voice input supported." },
              { step: 2, icon: <Zap className="w-7 h-7" />, title: "AI Analysis", description: "IBM Granite AI analyzes symptoms, considers medical history, and provides instant guidance." },
              { step: 3, icon: <Calendar className="w-7 h-7" />, title: "Get Recommendation", description: "Severity is classified. You receive action plan — self-care, PHC visit, or emergency call." },
              { step: 4, icon: <Heart className="w-7 h-7" />, title: "Ongoing Care", description: "ASHA worker follows up, teleconsult with doctor, medicine reminders keep you healthy." },
            ].map((item) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: item.step * 0.1 }}
              >
                <HowItWorksStep {...item} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOR EVERY ROLE ===== */}
      <section className="py-20">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Built for Everyone in Healthcare</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Users className="w-8 h-8" />,
                role: "Patients",
                color: "from-primary/15 to-primary/5",
                features: ["Voice symptom input", "Instant AI triage", "Medicine reminders", "Teleconsult booking"],
              },
              {
                icon: <Heart className="w-8 h-8" />,
                role: "ASHA Workers",
                color: "from-accent/15 to-accent/5",
                features: ["Daily visit schedule", "Medicine inventory", "Patient follow-ups", "Village map view"],
              },
              {
                icon: <Stethoscope className="w-8 h-8" />,
                role: "PHC Doctors",
                color: "from-secondary/15 to-secondary/5",
                features: ["Video consultations", "AI triage reports", "Digital prescriptions", "Patient analytics"],
              },
              {
                icon: <BarChart2 className="w-8 h-8" />,
                role: "Health Officers",
                color: "from-warning/15 to-warning/5",
                features: ["District dashboards", "Disease surveillance", "PHC performance", "Resource planning"],
              },
            ].map((item, i) => (
              <motion.div
                key={item.role}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`premium-card p-6 bg-gradient-to-br ${item.color}`}
              >
                <div className="text-primary mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg mb-3">{item.role}</h3>
                <ul className="space-y-2">
                  {item.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-accent flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section id="success-stories" className="py-20 bg-muted/30">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Real Stories from Real People</h2>
            <p className="text-muted-foreground">Lives transformed across Gujarat's rural communities</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <TestimonialCard {...t} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== IBM INTEGRATION ===== */}
      <section className="py-20">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Powered by IBM Cloud</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enterprise-grade AI and cloud infrastructure from IBM, trusted by governments worldwide
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "IBM Granite LLM", subtitle: "Medical AI Assistant", icon: "🤖" },
              { title: "IBM Watson STT", subtitle: "Speech Recognition", icon: "🎙️" },
              { title: "IBM Watson TTS", subtitle: "Text to Speech", icon: "🔊" },
              { title: "IBM Cloud Storage", subtitle: "Secure Data Storage", icon: "☁️" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="premium-card p-5 text-center"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.subtitle}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="py-20 bg-muted/30">
        <div className="section-container max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          </motion.div>
          <div className="premium-card p-6">
            {faqs.map((faq) => (
              <FAQItem key={faq.question} {...faq} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-12 text-center text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-[-50%] right-[-20%] w-96 h-96 bg-white/5 rounded-full blob-filter" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Ready to Transform Rural Healthcare?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Join 2.4 million patients, 12,500 villages, and 3,800 doctors already using ArogyaSetu.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/register"
                  className="bg-white text-primary rounded-xl px-8 py-4 font-bold text-lg hover:bg-white/90 transition-all shadow-lg"
                >
                  Start Free Today
                </Link>
                <a
                  href="tel:108"
                  className="flex items-center justify-center gap-2 border-2 border-white text-white rounded-xl px-8 py-4 font-bold text-lg hover:bg-white/10 transition-all"
                >
                  <Phone className="w-5 h-5" />
                  Emergency: 108
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="section-container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
                <div>
                  <p className="font-bold text-white">ArogyaSetu</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Rural AI</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                AI-powered healthcare platform for rural and tribal communities of India.
              </p>
              <div className="flex gap-3">
                {["📞", "📧", "🐦", "💼"].map((icon, i) => (
                  <button key={i} className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-sm hover:bg-primary transition-colors">
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {[
              {
                title: "Platform",
                links: ["Voice Triage", "Teleconsult", "Medicine Tracker", "Emergency SOS", "Health Dashboard"],
              },
              {
                title: "For Healthcare",
                links: ["ASHA Workers", "PHC Doctors", "Health Officers", "District Analytics", "Offline Mode"],
              },
              {
                title: "Company",
                links: ["About Us", "Privacy Policy", "Terms of Service", "Help Center", "Contact"],
              },
            ].map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold mb-4 text-white">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <Link href="#" className="text-sm text-gray-400 hover:text-primary transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>© 2024 ArogyaSetu Rural AI. All rights reserved.</p>
            <p>Built with ❤️ for rural India • Powered by IBM Cloud</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
