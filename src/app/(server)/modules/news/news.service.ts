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
import { slugifyContent } from './news.utils'
import { data } from '@/lib/constants/public'
// // eslint-disable-next-line @typescript-eslint/no-require-imports
// const data: OldData[] = await require('./../../../../../script/blog_posts.json');


export interface INewsService {
  createNews(news: CreateNewsDTO): Promise<NewsDTO | null | ApiCustomError>
  editNews(id: string, news: Partial<CreateNewsDTO>): Promise<NewsDTO | null | ApiCustomError>
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

  async updateOldData(): Promise<string> {
    console.log('Starting to update old data...');
    console.log(`Loaded ${data.length} items from blog_posts.json`);

    const savedCategories: { [key: string]: number } = {}
    const savedTags: { [key: string]: number } = {}

    for (const dataItem of data) {
      console.log(`Processing item: ${dataItem.title}`);
      // Process each item from blog_post.json
      // Save categories
      for (const category of dataItem.categories) {
        if (!savedCategories[category]) {
          console.log(`Creating new category: ${category}`);
          const newlyCreatedCategory = await this.repository.createNewsCategory({
            name: category,
            slug: category.toLowerCase().replace(/\s+/g, '-'),
          })

          if (newlyCreatedCategory && !('error' in newlyCreatedCategory)) {
            savedCategories[category] = (newlyCreatedCategory as NewsCategoryDTO).id
            console.log(`Category created with ID: ${savedCategories[category]}`);
          } else {
            console.log('Failed to create category:', newlyCreatedCategory);
          }
        }
      }

      // Save tags
      for (const tag of dataItem.tags) {
        if (!savedTags[tag]) {
          console.log(`Creating new tag: ${tag}`);
          const newlyCreatedTag = await this.repository.createTag({
            name: tag,
            slug: tag.toLowerCase().replace(/\s+/g, '-'),
          })

          if (newlyCreatedTag && !('error' in newlyCreatedTag)) {
            savedTags[tag] = (newlyCreatedTag as TagDTO).id
            console.log(`Tag created with ID: ${savedTags[tag]}`);
          } else {
            console.log('Failed to create tag:', newlyCreatedTag);
          }
        }
      }

      // Create the news item
      console.log(`Creating news item: ${dataItem.title}`);
      const newsData: CreateNewsDTO = {
        title: dataItem.title,
        pubDate: new Date(dataItem.date),
        published: dataItem.status === 'publish',
        summary: dataItem.title,
        slug: dataItem.slug ?? slugifyContent(dataItem.title),
        contentEncoded: dataItem.content,
        coverImage: dataItem.cover_image
      }

      const createdNews = await this.repository.createNews(newsData)

      if (createdNews && !('error' in createdNews)) {
        console.log(`News created with slug: ${(createdNews as NewsDTO).slug}`);

        // Assign categories to news
        const categoryIds = dataItem.categories
          .map((category) => savedCategories[category])
          .filter((id) => id !== undefined)

        if (categoryIds.length > 0) {
          console.log(`Assigning ${categoryIds.length} categories to news`);
          await this.repository.assignCategoriesToNews((createdNews as NewsDTO).slug, categoryIds)
        }

        // Assign tags to news
        const tagIds = dataItem.tags.map((tag) => savedTags[tag]).filter((id) => id !== undefined)

        if (tagIds.length > 0) {
          console.log(`Assigning ${tagIds.length} tags to news`);
          await this.repository.assignTagsToNews((createdNews as NewsDTO).slug, tagIds)
        }
      } else {
        console.log('Failed to create news item:', createdNews);
      }

      console.log(`Finished processing: ${dataItem.title}`);
    }

    return "Data migration completed successfully"
  }
}
