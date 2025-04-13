import { SiteConfigurationDTO } from '@/app/(server)/modules/site-configurations/site-config.types'
import { useAppQuery } from '@/network/client.constructor'
import { routes } from '@/network/route'
import { SiteConfigQueryKey } from '@/network/query-keys/site-config'

/**
 * Hook for fetching site configuration
 * @returns Query result with site configuration data
 */
export function useFetchSiteConfig() {
  return useAppQuery<SiteConfigurationDTO>({
    queryKey: [SiteConfigQueryKey.SITE_CONFIG],
    apiRoute: routes.siteConfig.get,
  })
}
