import React from 'react'

/**
 * Public Layout Component
 *
 * This component serves as the layout wrapper for all public-facing pages.
 * It provides consistent structure and styling for the public section of the website.
 */
const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-white">
      {children ?? <div>Loading...</div>}
    </div>
  )
}

export default PublicLayout
