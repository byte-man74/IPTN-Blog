import NewsCarousel from '@/_components/public/core/news-component/news-carousel'
import BasicTitle from '@/_components/public/core/section-title/basic-title'
import {  carouselBasicNewsData } from '@/lib/constants/pre-data'
import React from 'react'

const MainContent = () => {
  return (
    <div className="w-[50%] h-full">
    <BasicTitle title="Main content"/>
    <NewsCarousel newsItems={ carouselBasicNewsData}/>
</div>
  )
}

export default MainContent
