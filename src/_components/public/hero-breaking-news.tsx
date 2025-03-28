import React from 'react'
import { FiCircle } from 'react-icons/fi'

export const HeroBreakingNews = () => {
  // Breaking news banner similar to the image
  return (
    <div className="w-full bg-gray-50 flex items-center h-[4rem]">
      <div className="font-bold px-10 py-1 mr-4 h-full bg-primaryGreen flex items-center text-white">
        <FiCircle className="mr-2 animate-pulse" size={20} />
        <span>Breaking News</span>
      </div>
      <div className="text-white overflow-hidden whitespace-nowrap">
        <div className="animate-marquee inline-block">
          Israel in Parliament as violence rises - Latest updates on the Middle East situation - New talks on ethnic divides
        </div>
      </div>
    </div>
  )
}
