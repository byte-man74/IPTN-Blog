"use client"


import React from 'react'
import { usePathname } from 'next/navigation'

import { HeroNavigationType } from '@/types/public'
import { AppLink } from '@/_components/global/app-link';

interface HeroNavItemProps {
  item: HeroNavigationType
}

const HeroNavItem = ({ item }: HeroNavItemProps) => {
  const pathname = usePathname();
  if (!item) return null;
  const isActive = pathname === (item?.url ?? '#');

  return (
    <div className={`h-full flex items-center px-8 ${
      isActive ? 'bg-primaryGreen' : ''
    }`}>
      <AppLink
        key={item.id}
        href={item.url ?? '#'}
        className="text-white hover:text-gray-300 transition-colors relative flex items-center"
      >
        {item?.name}
        {item?.count !== undefined && item?.count > 0 && (
          <span className="absolute -top-2 -right-4 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {item.count}
          </span>
        )}
      </AppLink>
    </div>
  )
}

export default HeroNavItem
