import React from 'react'

interface FullWidthAlternateTitleProps {
  title: string;
}

/**
 * This is a reusable alternate title for a full width section
 * Responsive design for both mobile and desktop screens
 */
const FullWidthAlternateTitle: React.FC<FullWidthAlternateTitleProps> = ({ title }) => {
  return (
    <div className="relative flex items-center w-full my-2 sm:my-4">
      <div className="h-[2px] sm:h-[3px] bg-primaryGreen flex-grow-0 w-8 sm:w-24"></div>
      <h2 className="relative z-10 mx-1 sm:mx-2 font-semibold text-lg sm:text-[30px] whitespace-nowrap overflow-hidden text-ellipsis">{title ?? "NA"}</h2>
      <div className="h-[2px] sm:h-[3px] bg-[#CCCCCC] flex-grow"></div>
      <span className="absolute inset-0 left-[3rem] sm:left-[5.8rem] opacity-5 z-[-1] flex items-center text-black text-[50px] sm:text-[102px] font-bold">
      <h2
        className="font-black tracking-widest text-transparent mt-[-5px] sm:mt-[-10px] whitespace-nowrap overflow-hidden"
        style={{
          WebkitTextStroke: "1px black",
          WebkitTextStrokeWidth: "1px",
          WebkitTextStrokeColor: "black",
          fontFamily: "Arial Black, sans-serif",
        }}
      >
        {title}
      </h2>
      </span>
    </div>
  )
}

export default FullWidthAlternateTitle
