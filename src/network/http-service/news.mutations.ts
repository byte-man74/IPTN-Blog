import { useQueryClient } from '@tanstack/react-query'
import { routes } from '@/network/route'
import { CreateNewsCategoryDTO, CreateNewsDTO, CreateTagDTO, FullNewsDTO, NewsCategoryDTO, NewsDTO, TagDTO, UpdateNewsDTO } from '@/app/(server)/modules/news/news.types'
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


/**
 * Hook for deleting a news item
 * @param slug The slug of the news item to delete
 * @returns Mutation object for deleting news
 */
export function useDeleteNews(slug: string) {
  const queryClient = useQueryClient()

  return useAppMutation<void, unknown, void>({
    apiRoute: routes.news.delete(slug),
    method: 'DELETE',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NewsQueryKey.NEWS] })
      queryClient.invalidateQueries({ queryKey: [NewsQueryKey.NEWS_DETAILS] })
    },
  })
}


export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useAppMutation<NewsCategoryDTO, unknown, CreateNewsCategoryDTO>({
    apiRoute: routes.news.categories,
    method: 'POST',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NewsQueryKey.CATEGORIES] })
    },
  })
}


export function useCreateTag() {
  const queryClient = useQueryClient()

  return useAppMutation<TagDTO, unknown, CreateTagDTO>({
    apiRoute: routes.news.tags,
    method: 'POST',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NewsQueryKey.TAGS] })
    },
  })
}
