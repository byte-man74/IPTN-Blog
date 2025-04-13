import ApiCustomError from '@/types/api-custom-error'
import { FullNewsDTO } from '@/app/(server)/modules/news/news.types'
import { tryCatchHandler } from '@/lib/utils/try-catch-handler'
import {
  AnalyticsDTO,
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
}
