export const AdminRoutes = {
    home: "/admin",
    categories: "/admin/categories",
    createNews: "/admin/news/create",
    updateNews: (slug: string) => `/admin/news/update/${slug}`,
    news: "/admin/news",
    ads: "/admin/ads",
    previewPost: (slug: string) => `/admin/news/preview/${slug}`,
    users: "/admin/users",
    analytics: "/admin/analytics",
    settings: "/admin/settings"
}
