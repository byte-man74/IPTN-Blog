import { AdsDTO } from '@/app/(server)/modules/ads/ads.types';
import { useAppQuery } from '@/network/client.constructor'
import { routes } from '@/network/route'
import { AdsQueryKey } from '@/network/query-keys/ads';


/**
 * Hook for fetching all ads with optional filters
 * @param filters - Optional filters for ads (isActive, title, pageType)
 * @returns Query result with filtered ads data
 */
export function useFetchAds(filters?: { isActive?: boolean; title?: string; pageType?: string }) {
  const queryParams = new URLSearchParams()

  if (filters) {
    queryParams.append('filter', 'true')

    if (filters.isActive !== undefined) {
      queryParams.append('isActive', String(filters.isActive))
    }

    if (filters.title) {
      queryParams.append('title', filters.title)
    }

    if (filters.pageType) {
      queryParams.append('pageType', filters.pageType)
    }
  }

  return useAppQuery<AdsDTO[]>({
    queryKey: [AdsQueryKey.LIST, filters],
    apiRoute: `${routes.ads.list}?${queryParams.toString()}`,
  })
}

/**
 * Hook for fetching a single ad by ID
 * @param id - The ID of the ad to fetch
 * @returns Query result with the ad data
 */
export function useFetchAd(id: string) {
  return useAppQuery<AdsDTO>({
    queryKey: [AdsQueryKey.DETAILS, id],
    apiRoute: routes.ads.details(id),
  })
}
