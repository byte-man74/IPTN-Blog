"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PieChart } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export const GlobalPoll = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
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
            <TooltipContent>
              <p>Take our latest poll</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <SheetContent side="bottom" className="rounded-t-xl bg-white h-[40rem]">
          <SheetHeader>
            <SheetTitle>Current Poll</SheetTitle>
          </SheetHeader>
          <div className="py-6">
            {/* Poll content goes here */}
            <p>Poll content will be displayed here</p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
