import { BrandApi, CreateBrandRequest, UpdateBrandRequest, BrandFilters, BrandApiResponse } from './BrandApi';
import { BrandModel } from '@/models/swatchBook/brand/BrandModel';

export class BrandService {
  /**
   * Get all brands with optional filtering and pagination
   */
  static async getAllBrands(filters: BrandFilters = {}): Promise<BrandApiResponse<BrandModel[]>> {
    return BrandApi.getBrands(filters);
  }

  /**
   * Get active brands only, optionally filtered by category
   */
  static async getActiveBrands(categoryId?: number): Promise<BrandApiResponse<BrandModel[]>> {
    return BrandApi.getActiveBrands(categoryId);
  }

  /**
   * Get brands by category ID
   */
  static async getBrandsByCategory(categoryId: number, includeInactive = false): Promise<BrandApiResponse<BrandModel[]>> {
    const filters: BrandFilters = {
      material_category_id: categoryId,
      sort_by: 'sort_order',
      sort_order: 'asc',
    };

    if (!includeInactive) {
      filters.status = true;
    }

    return BrandApi.getBrands(filters);
  }

  /**
   * Get brand by ID
   */
  static async getBrandById(id: number): Promise<BrandApiResponse<BrandModel>> {
    return BrandApi.getBrandById(id);
  }

  /**
   * Get brand by title
   */
  static async getBrandByTitle(title: string): Promise<BrandApiResponse<BrandModel>> {
    return BrandApi.getBrandByName(title, 'title');
  }

  /**
   * Get brand by slug
   */
  static async getBrandBySlug(slug: string): Promise<BrandApiResponse<BrandModel>> {
    return BrandApi.getBrandByName(slug, 'slug');
  }

  /**
   * Search brands by title or description
   */
  static async searchBrands(
    searchTerm: string,
    categoryId?: number,
    activeOnly = true
  ): Promise<BrandApiResponse<BrandModel[]>> {
    const filters: BrandFilters = {
      search: searchTerm,
      sort_by: 'title',
      sort_order: 'asc',
    };

    if (categoryId !== undefined) {
      filters.material_category_id = categoryId;
    }

    if (activeOnly) {
      filters.status = true;
    }

    return BrandApi.getBrands(filters);
  }

  /**
   * Create a new brand
   */
  static async createBrand(brandData: CreateBrandRequest): Promise<BrandApiResponse<BrandModel>> {
    // Validate required fields
    if (!brandData.title?.trim()) {
      return {
        success: false,
        error: 'Brand title is required',
      };
    }

    if (!brandData.material_category_id || brandData.material_category_id <= 0) {
      return {
        success: false,
        error: 'Valid category ID is required',
      };
    }

    // Check if brand with same title already exists in the same category
    const existingBrand = await this.checkBrandTitleExists(brandData.title, brandData.material_category_id);
    if (existingBrand.success && existingBrand.data) {
      return {
        success: false,
        error: 'A brand with this title already exists in this category',
      };
    }

    return BrandApi.createBrand({
      ...brandData,
      title: brandData.title.trim(),
      description: brandData.description?.trim() || null,
    });
  }

  /**
   * Update an existing brand
   */
  static async updateBrand(brandData: UpdateBrandRequest): Promise<BrandApiResponse<BrandModel>> {
    if (!brandData.id || brandData.id <= 0) {
      return {
        success: false,
        error: 'Valid brand ID is required',
      };
    }

    // If updating title, check if it already exists in the same category
    if (brandData.title) {
      const trimmedTitle = brandData.title.trim();
      if (!trimmedTitle) {
        return {
          success: false,
          error: 'Brand title cannot be empty',
        };
      }

      // Get current brand to check category
      const currentBrand = await BrandApi.getBrandById(brandData.id);
      if (!currentBrand.success || !currentBrand.data) {
        return {
          success: false,
          error: 'Brand not found',
        };
      }

      const categoryId = brandData.material_category_id || currentBrand.data.material_category_id;
      if (categoryId !== undefined) {
        const existingBrand = await this.checkBrandTitleExists(trimmedTitle, categoryId, brandData.id);
        if (existingBrand.success && existingBrand.data) {
          return {
            success: false,
            error: 'A brand with this title already exists in this category',
          };
        }
      }

      brandData.title = trimmedTitle;
    }

    if (brandData.description !== undefined) {
      brandData.description = brandData.description?.trim() || null;
    }

    return BrandApi.updateBrand(brandData);
  }

