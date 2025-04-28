import React from 'react'
import { Loader2 } from 'lucide-react'

export const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-60 gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primaryGreen" />
      <p className="text-muted-foreground">Submitting your vote...</p>
    </div>
  )
}
