"use client"

import { AppImage } from '@/_components/global/app-image'
import { AppLink } from '@/_components/global/app-link'
import { useFetchAds } from '@/network/http-service/ads.hooks'
import React, { useState, useEffect } from 'react'

/*
 * Advertisement carousel component that displays ads in the navigation area
 * Fetches active ads with position "NAV" and displays them in a rotating carousel
 */
const AdvertismentBox = () => {
    const { data, isLoading } = useFetchAds({
        isActive: true,
        pageType: "NAV"
    })
    const [currentAdIndex, setCurrentAdIndex] = useState(0)

    // Auto-rotate ads every 5 seconds
    useEffect(() => {
        if (!data || data.length <= 1) return

        const interval = setInterval(() => {
            setCurrentAdIndex(prevIndex => (prevIndex + 1) % data.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [data])

    if (isLoading) {
        return (
            <div className="w-[80%] h-10 sm:h-12 md:h-14 bg-gray-200 bg-opacity-20 rounded animate-pulse"></div>
        )
    }

    // If no ads available, don't show anything
    if (!data || data.length === 0) {
        return null
    }

    return (
        <div className="relative w-[100%] max-h-32 overflow-hidden">
            {/* Carousel container */}
            <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentAdIndex * 100}%)` }}
            >
                {data.map((ad) => {
                    const AdContent = (
                        <div key={ad.id} className="min-w-full flex-shrink-0">
                            <div className="relative w-full h-auto max-h-24 overflow-hidden flex flex-col items-center">
                                <AppImage
                                    alt={ad.title}
                                    src={ad.mediaUrl || ad.thumbnail}
                                    className='w-full h-40 rounded object-cover object-center'
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
                        <AppLink key={ad.id} href={ad.link} target="_blank" rel="noopener noreferrer" className="min-w-full flex-shrink-0">
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

export default AdvertismentBox
