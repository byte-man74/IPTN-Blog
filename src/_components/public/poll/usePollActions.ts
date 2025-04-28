import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'
import { useVoteOnPoll } from '@/network/http-service/polls.mutation'
import { logger } from '@/lib/utils/logger'
import { PollDTO } from '@/app/(server)/modules/polls/poll.types'
import { useMixpanel } from '@/lib/third-party/mixpanel/context'
import { MixpanelActions } from '@/lib/third-party/mixpanel/events'


export const usePollActions = (pollsData?: PollDTO[]) => {
  const [selectedPollIndex, setSelectedPollIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { data: session } = useSession()
  const { trackEvent } = useMixpanel()
  const currentPoll = pollsData?.[selectedPollIndex]


  const { mutateAsync } = useVoteOnPoll(currentPoll?.id as number)



  const handleVote = async () => {
    trackEvent({
        eventName: MixpanelActions.VOTED_ON_A_POLL,
        properties: {
            pollTitle: currentPoll?.title,
            optionText: currentPoll?.options?.find(opt => opt.id === selectedOption)?.text
        }
    })
    if (!selectedOption || !session?.user?.id || !currentPoll) {
      toast({
        title: "Error",
        description: "Please select an option or sign in to vote",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      await mutateAsync({
        data: {
          optionId: selectedOption
        },

      })

      toast({
        title: "Vote submitted",
        description: "Thank you for participating in our poll!",
      })

      // Reset selection after voting
      setSelectedOption(null)
    } catch (error) {
      logger.error("error voting for a poll", error)
      toast({
        title: "Error",
        description: "Failed to submit your vote. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const navigatePoll = (direction: 'next' | 'prev') => {
    if (direction === 'next' && selectedPollIndex < (pollsData?.length ?? 0) - 1) {
      setSelectedPollIndex(prev => prev + 1)
    } else if (direction === 'prev' && selectedPollIndex > 0) {
      setSelectedPollIndex(prev => prev - 1)
    }
    setSelectedOption(null)
  }

  return {
    currentPoll,
    selectedPollIndex,
    selectedOption,
    isSubmitting,
    setSelectedOption,
    handleVote,
    navigatePoll,
    isUserLoggedIn: !!session?.user
  }
}
