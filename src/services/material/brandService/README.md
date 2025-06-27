# Brand Service Documentation

This document provides comprehensive information about the Brand Service API and Service layer for managing material brands in the application.

## Overview

The Brand Service provides a complete API and service layer for managing material brands, including CRUD operations, filtering, pagination, status management, and integration with Supabase backend.

## Service Structure

The brand service consists of three main components:

1. **BrandApi.ts** - Direct Supabase API integration
2. **BrandService.ts** - Business logic and validation layer
3. **index.ts** - Export and convenience functions

## API Reference

### BrandApi Class

Direct Supabase integration for brand operations.

#### Methods

##### `createBrand(brandData: CreateBrandRequest): Promise<BrandApiResponse<BrandModel>>`

Creates a new brand with automatic slug generation and sort order assignment.

```typescript
const result = await BrandApi.createBrand({
  material_category_id: 1,
  title: "Nike",
  description: "Athletic wear brand",
  status: true
});
```

##### `updateBrand(brandData: UpdateBrandRequest): Promise<BrandApiResponse<BrandModel>>`

Updates an existing brand, regenerating slug if title changes.

```typescript
const result = await BrandApi.updateBrand({
  id: 1,
  title: "Nike Pro",
  description: "Updated description"
});
```

##### `getBrands(filters?: BrandFilters): Promise<BrandApiResponse<BrandModel[]>>`

Retrieves brands with optional filtering and sorting.

```typescript
const result = await BrandApi.getBrands({
  search: "nike",
  material_category_id: 1,
  status: true,
  sort_by: "title",
  sort_order: "asc",
  limit: 20,
  offset: 0
});
```

##### `getActiveBrands(categoryId?: number): Promise<BrandApiResponse<BrandModel[]>>`

Retrieves only active brands, optionally filtered by category.

```typescript
const result = await BrandApi.getActiveBrands(1);
```

##### `getBrandById(id: number): Promise<BrandApiResponse<BrandModel>>`

Retrieves a specific brand by ID.

```typescript
const result = await BrandApi.getBrandById(1);
```

##### `getBrandByName(name: string, field?: 'title' | 'slug'): Promise<BrandApiResponse<BrandModel>>`

Retrieves a brand by title or slug.

```typescript
const result = await BrandApi.getBrandByName("Nike", "title");
const result2 = await BrandApi.getBrandByName("nike", "slug");
```

##### `deleteBrand(id: number): Promise<BrandApiResponse<void>>`

Deletes a specific brand.

```typescript
const result = await BrandApi.deleteBrand(1);
```

##### `deleteBrands(ids: number[]): Promise<BrandApiResponse<void>>`

Bulk deletes multiple brands.

```typescript
const result = await BrandApi.deleteBrands([1, 2, 3]);
```

##### `updateBrandStatus(id: number, status: boolean): Promise<BrandApiResponse<BrandModel>>`

Updates brand status (active/inactive).

```typescript
const result = await BrandApi.updateBrandStatus(1, false);
```

##### `reorderBrands(brandOrders: Array<{id: number, sort_order: number}>): Promise<BrandApiResponse<void>>`

Reorders brands by updating sort_order values.

```typescript
const result = await BrandApi.reorderBrands([
  { id: 1, sort_order: 1 },
  { id: 2, sort_order: 2 }
]);
```

##### `countBrands(filters?: BrandFilters): Promise<BrandApiResponse<number>>`

Counts brands matching the given filters.

```typescript
const result = await BrandApi.countBrands({ status: true });
```

### BrandService Class

Business logic and validation layer built on top of BrandApi.

#### Methods

##### `getAllBrands(filters?: BrandFilters): Promise<BrandApiResponse<BrandModel[]>>`

Wrapper for getting all brands with filters.

##### `getActiveBrands(categoryId?: number): Promise<BrandApiResponse<BrandModel[]>>`

Get only active brands, optionally filtered by category.

##### `getBrandsByCategory(categoryId: number, includeInactive?: boolean): Promise<BrandApiResponse<BrandModel[]>>`

Get brands for a specific category.

```typescript
const result = await BrandService.getBrandsByCategory(1, false);
```

##### `getBrandById(id: number): Promise<BrandApiResponse<BrandModel>>`

Get brand by ID with validation.

##### `getBrandByTitle(title: string): Promise<BrandApiResponse<BrandModel>>`

Get brand by exact title match.

##### `getBrandBySlug(slug: string): Promise<BrandApiResponse<BrandModel>>`

Get brand by slug.

##### `searchBrands(searchTerm: string, categoryId?: number, activeOnly?: boolean): Promise<BrandApiResponse<BrandModel[]>>`

Search brands by title or description.

```typescript
const result = await BrandService.searchBrands("nike", 1, true);
```

##### `createBrand(brandData: CreateBrandRequest): Promise<BrandApiResponse<BrandModel>>`

Create brand with validation and duplicate checking.

```typescript
const result = await BrandService.createBrand({
  material_category_id: 1,
  title: "Nike",
  description: "Athletic brand"
});
```

##### `updateBrand(brandData: UpdateBrandRequest): Promise<BrandApiResponse<BrandModel>>`

Update brand with validation and duplicate checking.

##### `deleteBrand(id: number): Promise<BrandApiResponse<void>>`

Delete brand with validation.

##### `deleteBrands(ids: number[]): Promise<BrandApiResponse<void>>`

Bulk delete brands with validation.

##### `toggleBrandStatus(id: number): Promise<BrandApiResponse<BrandModel>>`

Toggle brand active/inactive status.

##### `updateBrandStatus(id: number, status: boolean): Promise<BrandApiResponse<BrandModel>>`

Set specific brand status.

##### `reorderBrands(brandOrders: Array<{id: number, sort_order: number}>): Promise<BrandApiResponse<void>>`

