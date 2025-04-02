import { Calendar } from 'lucide-react'
import React from 'react'
import { AppLink } from '@/_components/global/app-link'
import { AppImage } from '@/_components/global/app-image'

interface NewsContent {
  title: string;
  readTime?: string;
  category?: string;
  date?: string;
  slug?: string;
  imageUrl?: string;
}

interface BasicNewsComponentProps {
  newsContent: NewsContent;
}

const BasicNews: React.FC<BasicNewsComponentProps> = ({ newsContent }) => {
  const { title, readTime, category, date, slug, imageUrl } = newsContent ?? {};

  return (
    <div className="flex gap-0 h-full bg-white shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image section */}
      <div className="w-1/3 relative">
        <AppImage
          src={imageUrl ?? '/placeholder-image.jpg'}
          alt={title ?? "News image"}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Content section */}
      <div className="w-2/3 p-4 flex flex-col justify-center">
        {/* Date indicator with black overlay */}
        {date && (
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-primaryGreen rounded-full p-1.5 text-white flex items-center justify-center shadow-sm">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <span className="text-gray-700 text-xs font-medium">{date}</span>
          </div>
        )}

        {/* Title */}
        <AppLink href={slug ?? '#'}>
          <h3 className="text-md font-bold leading-tight text-gray-900 mb-2 line-clamp-2 hover:text-primaryGreen transition-colors duration-200">
            {title ?? ""}
          </h3>
        </AppLink>

        {/* Bottom metadata */}
        <div className="flex items-center gap-4 flex-wrap mt-auto">
          {readTime && (
            <span className="text-gray-600 text-xs bg-gray-100 px-2 py-1 rounded-sm">
              {readTime}
            </span>
          )}
          {category && (
            <span className="text-primaryGreen font-medium text-xs bg-primaryGreen/10 px-2 py-1 rounded-sm">
              {category}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default BasicNews
