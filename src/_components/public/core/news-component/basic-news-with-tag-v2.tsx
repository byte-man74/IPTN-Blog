import React from 'react';
import { Clock, Tag } from 'lucide-react';
import { AppImage } from '@/_components/global/app-image';
import { NewsDTO } from '@/app/(server)/modules/news/news.types';
import { AppLink } from '@/_components/global/app-link';
import { ClientRoutes } from '@/lib/routes/client';
import { cleanUpNewsTitle } from '@/app/(server)/modules/news/news.utils';

interface BasicNewsWithTagV2Props {
  newsItem?: NewsDTO;
}

/**
 * BasicNewsWithTagV2 component displays a news item with an image, metadata, and headline.
 * Ensures all data fields are checked for nullish values before rendering.
 * @param {BasicNewsWithTagV2Props} props - The props for the component.
 * @param {NewsDTO} props.newsItem - The news item data for the component.
 * @returns {React.ReactNode} The rendered BasicNewsWithTagV2 component.
 */
export default function BasicNewsWithTagV2({ newsItem }: BasicNewsWithTagV2Props) {
  if (!newsItem) {
    return null;
  }

  const {
    coverImage,
    title,
    pubDate,
    slug,
    analytics,
    tags
  } = newsItem;

  const category = tags?.[0]?.name;
  const date = pubDate ? new Date(pubDate).toLocaleDateString() : undefined;
  const readTime = analytics?.readDuration;

  return (
    <AppLink href={`/${ClientRoutes.viewNews(slug ?? "#")}`} className="w-full group">
      <div className="w-full overflow-hidden  bg-white shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row border-l-0 group-hover:border-l-2 group-hover:border-l-primaryGreen">
        {/* Left side - Image */}
        <div className="relative h-[12rem] w-full md:w-2/5 lg:w-1/3 overflow-hidden">
          <AppImage
            src={coverImage as string}
            alt={title ?? 'News Image'}
            className="object-cover h-full w-full transition-transform duration-500 group-hover:scale-105"
            priority
          />
          {category && (
            <div className="absolute top-3 left-3 bg-primaryGreen text-white px-3 py-1 text-xs font-medium rounded-sm shadow-md">
              {category}
            </div>
          )}
        </div>

        {/* Right side - Content */}
        <div className="p-4 md:p-5 flex flex-col justify-between bg-gray-50 w-full md:w-3/5 lg:w-2/3">
          {/* Headline */}
          <h2 className="text-lg md:text-xl font-semibold leading-tight mb-3 group-hover:text-primaryGreen transition-colors duration-300">
            {cleanUpNewsTitle(title)}
          </h2>

          {/* Metadata row */}
          <div className="flex flex-wrap items-center justify-between mt-auto">
            {date && (
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-sm">{date}</span>
              </div>
            )}

            <div className="flex items-center gap-4">
              {readTime && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-primaryGreen" />
                  <span className="text-sm text-gray-700">{readTime}</span>
                </div>
              )}

              {category && (
                <div className="flex items-center gap-1.5 md:hidden">
                  <Tag className="h-4 w-4 text-primaryGreen" />
                  <span className="text-sm font-medium text-primaryGreen">{category}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLink>
  );
}
