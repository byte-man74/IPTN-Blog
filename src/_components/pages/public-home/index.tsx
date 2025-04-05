import React from 'react'
import HomeCoreHero from '@/_components/pages/public-home/sub-sections/home-core-hero'
import { NewsCategoryCarousel } from '@/_components/public/news-category-carousel'
import { dummyBasicNewsData, longCarouselBasicNewsData } from '@/lib/constants/pre-data'
import { NewsFullScreenCarousel } from '@/_components/public/news-full-screen-carousel'
import YouMayHaveMissed from '@/_components/pages/public-home/sub-sections/you-may-have-missed'

/**
 * HomePageContent component
 *
 * This component serves as the main content section of the home page.
 * Features:
 * - Fully responsive layout with appropriate spacing at all breakpoints
 * - Adaptive padding and gap sizing based on viewport width
 * - Optimized content flow for mobile, tablet, and desktop views
 * - Displays various news carousels and content sections
 *
 */
const HomePageContent = () => {
  // Perform nullish check for data coming from external source
  const longCarouselData = longCarouselBasicNewsData ?? [];
  const reversedCarouselList = longCarouselData.slice().reverse() ?? [];
  const basicNewsData = dummyBasicNewsData ?? [];

  return (
    <div className="flex flex-col min-h-[2rem]
      gap-4 xs:gap-5 sm:gap-6 md:gap-7 lg:gap-8
      px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8
      mt-3 xs:mt-4 sm:mt-5 md:mt-6
      mx-auto w-full">
      <HomeCoreHero />
      <NewsCategoryCarousel
        title="Featured List"
        items={longCarouselData}
        carouselItem={{ itemType: 'news-with-description' }}
      />
      <NewsCategoryCarousel
        title="Videos"
        items={reversedCarouselList}
        carouselItem={{ itemType: 'news-overlay' }}
      />
      <NewsFullScreenCarousel
        title="Diaspora"
        items={basicNewsData}
        carouselItem={{ itemType: 'news-fullscreen' }}
      />
      <YouMayHaveMissed />
    </div>
  )
}

export default HomePageContent
