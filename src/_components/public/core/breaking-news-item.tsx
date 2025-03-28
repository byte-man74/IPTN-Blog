import React from 'react'
import { AppLink } from '@/_components/global/app-link'
import { AppImage } from '@/_components/global/app-image'

interface BreakingNewsItemProps {
  title: string
  imageUrl?: string
  url: string
  timestamp?: string
}

/**
 * BreakingNewsItem component displays a single breaking news item in the marquee.
 * It shows the news title, an optional thumbnail image, and an optional timestamp.
 *
 * @param {string} title - The title of the breaking news item
 * @param {string} [imageUrl] - Optional URL for the news thumbnail image
 * @param {string} url - The link destination when the news item is clicked
 * @param {string} [timestamp] - Optional timestamp showing when the news was published
 * @returns {JSX.Element | null} - Returns the news item component or null if required props are missing
 */
const BreakingNewsItem = ({ title, imageUrl, url, timestamp }: BreakingNewsItemProps) => {
  if (!title || !url) return null;

  return (
    <AppLink href={url} className="inline-flex items-center mx-6 hover:text-primaryGreen transition-colors">
      {imageUrl && (
        <div className="relative h-12 w-10 mr-3 overflow-hidden rounded-sm">
          <AppImage
            src={imageUrl}
            alt={title || "Breaking news image"}
            className="object-cover w-full h-full"
            width={64}
            height={48}
          />
        </div>
      )}
      <span className="font-medium">{title}</span>
      {timestamp && (
        <span className="text-xs text-gray-500 ml-2">• {timestamp}</span>
      )}
    </AppLink>
  )
}

export default BreakingNewsItem
