import React from 'react'

/**
 * AdsBox component displays an advertisement section.
 * @returns {JSX.Element} The rendered AdsBox component.
 */
export const AdsBox = () => {
  return (
    <div className='w-full flex h-[20rem] justify-center items-center bg-[#D2D2D2]'>
        <span className="inset-0 opacity-30  text-black text-[102px] font-bold opacity-1">
            <h2
                className="font-black tracking-widest text-transparent whitespace-nowrap overflow-hidden"
                style={{
                WebkitTextStroke: "2px black",
                fontFamily: "Arial Black, sans-serif",
                }}
            >
                ADVERTISMENT
            </h2>
        </span>
    </div>
  )
}
