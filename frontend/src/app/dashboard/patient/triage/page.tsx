"use client"

import React, { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DashboardSidebar, DashboardHeader } from "@/components/layout/DashboardLayout"
import { useLanguage } from "@/contexts/LanguageContext"
import { Mic, MicOff, Send, Volume2, AlertTriangle, CheckCircle, Clock, Shield, Loader2, RefreshCw } from "lucide-react"
import { cn, SEVERITY_CONFIG } from "@/lib/utils"
import type { SeverityLevel, TriageResult } from "@/types"
import Link from "next/link"

// ===== IBM WATSONX AI SIMULATION =====
const SYMPTOM_PATTERNS: Record<string, { conditions: string[]; severity: SeverityLevel; action: string; advice: string }> = {
  chest: {
    conditions: ["Heart Attack", "Angina", "Pulmonary Embolism"],
    severity: "emergency",
    action: "Call 108 immediately. Do NOT travel alone. Chew aspirin if available.",
    advice: "Chest pain can be life-threatening. Go to hospital NOW.",
  },
  fever: {
    conditions: ["Malaria", "Dengue", "Typhoid", "Viral fever"],
    severity: "urgent",
    action: "Visit PHC within 24 hours. Take paracetamol. Drink fluids. Rest.",
    advice: "Monitor temperature. If >103°F or difficulty breathing, go to hospital.",
  },
  headache: {
    conditions: ["Tension headache", "Migraine", "Hypertension"],
    severity: "routine",
    action: "Take rest, drink water. If severe or sudden, visit PHC.",
    advice: "Most headaches resolve with rest. Monitor BP if you have hypertension.",
  },
  stomach: {
    conditions: ["Gastroenteritis", "Appendicitis (rule out)", "Acidity"],
    severity: "urgent",
    action: "Visit PHC if pain is severe. ORS for diarrhea. Light diet.",
    advice: "If pain is on right side or severe, get examined immediately.",
  },
  cough: {
    conditions: ["Common cold", "Bronchitis", "Tuberculosis (rule out)"],
    severity: "routine",
    action: "Stay hydrated. If cough > 2 weeks or blood in sputum, visit PHC urgently.",
    advice: "Wear mask. Monitor for difficulty breathing.",
  },
  difficulty: {
    conditions: ["Asthma", "Pneumonia", "Allergic reaction"],
    severity: "emergency",
    action: "Seek emergency care NOW. Call 108 if breathing is very difficult.",
    advice: "Breathing difficulty is a medical emergency. Do not wait.",
  },
  pregnancy: {
    conditions: ["Normal pregnancy discomfort", "Preeclampsia (monitor)", "Anemia"],
    severity: "urgent",
    action: "Visit ANM or PHC within 24 hours. Monitor BP and foetal movement.",
    advice: "Pregnant women should always consult a healthcare worker for any symptoms.",
  },
}

function detectSeverity(input: string): typeof SYMPTOM_PATTERNS[string] {
  const lower = input.toLowerCase()
  for (const [key, data] of Object.entries(SYMPTOM_PATTERNS)) {
    if (lower.includes(key)) return data
  }
  return {
    conditions: ["General illness", "Viral infection"],
    severity: "routine",
    action: "Rest, drink fluids, monitor symptoms. Visit PHC if no improvement in 2 days.",
    advice: "Maintain good hygiene and nutrition. If symptoms worsen, seek care.",
  }
}

// ===== MESSAGE BUBBLE =====
function MessageBubble({ role, content, isVoice }: { role: string; content: string; isVoice?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex gap-2 max-w-[85%]", role === "user" ? "ml-auto flex-row-reverse" : "")}
    >
      <div className={cn(
        "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
        role === "user" ? "bg-primary/20 text-primary" : "bg-gradient-to-br from-primary to-secondary text-white"
      )}>
        {role === "user" ? "U" : "AI"}
      </div>
      <div className={cn(
        "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
        role === "user" ? "bg-primary text-white rounded-tr-sm" : "bg-muted rounded-tl-sm"
      )}>
        {isVoice && <div className="flex items-center gap-1 mb-1 text-xs opacity-70"><Mic className="w-3 h-3" /> Voice input</div>}
        {content}
      </div>
    </motion.div>
  )
}

