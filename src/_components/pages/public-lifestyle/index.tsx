import NewsScreenFullWidthHero from '@/_components/public/core/news-component/news-screen-full-width-hero'
import { NewsCategoryCarousel } from '@/_components/public/news-category-carousel'
import { longCarouselBasicNewsData } from '@/lib/constants/pre-data'
import React from 'react'
import MasonryNewsGrid from './sub-sections/masonry'

export const LifestylePageContent = () => {
  return (
    <>
      <NewsScreenFullWidthHero newsItems={longCarouselBasicNewsData} />

      {/* latest update section */}
      <div className="px-8">
        <NewsCategoryCarousel
          title="Latest Update"
          items={longCarouselBasicNewsData}
          carouselItem={{ itemType: 'overlay-v2' }}
        />
        <MasonryNewsGrid  />
      </div>
    </>
  )
}
