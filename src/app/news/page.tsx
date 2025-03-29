import { NewsBanner } from '@/_components/public/news-top-banner'
import HeroNavigation from '@/_components/public/hero-navigation'
import HeroTags from '@/_components/public/hero-tags'

import MainNavBanner from '@/_components/public/main-nav-banner'
import GlobalSocialBanner from '@/_components/public/social-banner'
import { NewsPageContent } from '@/_components/pages/public-news'

/**
 * News component that renders the news page with various hero components and banners.
 * @returns {JSX.Element} The rendered news page component.
 */
const News = () => {
  return (
    <div className="relative">
      <GlobalSocialBanner />
      <MainNavBanner />
      {/* hero component -- i may use this later on */}
      <>
        <HeroNavigation />
        <HeroTags />
        <NewsBanner title="Top News"/>
      </>

      <NewsPageContent />
    </div>
  )
}

export default News