  /**
   * Delete a brand
   */
  static async deleteBrand(id: number): Promise<BrandApiResponse<void>> {
    if (!id || id <= 0) {
      return {
        success: false,
        error: 'Valid brand ID is required',
      };
    }

    return BrandApi.deleteBrand(id);
  }

  /**
   * Delete multiple brands
   */
  static async deleteBrands(ids: number[]): Promise<BrandApiResponse<void>> {
    if (!ids?.length) {
      return {
        success: false,
        error: 'At least one brand ID is required',
      };
    }

    const validIds = ids.filter(id => id > 0);
    if (validIds.length !== ids.length) {
      return {
        success: false,
        error: 'All brand IDs must be valid positive numbers',
      };
    }

    return BrandApi.deleteBrands(validIds);
  }

  /**
   * Toggle brand status (active/inactive)
   */
  static async toggleBrandStatus(id: number): Promise<BrandApiResponse<BrandModel>> {
    const currentBrand = await BrandApi.getBrandById(id);
    if (!currentBrand.success || !currentBrand.data) {
      return {
        success: false,
        error: 'Brand not found',
      };
    }

    return BrandApi.updateBrandStatus(id, !currentBrand.data.status);
  }

  /**
   * Update brand status
   */
  static async updateBrandStatus(id: number, status: boolean): Promise<BrandApiResponse<BrandModel>> {
    if (!id || id <= 0) {
      return {
        success: false,
        error: 'Valid brand ID is required',
      };
    }

    return BrandApi.updateBrandStatus(id, status);
  }

  /**
   * Reorder brands
   */
  static async reorderBrands(brandOrders: { id: number; sort_order: number }[]): Promise<BrandApiResponse<void>> {
    if (!brandOrders?.length) {
      return {
        success: false,
        error: 'Brand order data is required',
      };
    }

    // Validate all entries have valid IDs and sort orders
    for (const item of brandOrders) {
      if (!item.id || item.id <= 0) {
        return {
          success: false,
          error: 'All brand IDs must be valid positive numbers',
        };
      }
      if (typeof item.sort_order !== 'number') {
        return {
          success: false,
          error: 'All sort orders must be valid numbers',
        };
      }
    }

    return BrandApi.reorderBrands(brandOrders);
  }

  /**
   * Get brands count with optional filters
   */
  static async getBrandsCount(filters: BrandFilters = {}): Promise<BrandApiResponse<number>> {
    return BrandApi.countBrands(filters);
  }

  /**
   * Get brands with pagination
   */
  static async getBrandsWithPagination(
    page = 1,
    limit = 20,
    filters: Omit<BrandFilters, 'limit' | 'offset'> = {}
  ): Promise<BrandApiResponse<{ brands: BrandModel[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>> {
    const offset = (page - 1) * limit;
    
    // Get brands with pagination
    const brandsResult = await BrandApi.getBrands({
      ...filters,
      limit,
      offset,
    });

    if (!brandsResult.success) {
      return {
        success: false,
        error: brandsResult.error,
      };
    }

    // Get total count
    const countResult = await BrandApi.countBrands(filters);
    const total = countResult.success ? countResult.data || 0 : 0;
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: {
        brands: brandsResult.data || [],
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    };
  }

  /**
   * Generate slug from title
   */
  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * Check if brand title exists in a category (excluding a specific brand ID for updates)
   */
  private static async checkBrandTitleExists(
    title: string,
    categoryId: number,
    excludeId?: number
  ): Promise<BrandApiResponse<BrandModel>> {
    const filters: BrandFilters = {
      search: title,
      material_category_id: categoryId,
    };

    const result = await BrandApi.getBrands(filters);
    if (!result.success || !result.data) {
      return { success: false };
    }

    // Find exact title match
    const exactMatch = result.data.find(
      brand => brand.title.toLowerCase() === title.toLowerCase() && 
      (!excludeId || brand.id !== excludeId)
    );

    return {
      success: true,
      data: exactMatch,
    };
  }
}

// Export types for external use
export type { CreateBrandRequest, UpdateBrandRequest, BrandFilters, BrandApiResponse };
export { BrandApi };
