'use client'

import NewsCarousel from '@/_components/public/core/news-component/news-carousel'
import BasicTitle from '@/_components/public/core/section-title/basic-title'
import {
  HomePageArticles,
  HomePageFeatured,
} from '@/app/(server)/modules/site-configurations/site-config.constants'
import { useFetchNews } from '@/network/http-service/news.hooks'
import React from 'react'

/**
 * MainContent component
 *
 * This component displays the main content section of the home page.
 * Features:
 * - Full width on mobile devices, 46% width on larger screens
 * - Contains a title section and a news carousel
 * - Responsive layout adapts to different screen sizes
 * - Fetches and displays top news articles
 */
const MainContent = () => {
  // Fetch fetch featured articles
  const { data: mainNews, isLoading } = useFetchNews(
    { published: true, categorySlugs: [HomePageFeatured.slug, HomePageArticles.slug] },
    1,
    5
  )

  return (
    <div className="w-full sm:w-[46%] min-h-full">
      <BasicTitle title="Main content" />
      {isLoading ? (
        <div className="relative h-[29rem] xs:h-[26rem] mx-auto border border-gray-200 overflow-hidden shadow-lg animate-pulse">
          <div className="w-full h-3/4 bg-gray-300"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            <div className="flex items-center space-x-2 mt-2">
              <div className="h-3 w-3 bg-gray-300 rounded-full"></div>
              <div className="h-3 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
        </div>
      ) : (
        <NewsCarousel newsItems={mainNews?.data} />
      )}
    </div>
  )
}

export default MainContent