Reorder brands with validation.

##### `getBrandsCount(filters?: BrandFilters): Promise<BrandApiResponse<number>>`

Get count of brands matching filters.

##### `getBrandsWithPagination(page?: number, limit?: number, filters?: Omit<BrandFilters, 'limit' | 'offset'>): Promise<BrandApiResponse<{brands: BrandModel[], pagination: PaginationInfo}>>`

Get brands with pagination info.

```typescript
const result = await BrandService.getBrandsWithPagination(1, 20, {
  status: true,
  material_category_id: 1
});
```

##### `generateSlug(title: string): string`

Generate URL-friendly slug from title.

```typescript
const slug = BrandService.generateSlug("Nike Pro Max"); // "nike-pro-max"
```

## Type Definitions

### `CreateBrandRequest`

```typescript
interface CreateBrandRequest {
  material_category_id: number;
  title: string;
  description?: string | null;
  photo?: string | null;
  status?: boolean;
  sort_order?: number;
}
```

### `UpdateBrandRequest`

```typescript
interface UpdateBrandRequest {
  id: number;
  material_category_id?: number;
  title?: string;
  description?: string | null;
  photo?: string | null;
  status?: boolean;
  sort_order?: number;
}
```

### `BrandFilters`

```typescript
interface BrandFilters {
  search?: string;
  material_category_id?: number;
  status?: boolean;
  sort_by?: 'title' | 'sort_order' | 'created_at';
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}
```

### `BrandApiResponse<T>`

```typescript
interface BrandApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
}
```

## Usage Examples

### Basic CRUD Operations

```typescript
import { brandService } from '@/services/material/brandService';

// Create a brand
const createResult = await brandService.createBrand({
  material_category_id: 1,
  title: "Nike",
  description: "Athletic wear brand"
});

if (createResult.success) {
  console.log("Brand created:", createResult.data);
} else {
  console.error("Error:", createResult.error);
}

// Get brand by ID
const getResult = await brandService.getBrandById(1);

// Update brand
const updateResult = await brandService.updateBrand({
  id: 1,
  title: "Nike Pro",
  description: "Updated description"
});

// Delete brand
const deleteResult = await brandService.deleteBrand(1);
```

### Search and Filter

```typescript
// Search brands
const searchResult = await brandService.searchBrands("nike", 1, true);

// Get brands by category
const categoryResult = await brandService.getBrandsByCategory(1, false);

// Get active brands only
const activeResult = await brandService.getActiveBrands();

// Get brands with filters
const filteredResult = await brandService.getAllBrands({
  status: true,
  sort_by: "title",
  sort_order: "asc"
});
```

### Pagination

```typescript
// Get brands with pagination
const paginatedResult = await brandService.getBrandsWithPagination(1, 20, {
  status: true,
  material_category_id: 1
});

if (paginatedResult.success) {
  const { brands, pagination } = paginatedResult.data;
  console.log(`Page ${pagination.page} of ${pagination.totalPages}`);
  console.log(`Total brands: ${pagination.total}`);
  console.log("Brands:", brands);
}
```

### Status Management

```typescript
// Toggle brand status
const toggleResult = await brandService.toggleBrandStatus(1);

// Set specific status
const statusResult = await brandService.updateBrandStatus(1, false);
```

### Bulk Operations

```typescript
// Delete multiple brands
const bulkDeleteResult = await brandService.deleteBrands([1, 2, 3]);

// Reorder brands
const reorderResult = await brandService.reorderBrands([
  { id: 1, sort_order: 1 },
  { id: 2, sort_order: 2 },
  { id: 3, sort_order: 3 }
]);
```

## Error Handling

All service methods return a consistent response format with success/error indicators:

```typescript
const result = await brandService.createBrand(brandData);

if (result.success) {
  // Handle success
  console.log("Brand created:", result.data);
} else {
  // Handle error
  console.error("Failed to create brand:", result.error);
  // Show user-friendly error message
  showErrorToast(result.error);
}
```

## Validation Features

The BrandService includes built-in validation:

1. **Required Field Validation**: Ensures title and category_id are provided
2. **Duplicate Title Checking**: Prevents duplicate titles within the same category
3. **Data Sanitization**: Trims whitespace from text fields
4. **ID Validation**: Ensures valid positive IDs for operations

## Performance Considerations

1. **Efficient Filtering**: Database-level filtering reduces data transfer
2. **Pagination Support**: Handles large datasets efficiently
3. **Bulk Operations**: Supports bulk delete and reorder operations
4. **Optimized Queries**: Uses appropriate Supabase query patterns

## Integration with Redux

The brand service is designed to work seamlessly with the Redux `brandSlice`:

```typescript
// In Redux thunk
export const fetchBrands = createAsyncThunk(
  'brands/fetchBrands',
  async (_, { rejectWithValue }) => {
    try {
      const result = await brandService.getAllBrands();
      if (result.success) {
        return result.data;
      }
      throw new Error(result.error);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

## Database Schema

The service expects the following Supabase table structure for `material_brand`:

```sql
CREATE TABLE material_brand (
  id SERIAL PRIMARY KEY,
  material_category_id INTEGER REFERENCES material_category(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  photo VARCHAR(500),
  status BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Best Practices

1. **Always Check Success**: Check the `success` field before using `data`
2. **Handle Errors Gracefully**: Provide user-friendly error messages
3. **Use Type Safety**: Leverage TypeScript types for better development experience
4. **Validate Input**: The service validates, but client-side validation improves UX
5. **Optimize Queries**: Use appropriate filters to minimize data transfer
6. **Cache Considerations**: Consider caching frequently accessed brands

This service provides a robust, type-safe, and efficient way to manage material brands in your application.
