'use client'

import React from 'react'
import HomeCoreHero from '@/_components/pages/public-home/sub-sections/home-core-hero'
import { NewsCategoryCarousel } from '@/_components/public/news-category-carousel'
import { NewsFullScreenCarousel } from '@/_components/public/news-full-screen-carousel'
import {
  HomePageArticles,
  HomePageDiaspora,
  HomePageFeatured,
  HomePageInterviews,
  HomePageWithVideos,
  HomePageYouMayHaveMissed,
} from '@/app/(server)/modules/site-configurations/site-config.constants'
import { useFetchNews } from '@/network/http-service/news.hooks'
import HomePageFreeContent from '@/_components/pages/public-home/sub-sections/you-may-have-missed'
import { AdsBox } from '@/_components/public/core/ads-box'

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
    {
      published: true,
      categorySlugs: [HomePageFeatured.slug, HomePageArticles.slug],
    },
    1,
    HomePageFeatured.maxThreshold
  )

  //interviews
  const { data: interviews, isLoading: interviewsIsLoading } = useFetchNews(
    {
      published: true,
      categorySlugs: [HomePageInterviews.slug],
    },
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
  const { data: diasporaContent, isLoading: diasporaContentIsLoading } = useFetchNews(
    { published: true, categorySlug: HomePageDiaspora.slug },
    1,
    HomePageDiaspora.maxThreshold
  )

  //you may have missed
  const { data: youMayHaveMissedFreeContent, isLoading: youMayHaveMissedIsLoading } = useFetchNews(
    { published: true, categorySlug: HomePageYouMayHaveMissed.slug },
    1,
    HomePageYouMayHaveMissed.maxThreshold
  )

  return (
    <>
      <div
        className="flex flex-col min-h-[2rem]
      gap-4 xs:gap-5 sm:gap-6 md:gap-12 lg:gap-12
      px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8
      mt-3 xs:mt-4 sm:mt-5 md:mt-6
      mx-auto w-full"
      >
        <HomeCoreHero />

        {!featuredNewsIsLoading && featuredNews?.data && featuredNews.data.length > 5 && (
          <NewsCategoryCarousel
            title={HomePageFeatured.name}
            backgroundTitle="Featured"
            items={featuredNews.data.slice(5)}
            isLoading={featuredNewsIsLoading}
            carouselItem={{ itemType: 'news-with-description' }}
          />
        )}

        {!interviewsIsLoading && interviews?.data && interviews.data.length > 0 && (
          <NewsCategoryCarousel
            title={'Interviews'}
            backgroundTitle="Honor & Glory"
            items={interviews.data}
            isLoading={interviewsIsLoading}
            carouselItem={{ itemType: 'interview' }}
          />
        )}

        {!newsWithVideosIsLoading && newsWithVideos?.data && newsWithVideos.data.length > 0 && (
          <NewsCategoryCarousel
            title={HomePageWithVideos.name}
            items={newsWithVideos.data}
            backgroundTitle="Must See"
            isLoading={newsWithVideosIsLoading}
            carouselItem={{ itemType: 'news-overlay' }}
          />
        )}

        {!diasporaContentIsLoading && diasporaContent?.data && diasporaContent.data.length > 0 && (
          <NewsFullScreenCarousel
            title={HomePageDiaspora.name}
            items={diasporaContent.data}
            isLoading={diasporaContentIsLoading}
            carouselItem={{ itemType: 'news-fullscreen' }}
          />
        )}

        {!youMayHaveMissedIsLoading &&
          youMayHaveMissedFreeContent?.data &&
          youMayHaveMissedFreeContent.data.length > 0 && (
            <HomePageFreeContent
              title={HomePageYouMayHaveMissed.name}
              newsItems={youMayHaveMissedFreeContent.data}
              isLoading={youMayHaveMissedIsLoading}
            />
          )}
      </div>
      <AdsBox />
    </>
  )
}

export default HomePageContent
