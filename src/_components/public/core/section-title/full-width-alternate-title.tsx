import React, { useEffect, useRef } from 'react'

interface FullWidthAlternateTitleProps {
  title: string;
  backgroundTitle?: string
}

/**
 * This is a reusable alternate title for a full width section
 * Responsive design for both mobile and desktop screens
 * Features a marquee effect for the background title
 */
const FullWidthAlternateTitle: React.FC<FullWidthAlternateTitleProps> = ({ title, backgroundTitle }) => {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marqueeElement = marqueeRef.current;
    if (!marqueeElement) return;

    let position = 0;
    const speed = 0.5;
    const textWidth = marqueeElement.scrollWidth;

    const animate = () => {
      position -= speed;
      // Reset position when text has scrolled completely
      if (position <= -textWidth / 2) {
        position = 0;
      }
      if (marqueeElement) {
        marqueeElement.style.transform = `translateX(${position}px)`;
      }
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [backgroundTitle, title]);

  return (
    <div className="relative flex items-center w-full my-2 sm:my-4  overflow-y-visible">
      <div className="h-[2px] sm:h-[3px] bg-primaryGreen flex-grow-0 w-8 sm:w-24"></div>
      <h2 className="relative z-10 mx-1 sm:mx-2 font-semibold text-lg sm:text-[30px] whitespace-nowrap overflow-y-visible text-ellipsis">{title ?? "NA"}</h2>
      <div className="h-[2px] sm:h-[3px] bg-[#CCCCCC] flex-grow"></div>
      <div className="absolute inset-0 left-[3rem] sm:left-[5.8rem] z-[-1] flex items-center text-black text-[50px] sm:text-[102px] font-bold overflow-y-visible">
        <div
          ref={marqueeRef}
          className="whitespace-nowrap"
        >
          <h2
            className="font-black tracking-widest text-transparent opacity-15 mt-[-5px] sm:mt-[-10px] inline-block"
            style={{
              WebkitTextStroke: "1px black",
              WebkitTextStrokeWidth: "1px",
              WebkitTextStrokeColor: "black",
              fontFamily: "Arial Black, sans-serif",
            }}
          >
            {backgroundTitle ? backgroundTitle : title}
            {/* Duplicate the text to create seamless loop */}
            &nbsp;&nbsp;&nbsp;{backgroundTitle ? backgroundTitle : title}
          </h2>
        </div>
      </div>
    </div>
  )
}

export default FullWidthAlternateTitle
