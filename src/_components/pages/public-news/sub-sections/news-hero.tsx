import NewsCarousel from '@/_components/public/core/news-component/news-carousel'
import NewsWithDescription from '@/_components/public/core/news-component/news-with-description'
import BasicTitle from '@/_components/public/core/section-title/basic-title'
import FullWidthAlternateTitle from '@/_components/public/core/section-title/full-width-alternate-title'
import { carouselBasicNewsData, longCarouselBasicNewsData } from '@/lib/constants/pre-data'
import React from 'react'

/**
 * NewsHero component displays a featured news section and a trending now section side by side.
 * @returns {JSX.Element} The rendered NewsHero component.
 */
export const NewsHero = () => {
  return (
    // header section
    <div className="relative flex px-8 gap-4 h-full items-stretch bg-[#E4E4E4] w-full pb-4">
      <div className="w-1/2 h-full relative">
        <FullWidthAlternateTitle title="Featured news" />
        <div className="mb-8 w-full"></div>
        <NewsCarousel newsItems={carouselBasicNewsData ?? []} />
      </div>

      <div className="w-1/2 pt-6 flex flex-col gap-2 min-h-full justify-end-between">
        <BasicTitle title="Trending Now"/>
        <div className="grid grid-cols-2 gap-4 w-full h-full items-end">
          {longCarouselBasicNewsData?.slice(0, 2).map((item, index) => (
            <NewsWithDescription key={index} newsItem={item} />
          ))}
        </div>
      </div>
    </div>
  )
}
