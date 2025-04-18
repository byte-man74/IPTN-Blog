import React from 'react';
import { Camera, Eye, MessageSquare, Calendar } from 'lucide-react';
import { AppLink } from '@/_components/global/app-link';
import { AppImage } from '@/_components/global/app-image';
import { NewsDTO } from '@/app/(server)/modules/news/news.types';
import { ClientRoutes } from '@/lib/routes/client';
import { cleanUpNewsTitle } from '@/app/(server)/modules/news/news.utils';

interface OverlayedNewsImageProps {
  newsItem?: NewsDTO;
}

/**
 * OverlayedNewsImageV2 component displays a news item with an overlayed background image and metadata.
 * @param {OverlayedNewsImageProps} props - The props for the component.
 */
const OverlayedNewsImageV2 = ({ newsItem }: OverlayedNewsImageProps) => {
  if (!newsItem) {
    return null;
  }

  const {
    coverImage,
    title,
    pubDate,
    slug,
    analytics,
  } = newsItem;

  const imageUrl = coverImage || "/placeholder.svg";
  const date = pubDate ? new Date(pubDate).toLocaleDateString() : "Date not available";
  const readTime = analytics?.readDuration || "3 mins read";
  const views = analytics?.views || 0;
  const comments = 3; // Placeholder until analytics includes comments

  return (
    <AppLink href={ClientRoutes.viewNews(slug)} className="relative w-full min-h-[30rem] h-full overflow-hidden group">
      <div className="">
        {/* Background Image */}
        <div className="absolute inset-0">
          <AppImage src={imageUrl} alt={title || "News image"} priority className="object-cover w-full h-full" />
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        {/* Additional Overlay */}
        <div className="absolute inset-0 bg-black opacity-30"></div>

        {/* Metadata indicators */}
        <div className="absolute bottom-[120px] left-6 flex items-center gap-4 text-white">
          <div className="flex items-center gap-2">
            <div className="bg-primaryGreen rounded-full p-1.5 flex items-center justify-center">
              <Camera size={18} className="text-white" />
            </div>
            <span className="text-sm">{readTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-primaryGreen rounded-full p-1.5 flex items-center justify-center">
              <Eye size={18} className="text-white" />
            </div>
            <span className="text-sm">{views}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-primaryGreen rounded-full p-1.5 flex items-center justify-center">
              <MessageSquare size={18} className="text-white" />
            </div>
            <span className="text-sm">{comments}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-primaryGreen rounded-full p-1.5 flex items-center justify-center">
              <Calendar size={18} className="text-white" />
            </div>
            <span className="text-sm">{date}</span>
          </div>
        </div>

        {/* Title */}
        <div className="absolute bottom-6 left-6 right-6">
          <h2 className="text-2xl md:text-2xl font-bold text-white leading-tight hover:text-primaryGreen transition-colors">
            {cleanUpNewsTitle(title)}
          </h2>
        </div>
      </div>
    </AppLink>
  );
};

export default OverlayedNewsImageV2;
