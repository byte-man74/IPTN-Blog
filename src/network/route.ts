export const routes = {
  news: {
    list: '/news',
    detail: (slug: string) => `/news/${slug}`,
    create: '/api/news',
    update: (id: string) => `/news/${id}`,
    delete: (id: string) => `/api/news/${id}`,
    categories: '/news/categories',
    tags: '/news/tags'
  },
  users: {
    list: '/api/users',
    detail: (id: string) => `/api/users/${id}`,
    update: (id: string) => `/api/users/${id}`
  }
}
