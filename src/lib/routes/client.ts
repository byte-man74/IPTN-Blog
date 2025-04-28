export const ClientRoutes = {
    home: "/",
    viewNews: (slug: string) => `news/${slug}`,
    explore: "/explore",
    contact: "/contact"
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
        return 'Read News or Article';
    }

    // Handle explore page
    if (pathName === ClientRoutes.explore) {
        return 'Explore Page';
    }


    if (pathName === ClientRoutes.contact) {
        return 'Contact Page';
    }

    // Handle dynamic routes with slugs
    if (pathName.startsWith('/')) {
        const segments = pathName.split('/').filter(Boolean);
        if (segments.length > 0) {
            // Convert slug to title case and append "Page"
            const slug = segments[segments.length - 1];
            const formattedSlug = slug
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            return `${formattedSlug} Page`;
        }
    }

    // Handle other pages
    return "Unidentified Page";
}
