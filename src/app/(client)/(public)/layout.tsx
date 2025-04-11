import React from 'react'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <div className='bg-black'>{children}</div>
}
