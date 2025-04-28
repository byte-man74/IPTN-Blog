"use client"

import React, { useState} from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useFetchActivePolls } from '@/network/http-service/polls.hooks'
import { PollTriggerButton } from './trigger'
import { PollCard } from './poll-card'
import { LoadingState } from './loading-state'
import { usePollActions } from './usePollActions'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useMixpanel } from '@/lib/third-party/mixpanel/context'
import { MixpanelActions } from '@/lib/third-party/mixpanel/events'


export const GlobalPoll = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { trackEvent } = useMixpanel()

  // Get poll state from URL params
  const pollOpenParam = searchParams.get('pollOpen')
  const pollIndexParam = searchParams.get('pollIndex')

  // Initialize state based on URL params
  const [isOpen, setIsOpen] = useState(pollOpenParam === 'true')
  const { data: pollsData, isLoading } = useFetchActivePolls()

  const {
    currentPoll,
    selectedPollIndex,
    selectedOption,
    isSubmitting,
    setSelectedOption,
    handleVote,
    isUserLoggedIn,
  } = usePollActions(pollsData, pollIndexParam ? parseInt(pollIndexParam) : undefined)

  // Handle opening/closing the poll sheet
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)

    if (!pollsData) return;

    // Create new URLSearchParams instance
    const newParams = new URLSearchParams(searchParams.toString())

    if (open) {
      newParams.set('pollOpen', 'true')
      newParams.set('pollIndex', selectedPollIndex.toString())

      // Track poll open event
      trackEvent({
        eventName: MixpanelActions.OPENED_POLL,
        properties: {
          pollTitle: currentPoll?.title,
          pollIndex: selectedPollIndex
        }
      })
    } else {
      newParams.delete('pollOpen')
      newParams.delete('pollIndex')
    }

    // Update URL without refreshing the page
    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false })
  }

  // Handle poll navigation
  const handleNavigatePoll = () => {
    if (pollsData) {
      const newParams = new URLSearchParams(searchParams.toString())
      newParams.set('pollIndex', selectedPollIndex.toString())

      // Update URL without refreshing the page
      router.replace(`${pathname}?${newParams.toString()}`, { scroll: false })
    }
  }

  // Only render the poll component if there are active polls
  if (!pollsData || pollsData.length === 0 || isLoading) {
    return null
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <PollTriggerButton />
        <SheetContent side="bottom" className="rounded-t-xl bg-white max-h-[80vh] overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle className="text-2xl font-bold text-center text-primaryGreen">Community Poll</SheetTitle>
          </SheetHeader>
          <div className="py-4 px-2">
            {isSubmitting ? (
              <LoadingState />
            ) : (
              <PollCard
                currentPoll={currentPoll}
                pollsData={pollsData}
                selectedPollIndex={selectedPollIndex}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
                handleVote={handleVote}
                navigatePoll={handleNavigatePoll}
                isUserLoggedIn={isUserLoggedIn}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
