import React from 'react'
import { EntertainmentHero } from '@/_components/pages/public-fifth/sub-sections/hero'
import EntertainmentFullWidthSubArticle from '@/_components/pages/public-fifth/sub-sections/full-width-sub-article'
import { MoviesCategory } from '@/_components/pages/public-fifth/sub-sections/movies-category'

interface FifthNavPageContentProps {
  category: string
}

export const FifthNavPageContent = ({ category }: FifthNavPageContentProps) => {
  return (
    <>
      <EntertainmentHero category={category} />
      <EntertainmentFullWidthSubArticle category={category} />
      <MoviesCategory category={category} />
    </>
  )
}
