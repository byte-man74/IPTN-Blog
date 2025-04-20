'use client'
import {
  HomePageFeatured,
  HomePageArticles,
  HomePageInterviews,
  HomePageWithVideos,
  HomePageDiaspora,
  HomePageYouMayHaveMissed,
  DEFAULT_PAGE_NUMBER,
} from '@/app/(server)/modules/site-configurations/site-config.constants'
import { useFetchNews } from '@/network/http-service/news.hooks'

// Custom hook to encapsulate news fetching logic
export const useHomePageNews = () => {
  const featuredNews = useFetchNews(
    {
      published: true,
      categorySlugs: [HomePageFeatured.slug, HomePageArticles.slug],
    },
    DEFAULT_PAGE_NUMBER,
    HomePageFeatured.maxThreshold
  )

  const interviews = useFetchNews(
    {
      published: true,
      categorySlugs: [HomePageInterviews.slug],
    },
    DEFAULT_PAGE_NUMBER,
    10
  )

  const newsWithVideos = useFetchNews(
    { published: true, categorySlug: HomePageWithVideos.slug },
    DEFAULT_PAGE_NUMBER,
    HomePageWithVideos.maxThreshold
  )

  const diasporaContent = useFetchNews(
    { published: true, categorySlug: HomePageDiaspora.slug },
    DEFAULT_PAGE_NUMBER,
    HomePageDiaspora.maxThreshold
  )

  const youMayHaveMissedContent = useFetchNews(
    { published: true, categorySlug: HomePageYouMayHaveMissed.slug },
    DEFAULT_PAGE_NUMBER,
    HomePageYouMayHaveMissed.maxThreshold
  )

  return {
    featuredNews,
    interviews,
    newsWithVideos,
    diasporaContent,
    youMayHaveMissedContent,
  }
}
