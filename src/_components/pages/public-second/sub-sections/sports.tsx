"use client"
import DarkerBasicNewsWithTag from "@/_components/public/core/news-component/darker-basic-news-with-tag"
import OverlayedNewsImage from "@/_components/public/core/news-component/overlayed-news-image"
import FullWidthAlternateTitle from "@/_components/public/core/section-title/full-width-alternate-title"
import { NewsDTO } from "@/app/(server)/modules/news/news.types"
import { CONTENT_CRITERIA, DEFAULT_PAGE_NUMBER } from "@/app/(server)/modules/site-configurations/site-config.constants"
import { useFetchNews } from "@/network/http-service/news.hooks"

const SportsSection = () => {
  const { data: sportsNews, isLoading } = useFetchNews(
    {
      published: true,
      categorySlugs: [CONTENT_CRITERIA.sports.slug],
    },
    DEFAULT_PAGE_NUMBER,
    CONTENT_CRITERIA.sports.maxThreshold || 6
  )

  // Handle loading state or empty data
  if (isLoading || !sportsNews || !sportsNews.data || sportsNews.data.length === 0) {
    return (
      <div className="relative px-8 py-5 flex flex-col gap-8">
        <FullWidthAlternateTitle title="Sports" />
        <div className="min-h-[200px] flex items-center justify-center">
          {isLoading ? "Loading sports news..." : "No sports news available"}
        </div>
      </div>
    )
  }

  const sportsArticles = sportsNews.data;
  const featuredSportsArticle = sportsArticles[0];
  const secondarySportsArticles = sportsArticles.slice(1, 3);
  const additionalSportsArticles = sportsArticles.slice(3);

  return (
    <div className="relative px-8 py-5 flex flex-col gap-8">
      <FullWidthAlternateTitle title="Sports" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          {featuredSportsArticle && <OverlayedNewsImage newsItem={featuredSportsArticle} />}
        </div>

        <div className="grid grid-cols-1 gap-4 md:col-span-1">
          {secondarySportsArticles.map((article: NewsDTO, index: number) => (
            <div className="w-full" key={`sports-secondary-${index}`}>
              <DarkerBasicNewsWithTag newsItem={article} />
            </div>
          ))}
        </div>

        <div className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 mt-0">
          {additionalSportsArticles.map((article: NewsDTO, index: number) => (
            <div className="w-full" key={`sports-additional-${index}`}>
              <DarkerBasicNewsWithTag newsItem={article} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SportsSection
