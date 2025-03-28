"use client"

import React from 'react';
import { FiSearch } from 'react-icons/fi';
import { AppLink } from '@/_components/global/app-link';

/**
 * Hero Search component for the main navigation bar
 * Simple search icon that links to the search page
 */
const HeroSearch = () => {
  return (
    <div className="relative">
      <div className="flex items-center">
        <AppLink
          href="/search"
          className="flex items-center justify-center text-white"
          aria-label="Go to search page"
        >
          <FiSearch className="text-white" />
        </AppLink>
      </div>
    </div>
  );
};

export default HeroSearch;
