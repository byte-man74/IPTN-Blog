import React from 'react'

export const SkeletonLoader = () => (
  <div className="animate-pulse">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </th>
            <th scope="col" className="px-6 py-3 text-left">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </th>
            <th scope="col" className="px-6 py-3 text-left">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </th>
            <th scope="col" className="px-6 py-3 text-left">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </th>
            <th scope="col" className="px-6 py-3 text-right">
              <div className="h-4 bg-gray-200 rounded w-16 ml-auto"></div>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.from({ length: 5 }).map((_, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-5 bg-gray-200 rounded w-16"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex justify-end space-x-2">
                  <div className="h-8 bg-gray-200 rounded w-12"></div>
                  <div className="h-8 bg-gray-200 rounded w-12"></div>
                  <div className="h-8 bg-gray-200 rounded w-12"></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)
