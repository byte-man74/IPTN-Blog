'use client'

import BasicNewsWithTag from '@/_components/public/core/news-component/basic-news-with-tag'
import OverlayedNewsImage from '@/_components/public/core/news-component/overlayed-news-image'
import BasicTitle from '@/_components/public/core/section-title/basic-title'
import { HomePageEditorsPick } from '@/app/(server)/modules/site-configurations/site-config.constants'
import { useFetchNews } from '@/network/http-service/news.hooks'
import { NewsDTO } from '@/app/(server)/modules/news/news.types'
import React from 'react'

/**
 * EditorsPick component
 *
 * This component displays editor's selected news items in a responsive layout.
 * Features:
 * - Full width on mobile devices, 30% width on larger screens
 * - Displays a featured news item with overlay
 * - Shows a row of basic news items below the featured item
 * - Responsive layout adapts to different screen sizes
 * - Skeleton loading state while data is being fetched
 */
const EditorsPick = () => {
  const { data, isLoading } = useFetchNews(
    {
      categorySlug: HomePageEditorsPick.slug,
    },
    1,
    HomePageEditorsPick.threshold || HomePageEditorsPick.maxThreshold || 2
  )

  // Transform the news item to match NewsDTO structure
  const featuredNewsItem: NewsDTO | undefined = data?.data[0]
    ? {
        ...data.data[0],
        analytics: {
          views: data.data[0].analytics?.views || 0,
          likes: data.data[0].analytics?.likes || 0,
          shares: data.data[0].analytics?.shares || 0,
          readDuration: data.data[0].analytics?.readDuration || '5 min read',
        },
      }
    : undefined

  // Get the rest of the news items for the small news section
  const smallNewsItems = data?.data.slice(1) || []

  return (
    <div className="w-full sm:w-[30%] min-h-full flex flex-col justify-between">
      <BasicTitle title="Editor's pick" />

      {isLoading ? (
        <div className="w-full h-[21rem] bg-gray-200 animate-pulse rounded"></div>
      ) : (
        <OverlayedNewsImage newsItem={featuredNewsItem} />
      )}

      <div className="flex mt-3 flex-col gap-3">
        {isLoading
          ? // Skeleton loading for small news items
            Array(3)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="w-full h-24 bg-gray-200 animate-pulse rounded"></div>
              ))
          : smallNewsItems.length > 0 &&
            smallNewsItems.map((news, index: number) => (
              <BasicNewsWithTag key={index} newsContent={news} />
            ))}
      </div>
    </div>
  )
}

export default EditorsPick
