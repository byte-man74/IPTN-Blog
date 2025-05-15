"use client"

import React, { useState, useEffect } from 'react'
import HeroSearch from '@/_components/public/core/hero-search';
import HeroNavItem from '@/_components/public/core/hero-nav-item';
import { FiMenu, FiX } from 'react-icons/fi';
import { useFetchSiteConfig } from '@/network/http-service/site-config.hooks';
import { AppLink } from '@/_components/global/app-link';
import { usePathname } from 'next/navigation';
import { ClientRoutes } from '@/lib/routes/client';

/**
 * Primary navigation component for the hero section
 * Displays categories and search functionality with responsive design
 */
const HeroNavigation = () => {
  const { data: siteConfig, isLoading } = useFetchSiteConfig();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigationItems = siteConfig?.navBarKeyCategories || [];
  const isHomePage = pathname === '/' || pathname === '';

  // Close mobile menu on page navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Render loading placeholders
  const renderSkeletons = (count = 5) => {
    return Array(count).fill(0).map((_, index) => (
      <div key={`skeleton-${index}`} className="h-6 w-20 bg-gray-700 animate-pulse rounded"></div>
    ));
  };

  // Handle mobile menu item click
  const handleMobileItemClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="w-full h-[4rem] bg-[#1E1E1E] flex items-center justify-between px-4 sm:px-24 sticky top-0 z-50">
      {/* Mobile menu button */}
      <div className="block sm:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white p-2"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Desktop navigation */}
      <div className="hidden sm:flex items-center gap-6 h-full">
        {/* Home link */}
        <div className={`h-full flex items-center px-8 ${isHomePage ? 'bg-primaryGreen' : ''}`}>
          <AppLink
            href="/"
            className="text-white hover:text-gray-300 transition-colors relative flex items-center"
          >
            Home
          </AppLink>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-6">{renderSkeletons()}</div>
        ) : (
          navigationItems.map((item) => (
            <HeroNavItem item={item} key={item.id.toString()}/>
          ))
        )}

        {/* Contact Us link */}
        <div className={`h-full flex items-center px-8`}>
          <AppLink
            href="/contact"
            className="text-white hover:text-gray-300 transition-colors relative flex items-center"
          >
            Contact Us
          </AppLink>
        </div>
      </div>

      {/* Mobile navigation dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-[4rem] left-0 w-full bg-[#1E1E1E] z-500 sm:hidden border-t border-gray-800">
          <div className="flex flex-col py-2">
            <div className="px-4 py-2">
              <AppLink
                href="/"
                className={`text-white hover:text-gray-300 transition-colors ${isHomePage ? 'font-bold' : ''}`}
                onClick={handleMobileItemClick}
              >
                Home
              </AppLink>
            </div>

            {isLoading ? (
              <div className="flex flex-col gap-2 px-4 py-2">
                {renderSkeletons(4).map((skeleton, index) => (
                  <div key={`mobile-skeleton-${index}`} className="py-1">{skeleton}</div>
                ))}
              </div>
            ) : (
              navigationItems.map((item) => (
                <div className="px-4 py-2" key={item.id.toString()} onClick={handleMobileItemClick}>
                  <HeroNavItem item={item} />
                </div>
              ))
            )}

            {/* Contact Us link in mobile menu */}
            <div className="px-4 py-2">
              <AppLink
                href={ClientRoutes.contact}
                className={`text-white hover:text-gray-300 transition-colors`}
                onClick={handleMobileItemClick}
              >
                Contact Us
              </AppLink>
            </div>
          </div>
        </div>
      )}

      {/* Search component */}
      <div className="flex items-center">
        <HeroSearch />
      </div>
    </div>
  )
}

export default HeroNavigation
