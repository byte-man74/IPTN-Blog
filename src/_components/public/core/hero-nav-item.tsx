"use client"


import React from 'react'
import { usePathname } from 'next/navigation'


import { AppLink } from '@/_components/global/app-link';
import { NewsCategoryDTO } from '@/app/(server)/modules/news/news.types';

import { capitalizeString } from '@/app/(server)/modules/site-configurations/site-config.utils';

interface HeroNavItemProps {
  item: NewsCategoryDTO
}

const HeroNavItem = ({ item }: HeroNavItemProps) => {
  const pathname = usePathname();


  if (!item) return null;
    const isActive = pathname === `/${item.slug || '#'}`;

  return (
    <div className={`h-full flex items-center px-8 ${
      isActive ? 'bg-primaryGreen' : ''
    }`}>
      <AppLink
        key={item.id}
        href={item.slug ?? '#'}
        className="text-white hover:text-gray-300 transition-colors relative flex items-center"
      >
        {capitalizeString(item?.name as string)}
        {/* {item?.count !== undefined && item?.count > 0 && (
          <span className="absolute -top-2 -right-4 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {item.count}
          </span>
        )} */}
      </AppLink>
    </div>
  )
}

export default HeroNavItem
