'use client'

import React from 'react'
import { SecondPageContentHero } from '@/_components/pages/public-second/sub-sections/news-hero'
import { AdsBox } from '@/_components/public/core/ads-box'
import Sports from '@/_components/pages/public-second/sub-sections/sports'
import SecondCategoryFeatured from './sub-sections/politics'
import { useFetchNews } from '@/network/http-service/news.hooks'
import { CONTENT_CRITERIA, DEFAULT_PAGE_NUMBER } from '@/app/(server)/modules/site-configurations/site-config.constants'
import { NewsCategoryCarousel } from '@/_components/public/news-category-carousel'

interface SecondPageContentProps {
  category: number
}

export const SecondPageContent = ({ category }: SecondPageContentProps) => {
  const { data: topNewsData, isLoading: topNewsDataIsLoading } = useFetchNews(
    {
      published: true,
      categoryIds: [category],
      categorySlug: CONTENT_CRITERIA.topNews.slug,
    },
    DEFAULT_PAGE_NUMBER,
    CONTENT_CRITERIA.topNews.maxThreshold
  )

  return (
    <div className="flex gap-6 flex-col min-h-[2rem]">
      <SecondPageContentHero category={category} />
      <AdsBox position="second-page" />
      <NewsCategoryCarousel
        title={CONTENT_CRITERIA.topNews.name}
        items={topNewsData?.data}
        isLoading={topNewsDataIsLoading}
        carouselItem={{ itemType: 'news-overlay' }}
      />
      <SecondCategoryFeatured category={category} />
      <Sports />
    </div>
  )
}
