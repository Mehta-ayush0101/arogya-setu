"use client"

import React, { createContext, useContext, useState } from "react"

type Language = "en" | "hi" | "gu"

interface Translations {
  // Navigation
  home: string
  dashboard: string
  appointments: string
  medicines: string
  emergency: string
  profile: string
  settings: string
  logout: string
  // Common
  loading: string
  save: string
  cancel: string
  submit: string
  search: string
  filter: string
  viewAll: string
  noData: string
  // Health
  healthScore: string
  vitals: string
  bloodPressure: string
  heartRate: string
  temperature: string
  bloodSugar: string
  weight: string
  // Appointments
  bookAppointment: string
  teleconsult: string
  scheduleVisit: string
  // AI Triage
  voiceTriage: string
  speakSymptoms: string
  typeSymptoms: string
  analyzing: string
  triageResult: string
  severity: string
  // Severity labels
  urgent: string
  routine: string
  selfCare: string
  // Medicine
  inventory: string
  lowStock: string
  expiring: string
  requestMedicine: string
  // SOS
  sos: string
  callAmbulance: string
  nearestPHC: string
  shareLocation: string
  // Hero
  heroTitle: string
  heroSubtitle: string
  heroDesc: string
  getStarted: string
  learnMore: string
  // Greeting
  goodMorning: string
  goodAfternoon: string
  goodEvening: string
  // Stats
  patientsServed: string
  villagesCovered: string
  doctorsOnboard: string
  successRate: string
}

