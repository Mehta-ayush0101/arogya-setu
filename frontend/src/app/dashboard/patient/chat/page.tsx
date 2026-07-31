"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { DashboardSidebar, DashboardHeader } from "@/components/layout/DashboardLayout"
import { MessageSquare, Mic, MicOff, Send, Volume2, Loader2, RefreshCw, Info } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { useAuth } from "@/contexts/AuthContext"
import { cn } from "@/lib/utils"

interface Message { id: string; role: "user" | "assistant"; content: string; timestamp: string }

const QUICK_PROMPTS = [
  "What foods are good for diabetes?",
  "How to control high BP naturally?",
  "Pregnancy nutrition tips",
  "Malaria prevention in rainy season",
  "Child vaccination schedule",
  "How to take ORS properly?",
  "Signs of anemia",
  "When to go to hospital immediately?",
]

const AI_RESPONSES: Record<string, string> = {
  diabetes: "🥗 Good foods for diabetes:\n• Green leafy vegetables (spinach, methi)\n• High-fiber foods (oats, dalia)\n• Bitter gourd (karela)\n• Avoid: sugar, white rice in large amounts, fried foods\n• Eat small meals 5-6 times daily\n\n⚠️ Always consult your doctor for a proper diet plan.",
  "high bp": "💚 Natural ways to control BP:\n• Reduce salt intake\n• Regular walking (30 min/day)\n• Avoid stress\n• Eat potassium-rich foods (banana, coconut water)\n• Quit smoking if applicable\n• Take prescribed medicines regularly\n\n⚠️ Never stop BP medicines without doctor's advice.",
  pregnancy: "🤰 Pregnancy nutrition:\n• Iron-rich foods: green leafy vegetables, jaggery (gur)\n• Calcium: milk, curd, ragi\n• Take Iron-Folic Acid tablets daily\n• Drink 8-10 glasses of water\n• Avoid raw/undercooked food\n\n📅 Visit ANM every month for checkup.",
  malaria: "🦟 Malaria prevention:\n• Use mosquito nets (especially for children & pregnant women)\n• Wear full-sleeve clothes\n• Remove stagnant water near home\n• Use mosquito repellent\n• Early symptoms: fever, chills, headache\n\n🏥 If fever with chills, visit PHC for blood test.",
  vaccination: "💉 Child vaccination schedule (India):\n• Birth: BCG, OPV-0, Hep-B\n• 6 weeks: OPV-1, DPT-1, Hep-B\n• 10 weeks: OPV-2, DPT-2\n• 14 weeks: OPV-3, DPT-3\n• 9 months: Measles, Vitamin A\n\n🏥 Contact your local ASHA worker for free vaccination.",
}

function getAIResponse(input: string): string {
  const lower = input.toLowerCase()
  for (const [key, response] of Object.entries(AI_RESPONSES)) {
    if (lower.includes(key)) return response
  }
  return `Thank you for your question. Based on your query about "${input}", here is general guidance:\n\n• This is important health information.\n• Please consult your local ASHA worker or PHC doctor for personalized advice.\n• For emergencies, call 108 immediately.\n\n⚕️ Powered by IBM Granite LLM — for guidance only, not a substitute for medical advice.`
}

export default function AIChatPage() {
  const { user } = useAuth()
  const { language, t } = useLanguage()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "assistant",
      content: `Hello ${user?.name?.split(" ")[0] || "there"}! 👋\n\nI'm your IBM Granite AI Health Assistant. I can help you with:\n• Health questions in Gujarati, Hindi, English\n• Symptom guidance\n• Medicine reminders\n• Nutrition advice\n• Disease prevention\n\nWhat would you like to know today?`,
      timestamp: new Date().toISOString(),
    }
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const sendMessage = async (text: string) => {
    if (!text.trim()) return
    const userMsg: Message = { id: `u_${Date.now()}`, role: "user", content: text, timestamp: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setIsTyping(true)
    await new Promise(r => setTimeout(r, 1200))
    const response = getAIResponse(text)
    const aiMsg: Message = { id: `a_${Date.now()}`, role: "assistant", content: response, timestamp: new Date().toISOString() }
    setMessages(prev => [...prev, aiMsg])
    setIsTyping(false)
  }

  const handleVoice = () => {
    setIsListening(true)
    setTimeout(() => {
      setIsListening(false)
      const demos = ["What are symptoms of malaria?", "diabetes diet chart", "baby vaccination schedule"]
      setInput(demos[Math.floor(Math.random() * demos.length)])
    }, 2000)
  }

  const speakText = (text: string) => {
    if (!window.speechSynthesis) return
    const utter = new SpeechSynthesisUtterance(text.replace(/[*•🏥💉🤰🦟🥗💚⚕️⚠️📅]/g, ""))
    utter.lang = language === "gu" ? "hi-IN" : language === "hi" ? "hi-IN" : "en-IN"
    window.speechSynthesis.speak(utter)
  }

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <div className="flex-1 lg:ml-64 flex flex-col">
        <DashboardHeader title="AI Health Chat" subtitle="Powered by IBM Granite LLM" />
        <main className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden">

          {/* Chat */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex gap-2 max-w-[90%]", msg.role === "user" ? "ml-auto flex-row-reverse" : "")}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                    msg.role === "user" ? "bg-primary/20 text-primary" : "bg-gradient-to-br from-primary to-secondary text-white"
                  )}>
                    {msg.role === "user" ? (user?.name?.[0] || "U") : "AI"}
                  </div>
                  <div className={cn(
                    "rounded-2xl px-4 py-3 text-sm leading-relaxed relative group",
                    msg.role === "user" ? "bg-primary text-white rounded-tr-sm" : "bg-muted rounded-tl-sm"
                  )}>
                    <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
                    {msg.role === "assistant" && (
                      <button
                        onClick={() => speakText(msg.content)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-primary/10 transition-all"
                        title="Listen (Text-to-Speech)"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-primary" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xs font-bold">AI</div>
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                        className="w-2 h-2 bg-primary/60 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border/50 p-4">
              <div className="flex items-end gap-2">
                <button
                  onClick={handleVoice}
                  className={cn(
                    "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
                    isListening ? "bg-emergency text-white animate-pulse" : "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                  )}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }}
                  placeholder="Ask any health question... (Gujarati / Hindi / English)"
                  className="flex-1 input-field resize-none py-3 min-h-[44px] max-h-[120px]"
                  rows={1}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isTyping}
                  className="w-11 h-11 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 transition-all flex-shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-1.5 mt-2 px-1">
                <Info className="w-3 h-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">AI guidance only — always consult a doctor for diagnosis</p>
              </div>
            </div>
          </div>

          {/* Quick Prompts Sidebar */}
          <div className="w-full lg:w-64 border-t lg:border-t-0 lg:border-l border-border/50 p-4 overflow-y-auto no-scrollbar">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Quick Questions</p>
            <div className="space-y-2">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="w-full text-left px-3 py-2 text-sm bg-muted/50 hover:bg-primary/10 hover:text-primary rounded-xl transition-colors leading-snug"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* IBM badge */}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-[9px] font-bold">IBM</span>
                </div>
                <span className="text-xs font-semibold">IBM Granite LLM</span>
              </div>
              <p className="text-xs text-muted-foreground">Medical AI • Multilingual • Voice enabled</p>
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}
