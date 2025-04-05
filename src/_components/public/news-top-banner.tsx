import React from 'react'
import { FiCircle } from 'react-icons/fi'
import BreakingNewsItem from './core/breaking-news-item'

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
 *
 * @param {Object} props - Component properties
 * @param {string} props.title - The title to display on the banner
 */

interface NewsBannerProps {
    title: string
}
export const NewsBanner = ({ title }: NewsBannerProps) => {
  // Dummy breaking news data
  const dummyBreakingNews = [
    {
      id: 1,
      title: "Global Summit on Climate Change Begins Today",
      url: "/news/climate-summit",
      imageUrl: "https://images.pexels.com/photos/2990650/pexels-photo-2990650.jpeg",
      timestamp: "2h ago"
    },
    {
      id: 2,
      title: "Tech Giant Announces Revolutionary New Product",
      url: "/news/tech-announcement",
      imageUrl: "https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg",
      timestamp: "3h ago"
    },
    {
      id: 3,
      title: "Major Sports Team Wins Championship After 20 Years",
      url: "/news/sports-championship",
      imageUrl: "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg",
      timestamp: "5h ago"
    },
    {
      id: 4,
      title: "Economic Report Shows Unexpected Growth in Q3",
      url: "/news/economic-growth",
      imageUrl: "https://images.pexels.com/photos/534216/pexels-photo-534216.jpeg",
      timestamp: "6h ago"
    }
  ];

  // Perform nullish check for data
  const breakingNews = dummyBreakingNews ?? [];

  return (
    <div className="relative w-full bg-[#DCDCDC] flex items-center h-[2.5rem] xs:h-[3rem] sm:h-[3.5rem] md:h-[4rem] overflow-hidden">
      {/* Title section with improved responsive styling */}
      <div className="font-bold px-1.5 xs:px-2 sm:px-4 md:px-6 lg:px-8 mr-1.5 xs:mr-2 sm:mr-4 h-full bg-primaryGreen flex items-center justify-center text-white absolute left-0 z-10 shadow-md">
        <FiCircle className="mr-1 xs:mr-1.5 sm:mr-2 animate-pulse text-xs xs:text-sm sm:text-base md:text-lg" />
        <span className="text-2xs xs:text-xs sm:text-sm md:text-base truncate max-w-[80px] xs:max-w-full">{title}</span>
      </div>

      {/* News content with improved responsive padding and spacing */}
      <div className="text-gray-700 flex items-center overflow-hidden whitespace-nowrap pl-[3.5rem] xs:pl-[4.5rem] sm:pl-[7rem] md:pl-[9rem] lg:pl-[10rem]">
        <div className="animate-marquee flex items-center">
            {breakingNews && breakingNews.length > 0 ?
              breakingNews.map((newsItem) => (
                <BreakingNewsItem
                  key={newsItem?.id}
                  title={newsItem?.title ?? ''}
                  url={newsItem?.url ?? '#'}
                  imageUrl={newsItem?.imageUrl ?? ''}
                  timestamp={newsItem?.timestamp ?? ''}
                />
              ))
            : <span className="mx-1.5 xs:mx-2 sm:mx-4 md:mx-6 text-2xs xs:text-xs sm:text-sm md:text-base">No breaking news at this time</span>}
        </div>
      </div>
    </div>
  )
}
