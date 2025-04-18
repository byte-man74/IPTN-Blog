'use client'

import NewsScreenFullWidthHero from '@/_components/public/core/news-component/news-screen-full-width-hero'
import React from 'react'
import MasonryNewsGrid from '@/_components/pages/public-fourth/sub-sections/masonry'
import { useFetchNews } from '@/network/http-service/news.hooks'
import { CONTENT_CRITERIA } from '@/app/(server)/modules/site-configurations/site-config.constants'
import { NewsDTO } from '@/app/(server)/modules/news/news.types'
import { LatestSection } from './sub-sections/latest'

interface FourthPageContentProps {
  category: number
}

const FeaturedNews = CONTENT_CRITERIA.featured
const TopPicks = CONTENT_CRITERIA.topPicks
export const FourthPageContent = ({ category }: FourthPageContentProps) => {
  //featured data
  const { data: featuredData, isLoading: featuredDataIsLoading } = useFetchNews(
    {
      categoryIds: [category],
      categorySlug: FeaturedNews.slug,
    },
    1,
    FeaturedNews.maxThreshold
  )

  // Latest news data
  const { data: latestNewsData, isLoading: latestNewsIsLoading } = useFetchNews(
    {
      categoryIds: [category],
    },
    1,
    6
  )

  //top picks data
  const { data: topPicksData, isLoading: topPicksIsLoading } = useFetchNews({
    categoryIds: [category],
    categorySlug: TopPicks.slug
  }, 1, TopPicks.maxThreshold)

  return (
    <div className="flex flex-col w-full">
      {/* Hero section */}
      <div className="w-full">
        <NewsScreenFullWidthHero newsItems={featuredData?.data} isLoading={featuredDataIsLoading} />
      </div>

      {/* Latest update section */}
      <div className="px-4 sm:px-6 md:px-8 mt-6 sm:mt-8 md:mt-10">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Latest Updates</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {latestNewsIsLoading
            ? Array(3)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="bg-gray-100 animate-pulse h-64 rounded-md"></div>
                ))
            : latestNewsData?.data.map((newsItem: NewsDTO) => (
                <LatestSection key={newsItem?.id} newsItem={newsItem} />
              ))}
        </div>
      </div>

      {/* Masonry grid section */}
      <div className="mt-8 sm:mt-10 md:mt-12 w-full">
        <MasonryNewsGrid data={topPicksData?.data} isLoading={topPicksIsLoading}/>
      </div>
    </div>
  )
}
