import { useAppQuery } from '@/network/client.constructor'
import { PollQueryKey } from '@/network/query-keys/polls'
import { routes } from '@/network/route'
import { PollDTO, PollWinnerDTO } from '@/app/(server)/modules/polls/poll.types'

/**
 * Hook for fetching all active polls
 * @returns Query for all active polls
 */
export function useGetActivePolls() {
  return useAppQuery<PollDTO[]>({
    queryKey: [PollQueryKey.POLLS],
    apiRoute: routes.polls.list,
  })
}

/**
 * Hook for fetching all polls for admin
 * @returns Query for all polls (admin only)
 */
export function useAdminPolls() {
  return useAppQuery<PollDTO[]>({
    queryKey: [PollQueryKey.POLLS, 'admin'],
    apiRoute: routes.polls.admin,
  })
}

/**
 * Hook for fetching the winner of a poll
 * @param id - The ID of the poll
 * @returns Query for the poll winner
 */
export function usePollWinner(id: string) {
  return useAppQuery<PollWinnerDTO>({
    queryKey: [PollQueryKey.POLL_WINNER, id],
    apiRoute: routes.polls.winner(id),
  })
}
