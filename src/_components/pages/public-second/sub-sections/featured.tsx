import BasicNewsTitleAndImage from '@/_components/public/core/news-component/basic-news-title-and-image'
import DarkerBasicNewsWithTag from '@/_components/public/core/news-component/darker-basic-news-with-tag'
import FullWidthAlternateTitle from '@/_components/public/core/section-title/full-width-alternate-title'
import { NewsCategoryCarousel } from '@/_components/public/news-category-carousel'
import { useFetchNews } from '@/network/http-service/news.hooks'
import { CONTENT_CRITERIA } from '@/app/(server)/modules/site-configurations/site-config.constants'
import React from 'react'

interface PoliticsProps {
  category: number
}

/**
 * Shows featured's picks for the selected category.
 * Responsive layout for different screen sizes.
 */
const SecondCategoryFeatured = ({ category }: PoliticsProps) => {
  const { data: featuredData, isLoading: featuredDataIsLoading } = useFetchNews(
    {
      published: true,
      categoryIds: [category],
      categorySlug: CONTENT_CRITERIA.featured.slug,
    },
    1,
    8
  )

  // Get the news items from the response
  const newsItems = featuredData?.data || []

  // Skeleton for news items
  const NewsItemSkeleton = () => (
    <div className="relative h-[15rem] w-full rounded-sm overflow-hidden animate-pulse bg-gray-200">
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="bg-gray-300 h-4 w-16 rounded-sm mb-2"></div>
        <div className="bg-gray-300 h-5 w-3/4 rounded-sm"></div>
      </div>
    </div>
  )

  return (
    <div className="relative px-4 sm:px-6 lg:px-8 py-5 sm:py-8 flex flex-col gap-6 sm:gap-8">
      <FullWidthAlternateTitle title={CONTENT_CRITERIA.featured.name} />

      {featuredDataIsLoading ? (
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
              <div className="w-full sm:w-1/2 lg:w-full transition-transform duration-300 hover:scale-[1.02]" key={item.id || index}>
                <DarkerBasicNewsWithTag newsItem={item}  />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-2 sm:px-4 w-full mt-2 sm:mt-4">
        {featuredDataIsLoading ? (
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

export default SecondCategoryFeatured
