import React from 'react'
import OverlayedNewsImage from '@/_components/public/core/news-component/overlayed-news-image'
import FullWidthAlternateTitle from '@/_components/public/core/section-title/full-width-alternate-title'
import { useFetchNews } from '@/network/http-service/news.hooks'
import { CONTENT_CRITERIA } from '@/app/(server)/modules/site-configurations/site-config.constants'

interface MoviesCategoryProps {
  category: number
}

/**
 * This component renders the featured news for the fifth section.
 * It fetches and displays news items in a responsive grid layout.
 */
export const FifthSectionFeaturedCategory = ({ category }: MoviesCategoryProps) => {
  // Use video category content criteria as "Movies"
  const { data: moviesData, isLoading } = useFetchNews(
    {
      published: true,
      categoryIds: [category],
      categorySlug: CONTENT_CRITERIA.video.slug, // Using video category for movies
    },
    1,
    9 // Show up to 9 items
  )

  const newsItems = moviesData?.data || []

  // Skeleton for loading state
  const MovieSkeleton = () => (
    <div className="w-full h-[15rem] bg-gray-200 animate-pulse rounded"></div>
  )

  return (
    <div className="mt-20 px-8">
      <FullWidthAlternateTitle title="Movies" />
      <div className="flex w-full px-4 flex-wrap">
        {isLoading ? (
          // Show skeletons while loading
          Array(6)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="w-full sm:w-1/2 lg:w-1/3 p-2">
                <MovieSkeleton />
              </div>
            ))
        ) : newsItems.length > 0 ? (
          // Show movies data
          newsItems.map((newsItem, index) => (
            <div key={newsItem.id || index} className="w-full sm:w-1/2 lg:w-1/3 p-2">
              <OverlayedNewsImage newsItem={newsItem} />
            </div>
          ))
        ) : (
          // Show message if no items
          <div className="w-full p-8 text-center">
            <p className="text-gray-500">No movie content available</p>
          </div>
        )}
      </div>
    </div>
  )
}
