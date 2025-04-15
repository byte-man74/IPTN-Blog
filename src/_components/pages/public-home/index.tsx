'use client'

import React from 'react'
import HomeCoreHero from '@/_components/pages/public-home/sub-sections/home-core-hero'
import { NewsCategoryCarousel } from '@/_components/public/news-category-carousel'
import { NewsFullScreenCarousel } from '@/_components/public/news-full-screen-carousel'
import {
  HomePageBlogContent,
  HomePageFeatured,
  HomePageRecommendedContent,
  HomePageWithVideos,
} from '@/app/(server)/modules/site-configurations/site-config.constants'
import { useFetchNews } from '@/network/http-service/news.hooks'
import HomePageFreeContent from '@/_components/pages/public-home/sub-sections/you-may-have-missed'

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

  //featured news
  const { data: featuredNews, isLoading: featuredNewsIsLoading } = useFetchNews(
    { published: true, categorySlug: HomePageFeatured.slug },
    1,
    HomePageFeatured.maxThreshold
  )

  //news with videos
  const { data: newsWithVideos, isLoading: newsWithVideosIsLoading } = useFetchNews(
    { published: true, categorySlug: HomePageWithVideos.slug },
    1,
    HomePageFeatured.maxThreshold
  )

  //recommended content news
  const { data: recommendedContent, isLoading: recommendedContentIsLoading } = useFetchNews(
    { published: true, categorySlug: HomePageRecommendedContent.slug },
    1,
    HomePageRecommendedContent.maxThreshold
  )

  //free content information
  const { data: newsTaggedAsFreeContent, isLoading: newsTaggedAsFreeContentIsLoading } =
    useFetchNews(
      { published: true, categorySlug: HomePageBlogContent.slug },
      1,
      HomePageBlogContent.maxThreshold
    )

  return (
    <div
      className="flex flex-col min-h-[2rem]
      gap-4 xs:gap-5 sm:gap-6 md:gap-7 lg:gap-8
      px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8
      mt-3 xs:mt-4 sm:mt-5 md:mt-6
      mx-auto w-full"
    >
      <HomeCoreHero />
      <NewsCategoryCarousel
        title={HomePageFeatured.name}
        items={featuredNews?.data}
        isLoading={featuredNewsIsLoading}
        carouselItem={{ itemType: 'news-with-description' }}
      />
      <NewsCategoryCarousel
        title={HomePageWithVideos.name}
        items={newsWithVideos?.data}
        isLoading={newsWithVideosIsLoading}
        carouselItem={{ itemType: 'news-overlay' }}
      />

      <NewsFullScreenCarousel
        title={HomePageRecommendedContent.name}
        items={recommendedContent?.data}
        isLoading={recommendedContentIsLoading}
        carouselItem={{ itemType: 'news-fullscreen' }}
      />
      <HomePageFreeContent
        title={HomePageBlogContent.name}
        newsItems={newsTaggedAsFreeContent?.data}
        isLoading={newsTaggedAsFreeContentIsLoading}
      />
    </div>
  )
}

export default HomePageContent
