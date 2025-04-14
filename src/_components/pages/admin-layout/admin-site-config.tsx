'use client'

import React, { useState, useEffect } from 'react'
import {
  Plus,
  Trash2,
  Save,
  RefreshCw,
  CheckCircle,
  X,
  RotateCw,
  Newspaper,
  Bell,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFetchCategories } from '@/network/http-service/news.hooks'
import { useCreateCategory } from '@/network/http-service/news.mutations'
import { useFetchSiteConfig } from '@/network/http-service/site-config.hooks'
import {
  useInitializeSiteConfig,
  useUpdateNavigation,
} from '@/network/http-service/site-config.mutations'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/hooks/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import { logger } from '@/lib/utils/logger'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SiteStatusDashboard } from './admin-site-status'



export const AdminSiteConfigComponent = () => {
  // Fetch data
  const { data: categories, isLoading: categoriesLoading } = useFetchCategories()
  const { data: siteConfig, isLoading: configLoading, isError: configError } = useFetchSiteConfig()

  // Mutations
  const initializeMutation = useInitializeSiteConfig()
  const updateNavMutation = useUpdateNavigation()
  const createCategoryMutation = useCreateCategory()

  // State for category management
  const [selectedKeyCategories, setSelectedKeyCategories] = useState<number[]>([])
  const [selectedSubCategories, setSelectedSubCategories] = useState<number[]>([])
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [activeTab, setActiveTab] = useState('navigation')

  // Initialize state from fetched data
  useEffect(() => {
    if (siteConfig) {
      setSelectedKeyCategories(siteConfig.navBarKeyCategories.map((cat) => cat.id))
      setSelectedSubCategories(siteConfig.navBarSubCategories.map((cat) => cat.id))
    }
  }, [siteConfig])

  // Reset state when categories change
  useEffect(() => {
    if (categories && siteConfig) {
      // Filter out any selected categories that no longer exist
      setSelectedKeyCategories((prev) =>
        prev.filter((id) => categories.some((cat) => cat.id === id))
      )
      setSelectedSubCategories((prev) =>
        prev.filter((id) => categories.some((cat) => cat.id === id))
      )
    }
  }, [categories, siteConfig])

  // Helper functions for category filtering
  const getSelectedKeyCategoryData = () => {
    if (!categories) return []
    return selectedKeyCategories.map(id =>
      categories.find(cat => cat.id === id)
    ).filter(Boolean)
  }

  const getSelectedSubCategoryData = () => {
    if (!categories) return []
    return selectedSubCategories.map(id =>
      categories.find(cat => cat.id === id)
    ).filter(Boolean)
  }

  const getAvailableCategories = () => {
    if (!categories) return []
    return categories.filter(
      (cat) => !selectedKeyCategories.includes(cat.id) && !selectedSubCategories.includes(cat.id)
    )
  }

  // Handle category selection
  const handleKeyCategoryAdd = (categoryId: number) => {
    if (selectedKeyCategories.length >= 5) {
      toast({
        title: 'Maximum categories reached',
        description: 'You can only select up to 5 key categories',
        variant: 'destructive',
      })
      return
    }
    setSelectedKeyCategories((prev) => [...prev, categoryId])
  }

  const handleSubCategoryAdd = (categoryId: number) => {
    setSelectedSubCategories((prev) => [...prev, categoryId])
  }

  const removeKeyCategory = (categoryId: number) => {
    setSelectedKeyCategories((prev) => prev.filter((id) => id !== categoryId))
  }

  const removeSubCategory = (categoryId: number) => {
    setSelectedSubCategories((prev) => prev.filter((id) => id !== categoryId))
  }

  // Handle category reordering
  const moveKeyCategory = (categoryId: number, direction: 'up' | 'down') => {
    setSelectedKeyCategories(prev => {
      const index = prev.indexOf(categoryId)
      if (index === -1) return prev

      const newOrder = [...prev]
      if (direction === 'up' && index > 0) {
        [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]]
      } else if (direction === 'down' && index < prev.length - 1) {
        [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]]
      }

      return newOrder
    })
  }

  const moveSubCategory = (categoryId: number, direction: 'up' | 'down') => {
    setSelectedSubCategories(prev => {
      const index = prev.indexOf(categoryId)
      if (index === -1) return prev

      const newOrder = [...prev]
      if (direction === 'up' && index > 0) {
        [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]]
      } else if (direction === 'down' && index < prev.length - 1) {
        [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]]
      }

      return newOrder
    })
  }

  // Handle category creation
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return

    try {
      await createCategoryMutation.mutateAsync({
        data: {
          name: newCategoryName.trim(),
        },
      })

      toast({
        title: 'Category created',
        description: `"${newCategoryName}" has been created successfully`,
      })

      setNewCategoryName('')
      setCategoryDialogOpen(false)
    } catch (error) {
      logger.error(error)
      toast({
        title: 'Error',
        description: 'Failed to create category',
        variant: 'destructive',
      })
    }
  }

  // Handle site config operations
  const handleInitializeSiteConfig = async () => {
    try {
      await initializeMutation.mutateAsync({ data: undefined })
      toast({
        title: 'Success',
        description: 'Site configuration initialized successfully',
      })
    } catch (error) {
      logger.error(error)
      toast({
        title: 'Error',
        description: 'Failed to initialize site configuration',
        variant: 'destructive',
      })
    }
  }

  const handleSaveNavigation = async () => {
    try {
      await updateNavMutation.mutateAsync({
        data: {
          navBarKeyCategories: selectedKeyCategories,
          navBarSubCategories: selectedSubCategories,
        },
      })

      toast({
        title: 'Success',
        description: 'Navigation configuration saved successfully',
      })
    } catch (error) {
      logger.error(error)
      toast({
        title: 'Error',
        description: 'Failed to save navigation configuration',
        variant: 'destructive',
      })
    }
  }

  // Loading state
  if (categoriesLoading || configLoading) {
    return (
      <div className="flex-1 p-6">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-10 w-32" />
          </div>

          <Skeleton className="h-12 w-full" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-7 w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-7 w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Error state or no site config
  if (configError || !siteConfig) {
    return (
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-destructive/10 border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center text-destructive">
                <X className="h-5 w-5 mr-2" />{' '}
                {configError ? 'Configuration Error' : 'No Configuration Found'}
              </CardTitle>
              <CardDescription>
                {configError
                  ? 'There was an error loading the site configuration. You may need to initialize it.'
                  : 'Site configuration has not been set up yet. Please initialize it to continue.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleInitializeSiteConfig}
                variant="default"
                disabled={initializeMutation.isPending}
              >
                {initializeMutation.isPending ? (
                  <>
                    <RotateCw className="h-4 w-4 mr-2 animate-spin" /> Initializing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" /> Initialize Site Configuration
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <main className="flex-1 p-6 overflow-auto">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Site Management</h2>
            <p className="text-gray-500 text-sm mt-1">
              Configure site navigation and monitor content health
            </p>
          </div>

          {activeTab === 'navigation' && (
            <Button onClick={handleSaveNavigation} disabled={updateNavMutation.isPending}>
              {updateNavMutation.isPending ? (
                <>
                  <RotateCw className="h-4 w-4 mr-2 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" /> Save Configuration
                </>
              )}
            </Button>
          )}
        </div>

        <Separator />

        {/* Tabs Interface */}
        <Tabs
          defaultValue="navigation"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="navigation" className="flex items-center gap-2">
              <Newspaper className="h-4 w-4" />
              <span>Navigation</span>
            </TabsTrigger>
            <TabsTrigger value="content-status" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>Content Health</span>
            </TabsTrigger>
          </TabsList>

          {/* Navigation Configuration Tab */}
          <TabsContent value="navigation" className="space-y-6">
            {/* Create Category Dialog */}
            <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
              <DialogContent>
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
                  <Button
                    onClick={handleCreateCategory}
                    disabled={createCategoryMutation.isPending || !newCategoryName.trim()}
                  >
                    {createCategoryMutation.isPending ? (
                      <>
                        <RotateCw className="h-4 w-4 mr-2 animate-spin" /> Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" /> Create Category
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Key Categories Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Key Categories</span>
                    <Badge variant="outline" className="ml-2">
                      {selectedKeyCategories.length}/5
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    These categories will appear in the main navigation bar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Add Category Dropdown */}
                  <div className="mb-4 flex items-center gap-2">
                    <Select
                      onValueChange={(value) => handleKeyCategoryAdd(Number(value))}
                      disabled={selectedKeyCategories.length >= 5}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Add category..." />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableCategories().map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => setCategoryDialogOpen(true)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </div>

                  {/* Selected Categories */}
                  <div className="space-y-2">
                    {getSelectedKeyCategoryData().map((category) => (
                      <div
                        key={category?.id}
                        className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between"
                      >
                        <span>{category?.name}</span>
                        <div className="flex items-center">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => moveKeyCategory(category?.id as number, 'up')}
                            disabled={selectedKeyCategories.indexOf(category?.id as number) === 0}
                            className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => moveKeyCategory(category?.id as number, 'down')}
                            disabled={selectedKeyCategories.indexOf(category?.id as number) === selectedKeyCategories.length - 1}
                            className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeKeyCategory(category?.id as number)}
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedKeyCategories.length === 0 && (
                    <div className="text-center py-4 text-gray-500 italic">
                      No key categories selected
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Sub Categories Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Sub Categories</span>
                    <Badge variant="outline" className="ml-2">
                      {selectedSubCategories.length}
                    </Badge>
                  </CardTitle>
                  <CardDescription>These categories will appear in dropdown menus</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Add Category Dropdown */}
                  <div className="mb-4 flex items-center gap-2">
                    <Select onValueChange={(value) => handleSubCategoryAdd(Number(value))}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Add category..." />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableCategories().map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => setCategoryDialogOpen(true)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </div>

                  {/* Selected Categories */}
                  <div className="space-y-2">
                    {getSelectedSubCategoryData().map((category) => (
                      <div
                        key={category?.id}
                        className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between"
                      >
                        <span>{category?.name}</span>
                        <div className="flex items-center">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => moveSubCategory(category?.id as number, 'up')}
                            disabled={selectedSubCategories.indexOf(category?.id as number) === 0}
                            className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => moveSubCategory(category?.id as number, 'down')}
                            disabled={selectedSubCategories.indexOf(category?.id as number) === selectedSubCategories.length - 1}
                            className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeSubCategory(category?.id as number)}
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedSubCategories.length === 0 && (
                    <div className="text-center py-4 text-gray-500 italic">
                      No sub categories selected
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Save Button */}
            <div className="flex justify-end mt-6">
              <Button
                size="lg"
                onClick={handleSaveNavigation}
                disabled={updateNavMutation.isPending}
                className="w-full sm:w-auto"
              >
                {updateNavMutation.isPending ? (
                  <>
                    <RotateCw className="h-4 w-4 mr-2 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" /> Save Configuration
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Content Status Tab */}
          <TabsContent value="content-status">
            <SiteStatusDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
