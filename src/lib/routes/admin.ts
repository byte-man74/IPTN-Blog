export const AdminRoutes = {
    home: "/admin",
    configuration: "/admin/configuration",
    createNews: "/admin/news/create",
    updateNews: (slug: string) => `/admin/news/update/${slug}`,
    previewNews: (slug: string) => `/admin/news/preview/${slug}`,
    news: "/admin/news",
    ads: "/admin/ads",
    previewPost: (slug: string) => `/admin/news/preview/${slug}`,
    users: "/admin/users",
    adsManager: "/admin/ads",
    analytics: "/admin/analytics",
    settings: "/admin/settings"
}
