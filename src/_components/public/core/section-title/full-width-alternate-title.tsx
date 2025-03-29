import React from 'react'

interface FullWidthAternateTitleProps {
  title: string;
}

/**
 * This is a reusable alternate title for a full width section
 */
const FullWidthAternateTitle: React.FC<FullWidthAternateTitleProps> = ({ title }) => {
  return (
    <div className="relative flex items-center w-full my-4">
      <div className="h-[3px] bg-primaryGreen flex-grow-0 w-24"></div>
      <h2 className="relative z-10 mx-2 font-semibold text-[18px]">{title ?? "NA"}</h2>
      <div className="h-[3px] bg-[#CCCCCC] flex-grow"></div>
      <span className="absolute inset-0 left-[5.8rem] opacity-5 z-[-1] flex items-center text-black text-[102px] font-bold opacity-1">
      <h2
        className="font-black tracking-widest text-transparent mt-[-10px]"
        style={{
          WebkitTextStroke: "2px black",

          fontFamily: "Arial Black, sans-serif",
        }}
      >
        {title}
      </h2>
      </span>
    </div>
  )
}

export default FullWidthAternateTitle
