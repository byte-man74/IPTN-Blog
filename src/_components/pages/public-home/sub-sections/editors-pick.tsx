import BasicNewsWithTag from '@/_components/public/core/news-component/basic-news-with-tag'
import OverlayedNewsImage from '@/_components/public/core/news-component/overlayed-news-image'
import BasicTitle from '@/_components/public/core/section-title/basic-title'
import { dummyNewsData, dummyBasicNewsData } from '@/lib/constants/pre-data'
import React from 'react'

/**
 * EditorsPick component
 *
 * This component displays editor's selected news items in a responsive layout.
 * Features:
 * - Full width on mobile devices, 30% width on larger screens
 * - Displays a featured news item with overlay
 * - Shows a row of basic news items below the featured item
 * - Responsive layout adapts to different screen sizes
 */
const EditorsPick = () => {
  // Perform nullish check for data coming from external source
  const featuredNewsItem = dummyNewsData ?? {};
  const basicNewsItems = dummyBasicNewsData ?? [];

  return (
    <div className="w-full sm:w-[30%] min-h-full flex flex-col justify-between">
      <BasicTitle title="Editor's pick" />
      <OverlayedNewsImage newsItem={featuredNewsItem} />

      <div className="flex mt-3 flex-row gap-3 justify-between">
        {basicNewsItems.length > 0 &&
          basicNewsItems.map((news, index) => (
            <BasicNewsWithTag key={index} newsContent={news} />
          ))}
      </div>
    </div>
  )
}

export default EditorsPick
