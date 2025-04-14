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

/**
 * Hook for performing a simple health check on site content
 * This is a lightweight check that can be called frequently to determine if a full scan is needed
 * @returns Query result with information about whether a full health check is needed
 */
export function useSimpleSiteHealthCheck() {
  return useAppQuery<{ needsFullScan: boolean }>({
    queryKey: [SiteConfigQueryKey.SIMPLE_HEALTH_CHECK],
    apiRoute: routes.siteConfig.simpleHealthCheck,
  })
}
