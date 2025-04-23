"use client"

import { AppImage } from '@/_components/global/app-image'
import React from 'react'
import { NewsDTO } from '@/app/(server)/modules/news/news.types'
import { AppLink } from '@/_components/global/app-link'
import { Calendar, Clock, MessageCircle } from 'lucide-react'
import { calculateTimeStampFromDate } from "@/app/(server)/modules/news/news.utils";
import { ClientRoutes } from '@/lib/routes/client'


// Threshold for showing views


/**
 * MasonryNewsElement component displays a news item in a masonry layout.
 * @param {NewsDTO} newsItem - The news item data for the component.
 */
const MasonryNewsElement: React.FC<{ newsItem: NewsDTO }> = ({ newsItem }) => {
  const { coverImage, title, pubDate, analytics, slug, comments } = newsItem ?? {}
  const commentCount = comments?.length || 0;

  return (
    <AppLink href={`/${ClientRoutes.viewNews(slug)}`} className="mb-8 relative overflow-hidden rounded-md group">
      {/* Use a random aspect ratio for each card */}
      <div className="relative" style={{
        height: `${Math.floor(Math.random() * (500 - 300) + 300)}px`,
        marginBottom: "0.6rem"
      }}>
        <AppImage
          src={coverImage ?? ""}
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
            <span className="text-white text-sm p-1 bg-[#1B1B1B]">{pubDate ? calculateTimeStampFromDate(pubDate) : "Date not available"}</span>
          </div>
          {analytics?.readDuration && (
            <div className="flex items-center py-1 gap-2">
              <div className="rounded-full p-2 bg-primaryGreen">
                  <Clock className="text-white w-4 h-4" />
              </div>
              <span className="text-white text-sm p-1 bg-[#1B1B1B]">{`${analytics.readDuration} min read`}</span>
            </div>
          )}
          {commentCount > 0 && (
            <div className="flex items-center py-1 gap-2">
              <div className="rounded-full p-2 bg-primaryGreen">
                  <MessageCircle className="text-white w-4 h-4" />
              </div>
              <span className="text-white text-sm p-1 bg-[#1B1B1B]">{`${commentCount} comment${commentCount !== 1 ? 's' : ''}`}</span>
            </div>
          )}
        </div>
      </div>
    </AppLink>
  )
}

export default MasonryNewsElement
