"use client"

import React, { useState } from 'react'
import { HeroNavigationItems } from '@/lib/constants/public';
import HeroSearch from '@/_components/public/core/hero-search';
import HeroNavItem from '@/_components/public/core/hero-nav-item';
import { FiMenu, FiX } from 'react-icons/fi';

/**
 * Primary navigation container for the hero section
 *
 * A responsive navigation component that displays hero categories and search functionality.
 * Features:
 * - Desktop view maintains original styling with horizontal navigation
 * - Mobile view uses hamburger menu for navigation items
 * - Collapsible mobile menu with smooth transitions
 * - Fixed positioning with appropriate z-index for overlay behavior
 * - Preserves all desktop styling as in the original implementation
 */
const HeroNavigation = () => {
  // Perform nullish check for data from external source
  const navigationItems = HeroNavigationItems ?? [];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="w-full h-[4rem] bg-[#1E1E1E] flex items-center justify-between px-4 sm:px-24 sticky top-0 z-50">
      {/* Mobile hamburger menu button */}
      <div className="block sm:hidden">
        <button
          onClick={toggleMobileMenu}
          className="text-white p-2"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Desktop navigation */}
      <div className="hidden sm:flex items-center gap-6 h-full">
        {navigationItems.map((item) => (
          <HeroNavItem item={item} key={item.id}/>
        ))}
      </div>

      {/* Mobile navigation dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-[4rem] left-0 w-full bg-[#1E1E1E] z-500 sm:hidden border-t border-gray-800">
          <div className="flex flex-col py-2">
            {navigationItems.map((item) => (
              <div className="px-4 py-2" key={item.id}>
                <HeroNavItem item={item} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search component - visible on both mobile and desktop */}
      <div className="flex items-center">
        <HeroSearch />
      </div>
    </div>
  )
}

export default HeroNavigation
