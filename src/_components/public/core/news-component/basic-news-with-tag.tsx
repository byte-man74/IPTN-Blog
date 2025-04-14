import { Calendar, Clock, Tag } from 'lucide-react'
import React from 'react'
import { AppLink } from '@/_components/global/app-link'
import {  NewsDTO } from '@/app/(server)/modules/news/news.types'
import { ClientRoutes } from '@/lib/routes/client';

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
    <div className="max-w-3xl mx-auto bg-white p-4 hover:shadow-md transition-shadow duration-300 border-primaryGreen">
      <div className="space-y-3">
        <AppLink href={ClientRoutes.viewNews(slug)}>
          <h3 className="text-basic-header font-semibold leading-tight text-primaryDark hover:text-primaryGreen transition-colors duration-200">
            {title ?? ""}
          </h3>
        </AppLink>

        <div className="flex items-center gap-4 flex-wrap text-sm">
          {readTime && (
            <div className="flex items-center gap-1.5 text-gray-700">
              <Clock className="w-3.5 h-3.5 text-primaryGreen" />
              <span>{readTime}</span>
            </div>
          )}

          {category && (
            <div className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-primaryGreen" />
              <span className="text-primaryGreen font-medium">{tag}</span>
            </div>
          )}

          {date && (
            <div className="flex items-center gap-1.5 text-gray-700">
              <div className="bg-primaryGreen rounded-full p-1 flex items-center justify-center">
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
