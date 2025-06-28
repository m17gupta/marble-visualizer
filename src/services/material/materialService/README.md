# Material Service Documentation

This document provides comprehensive information about the Material Service API and Service layer for managing materials in the application.

## Overview

The Material Service provides a complete API and service layer for managing materials, including CRUD operations, filtering, pagination, advanced search, and integration with categories and brands.

## Service Structure

The material service consists of three main components:

1. **MaterialApi.ts** - Direct Supabase API integration
2. **MaterialService.ts** - Business logic and validation layer
3. **index.ts** - Export and convenience functions

## API Reference

### MaterialApi Class

Direct Supabase integration for material operations.

#### API Methods

- `createMaterial(materialData)` - Create a new material
- `getMaterials(filters)` - Get materials with pagination and filtering
- `getMaterialById(id)` - Get material by ID
- `getMaterialsByRoleId(roleId, filters)` - Get materials by role ID
- `getMaterialsBySegment(segment, filters)` - Get materials by segment
- `updateMaterial(materialData)` - Update existing material
- `deleteMaterial(id)` - Delete material by ID
- `toggleMaterialStatus(id)` - Toggle material active status
- `getMaterialCount(filters)` - Get total count of materials

### MaterialService Class

Business logic and validation layer built on top of MaterialApi.

#### Service Methods

Same as MaterialApi plus additional validation and error handling.

## Type Definitions

### `MaterialModel`

```typescript
interface MaterialModel {
  id: number;
  bucket_path: string;
  color: string;
  created: string; // ISO date string
  description: string;
  finish_needed: boolean;
  is_admin: boolean;
  is_featured: boolean;
  modified: string; // ISO date string
  photo: string;
  related_material_1: number;
  related_material_2: number;
  role_id: number;
  segment_1: string;
  segment_2: string;
  status: boolean;
  title: string;
  new_bucket: boolean;
}
```

### `CreateMaterialRequest`

```typescript
interface CreateMaterialRequest {
  bucket_path: string;
  color: string;
  description: string;
  finish_needed: boolean;
  is_admin?: boolean;
  is_featured?: boolean;
  photo: string;
  related_material_1?: number;
  related_material_2?: number;
  role_id: number;
  segment_1: string;
  segment_2: string;
  status?: boolean;
  title: string;
  new_bucket?: boolean;
}
```

### `UpdateMaterialRequest`

```typescript
interface UpdateMaterialRequest {
  id: number;
  bucket_path?: string;
  color?: string;
  description?: string;
  finish_needed?: boolean;
  is_admin?: boolean;
  is_featured?: boolean;
  photo?: string;
  related_material_1?: number;
  related_material_2?: number;
  role_id?: number;
  segment_1?: string;
  segment_2?: string;
  status?: boolean;
  title?: string;
  new_bucket?: boolean;
}
```

### `MaterialFilters`

```typescript
interface MaterialFilters {
  search?: string;
  role_id?: number;
  segment_1?: string;
  segment_2?: string;
  color?: string;
  finish_needed?: boolean;
  is_admin?: boolean;
  is_featured?: boolean;
  status?: boolean;
  sort_by?: 'title' | 'color' | 'segment_1' | 'segment_2' | 'created' | 'modified';
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
```

### `MaterialApiResponse<T>`

```typescript
interface MaterialApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
  total?: number;
  page?: number;
  totalPages?: number;
}
```

### `PaginatedMaterialResponse`

```typescript
interface PaginatedMaterialResponse {
  materials: MaterialModel[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

## Usage Examples

### Basic CRUD Operations

```typescript
import { materialService } from '@/services/material/materialService';

// Create a material
const createResult = await materialService.createMaterial({
  bucket_path: "materials/textures/fabric001",
  color: "#8B4513",
  description: "Premium velvet fabric with soft texture",
  finish_needed: true,
  is_admin: false,
  is_featured: true,
  photo: "fabric001.jpg",
  related_material_1: 2,
  related_material_2: 3,
  role_id: 1,
  segment_1: "luxury",
  segment_2: "fabric",
  status: true,
  title: "Premium Velvet Fabric",
  new_bucket: false
});

if (createResult.success) {
  console.log("Material created:", createResult.data);
} else {
  console.error("Error:", createResult.error);
}

// Get material by ID
const getResult = await materialService.getMaterialById(1);

// Update material
const updateResult = await materialService.updateMaterial({
  id: 1,
  title: "Premium Velvet Fabric - Updated",
  color: "#654321",
  description: "Updated luxury velvet fabric with enhanced texture"
});

// Delete material
const deleteResult = await materialService.deleteMaterial(1);
```

### Pagination and Filtering

```typescript
// Get materials with pagination
const paginatedResult = await materialService.getMaterials({
  page: 1,
  limit: 20,
  sort_by: 'created',
  sort_order: 'desc'
});

// Filter by role ID
const roleResult = await materialService.getMaterialsByRoleId(1, {
  page: 1,
  limit: 10,
  status: true
});

// Filter by segment
const segmentResult = await materialService.getMaterialsBySegment('luxury', {
  segment_2: 'fabric',
  is_featured: true
});

// Search by text
const searchResult = await materialService.getMaterials({
  search: "velvet",
  role_id: 1,
  color: "#8B4513"
});

// Get featured materials
const featuredResult = await materialService.getMaterials({
  is_featured: true,
  page: 1,
  limit: 10
});
```

### Advanced Filtering

```typescript
// Complex filtering example
const advancedResult = await materialService.getMaterials({
  search: 'fabric',
  role_id: 1,
  segment_1: 'luxury',
  segment_2: 'fabric',
  color: '#8B4513',
  finish_needed: true,
  is_featured: true,
  status: true,
  sort_by: 'title',
  sort_order: 'asc',
  page: 1,
  limit: 20
});

