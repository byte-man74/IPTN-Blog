import BasicNews from '@/_components/public/core/news-component/basic-news'
import BasicTitle from '@/_components/public/core/section-title/basic-title'
import {  carouselBasicNewsData } from '@/lib/constants/pre-data'
import React from 'react'

const TrendingNow = () => {
  return (
    <div className="w-[30%] h-full">
    <BasicTitle title="Trending Now "/>


    <div className="flex mt-3 flex-col gap-3">
    {carouselBasicNewsData && carouselBasicNewsData.map((news) => (
        <BasicNews
            key={news.id}
            newsContent={news}
        />
    ))}
    </div>

</div>
  )
}

export default TrendingNow
