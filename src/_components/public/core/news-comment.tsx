"use client"

import React, { useState } from 'react'
import { MessageCircle, Send, User } from 'lucide-react'
import { CommentDTO } from '@/app/(server)/modules/news/news.types'
import { useCreateComment } from '@/network/http-service/news.mutations'
import { Button } from '@/components/ui/button'
import { useSignIn } from '@/providers/signin-provider'
import { useSession } from 'next-auth/react'
import { AppImage } from '@/_components/global/app-image'


interface NewsCommentsProps {
  slug: string
  newsId: string
  initialComments: CommentDTO[]
}

export const NewsComments = ({ slug, newsId, initialComments}: NewsCommentsProps) => {
  const [comments, setComments] = useState<CommentDTO[]>(initialComments || [])
  const [newComment, setNewComment] = useState('')
  const createComment = useCreateComment(slug)
  const { openSignInModal } = useSignIn()
const { data: sessionData } = useSession();


console.log("comment data", comments)

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return



    createComment.mutate(
      {
        data: {
          content: newComment,
          newsId: newsId,
          isAnonymous: sessionData?.user ? false : true,
          userId: sessionData?.user.id,

        }
      },
      {
        onSuccess: (newCommentData: CommentDTO) => {
          setComments(prevComments => [newCommentData, ...prevComments])
          setNewComment('')
        },
      }
    )
  }

  // Generate a deterministic color based on the comment id
  const getAvatarColor = (id: number) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500',
      'bg-red-500', 'bg-orange-500', 'bg-teal-500'
    ]
    return colors[id % colors.length]
  }

  return (
    <div className="mt-8 md:mt-12 mb-8 md:mb-12 border-t pt-6 md:pt-8 bg-white p-6 shadow-sm">
      <div className="flex items-center mb-4 md:mb-6">
        <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-primaryGreen" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Comments ({comments.length})</h2>
      </div>

      {/* Comment Form */}
      {sessionData?.user ? (
        <form onSubmit={handleCommentSubmit} className="mb-6 md:mb-8">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center mb-2">
              {sessionData?.user.image ? (
                <AppImage
                  src={sessionData?.user.image}
                  alt={sessionData?.user.firstName || "User"}
                  className="w-8 h-8 rounded-full mr-2"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primaryGreen flex items-center justify-center text-white mr-2">
                  <User className="h-4 w-4" />
                </div>
              )}
              <span className="text-sm font-medium">{sessionData?.user.firstName || "Anonymous"} {sessionData?.user.lastName || "Anonymous"}</span>
            </div>
            <textarea
              className="w-full border border-gray-200 p-3 sm:p-4 focus:outline-none focus:ring-2 focus:ring-primaryGreen text-sm sm:text-base bg-gray-50"
              rows={3}
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={createComment.isPending}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={createComment.isPending || !newComment.trim()}
                className="flex items-center bg-primaryGreen text-white px-4 py-2 sm:px-5 sm:py-2.5 hover:bg-primaryGreen/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm sm:text-base font-medium"
              >
                <Send className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                {createComment.isPending ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-6 md:mb-8 p-4 sm:p-5 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-700 text-sm sm:text-base mb-3">
            Please sign in to join the conversation and share your thoughts.
          </p>
          <Button
            variant="default"
            className="bg-primaryGreen hover:bg-primaryGreen/90 text-white"
            onClick={openSignInModal}
          >
            Sign in to comment
          </Button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4 md:space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="border-b pb-4 md:pb-6">
              <div className="flex items-start">
                {comment.user?.image ? (
                  <AppImage
                    src={comment.user?.image}
                    alt={comment.user.firstName || "User"}
                    className="flex-shrink-0 rounded-full w-10 h-10 mr-3"
                  />
                ) : (
                  <div className={`flex-shrink-0 rounded-full w-10 h-10 flex items-center justify-center text-white font-medium mr-3 ${getAvatarColor(comment.id)}`}>
                    <User className="h-5 w-5" />
                  </div>
                )}
                <div className="flex-1 min-w-0 bg-gray-50 p-4">
                  <div className="flex flex-wrap justify-between items-center mb-2">
                    <span className="font-medium text-sm mr-2">{comment.user?.firstName|| "Anonymous"} {comment.user?.lastName|| "Anonymous"}</span>
                    <span className="text-xs text-gray-500">
                      {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Recently'}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm sm:text-base break-words">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 text-sm sm:text-base bg-gray-50">
            Be the first to comment on this article!
          </div>
        )}
      </div>
    </div>
  )
}
