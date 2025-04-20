'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Tag, Clock, MessageCircle, Send } from 'lucide-react'
import { useFetchNewsDetail } from '@/network/http-service/news.hooks'
import { Skeleton } from '@/_components/global/skeleton'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { default as TipTapImage } from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import { AppImage } from '@/_components/global/app-image'
import { useIncrementNewsMetric } from '@/network/http-service/analytics.mutations'
import { cleanUpNewsTitle } from '@/app/(server)/modules/news/news.utils';


// Define comment interface to avoid using 'any'
interface Comment {
  id: string
  author: string
  content: string
  date: string
  avatar?: string
}

interface RelatedArticle {
  id: string
  title: string
  excerpt: string
  coverImage: string
  slug: string
  readDuration: string
}

/**
 * ViewNews component displays a news article in a Medium-style layout
 * with a full-width cover image and properly formatted content.
 */
const ViewNews = ({ slug }: { slug: string }) => {
  const { data, isLoading: isNewsLoading } = useFetchNewsDetail(slug)
  const [loading, setLoading] = useState(isNewsLoading)
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const incrementMetric = useIncrementNewsMetric(slug, data?.id)
  const hasIncrementedView = useRef(false)

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

  useEffect(() => {
    // Update loading state when data is fetched
    setLoading(isNewsLoading)
  }, [isNewsLoading])

  useEffect(() => {
    if (editor && data?.contentEncoded) {
      editor.commands.setContent(data.contentEncoded)
    }
  }, [data?.contentEncoded, editor])

  useEffect(() => {
    if (data?.id && !hasIncrementedView.current) {
      const viewedNews = JSON.parse(sessionStorage.getItem('viewedNews') || '{}')
      if (!viewedNews[slug]) {
        incrementMetric.mutate({
          data: { metricType: 'views' }
        })
        hasIncrementedView.current = true
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.id, slug])


  useEffect(() => {
    // Fetch related articles based on tags or categories when data is loaded
    if (data && !loading) {
      // This is a placeholder - in a real implementation, you would fetch related articles
      // based on the current article's tags or categories
      setRelatedArticles([
        {
          id: '1',
          title: 'Related Article 1',
          excerpt: 'A brief description of the related article content...',
          coverImage: '/placeholder-image.jpg',
          slug: 'related-article-1',
          readDuration: '5 min read'
        },
        {
          id: '2',
          title: 'Related Article 2',
          excerpt: 'Another interesting article you might enjoy reading...',
          coverImage: '/placeholder-image.jpg',
          slug: 'related-article-2',
          readDuration: '3 min read'
        },
        {
          id: '3',
          title: 'Related Article 3',
          excerpt: 'More content related to this topic you might find useful...',
          coverImage: '/placeholder-image.jpg',
          slug: 'related-article-3',
          readDuration: '7 min read'
        }
      ])

      // Fetch comments for this article
      // This is a placeholder - in a real implementation, you would fetch comments from an API
      setComments([
        {
          id: '1',
          author: 'Jane Smith',
          content: 'This article was very informative. Thanks for sharing!',
          date: '2 days ago',
          avatar: '/avatars/avatar-1.jpg'
        },
        {
          id: '2',
          author: 'John Doe',
          content: 'I have a question about the third point you made. Could you elaborate more on that?',
          date: '1 day ago',
          avatar: '/avatars/avatar-2.jpg'
        }
      ])
    }
  }, [data, loading])

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmittingComment(true)

    // Simulate API call to post comment
    setTimeout(() => {
      const newCommentObj: Comment = {
        id: `comment-${Date.now()}`,
        author: 'Current User', // In a real app, get from auth context
        content: newComment,
        date: 'Just now',
        avatar: '/avatars/current-user.jpg'
      }

      setComments(prevComments => [newCommentObj, ...prevComments])
      setNewComment('')
      setIsSubmittingComment(false)
    }, 500)
  }

  return (
    <article className="max-w-full w-full flex flex-col items-center">
      {/* Header Section */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6">
        {loading ? (
          <Skeleton className="h-12 md:h-16 w-full md:w-3/4 mb-3 md:mb-4" />
        ) : (
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight">
            {cleanUpNewsTitle(data?.title ?? "") || 'Article Title'}
          </h1>
        )}

        {loading ? (
          <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-4 md:mb-6">
            <Skeleton className="h-5 md:h-6 w-24 md:w-32" />
            <Skeleton className="h-5 md:h-6 w-24 md:w-32" />
          </div>
        ) : (
          <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-600 mb-4 md:mb-6 gap-3 md:gap-4">
            <span>{data?.authorId || 'The media team'}</span>
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
        {loading ? (
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
        {loading ? (
          <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
            <Skeleton className="h-5 md:h-6 w-full" />
            <Skeleton className="h-5 md:h-6 w-full" />
            <Skeleton className="h-5 md:h-6 w-3/4" />
            <Skeleton className="h-5 md:h-6 w-full" />
            <Skeleton className="h-5 md:h-6 w-5/6" />
          </div>
        ) : (
          <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none mb-6 md:mb-8 font-tiro-devanagari">
            {editor && <EditorContent editor={editor} className="prose max-w-none font-tiro-devanagari" />}
          </div>
        )}

        {/* Tags */}
        {loading ? (
          <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
            <Skeleton className="h-7 w-16 md:h-8 md:w-20" />
            <Skeleton className="h-7 w-20 md:h-8 md:w-24" />
            <Skeleton className="h-7 w-14 md:h-8 md:w-16" />
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
            {(data?.tags || ['News', 'Article']).map((tag, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-100 text-gray-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
              >
                <Tag className="h-3 w-3 mr-1 sm:h-3.5 sm:w-3.5 sm:mr-1.5" />
                {typeof tag === 'string' ? tag : tag.name}
              </div>
            ))}
          </div>
        )}

        {/* Comments Section */}
        {!loading && (
          <div className="mt-8 md:mt-12 mb-8 md:mb-12 border-t pt-6 md:pt-8">
            <div className="flex items-center mb-4 md:mb-6">
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-gray-700" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Comments ({comments.length})</h2>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-6 md:mb-8">
              <div className="flex flex-col space-y-3">
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-primaryGreen text-sm sm:text-base"
                  rows={3}
                  placeholder="Share your thoughts..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={isSubmittingComment}
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmittingComment || !newComment.trim()}
                    className="flex items-center bg-primaryGreen text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-primaryGreen/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                    {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4 md:space-y-6">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="border-b pb-4 md:pb-6">
                    <div className="flex items-start">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-200 overflow-hidden mr-2 sm:mr-3 flex-shrink-0">
                        {comment.avatar ? (
                          <AppImage
                            src={comment.avatar}
                            alt={comment.author}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-500">
                            {comment.author.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap justify-between items-center mb-1">
                          <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate mr-2">{comment.author}</h4>
                          <span className="text-xs text-gray-500">{comment.date}</span>
                        </div>
                        <p className="text-gray-700 text-sm sm:text-base break-words">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 md:py-8 text-gray-500 text-sm sm:text-base">
                  Be the first to comment on this article!
                </div>
              )}
            </div>
          </div>
        )}

        {/* You May Also Like Section */}
        {!loading && (
          <div className="mt-8 md:mt-12 mb-10 md:mb-16">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 md:mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {relatedArticles.map((article) => (
                <div key={article.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-36 sm:h-40 md:h-48 relative">
                    <AppImage
                      src={article.coverImage}
                      alt={article.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="font-semibold text-base sm:text-lg mb-1.5 sm:mb-2 line-clamp-2">{article.title}</h3>
                    <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-3">{article.excerpt}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                        {article.readDuration}
                      </span>
                      <a
                        href={`/news/${article.slug}`}
                        className="text-primaryGreen text-xs sm:text-sm font-medium hover:underline"
                      >
                        Read More
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}

export default ViewNews
