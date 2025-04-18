'use client'

import BasicNews from '@/_components/public/core/news-component/basic-news'
import BasicTitle from '@/_components/public/core/section-title/basic-title'
import { HomePageTrending } from '@/app/(server)/modules/site-configurations/site-config.constants'
import { useFetchNews } from '@/network/http-service/news.hooks'
import React from 'react'

/**
 * TrendingNow component
 *
 * This component displays trending news items in a responsive layout.
 * Features:
 * - Full width on mobile devices, 30% width on larger screens
 * - Displays a list of basic news items in a vertical layout
 * - Responsive spacing and gap sizing based on viewport width
 * - Optimized for mobile viewing with appropriate spacing
 * - Shows skeleton loading state while data is being fetched
 */
const TrendingNow = () => {
  const { data: trendingNews, isLoading } = useFetchNews(
    { published: true, categorySlug: HomePageTrending.slug },
    1,
    3
  )

  // Use fallback data if API data is loading or unavailable
  const newsItems = trendingNews?.data.length ? trendingNews.data : []

  return (
    <div className="w-full sm:w-[30%]  flex flex-col justify-between flex-grow">
      <BasicTitle title="Trending Now" />

      <div className="flex mt-2 xs:mt-3 flex-col gap-2 xs:gap-3 justify-between h-[99%]">
        {isLoading
          ? // Skeleton loading state
            Array(3)
              .fill(0)
              .map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="flex gap-0 h-36 bg-white shadow-md overflow-hidden"
                >
                  <div className="w-1/3 bg-gray-200 animate-pulse"></div>
                  <div className="w-2/3 p-4 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="bg-gray-200 rounded-full p-1.5 w-6 h-6 animate-pulse"></div>
                      <div className="bg-gray-200 h-3 w-20 animate-pulse"></div>
                    </div>
                    <div className="bg-gray-200 h-4 w-full mb-2 animate-pulse"></div>
                    <div className="bg-gray-200 h-4 w-3/4 mb-2 animate-pulse"></div>
                    <div className="bg-gray-200 h-3 w-16 mt-auto animate-pulse"></div>
                  </div>
                </div>
              ))
          : newsItems && newsItems.map((news) => <BasicNews key={news.id} newsContent={news} />)}
      </div>
    </div>
  )
}

export default TrendingNow
