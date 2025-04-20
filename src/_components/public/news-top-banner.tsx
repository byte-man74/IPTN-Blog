"use client"

import React from 'react'
import { FiCircle } from 'react-icons/fi'
import BreakingNewsItem from './core/breaking-news-item'
import { useFetchNews } from '@/network/http-service/news.hooks'
import { HomePageBreakingNews } from '@/app/(server)/modules/site-configurations/site-config.constants'
import { calculateTimeStampFromDate, cleanUpNewsTitle } from '@/app/(server)/modules/news/news.utils';

/**
 * NewsBanner component displays a scrolling banner of news items
 *
 * Features:
 * - Animated marquee effect for continuous scrolling of news items
 * - Visual indicator with pulsing circle icon
 * - Displays news items with images, titles, and timestamps
 * - Falls back to a message when no news items are available
 * - Fully responsive across all device sizes with optimized mobile experience
 * - Adaptive spacing, font sizes, and layout based on viewport width
 * - Skeleton loading state while data is being fetched
 * - Enhanced mobile experience with improved touch interactions and readability
 *
 * @param {Object} props - Component properties
 * @param {string} props.title - The title to display on the banner
 */

interface NewsBannerProps {
    title: string
}
export const NewsBanner = ({ title }: NewsBannerProps) => {
    const { data: breakingNews, isLoading } = useFetchNews(
        {   published: true,
            categorySlug: HomePageBreakingNews.slug
        }, 1, HomePageBreakingNews.maxThreshold
    )

  return (
    <div className="relative w-full bg-gradient-to-r from-[#E8E8E8] to-[#DCDCDC] flex items-center h-[3rem] xs:h-[3.25rem] sm:h-[3.5rem] md:h-[4rem] overflow-hidden shadow-sm">
      {/* Title section with improved responsive styling */}
      <div className="font-bold px-2 xs:px-2.5 sm:px-4 md:px-6 lg:px-8 mr-1.5 xs:mr-2 sm:mr-4 h-full bg-primaryGreen flex items-center justify-center text-white absolute left-0 z-10 shadow-md">
        <FiCircle className="mr-1.5 xs:mr-2 sm:mr-2.5 animate-pulse text-sm xs:text-sm sm:text-base md:text-lg" />
        <span className="text-xs xs:text-sm sm:text-sm md:text-base truncate xs:max-w-full font-extrabold">{title}</span>
      </div>

      {/* News content with improved responsive padding and spacing */}
      <div className="text-gray-800 flex items-center overflow-hidden whitespace-nowrap pl-[4.5rem] xs:pl-[5rem] sm:pl-[7rem] md:pl-[9rem] lg:pl-[10rem]">
        {isLoading ? (
          <div className="flex items-center">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center mx-4 animate-pulse">
                <div className="w-8 h-8 bg-gray-300 rounded-full mr-2 shadow-sm"></div>
                <div className="flex flex-col">
                  <div className="h-2.5 bg-gray-300 rounded-full w-32 mb-1.5"></div>
                  <div className="h-2 bg-gray-300 rounded-full w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="animate-marquee flex items-center">
            {breakingNews && breakingNews.data.length > 0 ?
              breakingNews.data.map((newsItem) => (
                <BreakingNewsItem
                  key={newsItem?.id}
                  title={cleanUpNewsTitle(newsItem?.title) ?? ''}
                  url={newsItem?.slug ?? '#'}
                  imageUrl={newsItem?.coverImage ?? ''}
                  timestamp={newsItem?.pubDate ? calculateTimeStampFromDate(newsItem.pubDate) : 'Just now'}
                />
              ))
            : <span className="mx-2 xs:mx-2.5 sm:mx-4 md:mx-6 text-xs xs:text-sm sm:text-sm md:text-base font-medium">No breaking news at this time</span>}
          </div>
        )}
      </div>
    </div>
  )
}
