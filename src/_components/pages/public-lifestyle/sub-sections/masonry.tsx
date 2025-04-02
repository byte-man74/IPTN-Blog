'use client'
import MasonryNewsElement from '@/_components/public/core/news-component/masonry-news-element'
import FullWidthAlternateTitle from '@/_components/public/core/section-title/full-width-alternate-title'
import { longCarouselBasicNewsData } from '@/lib/constants/pre-data'
import Masonry from 'react-masonry-css'

const MasonryNewsGrid = () => {
  // Define breakpoints for responsive columns
  const breakpointColumns = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  }

  return (
    <div className="mt-8 flex flex-col gap-8 pb-8">
      <div className="px-8">
        <FullWidthAlternateTitle title="Fashion" />
      </div>
      <div className="px-10">
        <Masonry
          breakpointCols={breakpointColumns}
          className="flex w-full gap-x-2"
          style={{
            rowGap: 30,
          }}
          columnClassName="masonry-grid_column"
        >
          {longCarouselBasicNewsData.map((newsItem, index) => (
            <MasonryNewsElement newsItem={newsItem} key={index} />
          ))}
        </Masonry>
      </div>
    </div>
  )
}

export default MasonryNewsGrid
