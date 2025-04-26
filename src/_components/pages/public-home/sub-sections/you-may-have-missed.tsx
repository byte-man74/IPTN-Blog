'use client'

import type React from 'react'
import OverlayedNewsImage from '@/_components/public/core/news-component/overlayed-news-image'
import FullWidthAlternateTitle from '@/_components/public/core/section-title/full-width-alternate-title'
import DarkerBasicNewsWithTag from '@/_components/public/core/news-component/darker-basic-news-with-tag'
import type { NewsDTO } from '@/app/(server)/modules/news/news.types'
import { Skeleton } from '@/components/ui/skeleton'
import { AdSpacing } from '@/_components/global/ads-spacing'

/**
 * This component displays a section with recommended news items.
 * It has a responsive layout that adapts to different screen sizes.
 */
const HomePageFreeContent: React.FC<{
  title?: string
  newsItems?: NewsDTO[]
  isLoading?: boolean
}> = ({ title = 'Recommended Content', newsItems = [], isLoading = false}) => {
  // Helper function to render news item or ad space
  const renderNewsItem = (index: number) => {
    return newsItems.length > index ? (
      <DarkerBasicNewsWithTag newsItem={newsItems[index]} backgroundColor="#D9D9D9" />
    ) : (
      <AdSpacing />
    )
  }

  return (
    <div className="mt-6 pb-16 md:pb-24 flex flex-col gap-4">
      <FullWidthAlternateTitle title={title} />

      {isLoading ? (
        // Loading skeleton layout
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* First column */}
          <div className="space-y-4">
            <Skeleton className="w-full aspect-[16/9]" />
            <Skeleton className="w-full h-[180px]" />
          </div>

          {/* Second column */}
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="w-full h-[140px]" />
            ))}
          </div>

          {/* Third column */}
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="w-full h-[140px]" />
            ))}
          </div>
        </div>
      ) : (
        // Actual content layout
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {/* First column */}
          <div className="space-y-4">
            <div className="w-full aspect-[16/9] h-[65%]">
              {newsItems.length > 0 ? (
                <OverlayedNewsImage newsItem={newsItems[0]} height={'100%'} />
              ) : (
                <AdSpacing />
              )}
            </div>
            <div className="h-[31%]">{renderNewsItem(1)}</div>
          </div>

          {/* Second column */}
          <div className="space-y-4">
            <div className="h-[140px]">{renderNewsItem(2)}</div>
            <div className="h-[140px]">{renderNewsItem(3)}</div>
            <div className="h-[140px]">{renderNewsItem(4)}</div>
          </div>

          {/* Third column */}
          <div className="space-y-4">
            <div className="h-[140px]">{renderNewsItem(5)}</div>
            <div className="h-[140px]">{renderNewsItem(6)}</div>
            <div className="h-[140px]">{renderNewsItem(7)}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePageFreeContent
