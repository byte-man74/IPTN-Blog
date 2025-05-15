"use client"

import { AppImage } from '@/_components/global/app-image'
import React from 'react'
import { NewsDTO } from '@/app/(server)/modules/news/news.types'
import { AppLink } from '@/_components/global/app-link'
import { Calendar, Clock, MessageCircle, Eye } from 'lucide-react'
import { calculateTimeStampFromDate, cleanUpNewsTitle } from "@/app/(server)/modules/news/news.utils"
import { ClientRoutes } from '@/lib/routes/client'
import { ViewsThreshold } from "@/app/(server)/modules/site-configurations/site-config.constants"

/**
 * MasonryNewsElement component displays a news item in a masonry layout.
 * @param {NewsDTO} newsItem - The news item data for the component.
 */
const MasonryNewsElement: React.FC<{ newsItem: NewsDTO }> = ({ newsItem }) => {
  const { coverImage, title, pubDate, analytics, slug, comments, categories } = newsItem ?? {}
  const commentCount = comments?.length || 0;

  return (
    <AppLink href={ClientRoutes.viewNews(slug)} className="mb-8 relative overflow-hidden rounded-md group w-full">
      {/* Use a random aspect ratio for each card */}
      <div className="relative" style={{
        height: `${Math.floor(Math.random() * (500 - 300) + 300)}px`,
        marginBottom: "0.6rem"
      }}>
        <AppImage
          src={coverImage ?? "/placeholder.jpg"}
          alt={cleanUpNewsTitle(title) ?? "News image"}
          className="object-cover transition-transform duration-300 group-hover:scale-105 h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
      </div>

      {/* Text content */}
      <div className="absolute bottom-0 left-0 p-2 sm:p-4 w-full">
        {categories && categories.length > 0 && (
          <div className="inline-block bg-primaryGreen px-2 py-0.5 rounded-sm mb-2">
            <span className="text-white text-xs sm:text-sm font-medium">{categories[0].name}</span>
          </div>
        )}
        <h3 className="text-white font-bold text-lg mb-2 w-full line-clamp-2 group-hover:text-primaryGreen/90 transition-colors duration-300">
          {cleanUpNewsTitle(title, true) ?? "Untitled"}
        </h3>
        <div className="flex flex-wrap items-center gap-2 sm:space-x-3">
          <div className="flex items-center px-1 sm:px-2 py-1 gap-1 sm:gap-2">
            <div className="rounded-full p-1.5 sm:p-2 bg-primaryGreen">
                <Calendar className="text-white w-3 h-3 sm:w-4 sm:h-4" />
            </div>
            <span className="text-white text-xs sm:text-sm p-1 bg-[#1B1B1B]">{pubDate ? calculateTimeStampFromDate(pubDate) : ""}</span>
          </div>
          {analytics?.readDuration && (
            <div className="flex items-center py-1 gap-1 sm:gap-2">
              <div className="rounded-full p-1.5 sm:p-2 bg-primaryGreen">
                  <Clock className="text-white w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <span className="text-white text-xs sm:text-sm p-1 bg-[#1B1B1B]">{`${analytics.readDuration} read`}</span>
            </div>
          )}
          {analytics?.views !== undefined && analytics.views >= ViewsThreshold && (
            <div className="flex items-center py-1 gap-1 sm:gap-2">
              <div className="rounded-full p-1.5 sm:p-2 bg-primaryGreen">
                  <Eye className="text-white w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <span className="text-white text-xs sm:text-sm p-1 bg-[#1B1B1B]">{`${analytics.views} views`}</span>
            </div>
          )}
          {commentCount > 0 && (
            <div className="flex items-center py-1 gap-1 sm:gap-2">
              <div className="rounded-full p-1.5 sm:p-2 bg-primaryGreen">
                  <MessageCircle className="text-white w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <span className="text-white text-xs sm:text-sm p-1 bg-[#1B1B1B]">{`${commentCount} comment${commentCount !== 1 ? 's' : ''}`}</span>
            </div>
          )}
        </div>
      </div>
    </AppLink>
  )
}

export default MasonryNewsElement
