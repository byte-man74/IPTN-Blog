import { AppImage } from '@/_components/global/app-image'
import { Button } from '@/components/ui/button'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter,
  } from '@/components/ui/sheet'

// Social Media Preview Component
export const SocialMediaPreview = ({
    open,
    onOpenChange,
    title,
    summary,
    imageUrl,
    onConfirm,
    isLoading,
  }: {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    summary: string
    imageUrl: string | null
    onConfirm: () => void
    isLoading: boolean
  }) => {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-md md:max-w-lg bg-white flex flex-col h-full">
          <SheetHeader>
            <SheetTitle>Preview Post for Social Media</SheetTitle>
            <SheetDescription>
              This is how your post will appear when shared on social media platforms.
            </SheetDescription>
          </SheetHeader>
          <div className="py-6 space-y-6 overflow-y-auto flex-grow">
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-100 p-4 space-y-4">
                <h3 className="text-lg font-bold">Facebook Preview</h3>
                <div className="border bg-white rounded-md overflow-hidden shadow-sm">
                  {imageUrl && (
                    <div className="w-full h-52 bg-gray-200">
                      <AppImage
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-3">
                    <p className="text-gray-500 text-xs">yourdomain.com</p>
                    <h4 className="font-semibold text-sm line-clamp-2">{title}</h4>
                    <p className="text-gray-600 text-xs line-clamp-3 mt-1">{summary}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-100 p-4 space-y-4">
                <h3 className="text-lg font-bold">Twitter Preview</h3>
                <div className="border bg-white rounded-md overflow-hidden shadow-sm">
                  {imageUrl && (
                    <div className="w-full h-40 bg-gray-200">
                      <AppImage
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-3">
                    <h4 className="font-semibold text-sm line-clamp-2">{title}</h4>
                    <p className="text-gray-600 text-xs line-clamp-2 mt-1">{summary}</p>
                    <p className="text-gray-500 text-xs mt-2">yourdomain.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onConfirm} disabled={isLoading}>
              {isLoading ? 'Publishing...' : 'Confirm & Publish'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
  }
