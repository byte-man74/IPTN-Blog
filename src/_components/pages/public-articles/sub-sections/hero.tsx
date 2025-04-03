import DarkerBasicNewsWithTag from '@/_components/public/core/news-component/darker-basic-news-with-tag'
import NewsCarousel from '@/_components/public/core/news-component/news-carousel'
import BasicTitle from '@/_components/public/core/section-title/basic-title'
import FullWidthAlternateTitle from '@/_components/public/core/section-title/full-width-alternate-title'
import { carouselBasicNewsData, longCarouselBasicNewsData } from '@/lib/constants/pre-data'
import React from 'react'

export const ArticleHero = () => {
  return (
    <div className="w-full flex gap-8 justify-between mt-4 px-6">
      {/* fat news section div */}
      <div className="flex gap-4 w-[71%]">
        <div className="w-1/2">
          <FullWidthAlternateTitle title="Politics" />
          <div className="mb-8 w-full" />
          <NewsCarousel newsItems={carouselBasicNewsData ?? []} />
        </div>
        <div className="w-1/2">
          <FullWidthAlternateTitle title="Popular " />
          <div className="mb-8 w-full" />
          <NewsCarousel newsItems={carouselBasicNewsData ?? []} />
        </div>
      </div>

      {/* sub news section */}
      <div className="flex gap-2 w-[28%] flex-col">
        <BasicTitle title="Latest" />
        <div className="flex flex-col gap-4">
          {longCarouselBasicNewsData.slice(0, 3).map((item, index) => (
            <div className="w-full" key={index}>
              <DarkerBasicNewsWithTag backgroundColor='white' newsContent={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
