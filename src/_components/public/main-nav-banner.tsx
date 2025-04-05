import React from 'react'
import { AppImage } from '@/_components/global/app-image'
import { AppLogo } from '@/_components/global/app-logo'
import AdvertismentBox from '@/_components/public/core/advertisment'

/**
 * Primary navigation banner for the public pages
 *
 * A fully responsive component that displays the main navigation banner with logo and advertisement.
 * Adapts to different screen sizes with appropriate spacing, sizing, and layout adjustments.
 * Features smooth transitions between breakpoints and optimized visual hierarchy.
 *
 * @returns {JSX.Element} The rendered MainNavBanner component
 */
const MainNavBanner = () => {
  return (
    <div className="relative bg-primaryGreen w-full h-auto py-3 sm:py-4 md:py-5 lg:py-6 flex justify-center items-center shadow-md transition-all duration-300">
        {/* navigation background layer */}
        <AppImage
          alt="banner nav layer"
          src="/assets/nav-layer.svg"
          opacity={0.28}
          className="absolute w-full h-full object-cover left-0 top-0 z-0"
        />

        {/* logo and navigation content */}
        <div className="flex flex-col sm:flex-row px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 w-full max-w-[1920px] items-center justify-between gap-3 sm:gap-4 md:gap-6 relative z-10">
            <div className="transform-gpu transition-transform duration-300 hover:scale-105 w-full sm:w-auto flex justify-center sm:justify-start">
                <AppLogo />
            </div>
            <div className="transform-gpu transition-all duration-300 w-full sm:w-auto flex justify-center sm:justify-end">
                {AdvertismentBox ? <AdvertismentBox /> : <div className="h-16 sm:h-20 md:h-24 bg-opacity-20 rounded animate-pulse"></div>}
            </div>
        </div>
    </div>
  )
}

export default MainNavBanner
