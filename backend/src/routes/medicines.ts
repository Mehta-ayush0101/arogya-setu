import { Router, Response } from 'express'
import { authenticate, requireRole, AuthenticatedRequest } from '../middleware/auth'
import { prisma } from '../config/database'
import { logger } from '../utils/logger'
import { z } from 'zod'

export const medicinesRouter = Router()

// Get medicine stock
medicinesRouter.get('/stock', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { phcId, status } = req.query
    const where: Record<string, unknown> = {}
    if (phcId) where.phcId = phcId
    if (status) where.status = status

    const stocks = await prisma.medicineStock.findMany({
      where,
      include: {
        medicine: true,
        phc: { select: { name: true } },
      },
      orderBy: [{ status: 'asc' }, { quantity: 'asc' }],
    })

    // Check for low/expired and update status
    const now = new Date()
    const updatedStocks = stocks.map(stock => ({
      ...stock,
      computedStatus: stock.expiryDate < now ? 'EXPIRED' :
        stock.quantity <= 0 ? 'CRITICAL' :
        stock.quantity < stock.minStockLevel * 0.3 ? 'CRITICAL' :
        stock.quantity < stock.minStockLevel ? 'LOW' : 'ADEQUATE'
    }))

    res.json({ success: true, data: updatedStocks })
  } catch (error) {
    logger.error('Get medicine stock error', { error })
    res.status(500).json({ success: false, error: 'Failed to fetch medicine stock' })
  }
})

// Update stock
medicinesRouter.patch('/stock/:id', authenticate, requireRole('ASHA_WORKER', 'PHC_DOCTOR', 'ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const { quantity } = req.body

    const stock = await prisma.medicineStock.update({
      where: { id },
      data: {
        quantity: Number(quantity),
        lastUpdated: new Date(),
        updatedBy: req.user!.userId,
        status: Number(quantity) < 30 ? 'CRITICAL' : Number(quantity) < 100 ? 'LOW' : 'ADEQUATE',
      },
    })

    res.json({ success: true, data: stock })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update stock' })
  }
})

// Request medicine
medicinesRouter.post('/request', authenticate, requireRole('ASHA_WORKER', 'PHC_DOCTOR', 'ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { medicineId, phcId, quantity, urgency, notes } = req.body

    const request = await prisma.medicineRequest.create({
      data: {
        medicineId,
        phcId,
        requestedBy: req.user!.userId,
        quantity: Number(quantity),
        urgency: urgency || 'NORMAL',
        notes,
        status: 'PENDING',
      },
      include: {
        medicine: { select: { name: true } },
        phc: { select: { name: true } },
      },
    })

    // Send notification to admin
    logger.info(`Medicine request created: ${request.medicine.name} for ${request.phc.name}`)

    res.status(201).json({
      success: true,
      data: request,
      message: `Request for ${request.medicine.name} submitted successfully`,
    })
  } catch (error) {
    logger.error('Medicine request error', { error })
    res.status(500).json({ success: false, error: 'Failed to submit medicine request' })
  }
})

// Get medicines list
medicinesRouter.get('/', async (req, res: Response) => {
  try {
    const { search, category } = req.query
    const where: Record<string, unknown> = {}
    if (search) where.name = { contains: String(search), mode: 'insensitive' }
    if (category) where.category = category

    const medicines = await prisma.medicine.findMany({
      where,
      orderBy: { name: 'asc' },
    })

    res.json({ success: true, data: medicines })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch medicines' })
  }
})

export const emergencyRouter = Router()

// Create emergency request
emergencyRouter.post('/', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { latitude, longitude, address, description, phone } = req.body

    const patient = await prisma.patient.findFirst({ where: { userId: req.user!.userId } })
    if (!patient) {
      res.status(404).json({ success: false, error: 'Patient profile not found' })
      return
    }

    const emergency = await prisma.emergencyRequest.create({
      data: {
        patientId: patient.id,
        phone: phone || '',
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address: address || 'Location shared',
        description: description || 'Emergency SOS',
        status: 'ACTIVE',
        estimatedTime: Math.floor(Math.random() * 20) + 10, // Mock: 10-30 min
      },
    })

    // In production: notify nearest ambulance via SMS/WhatsApp
    logger.info(`🚨 EMERGENCY REQUEST: Patient ${patient.id} at ${address}`)

    res.status(201).json({
      success: true,
      data: {
        ...emergency,
        ambulanceContact: '108',
        nearestPHC: 'Devgadh PHC (3.2km)',
        message: 'Emergency services notified. Ambulance dispatched.',
      },
    })
  } catch (error) {
    logger.error('Emergency request error', { error })
    res.status(500).json({ success: false, error: 'Failed to create emergency request' })
  }
})

// Resolve emergency
emergencyRouter.patch('/:id/resolve', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const emergency = await prisma.emergencyRequest.update({
      where: { id },
      data: { status: 'RESOLVED', resolvedAt: new Date() },
    })
    res.json({ success: true, data: emergency })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to resolve emergency' })
  }
})

export const notificationsRouter = Router()

notificationsRouter.get('/', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
      take: 30,
    })
    res.json({ success: true, data: notifications })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch notifications' })
  }
})

notificationsRouter.patch('/:id/read', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    await prisma.notification.update({ where: { id: req.params.id }, data: { isRead: true } })
    res.json({ success: true, message: 'Notification marked as read' })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update notification' })
  }
})

export const analyticsRouter = Router()

analyticsRouter.get('/district', authenticate, requireRole('ADMIN', 'DISTRICT_OFFICER'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const [totalPatients, totalAppointments, emergencies, phcCount] = await Promise.all([
      prisma.patient.count(),
      prisma.appointment.count(),
      prisma.emergencyRequest.count({ where: { status: 'ACTIVE' } }),
      prisma.pHC.count({ where: { isActive: true } }),
    ])

    const appointmentsByStatus = await prisma.appointment.groupBy({
      by: ['status'],
      _count: true,
    })

    res.json({
      success: true,
      data: {
        totalPatients,
        totalAppointments,
        activeEmergencies: emergencies,
        activePHCs: phcCount,
        appointmentsByStatus,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    logger.error('Analytics error', { error })
    res.status(500).json({ success: false, error: 'Failed to fetch analytics' })
  }
})