const translations: Record<Language, Translations> = {
  en: {
    home: "Home",
    dashboard: "Dashboard",
    appointments: "Appointments",
    medicines: "Medicines",
    emergency: "Emergency",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    submit: "Submit",
    search: "Search",
    filter: "Filter",
    viewAll: "View All",
    noData: "No data available",
    healthScore: "Health Score",
    vitals: "Vitals",
    bloodPressure: "Blood Pressure",
    heartRate: "Heart Rate",
    temperature: "Temperature",
    bloodSugar: "Blood Sugar",
    weight: "Weight",
    bookAppointment: "Book Appointment",
    teleconsult: "Teleconsult",
    scheduleVisit: "Schedule Visit",
    voiceTriage: "Voice AI Triage",
    speakSymptoms: "Speak Your Symptoms",
    typeSymptoms: "Type Your Symptoms",
    analyzing: "AI is analyzing...",
    triageResult: "Triage Result",
    severity: "Severity",
    urgent: "Urgent",
    routine: "Routine",
    selfCare: "Self Care",
    inventory: "Inventory",
    lowStock: "Low Stock",
    expiring: "Expiring Soon",
    requestMedicine: "Request Medicine",
    sos: "SOS Emergency",
    callAmbulance: "Call Ambulance",
    nearestPHC: "Nearest PHC",
    shareLocation: "Share Location",
    heroTitle: "Healthcare at Your Doorstep",
    heroSubtitle: "ArogyaSetu Rural AI",
    heroDesc: "AI-powered healthcare for rural and tribal communities. Get instant diagnosis, book consultations, and access medical help — in your language.",
    getStarted: "Get Started",
    learnMore: "Learn More",
    goodMorning: "Good Morning",
    goodAfternoon: "Good Afternoon",
    goodEvening: "Good Evening",
    patientsServed: "Patients Served",
    villagesCovered: "Villages Covered",
    doctorsOnboard: "Doctors Onboard",
    successRate: "Success Rate",
  },
  hi: {
    home: "होम",
    dashboard: "डैशबोर्ड",
    appointments: "अपॉइंटमेंट",
    medicines: "दवाइयाँ",
    emergency: "आपातकाल",
    profile: "प्रोफ़ाइल",
    settings: "सेटिंग्स",
    logout: "लॉगआउट",
    loading: "लोड हो रहा है...",
    save: "सहेजें",
    cancel: "रद्द करें",
    submit: "जमा करें",
    search: "खोजें",
    filter: "फ़िल्टर",
    viewAll: "सभी देखें",
    noData: "कोई डेटा उपलब्ध नहीं",
    healthScore: "स्वास्थ्य स्कोर",
    vitals: "महत्वपूर्ण संकेत",
    bloodPressure: "रक्तचाप",
    heartRate: "हृदय गति",
    temperature: "तापमान",
    bloodSugar: "रक्त शर्करा",
    weight: "वजन",
    bookAppointment: "अपॉइंटमेंट बुक करें",
    teleconsult: "टेलीकंसल्ट",
    scheduleVisit: "विजिट शेड्यूल करें",
    voiceTriage: "आवाज़ AI ट्राइएज",
    speakSymptoms: "अपने लक्षण बोलें",
    typeSymptoms: "अपने लक्षण टाइप करें",
    analyzing: "AI विश्लेषण कर रहा है...",
    triageResult: "ट्राइएज परिणाम",
    severity: "गंभीरता",
    urgent: "अत्यावश्यक",
    routine: "साधारण",
    selfCare: "स्वयं देखभाल",
    inventory: "इन्वेंटरी",
    lowStock: "कम स्टॉक",
    expiring: "जल्द समाप्त",
    requestMedicine: "दवाई मांगें",
    sos: "SOS आपातकाल",
    callAmbulance: "एम्बुलेंस बुलाएं",
    nearestPHC: "निकटतम PHC",
    shareLocation: "स्थान साझा करें",
    heroTitle: "स्वास्थ्य सेवा आपके द्वार",
    heroSubtitle: "आरोग्यसेतु रूरल AI",
    heroDesc: "ग्रामीण और जनजातीय समुदायों के लिए AI-संचालित स्वास्थ्य सेवा। तत्काल निदान प्राप्त करें, परामर्श बुक करें — अपनी भाषा में।",
    getStarted: "शुरू करें",
    learnMore: "अधिक जानें",
    goodMorning: "शुभ प्रभात",
    goodAfternoon: "शुभ दोपहर",
    goodEvening: "शुभ संध्या",
    patientsServed: "मरीज़ सेवित",
    villagesCovered: "गाँव कवर",
    doctorsOnboard: "डॉक्टर",
    successRate: "सफलता दर",
  },
  gu: {
    home: "ઘર",
    dashboard: "ડૅશબૉર્ડ",
    appointments: "અપૉઇન્ટમેન્ટ",
    medicines: "દવાઓ",
    emergency: "ઇમર્જન્સી",
    profile: "પ્રોફ઼ાઇલ",
    settings: "સેટિંગ્સ",
    logout: "લૉગ આઉટ",
    loading: "લોડ થઈ રહ્યું છે...",
    save: "સાચવો",
    cancel: "રદ કરો",
    submit: "સબ્મિટ કરો",
    search: "શોધો",
    filter: "ફ઼િલ્ટર",
    viewAll: "બધું જુઓ",
    noData: "કોઈ ડેટા ઉપલબ્ધ નથી",
    healthScore: "આરોગ્ય સ્કોર",
    vitals: "વાઇટલ્સ",
    bloodPressure: "લોહીનું દબાણ",
    heartRate: "હૃદય ગતિ",
    temperature: "તાપમાન",
    bloodSugar: "રક્ત શર્કરા",
    weight: "વજન",
    bookAppointment: "અપૉઇન્ટમેન્ટ બૂક કરો",
    teleconsult: "ટેલીકૉન્સલ્ટ",
    scheduleVisit: "મુલાકાત નક્કી કરો",
    voiceTriage: "અવાજ AI ટ્રાઇએજ",
    speakSymptoms: "તમારા લક્ષણો બોલો",
    typeSymptoms: "તમારા લક્ષણો ટાઇપ કરો",
    analyzing: "AI વિશ્લેષણ કરી રહ્યું છે...",
    triageResult: "ટ્રાઇએજ પરિણામ",
    severity: "ગંભીરતા",
    urgent: "તાત્કાલિક",
    routine: "સામાન્ય",
    selfCare: "સ્વ-સંભાળ",
    inventory: "ઇન્વેન્ટરી",
    lowStock: "ઓછો સ્ટૉક",
    expiring: "જલ્દી સમાપ્ત",
    requestMedicine: "દવા માગો",
    sos: "SOS ઇમર્જન્સી",
    callAmbulance: "એમ્બ્યુલન્સ બોલાવો",
    nearestPHC: "નજીકની PHC",
    shareLocation: "સ્થાન શૅર કરો",
    heroTitle: "આરોગ્ય સેવા તમારા દ્વારે",
    heroSubtitle: "આરોગ્યસેતુ રૂરલ AI",
    heroDesc: "ગ્રામ્ય અને આદિજાતિ સમુદાયો માટે AI-સંચાલિત આરોગ્ય સેવા. ત્વરિત નિદાન મેળવો, પરામર્શ બૂક કરો — તમારી ભાષામાં.",
    getStarted: "શરૂ કરો",
    learnMore: "વધુ જાણો",
    goodMorning: "સુપ્રભાત",
    goodAfternoon: "શુભ બપોર",
    goodEvening: "શુભ સાંજ",
    patientsServed: "દર્દીઓ સેવિત",
    villagesCovered: "ગામ આવ્ (",
    doctorsOnboard: "ડૉક્ટર",
    successRate: "સફળ દર",
  },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("arogya_lang", lang)
    document.documentElement.lang = lang
  }

  React.useEffect(() => {
    const stored = localStorage.getItem("arogya_lang") as Language
    if (stored && ["en", "hi", "gu"].includes(stored)) {
      setLanguageState(stored)
      document.documentElement.lang = stored
    }
  }, [])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider")
  return ctx
}
