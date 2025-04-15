import React from 'react';
import { CalendarDays, Clock, Eye, MessageSquare, Tag } from 'lucide-react';
import { AppImage } from '@/_components/global/app-image';
import { AppLink } from '@/_components/global/app-link';
import { NewsDTO } from '@/app/(server)/modules/news/news.types';

interface OverlayedNewsImageProps {
    newsItem?: NewsDTO;
    height?: string;
}

/**
 * This is a news component that has the component overlayed as the bg image with its meta data above it.
 * @param {OverlayedNewsImageProps} props - The props for the component.
 * @param {string} props.height - Optional height for the component, defaults to 21rem.
 */
const OverlayedNewsImage = ({ newsItem, height = "21rem" }: OverlayedNewsImageProps) => {
  const {
    coverImage,
    title,
    pubDate,
    slug,
    analytics,
    tags
  } = newsItem ?? {};

  // Extract needed data from the news item
  const imageUrl = coverImage;
  const tag = tags?.[0]?.name;
  const date = pubDate ? new Date(pubDate).toLocaleDateString() : undefined;
  const readTime = analytics?.readDuration;
  const views = analytics?.views;
  const comments = 3
//   const comments = analytics?.comments;

  return (
    <AppLink href={slug ? `/news/${slug}` : "#"} className='w-full'>
      <div className="relative w-full overflow-hidden group flex" style={{ height }}>
        {imageUrl ? (
          <>
            <AppImage
              src={imageUrl}
              alt={title ?? "News image"}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              priority
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black opacity-50 transition-opacity duration-300 group-hover:opacity-40"></div>
          </>
        ) : (
          <div className="w-full h-full bg-gray-200"></div>
        )}

        {/* Metadata Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 z-10">
          {/* Top metadata */}
          <div className="flex items-center gap-2">
            <div className="bg-primaryGreen rounded-full p-2 text-white flex items-center justify-center shadow-md">
              <CalendarDays className="w-4 h-4" />
            </div>
            <span className="text-white text-sm font-medium drop-shadow-md">{date ?? "Date not available"}</span>
          </div>

          {/* Bottom content */}
          <div className="space-y-3">
            {/* Bottom metadata */}
            <div className="flex flex-wrap gap-2 items-center text-sm">
              {readTime && (
                <div className="flex items-center gap-1">
                  <div className="bg-primaryGreen rounded-full p-1.5 text-white flex items-center justify-center shadow-md">
                    <Clock className="w-3 h-3" />
                  </div>
                  <span className="text-white font-medium drop-shadow-md">{readTime}</span>
                </div>
              )}

              {tag && (
                <div className="bg-primaryGreen px-2 py-1 shadow-md flex items-center gap-1">
                  <Tag className="w-3 h-3 text-white" />
                  <span className="text-white text-xs">{tag}</span>
                </div>
              )}

              {views !== undefined && views !== null && (
                <div className="flex items-center gap-1">
                  <div className="bg-primaryGreen rounded-full p-1.5 text-white flex items-center justify-center shadow-md">
                    <Eye className="w-3 h-3" />
                  </div>
                  <span className="text-white text-xs font-medium drop-shadow-md">{views}</span>
                </div>
              )}

              {comments !== undefined && comments !== null && (
                <div className="flex items-center gap-1">
                  <div className="bg-primaryGreen rounded-full p-1.5 text-white flex items-center justify-center shadow-md">
                    <MessageSquare className="w-3 h-3" />
                  </div>
                  <span className="text-white text-xs font-medium drop-shadow-md">{comments}</span>
                </div>
              )}
            </div>

            {/* Headline */}
            <div className="block">
              <h3 className="text-white text-[18px] font-semibold leading-tight hover:text-primaryGreen transition-colors drop-shadow-lg">
                {title ?? "News title"}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </AppLink>
  );
};

export default OverlayedNewsImage;
