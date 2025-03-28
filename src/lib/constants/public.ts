import { SocialMediaLinkType } from '@/types/public';
import {
  FiYoutube,
  FiInstagram,
  FiFacebook,
  FiTwitter
} from 'react-icons/fi';

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
    name: "YouTube",
    url: "https://youtube.com",
    icon: FiYoutube,
  },
  {
    name: "Facebook",
    url: "https://facebook.com",
    icon: FiFacebook,
  },
  {
    name: "Instagram",
    url: "https://instagram.com",
    icon: FiInstagram,
  },
  {
    name: "Twitter",
    url: "https://twitter.com",
    icon: FiTwitter,
  },
];
