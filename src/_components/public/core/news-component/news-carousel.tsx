"use client"

import React from "react";
import { Calendar, Camera, ChevronLeft, ChevronRight, Eye, MessageSquare } from "lucide-react";
import { AppImage } from "@/_components/global/app-image";
import { AppLink } from "@/_components/global/app-link";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { NewsDTO } from "@/app/(server)/modules/news/news.types";
import { calculateTimeStampFromDate, cleanUpNewsTitle } from "@/app/(server)/modules/news/news.utils";
import { ClientRoutes } from "@/lib/routes/client";
import { ViewsThreshold } from "@/app/(server)/modules/site-configurations/site-config.constants";

interface NewsCarouselProps {
  newsItems?: NewsDTO[];
}

// Responsive configuration for different screen sizes
const responsiveConfig = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: 1 },
  desktop: { breakpoint: { max: 1024, min: 768 }, items: 1 },
  tablet: { breakpoint: { max: 768, min: 464 }, items: 1 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
};

/**
 * NewsCarousel component
 *
 * This component displays a carousel of news items. Each item includes an image, title, date, and metadata such as category.
 */
export default function NewsCarousel({ newsItems = [] }: NewsCarouselProps) {
  return (
    <div className="relative h-[24rem] xs:h-[26rem] sm:h-[29rem] mx-auto border border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-sm">
      <Carousel
        responsive={responsiveConfig}
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
        {newsItems.map((item) => (
          <NewsCarouselItem key={item.id} item={item} />
        ))}
      </Carousel>
    </div>
  );
}

interface NewsCarouselItemProps {
  item: NewsDTO;
}

/**
 * NewsCarouselItem component
 *
 * Displays a single news item in the carousel
 */
const NewsCarouselItem: React.FC<NewsCarouselItemProps> = ({ item }) => {
  return (
    <div className="w-full h-full">
      {/* Main Image Container */}
      <div className="relative w-full h-full group overflow-hidden">
        <AppLink href={ClientRoutes.viewNews(item.slug)}>
          <AppImage
            src={item?.coverImage ?? "/placeholder.jpg"}
            alt={cleanUpNewsTitle(cleanUpNewsTitle(item?.title)) ?? "News image"}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
            priority
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 opacity-80 transition-opacity duration-300 group-hover:opacity-70"></div>
        </AppLink>

        {/* Top Date Indicator */}
        <DateIndicator pubDate={item?.pubDate ?? undefined} />

        {/* Bottom Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-3 sm:p-8 z-10 transform transition-transform duration-300 group-hover:translate-y-[-4px]">
          {/* Metadata */}
          <NewsMetadata item={item} />

          {/* Headline */}
          <AppLink href={ClientRoutes.viewNews(item.slug)}>
            <h2 className="text-white text-base sm:text-xl md:text-2xl font-bold leading-tight line-clamp-3 sm:line-clamp-none group-hover:text-primaryGreen/90 transition-colors duration-300">
              {cleanUpNewsTitle(item?.title ?? "Fetching News")}
            </h2>
          </AppLink>
        </div>
      </div>
    </div>
  );
};

/**
 * DateIndicator component
 *
 * Displays the publication date of a news item
 */
const DateIndicator: React.FC<{ pubDate?: Date }> = ({ pubDate }) => (
  <div className="absolute top-2 sm:top-6 left-2 sm:left-6 flex items-center gap-2 z-10 transform transition-transform duration-300 group-hover:translate-y-1">
    <div className="bg-primaryGreen p-1 sm:p-2 text-white flex items-center justify-center rounded-sm shadow-md group-hover:bg-white group-hover:text-primaryGreen transition-all duration-300">
      <Calendar className="w-3 h-3 sm:w-5 sm:h-5" />
    </div>
    <span className="text-white text-xs sm:text-sm font-medium bg-black/40 px-2 sm:px-3 py-1 rounded-sm backdrop-blur-sm group-hover:bg-primaryGreen/80 transition-all duration-300">
      {pubDate ? calculateTimeStampFromDate(pubDate) : ""}
    </span>
  </div>
);

/**
 * NewsMetadata component
 *
 * Displays metadata for a news item including category, read time, views, and comments
 */
const NewsMetadata: React.FC<{ item: NewsDTO }> = ({ item }) => (
  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-2 sm:mb-5">
    {item?.categories && item.categories.length > 0 && (
      <div className="bg-primaryGreen px-2 sm:px-4 py-0.5 sm:py-1.5 rounded-sm shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-white group-hover:ring-2 group-hover:ring-white/30">
        <span className="text-white text-xs sm:text-sm font-medium transition-colors duration-300">{item.categories[0].name}</span>
      </div>
    )}

    <MetadataItem
      icon={<Camera className="w-3 h-3 sm:w-4 sm:h-4" />}
      text={`${item?.analytics?.readDuration ?? ''}`}
    />

    {item?.analytics?.views !== undefined && item.analytics.views >= ViewsThreshold && (
      <MetadataItem
        icon={<Eye className="w-3 h-3 sm:w-4 sm:h-4" />}
        text={`${item.analytics.views} views`}
      />
    )}

    {item?.analytics?.views !== undefined && item.analytics.views < ViewsThreshold && item?.comments !== undefined && item.comments.length > 0 && (
      <MetadataItem
        icon={<MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />}
        text={`${item.comments.length} comments`}
      />
    )}
  </div>
);

/**
 * MetadataItem component
 *
 * Reusable component for displaying metadata items with an icon and text
 */
const MetadataItem: React.FC<{ icon: React.ReactNode, text: string }> = ({ icon, text }) => (
  <div className="flex items-center gap-1 sm:gap-2 transition-transform duration-300 hover:scale-105">
    <div className="bg-primaryGreen rounded-full p-1 sm:p-2 text-white flex items-center justify-center shadow-md group-hover:ring-2 group-hover:ring-white/30 transition-all duration-300">
      {icon}
    </div>
    <span className="text-white text-xs sm:text-sm font-medium">
      {text}
    </span>
  </div>
);

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
    <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between z-20 px-2 sm:px-4 opacity-0 transition-opacity duration-300 hover:opacity-100 group-hover:opacity-100">
      <CarouselButton
        onClick={previous}
        ariaLabel="Previous slide"
        icon={<ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />}
      />
      <CarouselButton
        onClick={next}
        ariaLabel="Next slide"
        icon={<ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />}
      />
    </div>
  );
};

/**
 * CarouselButton component
 *
 * Reusable button component for carousel navigation
 */
const CarouselButton: React.FC<{
  onClick?: () => void,
  ariaLabel: string,
  icon: React.ReactNode
}> = ({ onClick, ariaLabel, icon }) => (
  <button
    onClick={onClick}
    className="text-white touch-manipulation transform transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/30 rounded-full"
    aria-label={ariaLabel}
  >
    <div className="bg-primaryGreen/50 hover:bg-primaryGreen rounded-full p-1.5 sm:p-4 text-white flex items-center justify-center shadow-md transition-all duration-300 hover:shadow-lg">
      {icon}
    </div>
  </button>
);
