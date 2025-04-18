import React from 'react'
import { notFound } from 'next/navigation'
import { SecondPageContent } from '@/_components/pages/public-second'
import { ThirdPageContent } from '@/_components/pages/public-third'
import { FourthPageContent } from '@/_components/pages/public-fourth'
import { FifthNavPageContent } from '@/_components/pages/public-fifth'
import { createServerAxiosInstance } from '@/network/server.constructor'
import { routes } from '@/network/route'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { SiteConfigQueryKey } from '@/network/query-keys/site-config'
import { logger } from '@/lib/utils/logger'
import { SiteConfigurationDTO } from '@/app/(server)/modules/site-configurations/site-config.types'
import { Metadata, ResolvingMetadata } from 'next'
import { capitalizeString } from '@/app/(server)/modules/site-configurations/site-config.utils'

type TopicPageProps = {
  params: { topic: string }
}

// Generate dynamic metadata for better SEO
export async function generateMetadata(
  { params }: TopicPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const topic = await params.topic

  try {
    const response = await createServerAxiosInstance(routes.siteConfig.get)
    const siteConfig = response?.data as SiteConfigurationDTO

    const category = siteConfig?.navBarKeyCategories.find((cat) => cat.slug === topic)
    const categoryName = category?.name || capitalizeString(topic)
    const previousMetadata = await parent

    return {
      title: `${capitalizeString(categoryName)} | ${previousMetadata.title?.absolute || 'News Portal'}`,
      description: `Latest ${capitalizeString(categoryName)} news, updates, and featured stories`,
      keywords: [`${capitalizeString(categoryName)}`, 'news', 'updates', 'latest', 'featured'],
      openGraph: {
        title: `${categoryName} | News Portal`,
        description: `Discover the latest ${categoryName} news and updates`,
        url: `/${topic}`,
        siteName: previousMetadata.openGraph?.siteName || 'News Portal',
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${categoryName} | News Portal`,
        description: `Discover the latest ${categoryName} news and updates`,
      },
    }
  } catch (error) {
    logger.error('Error generating metadata for topic page:', error)
    return {
      title: capitalizeString(topic),
      description: `Latest news and updates on ${capitalizeString(topic)}`,
    }
  }
}

// Fetch site configuration data
async function fetchSiteConfig(queryClient: QueryClient) {
  await queryClient.prefetchQuery({
    queryKey: [SiteConfigQueryKey.SITE_CONFIG],
    queryFn: async () => {
      try {
        const response = await createServerAxiosInstance(routes.siteConfig.get)
        if (!response) {
          throw new Error('Site configuration not found')
        }
        return response.data
      } catch (error) {
        logger.error('Error fetching site configuration:', error)
        throw error
      }
    },
  })

  return dehydrate(queryClient)
}

// Map category index to appropriate content component
function getCategoryContent(categoryIndex: number, categoryId: number) {
  const contentMap = [
    <SecondPageContent key="second" category={categoryId} />,
    <ThirdPageContent key="third" category={categoryId} />,
    <FourthPageContent key="fourth" category={categoryId} />,
    <FifthNavPageContent key="fifth" category={categoryId} />,
  ]

  return contentMap[categoryIndex] || null
}

export default async function TopicPage({ params }: TopicPageProps) {
  const category = await params.topic
  const queryClient = new QueryClient()

  try {
    const dehydratedState = await fetchSiteConfig(queryClient)

    // Get the site configuration data to check if the category exists
    const siteConfig = queryClient.getQueryData<SiteConfigurationDTO>([
      SiteConfigQueryKey.SITE_CONFIG,
    ])

    // Validate if the category exists in navBarKeyCategories and get its index
    const categoryIndex = siteConfig?.navBarKeyCategories.findIndex((cat) => cat.slug === category)
    const categoryId = siteConfig?.navBarKeyCategories.find((cat) => cat.slug === category)?.id

    if (!siteConfig || categoryIndex === -1 || categoryIndex === undefined || !categoryId) {
      logger.warn(`Category not found in key categories: ${category}`)
      notFound()
    }

    const content = getCategoryContent(categoryIndex, categoryId)

    if (!content) {
      notFound()
    }

    return (
      <main>
        <HydrationBoundary state={dehydratedState}>{content}</HydrationBoundary>
      </main>
    )
  } catch (error) {
    logger.error('Failed to load topic page:', error)
    notFound()
  }
}
