import BasicNews from '@/_components/public/core/news-component/basic-news'
import BasicTitle from '@/_components/public/core/section-title/basic-title'
import { carouselBasicNewsData } from '@/lib/constants/pre-data'
import React from 'react'

/**
 * TrendingNow component
 *
 * This component displays trending news items in a responsive layout.
 * Features:
 * - Full width on mobile devices, 30% width on larger screens
 * - Displays a list of basic news items in a vertical layout
 * - Responsive spacing and gap sizing based on viewport width
 * - Optimized for mobile viewing with appropriate spacing
 */
const TrendingNow = () => {
  // Perform nullish check for data coming from external source
  const newsItems = carouselBasicNewsData ?? [];

  return (
    <div className="w-full sm:w-[30%] h-full flex flex-col justify-between">
      <BasicTitle title="Trending Now" />

      <div className="flex mt-2 xs:mt-3 flex-col gap-2 xs:gap-3 justify-between">
        {newsItems &&
          newsItems.map((news) => <BasicNews key={news.id} newsContent={news} />)}
      </div>
    </div>
  )
}

export default TrendingNow
