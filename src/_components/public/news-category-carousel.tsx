"use client"

import React from 'react'
import FullWidthAternateTitle from '@/_components/public/core/section-title/full-width-alternate-title'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import { NewsItemType } from '@/types/public'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import NewsWithDescription from './core/news-component/news-with-description'

interface NewsCategoryCarouselProps {
    title: string
    items: NewsItemType[]
}

/**
 * NewsCategoryCarousel component displays a full-width alternate title for a news category
 * and a carousel of news items.
 * @param {NewsCategoryCarouselProps} props - The props for the component.
 * @param {string} props.title - The title of the news category.
 * @param {Array} props.items - The list of news items to display in the carousel.
 */
export const NewsCategoryCarousel = ({ title, items }: NewsCategoryCarouselProps) => {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  }

  /**
   * CustomButtonGroup component for carousel navigation.
   */
  const CustomButtonGroup = ({ next, previous }: { next?: () => void; previous?: () => void }) => {
    return (
      <div className="absolute top-1/2 mt-4 transform -translate-y-1/2 w-full flex justify-between z-20">
        <button onClick={previous} className="text-white">
          <div className="bg-[#116427]/50 hover:bg-[#116427] rounded-full p-4 text-white flex items-center justify-center shadow-md transition-colors duration-300">
            <ChevronLeft />
          </div>
        </button>
        <button onClick={next} className="text-white">
          <div className="bg-[#116427] hover:bg-[#116427] rounded-full p-4 text-white flex items-center justify-center shadow-md transition-colors duration-300">
            <ChevronRight />
          </div>
        </button>
      </div>
    );
  };

  return (
    <div className="mt-6 flex flex-col gap-8 relative">
      <FullWidthAternateTitle title={title} />
      <Carousel
        responsive={responsive}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={3000}
        arrows={false}
        renderButtonGroupOutside={true}
        customButtonGroup={<CustomButtonGroup />}
        itemClass="flex h-full pl-4"
      >
        {items?.map(item => (
            <div className="h-full flex items-stretch" key={item.id} >
              <NewsWithDescription  newsItem={item} allowMargin/>
            </div>
        ))}
      </Carousel>
    </div>
  )
}
