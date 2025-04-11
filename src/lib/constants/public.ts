import { SocialMediaLinkType } from '@/types/public'
import { FiYoutube, FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi'

/**
 * Array of social media links used throughout the application
 *
 * Contains information about each social platform including:
 * - name: Display name of the social media platform
 * - url: Link to the social media profile
 * - icon: React icon component from react-icons/fi
 *
 * @type {SocialMediaLinkType[]}
 */
export const SocialMediaLinks: SocialMediaLinkType[] = [
  {
    name: 'YouTube',
    url: 'https://youtube.com',
    icon: FiYoutube,
  },
  {
    name: 'Facebook',
    url: 'https://facebook.com',
    icon: FiFacebook,
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com',
    icon: FiInstagram,
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com',
    icon: FiTwitter,
  },
]

/**
 * Hero navigation items for the main navigation bar
 *
 * Contains information about each navigation item including:
 * - id: Unique identifier for the item
 * - name: Display name of the navigation item
 * - url: Link to the corresponding page
 * - count: Optional count of news items (if applicable)
 *
 * @type {HeroNavigationType[]}
 */
export const HeroNavigationItems = [
  {
    id: 'home',
    name: 'Home',
    url: '/',
  },
  {
    id: 'news',
    name: 'News',
    url: '/news',
    count: 5,
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    url: '/entertainment',
    count: 3,
  },
  {
    id: 'articles',
    name: 'Articles',
    url: '/articles',
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    url: '/lifestyle',
  },
  {
    id: 'about-us',
    name: 'About Us',
    url: '/about-us',
  },
  {
    id: 'contact-us',
    name: 'Contact Us',
    url: '/contact-us',
  },
]

/**
 * Popular tags for the hero section
 *
 * Contains information about each tag including:
 * - id: Unique identifier for the tag
 * - name: Display name of the tag
 * - url: Link to the corresponding category page
 *
 * @type {Array<{id: number, name: string, url: string}>}
 */
export const PopularTags = [
  { id: 1, name: 'Politics', url: '/category/politics' },
  { id: 2, name: 'Business', url: '/category/business' },
  { id: 3, name: 'Technology', url: '/category/technology' },
  { id: 4, name: 'Health', url: '/category/health' },
  { id: 5, name: 'Entertainment', url: '/category/entertainment' },
  { id: 6, name: 'Sports', url: '/category/sports' },
]



export interface OldData {
    id: string
    title: string
    slug: string
    date: Date
    content: string
    categories: string[]
    tags: string[]
    status: string
    cover_image: string
  }

export const data: OldData[] = [
    {
      id: '1',
      title: 'Sample News Article',
      slug: 'sample-news-article',
      date: new Date('2023-01-01'),
      content: 'This is a sample news article content.',
      categories: ['Technology', 'News'],
      tags: ['sample', 'mock'],
      status: 'published',
      cover_image: '/images/sample-cover.jpg'
    }
  ]
