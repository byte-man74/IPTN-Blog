"use client"
import React from 'react'
import { AppLink } from '@/_components/global/app-link'
import { useFetchPopularTags } from '@/network/http-service/news.hooks'

/**
 * HeroTags component displays popular tags or categories in the hero section
 * These tags allow users to quickly navigate to specific content categories
 *
 * The component is hidden on mobile devices and only visible on larger screens
 */
const HeroTags = () => {
  // Fetch popular tags from API
  const { data: popularTags, isLoading } = useFetchPopularTags();

  // Perform nullish check for data from API
  const tags = popularTags ?? [];

  return (
    <div className="w-full sticky top-[4rem] z-50 hidden sm:block bg-[#E4E4E4]">
        <div className="flex flex-wrap items-center gap-8 h-16">
          <div className="h-full flex w-[12rem] items-center justify-end bg-gray-200 px-6">
            <span className="font-semibold">Popular Tags</span>
          </div>
          {isLoading ? (
            <span className="text-gray-500">Loading tags...</span>
          ) : tags.length > 0 ? (
            tags.map((tag) => (
              <AppLink
                key={tag.id}
                href={`/news?tagIds=${tag.id}`}
                className="text-gray-700 hover:text-primaryGreen hover:font-medium transition-all duration-300 transform hover:scale-110 hover:underline px-2 py-1 rounded hover:bg-gray-100"
              >
                {`#${tag.name || 'tag'}`}
              </AppLink>
            ))
          ) : (
            <span className="text-gray-500">No popular tags available</span>
          )}
        </div>
    </div>
  )
}

export default HeroTags
