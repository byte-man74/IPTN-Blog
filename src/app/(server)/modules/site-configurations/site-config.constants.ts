import { CategoryCriteria, ContentCriteria } from './site-config.types'

/**
 * Content criteria definitions for different content types across the site
 */
export const CONTENT_CRITERIA: Record<string, ContentCriteria> = {
  // Home page primary content types
  editorsPick: {
    slug: 'editors-picks',
    name: "Editor's Picks",
    threshold: 2,
    severity: 'warning',
  },
  interviews: {
    slug: 'interview',
    name: 'Interviews',
    threshold: 2,
    severity: 'warning',
  },
  featured: {
    slug: 'featured',
    name: 'Featured Articles',
    threshold: 10,
    severity: 'warning',
  },
  breaking: {
    slug: 'breaking',
    name: 'Breaking News',
    threshold: 3,
    requiresFresh: true,
    severity: 'error', // Breaking news is critical
  },
  trending: {
    slug: 'trending',
    name: 'Trending News',
    threshold: 3,
    requiresFresh: true,
    severity: 'warning',
  },
  video: {
    slug: 'video',
    name: 'Videos',
    threshold: 4,
    severity: 'warning',
  },
  topNews: {
    slug: 'top-news',
    name: 'Top News',
    threshold: 4,
    requiresFresh: true,
    severity: 'warning',
  },

  // Common content types
  topPicks: {
    slug: 'top-picks',
    name: 'Top Picks',
    threshold: 1,
    maxThreshold: 4,
    requiresFresh: true,
    severity: 'warning',
  },
  recommendedContent: {
    slug: 'recommended-content',
    name: 'Recommended Content',
    threshold: 1,
    maxThreshold: 10,
    requiresFresh: false,
    severity: 'healthy',
  },
  blogs: {
    slug: 'blog',
    name: 'Our Blogs',
    threshold: 1,
    requiresFresh: false,
    severity: 'warning',
  },
  politics: {
    slug: 'politics',
    name: 'Politics',
    threshold: 6,
    severity: 'warning',
  },
  sports: {
    slug: 'sports',
    name: 'Sports',
    threshold: 6,
    severity: 'warning',
  },
  diaspora: {
    slug: 'diaspora',
    name: 'Diaspora',
    threshold: 3,
    requiresFresh: true,
    severity: 'warning',
  },
  youMayHaveMissed: {
    slug: 'you-may-have-missed',
    name: 'You may have missed',
    threshold: 8,
    requiresFresh: false,
    severity: 'warning',
  },
  articles: {
    slug: 'articles',
    name: 'Articles',
    threshold: 3,
    requiresFresh: false,
    severity: 'warning',
  },
  fashion: {
    slug: 'fashion',
    name: 'Fashion',
    threshold: 8,
    requiresFresh: false,
    severity: 'warning',
  },
  movies: {
    slug: 'movie-top-ten',
    name: 'Movies Top 10',
    threshold: 8,
    requiresFresh: false,
    severity: 'warning',
  },
  // Category-specific content types with variations
  SecondCategoryPolitics: {
    slug: 'featured',
    name: 'Featured Articles',
    threshold: 2,
    maxThreshold: 8,
    requiresFresh: true,
    severity: 'warning',
  },
  secondCategoryTrending: {
    slug: 'trending',
    name: 'Trending News',
    threshold: 0,
    maxThreshold: 2,
    severity: 'warning',
  },
  thirdCategoryTrending: {
    slug: 'trending',
    name: 'Trending News',
    threshold: 6,
    severity: 'warning',
  },
  fifthCategoryFeatured: {
    slug: 'featured',
    name: 'Featured Articles',
    threshold: 5,
    severity: 'warning',
    requiresFresh: true,
  },

  // Generic content check
  anyContent: {
    slug: '',
    name: 'Content',
    threshold: 1,
    requiresFresh: true,
    severity: 'error',
  },
}

