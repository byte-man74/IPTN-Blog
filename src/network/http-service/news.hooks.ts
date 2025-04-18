import {
  NewsDTO,
  NewsFilterDTO,
  NewsCategoryDTO,
  TagDTO,
  FullNewsDTO,
} from '@/app/(server)/modules/news/news.types'
import { useAppQuery, useAppQueryWithPaginationAndParams } from '../client.constructor'
import { routes } from '@/network/route'
import { PageNumberCounters, PageNumberPagination } from 'prisma-extension-pagination/dist/types'
import { NewsQueryKey } from '@/network/query-keys/news'

export function useFetchNews(params?: NewsFilterDTO, page?: number, limit?: number) {
  const queryParams = params
    ? {
        ...params,
        categoryIds: params.categoryIds?.length ? params.categoryIds.join(',') : undefined,
        tagIds: params.tagIds?.length ? params.tagIds.join(',') : undefined,
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

export function useFetchCategories() {
  return useAppQuery<NewsCategoryDTO[]>({
    queryKey: [NewsQueryKey.CATEGORIES],
    apiRoute: routes.news.categories,
  })
}

export function useFetchTags() {
  return useAppQuery<TagDTO[]>({
    queryKey: [NewsQueryKey.TAGS],
    apiRoute: routes.news.tags,
  })
}

export function useFetchNewsDetail(slug: string) {
  return useAppQuery<FullNewsDTO>({
    queryKey: [NewsQueryKey.NEWS_DETAILS, slug],
    apiRoute: routes.news.detail(slug),
  })
}
