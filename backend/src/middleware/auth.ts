import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/auth'
import { prisma } from '../config/database'
import { logger } from '../utils/logger'

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string
    role: string
    email?: string
  }
}

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ success: false, error: 'No authentication token provided' })
      return
    }

    const token = authHeader.substring(7)
    const decoded = verifyAccessToken(token)

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true, email: true, isActive: true },
    })

    if (!user || !user.isActive) {
      res.status(401).json({ success: false, error: 'User not found or inactive' })
      return
    }

    req.user = { userId: decoded.userId, role: decoded.role, email: user.email }
    next()
  } catch (error) {
    logger.warn('Authentication failed', { error: (error as Error).message })
    res.status(401).json({ success: false, error: 'Invalid or expired token' })
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized' })
      return
    }
    const userRole = req.user.role.toLowerCase()
    const allowedRoles = roles.map(r => r.toLowerCase())
    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({
        success: false,
        error: `Access denied. Required roles: ${roles.join(', ')}`,
      })
      return
    }
    next()
  }
}
