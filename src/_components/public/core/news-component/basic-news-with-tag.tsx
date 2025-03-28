import { Calendar, Clock, Tag } from 'lucide-react'
import React from 'react'
import { AppLink } from '@/_components/global/app-link'

interface NewsContent {
  title: string;
  readTime?: string;
  category?: string;
  date?: string;
  slug?: string;
}

interface BasicNewsWithTagProps {
  newsContent: NewsContent;
}

const BasicNewsWithTag: React.FC<BasicNewsWithTagProps> = ({ newsContent }) => {
  const { title, readTime, category, date, slug } = newsContent ?? {};

  return (
    <div className="max-w-3xl mx-auto bg-white p-4 shadow-md hover:shadow-lg transition-shadow duration-300 border-primaryGreen">
      <div className="space-y-3">
        <AppLink href={slug ?? '#'}>
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
              <span className="text-primaryGreen font-medium">{category}</span>
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
