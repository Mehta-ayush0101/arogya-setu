import { Router, Response } from 'express'
import { watsonxService, sttService, ttsService } from '../services/ibmWatson'
import { authenticate, AuthenticatedRequest } from '../middleware/auth'
import { prisma } from '../config/database'
import { logger } from '../utils/logger'
import { z } from 'zod'

export const triageRouter = Router()

const TriageSchema = z.object({
  symptoms: z.string().min(3).max(2000),
  language: z.string().default('en'),
  saveResult: z.boolean().default(true),
})

// ===== ANALYZE SYMPTOMS =====
triageRouter.post('/analyze', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { symptoms, language, saveResult } = TriageSchema.parse(req.body)

    // Get patient context for better AI analysis
    let patientContext = {}
    if (req.user) {
      const patient = await prisma.patient.findFirst({
        where: { userId: req.user.userId },
        select: { age: true, chronicConditions: true, currentMedications: true },
      })
      if (patient) {
        patientContext = {
          age: patient.age,
          chronicConditions: patient.chronicConditions,
          currentMedications: patient.currentMedications,
        }
      }
    }

    // Call IBM Granite LLM
    const aiResult = await watsonxService.analyzeSymptoms({
      symptoms,
      language,
      patientContext,
    })

    // Save result to database
    let savedResult = null
    if (saveResult && req.user) {
      const patient = await prisma.patient.findFirst({ where: { userId: req.user.userId } })
      if (patient) {
        savedResult = await prisma.triageResult.create({
          data: {
            patientId: patient.id,
            symptoms,
            possibleConditions: aiResult.conditions.map((c, i) => ({
              name: c,
              probability: Math.max(90 - i * 15, 40),
              description: '',
            })),
            severity: aiResult.severity,
            severityExplanation: aiResult.explanation,
            recommendedAction: aiResult.recommendation,
            confidence: aiResult.confidence,
            language,
            voiceInput: false,
          },
        })
      }
    }

    res.json({
      success: true,
      data: {
        ...aiResult,
        id: savedResult?.id,
        createdAt: savedResult?.createdAt,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: 'Invalid input', details: error.errors })
      return
    }
    logger.error('Triage analysis error', { error })
    res.status(500).json({ success: false, error: 'AI analysis failed. Please try again.' })
  }
})

// ===== GET PATIENT TRIAGE HISTORY =====
triageRouter.get('/history/:patientId', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { patientId } = req.params
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10

    const results = await prisma.triageResult.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })

    const total = await prisma.triageResult.count({ where: { patientId } })

    res.json({
      success: true,
      data: results,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    logger.error('Triage history error', { error })
    res.status(500).json({ success: false, error: 'Failed to fetch triage history' })
  }
})

export const ibmRouter = Router()

// ===== IBM VOICE-TO-TEXT =====
ibmRouter.post('/stt', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { language = 'gu-IN' } = req.body

    // In production, req.body would contain base64 audio
    // For demo, return mock
    const result = await sttService.transcribeAudio(Buffer.from(''), language)

    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    logger.error('IBM STT error', { error })
    res.status(500).json({ success: false, error: 'Speech recognition failed' })
  }
})

// ===== IBM TEXT-TO-SPEECH =====
ibmRouter.post('/tts', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { text, language = 'en-IN' } = req.body
    if (!text) {
      res.status(400).json({ success: false, error: 'Text is required' })
      return
    }

    const audioBuffer = await ttsService.synthesize(text, language)

    if (!audioBuffer) {
      res.json({ success: true, data: { message: 'TTS not configured — use browser Web Speech API', audio: null } })
      return
    }

    res.set('Content-Type', 'audio/mp3')
    res.set('Content-Disposition', 'inline; filename=speech.mp3')
    res.send(audioBuffer)
  } catch (error) {
    logger.error('IBM TTS error', { error })
    res.status(500).json({ success: false, error: 'Text-to-speech failed' })
  }
})

// ===== IBM STATUS =====
ibmRouter.get('/status', authenticate, async (req, res: Response) => {
  res.json({
    success: true,
    data: {
      granite: {
        model: 'ibm/granite-13b-instruct-v2',
        configured: !!(process.env.IBM_WATSONX_URL && process.env.IBM_WATSONX_API_KEY),
        status: process.env.IBM_WATSONX_URL ? 'connected' : 'mock_mode',
      },
      stt: {
        service: 'IBM Watson Speech to Text',
        configured: !!(process.env.IBM_STT_API_KEY && process.env.IBM_STT_URL),
        status: process.env.IBM_STT_API_KEY ? 'connected' : 'mock_mode',
      },
      tts: {
        service: 'IBM Watson Text to Speech',
        configured: !!(process.env.IBM_TTS_API_KEY && process.env.IBM_TTS_URL),
        status: process.env.IBM_TTS_API_KEY ? 'connected' : 'mock_mode',
      },
      storage: {
        service: 'IBM Cloud Object Storage',
        configured: !!(process.env.IBM_COS_API_KEY && process.env.IBM_COS_ENDPOINT),
        status: process.env.IBM_COS_API_KEY ? 'connected' : 'mock_mode',
      },
    },
  })
})
