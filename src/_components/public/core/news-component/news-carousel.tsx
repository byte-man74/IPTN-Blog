"use client"

import React from "react";
import { Calendar, Camera, Eye, MessageCircle } from "lucide-react";
import { AppImage } from "@/_components/global/app-image";
import { AppLink } from "@/_components/global/app-link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface NewsItem {
  id: number;
  imageUrl: string;
  date: string;
  readTime?: string;
  category?: string;
  views?: number;
  comments?: number;
  title: string;
  slug: string;
}

interface NewsCarouselProps {
  newsItems: NewsItem[];
}

export default function NewsCarousel({ newsItems }: NewsCarouselProps) {
  const items = newsItems ?? [];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: true,
    customPaging: function() {
      return (
        <div className="w-3 h-3 rounded-full hover:bg-white transition-colors"></div>
      );
    },
    dotsClass: "slick-dots custom-dots",
    appendDots: (dots: React.ReactNode) => (
      <div style={{ position: "absolute", bottom: "20px", width: "100%", textAlign: "center" }}>
        <ul style={{ margin: "0", padding: "0" }}>{dots}</ul>
      </div>
    ),
  };

  return (
    <div className="relative max-w-5xl h-full mx-auto border border-gray-200 overflow-hidden shadow-lg">
      <Slider {...settings}>
        {items.map((item) => (
          <div key={item.id}>
            {/* Main Image Container */}
            <div className="relative w-full h-full">
              <AppLink href={item?.slug ?? "#"}>
                <AppImage
                  src={item?.imageUrl ?? "/placeholder.jpg"}
                  alt={item?.title ?? "News image"}
                  className="object-cover w-full h-full"
                  priority
                />
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black opacity-50"></div>
              </AppLink>

              {/* Top Date Indicator */}
              <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
                <div className="bg-primaryGreen p-2 text-white flex items-center justify-center rounded-sm shadow-md">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-white font-medium bg-black/40 px-3 py-1 rounded-sm backdrop-blur-sm">
                  {item?.date ?? "Date not available"}
                </span>
              </div>

              {/* Bottom Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-8 z-10">
                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-4 mb-5">
                  {item?.readTime && (
                    <div className="flex items-center gap-2">
                      <div className="bg-primaryGreen rounded-full p-2 text-white flex items-center justify-center shadow-md">
                        <Camera className="w-4 h-4" />
                      </div>
                      <span className="text-white font-medium">{item.readTime}</span>
                    </div>
                  )}

                  {item?.category && (
                    <div className="bg-primaryGreen px-4 py-1.5 rounded-sm shadow-md">
                      <span className="text-white text-sm font-medium">{item.category}</span>
                    </div>
                  )}

                  {item?.views !== undefined && item?.views !== null && (
                    <div className="flex items-center gap-2">
                      <div className="bg-primaryGreen/70 rounded-full p-2 text-white flex items-center justify-center shadow-md">
                        <Eye className="w-4 h-4" />
                      </div>
                      <span className="text-white font-medium">{item.views}</span>
                    </div>
                  )}

                  {item?.comments !== undefined && item?.comments !== null && (
                    <div className="flex items-center gap-2">
                      <div className="bg-primaryGreen/70 rounded-full p-2 text-white flex items-center justify-center shadow-md">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <span className="text-white font-medium">{item.comments}</span>
                    </div>
                  )}
                </div>

                {/* Headline */}
                <AppLink href={item?.slug ?? "#"}>
                  <h1 className="text-white text-2xl font-bold leading-tight">
                    {item?.title ?? "News title"}
                  </h1>
                </AppLink>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      <style jsx global>{`
        .slick-prev, .slick-next {
          z-index: 10;
          width: 50px;
          height: 50px;
          background-color: var(--color-primary-green, rgba(22, 163, 74, 0.8)) !important;
          border-radius: 50%;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .slick-prev:before, .slick-next:before {
          font-size: 24px;
          color: rgba(255, 255, 255, 0.9);
        }

        .slick-prev {
          left: 20px;
        }

        .slick-next {
          right: 20px;
        }

        .custom-dots li.slick-active div {
          background-color: white;
        }

        .custom-dots li div {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
}
