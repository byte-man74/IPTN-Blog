"use client"

import type React from "react"
import { AppImage } from "@/_components/global/app-image"
import { Calendar, Eye, MessageSquare, ArrowRight } from "lucide-react"
import { AppLink } from "@/_components/global/app-link"
import type { NewsDTO } from "@/app/(server)/modules/news/news.types"
import { ClientRoutes } from "@/lib/routes/client"
import { cleanUpNewsTitle } from "@/app/(server)/modules/news/news.utils"
import { ViewsThreshold } from "@/app/(server)/modules/site-configurations/site-config.constants"

/**
 * AlternateNewsWithDescription component displays a news article card with an image, metadata, and description.
 * This is an alternate version of the NewsWithDescription component with a different layout.
 * @param {NewsDTO} newsItem - The news item data for the component.
 * @param {boolean} allowMargin - Optional flag to allow margin on the component.
 * @returns {JSX.Element} The rendered AlternateNewsWithDescription component.
 */
const AlternateNewsWithDescription: React.FC<{ newsItem?: NewsDTO; allowMargin?: boolean }> = ({
  newsItem,
  allowMargin = false,
}) => {
  if (!newsItem) {
    return null
  }

  const { coverImage, title, pubDate, slug, analytics, comments } = newsItem

  const date = pubDate
    ? new Date(pubDate).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "2-digit" })
    : undefined
  const views = analytics?.views || 0
  const commentsCount = comments?.length || 0
  const authorName = "Admin"
  const shouldShowViews = views >= ViewsThreshold

  return (
    <AppLink href={ClientRoutes.viewNews(slug)} className="w-full h-full block">
      <div
        className={`w-full h-full flex flex-col overflow-hidden border border-gray-200 bg-white
        ${allowMargin ? "mx-4" : ""}
        transition-all duration-300 hover:shadow-lg hover:border-primaryGreen/50
        hover:translate-y-[-4px] group`}
      >
        <div className="relative w-full overflow-hidden">
          <AppImage
            src={coverImage as string}
            alt={title ?? "News image"}
            className="w-full h-48 sm:h-60 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black opacity-50 group-hover:opacity-40 transition-opacity duration-300"></div>
        </div>

        <div className="p-3 sm:p-4 flex flex-col flex-grow">
          {/* Author section */}
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-primaryGreen text-white
            group-hover:scale-110 transition-transform duration-300">
              <span className="text-xs sm:text-sm">📝</span>
            </div>
            <span className="text-xs sm:text-sm font-medium text-primaryGreen">{authorName}</span>
          </div>

          {/* Title */}
          <h2 className="text-base sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 uppercase line-clamp-2
          group-hover:text-primaryGreen transition-colors duration-300">{cleanUpNewsTitle(title)}</h2>

          {/* Spacer to push metrics to bottom */}
          <div className="flex-grow"></div>

          {/* Metrics */}
          <div className="flex items-center justify-between mt-3 sm:mt-4 flex-wrap gap-2">
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              {shouldShowViews && (
                <div className="flex items-center gap-1">
                  <div className="bg-primaryGreen p-1 sm:p-1.5 rounded-full flex items-center justify-center
                  group-hover:bg-primaryDark transition-colors duration-300">
                    <Eye size={12} className="text-white" />
                  </div>
                  <span className="text-xs font-medium">{views}</span>
                </div>
              )}

              <div className="flex items-center gap-1">
                <div className="bg-primaryGreen p-1 sm:p-1.5 rounded-full flex items-center justify-center
                group-hover:bg-primaryDark transition-colors duration-300">
                  <MessageSquare size={12} className="text-white" />
                </div>
                <span className="text-xs font-medium">{commentsCount}</span>
              </div>

              <div className="flex items-center gap-1">
                <div className="bg-primaryGreen p-1 sm:p-1.5 rounded-full flex items-center justify-center
                group-hover:bg-primaryDark transition-colors duration-300">
                  <Calendar size={12} className="text-white" />
                </div>
                <span className="text-xs font-medium">{date}</span>
              </div>
            </div>

            <div className="text-primaryGreen font-medium text-xs sm:text-sm flex items-center gap-1
            group-hover:text-primaryDark transition-colors duration-300">
              View Article
              <ArrowRight size={16} className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    </AppLink>
  )
}

export default AlternateNewsWithDescription
