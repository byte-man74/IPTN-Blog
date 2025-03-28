import EditorsPick from '@/_components/pages/public-home/editors-pick'
import MainContent from '@/_components/pages/public-home/main-content'
import React from 'react'


const HomeCoreHero = () => {
  return (
    <div className="flex w-full justify-between gap-4 px-4 mt-6 min-h-[2rem] items-stretch">
        <EditorsPick />
        <MainContent />
        <div className="bg-red-700 w-[25%]"></div>
    </div>
  )
}

export default HomeCoreHero
