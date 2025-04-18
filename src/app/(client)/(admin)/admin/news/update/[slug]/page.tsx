import { ModifyPostComponent } from '@/_components/pages/admin-layout/admin-modify-news'
import React from 'react'

type Params = Promise<{ slug: string }>

export default async function UpdateNews(props: { params: Params }) {
  const params = await props.params;
  const slug = params.slug;

  return (
    <ModifyPostComponent slug={slug} />
  )
}
