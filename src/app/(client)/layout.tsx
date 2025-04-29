import { AppLogo } from '@/_components/global/app-logo'
import React, { Suspense } from 'react'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-[100dvh] flex items-center justify-center">
          <AppLogo variant="white" width={500} />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}
