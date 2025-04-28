"use client"

import React, { useState } from 'react'
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

export const GlobalPoll = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { data: pollsData, isLoading } = useFetchActivePolls()
  const {
    currentPoll,
    selectedPollIndex,
    selectedOption,
    isSubmitting,
    setSelectedOption,
    handleVote,
    navigatePoll,
    isUserLoggedIn
  } = usePollActions(pollsData)

  // Only render the poll component if there are active polls
  if (!pollsData || pollsData.length === 0 || isLoading) {
    return null
  }


  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
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
                navigatePoll={navigatePoll}
                isUserLoggedIn={isUserLoggedIn}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
