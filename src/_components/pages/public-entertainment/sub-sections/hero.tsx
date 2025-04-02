import OverlayedNewsImage from '@/_components/public/core/news-component/overlayed-news-image'
import OverlayedNewsImageV2 from '@/_components/public/core/news-component/overlayed-news-v2'
import FullWidthAlternateTitle from '@/_components/public/core/section-title/full-width-alternate-title'
import { longCarouselBasicNewsData } from '@/lib/constants/pre-data'
import React from 'react'

export const EntertainmentHero = () => {
  return (
    <div className="flex gap-4 px-8 mt-6">
      <div className="w-1/2 min-h-10 flex flex-col gap-8 items-stretch">
        <FullWidthAlternateTitle title="Trending" />
        <OverlayedNewsImageV2 newsItem={longCarouselBasicNewsData[1]} />
      </div>

      <div className="w-1/2 min-h-10 flex flex-col gap-8">
        <FullWidthAlternateTitle title="Top Picks" />
        <div className="grid grid-cols-2 gap-4">
          {longCarouselBasicNewsData.slice(0, 4).map((newsItem, index) => (
            <div key={index} className="w-full">
              <OverlayedNewsImage newsItem={newsItem} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
