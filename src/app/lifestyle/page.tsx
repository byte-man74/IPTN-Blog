import { LifestylePageContent } from '@/_components/pages/public-lifestyle'
import HeroNavigation from '@/_components/public/hero-navigation'
import HeroTags from '@/_components/public/hero-tags'
import MainNavBanner from '@/_components/public/main-nav-banner'
import { NewsBanner } from '@/_components/public/news-top-banner'
import GlobalSocialBanner from '@/_components/public/social-banner'

const LifeStylePage = () => {
  return (
    <div className="relative">
      <GlobalSocialBanner />
      <MainNavBanner />

      {/* hero component -- i may use this later on */}
      <>
        <HeroNavigation />
        <HeroTags />
        <NewsBanner title="Trending" />
      </>

      <LifestylePageContent />
    </div>
  )
}

export default LifeStylePage
