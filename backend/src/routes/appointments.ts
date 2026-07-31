import { Router, Response } from 'express'
import { authenticate, requireRole, AuthenticatedRequest } from '../middleware/auth'
import { prisma } from '../config/database'
import { logger } from '../utils/logger'
import { z } from 'zod'

export const appointmentsRouter = Router()

const AppointmentSchema = z.object({
  doctorId: z.string(),
  phcId: z.string(),
  date: z.string(),
  time: z.string(),
  type: z.enum(['IN_PERSON', 'TELECONSULT', 'HOME_VISIT']).default('TELECONSULT'),
  symptoms: z.string().optional(),
  notes: z.string().optional(),
  triageResultId: z.string().optional(),
})

// Get appointments (role-aware)
appointmentsRouter.get('/', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, status, type } = req.query
    const where: Record<string, unknown> = {}

    if (req.user?.role === 'PATIENT') {
      const patient = await prisma.patient.findFirst({ where: { userId: req.user.userId } })
      if (patient) where.patientId = patient.id
    } else if (req.user?.role === 'PHC_DOCTOR') {
      const doctor = await prisma.doctor.findFirst({ where: { userId: req.user.userId } })
      if (doctor) where.doctorId = doctor.id
    }

    if (status) where.status = status
    if (type) where.type = type

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: { include: { user: { select: { name: true, phone: true } } } },
        doctor: { include: { user: { select: { name: true } } } },
        phc: { select: { name: true, district: true } },
      },
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    })

    const total = await prisma.appointment.count({ where })

    res.json({
      success: true,
      data: appointments,
      pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
    })
  } catch (error) {
    logger.error('Get appointments error', { error })
    res.status(500).json({ success: false, error: 'Failed to fetch appointments' })
  }
})

// Create appointment
appointmentsRouter.post('/', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = AppointmentSchema.parse(req.body)

    const patient = await prisma.patient.findFirst({ where: { userId: req.user!.userId } })
    if (!patient) {
      res.status(404).json({ success: false, error: 'Patient profile not found' })
      return
    }

    // Generate meeting link for teleconsult
    const meetingId = data.type === 'TELECONSULT' ? `meet_${Math.random().toString(36).substring(2, 10)}` : undefined
    const meetingLink = meetingId ? `https://meet.arogyasetu.health/${meetingId}` : undefined

    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: data.doctorId,
        phcId: data.phcId,
        date: new Date(data.date),
        time: data.time,
        type: data.type,
        status: 'SCHEDULED',
        symptoms: data.symptoms,
        notes: data.notes,
        meetingLink,
        meetingId,
        triageResultId: data.triageResultId,
      },
      include: {
        patient: { include: { user: { select: { name: true, phone: true } } } },
        doctor: { include: { user: { select: { name: true } } } },
        phc: { select: { name: true } },
      },
    })

    // Create notification
    await prisma.notification.create({
      data: {
        userId: req.user!.userId,
        type: 'APPOINTMENT',
        title: 'Appointment Confirmed',
        message: `Your appointment with Dr. ${appointment.doctor.user.name} on ${data.date} at ${data.time} is confirmed.`,
        actionUrl: `/dashboard/patient/appointments`,
      },
    })

    res.status(201).json({
      success: true,
      data: appointment,
      message: 'Appointment booked successfully!',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: 'Invalid data', details: error.errors })
      return
    }
    logger.error('Create appointment error', { error })
    res.status(500).json({ success: false, error: 'Failed to book appointment' })
  }
})

// Update appointment status
appointmentsRouter.patch('/:id/status', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status, updatedAt: new Date() },
    })

    res.json({ success: true, data: appointment })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update appointment' })
  }
})

export const patientsRouter = Router()

patientsRouter.get('/', authenticate, requireRole('PHC_DOCTOR', 'ASHA_WORKER', 'ADMIN', 'DISTRICT_OFFICER'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, search } = req.query
    const where: Record<string, unknown> = {}
    if (search) {
      where.user = { name: { contains: String(search), mode: 'insensitive' } }
    }

    const patients = await prisma.patient.findMany({
      where,
      include: {
        user: { select: { name: true, email: true, phone: true, language: true } },
        primaryDoctor: { include: { user: { select: { name: true } } } },
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    })

    const total = await prisma.patient.count({ where })
    res.json({ success: true, data: patients, pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch patients' })
  }
})

patientsRouter.get('/me', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const patient = await prisma.patient.findFirst({
      where: { userId: req.user!.userId },
      include: {
        user: { select: { name: true, email: true, phone: true, language: true } },
        vitals: { orderBy: { recordedAt: 'desc' }, take: 5 },
      },
    })

    if (!patient) {
      res.status(404).json({ success: false, error: 'Patient profile not found' })
      return
    }

    res.json({ success: true, data: patient })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch patient profile' })
  }
})

export const doctorsRouter = Router()

doctorsRouter.get('/', async (req, res: Response) => {
  try {
    const doctors = await prisma.doctor.findMany({
      where: { isAvailable: true },
      include: {
        user: { select: { name: true, email: true } },
        phc: { select: { name: true, district: true } },
      },
    })
    res.json({ success: true, data: doctors })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch doctors' })
  }
})

export const phcRouter = Router()

phcRouter.get('/', async (req, res: Response) => {
  try {
    const phcs = await prisma.pHC.findMany({
      where: { isActive: true },
      include: {
        doctors: { include: { user: { select: { name: true } } } },
        _count: { select: { appointments: true } },
      },
    })
    res.json({ success: true, data: phcs })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch PHCs' })
  }
})

export const usersRouter = Router()

usersRouter.get('/', authenticate, requireRole('ADMIN', 'DISTRICT_OFFICER'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, role } = req.query
    const where: Record<string, unknown> = {}
    if (role) where.role = role

    const users = await prisma.user.findMany({
      where,
      select: { id: true, name: true, email: true, phone: true, role: true, language: true, isActive: true, isVerified: true, createdAt: true },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    })

    const total = await prisma.user.count({ where })
    res.json({ success: true, data: users, pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch users' })
  }
})
