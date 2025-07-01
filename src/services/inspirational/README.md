# Inspirational Services

This directory contains services for managing inspirational colors and images in the Dzinly application.

## Overview

The inspirational services provide a clean interface for interacting with:
- **`inspirational_color`** table - Contains color inspiration data
- **`inspiration_images`** table - Contains image inspiration data

## Services Structure

### InspirationalColorService
Located in `inspirationColorService/`

**Main API Methods:**
- `fetchInspirationColors()` - Fetch all colors with filtering and pagination
- `fetchInspirationColorById()` - Fetch a specific color by ID
- `searchInspirationColorsByName()` - Search colors by name
- `fetchInspirationColorsByHex()` - Find colors by hex value

**Service Methods:**
- `getInspirationColors()` - Get colors with validation and error handling
- `getInspirationColorsPaginated()` - Get paginated colors
- `searchInspirationColors()` - Search with validation
- `getInspirationColorsByHex()` - Get by hex with validation
- `getColorNames()` - Get unique color names for autocomplete

### InspirationalImageService
Located in `inspirationImageService/`

**Main API Methods:**
- `fetchInspirationImages()` - Fetch all images with filtering and pagination
- `fetchInspirationImageById()` - Fetch a specific image by ID
- `fetchInspirationImagesByColorFamily()` - Get images by color family
- `searchInspirationImagesByName()` - Search images by name
- `fetchActiveInspirationImages()` - Get only active images
- `getInspirationImagesCountByColorFamily()` - Get count statistics

**Service Methods:**
- `getInspirationImages()` - Get images with validation and error handling
- `getInspirationImagesPaginated()` - Get paginated images
- `getInspirationImagesByColorFamily()` - Get by color family with validation
- `searchInspirationImages()` - Search with validation
- `getActiveInspirationImages()` - Get only active images
- `getFeaturedInspirationImages()` - Get featured images

## Usage Examples

### Basic Color Fetching
```typescript
import { InspirationalColorService } from '@/services/inspirational';

// Fetch all colors
const result = await InspirationalColorService.getInspirationColors();
if (result.success) {
  console.log('Colors:', result.data);
}

// Search colors
const searchResult = await InspirationalColorService.searchInspirationColors('blue');
```

### Basic Image Fetching
```typescript
import { InspirationalImageService } from '@/services/inspirational';

// Fetch all images
const result = await InspirationalImageService.getInspirationImages();
if (result.success) {
  console.log('Images:', result.data);
}

// Get images by color family
const familyImages = await InspirationalImageService.getInspirationImagesByColorFamily(1);
```

### Pagination
```typescript
// Colors with pagination
const colorPage = await InspirationalColorService.getInspirationColorsPaginated(1, 20);
if (colorPage.success) {
  const { data, count, totalPages, hasMore } = colorPage.data;
}

// Images with pagination
const imagePage = await InspirationalImageService.getInspirationImagesPaginated(1, 12);
```

## Database Schema

### inspirational_color
- `id` (string) - Primary key
- `name` (string) - Color name
- `hex` (string) - Hex color value

### inspiration_images
- `id` (number) - Primary key
- `color_family_id` (number) - Reference to color family
- `code` (number) - Image code
- `name` (string) - Image name
- `image` (string) - Image URL/path
- `status` (number) - Active/inactive status (1/0)

## Error Handling

All services return a consistent result format:
```typescript
interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

## Filters

### Color Filters
```typescript
interface InspirationColorFilters {
  search?: string;
  name?: string;
  hex?: string;
  limit?: number;
  offset?: number;
}
```

### Image Filters
```typescript
interface InspirationImageFilters {
  search?: string;
  color_family_id?: number;
  code?: number;
  name?: string;
  status?: number;
  limit?: number;
  offset?: number;
}
```

## Files Structure

```
src/services/inspirational/
├── inspirationColorService/
│   ├── InspirationalColorApi.ts      # Low-level Supabase API calls
│   ├── InspirationalColorService.ts  # Business logic and validation
│   └── index.ts                      # Exports
├── inspirationImageService/
│   ├── InspirationalImageApi.ts      # Low-level Supabase API calls
│   ├── InspirationalImageService.ts  # Business logic and validation
│   └── index.ts                      # Exports
├── index.ts                          # Main exports
├── serviceExamples.ts                # Usage examples
└── README.md                         # This file
```
