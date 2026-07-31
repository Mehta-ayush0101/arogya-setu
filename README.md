# 🏥 ArogyaSetu Rural AI

<div align="center">

![ArogyaSetu Banner](https://img.shields.io/badge/ArogyaSetu-Rural%20AI%20Healthcare-0F766E?style=for-the-badge&logo=health&logoColor=white)

[![IBM Granite](https://img.shields.io/badge/IBM%20Granite-LLM-054ADA?style=flat&logo=ibm)](https://www.ibm.com/watsonx)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat&logo=postgresql)](https://postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat&logo=docker)](https://docker.com)

### **AI-Powered Healthcare Platform for Rural & Tribal Communities**

*Bringing city-quality healthcare to every village in India — in Gujarati, Hindi, and English*

[Live Demo](https://arogyasetu.health) • [API Docs](#api-documentation) • [Setup Guide](#quick-start) • [IBM Integration](#ibm-cloud-integration)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [IBM Cloud Integration](#ibm-cloud-integration)
- [User Roles](#user-roles)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Demo Accounts](#demo-accounts)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)

---

## 🌟 Overview

**ArogyaSetu Rural AI** is a production-ready, AI-powered healthcare platform designed specifically for rural and tribal communities of India. Built for the IBM Hackathon, it leverages IBM Granite LLM, Watson Speech-to-Text/Text-to-Speech, and IBM Cloud infrastructure to deliver world-class healthcare accessibility.

### 🎯 Problem Solved

- **2.4 billion** people in rural India lack access to quality healthcare
- **85%** of India's rural population is more than 5km from the nearest health facility
- **Language barrier**: Healthcare information not available in Gujarati or tribal dialects
- **Limited awareness**: Patients don't know when a symptom is an emergency

### 💡 Solution

ArogyaSetu bridges this gap with:
- 🎙️ **Voice AI Triage** in Gujarati & Hindi — speak, get instant diagnosis
- 📹 **Teleconsultation** — reach PHC doctors from any village
- 🚨 **Emergency SOS** — one-tap 108 ambulance dispatch with GPS
- 💊 **Medicine Tracking** — ASHA workers manage stock with barcode scanning
- 📊 **District Analytics** — health officers monitor 120+ villages in real-time

---

## ✨ Features

### For Patients
| Feature | Description |
|---------|-------------|
| 🎙️ Voice AI Triage | Speak symptoms in Gujarati/Hindi → IBM Granite AI → Instant severity classification |
| 📅 Teleconsult | Book video appointments with PHC doctors |
| 💊 Medicine Reminders | Daily notifications for prescription adherence |
| 📊 Health Dashboard | Health score, vitals charts, complete timeline |
| 🏥 Emergency SOS | GPS-enabled 108 dispatch in one tap |
| 💬 AI Chat | IBM Granite health assistant (24/7) |

### For ASHA Workers
| Feature | Description |
|---------|-------------|
| 🏠 Home Visit Planning | AI-sorted daily visit schedule by priority |
| 📦 Medicine Inventory | QR/barcode scanning + low stock alerts |
| 👶 Pregnancy Tracking | ANC visit scheduling and monitoring |
| 💉 Vaccination Management | Child vaccination tracking |
| 🗺️ Village Map | Patient locations with navigation |

### For PHC Doctors
| Feature | Description |
|---------|-------------|
| 📋 Appointment Queue | Real-time patient queue with AI triage |
| 📹 Video Teleconsult | Integrated video consultation |
| 💊 Digital Prescriptions | QR-coded prescriptions |
| 📈 Patient Analytics | Health trend monitoring |

### For District Health Officers
| Feature | Description |
|---------|-------------|
| 📊 District Dashboard | Real-time health analytics across all PHCs |
| 🦠 Disease Surveillance | Early outbreak detection |
| 💊 Supply Chain | District-wide medicine logistics |
| 🤖 AI Usage Reports | IBM API usage statistics |

---

## 🛠️ Tech Stack

### Frontend
```
Next.js 15 (App Router)    React 19              TypeScript 5.3
Tailwind CSS 3.4           Framer Motion 11      Shadcn UI / Radix
Lucide Icons               React Hook Form       Zod
Recharts                   Leaflet Maps          next-themes
Zustand                    Sonner (toasts)       i18next
```

### Backend
```
Node.js 20                 Express.js 4.18       TypeScript 5.3
Prisma ORM 5.7             PostgreSQL 16         Redis 7
JWT Authentication         bcryptjs              Zod
Winston Logger             Morgan                Helmet
```

### IBM Cloud
```
IBM Granite 13B (LLM)      IBM Watson STT        IBM Watson TTS
IBM Cloud Object Storage   IBM Cloud Functions   IBM Cloud Kubernetes
```

### DevOps
```
Docker                     Docker Compose        GitHub Actions CI/CD
Vercel (Frontend)          IBM Cloud (Backend)   Nginx
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    ArogyaSetu Architecture                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐  │
│  │   Next.js    │───▶│  Express.js  │───▶│   PostgreSQL     │  │
│  │  Frontend    │    │  Backend API │    │   (Prisma ORM)   │  │
│  │  (Vercel)    │    │ (IBM Cloud)  │    │                  │  │
│  └──────────────┘    └──────────────┘    └──────────────────┘  │
│         │                    │                                   │
│         │             ┌──────────────┐                          │
│         │             │  IBM Cloud   │                          │
│         │             ├──────────────┤                          │
│         │             │ Granite LLM  │ ← AI Triage              │
│         │             │ Watson STT   │ ← Voice Input            │
│         │             │ Watson TTS   │ ← Audio Response         │
│         │             │ COS Storage  │ ← File Storage           │
│         │             └──────────────┘                          │
│         │                                                        │
│  ┌──────────────┐    ┌──────────────┐                          │
│  │  PWA/Offline │    │   Redis      │ ← Session/Cache          │
│  │  IndexedDB   │    │   Queue      │ ← Background Jobs        │
│  └──────────────┘    └──────────────┘                          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Folder Structure

```
arogya-setu/
├── frontend/                    # Next.js 15 Frontend
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   │   ├── page.tsx        # Landing page
│   │   │   ├── auth/           # Login, Register
│   │   │   ├── dashboard/
│   │   │   │   ├── patient/    # Patient dashboard + features
│   │   │   │   ├── doctor/     # Doctor dashboard
│   │   │   │   ├── asha/       # ASHA worker dashboard
│   │   │   │   └── admin/      # Admin dashboard
│   │   │   └── emergency/      # Emergency SOS page
│   │   ├── components/
│   │   │   └── layout/         # Navbar, Sidebar, Header
│   │   ├── contexts/           # Auth, Language contexts
│   │   ├── lib/                # Utilities, helpers
│   │   └── types/              # TypeScript type definitions
│   ├── public/                 # Static assets
│   ├── tailwind.config.js
│   ├── next.config.js
│   └── Dockerfile
│
├── backend/                     # Express.js Backend
│   ├── src/
│   │   ├── index.ts            # App entry point
│   │   ├── routes/             # API route handlers
│   │   │   ├── auth.ts         # Authentication
│   │   │   ├── triage.ts       # AI Triage + IBM routes
│   │   │   ├── appointments.ts # Appointments, patients, doctors
│   │   │   └── medicines.ts    # Medicines, emergency, notifications
│   │   ├── services/
│   │   │   └── ibmWatson.ts    # IBM Granite, STT, TTS, COS
│   │   ├── middleware/
│   │   │   ├── auth.ts         # JWT authentication
│   │   │   └── errorHandler.ts # Global error handler
│   │   ├── utils/
│   │   │   ├── auth.ts         # Password hashing, JWT
│   │   │   └── logger.ts       # Winston logger
│   │   └── config/
│   │       └── database.ts     # Prisma client
│   ├── prisma/
│   │   ├── schema.prisma       # Complete DB schema (20 models)
│   │   └── seed.ts             # Sample data seeder
│   └── Dockerfile
│
├── docker-compose.yml           # Full stack Docker setup
├── .github/
│   └── workflows/
│       └── ci-cd.yml           # CI/CD Pipeline
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose (recommended)
- PostgreSQL 16 (if running without Docker)
- IBM Cloud account (for AI features)

### Option 1: Docker (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/your-org/arogya-setu.git
cd arogya-setu

# 2. Configure environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
# Edit .env files with your credentials

# 3. Start everything
docker-compose up -d

# 4. Run migrations and seed data
docker-compose exec backend npx prisma migrate dev
docker-compose exec backend npm run prisma:seed

# 5. Open browser
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# Health: http://localhost:5000/health
```

### Option 2: Local Development

```bash
# Terminal 1 — Backend
cd arogya-setu/backend
npm install
cp .env.example .env  # Configure environment
npx prisma migrate dev
npx prisma db seed
npm run dev
# Runs on http://localhost:5000

# Terminal 2 — Frontend
cd arogya-setu/frontend
npm install
cp .env.example .env.local
npm run dev
# Runs on http://localhost:3000
```

---

## 🤖 IBM Cloud Integration

### IBM Granite LLM (Watsonx)

```typescript
// Automatic fallback to rule-based system if not configured
const aiResult = await watsonxService.analyzeSymptoms({
  symptoms: "mane tav ane mathama dard che",  // Gujarati input
  language: "gu",
  patientContext: { age: 35, chronicConditions: ["diabetes"] }
})
// Returns: { conditions, severity, recommendation, confidence }
```

**Setup:**
1. Create IBM Cloud account at [cloud.ibm.com](https://cloud.ibm.com)
2. Provision IBM Watsonx service
3. Create project and note Project ID
4. Generate API key
5. Add to `backend/.env`

### IBM Watson Speech-to-Text

Supports: `gu-IN` (Gujarati), `hi-IN` (Hindi), `en-IN` (English)

```env
IBM_STT_API_KEY=your_key
IBM_STT_URL=https://api.us-south.speech-to-text.watson.cloud.ibm.com
```

### IBM Watson Text-to-Speech

Converts AI responses to audio for illiterate patients.

```env
IBM_TTS_API_KEY=your_key
IBM_TTS_URL=https://api.us-south.text-to-speech.watson.cloud.ibm.com
```

### IBM Cloud Object Storage

Patient documents, prescriptions, voice recordings.

```env
IBM_COS_API_KEY=your_key
IBM_COS_ENDPOINT=s3.us-south.cloud-object-storage.appdomain.cloud
IBM_COS_BUCKET=arogya-setu-files
```

> 📝 **Note**: All IBM services gracefully fall back to mock/demo mode when credentials are not configured. This enables development and demo without IBM account.

---

## 👥 User Roles

| Role | Demo Email | Demo Password | Dashboard |
|------|-----------|----------------|-----------|
| Patient | `patient@demo.com` | `demo123` | `/dashboard/patient` |
| PHC Doctor | `doctor@demo.com` | `demo123` | `/dashboard/doctor` |
| ASHA Worker | `asha@demo.com` | `demo123` | `/dashboard/asha` |
| Admin/Officer | `admin@demo.com` | `demo123` | `/dashboard/admin` |

---

## 📡 API Documentation

### Authentication
```
POST /api/auth/register  — Register new user
POST /api/auth/login     — Login, get JWT token
POST /api/auth/refresh   — Refresh access token
GET  /api/auth/me        — Get current user profile
```

### AI Triage
```
POST /api/triage/analyze     — Analyze symptoms with IBM Granite
GET  /api/triage/history/:id — Get patient triage history
```

### IBM Watson
```
POST /api/ibm/stt      — Speech to Text (audio → transcript)
POST /api/ibm/tts      — Text to Speech (text → audio)
GET  /api/ibm/status   — IBM services status
```

### Appointments
```
GET    /api/appointments     — List appointments (role-aware)
POST   /api/appointments     — Book appointment
PATCH  /api/appointments/:id/status — Update status
```

### Medicines
```
GET   /api/medicines          — List medicines
GET   /api/medicines/stock    — Medicine stock by PHC
PATCH /api/medicines/stock/:id — Update stock quantity
POST  /api/medicines/request  — Request medicine restock
```

### Emergency
```
POST  /api/emergency          — Create SOS request
PATCH /api/emergency/:id/resolve — Resolve emergency
```

### Analytics
```
GET /api/analytics/district   — District health analytics (Admin/DHO)
```

---

## 🗄️ Database Schema

20 PostgreSQL models via Prisma ORM:

```
users → patients, doctors, asha_workers
patients → vitals, appointments, triage_results, health_records
        → follow_ups, emergency_requests, pregnancy_records
        → vaccination_records
doctors → appointments, prescriptions
asha_workers → villages, follow_ups
phcs → doctors, appointments, medicine_stocks, medicine_requests
villages → phc, asha_workers
appointments → triage_results, prescriptions
medicines → medicine_stocks, medicine_requests
ai_conversations → conversation_messages
voice_logs, audit_logs, system_settings, notifications
```

---

## 🌍 Multilingual Support

| Language | Code | Coverage |
|----------|------|---------|
| English | `en` | 100% |
| Hindi | `hi` | 100% |
| Gujarati | `gu` | 100% |
| Bhili (planned) | `bhi` | Coming soon |
| Vasavi (planned) | `vas` | Coming soon |

---

## 🚢 Deployment

### IBM Cloud (Production)

```bash
# Deploy backend to IBM Cloud Code Engine
ibmcloud login
ibmcloud target -r us-south -g Default
ibmcloud ce project create --name arogya-setu
ibmcloud ce application create \
  --name arogya-backend \
  --image ghcr.io/your-org/arogya-setu-backend:latest \
  --port 5000 \
  --env-from-secret arogya-secrets

# Deploy frontend to Vercel
cd frontend && npx vercel --prod
```

### Environment Variables for Production

See [`backend/.env.example`](backend/.env.example) and [`frontend/.env.example`](frontend/.env.example)

---

## 🔒 Security

- ✅ JWT with short expiry + refresh tokens
- ✅ Role-based access control (5 roles)
- ✅ bcrypt password hashing (12 rounds)
- ✅ Rate limiting (200 req/15min general, 10 auth, 30 AI)
- ✅ Helmet.js security headers
- ✅ Input validation with Zod
- ✅ SQL injection prevention (Prisma)
- ✅ Audit logs for all critical actions
- ✅ HTTPS enforced in production

---

## ♿ Accessibility

- ✅ WCAG 2.1 AA compliant
- ✅ Large buttons (min 44px touch target)
- ✅ High contrast text ratios
- ✅ Screen reader support (ARIA labels)
- ✅ Keyboard navigation
- ✅ Reduced motion support
- ✅ Voice navigation
- ✅ Simple, uncluttered layouts for elderly users

---

## 📱 PWA Support

ArogyaSetu is a Progressive Web App:
- Install on home screen (Android/iOS)
- Offline mode with background sync
- Push notifications
- Fast loading with caching

---

## 🧪 Testing

```bash
# Frontend
cd frontend
npm run type-check    # TypeScript validation
npm run lint          # ESLint

# Backend
cd backend
npm run build         # TypeScript compile check
npx prisma validate   # Schema validation
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'feat: add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📄 License

MIT License — Free for use in healthcare projects.

---

## 🙏 Acknowledgments

- **IBM Cloud** — Granite LLM, Watson APIs, Cloud infrastructure
- **Government of India** — NHP digital health guidelines
- **ASHA Workers** — Inspiration and user research
- **PHC Doctors** — Feature requirements and testing

---

<div align="center">

**Built with ❤️ for Rural India**

*ArogyaSetu — Connecting villages to health, one byte at a time*

[![Made with IBM](https://img.shields.io/badge/Powered%20by-IBM%20Cloud-054ADA?style=flat&logo=ibm)](https://cloud.ibm.com)

</div>
