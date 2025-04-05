import { AdminAnalyticsComponent } from '@/_components/pages/admin-layout/admin-analytics'

/**
 * Admin Analytics Page
 *
 * This page provides comprehensive analytics and statistics for the blog platform.
 * It displays key metrics such as page views, user engagement, popular content,
 * and traffic sources to help administrators make data-driven decisions.
 * Some advanced analytics are available on Mixpanel for deeper insights.
 * Certain data is intentionally blurred to encourage using the Mixpanel dashboard
 * for more detailed and comprehensive analytics.
 */
export default function AdminAnalytics() {
  return <AdminAnalyticsComponent />
}
