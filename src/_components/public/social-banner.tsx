import React from 'react'
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'
import { AppLink } from '@/_components/global/app-link'
import { CompanyData } from '@/lib/constants/company-data'

/**
 * GlobalSocialBanner Component
 *
 * A responsive component for public pages that displays social media links.
 * Adapts to different screen sizes with appropriate spacing and icon sizing.
 */
const GlobalSocialBanner = () => {
  const socialLinks = [
    { name: 'Facebook', url: CompanyData.FacebookLink, icon: Facebook },
    { name: 'Instagram', url: CompanyData.InstagramLink, icon: Instagram },
    { name: 'Twitter', url: CompanyData.TwitterLink, icon: Twitter },
    { name: 'Youtube', url: CompanyData.YoutubeLink, icon: Youtube },
  ];

  return (
    <div className='flex justify-end items-center py-2 sm:py-3 md:py-4 w-full bg-primaryDark px-4 sm:px-x-md md:px-x-lg lg:px-x-xl xl:px-x-2xl'>
      <div className='flex flex-wrap gap-2 sm:gap-3 md:gap-4'>
        {socialLinks.map((socialLink, index) => (
          <AppLink
            key={index}
            href={socialLink.url}
            className='text-textColor hover:text-primaryGreen transition-colors duration-200'
            ariaLabel={socialLink.name}
            icon={socialLink.icon}
            iconSize={16}
          >
            <span className="sr-only">{socialLink.name}</span>
          </AppLink>
        ))}
      </div>
    </div>
  )
}

export default GlobalSocialBanner
