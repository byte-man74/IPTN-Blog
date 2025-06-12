import pino from 'pino'
import * as Sentry from '@sentry/nextjs'

// Determine environment (dev or prod)
const isProd = process.env.NODE_ENV === 'production'

// Create logger with appropriate configuration
const logger = pino({
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
  hooks: {
    logMethod(inputArgs, method) {
      // Capture errors in Sentry when in production
      if (isProd && inputArgs[0] === 'error') {
        const error = inputArgs[1]
        if (error instanceof Error) {
          Sentry.captureException(error)
        } else {
          Sentry.captureMessage(String(error))
        }
      }
      method.apply(this, inputArgs)
    }
  }
})

// Export the logger
export { logger }
