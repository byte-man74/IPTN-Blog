import { useAppQuery } from '@/network/client.constructor'
import { AnalyticsQueryKeys } from '@/network/query-keys/analytics'
import { routes } from '@/network/route'
import { AnalyticsSummaryDTO } from '@/app/(server)/modules/analytics/analytics.types'

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
