import { UserDTO } from '@/app/(server)/modules/user/user.types'
import { useAppMutation } from '@/network/client.constructor'
import { routes } from '@/network/route'
import { useQueryClient } from '@tanstack/react-query'
import { UserQueryKeys } from '@/network/query-keys/user'

/**
 * Hook for updating user information
 * @returns Mutation for updating user information
 */
export function useUpdateUserInformation(id: string) {
  const queryClient = useQueryClient()

  return useAppMutation<UserDTO, unknown, Partial<UserDTO>>({
    apiRoute: routes.users.update(id),
    method: 'PATCH',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [UserQueryKeys.USERS_LIST] })
    },
  })
}
