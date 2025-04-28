import { useAppMutation } from '@/network/client.constructor'
import { routes } from '@/network/route'
import { toast } from '@/hooks/use-toast'

/**
 * Hook for creating a new ad
 * @returns Mutation function for creating an ad
 */
export function useCreateAd() {
    return useAppMutation({
      apiRoute: routes.ads.create,
      method: 'POST',
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Ad created successfully',
        })
      },
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
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Ad updated successfully',
        })
      },
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
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Ad deleted successfully',
        })
      },
    })
  }
