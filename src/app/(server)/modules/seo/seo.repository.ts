import { PrismaClient } from '@prisma/client'
import { SeoDTO } from './seo.types'
import ApiCustomError from '@/types/api-custom-error'
import { tryCatchHandler } from '@/lib/utils/try-catch-handler'

const prisma = new PrismaClient()

export class SeoRepository {
  /**
   * Creates or updates SEO data for a news article
   * @param newsId - The ID of the news article
   * @param seoData - The SEO data to save
   * @returns The created or updated SEO record
   */

  private readonly seo = prisma.seo



  async createOrUpdateSeo(newsId: string, seoData: SeoDTO): Promise<SeoDTO | ApiCustomError> {
    return tryCatchHandler(async () => {
      return await this.seo.upsert({
        where: { newsId },
        update: {
          openGraphImage: seoData.openGraphImage || null,
          twitterImage: seoData.twitterImage || null,
          updatedAt: new Date(),
        },
        create: {
          newsId,
          openGraphImage: seoData.openGraphImage || null,
          twitterImage: seoData.twitterImage || null,
        },
      })
    })
  }

  /**
   * Retrieves SEO data for a news article
   * @param newsId - The ID of the news article
   * @returns The SEO data or null if not found
   */
  async getSeoByNewsId(newsId: string): Promise<SeoDTO | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      return await this.seo.findUnique({
        where: { newsId },
      })
    })
  }

  /**
   * Deletes SEO data for a news article
   * @param newsId - The ID of the news article
   * @returns The deleted SEO record
   */
  async deleteSeo(newsId: string): Promise<SeoDTO | ApiCustomError> {
    return tryCatchHandler(async () => {
      return await this.seo.delete({
        where: { newsId },
      })
    })
  }
}
