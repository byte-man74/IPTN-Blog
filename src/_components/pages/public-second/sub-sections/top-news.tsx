import FullWidthAlternateTitle from '@/_components/public/core/section-title/full-width-alternate-title'
import OverlayedNewsImage from '@/_components/public/core/news-component/overlayed-news-image'
import React from 'react'
import { CONTENT_CRITERIA } from '@/app/(server)/modules/site-configurations/site-config.constants'
import { useFetchNews } from '@/network/http-service/news.hooks'
import { AdsBox } from '@/_components/public/core/ads-box'

interface TopNewsProps {
  category: number
}

/**
 * TopNews component displays the top news section with a responsive grid of news items.
 * If there aren't enough news items, it fills the remaining spaces with ad boxes.
 * @param {TopNewsProps} props - The props for the component including category.
 */
const TopNews = ({ category }: TopNewsProps) => {
  const { data: topNewsData, isLoading: topNewsDataIsLoading } = useFetchNews(
    {
      published: true,
      categoryIds: [category],
      categorySlug: CONTENT_CRITERIA.topNews.slug,
    },
    1,
    8 
  )

  // Skeleton for news items
  const NewsItemSkeleton = () => (
    <div className="relative h-[15rem] sm:h-[18rem] w-full rounded-sm overflow-hidden animate-pulse bg-gray-200">
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="bg-gray-300 h-4 w-16 rounded-sm mb-2"></div>
        <div className="bg-gray-300 h-5 w-3/4 rounded-sm"></div>
      </div>
    </div>
  )

  // Function to render grid items (news or ads)
  const renderGridItems = () => {
    if (topNewsDataIsLoading) {
      // Show skeletons while loading
      return Array(8).fill(0).map((_, index) => (
        <NewsItemSkeleton key={index} />
      ));
    }

    const newsItems = topNewsData?.data || [];
    const totalSlots = 8;
    const itemsToRender = [];

    // Add available news items
    for (let i = 0; i < newsItems.length; i++) {
      itemsToRender.push(
        <OverlayedNewsImage key={`news-${i}`} newsItem={newsItems[i]} />
      );
    }

    // Fill remaining slots with ads
    for (let i = newsItems.length; i < totalSlots; i++) {
      if (newsItems.length > 0) { // Only add ads if we have at least one news item
        itemsToRender.push(
          <div key={`ad-${i}`} className="h-[15rem] sm:h-[18rem]">
            <AdsBox />
          </div>
        );
      }
    }

    return itemsToRender;
  };

  return (
    <div className="relative px-4 sm:px-6 lg:px-8 py-5 flex flex-col gap-4 sm:gap-6 lg:gap-8">
        <FullWidthAlternateTitle title={CONTENT_CRITERIA.topNews.name}/>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {renderGridItems()}
        </div>
    </div>
  )
}

export default TopNews
