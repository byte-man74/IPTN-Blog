import { prisma } from '@/lib/third-party/prisma'
import ApiCustomError from '@/types/api-custom-error'
import { AdsDTO, AdsFilterDTO, CreateAdDTO, EditAdDTO } from '@/app/(server)/modules/ads/ads.types'
import { tryCatchHandler } from '@/lib/utils/try-catch-handler'
import { AdPosition } from '@prisma/client'

export class AdsRepository {
  private readonly ads = prisma.advertisement

  async createAnAd(adData: CreateAdDTO): Promise<ApiCustomError | AdsDTO> {
    return tryCatchHandler(async () => {
      const createdAd = await this.ads.create({
        data: adData,
      })
      return createdAd
    })
  }

  async getAdForAPageType(pageType: string): Promise<ApiCustomError | AdsDTO | null> {
    return tryCatchHandler(async () => {
      const ad = await this.ads.findFirst({
        where: {
          position: pageType.toUpperCase() as AdPosition,
          isActive: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
      return ad
    })
  }

  async getAdForANews(newsSlug: string): Promise<ApiCustomError | AdsDTO | null> {
    return tryCatchHandler(async () => {
      const news = await prisma.news.findUnique({
        where: { slug: newsSlug },
        select: { id: true },
      })

      if (!news) {
        return new ApiCustomError('News not found', 404)
      }

      const ad = await this.ads.findFirst({
        where: {
          newsId: news.id,
          isActive: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      return ad
    })
  }

  async modifyAd(adData: EditAdDTO): Promise<ApiCustomError | AdsDTO> {
    return tryCatchHandler(async () => {
      const { id, ...dataToUpdate } = adData
      const updated = await this.ads.update({
        where: { id },
        data: dataToUpdate,
      })

      return updated
    })
  }

  async deleteAd(adId: string): Promise<ApiCustomError | null> {
    return tryCatchHandler(async () => {
      const deletedAd = await this.ads.delete({
        where: {
          id: adId,
        },
      })

      if (!deletedAd) {
        return new ApiCustomError('Ad not found', 404)
      }

      return null
    })
  }

  async fetchAds(adsQueryParamFilter: AdsFilterDTO): Promise<AdsDTO[] | ApiCustomError | null> {
    return tryCatchHandler(async () => {
      const { pageType, isActive = true, title } = adsQueryParamFilter

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const whereClause: any = { isActive }

      if (pageType) {
        whereClause.position = pageType
      }

      if (title) {
        whereClause.title = {
          contains: title,
          mode: 'insensitive',
        }
      }

      const ads = await this.ads.findMany({
        where: whereClause,
        orderBy: {
          createdAt: 'desc',
        },
      })

      if (!ads || ads.length === 0) {
        return null
      }

      return ads
    })
  }

  async fetchAdDetail(id: string): Promise<AdsDTO | ApiCustomError | null> {
    return tryCatchHandler(async () => {
      const ad = await this.ads.findUnique({
        where: {
          id: id,
        },
      })

      if (!ad) {
        return new ApiCustomError('Ad not found', 404)
      }

      return ad
    })
  }
}
