import React from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { PollDTO } from '@/app/(server)/modules/polls/poll.types'
import { useSignIn } from '@/providers/signin-provider'



interface PollCardProps {
  currentPoll?: PollDTO;
  pollsData: PollDTO[];
  selectedPollIndex: number;
  selectedOption: number | null;
  setSelectedOption: (value: number) => void;
  handleVote: () => Promise<void>;
  navigatePoll: (direction: 'next' | 'prev') => void;
  isUserLoggedIn: boolean;
}

export const PollCard: React.FC<PollCardProps> = ({
  currentPoll,
  pollsData,
  selectedPollIndex,
  selectedOption,
  setSelectedOption,
  handleVote,
  navigatePoll,
  isUserLoggedIn
}) => {
  const { openSignInModal } = useSignIn();

  return (
    <Card className="w-full max-w-[30rem] mx-auto border-2 border-muted shadow-md">
      <CardHeader className="bg-muted/30 pb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium bg-primaryGreen/10 text-primaryGreen px-2 py-1 rounded-full">
            Poll {selectedPollIndex + 1} of {pollsData.length}
          </span>
          {currentPoll?.options?.some(option => option.votes !== undefined) && (
            <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              Results visible
            </span>
          )}
        </div>
        <CardTitle className="text-lg sm:text-xl font-bold">{currentPoll?.title}</CardTitle>
        <CardDescription className="text-sm mt-2">{currentPoll?.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
        <RadioGroup
          value={selectedOption?.toString()}
          onValueChange={(value) => setSelectedOption(parseInt(value))}
          className="space-y-3 sm:space-y-4"
        >
          {currentPoll?.options?.map((option) => (
            <div
              key={option.id}
              className="flex items-center space-x-3 p-2 sm:p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <RadioGroupItem
                value={option.id?.toString() || ''}
                id={`option-${option.id}`}
                className="text-primaryGreen"
              />
              <Label htmlFor={`option-${option.id}`} className="cursor-pointer flex-1 font-medium text-sm sm:text-base">
                {option.text}
                {option.votes !== undefined && (
                  <span className="ml-2 text-xs sm:text-sm text-muted-foreground font-normal">
                    ({option?.votes.length} votes)
                  </span>
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {!isUserLoggedIn && (
          <div className="mt-4 sm:mt-6 p-2 sm:p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-xs sm:text-sm">
            Please <Button variant="link" className="p-0 h-auto text-amber-700 underline text-xs sm:text-sm" onClick={openSignInModal}>sign in</Button> to vote on this poll
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-3 sm:gap-4 pt-2 pb-4 px-3 sm:px-6">
        <Button
          onClick={isUserLoggedIn ? handleVote : openSignInModal}
          disabled={selectedOption === null && isUserLoggedIn}
          className="w-full bg-primaryGreen hover:bg-primaryGreen/90 text-sm sm:text-base"
        >
          {isUserLoggedIn ? 'Submit Vote' : 'Sign in to Vote'}
        </Button>

        <div className="flex justify-between w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigatePoll('prev')}
            disabled={selectedPollIndex === 0}
            className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3"
          >
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" /> Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigatePoll('next')}
            disabled={selectedPollIndex === pollsData.length - 1}
            className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3"
          >
            Next <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
