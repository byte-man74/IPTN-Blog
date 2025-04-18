import ApiCustomError from '@/types/api-custom-error'
import { AdsDTO, AdsFilterDTO, CreateAdDTO, EditAdDTO } from './ads.types'
import { tryCatchHandler } from '@/lib/utils/try-catch-handler'
import { AdsRepository } from './ads.repository'

interface IAdsService {
  createAd(adData: CreateAdDTO): Promise<ApiCustomError | AdsDTO>
  getAdForPageType(pageType: string): Promise<ApiCustomError | AdsDTO | null>
  getAdForNews(newsSlug: string): Promise<ApiCustomError | AdsDTO | null>
  modifyAd(adData: EditAdDTO): Promise<ApiCustomError | AdsDTO>
  deleteAd(adId: string): Promise<ApiCustomError | null>
  fetchAds(adsQueryParamFilter: AdsFilterDTO): Promise<ApiCustomError | AdsDTO[] | null>
  fetchAdDetail(id: string): Promise<ApiCustomError | AdsDTO | null>
}

export class AdsService implements IAdsService {
  private readonly repository: AdsRepository

  constructor() {
    this.repository = new AdsRepository()
  }

  async createAd(adData: CreateAdDTO): Promise<ApiCustomError | AdsDTO> {
    return tryCatchHandler(async () => {
      return await this.repository.createAnAd(adData)
    })
  }

  async getAdForPageType(pageType: string): Promise<ApiCustomError | AdsDTO | null> {
    return tryCatchHandler(async () => {
      return await this.repository.getAdForAPageType(pageType)
    })
  }

  async getAdForNews(newsSlug: string): Promise<ApiCustomError | AdsDTO | null> {
    return tryCatchHandler(async () => {
      return await this.repository.getAdForANews(newsSlug)
    })
  }

  async modifyAd(adData: EditAdDTO): Promise<ApiCustomError | AdsDTO> {
    return tryCatchHandler(async () => {
      return await this.repository.modifyAd(adData)
    })
  }

  async deleteAd(adId: string): Promise<ApiCustomError | null> {
    return tryCatchHandler(async () => {
      await this.repository.deleteAd(adId)
      return null
    })
  }

  async fetchAds(adsQueryParamFilter: AdsFilterDTO): Promise<ApiCustomError | AdsDTO[] | null> {
    return tryCatchHandler(async () => {
      return await this.repository.fetchAds(adsQueryParamFilter)
    })
  }

async fetchAdDetail(id: string): Promise<ApiCustomError | AdsDTO | null> {
    return tryCatchHandler(async () => {
      return await this.repository.fetchAdDetail(id)
    })
  }
}
