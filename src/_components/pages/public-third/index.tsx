'use client'

import React from 'react'
import { ThirdSectionHero } from '@/_components/pages/public-third/sub-sections/hero'
import { MainSectionBody } from '@/_components/public/core/section-body/main'
import { CONTENT_CRITERIA } from '@/app/(server)/modules/site-configurations/site-config.constants'
import { AdsBox } from '@/_components/public/core/ads-box'
import { useTrackSection } from '@/hooks/use-track-section'

interface ThirdPageContentProps {
  category: number
}

const FeaturedNews = CONTENT_CRITERIA.featured
const HeroId = 'Hero'
const sections = [
  { id: HeroId },
  { id: FeaturedNews.name },
]

export const ThirdPageContent = ({ category }: ThirdPageContentProps) => {
  //featured news
  const { setRef } = useTrackSection(sections)

  return (
    <div className="flex flex-col gap-10">
      <ThirdSectionHero category={category} ref={setRef(HeroId)} id={HeroId} />
      <MainSectionBody
        title={FeaturedNews.name}
        sectionName={category}
        ref={setRef(FeaturedNews.name)}
        id={FeaturedNews.name}
      />
      <AdsBox position="third-page"/>
    </div>
  )
}
