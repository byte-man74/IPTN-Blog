"use client"

import React from 'react'
import FullWidthAlternateTitle from '@/_components/public/core/section-title/full-width-alternate-title';
import NewsWithDescription from '@/_components/public/core/news-component/news-with-description';
import { Skeleton } from '@/_components/global/skeleton';
import { NewsDTO } from '@/app/(server)/modules/news/news.types';

interface MainSectionBodyIProps {
    title: string;
    sectionName: number;
    data?: NewsDTO[];
    isLoading: boolean;
}

export const MainSectionBody = ({ title, data, isLoading }: MainSectionBodyIProps) => {
  return (
    <div className="w-full flex flex-col gap-4 px-2 sm:px-4 mb-10">
        <FullWidthAlternateTitle title={title}/>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-4 md:px-6">
            {isLoading ? (
                <>
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="space-y-4">
                            <Skeleton className="h-[150px] sm:h-[180px] md:h-[200px] w-full rounded-md" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    ))}
                </>
            ) : (
                data?.map((newsItem) => (
                    <NewsWithDescription key={newsItem.id} newsItem={newsItem} />
                ))
            )}
        </div>
    </div>
  )
}
