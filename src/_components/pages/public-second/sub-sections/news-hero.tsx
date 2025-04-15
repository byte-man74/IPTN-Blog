import NewsCarousel from '@/_components/public/core/news-component/news-carousel'
import NewsWithDescription from '@/_components/public/core/news-component/news-with-description'
import BasicTitle from '@/_components/public/core/section-title/basic-title'
import FullWidthAlternateTitle from '@/_components/public/core/section-title/full-width-alternate-title'
import React, { useMemo } from 'react'
import { CONTENT_CRITERIA } from '@/app/(server)/modules/site-configurations/site-config.constants'
import { useFetchNews } from '@/network/http-service/news.hooks'

interface SecondPageContentHeroProps {
  category: number
}

/**
 * SecondPageContentHero component displays a editors news section and a trending now section side by side.
 * @param {SecondPageContentHeroProps} props - Component props including category
 */
export const SecondPageContentHero = ({ category }: SecondPageContentHeroProps) => {
  // Calculate date limit once using useMemo to prevent recreating on each render
  const dateLimit = useMemo(() => {
    return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  }, []);

  //editors-pick
  const { data: secondPageEditorsPick, isLoading: secondPageEditorsPickIsLoading } = useFetchNews(
    {
      published: true,
      categoryIds: [category],
      categorySlug: CONTENT_CRITERIA.editorsPick.slug,
      startDate: dateLimit, // Using memoized date to prevent infinite API calls
    },
    1,
    CONTENT_CRITERIA.editorsPick.maxThreshold
  )

  //trending
  const { data: secondPageTrending, isLoading: secondPageTrendingDataIsLoading } = useFetchNews(
    {
      published: true,
      categoryIds: [category],
      categorySlug: CONTENT_CRITERIA.secondCategoryTrending.slug,
    },
    1,
    CONTENT_CRITERIA.secondCategoryTrending.maxThreshold
  )

  // Skeleton for carousel
  const CarouselSkeleton = () => (
    <div className="h-[24rem] xs:h-[26rem] sm:h-[29rem] mx-auto border border-gray-200 overflow-hidden shadow-lg rounded-sm bg-gray-200 animate-pulse">
      <div className="w-full h-full relative">
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-8">
          <div className="flex gap-2 mb-2">
            <div className="bg-gray-300 h-6 w-20 rounded-sm"></div>
            <div className="bg-gray-300 h-6 w-24 rounded-sm"></div>
          </div>
          <div className="bg-gray-300 h-8 w-3/4 rounded-sm mb-2"></div>
          <div className="bg-gray-300 h-8 w-1/2 rounded-sm"></div>
        </div>
      </div>
    </div>
  )

  // Skeleton for news with description
  const NewsWithDescriptionSkeleton = () => (
    <div className="flex flex-col gap-2 animate-pulse">
      <div className="bg-gray-200 h-40 w-full rounded-sm"></div>
      <div className="bg-gray-300 h-5 w-3/4 rounded-sm"></div>
      <div className="bg-gray-300 h-5 w-1/2 rounded-sm"></div>
    </div>
  )

  return (
    // header section
    <div className="relative flex flex-col lg:flex-row px-4 sm:px-6 lg:px-8 gap-4 h-full items-stretch w-full pb-4 mt-4 sm:mt-0">
      <div className="w-full lg:w-1/2 h-full relative mb-8 lg:mb-0">
        <FullWidthAlternateTitle title={`${CONTENT_CRITERIA.editorsPick.name}`} />
        <div className="mb-4 sm:mb-6 lg:mb-8 w-full" />
        {secondPageEditorsPickIsLoading ? (
          <CarouselSkeleton />
        ) : (
          <NewsCarousel newsItems={secondPageEditorsPick?.data ?? []} />
        )}
      </div>

      <div className="w-full lg:w-1/2 pt-2 sm:pt-4 lg:pt-6 flex flex-col gap-2 min-h-full justify-end-between">
        <BasicTitle title={CONTENT_CRITERIA.secondCategoryTrending.name} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full h-full items-end">
          {secondPageTrendingDataIsLoading ? (
            <>
              <NewsWithDescriptionSkeleton />
              <NewsWithDescriptionSkeleton />
            </>
          ) : (
            secondPageTrending?.data.map((item, index) => (
              <NewsWithDescription key={index} newsItem={item} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
