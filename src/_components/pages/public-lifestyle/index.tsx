import NewsScreenFullWidthHero from '@/_components/public/core/news-component/news-screen-full-width-hero'
import { longCarouselBasicNewsData } from '@/lib/constants/pre-data'
import React from 'react'

export const LifestylePageContent = () => {
  return <NewsScreenFullWidthHero newsItems={longCarouselBasicNewsData} />
}
