import { logger } from '@/lib/utils/logger'
import { useAppMutation } from '../client.constructor'
import { routes } from '../route'

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
