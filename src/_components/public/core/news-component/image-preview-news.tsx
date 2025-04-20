import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { AppImage } from '@/_components/global/app-image';
import { NewsDTO } from '@/app/(server)/modules/news/news.types';
import { AppLink } from '@/_components/global/app-link';
import { ClientRoutes } from '@/lib/routes/client';
import { cleanUpNewsTitle } from '@/app/(server)/modules/news/news.utils';

interface ImagePreviewNewsProps {
  newsItem?: NewsDTO;
  showCategory?: boolean;
  isInterview?: boolean;
}

/**
 * ImagePreviewNews component displays a news item with a prominent image preview.
 * Optimized for interview content with appropriate styling and layout.
 *
 * @param {ImagePreviewNewsProps} props - The props for the component.
 * @param {NewsDTO} props.newsItem - The news item data to display.
 * @param {boolean} props.showCategory - Whether to show the category tag.
 * @param {boolean} props.isInterview - Whether this is an interview article.
 */
export default function ImagePreviewNews({
  newsItem,
  showCategory = true,
}: ImagePreviewNewsProps) {
  if (!newsItem) {
    return null;
  }

  const {
    coverImage,
    title,
    pubDate,
    slug,
    analytics,
    tags,
    summary
  } = newsItem;

  const category = tags?.[0]?.name;
  const date = pubDate ? new Date(pubDate).toLocaleDateString() : undefined;
  const readTime = analytics?.readDuration;
  const cleanTitle = cleanUpNewsTitle(title || '');


  return (
    <AppLink href={ClientRoutes.viewNews(slug)} className="w-full group">
      <div className="w-full h-[280px] relative overflow-hidden rounded-none shadow-lg">
        {/* Base image layer */}
        <AppImage
          src={coverImage as string}
          alt={title ?? 'News Image'}
          className="object-cover h-full w-full transition-transform duration-700 group-hover:scale-110"
          priority
        />

        {/* Permanent gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        {/* Tags positioned at top */}
        <div className="absolute top-3 left-0 right-0 flex justify-between px-4 z-20">
          {showCategory && category && (
            <div className="bg-primaryGreen text-white px-3 py-1 text-xs font-medium rounded-none shadow-md transform transition-transform duration-300 group-hover:scale-110">
              {category}
            </div>
          )}
        </div>

        {/* Basic info always visible at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <h3 className="text-lg font-bold text-white drop-shadow-lg transition-all duration-300 group-hover:translate-y-[-60px]">
            {cleanTitle}
          </h3>

          <div className="flex items-center text-white/90 text-xs mt-2">
            {date && (
              <span className="flex items-center mr-4">
                <Clock size={14} className="mr-1" />
                {date}
              </span>
            )}
            {readTime && (
              <span className="bg-white/20 px-2 py-1 rounded-full">{readTime} min read</span>
            )}
          </div>
        </div>

        {/* Content overlay that slides up on hover */}
        <div className="absolute inset-x-0 bottom-0 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 p-4 shadow-lg z-20">
          <h4 className="text-primaryGreen font-bold text-lg mb-2">{cleanTitle}</h4>

          {summary && (
            <p className="text-gray-700 text-sm mb-3">{summary}</p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-500 text-xs">
              {date && (
                <span className="flex items-center mr-4">
                  <Clock size={14} className="mr-1" />
                  {date}
                </span>
              )}
              {readTime && (
                <span className="bg-gray-100 px-2 py-1 rounded-full">{readTime} min read</span>
              )}
            </div>

            <span className="text-primaryGreen flex items-center text-sm font-medium">
              Read more <ArrowRight size={14} className="ml-1" />
            </span>
          </div>
        </div>
      </div>
    </AppLink>
  );
}
