import React from 'react'
import OverlayedNewsImage from '@/_components/public/core/news-component/overlayed-news-image'
import FullWidthAlternateTitle from '@/_components/public/core/section-title/full-width-alternate-title'
import { useFetchNews } from '@/network/http-service/news.hooks'
import { CONTENT_CRITERIA } from '@/app/(server)/modules/site-configurations/site-config.constants'

interface FifthSectionFeaturedCategoryProps {
  category: number
}

/**
 * This component renders the movies news for the fifth section.
 * It fetches and displays news items in a responsive grid layout.
 * Fully responsive across all device sizes.
 */
export const FifthSectionFeaturedCategory = ({ category }: FifthSectionFeaturedCategoryProps) => {

  const { data: moviesData, isLoading } = useFetchNews(
    {
      published: true,
      categoryIds: [category],
      categorySlug: CONTENT_CRITERIA.movies.slug,
    },
    1,
    CONTENT_CRITERIA.movies.maxThreshold || 10 // Use maxThreshold from config or default to 10
  )

  const newsItems = moviesData?.data || []

  // Skeleton for loading state
  const FifthSectionFeaturedCategorySkeleton = () => (
    <div className="w-full h-[12rem] md:h-[15rem] lg:h-[18rem] bg-gray-200 animate-pulse rounded"></div>
  )

  return (
    <section className="mt-10 md:mt-16 lg:mt-20 px-4 sm:px-6 md:px-8 max-w-screen-2xl mx-auto mb-10">
      <FullWidthAlternateTitle title={"Movies"} backgroundTitle="Movies top 10" />
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-12 md:mt-16">
        {isLoading ? (
          // Show skeletons while loading
          Array(6)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="w-full">
                <FifthSectionFeaturedCategorySkeleton />
              </div>
            ))
        ) : newsItems.length > 0 ? (
          // Show news data
          newsItems.map((newsItem, index) => (
            <div key={newsItem.id || index} className="w-full transition-transform duration-300 hover:scale-[1.02]">
              <OverlayedNewsImage newsItem={newsItem} />
            </div>
          ))
        ) : (
          // Show message if no items
          <div className="col-span-full py-12 text-center">
            <p className="text-gray-500 text-lg">No movie content available</p>
          </div>
        )}
      </div>
    </section>
  )
}
