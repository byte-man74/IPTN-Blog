import { NewsDTO, NewsFilterDTO } from '@/app/(server)/modules/news/news.types'
import {
  useAppQuery,
  useAppMutation,
  useAppQueryWithPaginationAndParams,
} from '../client.constructor'
import { routes } from '@/network/route'
import { PageNumberCounters, PageNumberPagination } from 'prisma-extension-pagination/dist/types'
import { NewsQueryKey } from '@/network/query-keys/news'



export function useFetchNews(params?: NewsFilterDTO, page?: number, limit?: number) {
  const queryParams = params
    ? {
        ...params,
        categoryIds: params.categoryIds?.join(','),
        tagIds: params.tagIds?.join(','),
        startDate: params.startDate?.toISOString(),
        endDate: params.endDate?.toISOString(),
        page,
        limit,
      }
    : {}

  return useAppQueryWithPaginationAndParams<{
    data: NewsDTO[]
    meta: PageNumberPagination & PageNumberCounters
  }>({
    queryKey: [NewsQueryKey.NEWS, params, page, limit],
    apiRoute: routes.news.list,
    params: queryParams,
  })
}

// export function useFetchNewsDetail(slug: string) {
//   return useAppQuery<NewsItem>({
//     queryKey: ['news', slug],
//     apiRoute: routes.news.detail(slug),
//   });
// }

// export function useCreateNews() {
//   return useAppMutation<NewsItem, Error, Partial<NewsItem>>({
//     apiRoute: routes.news.create,
//     method: 'POST',
//   });
// }

// export function useUpdateNews(id: string) {
//   return useAppMutation<NewsItem, Error, Partial<NewsItem>>({
//     apiRoute: routes.news.update(id),
//     method: 'PUT',
//   });
// }

// export function useDeleteNews(id: string) {
//   return useAppMutation<void, Error, void>({
//     apiRoute: routes.news.delete(id),
//     method: 'DELETE',
//   });
// }
