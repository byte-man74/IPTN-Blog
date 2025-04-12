'use client'

import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { Button } from '@/components/ui/button'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Type,
  Video as VideoIcon,
  Maximize2,
  Minimize2,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { uploadFileToCloudinaryClientUsage } from '@/lib/third-party/cloudinary/manageCloudinaryUpload'
import Youtube from '@tiptap/extension-youtube'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = 'Start writing your content...',
  className,
}: RichTextEditorProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primaryGreen hover:text-primaryGreen/80 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
      Youtube.configure({
        width: 640,
        height: 480,
        HTMLAttributes: {
          class: 'rounded-lg w-full max-w-full aspect-video',
        },
      }),
      Placeholder.configure({
        placeholder,
        showOnlyWhenEditable: true,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  const handleImageUpload = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (file) {
        try {
          setIsUploading(true)
          const imageUrl = await uploadFileToCloudinaryClientUsage(file, 'editor-uploads')
          if (imageUrl) {
            editor.chain().focus().setImage({ src: imageUrl }).run()
          }
        } catch (error) {
          console.error('Error uploading image:', error)
          alert('Failed to upload image. Please try again.')
        } finally {
          setIsUploading(false)
        }
      }
    }
    input.click()
  }

  const addLink = () => {
    const url = window.prompt('Enter URL')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const addVideo = () => {
    const url = window.prompt('Enter YouTube URL')
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run()
    }
  }

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  const editorContainer = (
    <div
      className={cn(
        'border rounded-lg bg-white overflow-hidden relative',
        isFullScreen ? 'fixed inset-0 z-50 rounded-none border-0' : '',
        className
      )}
      style={{ position: isFullScreen ? 'fixed' : 'relative' }}
    >
      <div
        className="border-b bg-gray-50 p-2 flex flex-wrap gap-2 items-center"
        style={{ position: 'sticky', top: 0, zIndex: 10 }}
      >
        <div className="flex-1 flex flex-wrap gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={cn(editor.isActive('paragraph') && 'bg-gray-200')}
            title="Paragraph"
          >
            <Type className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(editor.isActive('bold') && 'bg-gray-200')}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(editor.isActive('italic') && 'bg-gray-200')}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={cn(editor.isActive('heading', { level: 1 }) && 'bg-gray-200')}
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={cn(editor.isActive('heading', { level: 2 }) && 'bg-gray-200')}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn(editor.isActive('bulletList') && 'bg-gray-200')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn(editor.isActive('orderedList') && 'bg-gray-200')}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={cn(editor.isActive('blockquote') && 'bg-gray-200')}
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={addLink}>
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleImageUpload}
            disabled={isUploading}
            title="Upload image from your device"
          >
            <ImageIcon className="h-4 w-4" />
            {isUploading && <span className="ml-1 text-xs">Uploading...</span>}
          </Button>
          <Button variant="ghost" size="sm" onClick={addVideo} title="Add YouTube video">
            <VideoIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={toggleFullScreen} title={isFullScreen ? "Exit full screen" : "Full screen mode"}>
            {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          {isFullScreen && (
            <Button variant="ghost" size="sm" onClick={toggleFullScreen} title="Close">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="bg-white shadow-md rounded-md p-1 flex gap-1 border"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(editor.isActive('bold') && 'bg-gray-200')}
          >
            <Bold className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(editor.isActive('italic') && 'bg-gray-200')}
          >
            <Italic className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" onClick={addLink}>
            <LinkIcon className="h-3 w-3" />
          </Button>
        </BubbleMenu>
      )}

      {editor && (
        <FloatingMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="bg-white shadow-md rounded-md p-1 flex flex-col gap-1 border"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className="flex items-center justify-start"
          >
            <Heading1 className="h-3 w-3 mr-2" /> Heading 1
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className="flex items-center justify-start"
          >
            <Heading2 className="h-3 w-3 mr-2" /> Heading 2
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className="flex items-center justify-start"
          >
            <List className="h-3 w-3 mr-2" /> Bullet List
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleImageUpload}
            className="flex items-center justify-start"
          >
            <ImageIcon className="h-3 w-3 mr-2" /> Image
          </Button>
        </FloatingMenu>
      )}

      <div className={cn(isFullScreen ? 'h-[calc(100vh-48px)] overflow-y-auto' : '')}>
        <EditorContent editor={editor} className="prose max-w-none p-4 focus:outline-none" />
      </div>
      <style jsx global>{`
        .is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror:focus {
          outline: 2px solid #00a651;
          outline-offset: -2px;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        body.editor-fullscreen {
          overflow: hidden;
        }
      `}</style>
    </div>
  )

  return editorContainer
}
