import { NewsBanner } from '@/_components/public/news-top-banner'
import HeroNavigation from '@/_components/public/hero-navigation'
import HeroTags from '@/_components/public/hero-tags'
import MainNavBanner from '@/_components/public/main-nav-banner'
import GlobalSocialBanner from '@/_components/public/social-banner'
import { EntertainmentPageContent } from '@/_components/pages/public-entertainment'


/**
 * News component that renders the news page with various hero components and banners.
 */
const Entertainment = () => {
  return (
    <div className="relative">
      <GlobalSocialBanner />
      <MainNavBanner />
      {/* hero component -- i may use this later on */}
      <>
        <HeroNavigation />
        <HeroTags />
        <NewsBanner title="Latest Update" />
      </>

      <EntertainmentPageContent />
    </div>
  )
}

export default Entertainment
