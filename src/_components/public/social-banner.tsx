import React from 'react'
import { SocialMediaLinks } from '@/lib/constants/public'
import { AppLink } from '@/_components/global/app-link';


/**
 * GlobalSocialBanner Component
 *
 * A responsive component for public pages that displays social media links.
 * Adapts to different screen sizes with appropriate spacing and icon sizing.
 */
const GlobalSocialBanner = () => {
  // Perform nullish check for data from external source
  const socialLinks = SocialMediaLinks ?? [];

  return (
    <div className='flex justify-end items-center py-2 sm:py-3 md:py-4 w-full bg-primaryDark px-4 sm:px-x-md md:px-x-lg lg:px-x-xl xl:px-x-2xl'>
      <div className='flex flex-wrap gap-2 sm:gap-3 md:gap-4'>
        {socialLinks.map((socialLink, index) => (
          <AppLink
            key={index}
            href={socialLink?.url ?? '#'}
            className='text-textColor hover:text-primaryGreen transition-colors duration-200'
            ariaLabel={socialLink?.name}
            icon={socialLink?.icon}
            iconSize={16}
          >
            <span className="sr-only">{socialLink?.name ?? ''}</span>
          </AppLink>
        ))}
      </div>
    </div>
  )
}

export default GlobalSocialBanner
