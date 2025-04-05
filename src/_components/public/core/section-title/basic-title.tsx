import React from 'react'

interface BasicTitleProps {
  title?: string;
}

/**
 * BasicTitle Component
 *
 * A responsive section title component that displays a heading with decorative lines.
 * Features:
 * - Responsive text size for mobile and desktop
 * - Adaptive spacing and margins
 * - Consistent styling across different screen sizes
 * - Fallback title if none provided
 */
const BasicTitle: React.FC<BasicTitleProps> = ({ title }) => {
  // Perform nullish check for title prop
  const displayTitle = title ?? "Editor's Pick";

  return (
    <div className="flex items-center w-full mb-2 xs:mb-3">
      <div className="h-[2px] xs:h-[3px] bg-primaryGreen flex-grow-0 w-6 xs:w-10"></div>
      <h2 className="mx-1.5 xs:mx-2 font-semibold text-[16px] xs:text-[18px]">{displayTitle}</h2>
      <div className="h-[2px] xs:h-[3px] bg-[#CCCCCC] flex-grow"></div>
    </div>
  )
}

export default BasicTitle
