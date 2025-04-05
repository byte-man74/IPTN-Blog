"use client"

import React, { useEffect } from "react";
import { Calendar, Camera, Eye, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { AppImage } from "@/_components/global/app-image";
import { AppLink } from "@/_components/global/app-link";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { NewsItemType } from "@/types/public";

interface NewsCarouselProps {
  newsItems: NewsItemType[];
}

/**
 * NewsCarousel component
 *
 * This component displays a carousel of news items. Each item includes an image, title, date, and metadata such as read time, category, views, and comments.
 */
export default function NewsCarousel({ newsItems }: NewsCarouselProps) {
  const items = newsItems ?? [];


  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

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

  return (
    <div className="relative h-[29rem] xs:h-[26rem] mx-auto border border-gray-200 overflow-hidden shadow-lg">
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
        swipeable={true}
        draggable={true}
      >
        {items.map((item) => (
          <div key={item.id} className="w-full h-full">
            {/* Main Image Container */}
            <div className="relative w-full h-full">
              <AppLink href={item?.slug ?? "#"}>
                <AppImage
                  src={item?.imageUrl ?? "/placeholder.jpg"}
                  alt={item?.title ?? "News image"}
                  className="object-cover w-full h-full"
                  priority
                />
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black opacity-50"></div>
              </AppLink>

              {/* Top Date Indicator */}
              <div className="absolute top-3 sm:top-6 left-3 sm:left-6 flex items-center gap-2 z-10">
                <div className="bg-primaryGreen p-1.5 sm:p-2 text-white flex items-center justify-center rounded-sm shadow-md">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-white text-xs sm:text-sm font-medium bg-black/40 px-2 sm:px-3 py-1 rounded-sm backdrop-blur-sm">
                  {item?.date ?? "Date not available"}
                </span>
              </div>

              {/* Bottom Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 sm:p-8 z-10">
                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3 sm:mb-5">
                  {item?.readTime && (
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className="bg-primaryGreen rounded-full p-1.5 sm:p-2 text-white flex items-center justify-center shadow-md">
                        <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                      </div>
                      <span className="text-white text-xs sm:text-sm font-medium">{item.readTime}</span>
                    </div>
                  )}

                  {item?.category && (
                    <div className="bg-primaryGreen px-2 sm:px-4 py-1 sm:py-1.5 rounded-sm shadow-md">
                      <span className="text-white text-xs sm:text-sm font-medium">{item.category}</span>
                    </div>
                  )}

                  {item?.views !== undefined && item?.views !== null && (
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className="bg-primaryGreen/70 rounded-full p-1.5 sm:p-2 text-white flex items-center justify-center shadow-md">
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      </div>
                      <span className="text-white text-xs sm:text-sm font-medium">{item.views}</span>
                    </div>
                  )}

                  {item?.comments !== undefined && item?.comments !== null && (
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className="bg-primaryGreen/70 rounded-full p-1.5 sm:p-2 text-white flex items-center justify-center shadow-md">
                        <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      </div>
                      <span className="text-white text-xs sm:text-sm font-medium">{item.comments}</span>
                    </div>
                  )}
                </div>

                {/* Headline */}
                <AppLink href={item?.slug ?? "#"}>
                  <h1 className="text-white text-lg sm:text-xl md:text-2xl font-bold leading-tight">
                    {item?.title ?? "News title"}
                  </h1>
                </AppLink>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
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
 * Optimized for mobile with larger touch targets and improved positioning.
 */
const CustomButtonGroup = ({ next, previous }: CustomButtonGroupProps) => {
  return (
    <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between z-20 px-2 sm:px-4">
      <button
        onClick={previous}
        className="text-white touch-manipulation"
        aria-label="Previous slide"
      >
        <div className="bg-[#116427]/50 hover:bg-[#116427] rounded-full p-2 sm:p-4 text-white flex items-center justify-center shadow-md transition-colors duration-300">
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </button>
      <button
        onClick={next}
        className="text-white touch-manipulation"
        aria-label="Next slide"
      >
        <div className="bg-[#116427]/50 hover:bg-[#116427] rounded-full p-2 sm:p-4 text-white flex items-center justify-center shadow-md transition-colors duration-300">
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </button>
    </div>
  );
};
