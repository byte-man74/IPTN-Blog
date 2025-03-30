import React from 'react'
import { NewsHero } from '@/_components/pages/public-news/sub-sections/news-hero'
import { AdsBox } from '@/_components/public/core/ads-box'
import TopNews from '@/_components/pages/public-news/sub-sections/top-news'
import Politics from '@/_components/pages/public-news/sub-sections/politics'

export const NewsPageContent = () => {
  return (
    <div className="flex gap-6 flex-col min-h-[2rem]">
        <NewsHero />
        <AdsBox />
        <TopNews />
        <Politics />
    </div>
  )
}
