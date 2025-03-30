import { AppImage } from '@/_components/global/app-image'
import { AppLink } from '@/_components/global/app-link'
import { dummyBasicNewsData } from '@/lib/constants/pre-data'
import React from 'react'

const BasicNewsTitleAndImage = () => {
  return (
    <div className="w-full flex flex-col min-h-10 gap-4">
        <AppImage alt={dummyBasicNewsData[0].title} src={dummyBasicNewsData[0].imageUrl} className='w-full h-[20rem]' />
        <AppLink href={dummyBasicNewsData[0].slug} className="text-[22px] font-semibold">{dummyBasicNewsData[0].title}</AppLink>
    </div>
  )
}

export default BasicNewsTitleAndImage
