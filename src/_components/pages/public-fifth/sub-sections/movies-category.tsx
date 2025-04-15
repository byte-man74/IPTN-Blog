import { longCarouselBasicNewsData } from '@/lib/constants/pre-data'
import OverlayedNewsImage from '@/_components/public/core/news-component/overlayed-news-image'
import React from 'react'
import FullWidthAlternateTitle from '@/_components/public/core/section-title/full-width-alternate-title'

/**
 * This component renders the Movies Category section.
 * It maps the longCarouselBasicNewsData to display OverlayedNewsImage components in a 3 * n grid.
 */
export const MoviesCategory = () => {
  return (
    <div className='mt-20 px-8'>
        <FullWidthAlternateTitle title="Movies" />
        <div className="flex w-full px-4 flex-wrap">
            {longCarouselBasicNewsData?.map((newsItem, index) => (
                <div key={index} className="w-full sm:w-1/2 lg:w-1/3 p-2">
                    <OverlayedNewsImage newsItem={newsItem} />
                </div>
            ))}
        </div>
    </div>

  )
}
