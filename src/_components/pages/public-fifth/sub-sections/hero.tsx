'use client'

import OverlayedNewsImage from '@/_components/public/core/news-component/overlayed-news-image'
import OverlayedNewsImageV2 from '@/_components/public/core/news-component/overlayed-news-v2'
import FullWidthAlternateTitle from '@/_components/public/core/section-title/full-width-alternate-title'
import { useFetchNews } from '@/network/http-service/news.hooks'
import { CONTENT_CRITERIA } from '@/app/(server)/modules/site-configurations/site-config.constants'
import React from 'react'
import { FeaturedNewsItemSkeleton, StandardNewsItemSkeleton } from '@/_components/global/skeletons'

// Constants for content types
const TrendingContent = CONTENT_CRITERIA.trending
const TopPicksContent = CONTENT_CRITERIA.topPicks

interface EntertainmentHeroProps {
  category: number
}

export const FifthSectionHero = ({ category }: EntertainmentHeroProps) => {
  // Fetch trending news
  const { data: trendingData, isLoading: trendingIsLoading } = useFetchNews(
    {
      published: true,
      categoryIds: [category],
      categorySlug: TrendingContent.slug,
    },
    1,
    TrendingContent.threshold
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

  // Get the news items for trending and top picks
  const trendingItems = trendingData?.data || []
  const topPicksItems = topPicksData?.data || []

  return (
    <div className="flex gap-4 px-8 mt-6">
      <div className="w-1/2 min-h-10 flex flex-col gap-8 items-stretch">
        <FullWidthAlternateTitle title="Trending" />
        {trendingIsLoading ? (
          <FeaturedNewsItemSkeleton />
        ) : trendingItems.length > 0 ? (
          <OverlayedNewsImageV2 newsItem={trendingItems[0]} />
        ) : (
          <div className="h-[30rem] flex items-center justify-center border border-gray-200">
            <p className="text-gray-500">No trending content available</p>
          </div>
        )}
      </div>

      <div className="w-1/2 min-h-10 flex flex-col gap-8">
        <FullWidthAlternateTitle title="Top Picks" />
        <div className="grid grid-cols-2 gap-4">
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
                      className="h-[15rem] flex items-center justify-center border border-gray-200"
                    >
                      <p className="text-gray-500">No content</p>
                    </div>
                  ))}
        </div>
      </div>
    </div>
  )
}
