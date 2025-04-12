
'use client'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'


export const CreateCategoryDialog = ({
    open,
    onOpenChange,
    onCreateCategory,
  }: {
    open: boolean
    onOpenChange: (open: boolean) => void
    onCreateCategory: (name: string) => void
  }) => {
    const [newCategoryName, setNewCategoryName] = useState('')

    const handleCreate = () => {
      onCreateCategory(newCategoryName)
      setNewCategoryName('')
      onOpenChange(false)
    }

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newCategory">Category Name</Label>
              <Input
                id="newCategory"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name"
              />
            </div>
            <Button onClick={handleCreate}>Create Category</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
