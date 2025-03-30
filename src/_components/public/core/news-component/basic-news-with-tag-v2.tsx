import React, { JSX } from 'react';
import { Calendar, Camera } from 'lucide-react';
import { NewsItemType } from '@/types/public';
import { AppImage } from '@/_components/global/app-image';

interface BasicNewsWithTagV2Props {
  newsItem: NewsItemType;
}

/**
 * BasicNewsWithTagV2 component displays a news item with an image, metadata, and headline.
 * Ensures all data fields are checked for nullish values before rendering.
 * @param {BasicNewsWithTagV2Props} props - The props for the component.
 * @param {NewsItemType} props.newsItem - The news item data for the component.
 * @returns {JSX.Element} The rendered BasicNewsWithTagV2 component.
 */
export default function BasicNewsWithTagV2({ newsItem }: BasicNewsWithTagV2Props): JSX.Element {
  const { imageUrl, title, readTime, category, date } = newsItem ?? {};

  return (
    <div className="w-full max-w-3xl overflow-hidden border border-gray-200 bg-white shadow-md flex flex-col md:flex-row">
      {/* Left side - Image */}
      <div className="relative h-[11rem] w-full md:w-2/5 lg:w-1/3 overflow-hidden">
        <AppImage src={imageUrl} alt={title ?? 'News Image'} className="object-cover h-full w-full" priority />
      </div>

      {/* Right side - Content */}
      <div className="py-2 px-4 md:py-3 md:px-6 flex flex-col justify-between bg-gray-50 w-full md:w-3/5 lg:w-2/3">
        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-green-700 rounded-full p-2">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gray-400 text-white px-3 py-1 text-sm">{date ?? 'N/A'}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-green-700 rounded-full p-2">
              <Camera className="h-5 w-5 text-white" />
            </div>
            <span className="text-black text-sm">{readTime ?? 'N/A'}</span>
            <span className="text-green-700 font-medium ml-2">{category ?? 'N/A'}</span>
          </div>
        </div>

        {/* Headline */}
        <h2 className="text-xl font-bold leading-tight">{title ?? 'Untitled'}</h2>
      </div>
    </div>
  );
}
