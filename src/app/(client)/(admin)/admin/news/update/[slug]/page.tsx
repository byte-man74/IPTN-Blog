import React from 'react'
import { ModifyPostComponent } from '@/_components/pages/admin-layout/admin-modify-news'



const UpdateNews = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params

  return (
    <ModifyPostComponent slug={slug} />
  )
}

export default UpdateNews
