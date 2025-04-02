import React from 'react';
import { longCarouselBasicNewsData } from '@/lib/constants/pre-data';
import BasicNews from '@/_components/public/core/news-component/basic-news';

/**
 * EntertainmentFullWidthSubArticle component displays a list of news items in two horizontal marquee containers.
 * Ensures all data fields are checked for nullish values before rendering.
 * The marquee effect provides a continuous scrolling effect for a dynamic UI.
 */
const EntertainmentFullWidthSubArticle = () => {
  return (
    <div className="w-full mt-4 pl-8 flex flex-col gap-2 h-auto">
      <div className="w-full flex overflow-hidden">
        <div className="flex animate-marquee gap-2">
          {longCarouselBasicNewsData?.slice(0, Math.ceil(longCarouselBasicNewsData.length / 2)).map((newsItem, index) => (
            <div key={index} className="h-[9rem] w-1/2 flex-shrink-0">
              <BasicNews newsContent={newsItem} />
            </div>
          ))}
        </div>
      </div>
      <div className="w-full flex gap-4 overflow-hidden">
        <div className="flex animate-marquee gap-2 ml-8">
          {longCarouselBasicNewsData?.slice(Math.ceil(longCarouselBasicNewsData.length / 2)).map((newsItem, index) => (
            <div key={index} className="h-[9rem] w-1/2 flex-shrink-0">
              <BasicNews newsContent={newsItem} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EntertainmentFullWidthSubArticle;
