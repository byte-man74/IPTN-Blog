import ApiCustomError from '@/types/api-custom-error'
import { NewsRepository } from '@/app/(server)/modules/news/news.repository'
import {
  CreateNewsDTO,
  NewsDTO,
  NewsFilterDTO,
  CreateNewsCategoryDTO,
  CreateTagDTO,
  FullNewsDTO,
  NewsCategoryDTO,
  TagDTO,
  UpdateNewsDTO,
} from '@/app/(server)/modules/news/news.types'
import { PageNumberCounters, PageNumberPagination } from 'prisma-extension-pagination/dist/types'
import { SeoService } from '@/app/(server)/modules/seo/seo.service'
import { tryCatchHandler } from '@/lib/utils/try-catch-handler'

export interface INewsService {
  createNews(news: CreateNewsDTO): Promise<NewsDTO | null | ApiCustomError>
  editNews(id: string, news: Partial<UpdateNewsDTO>): Promise<NewsDTO | null | ApiCustomError>
  getNewsWithFilters(
    filters: NewsFilterDTO,
    page: number,
    limit: number
  ): Promise<
    { data: NewsDTO[]; meta: PageNumberPagination & PageNumberCounters } | null | ApiCustomError
  >
  createNewsCategory(category: CreateNewsCategoryDTO): Promise<unknown | null | ApiCustomError>
  getNewsBySlug(slug: string): Promise<FullNewsDTO | null | ApiCustomError>
  createTag(tag: CreateTagDTO): Promise<unknown | null | ApiCustomError>
  assignTagsToNews(
    newsId: string,
    tagIds: number[],
    options?: { remove?: boolean }
  ): Promise<NewsDTO | null | ApiCustomError>
  assignCategoriesToNews(
    newsId: string,
    categoryIds: number[],
    options?: { remove?: boolean }
  ): Promise<NewsDTO | null | ApiCustomError>
  deleteNews(id: string): Promise<NewsDTO | null | ApiCustomError>
  fetchCategories(): Promise<NewsCategoryDTO[] | null | ApiCustomError>
  fetchTags(): Promise<TagDTO[] | null | ApiCustomError>
}

export class NewsService implements INewsService {
  private readonly repository: NewsRepository
  private readonly seoService: SeoService

  constructor() {
    this.repository = new NewsRepository()
    this.seoService = new SeoService()
  }

  async createNews(news: CreateNewsDTO): Promise<NewsDTO | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      const createdNews = await this.repository.createNews(news)
      return createdNews
    })
  }

  //this would handle stuff like edit news
  //unpublish or save as draft, publish too.
  async editNews(
    slug: string,
    news: Partial<UpdateNewsDTO>
  ): Promise<FullNewsDTO | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      // Check if we need to regenerate SEO images before updating
      const shouldRegenerate = await this.repository.shouldRegenerateSeoImages(slug, news)
      console.log("fake life", shouldRegenerate)


      const updatedNews = await this.repository.editNews(slug, news)

      // Regenerate SEO images if needed
      if (
        shouldRegenerate &&
        updatedNews &&
        !(updatedNews instanceof ApiCustomError) &&
        updatedNews.id
      ) {
        const seoImages = await this.seoService.generateSeoImages(
          updatedNews.title,
          updatedNews.coverImage
        )


        console.log("atlantis", seoImages)

        if (seoImages && !(seoImages instanceof ApiCustomError)) {
            console.log("created image", seoImages.openGraphImage)
          await this.seoService.createOrUpdateSeo(updatedNews.id, seoImages)
        }
      }

      return updatedNews
    })
  }

  async getNewsWithFilters(
    filters: NewsFilterDTO,
    page: number,
    limit: number
  ): Promise<
    { data: NewsDTO[]; meta: PageNumberPagination & PageNumberCounters } | null | ApiCustomError
  > {
    return await this.repository.getNewsWithFilters(filters, page, limit)
  }

  async createNewsCategory(
    category: CreateNewsCategoryDTO
  ): Promise<unknown | null | ApiCustomError> {
    return await this.repository.createNewsCategory(category)
  }

  async createTag(tag: CreateTagDTO): Promise<unknown | null | ApiCustomError> {
    return await this.repository.createTag(tag)
  }

  /**
   * Allows you to remove and add tags to a news
   * @param slug
   * @param tagIds
   * @param options
   */
  async assignTagsToNews(
    slug: string,
    tagIds: number[],
    options: { remove?: boolean } = {}
  ): Promise<NewsDTO | null | ApiCustomError> {
    return await this.repository.assignTagsToNews(slug, tagIds, options)
  }

  async assignCategoriesToNews(
    slug: string,
    categoryIds: number[],
    options: { remove?: boolean } = {}
  ): Promise<NewsDTO | null | ApiCustomError> {
    return await this.repository.assignCategoriesToNews(slug, categoryIds, options)
  }

  async deleteNews(slug: string): Promise<NewsDTO | null | ApiCustomError> {
    return await this.repository.deleteNews(slug)
  }

  async getNewsBySlug(slug: string): Promise<FullNewsDTO | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      const news = await this.repository.getNewsBySlug(slug)
      return news
    })
  }

  async fetchCategories(): Promise<NewsCategoryDTO[] | null | ApiCustomError> {
    return await this.repository.fetchCategories()
  }

  async fetchTags(): Promise<TagDTO[] | null | ApiCustomError> {
    return await this.repository.fetchTags()
  }
}
