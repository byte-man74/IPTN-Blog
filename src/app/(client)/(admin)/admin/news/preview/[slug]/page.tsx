import { PreviewPostComponent } from '@/_components/pages/admin-layout/admin-preview'
import React from 'react'

type Params = Promise<{ slug: string }>

export default async function PreviewNews(props: { params: Promise<Params> }) {
  const params = await props.params;
  const slug = params.slug;

  return (
    <PreviewPostComponent slug={slug} />
  )
}
