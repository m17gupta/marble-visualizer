import { CategoryApi, CreateCategoryRequest, UpdateCategoryRequest, CategoryQueryParams, CategoryListResponse } from './CatergoryApi';
import { CategoryModel } from '@/models/swatchBook/category/CategoryModel';

// Service Result Type
interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Service Class
export class CategoryService {

  private static instance: CategoryService;

  // Singleton pattern
  public static getInstance(): CategoryService {
    if (!CategoryService.instance) {
      CategoryService.instance = new CategoryService();
    }
    return CategoryService.instance;
  }

  /**
   * Create a new category
   * @param categoryData - Category data to create
   * @returns Promise with category creation result
   */
  async createCategory(categoryData: CreateCategoryRequest): Promise<ServiceResult<CategoryModel>> {
    try {
      // Generate slug if not provided
      if (!categoryData.slug && categoryData.title) {
        categoryData.slug = this.generateSlug(categoryData.title);
      }

      // Set default sort order if not provided
      if (!categoryData.sort_order) {
        categoryData.sort_order = await this.getNextSortOrder();
      }

      // Set default status if not provided
      if (categoryData.status === undefined) {
        categoryData.status = true;
      }

      const response = await CategoryApi.create(categoryData);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data,
          message: 'Category created successfully'
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to create category'
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Update an existing category
   * @param id - Category ID
   * @param categoryData - Updated category data
   * @returns Promise with category update result
   */
  async updateCategory(id: number, categoryData: UpdateCategoryRequest): Promise<ServiceResult<CategoryModel>> {
    try {
      // Generate slug if title is being updated but slug is not provided
      if (categoryData.title && !categoryData.slug) {
        categoryData.slug = this.generateSlug(categoryData.title);
      }

      const response = await CategoryApi.update(id, categoryData);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data,
          message: 'Category updated successfully'
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to update category'
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get all categories with optional filtering and pagination
   * @param params - Query parameters for filtering and pagination
   * @returns Promise with categories list
   */
  async getAllCategories(params?: CategoryQueryParams): Promise<ServiceResult<CategoryModel[]>> {
    try {
      const response = await CategoryApi.getAll(params);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data,
          message: `Retrieved ${response.data.length} categories`
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to fetch categories'
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async getCategoryByName(identifier: string[]): Promise<CategoryListResponse> {
    
      return await CategoryApi.findByName(identifier);
        
  }


  /**
   * Get category by ID
   * @param id - Category ID
   * @returns Promise with category data
   */
  async getCategoryById(id: number): Promise<ServiceResult<CategoryModel>> {
    try {
      const response = await CategoryApi.findById(id);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data,
          message: 'Category retrieved successfully'
        };
      }

      return {
        success: false,
        error: response.error || 'Category not found'
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }



  /**
   * Delete a category
   * @param id - Category ID
   * @returns Promise with deletion result
   */
  async deleteCategory(id: number): Promise<ServiceResult<void>> {
    try {
      const response = await CategoryApi.delete(id);
      
      if (response.success) {
        return {
          success: true,
          message: 'Category deleted successfully'
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to delete category'
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Bulk delete categories
   * @param ids - Array of category IDs
   * @returns Promise with bulk deletion result
   */
  async bulkDeleteCategories(ids: number[]): Promise<ServiceResult<void>> {
    try {
      if (!ids || ids.length === 0) {
        return {
          success: false,
          error: 'No category IDs provided'
        };
      }

      const response = await CategoryApi.bulkDelete(ids);
      
      if (response.success) {
        return {
          success: true,
          message: `${ids.length} categories deleted successfully`
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to delete categories'
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Update category status
   * @param id - Category ID
   * @param status - New status (active/inactive)
   * @returns Promise with status update result
   */
  async updateCategoryStatus(id: number, status: boolean): Promise<ServiceResult<CategoryModel>> {
    try {
      const response = await CategoryApi.updateStatus(id, status);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data,
          message: `Category ${status ? 'activated' : 'deactivated'} successfully`
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to update category status'
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Reorder categories
   * @param categoryOrders - Array of category ID and sort order pairs
   * @returns Promise with reorder result
   */
  async reorderCategories(categoryOrders: Array<{ id: number; sort_order: number }>): Promise<ServiceResult<void>> {
    try {
      if (!categoryOrders || categoryOrders.length === 0) {
        return {
          success: false,
          error: 'No category orders provided'
        };
      }

      const response = await CategoryApi.reorder(categoryOrders);
      
      if (response.success) {
        return {
          success: true,
          message: 'Categories reordered successfully'
        };
      }

      return {
        success: false,
        error: response.error || 'Failed to reorder categories'
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get active categories only
   * @returns Promise with active categories
   */
  async getActiveCategories(): Promise<ServiceResult<CategoryModel[]>> {
    return this.getAllCategories({ status: true, sort_by: 'sort_order', sort_order: 'asc' });
  }

  /**
   * Search categories by title
   * @param searchTerm - Search term
   * @returns Promise with search results
   */
  async searchCategories(searchTerm: string): Promise<ServiceResult<CategoryModel[]>> {
    return this.getAllCategories({ search: searchTerm, status: true });
  }

  // Private utility methods

  /**
   * Generate slug from title
   * @param title - Category title
   * @returns Generated slug
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  /**
   * Get the next sort order value
   * @returns Promise with next sort order
   */
  private async getNextSortOrder(): Promise<number> {
    try {
      const response = await this.getAllCategories({ sort_by: 'sort_order', sort_order: 'desc', limit: 1 });
      
      if (response.success && response.data && response.data.length > 0) {
        return response.data[0].sort_order + 1;
      }
      
      return 1; // Default sort order for first category
    } catch {
      return 1; // Fallback to default
    }
  }
}

// Export singleton instance
export const categoryService = CategoryService.getInstance();

