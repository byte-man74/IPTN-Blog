"use client"


import React from 'react'
import FullWidthAlternateTitle from '@/_components/public/core/section-title/full-width-alternate-title'
import 'react-multi-carousel/lib/styles.css'
import { NewsItemType } from '@/types/public'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import NewsWithDescription from '@/_components/public/core/news-component/news-with-description'
import Carousel from 'react-multi-carousel'
import OverlayedNewsImage from '@/_components/public/core/news-component/overlayed-news-image'
import BasicNewsWithTagV2 from '@/_components/public/core/news-component/basic-news-with-tag-v2'
import OverlayedNewsImageV2 from '@/_components/public/core/news-component/overlayed-news-v2'


interface CarouselItemComponentType {
    itemType: "news-overlay" | "news-with-description" | "basic-news-with-tag-v2" | "overlay-v2"
}
interface NewsCategoryCarouselProps {
    title?: string
    items: NewsItemType[]
    carouselItem: CarouselItemComponentType
}

/**
 * NewsCategoryCarousel component displays a full-width alternate title for a news category
 * and a carousel of news items.
 * @param {NewsCategoryCarouselProps} props - The props for the component.
 * @param {string} props.title - The title of the news category.
 * @param {Array} props.items - The list of news items to display in the carousel.
 * @param {React.ComponentType} [props.CarouselItemComponent] - Optional custom component for rendering each carousel item.
/**
 * NewsCategoryCarousel component displays a full-width alternate title for a news category
 * and a carousel of news items.
 * @param {NewsCategoryCarouselProps} props - The props for the component.
 * @param {string} props.title - The title of the news category.
 * @param {Array} props.items - The list of news items to display in the carousel.
 * @param {CarouselItemComponentType} [props.carouselItem] - The type of carousel item to render.
 */
export const NewsCategoryCarousel = ({ title, items, carouselItem = { itemType: "news-with-description" } }: NewsCategoryCarouselProps) => {
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
   * If carouselItem is "full-video", render FullVideoComponent; if "with-description", render NewsWithDescription.
   */
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
    default:
      ItemComponent = NewsWithDescription;
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
        itemClass="flex relative h-full pl-4"
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
