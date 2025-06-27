# Category Service Usage Examples

This document provides examples of how to use the CategoryService and CategoryApi for CRUD operations.

## Import the Service

```typescript
import { categoryService, CategoryService, CategoryApi } from '@/services/material/categoryService';
import type { CreateCategoryRequest, UpdateCategoryRequest } from '@/services/material/categoryService';
```

## Basic CRUD Operations

### 1. Create a Category

```typescript
const createCategory = async () => {
  const categoryData: CreateCategoryRequest = {
    title: 'Premium Paints',
    description: 'High-quality premium paint collection',
    status: true,
    sort_order: 1
    // slug will be auto-generated from title if not provided
  };

  const result = await categoryService.createCategory(categoryData);
  
  if (result.success) {
    console.log('Category created:', result.data);
    console.log('Message:', result.message);
  } else {
    console.error('Error:', result.error);
  }
};
```

### 2. Update a Category

```typescript
const updateCategory = async (categoryId: number) => {
  const updateData: UpdateCategoryRequest = {
    title: 'Premium Paints & Coatings',
    description: 'Updated description for premium paints',
    status: true
  };

  const result = await categoryService.updateCategory(categoryId, updateData);
  
  if (result.success) {
    console.log('Category updated:', result.data);
  } else {
    console.error('Error:', result.error);
  }
};
```

### 3. Get All Categories

```typescript
const getAllCategories = async () => {
  const result = await categoryService.getAllCategories({
    page: 1,
    limit: 10,
    status: true,
    sort_by: 'sort_order',
    sort_order: 'asc'
  });
  
  if (result.success) {
    console.log('Categories:', result.data);
  } else {
    console.error('Error:', result.error);
  }
};
```

### 4. Get Category by ID

```typescript
const getCategoryById = async (categoryId: number) => {
  const result = await categoryService.getCategoryById(categoryId);
  
  if (result.success) {
    console.log('Category found:', result.data);
  } else {
    console.error('Error:', result.error);
  }
};
```

### 5. Get Category by Slug or Title

```typescript
const getCategoryBySlug = async (slug: string) => {
  const result = await categoryService.getCategoryByName(slug, 'slug');
  
  if (result.success) {
    console.log('Category found by slug:', result.data);
  } else {
    console.error('Error:', result.error);
  }
};

const getCategoryByTitle = async (title: string) => {
  const result = await categoryService.getCategoryByName(title, 'title');
  
  if (result.success) {
    console.log('Category found by title:', result.data);
  } else {
    console.error('Error:', result.error);
  }
};
```

### 6. Delete a Category

```typescript
const deleteCategory = async (categoryId: number) => {
  const result = await categoryService.deleteCategory(categoryId);
  
  if (result.success) {
    console.log('Message:', result.message);
  } else {
    console.error('Error:', result.error);
  }
};
```

## Advanced Operations

### 1. Get Active Categories Only

```typescript
const getActiveCategories = async () => {
  const result = await categoryService.getActiveCategories();
  
  if (result.success) {
    console.log('Active categories:', result.data);
  } else {
    console.error('Error:', result.error);
  }
};
```

### 2. Search Categories

```typescript
const searchCategories = async (searchTerm: string) => {
  const result = await categoryService.searchCategories(searchTerm);
  
  if (result.success) {
    console.log('Search results:', result.data);
  } else {
    console.error('Error:', result.error);
  }
};
```

### 3. Update Category Status

```typescript
const toggleCategoryStatus = async (categoryId: number, newStatus: boolean) => {
  const result = await categoryService.updateCategoryStatus(categoryId, newStatus);
  
  if (result.success) {
    console.log('Status updated:', result.data);
    console.log('Message:', result.message);
  } else {
    console.error('Error:', result.error);
  }
};
```

### 4. Bulk Delete Categories

```typescript
const bulkDeleteCategories = async (categoryIds: number[]) => {
  const result = await categoryService.bulkDeleteCategories(categoryIds);
  
  if (result.success) {
    console.log('Message:', result.message);
  } else {
    console.error('Error:', result.error);
  }
};
```

### 5. Reorder Categories

```typescript
const reorderCategories = async () => {
  const categoryOrders = [
    { id: 1, sort_order: 3 },
    { id: 2, sort_order: 1 },
    { id: 3, sort_order: 2 }
  ];

  const result = await categoryService.reorderCategories(categoryOrders);
  
  if (result.success) {
    console.log('Message:', result.message);
  } else {
    console.error('Error:', result.error);
  }
};
```

## Using the API Directly

If you need more control, you can use the CategoryApi class directly:

```typescript
import { CategoryApi } from '@/services/material/categoryService';

const createCategoryWithApi = async () => {
  const response = await CategoryApi.create({
    title: 'Direct API Category',
    description: 'Created using API directly',
    status: true
  });
  
  if (response.success) {
    console.log('API Response:', response);
  } else {
    console.error('API Error:', response.error);
  }
};
```

## Error Handling

All service methods return a consistent result format:

```typescript
interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

Always check the `success` property before accessing `data`:

```typescript
const handleCategoryOperation = async () => {
  const result = await categoryService.getAllCategories();
  
  if (result.success && result.data) {
    // Safe to use result.data
    result.data.forEach(category => {
      console.log(category.title);
    });
  } else {
    // Handle error
    console.error('Operation failed:', result.error);
  }
};
```

## React Component Example

```typescript
import React, { useState, useEffect } from 'react';
import { categoryService } from '@/services/material/categoryService';
import type { CategoryModel } from '@/models/swatchBook/category/CategoryModel';

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const result = await categoryService.getActiveCategories();
        
        if (result.success && result.data) {
          setCategories(result.data);
          setError(null);
        } else {
          setError(result.error || 'Failed to fetch categories');
        }
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDeleteCategory = async (categoryId: number) => {
    const result = await categoryService.deleteCategory(categoryId);
    
    if (result.success) {
      // Remove from local state
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    } else {
      setError(result.error || 'Failed to delete category');
    }
  };

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Categories</h2>
      {categories.map(category => (
        <div key={category.id}>
          <h3>{category.title}</h3>
          <p>{category.description}</p>
          <button onClick={() => handleDeleteCategory(category.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
```
