"use client"



import NewsScreenFullWidthHero from '@/_components/public/core/news-component/news-screen-full-width-hero'
import { NewsCategoryCarousel } from '@/_components/public/news-category-carousel'
import React from 'react'
import MasonryNewsGrid from '@/_components/pages/public-fourth/sub-sections/masonry'
import { useFetchNews } from '@/network/http-service/news.hooks'
import { CONTENT_CRITERIA } from '@/app/(server)/modules/site-configurations/site-config.constants'
import { longCarouselBasicNewsData } from '@/lib/constants/pre-data'

interface FourthPageContentProps {
  category: number
}


const FeaturedNews = CONTENT_CRITERIA.featured
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
  return (
    <>
      <NewsScreenFullWidthHero newsItems={featuredData?.data} isLoading={featuredDataIsLoading} />

      {/* latest update section */}
      <div className="px-8">
        <NewsCategoryCarousel
          title="Latest Update"
          items={longCarouselBasicNewsData}
          carouselItem={{ itemType: 'overlay-v2' }}
        />
      </div>
      <MasonryNewsGrid category={category} />
    </>
  )
}
