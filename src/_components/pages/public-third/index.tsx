'use client'

import React from 'react'
import { ThirdSectionHero } from '@/_components/pages/public-third/sub-sections/hero'
import { MainSectionBody } from '@/_components/public/core/section-body/main'
import { useFetchNews } from '@/network/http-service/news.hooks'
import { CONTENT_CRITERIA } from '@/app/(server)/modules/site-configurations/site-config.constants'

interface ThirdPageContentProps {
  category: number
}

const FeaturedNews = CONTENT_CRITERIA.featured

export const ThirdPageContent = ({ category }: ThirdPageContentProps) => {
  //featured news
  const { data: featuredNewsData, isLoading: featuredNewsDataIsLoading } = useFetchNews(
    {
      categoryIds: [category],
      categorySlug: FeaturedNews.slug,
    },
    1,
    FeaturedNews.maxThreshold
  )
  return (
    <div className="flex flex-col gap-10">
      <ThirdSectionHero category={category} />
      <MainSectionBody
        title={FeaturedNews.name}
        data={featuredNewsData?.data}
        isLoading={featuredNewsDataIsLoading}
        sectionName={category}
      />
    </div>
  )
}
