import { Calendar } from 'lucide-react'
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
    <div className="max-w-3xl mx-auto bg-gray-50 p-6 shadow-sm">
      <div className="space-y-4">
        <AppLink href={slug ?? '#'}>
          <h3 className="text-basic-header font-bold leading-tight text-gray-900">
            {title ?? ""}
          </h3>
        </AppLink>

        <div className="flex items-center gap-4 flex-wrap">
          {readTime && <span className="text-gray-700">{readTime}</span>}
          {category && <span className="text-green-700 font-medium">{category}</span>}
          {date && (
            <div className="flex items-center gap-2">
              <div className="bg-green-700 rounded-full p-1.5 text-white flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-gray-700">{date}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BasicNewsWithTag
