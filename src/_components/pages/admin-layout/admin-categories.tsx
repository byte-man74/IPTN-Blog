"use client"

import React, { useState } from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

export const AdminCategoriesComponent = () => {
  const [keyCategories, setKeyCategories] = useState([
    { id: '1', name: 'Technology' },
    { id: '2', name: 'Travel' },
    { id: '3', name: 'Food' },
  ])

  const [subCategories, setSubCategories] = useState([
    { id: '1', name: 'Asia' },
    { id: '2', name: 'Europe' },
    { id: '3', name: 'Recipes' },
    { id: '4', name: 'Reviews' }
  ])

  const [newKeyCategory, setNewKeyCategory] = useState('')
  const [newSubCategory, setNewSubCategory] = useState('')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result
    const sourceList = source.droppableId
    const destList = destination.droppableId

    if (sourceList === destList) {
      const items = sourceList === 'keyCategories' ? Array.from(keyCategories) : Array.from(subCategories)
      const [reorderedItem] = items.splice(source.index, 1)
      items.splice(destination.index, 0, reorderedItem)

      if (sourceList === 'keyCategories') {
        setKeyCategories(items)
      } else {
        setSubCategories(items)
      }
    }
  }

  return (
    <main className="flex-1 p-6 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Navigation Configuration</h2>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Key Categories Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Key Categories</h3>
            <div className="mb-4 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newKeyCategory}
                  onChange={(e) => setNewKeyCategory(e.target.value)}
                  placeholder="Add key category..."
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryGreen"
                />
                <button
                  onClick={() => {
                    if (!newKeyCategory.trim()) return
                    setKeyCategories(prev => [...prev, { id: Date.now().toString(), name: newKeyCategory }])
                    setNewKeyCategory('')
                  }}
                  className="bg-primaryGreen hover:bg-primaryGreen/90 text-white px-3 py-1.5 rounded-md transition-all duration-200"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="keyCategories">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                    {keyCategories.map((category, index) => (
                      <Draggable key={category.id} draggableId={category.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <span {...provided.dragHandleProps}>
                                <GripVertical className="h-4 w-4 text-gray-400" />
                              </span>
                              <span>{category.name}</span>
                            </div>
                            <button
                              onClick={() => setKeyCategories(prev => prev.filter(c => c.id !== category.id))}
                              className="text-red-500 p-1 hover:bg-red-50 rounded-md"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          {/* Sub Categories Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Sub Categories</h3>
            <div className="mb-4 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubCategory}
                  onChange={(e) => setNewSubCategory(e.target.value)}
                  placeholder="Add sub category..."
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryGreen"
                />
                <button
                  onClick={() => {
                    if (!newSubCategory.trim()) return
                    setSubCategories(prev => [...prev, { id: Date.now().toString(), name: newSubCategory }])
                    setNewSubCategory('')
                  }}
                  className="bg-primaryGreen hover:bg-primaryGreen/90 text-white px-3 py-1.5 rounded-md transition-all duration-200"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="subCategories">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                    {subCategories.map((category, index) => (
                      <Draggable key={category.id} draggableId={category.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <span {...provided.dragHandleProps}>
                                <GripVertical className="h-4 w-4 text-gray-400" />
                              </span>
                              <span>{category.name}</span>
                            </div>
                            <button
                              onClick={() => setSubCategories(prev => prev.filter(c => c.id !== category.id))}
                              className="text-red-500 p-1 hover:bg-red-50 rounded-md"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button className="bg-primaryGreen hover:bg-primaryGreen/90 text-white px-6 py-2 rounded-md transition-all duration-200 font-medium">
            Save Configuration
          </button>
        </div>
      </div>
    </main>
  )
}
