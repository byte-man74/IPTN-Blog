import React from 'react'
import { Skeleton } from '../skeleton'


/**
 * StandardNewsItemSkeleton
 *
 * A skeleton loader for standard news items with title and description placeholders.
 * Used in grid layouts and lists.
 */
export const StandardNewsItemSkeleton = () => (
  <div className="relative h-[15rem] w-full rounded-sm overflow-hidden animate-pulse bg-gray-200">
    <div className="absolute bottom-0 left-0 right-0 p-3">
      <div className="bg-gray-300 h-4 w-16 rounded-sm mb-2"></div>
      <div className="bg-gray-300 h-5 w-3/4 rounded-sm"></div>
    </div>
  </div>
)

/**
 * FeaturedNewsItemSkeleton
 *
 * A larger skeleton for featured news items.
 * Used for hero sections and prominent displays.
 */
export const FeaturedNewsItemSkeleton = () => (
  <div className="h-[30rem] bg-gray-200 animate-pulse rounded"></div>
)

/**
 * BasicNewsSkeleton
 *
 * A smaller skeleton for basic news items.
 * Used in horizontal scrolling layouts and smaller sections.
 */
export const BasicNewsSkeleton = () => (
  <div className="h-[9rem] w-1/2 flex-shrink-0 bg-gray-200 animate-pulse rounded"></div>
)

/**
 * BasicNewsWithImageSkeleton
 *
 * A skeleton for news items with an image and text side by side.
 * Used in trending sections and sidebars.
 */
export const BasicNewsWithImageSkeleton = () => (
  <div className="flex gap-0 h-36 bg-white shadow-md overflow-hidden">
    <div className="w-1/3 bg-gray-200 animate-pulse"></div>
    <div className="w-2/3 p-4 flex flex-col justify-center">
      <div className="flex items-center gap-2 mb-3">
        <div className="bg-gray-200 rounded-full p-1.5 w-6 h-6 animate-pulse"></div>
        <div className="bg-gray-200 h-3 w-20 animate-pulse"></div>
      </div>
      <div className="bg-gray-200 h-4 w-full mb-2 animate-pulse"></div>
      <div className="bg-gray-200 h-4 w-3/4 mb-2 animate-pulse"></div>
      <div className="bg-gray-200 h-3 w-16 mt-auto animate-pulse"></div>
    </div>
  </div>
)

/**
 * CarouselSkeleton
 *
 * A skeleton for carousel components with metadata placeholders.
 * Used in featured sections and hero carousels.
 */
export const CarouselSkeleton = () => (
  <div className="h-[24rem] xs:h-[26rem] sm:h-[29rem] mx-auto border border-gray-200 overflow-hidden shadow-lg rounded-sm bg-gray-200 animate-pulse">
    <div className="w-full h-full relative">
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-8">
        <div className="flex gap-2 mb-2">
          <div className="bg-gray-300 h-6 w-20 rounded-sm"></div>
          <div className="bg-gray-300 h-6 w-24 rounded-sm"></div>
        </div>
        <div className="bg-gray-300 h-8 w-3/4 rounded-sm mb-2"></div>
        <div className="bg-gray-300 h-8 w-1/2 rounded-sm"></div>
      </div>
    </div>
  </div>
)

/**
 * NewsWithDescriptionSkeleton
 *
 * A skeleton for news items with image and multiple text lines.
 * Used in content sections that include descriptions.
 */
export const NewsWithDescriptionSkeleton = () => (
  <div className="flex flex-col gap-2 animate-pulse">
    <div className="bg-gray-200 h-40 w-full rounded-sm"></div>
    <div className="bg-gray-300 h-5 w-3/4 rounded-sm"></div>
    <div className="bg-gray-300 h-5 w-1/2 rounded-sm"></div>
  </div>
)

/**
 * NavigationSkeleton
 *
 * A skeleton for navigation items.
 * Used in headers and menus.
 */
export const NavigationSkeleton = () => (
  <div className="h-6 w-20 bg-gray-700 animate-pulse rounded"></div>
)


export const NewsItemSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={`skeleton-${index}`} className="space-y-4">
          <Skeleton className="h-[150px] sm:h-[180px] md:h-[200px] w-full rounded-md" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </>
  );
};
