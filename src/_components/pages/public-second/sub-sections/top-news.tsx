import FullWidthAlternateTitle from '@/_components/public/core/section-title/full-width-alternate-title'
import OverlayedNewsImage from '@/_components/public/core/news-component/overlayed-news-image'
import React from 'react'
import { CONTENT_CRITERIA } from '@/app/(server)/modules/site-configurations/site-config.constants'
import { useFetchNews } from '@/network/http-service/news.hooks'
import { StandardNewsItemSkeleton } from '@/_components/global/skeletons'

interface TopNewsProps {
  category: number
}

/**
 * TopNews component displays the top news section with a responsive grid of news items.
 * @param {TopNewsProps} props - The props for the component including category.
 */
const TopNews = ({ category }: TopNewsProps) => {
  const { data: topNewsData, isLoading: topNewsDataIsLoading } = useFetchNews(
    {
      published: true,
      categoryIds: [category],
      categorySlug: CONTENT_CRITERIA.topNews.slug,
    },
    1,
    8
  )

  // Function to render grid items (news)
  const renderGridItems = () => {
    if (topNewsDataIsLoading) {
      // Show skeletons while loading
      return Array(8)
        .fill(0)
        .map((_, index) => <StandardNewsItemSkeleton key={index} />)
    }

    const newsItems = topNewsData?.data || []

    // Add available news items
    return newsItems.map((newsItem, index) => (
      <OverlayedNewsImage key={`news-${index}`} newsItem={newsItem} />
    ))
  }

  return (
    <div className="relative px-4 sm:px-6 lg:px-8 py-5 flex flex-col gap-4 sm:gap-6 lg:gap-8">
      <FullWidthAlternateTitle title={CONTENT_CRITERIA.topNews.name} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {renderGridItems()}
      </div>
    </div>
  )
}

export default TopNews
