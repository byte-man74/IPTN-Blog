import React from 'react';
import { CalendarDays, Clock, Eye, MessageSquare, Tag } from 'lucide-react';
import { AppImage } from '@/_components/global/app-image';
import { AppLink } from '@/_components/global/app-link';
import { NewsDTO } from '@/app/(server)/modules/news/news.types';
import { ClientRoutes } from '@/lib/routes/client';

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
    <AppLink href={ClientRoutes.viewNews(slug ?? "#")} className='w-full'>
      <div className="relative w-full overflow-hidden group flex rounded-none shadow-md transition-all duration-300 hover:shadow-xl" style={{ height }}>
        {imageUrl ? (
          <>
            <AppImage
              src={imageUrl}
              alt={title ?? "News image"}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              priority
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 opacity-80 transition-opacity duration-300 group-hover:opacity-70"></div>
          </>
        ) : (
          <div className="w-full h-full bg-gray-200"></div>
        )}

        {/* Metadata Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 z-10">
          {/* Top metadata */}
          <div className="flex items-center gap-2 transform transition-transform duration-300 group-hover:translate-y-1">
            <div className="bg-primaryGreen rounded-full p-2 text-white flex items-center justify-center shadow-md group-hover:bg-white group-hover:text-primaryGreen transition-all duration-300">
              <CalendarDays className="w-4 h-4" />
            </div>
            <span className="text-white text-sm font-medium drop-shadow-md group-hover:text-primaryGreen transition-colors duration-300">{date ?? "Date not available"}</span>
          </div>

          {/* Bottom content */}
          <div className="space-y-3 transform transition-all duration-300 group-hover:translate-y-[-4px]">
            {/* Bottom metadata */}
            <div className="flex flex-wrap gap-2 items-center text-sm">
              {readTime && (
                <div className="flex items-center gap-1 transition-transform duration-300 hover:scale-105">
                  <div className="bg-primaryGreen rounded-full p-1.5 text-white flex items-center justify-center shadow-md group-hover:ring-2 group-hover:ring-white/30 transition-all duration-300">
                    <Clock className="w-3 h-3" />
                  </div>
                  <span className="text-white font-medium drop-shadow-md">{readTime}</span>
                </div>
              )}

              {tag && (
                <div className="bg-primaryGreen px-2 py-1 shadow-md flex items-center gap-1 transition-all duration-300 group-hover:bg-white group-hover:text-primaryGreen">
                  <Tag className="w-3 h-3 text-white group-hover:text-primaryGreen transition-colors duration-300" />
                  <span className="text-white text-xs group-hover:text-primaryGreen transition-colors duration-300">{tag}</span>
                </div>
              )}

              {views !== undefined && views !== null && (
                <div className="flex items-center gap-1 transition-transform duration-300 hover:scale-105">
                  <div className="bg-primaryGreen rounded-full p-1.5 text-white flex items-center justify-center shadow-md group-hover:ring-2 group-hover:ring-white/30 transition-all duration-300">
                    <Eye className="w-3 h-3" />
                  </div>
                  <span className="text-white text-xs font-medium drop-shadow-md">{views}</span>
                </div>
              )}

              {comments !== undefined && comments !== null && (
                <div className="flex items-center gap-1 transition-transform duration-300 hover:scale-105">
                  <div className="bg-primaryGreen rounded-full p-1.5 text-white flex items-center justify-center shadow-md group-hover:ring-2 group-hover:ring-white/30 transition-all duration-300">
                    <MessageSquare className="w-3 h-3" />
                  </div>
                  <span className="text-white text-xs font-medium drop-shadow-md">{comments}</span>
                </div>
              )}
            </div>

            {/* Headline */}
            <div className="block">
              <h3 className="text-white text-[18px] font-semibold leading-tight transition-all duration-300 group-hover:text-primaryGreen group-hover:translate-x-1 drop-shadow-lg">
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
