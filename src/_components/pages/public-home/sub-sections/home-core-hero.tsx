import EditorsPick from '@/_components/pages/public-home/sub-sections/editors-pick'
import MainContent from '@/_components/pages/public-home/sub-sections/main-content'
import TrendingNow from '@/_components/pages/public-home/sub-sections/trending-now'
import React from 'react'

/**
 * HomeCoreHero component
 *
 * This component serves as the main hero section of the home page.
 * It includes three main sections:
 * - EditorsPick: Displays the editor's pick articles.
 * - MainContent: Displays the main content of the home page.
 * - TrendingNow: Displays the currently trending articles.
 *
 * Responsive behavior:
 * - On mobile: Components stack vertically (top to bottom)
 * - On larger screens: Components display in a horizontal layout
 */
const HomeCoreHero = () => {
  return (
    <div className="flex flex-col sm:flex-row w-full justify-between gap-4 sm:gap-2 items-stretch">
      <EditorsPick />
      <MainContent />
      <TrendingNow />
    </div>
  )
}

export default HomeCoreHero
