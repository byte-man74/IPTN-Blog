import { AppImage } from '@/_components/global/app-image'
import { AppLink } from '@/_components/global/app-link'
import { NewsDTO } from '@/app/(server)/modules/news/news.types'
import { cleanUpNewsTitle } from '@/app/(server)/modules/news/news.utils'
import { ClientRoutes } from '@/lib/routes/client'
import React from 'react'



interface LatestSectionProps {
    newsItem?: NewsDTO
}
export const LatestSection = ({ newsItem }: LatestSectionProps) => {
  return (
    <AppLink
      href={ClientRoutes.viewNews(newsItem?.slug ?? "")}
      className="block border border-gray-200  overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:border-gray-300 group"
    >
      <div className="relative h-40 w-full overflow-hidden">
        {newsItem?.coverImage && (
          <AppImage
            src={newsItem.coverImage}
            alt={newsItem.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-sm sm:text-base line-clamp-2 group-hover:text-primaryGreen transition-colors duration-200">
          {cleanUpNewsTitle(newsItem?.title ?? "")}
        </h3>
        <p className="text-xs text-gray-500 mt-2 line-clamp-2">{newsItem?.summary}</p>
        <div className="mt-3 flex justify-between items-center">
          <span className="text-xs text-primaryGreen font-medium group-hover:underline">Read more</span>
        </div>
      </div>
    </AppLink>
  )
}
