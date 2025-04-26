'use client'

import React from 'react'
import { FifthSectionHero } from '@/_components/pages/public-fifth/sub-sections/hero'
import { FifthSectionFullWidthSubArticle } from '@/_components/pages/public-fifth/sub-sections/full-width-sub-article'
import { FifthSectionFeaturedCategory } from './sub-sections/featured'
import { AdsBox } from '@/_components/public/core/ads-box'
import { useTrackSection } from '@/hooks/use-track-section'

interface FifthNavPageContentProps {
  category: number
}

const HeroSectionId = 'Hero'
const MoviesId = 'Movies'
const LatestId = 'Latest'

const sections = [{ id: HeroSectionId }, { id: MoviesId }, { id: LatestId }]
export const FifthNavPageContent = ({ category }: FifthNavPageContentProps) => {
  const { setRef } = useTrackSection(sections)

  return (
    <div className="flex w-full flex-col gap-4">
      <FifthSectionHero category={category} ref={setRef(HeroSectionId)} id={HeroSectionId} />
      <FifthSectionFullWidthSubArticle category={category} ref={setRef(LatestId)} id={LatestId} />
      <AdsBox position="fourth-page" />
      <FifthSectionFeaturedCategory category={category} ref={setRef(MoviesId)} id={MoviesId} />
    </div>
  )
}