// Category names as constants for more stable references
export const HOME_PAGE = 'Home Page'
export const SECOND_CATEGORY = 'Second Category'
export const THIRD_CATEGORY = 'Third Category'
export const FOURTH_CATEGORY = 'Fourth Category'
export const FIFTH_CATEGORY = 'Fifth Category'

/**
 * Category criteria definitions for different page categories
 */
export const CATEGORY_CRITERIA: CategoryCriteria[] = [
  {
    // Home page (index 0)
    index: 0,
    name: HOME_PAGE,
    criteria: [
      CONTENT_CRITERIA.editorsPick,
      CONTENT_CRITERIA.featured,
      CONTENT_CRITERIA.articles,
      CONTENT_CRITERIA.breaking,
      CONTENT_CRITERIA.trending,
      CONTENT_CRITERIA.video,
      CONTENT_CRITERIA.interviews,
      CONTENT_CRITERIA.diaspora,
      CONTENT_CRITERIA.youMayHaveMissed,
    ],
  },
  {
    // Second category (index 1)
    index: 1,
    name: SECOND_CATEGORY,
    criteria: [
      { ...CONTENT_CRITERIA.featured, name: 'Featured News' },
      CONTENT_CRITERIA.secondCategoryTrending,
      CONTENT_CRITERIA.topNews,
      CONTENT_CRITERIA.politics,
      CONTENT_CRITERIA.sports,
    ],
  },
  {
    // Third category (index 2)
    index: 2,
    name: THIRD_CATEGORY,
    criteria: [{ ...CONTENT_CRITERIA.politics, threshold: 2 }, CONTENT_CRITERIA.featured],
  },
  {
    // Fourth category (index 3)
    index: 3,
    name: FOURTH_CATEGORY,
    criteria: [{ ...CONTENT_CRITERIA.featured, threshold: 1 }, CONTENT_CRITERIA.fashion],
  },
  {
    // Fifth category (index 4)
    index: 4,
    name: FIFTH_CATEGORY,
    criteria: [
      { ...CONTENT_CRITERIA.featured, threshold: 0 },
      CONTENT_CRITERIA.topPicks,
      CONTENT_CRITERIA.movies,
    ],
  },
]

// Helper functions for accessing content criteria
const getCategoryByName = (name: string): CategoryCriteria | undefined =>
  CATEGORY_CRITERIA.find((category) => category.name === name)

const getContentCriteriaBySlug = (
  category: CategoryCriteria,
  slug: string
): ContentCriteria | undefined => category.criteria.find((criteria) => criteria.slug === slug)

// Home page exports for easy access
export const HomePage = getCategoryByName(HOME_PAGE) as CategoryCriteria

// Export commonly used content criteria
export const HomePageBreakingNews = getContentCriteriaBySlug(
  HomePage,
  'breaking'
) as ContentCriteria
export const HomePageEditorsPick = getContentCriteriaBySlug(
  HomePage,
  'editors-picks'
) as ContentCriteria
export const HomePageWithVideos = getContentCriteriaBySlug(HomePage, 'video') as ContentCriteria
export const HomePageTrending = getContentCriteriaBySlug(HomePage, 'trending') as ContentCriteria
export const HomePageFeatured = getContentCriteriaBySlug(HomePage, 'featured') as ContentCriteria
export const HomePageDiaspora = CONTENT_CRITERIA.diaspora
export const HomePageYouMayHaveMissed = CONTENT_CRITERIA.youMayHaveMissed
export const HomePageArticles = getContentCriteriaBySlug(HomePage, 'articles') as ContentCriteria
export const HomePageInterviews = getContentCriteriaBySlug(HomePage, 'interview') as ContentCriteria

// Number of days content is considered "fresh"
export const CONTENT_FRESHNESS_DAYS = 7
export const DEFAULT_PAGE_NUMBER = 1

// Default site configuration order by content type
export const DEFAULT_SITE_CONFIG_ORDER = {
  contentTypes: [
    'news', // News content first
    'articles', // Articles second
    'lifestyle', // Lifestyle content third
    'entertainment', // Entertainment content fourth
  ],
}

export const ViewsThreshold = 500
