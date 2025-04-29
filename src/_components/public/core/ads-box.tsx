"use client"

import { useFetchAds } from '@/network/http-service/ads.hooks'
import React, { useState, useEffect } from 'react'
import { AppImage } from '@/_components/global/app-image'
import { AppLink } from '@/_components/global/app-link'
import { useMixpanel } from '@/lib/third-party/mixpanel/context'
import { MixpanelActions } from '@/lib/third-party/mixpanel/events';

/**
 * AdsBox component displays an advertisement section.
 * @param {Object} props - Component props
 * @param {string} props.position - Position of the ad box
 * @returns {JSX.Element} The rendered AdsBox component.
 */

interface AdsBoxProps {
    position?: "home-page" | "second-page" | "third-page" | "fourth-page"
    className?: string
}

const getPageTypeFromPosition = (position: string): string => {
    switch (position) {
        case "home-page":
            return "HOME";
        case "second-page":
            return "SECOND";
        case "third-page":
            return "THIRD";
        case "fourth-page":
            return "FOURTH";
        default:
            return "NAV";
    }
}

export const AdsBox = ({
    position = "home-page",
    className = ""
}: AdsBoxProps = {}) => {
    const pageType = getPageTypeFromPosition(position);
    const { data, isLoading } = useFetchAds({
        isActive: true,
        pageType
    })

    const [currentAdIndex, setCurrentAdIndex] = useState(0)
    const { trackEvent } = useMixpanel()

    // Auto-rotate ads every 5 seconds if there are multiple ads
    useEffect(() => {
        if (!data || data.length <= 1) return

        const interval = setInterval(() => {
            setCurrentAdIndex(prevIndex => (prevIndex + 1) % data.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [data])

    const handleAdClick = (adTitle: string, adLink: string) => {
        trackEvent({eventName: MixpanelActions.CLICKED_AD, properties: {
            adTitle,
            adLink,
            position,
        }})
    }

    if (isLoading) {
        return (
            <div className={`w-full mx-auto flex h-[20rem] justify-center items-center bg-[#D2D2D2] animate-pulse overflow-hidden ${className}`}>
                <span className="opacity-30 text-black text-[102px] font-bold sm:text-[80px] xs:text-[60px]">
                    <h2
                        className="font-black tracking-widest text-transparent whitespace-nowrap"
                        style={{
                            WebkitTextStroke: "2px black",
                            fontFamily: "Arial Black, sans-serif",
                        }}
                    >
                        LOADING
                    </h2>
                </span>
            </div>
        )
    }

    if (!data || data.length === 0) {
        return (
            <div className={`w-full mx-auto flex h-[20rem] justify-center items-center bg-[#D2D2D2] overflow-hidden ${className}`}>
                <span className="inset-0 opacity-30 text-black text-[102px] font-bold sm:text-[80px] xs:text-[60px] overflow-hidden">
                    <h2
                        className="font-black tracking-widest text-transparent whitespace-nowrap overflow-hidden"
                        style={{
                            WebkitTextStroke: "2px black",
                            fontFamily: "Arial Black, sans-serif",
                        }}
                    >
                        ADVERTISEMENT
                    </h2>
                </span>
            </div>
        )
    }

    return (
        <div className={`relative w-full mx-auto h-[20rem] overflow-hidden ${className}`}>
            {/* Carousel container */}
            <div
                className="flex h-full w-full transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentAdIndex * 100}%)` }}
            >
                {data.map((ad) => {
                    const AdContent = (
                        <div key={ad.id} className="w-full flex-shrink-0 h-full">
                            <div className="relative w-full h-full overflow-hidden flex flex-col items-center">
                                <AppImage
                                    alt={ad.title}
                                    src={ad.mediaUrl || ad.thumbnail}
                                    className='w-full h-full object-cover object-center'
                                />
                                {ad.title && (
                                    <>
                                        <div className="absolute top-0 left-0 bg-primaryGreen bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded-br">
                                            Ad
                                        </div>
                                        <div className="absolute bottom-0 w-full bg-black bg-opacity-60 text-white text-sm px-2 py-1 truncate text-center">
                                            {ad.title}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )

                    return ad.link ? (
                        <AppLink
                            key={ad.id}
                            href={ad.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="min-w-full flex-shrink-0 h-full"
                            onClick={() => handleAdClick(ad.title || 'Untitled Ad', ad.link || '')}
                        >
                            {AdContent}
                        </AppLink>
                    ) : AdContent
                })}
            </div>

            {/* Carousel navigation dots */}
            {data.length > 1 && (
                <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-1 z-10">
                    <div className="flex gap-1 mt-1">
                        {data.map((ad, index) => (
                            <button
                                key={ad.id}
                                onClick={() => setCurrentAdIndex(index)}
                                className={`w-1.5 h-1.5 rounded-full ${index === currentAdIndex ? 'bg-white' : 'bg-white bg-opacity-50'}`}
                                aria-label={`Go to ad ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Left/Right navigation arrows for larger screens */}
            {data.length > 1 && (
                <>
                    <button
                        onClick={() => setCurrentAdIndex(prev => (prev === 0 ? data.length - 1 : prev - 1))}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-1 rounded-r"
                        aria-label="Previous ad"
                    >
                        ‹
                    </button>
                    <button
                        onClick={() => setCurrentAdIndex(prev => (prev === data.length - 1 ? 0 : prev + 1))}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-1 rounded-l"
                        aria-label="Next ad"
                    >
                        ›
                    </button>
                </>
            )}
        </div>
    )
}
