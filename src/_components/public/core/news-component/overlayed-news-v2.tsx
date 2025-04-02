import React from 'react';

import { Camera, Eye, MessageSquare, Calendar } from 'lucide-react';
import { AppLink } from '@/_components/global/app-link';
import { NewsItemType } from '@/types/public';
import { AppImage } from '@/_components/global/app-image';

interface OverlayedNewsImageProps {
  newsItem?: NewsItemType;
}

/**
 * OverlayedNewsImage component displays a news item with an overlayed background image and metadata.
 * @param {OverlayedNewsImageProps} props - The props for the component.
 * @returns {JSX.Element} The rendered OverlayedNewsImage component.
 */
const OverlayedNewsImageV2 = ({ newsItem }: OverlayedNewsImageProps) => {
  const {
    imageUrl = "/placeholder.svg",
    title = "News title",
    date = "Date not available",
    slug = "#",
    readTime = "3 mins read",
    views = 72,
    comments = 30
  } = newsItem ?? {};

  return (
    <AppLink href={slug} className="relative w-full h-[30rem] overflow-hidden group">
      <div className="">
        {/* Background Image */}
        <div className="absolute inset-0">
          <AppImage src={imageUrl} alt={title} priority className="object-cover" />
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
            {title}
          </h2>
        </div>
      </div>
    </AppLink>
  );
};

export default OverlayedNewsImageV2;
