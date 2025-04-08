import { ArticlePageContent } from '@/_components/pages/public-articles'
import HeroNavigation from '@/_components/public/hero-navigation'
import HeroTags from '@/_components/public/hero-tags'
import MainNavBanner from '@/_components/public/main-nav-banner'
import { NewsBanner } from '@/_components/public/news-top-banner'
import GlobalSocialBanner from '@/_components/public/social-banner'
import React from 'react'

const Articles = () => {
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
    <ArticlePageContent />
  </div>
  )
}

export default Articles
