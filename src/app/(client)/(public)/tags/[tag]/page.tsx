import React from 'react'

type Params = Promise<{ tag: string }>

type TagPageProps = {
  params: Params
}

export default async function TagPage({ params }: TagPageProps) {
  const params_resolved = await params
  const tag = params_resolved.tag




  return (<div>TagPage</div>)
}
