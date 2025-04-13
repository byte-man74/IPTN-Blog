import { prisma } from '@/lib/third-party/prisma'
import { tryCatchHandler } from '@/lib/utils/try-catch-handler'
import ApiCustomError from '@/types/api-custom-error'
import {
  AnalyticsDTO,
  AnalyticsSummaryDTO,
  AnalyticsUpdateDTO,
  MetricField,
} from '@/app/(server)/modules/analytics/analytics.types'
import { AnalyticsCache } from '@/app/(server)/modules/analytics/analytics.cache'

export class AnalyticsRepository {
  private readonly cache: AnalyticsCache
  private readonly analytics = prisma.analytics
  private readonly news = prisma.news
  private readonly comment = prisma.comment


  constructor() {
    this.cache =  new AnalyticsCache();
  }

  /**
   * Updates analytics information for a news article
   * @param newsId - The ID of the news article
   * @param data - Object containing analytics data to update
   * @returns The updated analytics record
   */
  async modifyNewsAnalytics(
    newsId: string,
    data?: AnalyticsUpdateDTO,
    readDuration?: string
  ): Promise<AnalyticsDTO | ApiCustomError> {
    return await tryCatchHandler(async () => {
      const updateData = { ...data }

      // Add readDuration to the update if it's defined
      if (readDuration !== undefined) {
        updateData.readDuration = readDuration
      }

      return await this.analytics.upsert({
        where: { newsId },
        update: updateData,
        create: {
          newsId,
          ...updateData,
          readDuration,
          views: data?.views ?? 0,
          likes: data?.likes ?? 0,
          shares: data?.shares ?? 0,
        },
      })
    })
  }

  /**
   * Increments a specific analytics metric -- upsert if the model  doesn't exist
   * @param newsId - The ID of the news article
   * @param field - The field to increment (views, likes, shares)
   * @param amount - The amount to increment by (default: 1)
   * @returns The updated analytics record
   */
  async incrementMetric(
    newsId: string,
    field: MetricField,
    amount = 1
  ): Promise<AnalyticsDTO | ApiCustomError> {
    return await tryCatchHandler(async () => {
      return await this.analytics.upsert({
        where: { newsId },
        update: {
          [field]: { increment: amount },
        },
        create: {
          newsId,
          views: field === 'views' ? amount : 0,
          likes: field === 'likes' ? amount : 0,
          shares: field === 'shares' ? amount : 0,
        },
      })
    })
  }

  /**
   * Gets analytics for a specific news article
   * @param newsId - The ID of the news article
   * @returns The analytics record or null if not found
   */
  async getNewsAnalytics(newsId: string): Promise<AnalyticsDTO | null | ApiCustomError> {
    return await tryCatchHandler(async () => {
      return await this.analytics.findUnique({
        where: { newsId },
      })
    })
  }

  /**
   * Gets analytics for multiple news articles
   * @param newsIds - Array of news article IDs
   * @returns Array of analytics records
   */
  async getBulkNewsAnalytics(newsIds: string[]): Promise<AnalyticsDTO[] | ApiCustomError> {
    return await tryCatchHandler(async () => {
      return await this.analytics.findMany({
        where: {
          newsId: { in: newsIds },
        },
      })
    })
  }

  async getAnalyticsSummary(): Promise<AnalyticsSummaryDTO | ApiCustomError | null> {
    return await tryCatchHandler(async () => {
      // Check if data exists in cache
      const analyticsCache = new AnalyticsCache();
      const cachedData = await analyticsCache.getAnalyticsSummary();

      // If cached data exists, return it
      if (cachedData) {
        return cachedData;
      }

      // If not in cache, fetch from database
      // Get total news count
      const totalNews = await this.news.count();

      // Get total published news count
      const totalNewsPublished = await this.news.count({
        where: { published: true },
      });

      // Get sum of all views
      const viewsAggregate = await this.analytics.aggregate({
        _sum: { views: true },
      });

      // Get total comments count
      const totalComments = await this.comment.count();

      const summaryData = {
        totalNews,
        totalNewsPublished,
        totalViews: viewsAggregate._sum.views || 0,
        totalComments,
      };

      // Store in cache for future requests

      console.log("yes i don set the data")
      await analyticsCache.setAnalyticsSummary(summaryData);

      return summaryData;
    });
  }
}
