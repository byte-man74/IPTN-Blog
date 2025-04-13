import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { API_URL } from '../environment-config'
import { logger } from '@/lib/utils/logger'

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Check for token in cookies if in browser environment
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';').reduce(
        (acc, cookie) => {
          const [key, value] = cookie.trim().split('=')
          acc[key] = value
          return acc
        },
        {} as Record<string, string>
      )

      const token = cookies['token']
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`)
      }
    }
    return config
  },
  (error: AxiosError) => {
    logger.error('Request interceptor error:', error.message)
    return Promise.reject(error)
  }
)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError) => {
    // Handle errors
    if (error.response) {
      // Server responded with error status
      logger.error('Response error:', error.response.status, error.response.data)

      // Handle 401 Unauthorized errors
      if (error.response.status === 401 && typeof window !== 'undefined') {
        // Redirect to login page instead of using signOut
        window.location.href = '/login'
      }
    } else if (error.request) {
      // Request made but no response received
      logger.error('Request error:', error.request)
      if (error.code === 'ECONNREFUSED') {
        logger.error('Connection refused. Please check if the server is running and accessible.')
      }
    } else {
      // Error in request setup
      logger.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
