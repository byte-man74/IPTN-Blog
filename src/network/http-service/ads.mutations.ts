import { useAppMutation } from '@/network/client.constructor'
import { routes } from '@/network/route'


/**
 * Hook for creating a new ad
 * @returns Mutation function for creating an ad
 */
export function useCreateAd() {
    return useAppMutation({
      apiRoute: routes.ads.create,
      method: 'POST',
    })
  }

  /**
   * Hook for updating an existing ad
   * @param id - The ID of the ad to update
   * @returns Mutation function for updating the ad
   */
  export function useUpdateAd(id: string) {
    return useAppMutation({
      apiRoute: routes.ads.update(id),
      method: 'PATCH',
    })
  }

  /**
   * Hook for deleting an ad
   * @param id - The ID of the ad to delete
   * @returns Mutation function for deleting the ad
   */
  export function useDeleteAd(id: string) {
    return useAppMutation({
      apiRoute: routes.ads.delete(id),
      method: 'DELETE',
    })
  }
