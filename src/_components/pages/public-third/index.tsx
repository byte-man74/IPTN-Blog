'use client'

import React from 'react'
import { ThirdSectionHero } from '@/_components/pages/public-third/sub-sections/hero'
import { MainSectionBody } from '@/_components/public/core/section-body/main'
import { CONTENT_CRITERIA } from '@/app/(server)/modules/site-configurations/site-config.constants'
import { AdsBox } from '@/_components/public/core/ads-box'

interface ThirdPageContentProps {
  category: number
}

const FeaturedNews = CONTENT_CRITERIA.featured

export const ThirdPageContent = ({ category }: ThirdPageContentProps) => {
  //featured news

  return (
    <div className="flex flex-col gap-10">
      <ThirdSectionHero category={category} />
      <MainSectionBody
        title={FeaturedNews.name}
        sectionName={category}
      />
      <AdsBox position="third-page"/>
    </div>
  )
}
