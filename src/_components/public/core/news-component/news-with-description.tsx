"use client"

import React from 'react'
import { AppImage } from '@/_components/global/app-image'
import { User, Calendar, Eye, MessageSquare } from "lucide-react"
import { AppLink } from '@/_components/global/app-link'
import { NewsDTO } from '@/app/(server)/modules/news/news.types'
import { ClientRoutes } from '@/lib/routes/client'
import { cleanUpNewsTitle } from '@/app/(server)/modules/news/news.utils'
import { ViewsThreshold } from '@/app/(server)/modules/site-configurations/site-config.constants'

/**
 * NewsWithDescription component displays a news article card with an image, metadata, and description.
 * @param {NewsDTO} newsItem - The news item data for the component.
 * @param {number} maxDescriptionLength - Optional maximum length for the description.
 * @param {boolean} allowMargin - Optional flag to allow margin on the component.l threshold for displaying view count.
 * @returns {JSX.Element} The rendered NewsWithDescription component.
 */
const NewsWithDescription: React.FC<{
  newsItem?: NewsDTO,
  maxDescriptionLength?: number,
  allowMargin?: boolean,
}> = ({
  newsItem,
  allowMargin = false,

}) => {
  if (!newsItem) {
    return null;
  }

  const {
    coverImage,
    title,
    summary,
    pubDate,
    slug,
    analytics,
    comments,
    tags
  } = newsItem;

  const category = tags?.[0]?.name;
  const date = pubDate ? new Date(pubDate).toLocaleDateString() : undefined;
  const readTime = analytics?.readDuration;
  const views = analytics?.views;
  const shouldShowViews = views !== undefined && views >= ViewsThreshold;

  return (
    <AppLink href={`/${ClientRoutes.viewNews(slug ?? "#")}`} className={"w-full"}>
      <div className={`w-full overflow-hidden border border-gray-200 bg-white shadow-md h-auto sm:h-[28rem] ${allowMargin ? 'mx-4' : ''}`}>
        <div className="relative h-48 sm:h-60 w-full overflow-hidden">
          <AppImage src={coverImage as string} alt={title ?? "News image"} className='w-full h-full sm:h-[16rem] object-cover' />
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute bottom-4 left-4 flex flex-wrap items-center gap-2">
            {readTime && <div className="bg-gray-800/70 px-2 sm:px-3 py-1 text-xs sm:text-sm text-white">{readTime}</div>}
            {category && <div className="bg-primaryGreen px-2 sm:px-3 py-1 text-xs sm:text-sm text-white">{category}</div>}
            {shouldShowViews && (
              <div className="flex items-center gap-1 bg-gray-800/70 px-2 py-1 text-xs sm:text-sm text-white">
                <Eye size={14} />
                <span>{views}</span>
              </div>
            )}
            <div className="flex items-center gap-1 bg-gray-800/70 px-2 py-1 text-xs sm:text-sm text-white">
              <MessageSquare size={14} />
              <span>{comments?.length}</span>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 flex flex-col h-auto sm:h-[12rem]">
          <div className="mb-2 sm:mb-3 flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-primaryGreen text-white">
                <User size={14} />
              </div>
              <span className="text-xs sm:text-sm font-medium">Web team</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
              <Calendar size={14} />
              <span>{date}</span>
            </div>
          </div>

          <h2 className="mb-2 text-sm sm:text-basic-header font-bold uppercase tracking-tight text-gray-900 line-clamp-2">{cleanUpNewsTitle(title)}</h2>

          <div className="border-t border-gray-100 pt-2 sm:pt-3 pr-2 flex-grow">
            <p className="text-xs sm:text-sm text-gray-500 line-clamp-3">{summary}</p>
          </div>
        </div>
      </div>
    </AppLink>
  )
}

export default NewsWithDescription
