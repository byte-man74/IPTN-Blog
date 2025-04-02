"use client"

import { AppImage } from '@/_components/global/app-image'
import React from 'react'
import { NewsItemType } from '@/types/public'
import { AppLink } from '@/_components/global/app-link'
import { Calendar, Clock } from 'lucide-react'

/**
 * MasonryNewsElement component displays a news item in a masonry layout.
 * @param {NewsItemType} newsItem - The news item data for the component.
 */
const MasonryNewsElement: React.FC<{ newsItem: NewsItemType }> = ({ newsItem }) => {
  const { imageUrl, title, date, readTime, slug } = newsItem ?? {}

  return (
    <AppLink href={slug} className="mb-8 relative overflow-hidden rounded-md group">
      {/* Use a random aspect ratio for each card */}
      <div className="relative" style={{
        height: `${Math.floor(Math.random() * (500 - 300) + 300)}px`,
        marginBottom: "0.6rem"
      }}>
        <AppImage
          src={imageUrl ?? '/placeholder-image.jpg'}
          alt={title ?? "News image"}
          className="object-cover transition-transform duration-300 h-full "
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
      </div>

      {/* Text content */}
      <div className="absolute bottom-0 left-0 p-4 w-full">
        <h3 className="text-white font-bold text-lg mb-2">{title ?? "Untitled"}</h3>
        <div className="flex items-center space-x-3">
          <div className="flex items-center px-2 py-1 gap-2">
          <div className="rounded-full p-2 bg-primaryGreen">
                <Calendar className="text-white w-4 h-4" />
            </div>
            <span className="text-white text-sm p-1 bg-[#1B1B1B]">{date ?? "Date not available"}</span>
          </div>
          <div className="flex items-center py-1 gap-2">
            <div className="rounded-full p-2 bg-primaryGreen">
                <Clock className="text-white w-4 h-4" />
            </div>
            <span className="text-white text-sm p-1 bg-[#1B1B1B]">{readTime ?? "Read time not available"}</span>
          </div>
        </div>
      </div>
    </AppLink>
  )
}

export default MasonryNewsElement
