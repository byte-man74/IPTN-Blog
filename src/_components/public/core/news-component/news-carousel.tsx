"use client"

import React from "react";
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
 * The carousel is responsive and auto-plays through the items.
 */
export default function NewsCarousel({ newsItems }: NewsCarouselProps) {
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

  return (
    <div className="relative h-[29rem] mx-auto border border-gray-200 overflow-hidden shadow-lg">
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
              <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
                <div className="bg-primaryGreen p-2 text-white flex items-center justify-center rounded-sm shadow-md">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-white font-medium bg-black/40 px-3 py-1 rounded-sm backdrop-blur-sm">
                  {item?.date ?? "Date not available"}
                </span>
              </div>

              {/* Bottom Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-8 z-10">
                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-4 mb-5">
                  {item?.readTime && (
                    <div className="flex items-center gap-2">
                      <div className="bg-primaryGreen rounded-full p-2 text-white flex items-center justify-center shadow-md">
                        <Camera className="w-4 h-4" />
                      </div>
                      <span className="text-white font-medium">{item.readTime}</span>
                    </div>
                  )}

                  {item?.category && (
                    <div className="bg-primaryGreen px-4 py-1.5 rounded-sm shadow-md">
                      <span className="text-white text-sm font-medium">{item.category}</span>
                    </div>
                  )}

                  {item?.views !== undefined && item?.views !== null && (
                    <div className="flex items-center gap-2">
                      <div className="bg-primaryGreen/70 rounded-full p-2 text-white flex items-center justify-center shadow-md">
                        <Eye className="w-4 h-4" />
                      </div>
                      <span className="text-white font-medium">{item.views}</span>
                    </div>
                  )}

                  {item?.comments !== undefined && item?.comments !== null && (
                    <div className="flex items-center gap-2">
                      <div className="bg-primaryGreen/70 rounded-full p-2 text-white flex items-center justify-center shadow-md">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <span className="text-white font-medium">{item.comments}</span>
                    </div>
                  )}
                </div>

                {/* Headline */}
                <AppLink href={item?.slug ?? "#"}>
                  <h1 className="text-white text-2xl font-bold leading-tight">
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
 */
const CustomButtonGroup = ({ next, previous }: CustomButtonGroupProps) => {
  return (
    <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between z-20">
      <button onClick={previous} className="text-white">
        <div className="bg-[#116427]/50 hover:bg-[#116427] rounded-full p-4 text-white flex items-center justify-center shadow-md transition-colors duration-300">
          <ChevronLeft />
        </div>
      </button>
      <button onClick={next} className="text-white">
        <div className="bg-[#116427]/50 hover:bg-[#116427] rounded-full p-4 text-white flex items-center justify-center shadow-md transition-colors duration-300">
          <ChevronRight />
        </div>
      </button>
    </div>
  );
};
