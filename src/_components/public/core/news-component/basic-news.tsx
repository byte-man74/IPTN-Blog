import { Calendar } from 'lucide-react'
import React from 'react'
import { AppLink } from '@/_components/global/app-link'
import { AppImage } from '@/_components/global/app-image'
import { NewsDTO } from '@/app/(server)/modules/news/news.types';
import { ClientRoutes } from '@/lib/routes/client';
import { cleanUpNewsTitle } from '@/app/(server)/modules/news/news.utils';


interface BasicNewsComponentProps {
  newsContent: NewsDTO;
}

const BasicNews: React.FC<BasicNewsComponentProps> = ({ newsContent }) => {
  const {
    title,
    slug,
    pubDate,
    coverImage,
    categories
  } = newsContent ?? {};

  // Format the date for display
  const formattedDate = pubDate ? new Date(pubDate).toLocaleDateString() : null;

  // Get the first category if available
  const primaryCategory = categories && categories.length > 0 ? categories[0].name : null;

  return (
    <div className="flex gap-0 h-full bg-white shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group rounded-sm hover:translate-y-[-2px]">
      {/* Image section */}
      <div className="w-1/3 relative overflow-hidden">
        <AppImage
          src={coverImage as string}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-300"></div>
      </div>

      {/* Content section */}
      <div className="w-2/3 p-4 flex flex-col justify-center border-l-0 group-hover:border-l-2 group-hover:border-l-primaryGreen transition-all duration-300">
        {/* Date indicator with black overlay */}
        {formattedDate && (
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-primaryGreen rounded-full p-1.5 text-white flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <span className="text-gray-700 text-xs font-medium group-hover:text-primaryGreen transition-colors duration-200">{formattedDate}</span>
          </div>
        )}

        {/* Title */}
        <AppLink href={ClientRoutes.viewNews(slug)}>
          <h3 className="text-md font-bold leading-tight text-gray-900 mb-2 line-clamp-2 group-hover:text-primaryGreen transition-colors duration-300">
            {cleanUpNewsTitle(title) ?? ""}
          </h3>
        </AppLink>

        {/* Bottom metadata */}
        <div className="flex items-center gap-4 flex-wrap mt-auto">
          {primaryCategory && (
            <span className="text-primaryGreen font-medium text-xs bg-primaryGreen/10 px-2 py-1 rounded-sm group-hover:bg-primaryGreen group-hover:text-white transition-all duration-300">
              {primaryCategory}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default BasicNews
