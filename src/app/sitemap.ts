import { MetadataRoute } from 'next'
import { ClientRoutes } from '@/lib/routes/client'
import { NewsDTO } from './(server)/modules/news/news.types'
import { logger } from '@/lib/utils/logger'
import { NewsService } from './(server)/modules/news/news.service'
import { SiteConfigService } from './(server)/modules/site-configurations/site-config.service'
import ApiCustomError from '@/types/api-custom-error'

const domain = process.env.NEXT_PUBLIC_SITE_URL || 'https://ipledgenigeria.com'

/**
 * Generates the static pages for the sitemap
 * @returns Array of static page entries for the sitemap
 */
function generateStaticPages(): MetadataRoute.Sitemap {
  return [
    {
      url: `${domain}${ClientRoutes.home}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${domain}${ClientRoutes.explore}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${domain}${ClientRoutes.contact}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]
}

/**
 * Fetches and generates topic pages for the sitemap
 * @returns Array of topic page entries for the sitemap
 */
async function generateTopicPages(): Promise<MetadataRoute.Sitemap> {
  try {
    const siteConfigService = new SiteConfigService()
    const siteConfig = await siteConfigService.getSiteConfig()

    if (siteConfig instanceof ApiCustomError) {
      logger.error('Error fetching site configuration for sitemap:', siteConfig.message)
      return []
    }

    if (siteConfig?.navBarKeyCategories?.length) {
      return siteConfig.navBarKeyCategories
        .filter((category) => category.slug)
        .map((category) => ({
          url: `${domain}/${category.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        }))
    }
    return []
  } catch (error) {
    logger.error('Error fetching site configuration for sitemap:', error)
    return []
  }
}

/**
 * Fetches and generates news article pages for the sitemap
 * @returns Array of news article page entries for the sitemap
 */
async function generateNewsPages(): Promise<MetadataRoute.Sitemap> {
  try {
    const newsService = new NewsService()
    const pageSize = 100 // Reasonable page size
    let currentPage = 1
    let hasMorePages = true
    let allNewsPages: MetadataRoute.Sitemap = []

    // Fetch news in batches
    while (hasMorePages) {
      const result = await newsService.getNewsWithFilters(
        { published: true },
        currentPage,
        pageSize
      )

      if (result instanceof ApiCustomError) {
        logger.error(`Error fetching news for sitemap (page ${currentPage}):`, result.message)
        break
      }

      if (!result || !result.data || result.data.length === 0) {
        hasMorePages = false
        break
      }

      const newsPages = result.data.map((article: NewsDTO) => ({
        url: `${domain}/news/${article.slug}`,
        lastModified: new Date(article.lastUpdated || article.pubDate),
        changeFrequency: 'daily' as const,
        priority: 0.7,
      }))

      allNewsPages = [...allNewsPages, ...newsPages]

      // Check if we've reached the last page
      if (result.data.length < pageSize) {
        hasMorePages = false
      } else {
        currentPage++
      }
    }

    return allNewsPages
  } catch (error) {
    logger.error('Error fetching news for sitemap:', error)
    return []
  }
}

/**
 * Generates the complete sitemap for the website
 * @returns Complete sitemap with all pages
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = generateStaticPages()
  const topicPages = await generateTopicPages()
  const newsPages = await generateNewsPages()

  return [...staticPages, ...topicPages, ...newsPages]
}
