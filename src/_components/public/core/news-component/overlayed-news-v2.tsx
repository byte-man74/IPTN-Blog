import React from 'react';
import { Camera, Eye, MessageSquare, Calendar } from 'lucide-react';
import { AppLink } from '@/_components/global/app-link';
import { AppImage } from '@/_components/global/app-image';
import { NewsDTO } from '@/app/(server)/modules/news/news.types';
import { ClientRoutes } from '@/lib/routes/client';
import { cleanUpNewsTitle } from '@/app/(server)/modules/news/news.utils';
import { ViewsThreshold } from '@/app/(server)/modules/site-configurations/site-config.constants';

interface OverlayedNewsImageProps {
  newsItem?: NewsDTO;
  fullHeight?: boolean;
}

/**
 * OverlayedNewsImageV2 component displays a news item with an overlayed background image and metadata.
 * @param {OverlayedNewsImageProps} props - The props for the component.
 */
const OverlayedNewsImageV2 = ({ newsItem, fullHeight }: OverlayedNewsImageProps) => {
  if (!newsItem) {
    return null;
  }

  const {
    coverImage,
    title,
    pubDate,
    slug,
    analytics,
    comments
  } = newsItem;

  const imageUrl = coverImage || "/placeholder.svg";
  const date = pubDate ? new Date(pubDate).toLocaleDateString() : "Date not available";
  const readTime = analytics?.readDuration || "";
  const views = analytics?.views || 0;

  return (
    <AppLink
      href={`/${ClientRoutes.viewNews(slug ?? "#")}`}
      className={`relative w-full overflow-hidden group ${
        fullHeight
          ? 'h-[300px] sm:h-[400px] md:h-[500px] lg:h-full'
          : 'min-h-[20rem] md:min-h-[34rem]'
      }`}
    >
      <div className="w-full h-full">
        {/* Background Image */}
        <div className="absolute inset-0">
          <AppImage src={imageUrl} alt={title || "News image"} priority className="object-cover w-full h-full" />
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        {/* Additional Overlay */}
        <div className="absolute inset-0 bg-black opacity-30"></div>

        <div className="relative h-full flex flex-col justify-end p-4 sm:p-6">
          {/* Metadata indicators */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-white mb-3 pointer-events-none">
            <div className="flex items-center gap-2">
              <div className="bg-primaryGreen rounded-full p-1.5 flex items-center justify-center">
                <Camera size={16} className="text-white" />
              </div>
              <span className="text-xs sm:text-sm">{readTime}</span>
            </div>

            {views >= ViewsThreshold && (
              <div className="flex items-center gap-2">
                <div className="bg-primaryGreen rounded-full p-1.5 flex items-center justify-center">
                  <Eye size={16} className="text-white" />
                </div>
                <span className="text-xs sm:text-sm">{views}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <div className="bg-primaryGreen rounded-full p-1.5 flex items-center justify-center">
                <MessageSquare size={16} className="text-white" />
              </div>
              <span className="text-xs sm:text-sm">{comments?.length}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-primaryGreen rounded-full p-1.5 flex items-center justify-center">
                <Calendar size={16} className="text-white" />
              </div>
              <span className="text-xs sm:text-sm">{date}</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight group-hover:text-primaryGreen transition-colors pointer-events-none">
            {cleanUpNewsTitle(title)}
          </h2>
        </div>
      </div>
    </AppLink>
  );
};

export default OverlayedNewsImageV2;
