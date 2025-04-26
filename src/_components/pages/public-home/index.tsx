'use client'

import React from 'react'
import HomeCoreHero from '@/_components/pages/public-home/sub-sections/home-core-hero'
import { NewsCategoryCarousel } from '@/_components/public/news-category-carousel'
import { NewsFullScreenCarousel } from '@/_components/public/news-full-screen-carousel'
import {
  HomePageDiaspora,
  HomePageFeatured,
  HomePageWithVideos,
  HomePageYouMayHaveMissed,
} from '@/app/(server)/modules/site-configurations/site-config.constants'
import HomePageFreeContent from '@/_components/pages/public-home/sub-sections/you-may-have-missed'
import { AdsBox } from '@/_components/public/core/ads-box'
import { NewsDTO } from '@/app/(server)/modules/news/news.types'
import { useHomePageNews } from './hooks/use-home-page'
import { useTrackSection } from '@/hooks/use-track-section'

/**
 * HomePageContent component
 *
 * This component serves as the main content section of the home page.
 * Features:
 * - Fully responsive layout with appropriate spacing at all breakpoints
 * - Adaptive padding and gap sizing based on viewport width
 * - Optimized content flow for mobile, tablet, and desktop views
 * - Displays various news carousels and content sections
 */
const InterviewsId = 'Interviews'
const HomeHeroId = 'Hero'
const sections = [
  { id: HomeHeroId },
  { id: HomePageFeatured.name },
  { id: InterviewsId },
  { id: HomePageWithVideos.name },
  { id: HomePageDiaspora.name },
  { id: HomePageYouMayHaveMissed.name },
]

const HomePageContent = () => {
  // Use the custom hook to fetch all news data
  const { featuredNews, interviews, newsWithVideos, diasporaContent, youMayHaveMissedContent } =
    useHomePageNews()

  const { setRef } = useTrackSection(sections)

  // Helper function to render content sections conditionally
  const renderContentSection = <T extends { data?: NewsDTO[] }>(
    data: T | undefined,
    isLoading: boolean,
    renderComponent: (items: NewsDTO[]) => React.ReactNode
  ): React.ReactNode => {
    if (!isLoading && data?.data && data.data.length > 0) {
      return renderComponent(data.data)
    }
    return null
  }

  return (
    <>
      <div
        className="flex flex-col min-h-[2rem]
      gap-4 xs:gap-5 sm:gap-6 md:gap-12 lg:gap-12
      px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8
      mt-3 xs:mt-4 sm:mt-5 md:mt-6
      mx-auto w-full"
      >
        <div id={HomeHeroId} ref={setRef(HomeHeroId)}>
          <HomeCoreHero />
        </div>

        {renderContentSection(
          featuredNews.data,
          featuredNews.isLoading,
          (items: NewsDTO[]) =>
            items.length > 5 && (
              <div id={HomePageFeatured.name} ref={setRef(HomePageFeatured.name)}>
                <NewsCategoryCarousel
                  title={HomePageFeatured.name}
                  backgroundTitle="Featured"
                  items={items.slice(5)}
                  isLoading={featuredNews.isLoading}
                  carouselItem={{ itemType: 'news-with-description' }}
                />
              </div>
            )
        )}

        {renderContentSection(interviews.data, interviews.isLoading, (items: NewsDTO[]) => (
          <div id={InterviewsId} ref={setRef(InterviewsId)}>
            <NewsCategoryCarousel
              title="Interviews"
              backgroundTitle="Honor & Glory"
              items={items}
              isLoading={interviews.isLoading}
              carouselItem={{ itemType: 'interview' }}
            />
          </div>
        ))}

        {renderContentSection(newsWithVideos.data, newsWithVideos.isLoading, (items: NewsDTO[]) => (
          <div id={HomePageWithVideos.name} ref={setRef(HomePageWithVideos.name)}>
            <NewsCategoryCarousel
              title={HomePageWithVideos.name}
              backgroundTitle="Must See"
              items={items}
              isLoading={newsWithVideos.isLoading}
              carouselItem={{ itemType: 'news-overlay' }}
            />
          </div>
        ))}

        {renderContentSection(
          diasporaContent.data,
          diasporaContent.isLoading,
          (items: NewsDTO[]) => (
            <div id={HomePageDiaspora.name} ref={setRef(HomePageDiaspora.name)}>
              <NewsFullScreenCarousel
                title={HomePageDiaspora.name}
                items={items}
                isLoading={diasporaContent.isLoading}
                carouselItem={{ itemType: 'news-fullscreen' }}
              />
            </div>
          )
        )}

        {renderContentSection(
          youMayHaveMissedContent.data,
          youMayHaveMissedContent.isLoading,
          (items: NewsDTO[]) => (
            <div id={HomePageYouMayHaveMissed.name} ref={setRef(HomePageYouMayHaveMissed.name)}>
              <HomePageFreeContent
                title={HomePageYouMayHaveMissed.name}
                newsItems={items}
                isLoading={youMayHaveMissedContent.isLoading}
              />
            </div>
          )
        )}
      </div>
      <AdsBox position="home-page" />
    </>
  )
}

export default HomePageContent
