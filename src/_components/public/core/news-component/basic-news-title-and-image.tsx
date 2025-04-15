import { AppImage } from '@/_components/global/app-image'
import { AppLink } from '@/_components/global/app-link'
import type { NewsDTO } from '@/app/(server)/modules/news/news.types'
import { ClientRoutes } from '@/lib/routes/client'
import { cleanUpNewsTitle } from '@/app/(server)/modules/news/news.utils'
import React from 'react'

interface BasicNewsTitleAndImageProps {
  newsItem?: NewsDTO
}

const BasicNewsTitleAndImage: React.FC<BasicNewsTitleAndImageProps> = ({ newsItem }) => {
  if (!newsItem) {
    return null
  }

  const { title, coverImage, slug } = newsItem

  return (
    <div className="w-full flex flex-col min-h-10 gap-4 group hover:shadow-lg transition-all duration-300 rounded-sm overflow-hidden">
      <div className="overflow-hidden">
        <AppImage
          alt={cleanUpNewsTitle(title) || ''}
          src={coverImage || ''}
          className='w-full h-[20rem] object-cover transition-transform duration-500 group-hover:scale-105'
        />
      </div>
      <AppLink
        href={ClientRoutes.viewNews(slug)}
        className="text-[22px] font-semibold text-primaryDark group-hover:text-primaryGreen transition-colors duration-300"
      >
        {cleanUpNewsTitle(title) || ''}
      </AppLink>
    </div>
  )
}

export default BasicNewsTitleAndImage
