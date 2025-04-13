import { useAppQuery } from '@/network/client.constructor'
import { AnalyticsQueryKeys } from '@/network/query-keys/analytics'
import { routes } from '@/network/route'
import {
  AnalyticsPopularNewsDTO,
  AnalyticsSummaryDTO,
} from '@/app/(server)/modules/analytics/analytics.types'

/**
 * Hook for fetching analytics summary
 * @returns Query result with analytics summary data
 */
export function useFetchAnalyticsSummary() {
  return useAppQuery<AnalyticsSummaryDTO>({
    queryKey: [AnalyticsQueryKeys.ANALYTICS_SUMMARY],
    apiRoute: routes.analytics.summary,
  })
}

/**
 * Hook for fetching popular news
 * @returns Query result with popular news data
 */
export function useFetchPopularNews() {
  return useAppQuery<AnalyticsPopularNewsDTO[]>({
    queryKey: [AnalyticsQueryKeys.POPULAR],
    apiRoute: routes.analytics.popular,
  })
}
