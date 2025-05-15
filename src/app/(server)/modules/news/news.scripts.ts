import { logger } from '@/lib/utils/logger'
import { NewsRepository } from './news.repository'
import { CreateNewsDTO, FullNewsDTO, NewsCategoryDTO, NewsDTO, TagDTO } from './news.types'
import { slugifyContent } from './news.utils'
import { AnalyticsService } from '../analytics/analytics.service'

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





// Define the data structure for the old blog posts

//create articles
//create featured
//create a movies
//if the category is fashion-top change it to fashion
//if its featured-article just it to articles and featured
//assign latest-blogs to blogs
//assign politicss to politics
//assign video-interview to video and interview category
//assign trending to breaking category
//assign lifestyle-top to just lifestyle
//assign sports-news to just sports
//assign video-big to videos
//assign i-diaspora to diaspora
//assign fashion-top to fashion
//assign latest-news to news
//assign politics-news to politics and news
//assign entertainment-movie to movies and entertainment

export class NewsScripts {
  private readonly repository: NewsRepository
  private readonly analyticsService: AnalyticsService

  private data: OldDataItem[] = []
  constructor() {
    this.repository = new NewsRepository()
    this.analyticsService = new AnalyticsService()
  }

  async updateOldData(): Promise<string> {
    logger.info('Starting to update old data...')
    logger.info(`Loaded ${this.data.length} items from blog_posts.json`)

    const savedCategories: { [key: string]: number } = {}
    const savedTags: { [key: string]: number } = {}

    for (const dataItem of this.data) {
      logger.info(`Processing item: ${dataItem.title}`)

      // Process categories with mapping rules
      const processedCategories: string[] = []

      for (const category of dataItem.categories) {
        const categoriesToAdd: string[] = []

        // Apply category mapping rules
        if (category === 'fashion-top') {
          categoriesToAdd.push('fashion')
        } else if (category === 'featured-article') {
          categoriesToAdd.push('articles', 'featured')
        } else if (category === 'latest-blogs') {
          categoriesToAdd.push('blogs')
        } else if (category === 'politicss') {
          categoriesToAdd.push('politics')
        } else if (category === 'video-interview') {
          categoriesToAdd.push('video', 'interview')
        } else if (category === 'trending') {
          categoriesToAdd.push('breaking')
        } else if (category === 'lifestyle-top') {
          categoriesToAdd.push('lifestyle')
        } else if (category === 'sports-news') {
          categoriesToAdd.push('sports', 'news')
        } else if (category === 'video-big') {
          categoriesToAdd.push('videos')
        } else if (category === 'i-diaspora') {
          categoriesToAdd.push('diaspora')
        } else if (category === 'latest-news') {
          categoriesToAdd.push('news')
        } else if (category === 'politics-news') {
          categoriesToAdd.push('politics', 'news')
        } else if (category === 'entertainment-movie') {
          categoriesToAdd.push('movies', 'entertainment')
        } else if (category === 'right-now') {
          categoriesToAdd.push('trending')
        } else if (category === 'latest') {
          categoriesToAdd.push('top-picks')
        }else if (category === 'news-homepage') {
            categoriesToAdd.push('news')
          }else if (category === 'recommended-content') {
            categoriesToAdd.push('editors-pick')
          }
          else {
          // If no mapping rule, keep the original category
          categoriesToAdd.push(category)
        }

        // Add all processed categories
        processedCategories.push(...categoriesToAdd)
      }


      if (!processedCategories.includes('editors-pick')) {
        processedCategories.push('editors-picks')
      }


      if (!processedCategories.includes('trending')) {
        processedCategories.push('trending')
      }

      if (!processedCategories.includes('trending')) {
        processedCategories.push('trending')
      }


      if (!processedCategories.includes('top-picks')) {
        processedCategories.push('top-picks')
      }


      // Add default categories if needed
      if (!processedCategories.includes('articles')) {
        processedCategories.push('articles')
      }

      // Create movies category if needed
      if (dataItem.categories.some((cat) => cat.includes('movie'))) {
        processedCategories.push('movies')
      }

      // Remove duplicates
      const uniqueCategories = [...new Set(processedCategories)]

      // Save categories
      for (const category of uniqueCategories) {
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
        const categoryIds = uniqueCategories
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

        // Set up analytics for the news item
        logger.info(`Setting up analytics for news: ${(createdNews as NewsDTO).slug}`)
        // Check if createdNews is valid and not an ApiCustomError
        if (createdNews && !('error' in createdNews) && 'slug' in createdNews) {
          const fullNews = await this.repository.getNewsBySlug(createdNews.slug)

          // Only proceed with analytics if fullNews is valid and not null or ApiCustomError
          if (fullNews && !('error' in fullNews)) {
            const analyticsResult = await this.analyticsService.setUpNewsAnalytics(
              fullNews as FullNewsDTO,
              true
            )

            if (analyticsResult && 'error' in analyticsResult) {
              logger.info('Failed to set up analytics:', analyticsResult)
            } else {
              logger.info('Analytics set up successfully')
            }
          } else {
            logger.info('Failed to fetch full news details for analytics setup')
          }
        } else {
          logger.info('Cannot set up analytics: Invalid news data')
        }
      } else {
        logger.info('Failed to create news item:', createdNews)
      }

      logger.info(`Finished processing: ${dataItem.title}`)
    }

    return 'Data migration completed successfully'
  }
}
