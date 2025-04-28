import ApiCustomError from '@/types/api-custom-error'
import { FullNewsDTO } from '@/app/(server)/modules/news/news.types'
import { tryCatchHandler } from '@/lib/utils/try-catch-handler'
import {
  AnalyticsDTO,
  AnalyticsPopularNewsDTO,
  AnalyticsSummaryDTO,
  MetricField,
} from '@/app/(server)/modules/analytics/analytics.types'
import { AnalyticsRepository } from '@/app/(server)/modules/analytics/analytics.repository'
import { generateNewsReadingDurationFromNews } from '@/app/(server)/modules/analytics/analytics.utils'

interface IAnalyticsService {
  setUpNewsAnalytics(
    news: FullNewsDTO,
    shouldRecalculateDuration: boolean
  ): Promise<AnalyticsDTO | ApiCustomError | null>
  incrementMetric(newsId: string, metricType: MetricField): Promise<ApiCustomError | null>
  getAnalyticsSummary(): Promise<AnalyticsSummaryDTO | ApiCustomError | null>
  getAnalyticsPopularNews(): Promise<AnalyticsPopularNewsDTO[] | ApiCustomError | null>
  saveUserMixpanelIdentity(userId: string): Promise<ApiCustomError | boolean>
}

export class AnalyticsService implements IAnalyticsService {
  private readonly repository: AnalyticsRepository

  constructor() {
    this.repository = new AnalyticsRepository()
  }

  /**
   * Sets up analytics for a particular news article
   * @param news - The news article data
   * @param shouldRecalculateDuration - Whether to recalculate the reading duration
   * @returns The created analytics record or error
   */
  async setUpNewsAnalytics(
    news: FullNewsDTO,
    shouldRecalculateDuration: boolean
  ): Promise<AnalyticsDTO | ApiCustomError | null> {
    return tryCatchHandler(async () => {
      let readingDuration
      if (shouldRecalculateDuration) {
        readingDuration = news.contentEncoded
          ? generateNewsReadingDurationFromNews(news.contentEncoded)
          : undefined
      }

      const result = await this.repository.modifyNewsAnalytics(news.id, undefined, readingDuration)
      return result instanceof ApiCustomError ? result : null
    })
  }

  /**
   * Provides flexible service to allow system to increment the metric system of an analytics
   * @param newsId
   * @param metricType
   * @returns
   */
  async incrementMetric(newsId: string, metricType: MetricField): Promise<ApiCustomError | null> {
    return tryCatchHandler(async () => {
      if (!newsId) {
        return new ApiCustomError('Bad Request', 400, 'News ID is required')
      }

      const result = await this.repository.incrementMetric(newsId, metricType)
      return result instanceof ApiCustomError ? result : null
    })
  }

  async getAnalyticsSummary(): Promise<AnalyticsSummaryDTO | ApiCustomError | null> {
    const result = await this.repository.getAnalyticsSummary()
    return result
  }

  async getAnalyticsPopularNews(): Promise<AnalyticsPopularNewsDTO[] | ApiCustomError | null> {
    return tryCatchHandler(async () => {
      const result = await this.repository.getAnalyticsPopularNews()
      return result
    })
  }

  async saveUserMixpanelIdentity(userId: string): Promise<ApiCustomError | boolean> {
    return tryCatchHandler(async () => {
      // Check if identity already exists to avoid duplicate entries
      const identityExists = await this.repository.checkIfMixpanelIdentityHasBeenCreated(userId)

      // If identity already exists, return true without creating a new record
      if (identityExists === true) {
        return true
      }

      // Otherwise, return false to show that this was never created in the first place
       await this.repository.saveUserMixpanelIdentity(userId)
      return false
    })
  }
}
