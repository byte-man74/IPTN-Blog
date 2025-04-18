'use client'

import React from "react";
import { Calendar, Camera, Eye, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { AppImage } from "@/_components/global/app-image";
import { AppLink } from "@/_components/global/app-link";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { NewsDTO } from "@/app/(server)/modules/news/news.types";
import { ClientRoutes } from "@/lib/routes/client";
import { calculateTimeStampFromDate, cleanUpNewsTitle } from "@/app/(server)/modules/news/news.utils";

interface NewsScreenFullWidthHeroProps {
  newsItems?: NewsDTO[];
  isLoading?: boolean;
}

/**
 * NewsScreenFullWidthHero component
 *
 * This component displays a full-width hero section with a carousel of news items. Each item includes an image, title, date, and metadata such as read time, category, views, and comments.
 * The carousel is responsive and auto-plays through the items.
 */
export default function NewsScreenFullWidthHero({ newsItems, isLoading = false }: NewsScreenFullWidthHeroProps) {
  const items = newsItems ?? [];

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1024 },
      items: 1
    },
    desktop: {
      breakpoint: { max: 1024, min: 768 },
      items: 1
    },
    tablet: {
      breakpoint: { max: 768, min: 464 },
      items: 1
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  // Render skeleton loader when loading
  if (isLoading) {
    return (
      <div className="relative h-[30vh] sm:h-[40vh] md:h-[50vh] lg:h-[58vh] mx-auto border border-gray-200 overflow-hidden shadow-lg bg-gray-100 animate-pulse">
        <div className="w-full h-full bg-gray-200"></div>
        <div className="absolute bottom-0 left-0 w-full right-0 bg-gradient-to-t from-gray-300 via-gray-200 to-transparent p-4 sm:p-6 md:p-8 px-4 sm:px-6 md:px-10 z-10">
          <div className="w-full md:w-[80%] lg:w-[60%] ml-auto">
            <div className="h-8 sm:h-10 md:h-12 lg:h-14 bg-gray-300 rounded mb-4"></div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 sm:mt-3 md:mt-5 justify-end">
            <div className="h-6 w-20 bg-gray-300 rounded-full"></div>
            <div className="h-6 w-16 bg-gray-300 rounded-full"></div>
            <div className="h-6 w-12 bg-gray-300 rounded-full"></div>
            <div className="h-6 w-24 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[30vh] sm:h-[40vh] md:h-[50vh] lg:h-[58vh] mx-auto border border-gray-200 overflow-hidden shadow-lg">
      {items.length > 0 ? (
        <Carousel
          responsive={responsive}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={5000}
          arrows={false}
          renderButtonGroupOutside={true}
          customButtonGroup={<CustomButtonGroup />}
          className="h-full flex"
          itemClass="w-full h-full"
          containerClass="h-full"
        >
          {items.map((item) => (
            <div key={item.id} className="w-full h-full">
              {/* Main Image Container */}
              <div className="relative w-full h-full">
                <AppLink href={ClientRoutes.viewNews(item.slug)}>
                  <AppImage
                    src={item?.coverImage ?? ""}
                    alt={cleanUpNewsTitle(item?.title) ?? "News image"}
                    className="object-cover w-full h-full"
                    priority
                  />
                  {/* Dark overlay for better text readability */}
                  <div className="absolute inset-0 bg-black opacity-50"></div>
                </AppLink>

                {/* Bottom Content Overlay */}
                <div className="absolute bottom-0 left-0 flex flex-col items-end justify-end w-full right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 sm:p-6 md:p-8 px-4 sm:px-6 md:px-10 z-10">
                  {/* Headline */}
                  <AppLink className="w-full md:w-[80%] lg:w-[60%]" href={ClientRoutes.viewNews(item.slug)}>
                    <h2 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-right">
                      {cleanUpNewsTitle(item?.title) ?? "News title"}
                    </h2>
                  </AppLink>

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 sm:mt-3 md:mt-5">
                    {item?.analytics?.readDuration && (
                      <div className="flex items-center gap-1 sm:gap-2">
                        <div className="bg-primaryGreen rounded-full p-1 sm:p-2 text-white flex items-center justify-center shadow-md">
                          <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                        </div>
                        <span className="text-white text-xs sm:text-sm font-medium">{item.analytics.readDuration}</span>
                      </div>
                    )}

                    {item?.analytics?.views !== undefined && (
                      <div className="flex items-center gap-1 sm:gap-2">
                        <div className="bg-primaryGreen rounded-full p-1 sm:p-2 text-white flex items-center justify-center shadow-md">
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        </div>
                        <span className="text-white text-xs sm:text-sm font-medium">{item.analytics.views}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className="bg-primaryGreen rounded-full p-1 sm:p-2 text-white flex items-center justify-center shadow-md">
                        <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                      </div>
                      <span className="text-white text-xs sm:text-sm font-medium">3</span>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className="bg-primaryGreen rounded-full p-1 sm:p-2 text-white flex items-center justify-center shadow-md">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      </div>
                      <span className="text-white text-xs sm:text-sm font-medium">
                        {item?.pubDate ? calculateTimeStampFromDate(item.pubDate) : "Date not available"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <p className="text-gray-500">No news items available</p>
        </div>
      )}
    </div>
  );
}

interface CustomButtonGroupProps {
  next?: () => void;
  previous?: () => void;
}

/**
 * CustomButtonGroup component
 *
 * This component provides custom navigation buttons for the carousel.
 */
const CustomButtonGroup = ({ next, previous }: CustomButtonGroupProps) => {
  return (
    <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between z-20 px-2 sm:px-4 md:px-6">
      <button onClick={previous} className="text-white">
        <div className="bg-[#116427]/50 hover:bg-[#116427] rounded-full p-2 sm:p-3 md:p-4 text-white flex items-center justify-center shadow-md transition-colors duration-300">
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </div>
      </button>
      <button onClick={next} className="text-white">
        <div className="bg-[#116427]/50 hover:bg-[#116427] rounded-full p-2 sm:p-3 md:p-4 text-white flex items-center justify-center shadow-md transition-colors duration-300">
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </div>
      </button>
    </div>
  );
};
