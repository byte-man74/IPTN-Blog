import { CategoryCriteria, ContentCriteria } from './site-config.types'

export const CONTENT_CRITERIA: Record<string, ContentCriteria> = {
  editorsPick: {
    slug: 'editors-pick',
    name: "Editor's Picks",
    threshold: 3,
    requiresFresh: true,
    severity: 'warning',
  },
  featured: {
    slug: 'featured',
    name: 'Featured News',
    threshold: 4,
    requiresFresh: true,
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
    name: 'Video News',
    threshold: 4,
    severity: 'warning',
  },
  topNews: {
    slug: 'top-news',
    name: 'Top News',
    threshold: 1,
    requiresFresh: true,
    severity: 'warning',
  },
  topPicks: {
    slug: 'top-picks',
    name: 'Top Picks',
    threshold: 1,
    maxThreshold: 4,
    requiresFresh: true,
    severity: 'warning',
  },
  secondCategoryFeatured: {
    slug: 'featured',
    name: 'Featured News',
    threshold: 2,
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
    name: 'Featured News',
    threshold: 5,
    severity: 'warning',
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

export const CATEGORY_CRITERIA: CategoryCriteria[] = [
  {
    // Home page (index 0)
    index: 0,
    name: 'Home Page',
    criteria: [
      CONTENT_CRITERIA.editorsPick,
      CONTENT_CRITERIA.featured,
      CONTENT_CRITERIA.breaking,
      CONTENT_CRITERIA.trending,
      CONTENT_CRITERIA.video,
    ],
  },
  {
    // Second category (index 1)
    index: 1,
    name: 'Second Category',
    criteria: [
      CONTENT_CRITERIA.secondCategoryFeatured,
      CONTENT_CRITERIA.secondCategoryTrending,
      CONTENT_CRITERIA.topNews,
    ],
  },
  {
    // Third category (index 2)
    index: 2,
    name: 'Third Category',
    criteria: [CONTENT_CRITERIA.thirdCategoryTrending, CONTENT_CRITERIA.topPicks],
  },
  {
    // Fourth category (index 3)
    index: 3,
    name: 'Fourth Category',
    criteria: [{ ...CONTENT_CRITERIA.featured, threshold: 1 }, CONTENT_CRITERIA.topPicks],
  },
  {
    // Fifth category (index 4)
    index: 4,
    name: 'Fifth Category',
    criteria: [CONTENT_CRITERIA.fifthCategoryFeatured],
  },
]

export const CONTENT_FRESHNESS_DAYS = 7
