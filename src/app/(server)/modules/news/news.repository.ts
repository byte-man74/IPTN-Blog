import { PrismaClient } from '@prisma/client'
import {
  CommentDTO,
  CreateCommentSchemaDTO,
  CreateNewsCategoryDTO,
  CreateNewsDTO,
  CreateTagDTO,
  FullNewsDTO,
  NewsCategoryDTO,
  NewsDTO,
  NewsFilterDTO,
  UpdateNewsDTO,
  TagDTO,
} from '@/app/(server)/modules/news/news.types'
import ApiCustomError from '@/types/api-custom-error'
import { tryCatchHandler } from '@/lib/utils/try-catch-handler'
import { encodeNewsTitleContent, getNewsSummary, slugifyContent } from '@/app/(server)/modules/news/news.utils'
import { paginate } from 'prisma-extension-pagination'
import { PageNumberCounters, PageNumberPagination } from 'prisma-extension-pagination/dist/types'

const prisma = new PrismaClient().$extends({
  model: {
    news: {
      paginate,
    },
  },
})

export class NewsRepository {
  private readonly news = prisma.news
  private readonly category = prisma.category
  private readonly tag = prisma.tag
  private readonly comment = prisma.comment

  async createNews(news: CreateNewsDTO): Promise<NewsDTO | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      return await this.news.create({
        data: {
          title: news.title,
          summary: news.summary ?? getNewsSummary(news.contentEncoded as ''),
          slug: news.slug ?? slugifyContent(news.title),
          pubDate: news.pubDate,
          contentEncoded: news.contentEncoded,
          authorId: news.authorId,
          coverImage: news.coverImage,
          published: news.published,
          categories: news.categoryIds
            ? {
                connect: news.categoryIds.map((id) => ({ id })),
              }
            : undefined,
          tags: news.tagIds
            ? {
                connect: news.tagIds.map((id) => ({ id })),
              }
            : undefined,
        },
        include: {
          categories: true,
          tags: true,
        },
      })
    })
  }

  async editNews(
    slug: string,
    news: Partial<UpdateNewsDTO>
  ): Promise<FullNewsDTO | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: any = { ...news }

      // Generate slug if title is being updated and no slug is provided
      if (news.title && !news.slug) {
        updateData.slug = slugifyContent(news.title)
      }

      // Generate summary if content is being updated and no summary is provided
      if (news.contentEncoded && !news.summary) {
        updateData.summary = getNewsSummary(news.contentEncoded)
      }

      // Handle category connections if provided
      if ('categoryIds' in news) {
        updateData.categories = {
          set: [],
          connect: news.categoryIds?.map((id) => ({ id })) || [],
        }
        // Remove categoryIds from updateData as it's not a direct field
        delete updateData.categoryIds
      }

      // Handle tag connections if provided
      if ('tagIds' in news) {
        updateData.tags = {
          set: [],
          connect: news.tagIds?.map((id) => ({ id })) || [],
        }
        // Remove tagIds from updateData as it's not a direct field
        delete updateData.tagIds
      }

      return await this.news.update({
        where: { slug },
        data: updateData,
        include: {
          categories: true,
          tags: true,
          seo: true,
        },
      })
    })
  }

  // Get a single news item by ID
  async getNewsBySlug(slug: string): Promise<FullNewsDTO | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      return await this.news.findUnique({
        where: { slug },
        include: {
          categories: true,
          tags: true,
          comments: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  image: true,
                },
              },
            },
          },
          seo: true,
          analytics: true,
        },
      })
    })
  }

  //generic api to grab news and filter by key metric
  async getNewsWithFilters(
    filters: NewsFilterDTO,
    page: number = 1,
    limit: number = 20
  ): Promise<
    { data: NewsDTO[]; meta: PageNumberPagination & PageNumberCounters } | null | ApiCustomError
  > {
    return tryCatchHandler(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const where: any = {}

      if (filters.authorId) {
        where.authorId = filters.authorId
      }

      if (filters.published !== null && filters.published !== undefined) {
        where.published = filters.published
      }

      if (filters.startDate && filters.endDate) {
        where.pubDate = {
          gte: filters.startDate,
          lte: filters.endDate,
        }
      } else if (filters.startDate) {
        where.pubDate = {
          gte: filters.startDate,
        }
      } else if (filters.endDate) {
        where.pubDate = {
          lte: filters.endDate,
        }
      }

      if (filters.searchTerm) {
        where.OR = [
          { title: { contains: encodeNewsTitleContent(filters.searchTerm), mode: 'insensitive' } },
          { title: { contains: filters.searchTerm, mode: 'insensitive' } },
          { summary: { contains: encodeNewsTitleContent(filters.searchTerm), mode: 'insensitive' } },
          { summary: { contains: filters.searchTerm, mode: 'insensitive' } },
          { contentEncoded: { contains: encodeNewsTitleContent(filters.searchTerm), mode: 'insensitive' } },
          { contentEncoded: { contains: filters.searchTerm, mode: 'insensitive' } },
        ]
      }

      // Filter by categories if provided - using AND logic to require all categories
      if (filters.categoryIds && filters.categoryIds.length > 0) {
        where.AND = filters.categoryIds.map((categoryId) => ({
          categories: {
            some: {
              id: categoryId,
            },
          },
        }))
      }

      // Filter by category slugs if provided
      if (filters.categorySlugs && filters.categorySlugs.length > 0) {
        if (!where.AND) {
          where.AND = []
        }

        filters.categorySlugs.forEach((slug) => {
          where.AND.push({
            categories: {
              some: {
                slug: slug,
              },
            },
          })
        })
      }

      // Filter by single category slug if provided
      if (filters.categorySlug) {
        if (!where.AND) {
          where.AND = []
        }
        where.AND.push({
          categories: {
            some: {
              slug: filters.categorySlug,
            },
          },
        })
      }

      // Filter by tags if provided
      if (filters.tagIds && filters.tagIds.length > 0) {
        where.tags = {
          some: {
            id: { in: filters.tagIds },
          },
        }
      }

      const news = this.news.paginate({
        where,
        select: {
          id: true,
          slug: true,
          title: true,
          pubDate: true,
          published: true,
          createdAt: true,
          lastUpdated: true,
          coverImage: true,
          summary: true,
          categories: true,
          tags: true,
          analytics: {
            select: {
              views: true,
              likes: true,
              shares: true,
              readDuration: true,
            },
          },
          comments: {
            select: {
              id: true,
            },
          },
          author: {
            select: {
              id: true,
              firstName: true,
              image: true,
            },
          },
        },
        orderBy: filters.byPopularity ? { analytics: { views: 'desc' } } : { pubDate: 'desc' },
      })

      const paginatedResults = await news.withPages({
        limit: limit,
        page,
        includePageCount: true,
      })

      if (!paginatedResults?.[0]) {
        return {
          data: [],
          meta: paginatedResults[1],
        }
      }

      return {
        data: paginatedResults[0],
        meta: paginatedResults[1],
      }
    })
  }

  //this should be really quick
  async createNewsCategory(
    category: CreateNewsCategoryDTO
  ): Promise<NewsCategoryDTO | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      return await this.category.upsert({
        where: { slug: category.slug ?? slugifyContent(category.name) },
        update: {
          name: category.name,
          description: category.description,
        },
        create: {
          name: category.name,
          slug: category.slug ?? slugifyContent(category.name),
          description: category.description,
        },
      })
    })
  }

  //this should be really quick
  async createTag(tag: CreateTagDTO): Promise<TagDTO | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      return await this.tag.upsert({
        where: { name: slugifyContent(tag.name) },
        update: {},
        create: {
          name: slugifyContent(tag.name),
        },
      })
    })
  }

  // assign or remove tags from news
  async assignTagsToNews(
    slug: string,
    tagIds: number[],
    options: { remove?: boolean } = {}
  ): Promise<NewsDTO | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      if (options.remove) {
        // Remove specified tags
        return await this.news.update({
          where: { slug: slug },
          data: {
            tags: {
              disconnect: tagIds.map((id) => ({ id })),
            },
          },
          include: {
            tags: true,
            categories: true,
          },
        })
      } else {
        // Add specified tags
        return await this.news.update({
          where: { slug: slug },
          data: {
            tags: {
              connect: tagIds.map((id) => ({ id })),
            },
          },
          include: {
            tags: true,
            categories: true,
          },
        })
      }
    })
  }

  // assign or remove categories from news
  async assignCategoriesToNews(
    slug: string,
    categoryIds: number[],
    options: { remove?: boolean } = {}
  ): Promise<NewsDTO | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      if (options.remove) {
        return await this.news.update({
          where: { slug: slug },
          data: {
            categories: {
              disconnect: categoryIds.map((id) => ({ id })),
            },
          },
          include: {
            tags: true,
            categories: true,
          },
        })
      } else {
        // Add specified categories
        return await this.news.update({
          where: { slug: slug },
          data: {
            categories: {
              connect: categoryIds.map((id) => ({ id })),
            },
          },
          include: {
            tags: true,
            categories: true,
          },
        })
      }
    })
  }

  async deleteNews(slug: string): Promise<NewsDTO | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      // First find the news to ensure it exists
      const newsExists = await this.news.findUnique({
        where: { slug },
      })

      if (!newsExists) {
        throw new ApiCustomError('News not found', 404)
      }

      // Delete the news
      return await this.news.delete({
        where: { slug },
        include: {
          categories: true,
          tags: true,
        },
      })
    })
  }

  //fetch categories
  async fetchCategories(): Promise<NewsCategoryDTO[] | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      return await this.category.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
        },
      })
    })
  }

  //fetch tags
  async fetchTags(): Promise<TagDTO[] | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      return await this.tag.findMany({
        select: {
          id: true,
          name: true,
        },
      })
    })
  }

  async getPopularTags(): Promise<TagDTO[] | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      // Find tags that are used in published news articles with high view count
      const tagsWithCount = await this.tag.findMany({
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              news: {
                where: {
                  published: true,
                  analytics: {
                    views: {
                      gt: 10,
                    },
                  },
                },
              },
            },
          },
        },
        where: {
          news: {
            some: {
              published: true,
              analytics: {
                views: {
                  gt: 10,
                },
              },
            },
          },
        },
        orderBy: {
          news: {
            _count: 'desc',
          },
        },
        take: 8, // Limit to top 10 most popular tags
      })

      // Transform the result to match TagDTO structure
      return tagsWithCount.map((tag) => ({
        id: tag.id,
        name: tag.name,
      }))
    })
  }

  async shouldRegenerateSeoImages(
    slug: string,
    updatedNews: Partial<UpdateNewsDTO>
  ): Promise<boolean> {
    // Only fetch the necessary fields (title and coverImage) to check if they've changed
    const originalNews = await this.news.findUnique({
      where: { slug },
      select: {
        title: true,
        coverImage: true,
      },
    })

    if (!originalNews) return true

    return !!(
      (updatedNews.title && updatedNews.title !== originalNews.title) ||
      (updatedNews.coverImage && updatedNews.coverImage !== originalNews.coverImage)
    )
  }

  async shouldSetupAnalytics(slug: string, updatedNews: Partial<UpdateNewsDTO>): Promise<boolean> {
    // Check if the news article already has analytics
    const newsWithAnalytics = await this.news.findUnique({
      where: { slug },
      select: {
        analytics: true,
        contentEncoded: true,
      },
    })

    if (!newsWithAnalytics) return true

    // If there are no analytics yet, we should set them up
    if (!newsWithAnalytics.analytics) return true

    // If content has changed, we might need to update reading duration
    if (
      updatedNews.contentEncoded &&
      updatedNews.contentEncoded !== newsWithAnalytics.contentEncoded
    ) {
      return true
    }

    return false
  }

  async fetchRelatedNews(slug: string): Promise<NewsDTO[] | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      // First get the current news to find its categories
      const currentNews = await this.news.findUnique({
        where: { slug },
        include: {
          categories: true,
        },
      })

      if (!currentNews) {
        return []
      }

      // Extract category IDs from the current news
      const categoryIds = currentNews.categories.map((category) => category.id)

      // Find related news that share categories with the current news
      // but exclude the current news itself
      const relatedNews = await this.news.findMany({
        where: {
          id: { not: currentNews.id },
          published: true,
          categories: {
            some: {
              id: { in: categoryIds },
            },
          },
        },
        include: {
          categories: true,
          tags: true,
          analytics: true,
        },
        orderBy: {
          pubDate: 'desc',
        },
        take: 5, // Limit to 5 related articles
      })

      return relatedNews
    })
  }

  async createNewsComment(
    data: CreateCommentSchemaDTO
  ): Promise<CommentDTO | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      return await this.comment.create({
        data: {
          content: data.content,
          newsId: data.newsId,
          userId: data.userId || null,
          isAnonymous: data.isAnonymous || false,
        },
      })
    })
  }
}
