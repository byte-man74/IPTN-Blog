# Skeleton Components

This directory contains reusable skeleton components for loading states throughout the application.

## Purpose

These skeleton components provide a consistent way to show loading states across the application, improving both code maintainability and user experience. Instead of defining inline skeleton components in each file, we use these pre-defined components.

## Structure

The skeleton components are organized as follows:

- `index.ts` - Exports all skeleton components
- `news-skeletons.tsx` - Contains skeleton components for news-related UI elements
- `ui-skeletons.tsx` - Contains skeleton components for general UI elements

## Available Components

### News Skeletons

- `StandardNewsItemSkeleton` - For standard news items in grids and lists
- `FeaturedNewsItemSkeleton` - For featured news items (larger size)
- `BasicNewsSkeleton` - For small news items in horizontal scrolling layouts
- `BasicNewsWithImageSkeleton` - For news items with image and text side by side
- `CarouselSkeleton` - For news carousels with metadata placeholders
- `NewsWithDescriptionSkeleton` - For news items with descriptions

### UI Skeletons

- `NavigationItemSkeleton` - For navigation items
- `TableRowSkeleton` - For table rows
- `TableHeaderSkeleton` - For table headers
- `CardSkeleton` - For card components

## Usage Example

```tsx
import { BasicNewsSkeleton, FeaturedNewsItemSkeleton } from '@/_components/global/skeletons'

const MyComponent = () => {
  const { data, isLoading } = useSomeDataFetcher()

  return (
    <div>
      {isLoading ? (
        <FeaturedNewsItemSkeleton />
      ) : (
        <MyActualComponent data={data} />
      )}
    </div>
  )
}
```

## Benefits

- **Consistency**: Ensures loading states look consistent across the application
- **Maintainability**: Centralizes skeleton component definitions
- **Reusability**: Makes it easy to reuse the same skeleton in multiple places
- **Performance**: Reduces the amount of duplicate JSX in the bundle
