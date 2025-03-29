import BasicNewsWithTag from '@/_components/public/core/news-component/basic-news-with-tag'
import OverlayedNewsImage from '@/_components/public/core/news-component/overlayed-news-image'
import BasicTitle from '@/_components/public/core/section-title/basic-title'
import { dummyNewsData, dummyBasicNewsData } from '@/lib/constants/pre-data'
import React from 'react'

const EditorsPick = () => {
  return (
    <div className="w-[30%] h-full">
      <BasicTitle title="Editor's pick " />
      <OverlayedNewsImage newsItem={dummyNewsData} />

      <div className="flex mt-3 flex-col gap-3">
        {dummyBasicNewsData &&
          dummyBasicNewsData.map((news, index) => (
            <BasicNewsWithTag key={index} newsContent={news} />
          ))}
      </div>
    </div>
  )
}

export default EditorsPick
