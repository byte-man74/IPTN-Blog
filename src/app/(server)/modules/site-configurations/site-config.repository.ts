import { prisma } from '@/lib/third-party/prisma'
import { tryCatchHandler } from '@/lib/utils/try-catch-handler'
import ApiCustomError from '@/types/api-custom-error'
import {
  CategoryHealthReport,
  ContentCriteria,
  ContentHealthResult,
  HealthStatus,
  SiteConfigurationDTO,
  SiteHealthReport,
} from './site-config.types'
import {
  CATEGORY_CRITERIA,
  CONTENT_CRITERIA,
  CONTENT_FRESHNESS_DAYS,
} from './site-config.constants'

export class SiteConfigRepository {
  private readonly siteConfiguration = prisma.siteConfiguration
  private readonly news = prisma.news

  /**
   * Returns the standard include object for navigation queries
   */
  private getNavigationInclude() {
    return {
      navBarKeyCategories: {
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
        },
      },
      navBarSubCategories: {
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
        },
      },
    }
  }
  /**
   * Navigation Configuration Methods
   */

  /**
   * Sets up the basic site configuration with empty navigation categories
   */

  async setUpBasicSiteConfiguration(): Promise<ApiCustomError | null | SiteConfigurationDTO> {
    return tryCatchHandler(async () => {
      return await this.siteConfiguration.create({
        data: {
          id: 1,
          navBarKeyCategories: { connect: [] },
          navBarSubCategories: { connect: [] },
        },
        include: this.getNavigationInclude(),
      })
    })
  }
  /**
   * Configures site navigation with key and sub categories
   */
  async configureNavigation(
    keyCategories: number[],
    subCategories: number[]
  ): Promise<ApiCustomError | null | SiteConfigurationDTO> {
    return tryCatchHandler(async () => {
      // First disconnect all existing connections
      await this.siteConfiguration.update({
        where: { id: 1 },
        data: {
          navBarKeyCategories: { set: [] },
          navBarSubCategories: { set: [] },
        },
      })

      // Then connect the new categories in the specified order
      return await this.siteConfiguration.update({
        where: { id: 1 },
        data: {
          navBarKeyCategories: {
            connect: keyCategories.map((id) => ({ id })),
          },
          navBarSubCategories: {
            connect: subCategories.map((id) => ({ id })),
          },
        },
        include: this.getNavigationInclude(),
      })
    })
  }

  /**
   * Gets the current site configuration
   */
  async getSiteConfiguration(): Promise<ApiCustomError | null | SiteConfigurationDTO> {
    return tryCatchHandler(async () => {
      return await this.siteConfiguration.findUnique({
        where: { id: 1 },
        include: this.getNavigationInclude(),
      })
    })
  }

  async checkSiteContentHealth(): Promise<SiteHealthReport | ApiCustomError | null> {
    return tryCatchHandler(async () => {
      // Get site configuration to determine key categories
      const siteConfig = await this.getSiteConfiguration()

      if (!siteConfig || siteConfig instanceof ApiCustomError) {
        return {
          homePageHealth: [
            {
              status: 'error' as HealthStatus,
              message: 'Site configuration not found',
            },
          ],
          categoryHealth: [],
          lastCheckedAt: new Date(),
          overallStatus: 'error' as HealthStatus,
        }
      }

      // Check home page health (uses "Home Page" criteria)
      const homePageHealth = await this.checkHomePageContentHealth()

      // Check health for each key category
      const categoryHealth = await Promise.all(
        siteConfig.navBarKeyCategories.map(async (category, index) => {
          let checks: ContentHealthResult[] = []

          // Get the appropriate criteria based on category index
          const categoryCriteria = CATEGORY_CRITERIA.find((c) => c.index === index)

          if (categoryCriteria) {
            checks = await this.checkCategoryContentHealth(category.id, categoryCriteria.criteria)
          } else {
            // Use generic health check for any category not explicitly defined
            checks = await this.checkGenericCategoryHealth(category.id)
          }

          // Determine overall status (error > warning > healthy)
          const hasError = checks.some((check) => check.status === 'error')
          const hasWarning = checks.some((check) => check.status === 'warning')
          const overallStatus = hasError
            ? ('error' as HealthStatus)
            : hasWarning
              ? ('warning' as HealthStatus)
              : ('healthy' as HealthStatus)

          return {
            categoryId: category.id,
            categoryName: category.name,
            checks,
            overallStatus,
          } as CategoryHealthReport
        })
      )

      // Determine overall site health
      const allChecks = [...homePageHealth, ...categoryHealth.flatMap((cat) => cat.checks)]
      const hasError = allChecks.some((check) => check.status === 'error')
      const hasWarning = allChecks.some((check) => check.status === 'warning')
      const overallStatus = hasError
        ? ('error' as HealthStatus)
        : hasWarning
          ? ('warning' as HealthStatus)
          : ('healthy' as HealthStatus)

      return {
        homePageHealth,
        categoryHealth,
        lastCheckedAt: new Date(),
        overallStatus,
      }
    })
  }

  /**
   * Checks the content health of the home page
   */
  async checkHomePageContentHealth(): Promise<ContentHealthResult[]> {
    const homeCriteria = CATEGORY_CRITERIA.find((c) => c.index === 0)?.criteria || []

    return this.performContentChecks(homeCriteria)
  }

  /**
   * Check content health for a specific category using provided criteria
   */
  async checkCategoryContentHealth(
    categoryId: number,
    criteria: Array<ContentCriteria>
  ): Promise<ContentHealthResult[]> {
    return await Promise.all(
      criteria.map(async (criterion) => {
        return await this.checkContentAgainstCriteria(categoryId, criterion)
      })
    )
  }

  /**
   * Perform a set of content checks based on criteria
   */
  async performContentChecks(criteria: Array<ContentCriteria>): Promise<ContentHealthResult[]> {
    return await Promise.all(
      criteria.map(async (criterion) => {
        return await this.checkContentAgainstCriteria(null, criterion)
      })
    )
  }

  /**
   * Creates a filter for content based on category and criterion
   */
  private createContentFilter(categoryId: number | null, criterion: ContentCriteria) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = { published: true }

    // Apply category filter if provided
    if (categoryId) {
      filter.categories = {
        some: { id: categoryId },
      }
    }

    // Apply specific content type filter based on criterion
    if (criterion.slug) {
      if (filter.categories) {
        // If we already have a category filter by ID, we need to add a second condition
        // We can't use array in some, so we need to use AND with multiple conditions
        filter.AND = [
          { categories: { some: { id: categoryId } } },
          { categories: { some: { slug: criterion.slug } } },
        ]
        // Remove the original categories filter since we're using AND
        delete filter.categories
      } else {
        // No existing category filter, just add the slug filter
        filter.categories = {
          some: { slug: criterion.slug },
        }
      }
    }

    return filter
  }

  /**
   * Check specific content against a criterion
   */
  async checkContentAgainstCriteria(
    categoryId: number | null,
    criterion: ContentCriteria
  ): Promise<ContentHealthResult> {
    const staleDate = new Date()
    staleDate.setDate(staleDate.getDate() - CONTENT_FRESHNESS_DAYS)

    try {
      // Create the base filter
      const filter = this.createContentFilter(categoryId, criterion)

      // Apply freshness filter if required
      const freshFilter = { ...filter }
      if (criterion.requiresFresh) {
        if (freshFilter.AND) {
          freshFilter.AND.push({ pubDate: { gte: staleDate } })
        } else {
          freshFilter.pubDate = { gte: staleDate }
        }
      }

      // Count content matching our criteria
      const contentCount = await this.news.count({ where: filter })

      // Count fresh content if freshness is required
      let freshCount = contentCount
      if (criterion.requiresFresh) {
        freshCount = await this.news.count({ where: freshFilter })
      }

      // Determine status based on threshold and maxThreshold
      let status: HealthStatus = 'healthy'
      let message = ''

      // Check if we have enough content
      if (contentCount < criterion.threshold) {
        status = criterion.severity
        message = `Not enough ${criterion.name} (${contentCount}/${criterion.threshold})`
      }
      // Check if we have too much content (if maxThreshold is defined)
      else if (criterion.maxThreshold && contentCount > criterion.maxThreshold) {
        status = criterion.severity
        message = `Too many ${criterion.name} (${contentCount}/${criterion.maxThreshold})`
      }
      // Check if content is fresh when required
      else if (criterion.requiresFresh && freshCount === 0) {
        status = criterion.severity
        message = `No fresh ${criterion.name} available`
      }
      // All is well
      else {
        message = criterion.maxThreshold
          ? `Appropriate number of ${criterion.name} available`
          : `Enough ${criterion.name} available`
      }

      return {
        status,
        message,
        details: {
          required: criterion.threshold,
          current: contentCount,
          maxThreshold: criterion?.maxThreshold,
          isFresh: freshCount > 0,
        },
      }
    } catch (error) {
      console.error(`Error checking content for criterion ${criterion.name}:`, error)

      // Return an error result if something goes wrong
      return {
        status: 'error' as HealthStatus,
        message: `Failed to check ${criterion.name}: ${(error as Error).message}`,
      }
    }
  }

  /**
   * Generic health check for any category
   */
  async checkGenericCategoryHealth(categoryId: number): Promise<ContentHealthResult[]> {
    // Use the "anyContent" criterion for generic health checks
    return this.checkCategoryContentHealth(categoryId, [CONTENT_CRITERIA.anyContent])
  }

  /**
   * Performs a simple health check to determine if a full scan is needed
   * This is a lightweight check that can be called frequently to notify admins
   * when content health issues are detected
   */
  async performSimpleHealthCheck(): Promise<{ needsFullScan: boolean } | ApiCustomError | null> {
    return tryCatchHandler(async () => {
      // Get site configuration
      const siteConfig = await this.getSiteConfiguration()

      if (!siteConfig || siteConfig instanceof ApiCustomError) {
        return { needsFullScan: true }
      }

      // Check for minimum content requirements on homepage
      const homePageCheck = await this.checkHomePageContentHealth()
      if (homePageCheck.some((check) => check.status === 'error')) {
        return { needsFullScan: true }
      }

      // Quick check on key categories (just checking if they have any content)
      for (const category of siteConfig.navBarKeyCategories) {
        const categoryCheck = await this.checkGenericCategoryHealth(category.id)
        if (categoryCheck.some((check) => check.status === 'error')) {
          return { needsFullScan: true }
        }
      }

      return { needsFullScan: false }
    })
  }
}
