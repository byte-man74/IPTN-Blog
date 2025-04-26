'use client'

import OverlayedNewsImage from '@/_components/public/core/news-component/overlayed-news-image'
import OverlayedNewsImageV2 from '@/_components/public/core/news-component/overlayed-news-v2'
import FullWidthAlternateTitle from '@/_components/public/core/section-title/full-width-alternate-title'
import { useFetchNews } from '@/network/http-service/news.hooks'
import { CONTENT_CRITERIA } from '@/app/(server)/modules/site-configurations/site-config.constants'
import React from 'react'
import { FeaturedNewsItemSkeleton, StandardNewsItemSkeleton } from '@/_components/global/skeletons'

// Constants for content types
const FeaturedContent = CONTENT_CRITERIA.featured
const TopPicksContent = CONTENT_CRITERIA.topPicks

interface EntertainmentHeroProps {
  category: number
  ref?: ((el: HTMLElement | null) => void)
  id?: string
}

export const FifthSectionHero = ({ category, ref, id  }: EntertainmentHeroProps) => {
  // Fetch featured news
  const { data: featuredData, isLoading: featuredIsLoading } = useFetchNews(
    {
      published: true,
      categoryIds: [category],
      categorySlug: FeaturedContent.slug,
    },
    1,
    1
  )

  // Fetch top picks news
  const { data: topPicksData, isLoading: topPicksIsLoading } = useFetchNews(
    {
      published: true,
      categoryIds: [category],
      categorySlug: TopPicksContent.slug,
    },
    1,
    TopPicksContent.maxThreshold
  )

  // Get the news items for featured and top picks
  const featuredItems = featuredData?.data || []
  const topPicksItems = topPicksData?.data || []

  return (
    <div className="flex flex-col lg:flex-row gap-4 px-4 sm:px-6 md:px-8 mt-6" ref={ref} id={id}>
      <div className="w-full lg:w-1/2 min-h-10 flex flex-col gap-4 md:gap-8 items-stretch mb-8 lg:mb-0 overflow-hidden">
        <FullWidthAlternateTitle title="Featured" />
        {featuredIsLoading ? (
          <FeaturedNewsItemSkeleton />
        ) : featuredItems.length > 0 ? (
          <OverlayedNewsImageV2 newsItem={featuredItems[0]} fullHeight/>
        ) : (
          <div className="h-[20rem] sm:h-[25rem] md:h-[30rem] flex items-center justify-center border border-gray-200">
            <p className="text-gray-500">No featured content available</p>
          </div>
        )}
      </div>

      <div className="w-full lg:w-1/2 min-h-10 flex flex-col gap-4 md:gap-8 overflow-hidden">
        <FullWidthAlternateTitle title="Top Picks" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {topPicksIsLoading
            ? // Show skeletons while loading
              Array(4)
                .fill(0)
                .map((_, index) => <StandardNewsItemSkeleton key={index} />)
            : topPicksItems.length > 0
              ? // Show top picks data
                topPicksItems.slice(0, 4).map((newsItem, index) => (
                  <div key={newsItem.id || index} className="w-full">
                    <OverlayedNewsImage newsItem={newsItem} />
                  </div>
                ))
              : // Show empty state if no data
                Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="h-[12rem] sm:h-[15rem] flex items-center justify-center border border-gray-200"
                    >
                      <p className="text-gray-500">No content</p>
                    </div>
                  ))}
        </div>
      </div>
    </div>
  )
}
