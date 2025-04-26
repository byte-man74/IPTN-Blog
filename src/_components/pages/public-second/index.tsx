'use client'

import React from 'react'
import { SecondPageContentHero } from '@/_components/pages/public-second/sub-sections/news-hero'
import { AdsBox } from '@/_components/public/core/ads-box'
import Sports from '@/_components/pages/public-second/sub-sections/sports'
import SecondCategoryPolitics from './sub-sections/politics'
import { useFetchNews } from '@/network/http-service/news.hooks'
import {
  CONTENT_CRITERIA,
  DEFAULT_PAGE_NUMBER,
} from '@/app/(server)/modules/site-configurations/site-config.constants'
import { NewsCategoryCarousel } from '@/_components/public/news-category-carousel'
import { useTrackSection } from '@/hooks/use-track-section'

interface SecondPageContentProps {
  category: number
}

const FeaturedId = 'Featured'
const HeroId = 'Hero'
const sections = [
  { id: CONTENT_CRITERIA.topNews.name },
  { id: FeaturedId },
  { id: CONTENT_CRITERIA.sports.name },
  { id: HeroId },
  { id: CONTENT_CRITERIA.politics.name },
]

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

  const { setRef } = useTrackSection(sections)

  return (
    <div className="flex gap-6 flex-col min-h-[2rem]">
      <SecondPageContentHero category={category} ref={setRef(HeroId)} id={HeroId} />
      <AdsBox position="second-page" />
      <div className="relative px-8 py-5 flex flex-col gap-8">
        <NewsCategoryCarousel
          title={CONTENT_CRITERIA.topNews.name}
          ref={setRef(CONTENT_CRITERIA.topNews.name)}
          items={topNewsData?.data}
          isLoading={topNewsDataIsLoading}
          carouselItem={{ itemType: 'news-overlay' }}
        />
      </div>
      <SecondCategoryPolitics category={category} ref={setRef(CONTENT_CRITERIA.politics.name)} />
      <Sports ref={setRef(CONTENT_CRITERIA.sports.name)} />
    </div>
  )
}
