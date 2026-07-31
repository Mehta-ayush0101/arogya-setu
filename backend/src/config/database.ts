import { PrismaClient } from '@prisma/client'
import { logger } from '../utils/logger'

declare global {
  var prisma: PrismaClient | undefined
}

export const prisma = globalThis.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? [{ emit: 'event', level: 'query' }, { emit: 'stdout', level: 'error' }]
    : [{ emit: 'stdout', level: 'error' }],
})

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

// Log slow queries in development
if (process.env.NODE_ENV === 'development') {
  // @ts-expect-error Prisma query event typing requires explicit log config above
  prisma.$on('query', (e: { query: string; duration: number }) => {
    logger.debug(`Query: ${e.query} — Duration: ${e.duration}ms`)
  })
}

export default prisma
