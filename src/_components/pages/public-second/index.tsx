"use client"


import React from 'react'
import { SecondPageContentHero } from '@/_components/pages/public-second/sub-sections/news-hero'
import { AdsBox } from '@/_components/public/core/ads-box'
import TopNews from '@/_components/pages/public-second/sub-sections/top-news'

// import Sports from '@/_components/pages/public-second/sub-sections/sports'
import SecondCategoryFeatured from './sub-sections/featured'


interface SecondPageContentProps {
  category: number
}

export const SecondPageContent = ({ category }: SecondPageContentProps) => {

  return (
    <div className="flex gap-6 flex-col min-h-[2rem]">
      <SecondPageContentHero category={category} />
      <AdsBox />
      <TopNews category={category} />
      <SecondCategoryFeatured category={category} />
      {/* <Sports category={category} /> */}
    </div>
  )
}
