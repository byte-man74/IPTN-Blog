import FullWidthAlternateTitle from '@/_components/public/core/section-title/full-width-alternate-title'
import OverlayedNewsImage from '@/_components/public/core/news-component/overlayed-news-image'
import React from 'react'
import { longCarouselBasicNewsData } from '@/lib/constants/pre-data'

/**
 * TopNews component displays the top news section with a grid of news items.
 * @param {Object} props - The props for the component.
 * @param {NewsItemType[]} props.newsItems - The list of news items to display.
 * @returns {JSX.Element} The rendered TopNews component.
 */
const TopNews = () => {
  return (
    <div className="relative px-8 py-5 flex flex-col gap-8">
        <FullWidthAlternateTitle title="Top News"/>
        <div className="grid grid-cols-4 px-6 grid-rows-2 gap-4">
          {longCarouselBasicNewsData?.map((item, index) => (
            <OverlayedNewsImage key={index} newsItem={item} />
          ))}
        </div>
    </div>
  )
}

export default TopNews
