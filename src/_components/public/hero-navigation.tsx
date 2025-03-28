import React from 'react'
import { HeroNavigationItems } from '@/lib/constants/public';
import HeroSearch from '@/_components/public/core/hero-search';
import HeroNavItem from '@/_components/public/core/hero-nav-item';

/**
 * Primary navigation container for the hero section. it would be responsible for fetching the hero categories and possibly cheking the status of news items active
 * - for example Entertainment if it has some news we should be able to see the number
 */
const HeroNavigation = () => {
  return (
    <div className="w-full h-[4rem] bg-[#1E1E1E] flex items-center justify-between px-24">
        <div className="flex items-center gap-6 h-full">
        {HeroNavigationItems && HeroNavigationItems.map((item) => (
            <HeroNavItem item={item} key={item.id}/>
        ))}
        </div>
        <HeroSearch />
      </div>
  )
}


export default HeroNavigation
