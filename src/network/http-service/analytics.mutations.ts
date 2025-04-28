import { logger } from '@/lib/utils/logger'
import { useAppMutation } from '@/network/client.constructor'
import { routes } from '@/network/route'

/**
 * Hook for incrementing a news article metric (views, likes, shares)
 * @param slug The slug of the news article
 * @returns Mutation object for incrementing metrics
 */
export function useIncrementNewsMetric(slug?: string, id?: string) {

  return useAppMutation<void, unknown, { metricType: 'views' | 'likes' | 'shares' }>({
    apiRoute: routes.news.analytics(id as string),
    method: 'POST',
    options: {
      enabled: !!slug && !!id,
    },
    onSuccess: (_, variables) => {
      const { metricType } = variables.data
      if (metricType === 'views') {
        const viewedNews = JSON.parse(sessionStorage.getItem('viewedNews') || '{}')
        viewedNews[slug as string] = true
        sessionStorage.setItem('viewedNews', JSON.stringify(viewedNews))
      }
    },
    onError: (error) => {
      logger.error('Failed to increment metric:', error)
    },
  })
}


/**
 * Hook for saving user's Mixpanel identity
 * @param userId The ID of the user to save
 * @returns Mutation object for saving Mixpanel identity
 */
export function useSaveMixpanelIdentity() {
  return useAppMutation<{ success: boolean }, unknown, { userId: string }>({
    apiRoute: routes.analytics.saveMixpanelDetails,
    method: 'PATCH',
    onSuccess: () => {
      logger.info('Successfully saved Mixpanel identity')
    },
    onError: (error) => {
      logger.error('Failed to save Mixpanel identity:', error)
    },
  })
}
