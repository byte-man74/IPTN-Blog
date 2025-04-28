import { useQueryClient } from '@tanstack/react-query'
import { routes } from '@/network/route'
import { useAppMutation } from '@/network/client.constructor'
import { PollQueryKey } from '@/network/query-keys/polls'
import { CreatePollDTO, PollDTO } from '@/app/(server)/modules/polls/poll.types'

/**
 * Hook for creating a new poll
 * @returns Mutation object for creating polls
 */
export function useCreatePoll() {
  const queryClient = useQueryClient()

  return useAppMutation<PollDTO, unknown, CreatePollDTO>({
    apiRoute: routes.polls.create,
    method: 'POST',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PollQueryKey.POLLS_ALL] })
    },
  })
}

/**
 * Hook for updating an existing poll
 * @param id - The ID of the poll to update
 * @returns Mutation object for updating polls
 */
export function useUpdatePoll(id: string) {
  const queryClient = useQueryClient()

  return useAppMutation<PollDTO, unknown, Partial<CreatePollDTO>>({
    apiRoute: routes.polls.update(id),
    method: 'PATCH',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PollQueryKey.POLLS_ALL] })
      queryClient.invalidateQueries({ queryKey: [PollQueryKey.POLL_DETAILS, id] })
    },
  })
}

/**
 * Hook for deleting a poll
 * @param id - The ID of the poll to delete
 * @returns Mutation object for deleting polls
 */
export function useDeletePoll(id: string) {
  const queryClient = useQueryClient()

  return useAppMutation<void, unknown, string>({
    apiRoute: routes.polls.delete(id),
    method: 'DELETE',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PollQueryKey.POLLS_ALL] })
      queryClient.invalidateQueries({ queryKey: [PollQueryKey.POLL_DETAILS, id] })
    },
  })
}

/**
 * Hook for voting on a poll
 * @param id - The ID of the poll to vote on
 * @returns Mutation object for voting on polls
 */
export function useVoteOnPoll(id: number) {
  const queryClient = useQueryClient()

  //convert int id to string
  const idStr = id ? id.toString() : ''

  return useAppMutation<PollDTO, unknown, { optionId: number }>({
    apiRoute: routes.polls.vote(idStr),
    method: 'POST',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PollQueryKey.POLLS_ALL] })
      queryClient.invalidateQueries({ queryKey: [PollQueryKey.POLL_DETAILS, id] })
      queryClient.invalidateQueries({ queryKey: [PollQueryKey.POLL_VOTES, id] })
    },
  })
}

/**
 * Hook for removing a vote from a poll
 * @param id - The ID of the poll to remove vote from
 * @returns Mutation object for removing votes
 */
export function useRemoveVote(id: string) {
  const queryClient = useQueryClient()

  return useAppMutation<PollDTO>({
    apiRoute: routes.polls.removeVote(id),
    method: 'DELETE',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PollQueryKey.POLLS_ALL] })
      queryClient.invalidateQueries({ queryKey: [PollQueryKey.POLL_DETAILS, id] })
      queryClient.invalidateQueries({ queryKey: [PollQueryKey.POLL_VOTES, id] })
    },
  })
}
