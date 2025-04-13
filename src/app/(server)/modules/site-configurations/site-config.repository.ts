import { prisma } from '@/lib/third-party/prisma'
import { tryCatchHandler } from '@/lib/utils/try-catch-handler'
import ApiCustomError from '@/types/api-custom-error'
import { SiteConfigurationDTO } from './site-config.types'

export class SiteConfigRepository {
  private readonly siteConfiguration = prisma.siteConfiguration

  async setUpBasicSiteConfiguration(): Promise<ApiCustomError | null | SiteConfigurationDTO> {
    return tryCatchHandler(async () => {
      return await this.siteConfiguration.upsert({
        where: {
          id: 1,
        },
        create: {
          navBarKeyCategories: {
            connect: [],
          },
          navBarSubCategories: {
            connect: [],
          },
        },
        update: {
          navBarKeyCategories: {
            set: [],
          },
          navBarSubCategories: {
            set: [],
          },
        },
        include: {
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
        },
      })
    })
  }

  async configureNavigation(
    keyCategories: number[],
    subCategories: number[]
  ): Promise<ApiCustomError | null | SiteConfigurationDTO> {
    // Update navigation categories
    return tryCatchHandler(async () => {
      return await this.siteConfiguration.update({
        where: {
          id: 1,
        },
        data: {
          navBarKeyCategories: {
            connect: keyCategories.map((id) => ({ id })),
          },
          navBarSubCategories: {
            connect: subCategories.map((id) => ({ id })),
          },
        },
        include: {
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
        },
      })
    })
  }

  async getSiteConfiguration(): Promise<ApiCustomError | null | SiteConfigurationDTO> {
    return tryCatchHandler(async () => {
      return await this.siteConfiguration.findUnique({
        where: {
          id: 1
        },
        include: {
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
        },
      })
    })
  }
}
