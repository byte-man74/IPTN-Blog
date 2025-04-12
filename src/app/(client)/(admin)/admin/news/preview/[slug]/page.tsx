import { PreviewPostComponent } from '@/_components/pages/admin-layout/admin-preview'
import React from 'react'




const PreviewNews =async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params

  return (
    <PreviewPostComponent slug={slug} />
  )
}

export default PreviewNews
