import React from 'react'
import { FiCircle } from 'react-icons/fi'
import BreakingNewsItem from './core/breaking-news-item'

/**
 * HeroBreakingNews component displays a scrolling banner of breaking news items
 * Features:
 * - Animated marquee effect for continuous scrolling of news items
 * - Visual indicator with pulsing circle icon
 * - Displays news items with images, titles, and timestamps
 * - Falls back to a message when no news items are available
 */
export const HeroBreakingNews = () => {
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

  // Breaking news banner similar to the image
  return (
    <div className="relative w-full bg-[#DCDCDC] flex items-center h-[4rem]">
      <div className="font-bold px-8 mr-4 h-full bg-primaryGreen flex items-center text-white absolute left-0 z-10">
        <FiCircle className="mr-2 animate-pulse" size={24} />
        <span>Breaking News</span>
      </div>
      <div className="text-gray-700 flex items-center overflow-hidden whitespace-nowrap">
        <div className="animate-marquee flex items-center">
            {dummyBreakingNews && dummyBreakingNews.length > 0 ?
              dummyBreakingNews.map((newsItem) => (
                <BreakingNewsItem
                  key={newsItem?.id}
                  title={newsItem?.title ?? ''}
                  url={newsItem?.url ?? '#'}
                  imageUrl={newsItem?.imageUrl}
                  timestamp={newsItem?.timestamp}
                />
              ))
            : <span className="mx-6">No breaking news at this time</span>}
        </div>
      </div>
    </div>
  )
}
