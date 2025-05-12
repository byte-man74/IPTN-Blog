import { AppLogoBlack } from '@/_components/global/app-logo-black'
import React, { Suspense } from 'react'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-[100dvh] flex items-center justify-center">
          <AppLogoBlack className='w-[20rem]'/>
        </div>
      }
    >
      {children}
    </Suspense>
  )
}
