
import HeroNavigation from '@/_components/public/hero-navigation'
import HeroTags from '@/_components/public/hero-tags'
import HomePageContent from '@/_components/pages/public-home'
import MainNavBanner from '@/_components/public/main-nav-banner'
import GlobalSocialBanner from '@/_components/public/social-banner'
import { NewsBanner } from '@/_components/public/news-top-banner'

export default function Home() {
  return (
    <div className="relative">
      <GlobalSocialBanner />
      <MainNavBanner />
      {/* hero component -- i may use this later on */}
      <>
        <HeroNavigation />
        <HeroTags />
        <NewsBanner title="Breaking News" />
      </>
      <HomePageContent />
    </div>
  )
}
