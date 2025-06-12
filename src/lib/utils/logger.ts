import pino from 'pino'
import * as Sentry from '@sentry/nextjs'

// Determine environment (dev or prod)
const isProd = process.env.NODE_ENV === 'production'

const baseLogger = pino({
    level: isProd ? 'info' : 'debug',
    formatters: {
      level: (label) => {
        const emoji =
          label === 'error'
            ? '❌'
            : label === 'warn'
            ? '⚠️'
            : label === 'info'
            ? 'ℹ️'
            : label === 'debug'
            ? '🐛'
            : '📝'
        return { level: `${emoji} ${label.toUpperCase()}` }
      },
    },
    timestamp: () => `,"time":"${new Date().toISOString()}"`,
  })

  export const logger = {
    ...baseLogger,
    error: (...args: unknown[]) => {
      const [firstArg] = args
      if (isProd) {
        if (firstArg instanceof Error) {
          Sentry.captureException(firstArg)
        } else {
          Sentry.captureMessage(typeof firstArg === 'string' ? firstArg : JSON.stringify(firstArg))
        }
      }
      baseLogger.error(args[0])
    },
  }


