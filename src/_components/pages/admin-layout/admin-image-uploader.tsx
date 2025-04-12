"use client"

import { AppImage } from "@/_components/global/app-image"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { uploadFileToCloudinaryClientUsage } from "@/lib/third-party/cloudinary/manageCloudinaryUpload"
import { Label } from "@radix-ui/react-label"

import { useState } from "react"



export const CloudinaryImageUploader = ({
    onImageUploaded,
    currentImage,
  }: {
    onImageUploaded: (imageUrl: string, file: File) => void
    currentImage: string | null
  }) => {
    const [uploading, setUploading] = useState(false)

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0]
        setUploading(true)

        try {
          const imageUrl = await uploadFileToCloudinaryClientUsage(file, 'news')
          onImageUploaded(imageUrl, file)
        } catch (error) {
          toast({
            title: 'Error uploading image',
            description: String(error),
            variant: 'destructive',
          })
        } finally {
          setUploading(false)
        }
      }
    }

    return (
      <div className="space-y-2">
        <Label>Featured Image</Label>
        <div className="mt-1">
          {currentImage && (
            <div className="mb-2">
              <AppImage
                src={currentImage}
                alt="Preview"
                className="h-40 w-full object-cover rounded-md"
              />
            </div>
          )}
          <Input type="file" accept="image/*" onChange={handleImageChange} disabled={uploading} />
          {uploading && <p className="text-sm text-muted-foreground mt-1">Uploading...</p>}
        </div>
      </div>
    )
  }
