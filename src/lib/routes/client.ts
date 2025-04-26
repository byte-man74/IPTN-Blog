export const ClientRoutes = {
    home: "/",
    viewNews: (slug: string) => `news/${slug}`,
    explore: "/explore"
}
/**
 * Returns a user-friendly page name based on the current path
 * Used for analytics tracking and UI display
 * @param pathName The current path from usePathname()
 * @returns A readable page name
 */
export const getPageName = (pathName: string): string => {
    // Handle home page
    if (pathName === ClientRoutes.home) {
        return 'Home Page';
    }

    // Handle news article pages
    if (pathName.includes('/news/')) {
        return 'News Article Page';
    }

    // Handle explore page
    if (pathName === ClientRoutes.explore) {
        return 'Explore Page';
    }

    // Handle other pages
    return "Unidentified Page";
}
