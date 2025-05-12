import HomePageContent from '@/_components/pages/public-home'
import { createServerAxiosInstance } from '@/network/server.constructor'
import { routes } from '@/network/route'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { NewsQueryKey } from '@/network/query-keys/news'
import { logger } from '@/lib/utils/logger'
import { CONTENT_CRITERIA } from '@/app/(server)/modules/site-configurations/site-config.constants'

export default async function Home() {
  const queryClient = new QueryClient()

  try {
    // Prefetch editor's pick news
    await queryClient.prefetchQuery({
      queryKey: [
        NewsQueryKey.NEWS,
        { categorySlug: CONTENT_CRITERIA.editorsPick.slug },
        1,
        CONTENT_CRITERIA.editorsPick.threshold,
      ],
      queryFn: async () => {
        try {
          const response = await createServerAxiosInstance(routes.news.list, {
            params: {
              categorySlug: CONTENT_CRITERIA.editorsPick.slug,
              page: 1,
              limit: CONTENT_CRITERIA.editorsPick.threshold,
            },
          })
          if (!response) {
            throw new Error("Failed to fetch editor's pick news")
          }
          return response.data
        } catch (error) {
          logger.error("Error fetching editor's pick news:", error)
          throw error
        }
      },
    })

    // Prefetch main content news
    await queryClient.prefetchQuery({
      queryKey: [
        NewsQueryKey.NEWS,
        {
          published: true,
          categorySlugs: [CONTENT_CRITERIA.featured.slug, CONTENT_CRITERIA.articles.slug],
        },
        1,
        5,
      ],
      queryFn: async () => {
        try {
          const response = await createServerAxiosInstance(routes.news.list, {
            params: {
              published: true,
              categorySlugs: [CONTENT_CRITERIA.featured.slug, CONTENT_CRITERIA.articles.slug].join(
                ','
              ),
              page: 1,
              limit: 5,
            },
          })
          if (!response) {
            throw new Error('Failed to fetch main content news')
          }
          return response.data
        } catch (error) {
          logger.error('Error fetching main content news:', error)
          throw error
        }
      },
    })

    // Prefetch trending news
    await queryClient.prefetchQuery({
      queryKey: [
        NewsQueryKey.NEWS,
        { published: true, categorySlug: CONTENT_CRITERIA.trending.slug },
        1,
        3,
      ],
      queryFn: async () => {
        try {
          const response = await createServerAxiosInstance(routes.news.list, {
            params: {
              published: true,
              categorySlug: CONTENT_CRITERIA.trending.slug,
              page: 1,
              limit: 3,
            },
          })
          if (!response) {
            throw new Error('Failed to fetch trending news')
          }
          return response.data
        } catch (error) {
          logger.error('Error fetching trending news:', error)
          throw error
        }
      },
    })

    const dehydratedState = dehydrate(queryClient)

    return (
      <HydrationBoundary state={dehydratedState}>
        <HomePageContent />
      </HydrationBoundary>
    )
  } catch (error) {
    logger.error('Failed to prefetch home page data:', error)
    return <HomePageContent />
  }
}
