import { getRedisClient } from '@/lib/third-party/redis'
import { AnalyticsSummaryDTO } from './analytics.types'
import { logger } from '@/lib/utils/logger'

export class AnalyticsCache {
  private readonly redis = getRedisClient()
  private readonly TTL = 3600
  private readonly SUMMARY_KEY = 'analytics:summary'

  /**
   * Store analytics summary data
   * @param data - The analytics summary data to store
   * @returns boolean indicating success
   */
  async setAnalyticsSummary(data: AnalyticsSummaryDTO): Promise<boolean> {
    try {
      if (!this.redis) return false

      await this.redis.set(this.SUMMARY_KEY, JSON.stringify(data), 'EX', this.TTL)
      return true
    } catch (error) {
      logger.error('Failed to cache analytics summary:', error)
      return false
    }
  }

  /**
   * Retrieve analytics summary data
   * @returns The cached analytics summary data or null if not found
   */
  async getAnalyticsSummary(): Promise<AnalyticsSummaryDTO | null> {
    try {
      if (!this.redis) return null

      const data = await this.redis.get(this.SUMMARY_KEY)
      if (data) {
        return JSON.parse(data)
      }

      return null
    } catch (error) {
      logger.error('Failed to retrieve cached analytics summary:', error)
      return null
    }
  }

  /**
   * Invalidate cached analytics summary
   * @returns boolean indicating success
   */
  async invalidateAnalyticsSummary(): Promise<boolean> {
    try {
      if (!this.redis) return false

      await this.redis.del(this.SUMMARY_KEY)
      return true
    } catch (error) {
      logger.error('Failed to invalidate cached analytics summary:', error)
      return false
    }
  }
}
