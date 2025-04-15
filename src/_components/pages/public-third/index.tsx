import React from 'react'
import { ArticleHero } from '@/_components/pages/public-third/sub-sections/hero'
import { MainSectionBody } from '@/_components/public/core/section-body/main'

interface ThirdPageContentProps {
  category: string
}

export const ThirdPageContent = ({ category }: ThirdPageContentProps) => {
  return (
    <div className="flex flex-col gap-10">
      <ArticleHero category={category} />
      <MainSectionBody title="Featured Articles" sectionName={category} />
    </div>
  )
}
