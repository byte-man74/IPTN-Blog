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
