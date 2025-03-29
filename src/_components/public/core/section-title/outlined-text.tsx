"use client"

import { useRef, useEffect } from "react"

export default function TrueOutlineText() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (svgRef.current) {
      // Get the text path
      const textPath = svgRef.current.querySelector("path")
      if (textPath) {
        // Set the stroke to be visible and fill to be transparent
        textPath.setAttribute("fill", "none")
        textPath.setAttribute("stroke", "black")
        textPath.setAttribute("stroke-width", "2")
      }
    }
  }, [])

  return (
    <div className="p-8 bg-gray-100 flex flex-col items-center">
      {/* Small green text similar to the one in the image */}
      <div className="self-start mb-4">
        <span className="text-green-600 text-sm border-b border-green-600">Featured List</span>
      </div>

      {/* SVG text with only outer stroke */}
      <div className="w-full max-w-4xl">
        <svg ref={svgRef} viewBox="0 0 800 150" className="w-full">
          <path
            id="textPath"
            d="M40,80
               L40,30 L120,30 L120,50 L60,50 L60,50 L60,80 L100,80 L100,100 L60,100 L60,130 L120,130 L120,150 L40,150 Z
               M140,30 L160,30 L160,130 L200,130 L200,150 L140,150 Z
               M220,30 L240,30 L240,70 L280,70 L280,30 L300,30 L300,150 L280,150 L280,90 L240,90 L240,150 L220,150 Z
               M320,30 L380,30 L400,50 L400,130 L380,150 L320,150 L300,130 L300,50 Z
               M320,50 L320,130 L380,130 L380,50 Z
               M420,30 L440,30 L440,130 L480,130 L480,150 L420,150 Z
               M500,30 L520,30 L520,150 L500,150 Z
               M540,30 L600,30 L620,50 L620,70 L600,90 L560,90 L560,150 L540,150 Z
               M560,50 L560,70 L600,70 L600,50 Z
               M640,30 L700,30 L720,50 L720,150 L700,150 L700,90 L660,90 L660,150 L640,150 Z
               M660,50 L660,70 L700,70 L700,50 Z"
            fill="black"
          />
        </svg>
      </div>

      {/* Alternative approach using text-stroke with increased spacing */}

    </div>
  )
}
