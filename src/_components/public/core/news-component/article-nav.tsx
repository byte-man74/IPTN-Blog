'use client'

import React, { useState } from 'react'
import { ChevronLeft, Share2, Twitter, Facebook, Linkedin, Link2, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { logger } from '@/lib/utils/logger'
import { useMixpanel } from '@/lib/third-party/mixpanel/context'
import { MixpanelActions } from '@/lib/third-party/mixpanel/events'

/**
 * ArticleNav component provides navigation for article pages
 * with back button, home link, and share functionality
 */
const ArticleNav = () => {
  const [open, setOpen] = useState(false)
  const { trackEvent } = useMixpanel()


  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(document.title)}&url=${encodeURIComponent(window.location.href)}`
    trackEvent({
        eventName: MixpanelActions.SHARED_CONTENT,
        properties: {
            platform: "twitter"
        }
    })
    window.open(url, '_blank')
    setOpen(false)
  }

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`
    trackEvent({
        eventName: MixpanelActions.SHARED_CONTENT,
        properties: {
            platform: "facebook"
        }
    })
    window.open(url, '_blank')
    setOpen(false)
  }

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`
    trackEvent({
        eventName: MixpanelActions.SHARED_CONTENT,
        properties: {
            platform: "linkedin"
        }
    })
    window.open(url, '_blank')
    setOpen(false)
  }

  const copyToClipboard = () => {
    trackEvent({
        eventName: MixpanelActions.SHARED_CONTENT,
        properties: {
            platform: "copied-link"
        }
    })
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        alert('Link copied to clipboard!')
        setOpen(false)
      })
      .catch((error) => logger.error('Error copying link:', error))
  }

  return (
    <nav className="w-full px-4 sm:px-8 md:px-16 sticky top-0 z-[9999] py-3 sm:py-4 mb-2 flex items-center justify-between bg-[#1E1E1E]">
      <div className="flex items-center">
        <div
          onClick={() => window.history.back()}
          className="flex items-center text-sm sm:text-base text-white cursor-pointer"
        >
          <div className="bg-primaryGreen text-white rounded-full p-2 sm:p-3 md:p-4 mr-1 sm:mr-2">
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
          </div>
          <span className="hidden xs:inline">Back</span>
        </div>
      </div>

      <div className="relative">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center text-xs sm:text-sm md:text-base border border-primaryGreen text-white hover:bg-primaryGreen/10 px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-md cursor-pointer"
            >
              <Share2 className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Share</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="bg-white rounded-t-xl border-t-4 border-primaryGreen shadow-lg">
            <SheetHeader className="pb-4 border-b border-gray-100">
              <SheetTitle className="text-xl sm:text-2xl font-bold text-gray-800">Share this article</SheetTitle>
              <SheetDescription className="text-sm sm:text-base text-gray-600">
                Choose a platform to share this article
              </SheetDescription>
            </SheetHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 py-4 sm:py-6 px-2">
              <Button
                onClick={shareToTwitter}
                variant="outline"
                className="flex items-center justify-start w-full px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg border-gray-200"
              >
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-blue-500" />
                Share on Twitter
              </Button>
              <Button
                onClick={shareToFacebook}
                variant="outline"
                className="flex items-center justify-start w-full px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm hover:bg-blue-100 hover:text-blue-800 transition-colors rounded-lg border-gray-200"
              >
                <Facebook className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-blue-700" />
                Share on Facebook
              </Button>
              <Button
                onClick={shareToLinkedIn}
                variant="outline"
                className="flex items-center justify-start w-full px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors rounded-lg border-gray-200"
              >
                <Linkedin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-blue-600" />
                Share on LinkedIn
              </Button>
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="flex items-center justify-start w-full px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm hover:bg-gray-50 hover:text-gray-800 transition-colors rounded-lg border-gray-200"
              >
                <Link2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-gray-600" />
                Copy Link
              </Button>
            </div>
            <div className="pt-2 flex justify-center">
              <Button
                onClick={() => setOpen(false)}
                variant="ghost"
                className="text-gray-500 hover:text-gray-800 text-xs sm:text-sm"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Close
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}

export default ArticleNav
