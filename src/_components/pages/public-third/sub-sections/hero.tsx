'use client'
import { Skeleton } from '@/_components/global/skeleton'
import DarkerBasicNewsWithTag from '@/_components/public/core/news-component/darker-basic-news-with-tag'
import NewsCarousel from '@/_components/public/core/news-component/news-carousel'
import BasicTitle from '@/_components/public/core/section-title/basic-title'
import FullWidthAlternateTitle from '@/_components/public/core/section-title/full-width-alternate-title'
import {
  CONTENT_CRITERIA,
  DEFAULT_PAGE_NUMBER,
} from '@/app/(server)/modules/site-configurations/site-config.constants'

import { useFetchNews } from '@/network/http-service/news.hooks'
import React from 'react'

const Politics = CONTENT_CRITERIA.politics
const TrendingContent = CONTENT_CRITERIA.thirdCategoryTrending


interface ArticleHeroProps {
  category: number
  ref?: (el: HTMLElement | null) => void
  id?: string
}

export const ThirdSectionHero = ({ category, ref, id }: ArticleHeroProps) => {
  //editors pick
  const { data: politicsData, isLoading: politicsIsLoading } = useFetchNews(
    {
      categoryIds: [category],
      published: true,
      categorySlug: Politics.slug,
    },
    DEFAULT_PAGE_NUMBER,
    Politics.maxThreshold
  )

  //popular news
  const { data: popularData, isLoading: popularIsLoading } = useFetchNews(
    {
      published: true,
      byPopularity: true,
      categoryIds: [category],
    },
    DEFAULT_PAGE_NUMBER,
    TrendingContent.threshold
  )

  //latest news
  const { data: latestNewsData, isLoading: latestNewsIsLoading } = useFetchNews(
    {
      published: true,
      categoryIds: [category],
    },
    DEFAULT_PAGE_NUMBER,
    4
  )

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8 justify-between mt-4 px-2 sm:px-4 md:px-6" ref={ref} id={id}>
      {/* main news section div */}
      <div className="flex flex-col md:flex-row gap-4 w-full lg:w-[71%]">
        <div className="w-full md:w-1/2 overflow-hidden">
          <FullWidthAlternateTitle title={Politics.name} />
          <div className="mb-4 md:mb-8 w-full" />
          {politicsIsLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-[150px] sm:h-[180px] md:h-[200px] w-full rounded-md" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : (
            <NewsCarousel newsItems={politicsData?.data ?? []} />
          )}
        </div>
        <div className="w-full md:w-1/2 mt-6 md:mt-0 overflow-hidden">
          <FullWidthAlternateTitle title={'Popular'} />
          <div className="mb-4 md:mb-8 w-full" />
          {popularIsLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-[150px] sm:h-[180px] md:h-[200px] w-full rounded-md" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : (
            <NewsCarousel newsItems={popularData?.data ?? []} />
          )}
        </div>
      </div>

      {/* sub news section */}
      <div className="flex gap-2 w-full lg:w-[28%] flex-col mt-6 lg:mt-0">
        <BasicTitle title={"Latest"} />
        <div className="flex flex-col gap-4">
          {latestNewsIsLoading ? (
            <>
              {[1, 2, 3].map((item) => (
                <div className="w-full" key={item}>
                  <div className="flex gap-2">
                    <Skeleton className="h-[60px] sm:h-[70px] md:h-[80px] w-[60px] sm:w-[70px] md:w-[80px] rounded-md" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            (latestNewsData?.data || []).slice(0, 3).map((newsItem, index) => (
              <div className="w-full" key={index}>
                <DarkerBasicNewsWithTag backgroundColor="white" newsItem={newsItem} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
