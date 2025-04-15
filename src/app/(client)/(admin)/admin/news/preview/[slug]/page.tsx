import { PreviewPostComponent } from '@/_components/pages/admin-layout/admin-preview'
import React from 'react'
import { Metadata } from 'next'

type PreviewNewsProps = {
  params: { slug: string }
}

export async function generateMetadata({ params }: PreviewNewsProps): Promise<Metadata> {
  return {
    title: `Preview: ${params.slug}`,
  }
}

const PreviewNews = ({ params }: PreviewNewsProps) => {
  const { slug } = params

  return (
    <PreviewPostComponent slug={slug} />
  )
}

export default PreviewNews
