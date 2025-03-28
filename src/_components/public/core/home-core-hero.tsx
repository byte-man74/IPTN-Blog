import EditorsPick from '@/_components/pages/public-home/editors-pick'
import MainContent from '@/_components/pages/public-home/main-content'
import TrendingNow from '@/_components/pages/public-home/trending-now'
import React from 'react'


const HomeCoreHero = () => {
  return (
    <div className="flex w-full justify-between gap-2 px-4 mt-6 min-h-[2rem] items-stretch">
        <EditorsPick />
        <MainContent />
        <TrendingNow />
    </div>
  )
}

export default HomeCoreHero
