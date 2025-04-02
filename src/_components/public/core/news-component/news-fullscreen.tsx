"use client"
import React from 'react'
import { User, Calendar, Eye, MessageSquare } from 'lucide-react'
import { AppImage } from '@/_components/global/app-image'
import { AppLink } from '@/_components/global/app-link'
import { NewsItemType } from '@/types/public'

interface NewsFullScreenProps {
  newsItem: NewsItemType
  maxDescriptionLength?: number
}

/**
 * NewsArticleCard component that just render one fat news item for a full screen.
 * @param {NewsFullScreenProps} props - The props for the component.
 * @param {NewsItemType} props.newsItem - The news item data.
 * @param {number} [props.maxDescriptionLength=150] - Optional maximum length for the description.
 */
export default function NewsFullScreen({
  newsItem,
}: NewsFullScreenProps) {
  if (!newsItem) return null

  const {
    imageUrl,
    readTime,
    category,
    views,
    comments,
    date,
    title,
    slug,
  } = newsItem

  return (
    <AppLink href={slug ?? '#'} className="block hover:shadow-lg transition-shadow duration-300 w-full">
      <div className="w-full overflow-hidden border border-gray-200 shadow-sm">
        <div className="relative h-[30rem] w-full overflow-hidden">
          <AppImage src={imageUrl ?? '/placeholder-image.jpg'} alt={title ?? "News image"} className="object-cover w-full" priority />
          {/* Black overlay on top of the image */}
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <div className="rounded bg-gray-800/70 px-3 py-1 text-sm text-white">{readTime ?? 'N/A'}</div>
            <div className="rounded bg-primaryGreen px-3 py-1 text-sm text-white">{category ?? 'General'}</div>
            <div className="flex items-center gap-1 rounded bg-gray-800/70 px-2 py-1 text-sm text-white">
              <Eye size={16} />
              <span>{views ?? 0}</span>
            </div>
            <div className="flex items-center gap-1 rounded bg-gray-800/70 px-2 py-1 text-sm text-white">
              <MessageSquare size={16} />
              <span>{comments ?? 0}</span>
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
              <span>{date ?? 'Unknown Date'}</span>
            </div>
          </div>

          <h2 className="mb-2 text-xl font-bold uppercase tracking-tight text-gray-900">{title ?? 'Untitled'}</h2>
        </div>
      </div>
    </AppLink>
  )
}
