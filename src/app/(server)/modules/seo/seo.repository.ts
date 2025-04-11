import { PrismaClient } from '@prisma/client'
import { NewsDTO } from '@/app/(server)/modules/news/news.types'
import { tryCatchHandler } from '@/lib/utils/try-catch-handler'

const prisma = new PrismaClient()

export class SeoRepository {
  private readonly seo = prisma.seo

  async createSeoContentFromNewsInformation(newsInformation: NewsDTO) {
    return tryCatchHandler(async () => {
      await this.seo.create({
        data: {
          title: newsInformation?.title,
          description: newsInformation?.summary,
        }
      })
    })
  }
}
