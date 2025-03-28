import React from 'react'

interface BasicTitleProps {
  title?: string;
}
/**
 * Global title variable. it would have other variables later on. but this is the core basic
 */
const BasicTitle: React.FC<BasicTitleProps> = ({ title}) => {
  return (
    <div className="flex items-center w-full mb-2">
      <div className="h-[3px] bg-primaryGreen flex-grow-0 w-10"></div>
      <h2 className="mx-2 font-semibold text-[18px]">{title ?? "Editor's Pick"}</h2>
      <div className="h-[3px] bg-[#CCCCCC] flex-grow"></div>
    </div>
  )
}

export default BasicTitle
