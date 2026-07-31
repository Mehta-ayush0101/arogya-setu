import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { logger } from './utils/logger'
import { errorHandler } from './middleware/errorHandler'
import { authRouter } from './routes/auth'
import { appointmentsRouter, patientsRouter, doctorsRouter, phcRouter, usersRouter } from './routes/appointments'
import { triageRouter, ibmRouter } from './routes/triage'
import { medicinesRouter, emergencyRouter, notificationsRouter, analyticsRouter } from './routes/medicines'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// ===== MIDDLEWARE =====
app.use(helmet({
  contentSecurityPolicy: false, // Configured separately for flexibility
}))

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}))

app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(morgan('combined', {
  stream: { write: (message) => logger.info(message.trim()) }
}))

// ===== RATE LIMITING =====
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts, please try again in 15 minutes.' },
})

const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30,
  message: { error: 'AI query rate limit exceeded. Please wait a moment.' },
})

app.use('/api', generalLimiter)
app.use('/api/auth', authLimiter)
app.use('/api/triage', aiLimiter)
app.use('/api/ibm', aiLimiter)

// ===== HEALTH CHECK =====
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'ArogyaSetu Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  })
})

app.get('/', (req, res) => {
  res.json({
    message: 'ArogyaSetu Rural AI — Backend API',
    version: '1.0.0',
    docs: '/api/docs',
    health: '/health',
  })
})

// ===== API ROUTES =====
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/patients', patientsRouter)
app.use('/api/doctors', doctorsRouter)
app.use('/api/appointments', appointmentsRouter)
app.use('/api/triage', triageRouter)
app.use('/api/medicines', medicinesRouter)
app.use('/api/emergency', emergencyRouter)
app.use('/api/notifications', notificationsRouter)
app.use('/api/analytics', analyticsRouter)
app.use('/api/phc', phcRouter)
app.use('/api/ibm', ibmRouter)

// ===== 404 HANDLER =====
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
    message: 'Please check the API documentation',
  })
})

// ===== ERROR HANDLER =====
app.use(errorHandler)

// ===== START SERVER =====
app.listen(PORT, () => {
  logger.info(`🚀 ArogyaSetu Backend running on port ${PORT}`)
  logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
  logger.info(`🤖 IBM Watson: ${process.env.IBM_WATSON_STT_URL ? 'Configured' : 'Not configured (using mock)'}`)
})

export default app
