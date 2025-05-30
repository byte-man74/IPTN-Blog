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
import MainNavBanner from '@/_components/public/main-nav-banner'
import GlobalSocialBanner from '@/_components/public/social-banner'
import ArticleNav from '@/_components/public/core/news-component/article-nav'
import { auth } from '@/auth'
import { ClientRoutes } from '@/lib/routes/client'

type Params = Promise<{ slug: string }>

type NewsArticleProps = {
  params: Params
}

export async function generateMetadata({ params }: NewsArticleProps): Promise<Metadata> {
  const params_resolved = await params
  const slug = params_resolved.slug
  const domain = process.env.NEXT_PUBLIC_SITE_URL || 'https://ipledgenigeria.com'

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
        description: newsData.summary ?? '',
        url: `${domain}/${ClientRoutes.viewNews(slug)}`,
        type: 'article',
        images: newsData.seo?.openGraphImage ? [{ url: newsData.seo?.openGraphImage }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: newsData.title,
        description: newsData.summary ?? '',
        images: newsData.seo?.twitterImage ? [newsData.seo.twitterImage] : [],
      },
      alternates: {
        canonical: `${domain}/${ClientRoutes.viewNews(slug)}`,
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
  const domain = process.env.NEXT_PUBLIC_SITE_URL || 'https://ipledgenigeria.com'
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
      name: 'Editorial Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'IPTN',
      logo: {
        '@type': 'ImageObject',
        url: `${domain}/assets/iptn-black.webp`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${domain}/news/${newsData.slug}`,
    },
    url: `${domain}/news/${newsData.slug}`,
    articleType: 'News Article'
  }
}

export default async function NewsArticle({ params }: NewsArticleProps) {
  const params_resolved = await params
  const slug = params_resolved.slug
  const queryClient = new QueryClient()
  const session = await auth()

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
      },
    })

    const dehydratedState = dehydrate(queryClient)
    const newsData = queryClient.getQueryData<FullNewsDTO>([NewsQueryKey.NEWS_DETAILS, slug])
    if (
      !newsData ||
      (!newsData.published && !(session?.user?.isAdmin && session?.user?.isActive))
    ) {
      notFound()
    }

    return (
      <div className="relative flex flex-col items-center bg-[#E4E4E4]">
        {newsData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(generateStructuredData(newsData)),
            }}
          />
        )}
        <HydrationBoundary state={dehydratedState}>
          <GlobalSocialBanner />
          <MainNavBanner />
          <div className="relative w-full flex flex-col items-center">
            <ArticleNav />
            <ViewNews slug={slug} />
          </div>
        </HydrationBoundary>
      </div>
    )
  } catch (error) {
    logger.error(`Failed to load news article with slug: ${slug}`, error)
    notFound()
  }
}
