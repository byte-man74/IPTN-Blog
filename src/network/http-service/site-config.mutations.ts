import {
  SiteConfigNavDTO,
  SiteConfigurationDTO,
} from '@/app/(server)/modules/site-configurations/site-config.types'
import { useAppMutation } from '@/network/client.constructor'
import { SiteConfigQueryKey } from '@/network/query-keys/site-config'
import { routes } from '@/network/route'
import { useQueryClient } from '@tanstack/react-query'

/**
 * Hook for initializing site configuration
 * @returns Mutation for initializing site configuration
 */
export function useInitializeSiteConfig() {
  const queryClient = useQueryClient()

  return useAppMutation<SiteConfigurationDTO, unknown, undefined>({
    apiRoute: routes.siteConfig.initialize,
    method: 'POST',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SiteConfigQueryKey.SITE_CONFIG] })
    },
  })
}

/**
 * Hook for updating site navigation configuration
 * @returns Mutation for updating site navigation
 */
export function useUpdateNavigation() {
  const queryClient = useQueryClient()

  return useAppMutation<SiteConfigurationDTO, unknown, SiteConfigNavDTO>({
    apiRoute: routes.siteConfig.navigation,
    method: 'PATCH',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SiteConfigQueryKey.SITE_CONFIG] })
    },
  })
}
