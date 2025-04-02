"use client"

import React from 'react'
import { AppImage } from '@/_components/global/app-image'
import { User, Calendar, Eye, MessageSquare } from "lucide-react"
import { NewsItemType } from '@/types/public'
import { AppLink } from '@/_components/global/app-link'

/**
 * NewsArticleCard component displays a news article card with an image, metadata, and description.
 * @param {NewsItemType} newsItem - The news item data for the component.
 * @param {number} maxDescriptionLength - Optional maximum length for the description.
 * @param {boolean} allowMargin - Optional flag to allow margin on the component.
 * @returns {JSX.Element} The rendered NewsArticleCard component.
 */
const NewsWithDescription: React.FC<{ newsItem: NewsItemType, maxDescriptionLength?: number, allowMargin?: boolean }> = ({
  newsItem,
  maxDescriptionLength = 100,
  allowMargin = false,
}) => {
  const {
    imageUrl,
    readTime,
    category,
    views,
    comments,
    date,
    title,
    description,
    slug
  } = newsItem ?? {};

  const truncatedDescription =
    description && description.length > maxDescriptionLength ? `${description.substring(0, maxDescriptionLength)}...` : description;

  return (
    <AppLink href={slug ?? '#'}>
      <div className={`w-full max-w-3xl overflow-hidden border border-gray-200 bg-white shadow-md ${allowMargin ? 'mx-4' : ''}`}>
        <div className="relative h-60 w-full overflow-hidden">
          <AppImage src={imageUrl} alt={title ?? "News image"} className='w-full' />
          <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay added */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <div className="bg-gray-800/70 px-3 py-1 text-sm text-white">{readTime}</div>
            <div className="bg-primaryGreen px-3 py-1 text-sm text-white">{category}</div>
            <div className="flex items-center gap-1 bg-gray-800/70 px-2 py-1 text-sm text-white">
              <Eye size={16} />
              <span>{views}</span>
            </div>
            <div className="flex items-center gap-1 bg-gray-800/70 px-2 py-1 text-sm text-white">
              <MessageSquare size={16} />
              <span>{comments}</span>
            </div>
          </div>
        </div>

        <div className="p-4 flex flex-col">
          <div className="mb-3 flex flex-wrap items-center gap-4">
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

          <h2 className="mb-2 text-basic-header font-bold uppercase tracking-tight text-gray-900">{title}</h2>

          <div className="border-t border-gray-100 pt-3 pr-2">
            <p className="text-sm text-gray-500">{truncatedDescription}</p>
          </div>
        </div>
      </div>
    </AppLink>
  )
}

export default NewsWithDescription
