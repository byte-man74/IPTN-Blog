import { useAppQuery } from '@/network/client.constructor'
import { UserQueryKeys } from '@/network/query-keys/user'
import { routes } from '@/network/route'
import { UserDTO } from '@/app/(server)/modules/user/user.types'

/**
 * Hook for fetching all users
 * @returns Query result with users data
 */
export function useFetchUsers() {
  return useAppQuery<UserDTO[]>({
    queryKey: [UserQueryKeys.USERS_LIST],
    apiRoute: routes.users.fetchAll,
  })
}
