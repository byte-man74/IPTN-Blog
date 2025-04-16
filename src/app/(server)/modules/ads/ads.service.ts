import ApiCustomError from '@/types/api-custom-error'
import { AdsDTO, CreateAdDTO, EditAdDTO } from './ads.types'
import { tryCatchHandler } from '@/lib/utils/try-catch-handler'
import { AdsRepository } from './ads.repository'

interface IAdsService {
  createAd(adData: CreateAdDTO): Promise<ApiCustomError | AdsDTO>
  getAdForPageType(pageType: string): Promise<ApiCustomError | AdsDTO | null>
  getAdForNews(newsSlug: string): Promise<ApiCustomError | AdsDTO | null>
  modifyAd(adData: EditAdDTO): Promise<ApiCustomError | AdsDTO>
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
}
