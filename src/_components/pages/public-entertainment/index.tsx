import React from 'react'
import { EntertainmentHero } from '@/_components/pages/public-entertainment/sub-sections/hero'
import EntertainmentFullWidthSubArticle from '@/_components/pages/public-entertainment/sub-sections/full-width-sub-article'
import { MoviesCategory } from '@/_components/pages/public-entertainment/sub-sections/movies-category'

export const EntertainmentPageContent = () => {
  return (
    <>
        <EntertainmentHero />
        <EntertainmentFullWidthSubArticle/>
        <MoviesCategory />
    </>

  )
}
