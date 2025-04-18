'use client'
import MasonryNewsElement from '@/_components/public/core/news-component/masonry-news-element'
import FullWidthAlternateTitle from '@/_components/public/core/section-title/full-width-alternate-title'
import Masonry from 'react-masonry-css'
import { NewsDTO } from '@/app/(server)/modules/news/news.types'


interface MasonryNewsGridProps {
  data?: NewsDTO[]
  isLoading?: boolean
  title?: string
}

const MasonryNewsGrid = ({ data = [], isLoading = false, title = "Top Picks" }: MasonryNewsGridProps) => {
  // Define breakpoints for responsive columns
  const breakpointColumns = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  }

  return (
    <div className="mt-4 sm:mt-6 md:mt-8 flex flex-col gap-4 sm:gap-6 md:gap-8 pb-4 sm:pb-6 md:pb-8">
      <div className="px-4 sm:px-6 md:px-8">
        <FullWidthAlternateTitle title={title} />
      </div>
      <div className="px-4 sm:px-6 md:px-10">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, index) => (
              <div key={index} className="bg-gray-100 animate-pulse h-64 rounded-md"></div>
            ))}
          </div>
        ) : (
          <Masonry
            breakpointCols={breakpointColumns}
            className="flex w-full gap-x-1 sm:gap-x-2"
            style={{
              rowGap: '20px',
            }}
            columnClassName="masonry-grid_column"
          >
            {data.map((newsItem, index) => (
              <div className="mb-2 sm:mb-4" key={newsItem.id || index}>
                <MasonryNewsElement newsItem={newsItem} />
              </div>
            ))}
          </Masonry>
        )}
      </div>
    </div>
  )
}

export default MasonryNewsGrid
