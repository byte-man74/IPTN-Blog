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
} from '@/app/(server)/modules/news/news.types'
import { PageNumberCounters, PageNumberPagination } from 'prisma-extension-pagination/dist/types'

export interface INewsService {
  createNews(news: CreateNewsDTO): Promise<NewsDTO | null | ApiCustomError>
  editNews(id: string, news: Partial<CreateNewsDTO>): Promise<NewsDTO | null | ApiCustomError>
  getNewsWithFilters(
    filters: NewsFilterDTO,
    page: number,
    limit: number
  ): Promise<{ data: NewsDTO[]; meta: PageNumberPagination & PageNumberCounters } | null | ApiCustomError>
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

  constructor() {
    this.repository = new NewsRepository()
  }

  async createNews(news: CreateNewsDTO): Promise<NewsDTO | null | ApiCustomError> {
    //TODO: later handle analytics from here.
    return await this.repository.createNews(news)
  }

  //this would handle stuff like edit news
  //unpublish or save as draft, publish too.
  async editNews(
    slug: string,
    news: Partial<CreateNewsDTO>
  ): Promise<FullNewsDTO | null | ApiCustomError> {
    //TODO: later handle analytics from here if unpublished
    return await this.repository.editNews(slug, news)
  }

  async getNewsWithFilters(
    filters: NewsFilterDTO,
    page: number,
    limit: number
  ): Promise<{ data: NewsDTO[]; meta: PageNumberPagination & PageNumberCounters } | null | ApiCustomError> {
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
   * @returns
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
    return await this.repository.getNewsBySlug(slug)
  }

  async fetchCategories(): Promise<NewsCategoryDTO[] | null | ApiCustomError> {
    return await this.repository.fetchCategories()
  }

  async fetchTags(): Promise<TagDTO[] | null | ApiCustomError> {
    return await this.repository.fetchTags()
  }
}
