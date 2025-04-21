'use client'

import NewsScreenFullWidthHero from '@/_components/public/core/news-component/news-screen-full-width-hero'
import React from 'react'
import MasonryNewsGrid from '@/_components/pages/public-fourth/sub-sections/masonry'
import { useFetchNews } from '@/network/http-service/news.hooks'
import { CONTENT_CRITERIA } from '@/app/(server)/modules/site-configurations/site-config.constants'
import { NewsCategoryCarousel } from '@/_components/public/news-category-carousel'
import { AdsBox } from '@/_components/public/core/ads-box'

interface FourthPageContentProps {
  category: number
}

const FeaturedNews = CONTENT_CRITERIA.featured
const Fashion = CONTENT_CRITERIA.fashion

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
  const { data: fashionData, isLoading: fashionIsLoading } = useFetchNews(
    {
      categorySlug: Fashion.slug,
    },
    1,
    Fashion.maxThreshold
  )

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Hero section */}
      <div className="w-full">
        <NewsScreenFullWidthHero newsItems={featuredData?.data} isLoading={featuredDataIsLoading} />
      </div>

      <div className="px-4 sm:px-6 md:px-8 mt-6 sm:mt-8 md:mt-10">
        <NewsCategoryCarousel
          title={'Latest Updates'}
          items={latestNewsData?.data}
          isLoading={latestNewsIsLoading}
          carouselItem={{ itemType: 'overlay-v2' }}
        />
      </div>
      <AdsBox position="third-page" />
      {/* Masonry grid section */}
      <div className="mt-8 sm:mt-10 md:mt-12 w-full">
        <MasonryNewsGrid data={fashionData?.data} isLoading={fashionIsLoading} />
      </div>
    </div>
  )
}
