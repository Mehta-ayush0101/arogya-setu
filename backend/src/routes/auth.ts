import { Router, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../config/database'
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken, sanitizeUser } from '../utils/auth'
import { logger } from '../utils/logger'

export const authRouter = Router()

const RegisterSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(8),
  role: z.enum(['PATIENT', 'ASHA_WORKER', 'PHC_DOCTOR', 'DISTRICT_OFFICER', 'ADMIN']),
  village: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  language: z.enum(['EN', 'HI', 'GU']).optional(),
})

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  role: z.string().optional(),
})

// ===== REGISTER =====
authRouter.post('/register', async (req, res: Response) => {
  try {
    const data = RegisterSchema.parse(req.body)

    // Check if user exists
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: data.email }, { phone: data.phone }] }
    })
    if (existing) {
      res.status(400).json({ success: false, error: 'User with this email or phone already exists' })
      return
    }

    const hashedPassword = await hashPassword(data.password)
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        role: data.role,
        language: data.language || 'GU',
        isVerified: false,
      },
    })

    // Create role-specific profile
    if (data.role === 'PATIENT') {
      await prisma.patient.create({
        data: {
          userId: user.id,
          age: 0,
          gender: 'other',
          village: data.village,
          district: data.district,
          state: data.state || 'Gujarat',
        },
      })
    }

    const accessToken = generateAccessToken({ userId: user.id, role: user.role })
    const refreshToken = generateRefreshToken(user.id)

    logger.info(`New user registered: ${user.email} (${user.role})`)

    res.status(201).json({
      success: true,
      data: {
        user: sanitizeUser(user as unknown as Record<string, unknown>),
        token: accessToken,
        refreshToken,
      },
      message: 'Registration successful! Welcome to ArogyaSetu.',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: 'Validation failed', details: error.errors })
      return
    }
    logger.error('Registration error', { error })
    res.status(500).json({ success: false, error: 'Registration failed. Please try again.' })
  }
})

// ===== LOGIN =====
authRouter.post('/login', async (req, res: Response) => {
  try {
    const { email, password } = LoginSchema.parse(req.body)

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        patient: { select: { id: true, age: true, gender: true, district: true, village: true } },
        doctor: { select: { id: true, specialty: true, phcId: true } },
        ashaWorker: { select: { id: true, district: true } },
      },
    })

    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid email or password' })
      return
    }

    if (!user.isActive) {
      res.status(401).json({ success: false, error: 'Your account has been deactivated. Contact admin.' })
      return
    }

    const isValidPassword = await comparePassword(password, user.password)
    if (!isValidPassword) {
      res.status(401).json({ success: false, error: 'Invalid email or password' })
      return
    }

    const accessToken = generateAccessToken({ userId: user.id, role: user.role })
    const refreshToken = generateRefreshToken(user.id)

    logger.info(`User logged in: ${user.email}`)

    res.json({
      success: true,
      data: {
        user: sanitizeUser(user as unknown as Record<string, unknown>),
        token: accessToken,
        refreshToken,
      },
      message: 'Login successful',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: 'Invalid input' })
      return
    }
    logger.error('Login error', { error })
    res.status(500).json({ success: false, error: 'Login failed' })
  }
})

// ===== GET PROFILE =====
authRouter.get('/me', async (req, res: Response) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ success: false, error: 'No token provided' })
      return
    }
    const { verifyAccessToken } = require('../utils/auth')
    const token = authHeader.substring(7)
    const decoded = verifyAccessToken(token)

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        patient: true,
        doctor: true,
        ashaWorker: true,
      },
    })

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' })
      return
    }

    res.json({
      success: true,
      data: sanitizeUser(user as unknown as Record<string, unknown>),
    })
  } catch {
    res.status(401).json({ success: false, error: 'Invalid token' })
  }
})

// ===== REFRESH TOKEN =====
authRouter.post('/refresh', async (req, res: Response) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      res.status(401).json({ success: false, error: 'Refresh token required' })
      return
    }
    const { verifyRefreshToken } = require('../utils/auth')
    const decoded = verifyRefreshToken(refreshToken)
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } })
    if (!user) {
      res.status(401).json({ success: false, error: 'User not found' })
      return
    }
    const newToken = generateAccessToken({ userId: user.id, role: user.role })
    res.json({ success: true, data: { token: newToken } })
  } catch {
    res.status(401).json({ success: false, error: 'Invalid refresh token' })
  }
})
