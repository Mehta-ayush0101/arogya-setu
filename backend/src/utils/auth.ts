import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const SALT_ROUNDS = 12
const JWT_SECRET = process.env.JWT_SECRET || 'arogya-setu-super-secret-jwt-key-2024'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'arogya-setu-refresh-secret-2024'
const REFRESH_TOKEN_EXPIRES_IN = '30d'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateAccessToken(payload: { userId: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions)
}

export function generateRefreshToken(userId: string): string {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN } as jwt.SignOptions)
}

export function verifyAccessToken(token: string): { userId: string; role: string } {
  return jwt.verify(token, JWT_SECRET) as { userId: string; role: string }
}

export function verifyRefreshToken(token: string): { userId: string } {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as { userId: string }
}

export function sanitizeUser(user: Record<string, unknown>) {
  const { password, ...sanitized } = user
  return sanitized
}
