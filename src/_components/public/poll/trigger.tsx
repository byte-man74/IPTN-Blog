import React from 'react'
import { Button } from '@/components/ui/button'
import { PieChart } from 'lucide-react'
import { SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export const PollTriggerButton: React.FC = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button
              className="rounded-full h-14 w-14 bg-primaryGreen hover:bg-primaryGreen/90 text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
              aria-label="Open Poll"
            >
              <PieChart className="h-6 w-6" />
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Take our latest poll</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
