import BasicNewsTitleAndImage from '@/_components/public/core/news-component/basic-news-title-and-image'
import DarkerBasicNewsWithTag from '@/_components/public/core/news-component/darker-basic-news-with-tag'
import FullWidthAlternateTitle from '@/_components/public/core/section-title/full-width-alternate-title'
import { NewsCategoryCarousel } from '@/_components/public/news-category-carousel'
import { carouselBasicNewsData, longCarouselBasicNewsData } from '@/lib/constants/pre-data'

import React from 'react'

/**
 * Politics component displays the politics news section with a grid of news items.
 * @returns {JSX.Element} The rendered Politics component.
 */
const Politics = () => {
  // Ensure carouselBasicNewsData is not null or undefined
  const newsData = (carouselBasicNewsData ?? []).slice(0, 2)

  return (
    <div className="relative px-8 py-5 flex flex-col gap-8">
      <FullWidthAlternateTitle title="Politics" />
      <div className="flex gap-6 px-6">

        
        <div className="w-3/5">{newsData.length > 0 && <BasicNewsTitleAndImage />}</div>
        <div className="w-2/5 flex flex-col gap-8">
          {newsData.slice(1).map((item, index) => (
            <div className="w-full" key={index}>
              <DarkerBasicNewsWithTag newsContent={item} />
            </div>
          ))}
        </div>
      </div>

      <div className=" px-2 w-full">
        <NewsCategoryCarousel
          items={longCarouselBasicNewsData ?? []}
          carouselItem={{ itemType: 'basic-news-with-tag-v2' }}
        />
      </div>
    </div>
  )
}

export default Politics
