'use client'

import React, { useRef } from 'react'
import { Clock } from 'lucide-react'
import { useFetchNewsDetail, useFetchRelatedNews, useFetchNews } from '@/network/http-service/news.hooks'
import { Skeleton } from '@/_components/global/skeleton'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { default as TipTapImage } from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import { AppImage } from '@/_components/global/app-image'
import { useIncrementNewsMetric } from '@/network/http-service/analytics.mutations'
import { cleanUpNewsTitle } from '@/app/(server)/modules/news/news.utils'
import { NewsFilterDTO } from '@/app/(server)/modules/news/news.types'
import { NewsComments } from '@/_components/public/core/news-comment'
import { NewsCategoryCarousel } from '@/_components/public/news-category-carousel'
import { DEFAULT_PAGE_NUMBER } from '@/app/(server)/modules/site-configurations/site-config.constants'
import { ViewNewsMainSkeleton } from '@/_components/global/skeletons'

/**
 * ViewNews component displays a news article in a Medium-style layout
 * with a full-width cover image and properly formatted content.
 */
const ViewNews = ({ slug }: { slug: string }) => {
  const { data, isLoading: isNewsLoading } = useFetchNewsDetail(slug)
  const { data: relatedNewsData, isLoading: isRelatedLoading } = useFetchRelatedNews(slug)
  const hasIncrementedView = useRef(false)
  const incrementMetric = useIncrementNewsMetric(slug, data?.id)

  // Fetch news by tags when data is available
  const tagIds = data?.tags?.map(tag => typeof tag === 'object' ? tag.id : null).filter(Boolean) || []
  const tagFilter: NewsFilterDTO = {
    published: true,
    tagIds: tagIds.length > 0 ? tagIds as number[] : undefined,
  }

  const { data: tagRelatedNews, isLoading: isTagRelatedLoading } = useFetchNews(
    tagIds.length > 0 ? tagFilter : { published: true, },
    DEFAULT_PAGE_NUMBER,
    8
  )

  // Filter out the current article from tag-related news
  const filteredTagNews = tagRelatedNews?.data?.filter(item => item.id !== data?.id).slice(0, 4) || []

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: 'text-primaryGreen hover:text-primaryGreen/80 underline',
        },
      }),
      TipTapImage.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
      Youtube.configure({
        width: 640,
        height: 480,
        HTMLAttributes: {
          class: 'rounded-lg w-full max-w-full aspect-video',
        },
      }),
    ],
    content: data?.contentEncoded || '',
    editable: false,
  }, [data?.contentEncoded])

  // Handle view increment
  if (data?.id && !hasIncrementedView.current) {
    const viewedNews = JSON.parse(sessionStorage.getItem('viewedNews') || '{}')
    if (!viewedNews[slug]) {
      incrementMetric.mutate({
        data: { metricType: 'views' }
      })
      hasIncrementedView.current = true
    }
  }

  return (
    <article className="max-w-full w-full flex flex-col items-center ">
      {/* Header Section */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 flex flex-col items-center">
        {isNewsLoading ? (
          <Skeleton className="h-12 md:h-16 w-full md:w-3/4 mb-3 md:mb-4" />
        ) : (
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight text-center">
            {cleanUpNewsTitle(data?.title ?? "") || 'Article Title'}
          </h1>
        )}

        {isNewsLoading ? (
          <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-4 md:mb-6">
            <Skeleton className="h-5 md:h-6 w-24 md:w-32" />
            <Skeleton className="h-5 md:h-6 w-24 md:w-32" />
          </div>
        ) : (
          <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-600 mb-4 md:mb-6 gap-3 md:gap-4 justify-center">
            <span>{data?.pubDate ? new Date(data.pubDate).toLocaleDateString() : 'Publication Date'}</span>
            {data?.analytics?.readDuration && (
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1.5" />
                {data.analytics.readDuration}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Cover Image */}
      <div className="w-full h-[200px] sm:h-[250px] md:h-[350px] lg:h-[450px] relative mb-6 md:mb-8">
        {isNewsLoading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <AppImage
            src={data?.coverImage || '/placeholder-image.jpg'}
            alt={data?.title || 'Article Title'}
            className="object-cover w-full h-full"
            priority
          />
        )}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {isNewsLoading ? (
            <ViewNewsMainSkeleton />
        ) : (
          <div className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none mb-6 md:mb-8 font-tiro-devanagari text-base sm:text-lg md:text-xl p-6 rounded-lg shadow-sm">
            {editor && <EditorContent editor={editor} className="prose max-w-none font-tiro-devanagari text-base sm:text-lg md:text-xl" />}
          </div>
        )}


        {/* Comments Section */}
        {!isNewsLoading && data && (
          <NewsComments
            slug={slug}
            newsId={data.id}
            initialComments={data.comments || []}
          />
        )}
      </div>

      {/* Related by Tags Section */}
      {isTagRelatedLoading ? (
        <div className="w-full mt-12 mb-8">
          <div className="container mx-auto px-2 md:px-4 lg:px-6">
            <Skeleton className="h-10 w-64 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-64 w-full rounded-md" />
              ))}
            </div>
          </div>
        </div>
      ) : (
        filteredTagNews.length > 0 && (
          <div className="w-full mt-16 mb-12 py-10">
            <div className="container mx-auto px-2">
              <NewsCategoryCarousel
                title="Related Topics"
                backgroundTitle="Explore"
                items={filteredTagNews}
                isLoading={false}
                carouselItem={{ itemType: 'news-overlay' }}
              />
            </div>
          </div>
        )
      )}

      {/* You May Also Like Section */}
      {isRelatedLoading ? (
        <div className="w-full mb-16">
          <div className="container mx-auto px-4">
            <Skeleton className="h-10 w-64 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-64 w-full rounded-md" />
              ))}
            </div>
          </div>
        </div>
      ) : (
        relatedNewsData && relatedNewsData.length > 0 && (
          <div className="w-full mb-16  py-10">
            <div className="container mx-auto px-2">
              <NewsCategoryCarousel
                title="Recommended Reading"
                backgroundTitle="Discover"
                items={relatedNewsData}
                isLoading={false}
                carouselItem={{ itemType: 'overlay-v2' }}
              />
            </div>
          </div>
        )
      )}
    </article>
  )
}

export default ViewNews
