import React from 'react'
import BasicNews from '@/_components/public/core/news-component/basic-news'
import { useFetchNews } from '@/network/http-service/news.hooks'
import { BasicNewsSkeleton } from '@/_components/global/skeletons'

interface EntertainmentFullWidthSubArticleProps {
  category: number
}

/**
 * EntertainmentFullWidthSubArticle component displays a list of news items in two horizontal marquee containers.
 * Ensures all data fields are checked for nullish values before rendering.
 * The marquee effect provides a continuous scrolling effect for a dynamic UI.
 */
export const FifthSectionFullWidthSubArticle = ({
  category,
}: EntertainmentFullWidthSubArticleProps) => {
  const { data: latestNews, isLoading } = useFetchNews(
    {
      published: true,
      categoryIds: [category],
    },
    1,
    12
  )

  const newsItems = latestNews?.data || []
  const firstHalf = newsItems.slice(0, Math.ceil(newsItems.length / 2))
  const secondHalf = newsItems.slice(Math.ceil(newsItems.length / 2))

  return (
    <div className="w-full mt-4 pl-8 flex flex-col gap-2 h-auto">
      <div className="w-full flex overflow-hidden">
        <div className="flex animate-marquee gap-2">
          {isLoading ? (
            // Show skeletons while loading
            Array(6)
              .fill(0)
              .map((_, index) => <BasicNewsSkeleton key={index} />)
          ) : firstHalf.length > 0 ? (
            // Show first half of news items
            firstHalf.map((newsItem, index) => (
              <div key={newsItem.id || index} className="h-[9rem] w-1/2 flex-shrink-0">
                <BasicNews newsContent={newsItem} />
              </div>
            ))
          ) : (
            // Show placeholder if no data
            <div className="h-[9rem] w-full flex items-center justify-center">
              <p className="text-gray-500">No content available</p>
            </div>
          )}
        </div>
      </div>
      <div className="w-full flex gap-4 overflow-hidden">
        <div className="flex animate-marquee gap-2 ml-8">
          {isLoading ? (
            // Show skeletons while loading
            Array(6)
              .fill(0)
              .map((_, index) => <BasicNewsSkeleton key={index} />)
          ) : secondHalf.length > 0 ? (
            // Show second half of news items
            secondHalf.map((newsItem, index) => (
              <div key={newsItem.id || index} className="h-[9rem] w-1/2 flex-shrink-0">
                <BasicNews newsContent={newsItem} />
              </div>
            ))
          ) : (
            // Show placeholder if no data
            <div className="h-[9rem] w-full flex items-center justify-center">
              <p className="text-gray-500">No content available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
