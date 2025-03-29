import BasicNewsWithTag from '@/_components/public/core/news-component/basic-news-with-tag'
import OverlayedNewsImage from '@/_components/public/core/news-component/overlayed-news-image'
import BasicTitle from '@/_components/public/core/section-title/basic-title'
import { dummyNewsData, dummyBasicNewsData } from '@/lib/constants/pre-data'
import React from 'react'

const EditorsPick = () => {
  return (
    <div className="w-[30%] min-h-full flex flex-col justify-between">
      <BasicTitle title="Editor's pick" />
      <OverlayedNewsImage newsItem={dummyNewsData} />

      
      <div className="flex mt-3 flex-row gap-3 justify-between">
        {dummyBasicNewsData &&
          dummyBasicNewsData.map((news, index) => (
            <BasicNewsWithTag key={index} newsContent={news} />
          ))}
      </div>
    </div>
  )
}

export default EditorsPick
