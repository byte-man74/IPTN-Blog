'use client'

import React, { useState, useEffect } from 'react'
import { Tag } from 'lucide-react'
import { useFetchNewsDetail } from '@/network/http-service/news.hooks'
import { Skeleton } from '@/_components/global/skeleton'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { default as TipTapImage } from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import { AppImage } from '@/_components/global/app-image'


/**
 * ViewNews component displays a news article in a Medium-style layout
 * with a full-width cover image and properly formatted content.
 */
const ViewNews = ({ slug }: { slug: string }) => {
  const { data, isLoading: isNewsLoading } = useFetchNewsDetail(slug)
  const [loading, setLoading] = useState(isNewsLoading)

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
        nocookie: true,
      }),
    ],
    content: data?.contentEncoded || '',
    editable: false,
  }, [data?.contentEncoded])

  useEffect(() => {
    // Update loading state when data is fetched
    setLoading(isNewsLoading)
  }, [isNewsLoading])

  useEffect(() => {
    if (editor && data?.contentEncoded) {
      editor.commands.setContent(data.contentEncoded)
    }
  }, [data?.contentEncoded, editor])

  return (
    <article className="max-w-full w-full flex flex-col items-center">
      {/* Header Section */}
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-6">
        {loading ? (
          <Skeleton className="h-16 w-3/4 mb-4" />
        ) : (
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {data?.title || 'Article Title'}
          </h1>
        )}

        {loading ? (
          <div className="flex items-center space-x-4 mb-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-32" />
          </div>
        ) : (
          <div className="flex items-center text-sm text-gray-600 mb-6">
            <span className="mr-4">{data?.authorId || 'Author Name'}</span>
            <span>{data?.pubDate ? new Date(data.pubDate).toLocaleDateString() : 'Publication Date'}</span>
          </div>
        )}
      </div>

      {/* Cover Image */}
      <div className="w-full h-[300px] md:h-[400px] lg:h-[500px] relative mb-8">
        {loading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <AppImage
            src={data?.coverImage || '/placeholder-image.jpg'}
            alt={data?.title || 'Article Title'}
            className="object-cover w-full h-[30rem]"
            priority
          />
        )}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        {loading ? (
          <div className="space-y-4 mb-8">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
          </div>
        ) : (
          <div className="prose prose-lg max-w-none mb-8">
            {editor && <EditorContent editor={editor} className="prose max-w-none" />}
          </div>
        )}

        {/* Tags */}
        {loading ? (
          <div className="flex flex-wrap gap-2 mb-8">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 mb-8">
            {(data?.tags || ['News', 'Article']).map((tag, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                <Tag className="h-3.5 w-3.5 mr-1.5" />
                {typeof tag === 'string' ? tag : tag.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

export default ViewNews