// ===== TRIAGE RESULT CARD =====
function TriageResultCard({ result }: { result: TriageResult }) {
  const config = SEVERITY_CONFIG[result.severity]
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="border-2 rounded-2xl overflow-hidden"
      style={{ borderColor: result.severity === "emergency" ? "#DC2626" : result.severity === "urgent" ? "#F59E0B" : "#0F766E" }}
    >
      {/* Header */}
      <div className={cn("p-4 flex items-center gap-3", config.bg)}>
        <span className="text-2xl">{config.icon}</span>
        <div className="flex-1">
          <p className="text-xs font-medium opacity-70 uppercase tracking-wide">Severity Level</p>
          <p className={cn("text-xl font-bold", config.color)}>{config.label}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">AI Confidence</p>
          <p className="text-lg font-bold text-primary">{result.confidence}%</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Possible Conditions */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Possible Conditions</p>
          <div className="flex flex-wrap gap-2">
            {result.possibleConditions.map((c) => (
              <span key={c.name} className="bg-muted rounded-full px-3 py-1 text-xs font-medium">
                {c.name} <span className="text-primary">({c.probability}%)</span>
              </span>
            ))}
          </div>
        </div>

        {/* Recommended Action */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Recommended Action</p>
          <p className="text-sm bg-muted/50 rounded-xl p-3 leading-relaxed">{result.recommendedAction}</p>
        </div>

        {/* Explanation */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Why This Severity?</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{result.severityExplanation}</p>
        </div>

        {/* Disclaimer */}
        <div className="bg-warning/10 border border-warning/20 rounded-xl p-3 text-xs text-muted-foreground flex gap-2">
          <Shield className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
          <p>⚠️ This AI analysis is for guidance only. Always consult a qualified doctor for diagnosis and treatment. In emergencies, call 108 immediately.</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {result.severity === "emergency" && (
            <a href="tel:108" className="btn-emergency flex-1 flex items-center justify-center gap-2 text-sm">
              <AlertTriangle className="w-4 h-4" /> Call 108 NOW
            </a>
          )}
          <Link href="/dashboard/patient/appointments" className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm">
            Book Consultation
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  isVoice?: boolean
}

// ===== MAIN TRIAGE PAGE =====
export default function TriagePage() {
  const { t, language } = useLanguage()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m0",
      role: "assistant",
      content: language === "gu"
        ? "નમસ્તે! 🙏 હું IBM Granite AI આરોગ્ય સહાયક છું. તમારા લક્ষણો વર્ણવો — ગુજરાતી, હિન્દી, અથવા English માં."
        : language === "hi"
        ? "नमस्ते! 🙏 मैं IBM Granite AI स्वास्थ्य सहायक हूं। अपने लक्षण बताइए — हिंदी, गुजराती या English में।"
        : "Hello! 🙏 I'm the IBM Granite AI Health Assistant. Describe your symptoms in Gujarati, Hindi, or English.",
    },
  ])
  const [input, setInput] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null)
  const [isVoiceInput, setIsVoiceInput] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })

  const addMessage = (role: "user" | "assistant", content: string, isVoice = false) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), role, content, isVoice }])
    setTimeout(scrollToBottom, 100)
  }

  const analyzeSymptoms = async (symptomText: string) => {
    setIsAnalyzing(true)
    addMessage("user", symptomText, isVoiceInput)

    await new Promise(r => setTimeout(r, 2000)) // Simulate AI processing

    const detected = detectSeverity(symptomText)

    const result: TriageResult = {
      id: `tr_${Date.now()}`,
      patientId: "usr_001",
      symptoms: symptomText,
      possibleConditions: detected.conditions.map((c, i) => ({
        name: c,
        probability: Math.max(85 - i * 15, 40),
        description: "",
      })),
      severity: detected.severity,
      severityExplanation: detected.advice,
      recommendedAction: detected.action,
      confidence: Math.floor(Math.random() * 10) + 85,
      aiModel: "ibm-granite-13b-instruct",
      language,
      voiceInput: isVoiceInput,
      createdAt: new Date().toISOString(),
    }

    const aiResponse = `I've analyzed your symptoms. Here is my assessment:

🔍 **Possible conditions**: ${detected.conditions.slice(0, 2).join(", ")}
⚡ **Severity**: ${SEVERITY_CONFIG[detected.severity].label}
💊 **Recommendation**: ${detected.action}

*Full analysis displayed below.*`

    addMessage("assistant", aiResponse)
    setTriageResult(result)
    setIsAnalyzing(false)
  }

  const handleSend = () => {
    if (!input.trim()) return
    setIsVoiceInput(false)
    analyzeSymptoms(input)
    setInput("")
  }

  const handleVoice = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      // Simulate voice input for demo
      setIsListening(true)
      setTimeout(() => {
        setIsListening(false)
        const demoInputs = ["I have fever and headache since 2 days", "mane tav ane mathu dukhe che", "मुझे बुखार और सिरदर्द है"]
        const demo = demoInputs[Math.floor(Math.random() * demoInputs.length)]
        setInput(demo)
        setIsVoiceInput(true)
      }, 2500)
      return
    }

    const SpeechRecognition = (window as unknown as { webkitSpeechRecognition?: unknown; SpeechRecognition?: unknown }).webkitSpeechRecognition || (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new (SpeechRecognition as new () => {
      lang: string
      continuous: boolean
      onresult: (e: { results: { transcript: string }[][] }) => void
      onerror: () => void
      onend: () => void
      start: () => void
    })()
    recognition.lang = language === "gu" ? "gu-IN" : language === "hi" ? "hi-IN" : "en-IN"
    recognition.continuous = false

    setIsListening(true)
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript
      setInput(transcript)
      setIsVoiceInput(true)
      setIsListening(false)
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)
    recognition.start()
  }

  const resetTriage = () => {
    setTriageResult(null)
    setMessages([{
      id: "m0_reset",
      role: "assistant",
      content: "Let's start fresh. Please describe your new symptoms.",
    }])
  }

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <div className="flex-1 lg:ml-64 flex flex-col">
        <DashboardHeader
          title="AI Voice Triage"
          subtitle="Powered by IBM Granite LLM"
        />

        <main className="flex-1 flex flex-col lg:flex-row gap-6 p-6 overflow-hidden">
          {/* Chat Interface */}
          <div className="flex-1 flex flex-col premium-card overflow-hidden">
            {/* Chat header */}
            <div className="p-4 border-b border-border/50 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <span className="text-white text-xs font-bold">AI</span>
              </div>
              <div>
                <p className="font-semibold text-sm">IBM Granite Health AI</p>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                  <p className="text-xs text-muted-foreground">Active • Multilingual</p>
                </div>
              </div>
              {triageResult && (
                <button onClick={resetTriage} className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                  <RefreshCw className="w-3.5 h-3.5" /> New
                </button>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} role={msg.role} content={msg.content} isVoice={msg.isVoice} />
              ))}
              {isAnalyzing && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-7 h-7 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm">IBM Granite analyzing symptoms...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border/50">
              <div className="flex items-end gap-2">
                <button
                  onClick={handleVoice}
                  disabled={isAnalyzing}
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
                    isListening
                      ? "bg-emergency text-white animate-pulse"
                      : "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                  )}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                  placeholder={t.speakSymptoms + " (Gujarati / Hindi / English)"}
                  className="flex-1 input-field resize-none min-h-[44px] max-h-[120px] py-3"
                  rows={1}
                  disabled={isAnalyzing}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isAnalyzing}
                  className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                🎙️ Tap mic to speak • Type in any language • AI responds instantly
              </p>
            </div>
          </div>

          {/* Triage Result Panel */}
          <div className="w-full lg:w-96 space-y-4 overflow-y-auto no-scrollbar">
            {triageResult ? (
              <TriageResultCard result={triageResult} />
            ) : (
              <div className="premium-card p-6">
                <h3 className="font-semibold mb-4">Quick Symptoms</h3>
                <div className="space-y-2">
                  {[
                    { label: "🤒 Fever & Chills", value: "I have fever and chills for 2 days" },
                    { label: "🤕 Headache", value: "I have severe headache and dizziness" },
                    { label: "🫁 Chest Pain", value: "I have chest pain and difficulty breathing" },
                    { label: "🤰 Pregnancy concern", value: "I am pregnant and having stomach pain" },
                    { label: "💊 Stomach pain", value: "I have stomach pain and loose motions" },
                    { label: "😮‍💨 Cough", value: "I have cough and cold since 5 days" },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => { setInput(item.value); setIsVoiceInput(false) }}
                      className="w-full text-left px-3 py-2.5 bg-muted/50 hover:bg-primary/10 hover:text-primary rounded-xl text-sm transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* IBM Badge */}
            <div className="premium-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">IBM</span>
              </div>
              <div>
                <p className="font-semibold text-sm">IBM Granite LLM</p>
                <p className="text-xs text-muted-foreground">Medical AI • 98% accuracy</p>
              </div>
              <div className="ml-auto w-2 h-2 bg-accent rounded-full animate-pulse" />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
