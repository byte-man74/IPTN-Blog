import { Calendar, Clock, Tag } from 'lucide-react'
import React from 'react'
import { AppLink } from '@/_components/global/app-link'
import { NewsDTO } from '@/app/(server)/modules/news/news.types'
import { ClientRoutes } from '@/lib/routes/client';
import { cleanUpNewsTitle } from '@/app/(server)/modules/news/news.utils';

interface BasicNewsWithTagProps {
  newsContent: NewsDTO;
}

const BasicNewsWithTag: React.FC<BasicNewsWithTagProps> = ({ newsContent }) => {
  const { title, slug, analytics, categories, pubDate, tags } = newsContent ?? {};

  const readTime = analytics?.readDuration;
  const category = categories?.[0]?.name;
  const tag = tags?.[0]?.name
  const date = pubDate ? new Date(pubDate).toLocaleDateString() : undefined;

  return (
    <div className="w-full mx-auto bg-white p-4 py-6 hover:shadow-lg transition-all duration-300 group transform hover:-translate-y-1">
      <div className="space-y-4">
        <AppLink href={ClientRoutes.viewNews(slug)}>
          <h3 className="text-basic-header font-semibold leading-tight text-primaryDark group-hover:text-primaryGreen transition-colors duration-300">
            {cleanUpNewsTitle(title) ?? ""}
          </h3>
        </AppLink>

        <div className="flex items-center gap-2 flex-wrap text-sm">
          {readTime && (
            <div className="flex items-center gap-1.5 text-gray-700 hover:text-primaryGreen transition-colors duration-200">
              <div className="bg-gray-100 group-hover:bg-primaryGreen/10 p-1.5 rounded-full transition-colors duration-300">
                <Clock className="w-3.5 h-3.5 text-primaryGreen" />
              </div>
              <span>{readTime}</span>
            </div>
          )}

          {tag && (
            <div className="flex items-center gap-1.5 hover:text-primaryGreen/80 transition-colors duration-200">
              <div className="bg-gray-100 group-hover:bg-primaryGreen/10 p-1.5 rounded-full transition-colors duration-300">
                <Tag className="w-3.5 h-3.5 text-primaryGreen" />
              </div>
              <span className="text-primaryGreen font-medium">{tag}</span>
            </div>
          )}

          {date && (
            <div className="flex items-center gap-1.5 text-gray-700 hover:text-primaryGreen transition-colors duration-200">
              <div className="bg-primaryGreen rounded-full p-1.5 flex items-center justify-center group-hover:bg-primaryGreen/90 transition-all duration-300 shadow-sm group-hover:shadow">
                <Calendar className="w-3 h-3 text-white" />
              </div>
              <span>{date}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BasicNewsWithTag
