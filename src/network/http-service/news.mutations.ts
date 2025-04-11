import { useQueryClient } from '@tanstack/react-query'
import { routes } from '@/network/route'
import { CreateNewsDTO, NewsDTO } from '@/app/(server)/modules/news/news.types'
import { NewsQueryKey } from '@/network/query-keys/news'
import { useAppMutation } from '../client.constructor'

/**
 * Hook for creating a new news item
 * @returns Mutation object for creating news
 */
export function useCreateNews() {
  const queryClient = useQueryClient()

  return useAppMutation<NewsDTO, unknown, CreateNewsDTO>({
    apiRoute: routes.news.list,
    method: 'POST',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NewsQueryKey.NEWS] })
    },
  })
}
