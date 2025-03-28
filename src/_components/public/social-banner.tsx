import React from 'react'
import { SocialMediaLinks } from '@/lib/constants/public'
import { AppLink } from '@/_components/global/app-link';


const GlobalSocialBanner = () => {
  return (
    <div className='flex justify-end items-center py-4 w-full bg-primaryDark px-x-md md:px-x-lg lg:px-x-xl xl:px-x-2xl '>
      <div className='flex gap-4'>
        {SocialMediaLinks && SocialMediaLinks.map((socialLink, index) => (
          <AppLink
            key={index}
            href={socialLink?.url ?? '#'}
            className='text-textColor hover:text-primaryGreen'
            ariaLabel={socialLink?.name}
            icon={socialLink?.icon}
            iconSize={20}
          >
            <span className="sr-only">{socialLink?.name ?? ''}</span>
          </AppLink>
        ))}
      </div>
    </div>
  )
}

export default GlobalSocialBanner
