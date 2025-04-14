export const routes = {
  news: {
    list: '/news',
    detail: (slug: string) => `/news/${slug}`,
    create: '/news',
    update: (id: string) => `/news/${id}`,
    delete: (id: string) => `/news/${id}`,
    categories: '/news/categories',
    tags: '/news/tags',
    analytics: (id: string) => `/news/internal/${id}/analytics`,
  },
  users: {
    list: '/users',
    detail: (id: string) => `/users/${id}`,
    update: (id: string) => `/users/${id}`,
    fetchAll: '/users/all',
  },
  analytics: {
    summary: '/analytics/summary',
    popular: '/analytics/popular',
  },
  siteConfig: {
    get: '/site-config',
    initialize: '/site-config/initialize',
    navigation: '/site-config/navigation',
    healthCheck: '/site-config/health-check',
    simpleHealthCheck: "/site-config/simple-health-check"
  },
}
