"use client"
import React from 'react'
import { User, Calendar, Eye, MessageSquare } from 'lucide-react'
import { AppImage } from '@/_components/global/app-image'
import { AppLink } from '@/_components/global/app-link'
import { NewsDTO } from '@/app/(server)/modules/news/news.types'
import { ClientRoutes } from '@/lib/routes/client'
import { cleanUpNewsTitle } from '@/app/(server)/modules/news/news.utils'

interface NewsFullScreenProps {
  newsItem?: NewsDTO
}

/**
 * NewsFullScreen component displays a full-screen news article with image, metadata, and title.
 * @param {NewsFullScreenProps} props - The props for the component.
 * @param {NewsDTO} props.newsItem - The news item data.
 * @returns {JSX.Element | null} The rendered NewsFullScreen component or null if no newsItem.
 */
export default function NewsFullScreen({
  newsItem,
}: NewsFullScreenProps) {
  if (!newsItem) {
    return null;
  }

  const {
    coverImage,
    title,
    pubDate,
    slug,
    analytics,
    tags
  } = newsItem;

  const category = tags?.[0]?.name;
  const date = pubDate ? new Date(pubDate).toLocaleDateString() : undefined;
  const readTime = analytics?.readDuration;
  const views = analytics?.views;
  const comments = 3; // Placeholder until analytics includes comments

  return (
    <AppLink href={ClientRoutes.viewNews(slug)} className="block hover:shadow-lg transition-shadow duration-300 w-full">
      <div className="w-full overflow-hidden border border-gray-200 shadow-sm">
        <div className="relative h-[30rem] w-full overflow-hidden">
          <AppImage src={coverImage as string} alt={title ?? "News image"} className="object-cover w-full" priority />
          {/* Black overlay on top of the image */}
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            {readTime && <div className="rounded bg-gray-800/70 px-3 py-1 text-sm text-white">{readTime}</div>}
            {category && <div className="rounded bg-primaryGreen px-3 py-1 text-sm text-white">{category}</div>}
            {views !== undefined && (
              <div className="flex items-center gap-1 rounded bg-gray-800/70 px-2 py-1 text-sm text-white">
                <Eye size={16} />
                <span>{views}</span>
              </div>
            )}
            <div className="flex items-center gap-1 rounded bg-gray-800/70 px-2 py-1 text-sm text-white">
              <MessageSquare size={16} />
              <span>{comments}</span>
            </div>
          </div>
        </div>

        <div className="py-4">
          <div className="mb-3 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primaryGreen text-white">
                <User size={16} />
              </div>
              <span className="text-sm font-medium">Admin</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar size={16} />
              <span>{date}</span>
            </div>
          </div>

          <h2 className="mb-2 text-xl font-bold uppercase tracking-tight text-gray-900">{cleanUpNewsTitle(title)}</h2>
        </div>
      </div>
    </AppLink>
  )
}
