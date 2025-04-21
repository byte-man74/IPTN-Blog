'use client'

import React from 'react'
import { FifthSectionHero } from '@/_components/pages/public-fifth/sub-sections/hero'
import { FifthSectionFullWidthSubArticle } from '@/_components/pages/public-fifth/sub-sections/full-width-sub-article'
import { FifthSectionFeaturedCategory } from './sub-sections/featured'
import { AdsBox } from '@/_components/public/core/ads-box'

interface FifthNavPageContentProps {
  category: number
}

export const FifthNavPageContent = ({ category }: FifthNavPageContentProps) => {
  return (
    <>
      <FifthSectionHero category={category} />
      <FifthSectionFullWidthSubArticle category={category} />
      <AdsBox position="fourth-page"/>
      <FifthSectionFeaturedCategory category={category} />
    </>
  )
}
