import React from 'react'
import { ModifyPostComponent } from '@/_components/pages/admin-layout/admin-modify-news'



const UpdateNews = ({ params }: { params: { slug: string } }) => {
  const { slug } = params

  return (
    <ModifyPostComponent slug={slug} />
  )
}

export default UpdateNews
