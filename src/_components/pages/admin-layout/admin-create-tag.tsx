"use client"
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,

  } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { useState } from 'react'


// Create Tag Dialog Component
export const CreateTagDialog = ({
    open,
    onOpenChange,
    onCreateTag,
  }: {
    open: boolean
    onOpenChange: (open: boolean) => void
    onCreateTag: (name: string) => void
  }) => {
    const [newTagName, setNewTagName] = useState('')

    const handleCreate = () => {
      onCreateTag(newTagName)
      setNewTagName('')
      onOpenChange(false)
    }

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='bg-white'>
          <DialogHeader>
            <DialogTitle>Create New Tag</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newTag">Tag Name</Label>
              <Input
                id="newTag"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Enter tag name"
              />
            </div>
            <Button onClick={handleCreate}>Create Tag</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
