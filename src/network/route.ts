export const routes = {
  news: {
    list: '/news',
    detail: (slug: string) => `/news/${slug}`,
    create: '/news',
    update: (id: string) => `/news/${id}`,
    delete: (id: string) => `/news/${id}`,
    categories: '/news/categories',
    tags: '/news/tags'
  },
  users: {
    list: '/api/users',
    detail: (id: string) => `/users/${id}`,
    update: (id: string) => `/users/${id}`
  }
}
