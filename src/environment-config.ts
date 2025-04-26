import { logger } from './lib/utils/logger'

const dev = {
  API_URL: process.env.NEXT_PUBLIC_API_URL_DEV,
}

const prod = {
  API_URL: process.env.NEXT_PUBLIC_API_URL_PROD,
}

const getEnv = () => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return dev
    case 'production':
      return prod
    default:
      return dev
  }
}

export const env = getEnv()

logger.info('env API_URL', String(env.API_URL ?? '').replace(/[a-zA-Z]/g, '-'))

export const API_URL = env.API_URL








// third party impl...

export const getMixPanelToken = (): string => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || ''
    case 'production':
      return process.env.NEXT_PUBLIC_MIXPANEL_TOKEN_PROD || ''
    default:
      return ''
  }
}


/**
 * would just place this here to check if my environment is in prod or dev state. incase i need any set up on the client side for some config. already used this in the mixpanel init
 * @returns
 */
export const getEnvDebugStatus = (): boolean => {
  return process.env.NODE_ENV === 'development'
}
