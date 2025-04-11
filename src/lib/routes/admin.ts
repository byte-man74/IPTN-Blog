export const AdminRoutes = {
    home: "/admin",
    categories: "/admin/categories",
    createNews: "/admin/news/create",
    news: "/admin/news",
    ads: "/admin/ads",
    editNews: (slug: string) => `/admin/news/edit/${slug}`,
    previewPost: (slug: string) => `/admin/news/preview/${slug}`,
    users: "/admin/users",
    analytics: "/admin/analytics",
    settings: "/admin/settings"
}
