import React from 'react'
import { AppImage } from '@/_components/global/app-image'
import { AppLogo } from '@/_components/global/app-logo'
import AdvertismentBox from '@/_components/public/core/advertisment'


/**
 * Primary navigation banner for the public pages that would be shared across public pages
 */
const MainNavBanner = () => {
  return (
    <div className="relative bg-primaryGreen w-full h-[10rem] flex justify-center items-center">
        {/* navigation background layer */}
        <AppImage alt="banner nav layer" src="/assets/nav-layer.svg" opacity={0.28} className="absolute w-auto left-0 top-0 h-full z-1"/>


        {/* logo and navigation content */}
        <div className="flex px-x-md md:px-x-lg lg:px-x-xl xl:px-x-2xl w-full items-center justify-between relative">
            <AppLogo />
            <AdvertismentBox />
        </div>
    </div>
  )
}

export default MainNavBanner
