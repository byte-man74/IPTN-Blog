import HeroTags from '@/_components/public/hero-tags'
import HomePageContent from '@/_components/pages/public-home'
import MainNavBanner from '@/_components/public/main-nav-banner'
import HeroNavigation from '@/_components/public/hero-navigation'
import GlobalSocialBanner from '@/_components/public/social-banner'
import { NewsBanner } from '@/_components/public/news-top-banner'
import { HomePageBreakingNews } from './(server)/modules/site-configurations/site-config.constants'
import Footer from '@/_components/public/main-public-footer'

export default function Home() {
  return (
    <div className="relative">
      <GlobalSocialBanner />
      <MainNavBanner />
      {/* hero component -- i may use this later on */}
      <>
        <HeroNavigation />
        <HeroTags />
        <NewsBanner title={HomePageBreakingNews.name} />
      </>
      <HomePageContent />
      <Footer />
    </div>
  )
}
