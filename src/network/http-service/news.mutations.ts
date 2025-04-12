import { useQueryClient } from '@tanstack/react-query'
import { routes } from '@/network/route'
import { CreateNewsDTO, FullNewsDTO, NewsDTO, UpdateNewsDTO } from '@/app/(server)/modules/news/news.types'
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


export function useUpdateNews(slug: string) {
  const queryClient = useQueryClient()

  return useAppMutation<FullNewsDTO, unknown, Partial<UpdateNewsDTO>>({
    apiRoute: routes.news.update(slug),
    method: 'PATCH',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NewsQueryKey.NEWS] })
      queryClient.invalidateQueries({ queryKey: [NewsQueryKey.NEWS_DETAILS] })
    },
  })
}
