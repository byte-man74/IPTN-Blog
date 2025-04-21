import { logger } from '@/lib/utils/logger'
import { NewsRepository } from './news.repository'
import { CreateNewsDTO, NewsCategoryDTO, NewsDTO, TagDTO } from './news.types'
import { slugifyContent } from './news.utils'

// // eslint-disable-next-line @typescript-eslint/no-require-imports
// const data: OldData[] = await require('./../../../../../script/blog_posts.json');
// Define the data structure for the old blog posts
interface OldDataItem {
  title: string
  date: string
  status: string
  slug?: string
  content: string
  cover_image: string
  categories: string[]
  tags: string[]
}

export class NewsScripts {
  private readonly repository: NewsRepository

  constructor() {
    this.repository = new NewsRepository()
  }

  async updateOldData(data: OldDataItem[]): Promise<string> {
    logger.info('Starting to update old data...')
    logger.info(`Loaded ${data.length} items from blog_posts.json`)

    const savedCategories: { [key: string]: number } = {}
    const savedTags: { [key: string]: number } = {}

    for (const dataItem of data) {
      logger.info(`Processing item: ${dataItem.title}`)
      // Process each item from blog_post.json
      // Save categories
      for (const category of dataItem.categories) {
        if (!savedCategories[category]) {
          logger.info(`Creating new category: ${category}`)
          const newlyCreatedCategory = await this.repository.createNewsCategory({
            name: category,
            slug: category.toLowerCase().replace(/\s+/g, '-'),
          })

          if (newlyCreatedCategory && !('error' in newlyCreatedCategory)) {
            savedCategories[category] = (newlyCreatedCategory as NewsCategoryDTO).id
            logger.info(`Category created with ID: ${savedCategories[category]}`)
          } else {
            logger.info('Failed to create category:', newlyCreatedCategory)
          }
        }
      }

      // Save tags
      for (const tag of dataItem.tags) {
        if (!savedTags[tag]) {
          logger.info(`Creating new tag: ${tag}`)
          const newlyCreatedTag = await this.repository.createTag({
            name: tag.toLowerCase().replace(/\s+/g, '-'),
          })

          if (newlyCreatedTag && !('error' in newlyCreatedTag)) {
            savedTags[tag] = (newlyCreatedTag as TagDTO).id
            logger.info(`Tag created with ID: ${savedTags[tag]}`)
          } else {
            logger.info('Failed to create tag:', newlyCreatedTag)
          }
        }
      }

      // Create the news item
      logger.info(`Creating news item: ${dataItem.title}`)
      const newsData: CreateNewsDTO = {
        title: dataItem.title,
        pubDate: new Date(dataItem.date),
        published: dataItem.status === 'publish',
        summary: dataItem.title,
        slug: dataItem.slug ?? slugifyContent(dataItem.title),
        contentEncoded: dataItem.content,
        coverImage: dataItem.cover_image,
      }

      const createdNews = await this.repository.createNews(newsData)

      if (createdNews && !('error' in createdNews)) {
        logger.info(`News created with slug: ${(createdNews as NewsDTO).slug}`)

        // Assign categories to news
        const categoryIds = dataItem.categories
          .map((category: string) => savedCategories[category])
          .filter((id: number | undefined) => id !== undefined)

        if (categoryIds.length > 0) {
          logger.info(`Assigning ${categoryIds.length} categories to news`)
          await this.repository.assignCategoriesToNews((createdNews as NewsDTO).slug, categoryIds)
        }

        // Assign tags to news
        const tagIds = dataItem.tags
          .map((tag: string) => savedTags[tag])
          .filter((id: number | undefined) => id !== undefined)

        if (tagIds.length > 0) {
          logger.info(`Assigning ${tagIds.length} tags to news`)
          await this.repository.assignTagsToNews((createdNews as NewsDTO).slug, tagIds)
        }
      } else {
        logger.info('Failed to create news item:', createdNews)
      }

      logger.info(`Finished processing: ${dataItem.title}`)
    }

    return 'Data migration completed successfully'
  }
}
