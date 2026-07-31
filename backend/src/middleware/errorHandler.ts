import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'

interface AppErrorLike extends Error {
  statusCode?: number
  isOperational?: boolean
}

export function errorHandler(
  err: AppErrorLike,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const statusCode = err.statusCode || 500
  const isOperational = err.isOperational || false

  logger.error('Error occurred', {
    message: err.message,
    stack: err.stack,
    statusCode,
    path: req.path,
    method: req.method,
    isOperational,
  })

  if (process.env.NODE_ENV === 'production' && !isOperational) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Something went wrong. Please try again.',
    })
    return
  }

  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  })
}

export class AppError extends Error {
  statusCode: number
  isOperational: boolean

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    Error.captureStackTrace(this, this.constructor)
  }
}
