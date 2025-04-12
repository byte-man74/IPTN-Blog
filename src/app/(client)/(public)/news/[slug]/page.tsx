import React from 'react'
import ViewNews from '@/_components/public/core/view-news'
import { createServerAxiosInstance } from '@/network/server.constructor'
import { routes } from '@/network/route'
import { Metadata } from 'next'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { FullNewsDTO } from '@/app/(server)/modules/news/news.types'
import { logger } from '@/lib/utils/logger'
import { NewsQueryKey } from '@/network/query-keys/news'
import { notFound } from 'next/navigation'

type NewsArticleProps = {
  params: { slug: string }
}

export async function generateMetadata({ params }: NewsArticleProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const response = await createServerAxiosInstance(routes.news.detail(slug))
    const newsData: FullNewsDTO = response.data

    if (!newsData) {
      return {
        title: 'News Article Not Found',
        description: 'The requested news article could not be found',
      }
    }

    
    return {
      title: newsData.title || 'News Article',
      description: newsData.summary || 'Read our latest news article',
      openGraph: {
        title: newsData.title,
        description: newsData.summary ?? "",
        images: newsData.seo?.openGraphImage ? [{ url: newsData.seo?.openGraphImage }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: newsData.title,
        description: newsData.summary ?? "",
        images: newsData.seo?.twitterImage ? [newsData.seo.twitterImage] : [],
      },
    }
  } catch (error) {
    logger.error('Error fetching news data for SEO:', error)
    return {
      title: 'News Article',
      description: 'Read our latest news article',
    }
  }
}

function generateStructuredData(newsData: FullNewsDTO) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: newsData.title,
    description: newsData.summary,
    image: newsData.coverImage,
    datePublished: newsData.pubDate,
    dateModified: newsData.lastUpdated,
    author: {
      '@type': 'Person',
      name: 'Editorial Team'
    },
    publisher: {
      '@type': 'Organization',
      name: 'IPTN',
      logo: {
        '@type': 'ImageObject',
        url: 'https://example.com/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_SITE_URL}/news/${newsData.slug}`
    }
  }
}

export default async function NewsArticle({ params }: NewsArticleProps) {
  const { slug } = await params
  const queryClient = new QueryClient()

  try {
    await queryClient.prefetchQuery({
      queryKey: [NewsQueryKey.NEWS_DETAILS, slug],
      queryFn: async () => {
        try {
          const response = await createServerAxiosInstance(routes.news.detail(slug))
          if (!response) {
            throw new Error('News article not found')
          }
          return response.data
        } catch (error) {
          logger.error('Error fetching news data:', error)
          throw error
        }
      }
    })

    const dehydratedState = dehydrate(queryClient)
    const newsData = queryClient.getQueryData<FullNewsDTO>([NewsQueryKey.NEWS_DETAILS, slug])

    if (!newsData) {
      notFound()
    }

    return (
      <div className="relative flex justify-center">
        {newsData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(generateStructuredData(newsData))
            }}
          />
        )}
        <HydrationBoundary state={dehydratedState}>
          <ViewNews slug={slug} />
        </HydrationBoundary>
      </div>
    )
  } catch (error) {
    logger.error(`Failed to load news article with slug: ${slug}`, error)
    notFound()
  }
}
