'use client'

import React from 'react'
import { ChevronLeft, Share2 } from 'lucide-react'

/**
 * ArticleNav component provides navigation for article pages
 * with back button, home link, and share functionality
 */
const ArticleNav = () => {
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: document.title,
          url: window.location.href,
        })
        .catch((error) => console.error('Error sharing:', error))
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch((error) => console.error('Error copying link:', error))
    }
  }

  return (
    <nav className="w-full px-16 sticky top-0 z-[9999] py-4 mb-2 flex items-center justify-between bg-[#1E1E1E] ">
      <div className="flex items-center gap-6">
        <div
          onClick={() => window.history.back()}
          className="flex items-center text-base text-white cursor-pointer"
        >
          <div className="bg-primaryGreen text-white rounded-full p-4 mr-2">
            <ChevronLeft className="h-4 w-4 text-white" />
          </div>
          Back
        </div>
      </div>

      <div
        onClick={handleShare}
        className="flex items-center text-base border border-primaryGreen text-white hover:bg-primaryGreen/10 px-4 py-2 rounded-md cursor-pointer"
      >
        <Share2 className="h-5 w-5 mr-2" />
        Share
      </div>
    </nav>
  )
}

export default ArticleNav
