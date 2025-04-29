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
  CreateCommentSchemaDTO,
  CommentDTO,
} from '@/app/(server)/modules/news/news.types'
import { PageNumberCounters, PageNumberPagination } from 'prisma-extension-pagination/dist/types'
import { SeoService } from '@/app/(server)/modules/seo/seo.service'
import { tryCatchHandler } from '@/lib/utils/try-catch-handler'
import { AnalyticsService } from '@/app/(server)/modules/analytics/analytics.service'

export interface INewsService {
  createNews(news: CreateNewsDTO): Promise<NewsDTO | null | ApiCustomError>
  editNews(slug: string, news: Partial<UpdateNewsDTO>): Promise<NewsDTO | null | ApiCustomError>
  getNewsWithFilters(
    filters: NewsFilterDTO,
    page: number,
    limit: number
  ): Promise<
    { data: NewsDTO[]; meta: PageNumberPagination & PageNumberCounters } | null | ApiCustomError
  >
  createNewsCategory(category: CreateNewsCategoryDTO): Promise<NewsCategoryDTO | null | ApiCustomError>
  getNewsBySlug(slug: string): Promise<FullNewsDTO | null | ApiCustomError>
  createTag(tag: CreateTagDTO): Promise<TagDTO | null | ApiCustomError>
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
  deleteNews(slug: string): Promise<NewsDTO | null | ApiCustomError>
  fetchCategories(): Promise<NewsCategoryDTO[] | null | ApiCustomError>
  fetchTags(): Promise<TagDTO[] | null | ApiCustomError>
  getPopularTags(): Promise<TagDTO[] | null | ApiCustomError>
}

export class NewsService implements INewsService {
  private readonly repository: NewsRepository
  private readonly seoService: SeoService
  private readonly analyticsService: AnalyticsService

  /**
   * Initializes the NewsService with required repositories
   */
  constructor() {
    this.repository = new NewsRepository()
    this.seoService = new SeoService()
    this.analyticsService = new AnalyticsService()
  }

  /**
   * Creates a new news article
   * @param news - The news data to create
   * @returns The created news article or error
   */
  async createNews(news: CreateNewsDTO): Promise<NewsDTO | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      const createdNews = await this.repository.createNews(news)
      return createdNews
    })
  }

  /**
   * Edits an existing news article
   * Handles operations like editing content, un publishing, saving as draft, or publishing
   * @param slug - The slug of the news article to edit
   * @param news - The news data to update
   * @returns The updated news article or error
   */
  async editNews(
    slug: string,
    news: Partial<UpdateNewsDTO>
  ): Promise<FullNewsDTO | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      // Check if we need to regenerate SEO images before updating
      const shouldRegenerate = await this.repository.shouldRegenerateSeoImages(slug, news)

      const updatedNews = await this.repository.editNews(slug, news)

      // guard check to see if we still need to regenerate seo images
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

        if (seoImages && !(seoImages instanceof ApiCustomError)) {
          await this.seoService.createOrUpdateSeo(updatedNews.id, seoImages)
        }
      }

      // Check if we need to set up or update analytics
      const shouldSetupAnalytics = await this.repository.shouldSetupAnalytics(slug, news);

      if (shouldSetupAnalytics &&
          updatedNews &&
          !(updatedNews instanceof ApiCustomError) &&
          updatedNews.id) {

        await this.analyticsService.setUpNewsAnalytics(updatedNews, shouldSetupAnalytics);
      }


      return updatedNews
    })
  }

  /**
   * Retrieves news articles based on provided filters with pagination
   * @param filters - The filters to apply to the news query
   * @param page - The page number for pagination
   * @param limit - The number of items per page
   * @returns Paginated news articles with metadata or error
   */
  async getNewsWithFilters(
    filters: NewsFilterDTO,
    page: number,
    limit: number
  ): Promise<
    { data: NewsDTO[]; meta: PageNumberPagination & PageNumberCounters } | null | ApiCustomError
  > {
    return await this.repository.getNewsWithFilters(filters, page, limit)
  }

  /**
   * Creates a new news category
   * @param category - The category data to create
   * @returns The created category or error
   */
  async createNewsCategory(
    category: CreateNewsCategoryDTO
  ): Promise<NewsCategoryDTO | null | ApiCustomError> {
    return await this.repository.createNewsCategory(category)
  }

  /**
   * Creates a new tag
   * @param tag - The tag data to create
   * @returns The created tag or error
   */
  async createTag(tag: CreateTagDTO): Promise<TagDTO | null | ApiCustomError> {
    return await this.repository.createTag(tag)
  }

  /**
   * Assigns tags to a news article or removes them
   * @param slug - The slug of the news article
   * @param tagIds - The IDs of the tags to assign or remove
   * @param options - Options for the operation (remove: true to remove tags)
   * @returns The updated news article or error
   */
  async assignTagsToNews(
    slug: string,
    tagIds: number[],
    options: { remove?: boolean } = {}
  ): Promise<NewsDTO | null | ApiCustomError> {
    return await this.repository.assignTagsToNews(slug, tagIds, options)
  }

  /**
   * Assigns categories to a news article or removes them
   * @param slug - The slug of the news article
   * @param categoryIds - The IDs of the categories to assign or remove
   * @param options - Options for the operation (remove: true to remove categories)
   * @returns The updated news article or error
   */
  async assignCategoriesToNews(
    slug: string,
    categoryIds: number[],
    options: { remove?: boolean } = {}
  ): Promise<NewsDTO | null | ApiCustomError> {
    return await this.repository.assignCategoriesToNews(slug, categoryIds, options)
  }

  /**
   * Deletes a news article
   * @param slug - The slug of the news article to delete
   * @returns The deleted news article or error
   */
  async deleteNews(slug: string): Promise<NewsDTO | null | ApiCustomError> {
    return await this.repository.deleteNews(slug)
  }

  /**
   * Retrieves a news article by its slug
   * @param slug - The slug of the news article
   * @returns The news article or error
   */
  async getNewsBySlug(slug: string): Promise<FullNewsDTO | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      const news = await this.repository.getNewsBySlug(slug)
      return news
    })
  }

  /**
   * Retrieves all news categories
   * @returns Array of news categories or error
   */
  async fetchCategories(): Promise<NewsCategoryDTO[] | null | ApiCustomError> {
    return await this.repository.fetchCategories()
  }

  /**
   * Retrieves all tags
   * @returns Array of tags or error
   */
  async fetchTags(): Promise<TagDTO[] | null | ApiCustomError> {
    return await this.repository.fetchTags()
  }

  /**
   * Retrieves popular tags used in published news articles with high view counts
   * @returns Array of popular tags or error
   */
  async getPopularTags(): Promise<TagDTO[] | null | ApiCustomError> {
    return await this.repository.getPopularTags()
  }


  /**
   * Fetches news articles related to a specific news article
   * @param slug - The slug of the news article to find related articles for
   * @returns Array of related news articles or error
   */
  async fetchRelatedNews(slug: string): Promise<NewsDTO[] | null | ApiCustomError> {
    return await this.repository.fetchRelatedNews(slug);
  }

  /**
   * Creates a comment for a news article
   * @param data - The comment data including content, newsId, userId, and isAnonymous flag
   * @returns The created comment or error
   */
  async createNewsComment(
    data: CreateCommentSchemaDTO
  ): Promise<CommentDTO | null | ApiCustomError> {
    return await this.repository.createNewsComment(data);
  }
}
