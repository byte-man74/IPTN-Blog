import React from 'react'
import HomeCoreHero from '@/_components/pages/public-home/sub-sections/home-core-hero'
import { NewsCategoryCarousel } from '@/_components/public/news-category-carousel'
import { dummyBasicNewsData, longCarouselBasicNewsData } from '@/lib/constants/pre-data'
import { NewsFullScreenCarousel } from '@/_components/public/news-full-screen-carousel'

/**
 * HomePageContent component
 * This component serves as the main content section of the home page.
 */
const HomePageContent = () => {
  const reversedCarouselList = longCarouselBasicNewsData?.slice().reverse() ?? []
  return (
    <div className="flex gap-8 flex-col px-8 mt-6 min-h-[2rem]">
      <HomeCoreHero />
      <NewsCategoryCarousel
        title="Featured List"
        items={longCarouselBasicNewsData}
        carouselItem={{ itemType: 'news-with-description' }}
      />
      <NewsCategoryCarousel
        title="Videos"
        items={reversedCarouselList}
        carouselItem={{ itemType: 'news-overlay' }}
      />
      <NewsFullScreenCarousel
        title="Diaspora"
        items={dummyBasicNewsData}
        carouselItem={{ itemType: 'news-fullscreen' }}
      />
    </div>
  )
}

export default HomePageContent
