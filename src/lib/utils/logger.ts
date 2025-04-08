import pino from 'pino'

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
})

// Export the logger
export { logger }
