import React from 'react'
import FullWidthAlternateTitle from '@/_components/public/core/section-title/full-width-alternate-title';
import { longCarouselBasicNewsData } from '@/lib/constants/pre-data';
import NewsWithDescription from '@/_components/public/core/news-component/news-with-description';


interface MainSectionBodyIProps {
    title: string;
    sectionName: string
}

//TODO: handle logic for section name later
export const MainSectionBody = ({title, }: MainSectionBodyIProps) => {
  return (
    <div className="w-full flex flex-col gap-4 px-4">
        <FullWidthAlternateTitle title={title}/>

        <div className="grid grid-cols-3 gap-4 px-6">
            {longCarouselBasicNewsData?.map((newsItem) => (
                <NewsWithDescription key={newsItem.id} newsItem={newsItem} />
            ))}
        </div>
    </div>
  )
}
