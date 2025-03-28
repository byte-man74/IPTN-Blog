import EditorsPick from '@/_components/pages/public-home/editors-pick'
import React from 'react'


const HomeCoreHero = () => {


  return (
    <div className="flex w-full justify-between gap-4 px-4 mt-6">
        <EditorsPick />
        <div className="bg-blue-700 w-[50%] min-h-[40rem]"></div>
        <div className="bg-red-700 w-[25%] min-h-[40rem]"></div>
    </div>
  )
}

export default HomeCoreHero
