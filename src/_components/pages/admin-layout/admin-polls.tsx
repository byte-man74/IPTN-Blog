'use client'

import React, { useState } from 'react'

import { useCreatePoll, useDeletePoll, useUpdatePoll } from '@/network/http-service/polls.mutation'
import { Loader2, Plus, Trash2, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { DialogHeader } from '@/components/ui/dialog'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { PollDTO } from '@/app/(server)/modules/polls/poll.types'
import { logger } from '@/lib/utils/logger'
import { useForm, useFieldArray, Controller, SubmitHandler } from 'react-hook-form'
import { Separator } from '@/components/ui/separator'
import { format } from 'date-fns'
import { useFetchAllPolls } from '@/network/http-service/polls.hooks'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FormValues {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'closed';
  options: { text: string; id?: number; pollId?: number }[];
}

export const PollsAdminComponent = () => {
  const { data: polls, isLoading } = useFetchAllPolls()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const createPollMutation = useCreatePoll()

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      startDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      endDate: '',
      status: 'active',
      options: [{ text: '' }, { text: '' }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options'
  })

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      await createPollMutation.mutateAsync({
        data: {
          title: data.title,
          description: data.description,
          startDate: data.startDate ? new Date(data.startDate) : new Date(),
          endDate: data.endDate ? new Date(data.endDate) : undefined,
          status: data.status,
          options: data.options
            .filter((opt) => opt.text.trim())
            .map((opt) => ({ text: opt.text, id: 0, pollId: 0 })),
        },
      })

      setIsDialogOpen(false)
      reset()
    } catch (error) {
      logger.error(error)
    }
  }

  const handleAddOption = () => {
    append({ text: '' })
  }

  return (
    <div className="container mx-auto py-6 px-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Polls Management</h1>
          <p className="text-muted-foreground mt-1">Create and manage polls for your community</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Poll
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl">Create New Poll</DialogTitle>
              <DialogDescription>
                Create a poll for your community to vote on. Add at least two options.
              </DialogDescription>
            </DialogHeader>
            <Separator className="my-2" />
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">Poll Title</Label>
                  <Controller
                    name="title"
                    control={control}
                    rules={{ required: "Title is required" }}
                    render={({ field }) => (
                      <Input
                        id="title"
                        placeholder="Enter a clear, concise title"
                        className="w-full"
                        {...field}
                      />
                    )}
                  />
                  {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">Description (Optional)</Label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        id="description"
                        placeholder="Provide additional context for your poll"
                        className="w-full min-h-[80px] resize-y"
                        {...field}
                      />
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-sm font-medium">Start Date</Label>
                    <Controller
                      name="startDate"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="startDate"
                          type="datetime-local"
                          className="w-full"
                          {...field}
                        />
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="text-sm font-medium">End Date (Optional)</Label>
                    <Controller
                      name="endDate"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="endDate"
                          type="datetime-local"
                          className="w-full"
                          {...field}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">Poll Options</Label>
                    <span className="text-xs text-muted-foreground">Minimum 2 options required</span>
                  </div>

                  <div className="space-y-2 max-h-[250px] overflow-y-auto p-1">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2 group">
                        <div className="w-full">
                          <Controller
                            name={`options.${index}.text`}
                            control={control}
                            rules={{ required: index < 2 ? "At least 2 options are required" : false }}
                            render={({ field }) => (
                              <Input
                                placeholder={`Option ${index + 1}`}
                                className="w-full"
                                {...field}
                              />
                            )}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => fields.length > 2 && remove(index)}
                          type="button"
                          className="opacity-70 hover:opacity-100"
                          disabled={fields.length <= 2}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {errors.options && <p className="text-sm text-red-500">At least 2 options are required</p>}

                  <Button
                    variant="outline"
                    onClick={handleAddOption}
                    type="button"
                    className="w-full mt-2 border-dashed"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createPollMutation.isPending}
                  className="min-w-[100px]"
                >
                  {createPollMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Poll
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>All Polls</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !polls?.length ? (
            <div className="text-center py-8 text-muted-foreground">
              No polls found. Create your first poll to get started.
            </div>
          ) : (
            <PollsTable polls={polls as PollDTO[]} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function PollsTable({ polls }: { polls: PollDTO[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Options</TableHead>
          <TableHead>Total Votes</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {polls.map((poll) => (
          <PollTableRow key={poll.id} poll={poll} />
        ))}
      </TableBody>
    </Table>
  )
}

function PollTableRow({ poll }: { poll: PollDTO }) {
  const deletePollMutation = useDeletePoll(poll.id?.toString() || '')
  const updatePollMutation = useUpdatePoll(poll.id?.toString() || '')
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)

  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      title: poll.title || '',
      description: poll.description || '',
      startDate: poll.startDate ? format(new Date(poll.startDate), "yyyy-MM-dd'T'HH:mm") : '',
      endDate: poll.endDate ? format(new Date(poll.endDate), "yyyy-MM-dd'T'HH:mm") : '',
      status: poll.status as "active" | "closed" | undefined,
      options: poll.options?.map(opt => ({
        text: opt.text || '',
        id: opt.id,
        pollId: opt.pollId
      })) || [{ text: '' }, { text: '' }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options'
  })

  const handleDelete = async () => {
    try {
      await deletePollMutation.mutateAsync({
        data: poll.id?.toString() || '',
      })
      setIsDeleteDialogOpen(false)
    } catch (error) {
      logger.error(error)
    }
  }

  const handleAddOption = () => {
    append({ text: '' })
  }

  const onSubmitEdit: SubmitHandler<FormValues> = async (data) => {
    try {
      await updatePollMutation.mutateAsync({
        data: {
          title: data.title,
          description: data.description,
          startDate: data.startDate ? new Date(data.startDate) : new Date(),
          endDate: data.endDate ? new Date(data.endDate) : undefined,
          status: data.status,
          options: data.options
            .filter((opt) => opt.text.trim())
            .map((opt) => ({
              text: opt.text,
              id: opt.id || 0,
              pollId: poll.id || 0
            })),
        },
      })

      setIsEditSheetOpen(false)
    } catch (error) {
      logger.error(error)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updatePollMutation.mutateAsync({
        data: {
          ...poll,
          status: newStatus as 'active' | 'closed',
          options: poll.options?.map(opt => ({
            text: opt.text || '',
            id: opt.id || 0,
            pollId: poll.id || 0
          })) || []
        },
      })
    } catch (error) {
      logger.error(error)
    }
  }

  const totalVotes = poll.options?.reduce((sum: number) => sum + (poll.votes?.length || 0), 0) || 0
  const formattedDate = poll?.createdAt ? new Date(poll.createdAt).toLocaleDateString() : '';

  return (
    <TableRow>
      <TableCell className="font-medium">{poll.title}</TableCell>
      <TableCell>{poll.options?.length || 0}</TableCell>
      <TableCell>{totalVotes}</TableCell>
      <TableCell>
        <Select
          defaultValue={poll.status || 'active'}
          onValueChange={handleStatusChange}
          disabled={updatePollMutation.isPending}
        >
          <SelectTrigger className="w-[110px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>{formattedDate}</TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditSheetOpen(true)}
            disabled={updatePollMutation.isPending}
          >
            {updatePollMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Pencil className="h-4 w-4" />
            )}
          </Button>

          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={deletePollMutation.isPending}
              >
                {deletePollMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 text-destructive" />
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Delete Poll</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this poll? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-3 mt-4">
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deletePollMutation.isPending}
                >
                  {deletePollMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
          <SheetContent className="sm:max-w-[600px] overflow-y-auto bg-white">
            <SheetHeader>
              <SheetTitle>Edit Poll</SheetTitle>
              <SheetDescription>
                Make changes to your poll. Click save when you&apos;re done.
              </SheetDescription>
            </SheetHeader>
            <Separator className="my-4" />
            <form onSubmit={handleSubmit(onSubmitEdit)} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="edit-title" className="text-sm font-medium">Poll Title</Label>
                  <Controller
                    name="title"
                    control={control}
                    rules={{ required: "Title is required" }}
                    render={({ field }) => (
                      <Input
                        id="edit-title"
                        placeholder="Enter a clear, concise title"
                        className="w-full"
                        {...field}
                      />
                    )}
                  />
                  {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-description" className="text-sm font-medium">Description (Optional)</Label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        id="edit-description"
                        placeholder="Provide additional context for your poll"
                        className="w-full min-h-[80px] resize-y"
                        {...field}
                      />
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-startDate" className="text-sm font-medium">Start Date</Label>
                    <Controller
                      name="startDate"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="edit-startDate"
                          type="datetime-local"
                          className="w-full"
                          {...field}
                        />
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-endDate" className="text-sm font-medium">End Date (Optional)</Label>
                    <Controller
                      name="endDate"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="edit-endDate"
                          type="datetime-local"
                          className="w-full"
                          {...field}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-status" className="text-sm font-medium">Status</Label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">Poll Options</Label>
                    <span className="text-xs text-muted-foreground">Minimum 2 options required</span>
                  </div>

                  <div className="space-y-2 max-h-[250px] overflow-y-auto p-1">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2 group">
                        <div className="w-full">
                          <Controller
                            name={`options.${index}.text`}
                            control={control}
                            rules={{ required: index < 2 ? "At least 2 options are required" : false }}
                            render={({ field }) => (
                              <Input
                                placeholder={`Option ${index + 1}`}
                                className="w-full"
                                {...field}
                              />
                            )}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => fields.length > 2 && remove(index)}
                          type="button"
                          className="opacity-70 hover:opacity-100"
                          disabled={fields.length <= 2}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {errors.options && <p className="text-sm text-red-500">At least 2 options are required</p>}

                  <Button
                    variant="outline"
                    onClick={handleAddOption}
                    type="button"
                    className="w-full mt-2 border-dashed"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsEditSheetOpen(false)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updatePollMutation.isPending}
                  className="min-w-[100px]"
                >
                  {updatePollMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </TableCell>
    </TableRow>
  )
}
