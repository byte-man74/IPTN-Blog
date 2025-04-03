import React from 'react'
import { ArticleHero } from '@/_components/pages/public-articles/sub-sections/hero'
import { MainSectionBody } from '@/_components/public/core/section-body/main'

export const ArticlePageContent = () => {
  return (
    <div className='flex flex-col gap-10'>
      <ArticleHero />
      <MainSectionBody title="Featured Articles" sectionName=""/>
    </div>
  )
}
