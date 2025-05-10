"use client"

import React, { useState, useEffect, useCallback } from 'react'
import FullWidthAlternateTitle from '@/_components/public/core/section-title/full-width-alternate-title';
import { useFetchNews } from '@/network/http-service/news.hooks';
import { NewsItemSkeleton} from '@/_components/global/skeletons';
import { NewsDTO } from '@/app/(server)/modules/news/news.types';
import AlternateNewsWithDescription from '@/_components/public/core/news-component/alternate-news-with-description';

interface MainSectionBodyIProps {
  title: string;
  sectionName: number;
  id?: string;
  ref?: (el: HTMLElement | null) => void
}

export const MainSectionBody = (
  ({ title, sectionName, id, ref }: MainSectionBodyIProps) => {
    const [page, setPage] = useState(1);
    const [allNewsItems, setAllNewsItems] = useState<NewsDTO[]>([]);
    const ITEMS_PER_PAGE = 6;

    const { data, isLoading } = useFetchNews(
      {
        categoryIds: [sectionName],
        published: true,
      },
      page,
      ITEMS_PER_PAGE
    );

    // Update accumulated news items when new data arrives
    useEffect(() => {
      if (data?.data && !isLoading) {
        if (page === 1) {
          // Reset for first page
          setAllNewsItems(data.data);
        } else {
          // Append for subsequent pages
          setAllNewsItems(prev => [...prev, ...data.data]);
        }
      }
    }, [data, isLoading, page]);

    const hasNextPage = data?.meta?.nextPage;

    // Load more implementation - memoized with useCallback
    const handleLoadMore = useCallback(() => {
      if (!isLoading && hasNextPage) {
        setPage(prevPage => prevPage + 1);
      }
    }, [isLoading, hasNextPage]);

    // Infinite scroll handler
    useEffect(() => {
      const handleScroll = () => {
        if (isLoading || !hasNextPage) return;

        const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
        const scrollThreshold = document.documentElement.offsetHeight - 900;

        if (scrollPosition >= scrollThreshold) {
          handleLoadMore();
        }
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, [isLoading, hasNextPage, handleLoadMore]);

    return (
      <div className="w-full flex flex-col gap-10 px-2 sm:px-4 mb-10 mt-6" ref={ref} id={id}>
        <FullWidthAlternateTitle title={title}/>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-4 md:px-6">
          {page === 1 && isLoading ? (
            <NewsItemSkeleton count={6} />
          ) : (
            allNewsItems.map((newsItem) => (
              <div key={newsItem.id} className="h-full">
                <AlternateNewsWithDescription newsItem={newsItem} />
              </div>
            ))
          )}
        </div>

        {isLoading && page > 1 && (
          <div className="mt-8 flex justify-center w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
              <NewsItemSkeleton count={3} />
            </div>
          </div>
        )}

        {!isLoading && !hasNextPage && allNewsItems.length > 0 && (
          <div className="flex justify-center mt-8">
            <p className="text-gray-500 font-medium">You&apos;re all caught up! ✓</p>
          </div>
        )}
      </div>
    )
  }
)
