import BasicNewsTitleAndImage from '@/_components/public/core/news-component/basic-news-title-and-image'
import DarkerBasicNewsWithTag from '@/_components/public/core/news-component/darker-basic-news-with-tag'
import FullWidthAlternateTitle from '@/_components/public/core/section-title/full-width-alternate-title'
import { NewsCategoryCarousel } from '@/_components/public/news-category-carousel'
import { useFetchNews } from '@/network/http-service/news.hooks'
import { CONTENT_CRITERIA } from '@/app/(server)/modules/site-configurations/site-config.constants'
import React from 'react'
import { NewsItemSkeleton } from '@/_components/global/skeletons'

interface PoliticsProps {
  category: number
  ref?: (el: HTMLElement | null) => void
}

/**
 * Shows featured's picks for the selected category.
 * Responsive layout for different screen sizes.
 */
const SecondCategoryPolitics = ({ category, ref }: PoliticsProps) => {
  const { data: politicsData, isLoading: politicsDataIsLoading } = useFetchNews(
    {
      published: true,
      categoryIds: [category],
      categorySlug: CONTENT_CRITERIA.politics.slug,
    },
    1,
    8
  )

  // Get the news items from the response
  const newsItems = politicsData?.data || []

  return (
    <div
      className="relative px-4 sm:px-6 lg:px-8 py-5 sm:py-8 flex flex-col gap-6 sm:gap-8"
      id={CONTENT_CRITERIA.politics.name}
      ref={ref}
    >
      <FullWidthAlternateTitle title={CONTENT_CRITERIA.politics.name} />

      {politicsDataIsLoading ? (
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 px-2 sm:px-4 lg:px-6">
          <div className="w-full lg:w-3/5 mb-4 lg:mb-0">
            <NewsItemSkeleton />
          </div>
          <div className="w-full lg:w-2/5 flex flex-col sm:flex-row lg:flex-col gap-4 sm:gap-6 lg:gap-8">
            <div className="w-full sm:w-1/2 lg:w-full">
              <NewsItemSkeleton />
            </div>
            <div className="w-full sm:w-1/2 lg:w-full">
              <NewsItemSkeleton />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 px-2 sm:px-4 lg:px-6">
          <div className="w-full lg:w-3/5 mb-4 lg:mb-0 transition-transform duration-300 hover:scale-[1.01]">
            {newsItems.length > 0 && <BasicNewsTitleAndImage newsItem={newsItems[0]} />}
          </div>
          <div className="w-full lg:w-2/5 flex flex-col sm:flex-row lg:flex-col gap-4 sm:gap-6 lg:gap-8">
            {newsItems.slice(1, 3).map((item, index) => (
              <div
                className="w-full sm:w-1/2 lg:w-full transition-transform duration-300 hover:scale-[1.02]"
                key={item.id || index}
              >
                <DarkerBasicNewsWithTag newsItem={item} backgroundColor="#D9D9D9" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-2 sm:px-4 w-full mt-2 sm:mt-4">
        {politicsDataIsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-full">
                <NewsItemSkeleton />
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full overflow-hidden">
            <NewsCategoryCarousel
              items={newsItems.slice(3) || []}
              carouselItem={{ itemType: 'basic-news-with-tag-v2' }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default SecondCategoryPolitics
