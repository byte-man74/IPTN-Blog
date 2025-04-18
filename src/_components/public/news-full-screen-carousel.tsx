"use client"

import React from 'react'
import FullWidthAlternateTitle from '@/_components/public/core/section-title/full-width-alternate-title'
import 'react-multi-carousel/lib/styles.css'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import NewsWithDescription from '@/_components/public/core/news-component/news-with-description'
import Carousel from 'react-multi-carousel'
import NewsFullScreen from '@/_components/public/core/news-component/news-fullscreen'
import { NewsDTO } from '@/app/(server)/modules/news/news.types'

interface CarouselItemComponentType {
    itemType: "news-fullscreen"
}

interface NewsFullScreenCarouselProps {
    title: string
    items?: NewsDTO[]
    carouselItem: CarouselItemComponentType
    isLoading?: boolean
}

/**
 * NewsFullScreenCarousel component displays a full-width alternate title for a news category
 * and a full-screen carousel of news items.
 * @param {NewsFullScreenCarouselProps} props - The props for the component.
 * @param {string} props.title - The title of the news category.
 * @param {Array} props.items - The list of news items to display in the carousel.
 * @param {boolean} props.isLoading - Whether the data is currently loading.
 * @param {Object} props.carouselItem - Configuration for the carousel item type.
 */
export const NewsFullScreenCarousel = ({ title, items = [], carouselItem, isLoading = false }: NewsFullScreenCarouselProps) => {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
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
      <div className="absolute top-1/2 mt-10 transform -translate-y-1/2 w-full flex justify-between z-20">
        <button onClick={previous} className="text-white opacity-0">
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

  /**
   * Determine the component to use for rendering each carousel item based on the carouselItem type.
   * If carouselItem is "news-overlay", render OverlayedNewsImage; if "with-description", render NewsWithDescription.
   */
  const ItemComponent = carouselItem.itemType === "news-fullscreen" ? NewsFullScreen : NewsWithDescription;

  if (isLoading) {
    return (
      <div className="mt-6 flex flex-col gap-8 relative">
        <FullWidthAlternateTitle title={title} />
        <div className="h-96 w-full bg-gray-200 animate-pulse rounded-lg"></div>
      </div>
    )
  }

  return (
    <div className="mt-6 flex flex-col gap-8 relative">
      <FullWidthAlternateTitle title={title} />
      <Carousel
        responsive={responsive}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={3000}
        arrows={false}
        renderButtonGroupOutside={true}
        customButtonGroup={<CustomButtonGroup />}
        itemClass="flex relative h-full pl-0"
        sliderClass="h-full"
        containerClass="h-full"
      >
        {items.map(item => (
            <div className="h-full w-full flex items-stretch overflow-hidden" key={item.id} >
              <ItemComponent newsItem={item} />
            </div>
        ))}
      </Carousel>
    </div>
  )
}
