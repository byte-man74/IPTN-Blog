import NewsCarousel from '@/_components/public/core/news-component/news-carousel'
import BasicTitle from '@/_components/public/core/section-title/basic-title'
import { carouselBasicNewsData } from '@/lib/constants/pre-data'
import React from 'react'

/**
 * MainContent component
 *
 * This component displays the main content section of the home page.
 * Features:
 * - Full width on mobile devices, 46% width on larger screens
 * - Contains a title section and a news carousel
 * - Responsive layout adapts to different screen sizes
 */
const MainContent = () => {
  // Perform nullish check for data coming from external source
  const newsItems = carouselBasicNewsData ?? [];

  return (
    <div className="w-full sm:w-[46%] min-h-full">
      <BasicTitle title="Main content" />
      <NewsCarousel newsItems={newsItems} />
    </div>
  )
}

export default MainContent
