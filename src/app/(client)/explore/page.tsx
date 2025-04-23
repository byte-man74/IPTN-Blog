import React from 'react'
import { NewsFilterDTO } from '@/app/(server)/modules/news/news.types'
import { createServerAxiosInstance } from '@/network/server.constructor'
import { routes } from '@/network/route'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { NewsQueryKey } from '@/network/query-keys/news'
import { logger } from '@/lib/utils/logger'
import { Metadata, ResolvingMetadata } from 'next'
import MainNavBanner from '@/_components/public/main-nav-banner'
import GlobalSocialBanner from '@/_components/public/social-banner'
import SearchPageClient from '@/_components/pages/public-explore/search-page-client'

type SearchPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { searchParams }: SearchPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const awaitedSearchParams = await searchParams
  const query = awaitedSearchParams.q ? (awaitedSearchParams.q as string) : ''
  const category = awaitedSearchParams.category ? (awaitedSearchParams.category as string) : ''
  const tag = awaitedSearchParams.tag ? (awaitedSearchParams.tag as string) : ''
  const siteName = (await parent).title?.absolute || 'IPTN Blog'

  let title = `Search | ${siteName}`
  let description = 'Search for articles and news on our site.'

  if (query) {
    title = `Search results for "${query}" | ${siteName}`
    description = `Browse search results for "${query}" on our site.`
  } else if (category) {
    title = `Category: ${category} | ${siteName}`
    description = `Browse articles in the ${category} category.`
  } else if (tag) {
    title = `Tag: ${tag} | ${siteName}`
    description = `Browse articles tagged with ${tag}.`
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const awaitedSearchParams = await searchParams
  const query = awaitedSearchParams.q ? (awaitedSearchParams.q as string) : ''
  const category = awaitedSearchParams.category ? (awaitedSearchParams.category as string) : ''
  const tag = awaitedSearchParams.tag ? (awaitedSearchParams.tag as string) : ''
  const page = awaitedSearchParams.page ? parseInt(awaitedSearchParams.page as string) : 1
  const limit = 12 // Number of results per page

  // Create query client for server components
  const queryClient = new QueryClient()

  // Only fetch results if there's a search query, category, or tag
  if (query || category || tag) {
    try {
      // Create filter for search
      const filter: NewsFilterDTO = {
        published: true,
        searchTerm: query || undefined,
        categorySlug: category || undefined,
      }

      // Add tag filter if present
      // Note: We only have the tag name from URL, actual tagId needs to be found on client
      // The client component will handle this based on the tag name

      // Prefetch search results
      await queryClient.prefetchQuery({
        queryKey: [NewsQueryKey.NEWS, filter, page, limit],
        queryFn: async () => {
          try {
            const response = await createServerAxiosInstance(routes.news.list, {
              params: {
                ...filter,
                page,
                limit,
              },
            })

            if (!response) {
              throw new Error('Failed to fetch search results')
            }

            return response.data
          } catch (error) {
            logger.error(`Error fetching results:`, error)
            throw error
          }
        },
      })
    } catch (error) {
      logger.error(`Failed to load results on explore page`, error)
    }
  }

  // Get the dehydrated state to pass to the client
  const dehydratedState = dehydrate(queryClient)

  return (
    <div className="relative flex flex-col items-center bg-gray-50 min-h-screen">
      <GlobalSocialBanner />
      <MainNavBanner />

      <HydrationBoundary state={dehydratedState}>
        <SearchPageClient
          initialQuery={query}
          initialPage={page}
          limit={limit}
          initialCategory={category}
          initialTag={tag}
        />
      </HydrationBoundary>
    </div>
  )
}
