// /lib/logger.ts
import pino from 'pino'

// Determine environment (dev or prod)
const isProd = process.env.NODE_ENV === 'production'

// Production logger config
const prodLogger = pino({
  level: 'info',  // Info level or higher for production
  transport: {
    target: 'pino/file',  // Optionally log to a file in production
    options: {
      destination: './logs/production.log',  // Log file path
    }
  }
})

// Development logger config
const devLogger = pino({
  level: 'debug',  // More verbose in dev
  transport: {
    target: 'pino-pretty',  // Pretty format for console output
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
    }
  }
})

// Export based on the environment
export const logger = isProd ? prodLogger : devLogger