if (advancedResult.success) {
  const { materials, pagination } = advancedResult.data!;
  console.log(`Found ${materials.length} materials`);
  console.log(`Page ${pagination.page} of ${pagination.totalPages}`);
  console.log(`Total: ${pagination.total} materials`);
}
```

### Status Management

```typescript
// Toggle material status
const toggleResult = await materialService.toggleMaterialStatus(1);

// Get only active materials
const activeResult = await materialService.getMaterials({
  status: true,
  page: 1,
  limit: 20
});
```

### Bulk Operations

```typescript
// Delete multiple materials
const bulkDeleteResult = await materialService.bulkDeleteMaterials([1, 2, 3]);

// Get total count
const countResult = await materialService.getMaterialCount();

// Get count with filters
const filteredCountResult = await materialService.getMaterialCount({
  role_id: 1,
  is_featured: true,
  status: true
});
```

## Error Handling

All service methods return a consistent response format with success/error indicators:

```typescript
const result = await materialService.createMaterial(materialData);

if (result.success) {
  // Handle success
  console.log("Material created:", result.data);
  console.log("Message:", result.message);
} else {
  // Handle error
  console.error("Failed to create material:", result.error);
  // Show user-friendly error message
  showErrorToast(result.error);
}
```

## Validation Features

The MaterialService includes built-in validation:

1. **Required Field Validation**: Ensures title, bucket_path, color, description, role_id, segment_1, and segment_2 are provided
2. **Data Sanitization**: Trims whitespace from text fields
3. **ID Validation**: Ensures valid positive IDs for operations
4. **Boolean Validation**: Validates boolean fields like finish_needed, is_admin, is_featured, status, and new_bucket
5. **Pagination Limits**: Enforces reasonable pagination limits (max 100 per page)
6. **Color Code Validation**: Validates color format if provided
7. **Segment Validation**: Ensures segment fields are non-empty strings when provided

## Performance Considerations

1. **Efficient Filtering**: Database-level filtering reduces data transfer
2. **Pagination Support**: Handles large datasets efficiently with configurable page sizes
3. **Bulk Operations**: Supports bulk delete and reorder operations
4. **Optimized Queries**: Uses appropriate Supabase query patterns with joins
5. **Index Support**: Designed to work with database indexes on common filter fields

## Integration with Redux

The material service is designed to work seamlessly with Redux:

```typescript
// In Redux thunk
export const fetchMaterials = createAsyncThunk(
  'materials/fetchMaterials',
  async (filters: MaterialFilters, { rejectWithValue }) => {
    try {
      const result = await materialService.getMaterials(filters);
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

The service expects the following Supabase table structure for `materials`:

```sql
CREATE TABLE materials (
  id SERIAL PRIMARY KEY,
  bucket_path VARCHAR(500) NOT NULL,
  color VARCHAR(20) NOT NULL,
  created TIMESTAMP DEFAULT NOW(),
  description TEXT NOT NULL,
  finish_needed BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  modified TIMESTAMP DEFAULT NOW(),
  photo VARCHAR(500) NOT NULL,
  related_material_1 INTEGER REFERENCES materials(id) ON DELETE SET NULL,
  related_material_2 INTEGER REFERENCES materials(id) ON DELETE SET NULL,
  role_id INTEGER NOT NULL,
  segment_1 VARCHAR(100) NOT NULL,
  segment_2 VARCHAR(100) NOT NULL,
  status BOOLEAN DEFAULT TRUE,
  title VARCHAR(255) NOT NULL,
  new_bucket BOOLEAN DEFAULT FALSE
);

-- Indexes for better performance
CREATE INDEX idx_materials_role_id ON materials(role_id);
CREATE INDEX idx_materials_segment_1 ON materials(segment_1);
CREATE INDEX idx_materials_segment_2 ON materials(segment_2);
CREATE INDEX idx_materials_color ON materials(color);
CREATE INDEX idx_materials_status ON materials(status);
CREATE INDEX idx_materials_featured ON materials(is_featured);
CREATE INDEX idx_materials_admin ON materials(is_admin);
CREATE INDEX idx_materials_finish_needed ON materials(finish_needed);
CREATE INDEX idx_materials_created ON materials(created);
CREATE INDEX idx_materials_modified ON materials(modified);
CREATE INDEX idx_materials_search ON materials USING GIN(to_tsvector('english', title || ' ' || description));

-- Trigger to update modified timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.modified = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_materials_modified 
    BEFORE UPDATE ON materials 
    FOR EACH ROW 
    EXECUTE FUNCTION update_modified_column();
```

## Best Practices

1. **Always Check Success**: Check the `success` field before using `data`
2. **Handle Errors Gracefully**: Provide user-friendly error messages
3. **Use Type Safety**: Leverage TypeScript types for better development experience
4. **Validate Input**: The service validates, but client-side validation improves UX
5. **Optimize Queries**: Use appropriate filters to minimize data transfer
6. **Cache Considerations**: Consider caching frequently accessed materials
7. **Pagination**: Always use pagination for large datasets
8. **Proper Indexing**: Ensure database indexes are in place for filtered fields
9. **Segment Organization**: Use segment_1 and segment_2 consistently for categorization
10. **Related Materials**: Leverage related_material_1 and related_material_2 for recommendations
11. **Role-based Access**: Use role_id for proper access control and filtering
12. **Photo Management**: Ensure bucket_path and photo fields are properly managed with S3

This service provides a robust, type-safe, and efficient way to manage materials in your application with full support for pagination, advanced filtering, and role-based access control using the new MaterialModel structure.
