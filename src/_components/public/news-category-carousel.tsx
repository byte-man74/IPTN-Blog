"use client"


import React from 'react'
import FullWidthAlternateTitle from '@/_components/public/core/section-title/full-width-alternate-title'
import 'react-multi-carousel/lib/styles.css'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import NewsWithDescription from '@/_components/public/core/news-component/news-with-description'
import Carousel from 'react-multi-carousel'
import OverlayedNewsImage from '@/_components/public/core/news-component/overlayed-news-image'
import BasicNewsWithTagV2 from '@/_components/public/core/news-component/basic-news-with-tag-v2'
import OverlayedNewsImageV2 from '@/_components/public/core/news-component/overlayed-news-v2'
import { NewsDTO } from '@/app/(server)/modules/news/news.types'
import ImagePreviewNews from './core/news-component/image-preview-news'


interface CarouselItemComponentType {
    itemType: "news-overlay" | "news-with-description" | "basic-news-with-tag-v2" | "overlay-v2" | "interview"
}
interface NewsCategoryCarouselProps {
    title?: string
    items?: NewsDTO[]
    isLoading?: boolean
    carouselItem: CarouselItemComponentType
}

/**
 * NewsCategoryCarousel component displays a full-width alternate title for a news category
 * and a carousel of news items.
 * @param {NewsCategoryCarouselProps} props - The props for the component.
 * @param {string} props.title - The title of the news category.
 * @param {Array} props.items - The list of news items to display in the carousel.
 * @param {boolean} props.isLoading - Whether the data is currently loading.
 * @param {CarouselItemComponentType} [props.carouselItem] - The type of carousel item to render.
 */
export const NewsCategoryCarousel = ({
  title,
  items,
  isLoading = false,
  carouselItem = { itemType: "news-with-description" }
}: NewsCategoryCarouselProps) => {
  /**
   * Get the number of items to display based on the item type.
   * @param {string} itemType - The type of the carousel item.
   * @returns {number} The number of items to display.
   */
  const getNumberOfItems = (itemType: string) => {
    switch (itemType) {
      case "basic-news-with-tag-v2":
        return { desktop: 2, tablet: 3, mobile: 1 };
    case "overlay-v2":
        return { desktop: 2, tablet: 3, mobile: 1 };
      case "news-overlay":
      case "news-with-description":
      case "news-interview":
      default:
        return { desktop: 4, tablet: 3, mobile: 1 };
    }
  };

  const numberOfItems = getNumberOfItems(carouselItem.itemType);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: numberOfItems.desktop,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: numberOfItems.tablet,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: numberOfItems.mobile,
    },
  };

  /**
   * CustomButtonGroup component for carousel navigation.
   */
  const CustomButtonGroup = ({ next, previous }: { next?: () => void; previous?: () => void }) => {
    return (
      <div className={`absolute top-1/2 ${carouselItem.itemType !== "basic-news-with-tag-v2" ? "mt-10" : ""} transform -translate-y-1/2 w-full flex justify-between z-20`}>
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

  /**
   * Determine the component to use for rendering each carousel item based on the carouselItem type.
   * Use a switch case to handle different item types.
   */
  let ItemComponent;
  switch (carouselItem?.itemType) {
    case "news-overlay":
      ItemComponent = OverlayedNewsImage;
      break;
    case "news-with-description":
      ItemComponent = NewsWithDescription;
      break;
    case "basic-news-with-tag-v2":
        ItemComponent = BasicNewsWithTagV2;
        break;
    case "overlay-v2":
        ItemComponent = OverlayedNewsImageV2;
        break
        case "interview":
        ItemComponent = ImagePreviewNews
        break
    default:
      ItemComponent = NewsWithDescription;
  }

  // Render skeleton loading state if data is loading
  if (isLoading) {
    return (
      <div className="mt-6 flex flex-col gap-8 relative">
        {title && <FullWidthAlternateTitle title={title} />}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(numberOfItems.desktop).fill(0).map((_, index) => (
            <div key={`skeleton-${index}`} className="h-64 bg-gray-200 animate-pulse rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-8 relative">
      {title && <FullWidthAlternateTitle title={title ?? "NA"} />}
      <Carousel
        responsive={responsive}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={3000}
        arrows={false}
        renderButtonGroupOutside={true}
        customButtonGroup={<CustomButtonGroup />}
        itemClass="flex relative h-full md:pl-4 pl-0"
      >
        {items?.map(item => (
            <div className="h-full w-full flex items-stretch overflow-hidden" key={item.id} >
              <ItemComponent newsItem={item} />
            </div>
        ))}
      </Carousel>
    </div>
  )
}
