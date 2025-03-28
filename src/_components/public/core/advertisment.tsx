import { AppImage } from '@/_components/global/app-image'
import React from 'react'

/**
 * this would later be a client component that may throw a bunch of use effect here. but it would be that users who are visiting the web page maybe for the second time can see that its an ad space on the wwbsite and if they want they can see it
 *
 * TODO: ill add some form of logic or control here later with session maybe so i can track stuffs
 */
const AdvertismentBox = () => {
  return (
    <AppImage alt="ads space" src='/assets/ads.svg' className='w-[80%] h-auto'/>
  )
}

export default AdvertismentBox
