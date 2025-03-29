import { IconType } from 'react-icons';

export interface SocialMediaLinkType {
    name: string;
    url: string;
    icon: IconType;
  }

export interface HeroNavigationType {
    id: string;
    name: string;
    url: string;
    count?: number
  }


export interface NewsItemType {
    id: number;
    imageUrl: string;
    date: string;
    readTime?: string;
    category?: string;
    views?: number;
    comments?: number;
    title: string;
    slug: string;
    description?: string 
  }
