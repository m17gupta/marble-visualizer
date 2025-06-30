import { StyleApi, CreateStyleRequest, UpdateStyleRequest, StyleFilters, StyleApiResponse } from './StyleApi';
import { StyleModel } from '@/models/swatchBook/styleModel/StyleModel';

export class StyleService {
  /**
   * Get all styles with optional filtering and pagination
   */
  static async getAllStyles(filters: StyleFilters = {}): Promise<StyleApiResponse<StyleModel[]>> {
    return StyleApi.getStyles(filters);
  }

  /**
   * Get active styles only, optionally filtered by brand
   */
  static async getActiveStyles(brandId?: number): Promise<StyleApiResponse<StyleModel[]>> {
    return StyleApi.getActiveStyles(brandId);
  }

  /**
   * Get styles by brand ID
   */
  static async getStylesByBrand(brandId: number, includeInactive = false): Promise<StyleApiResponse<StyleModel[]>> {
    const filters: StyleFilters = {
      material_brand_id: brandId,
      sort_by: 'sort_order',
      sort_order: 'asc',
    };

    if (!includeInactive) {
      filters.status = true;
    }

    return StyleApi.getStyles(filters);
  }

  /**
   * Get style by ID
   */
  static async getStyleById(id: number): Promise<StyleApiResponse<StyleModel>> {
    return StyleApi.getStyleById(id);
  }

  /**
   * Get style by title
   */
  static async getStyleByTitle(title: string): Promise<StyleApiResponse<StyleModel>> {
    return StyleApi.getStyleByName(title, 'title');
  }

  /**
   * Get style by slug
   */
  static async getStyleBySlug(slug: string): Promise<StyleApiResponse<StyleModel>> {
    return StyleApi.getStyleByName(slug, 'slug');
  }

  /**
   * Search styles by title or description
   */
  static async searchStyles(
    searchTerm: string,
    brandId?: number,
    activeOnly = true
  ): Promise<StyleApiResponse<StyleModel[]>> {
    const filters: StyleFilters = {
      search: searchTerm,
      sort_by: 'title',
      sort_order: 'asc',
    };

    if (brandId !== undefined) {
      filters.material_brand_id = brandId;
    }

    if (activeOnly) {
      filters.status = true;
    }

    return StyleApi.getStyles(filters);
  }

  /**
   * Create a new style
   */
  static async createStyle(styleData: CreateStyleRequest): Promise<StyleApiResponse<StyleModel>> {
    // Validate required fields
    if (!styleData.title?.trim()) {
      return {
        success: false,
        error: 'Style title is required',
      };
    }

    if (!styleData.material_brand_id || styleData.material_brand_id <= 0) {
      return {
        success: false,
        error: 'Valid brand ID is required',
      };
    }

    // Check for duplicate title within the same brand
    const existingResult = await this.searchStyles(styleData.title, styleData.material_brand_id, false);
    if (existingResult.success && existingResult.data && existingResult.data.length > 0) {
      const duplicate = existingResult.data.find(
        style => style.title.toLowerCase() === styleData.title.toLowerCase()
      );
      if (duplicate) {
        return {
          success: false,
          error: 'A style with this title already exists in this brand',
        };
      }
    }

    return StyleApi.createStyle(styleData);
  }

  /**
   * Update an existing style
   */
  static async updateStyle(styleData: UpdateStyleRequest): Promise<StyleApiResponse<StyleModel>> {
    // Validate ID
    if (!styleData.id || styleData.id <= 0) {
      return {
        success: false,
        error: 'Valid style ID is required',
      };
    }

    // Check if style exists
    const existingResult = await this.getStyleById(styleData.id);
    if (!existingResult.success || !existingResult.data) {
      return {
        success: false,
        error: 'Style not found',
      };
    }

    // If title is being updated, check for duplicates within the brand
    if (styleData.title && styleData.title.trim() !== existingResult.data.title) {
      const brandId = styleData.material_brand_id || existingResult.data.material_brand_id;
      const duplicateResult = await this.searchStyles(styleData.title.trim(), brandId, false);
      
      if (duplicateResult.success && duplicateResult.data && duplicateResult.data.length > 0) {
        const duplicate = duplicateResult.data.find(
          style => 
            style.id !== styleData.id && 
            style.title.toLowerCase() === styleData.title!.toLowerCase()
        );
        if (duplicate) {
          return {
            success: false,
            error: 'A style with this title already exists in this brand',
          };
        }
      }
    }

    return StyleApi.updateStyle(styleData);
  }

  /**
   * Delete a style
   */
  static async deleteStyle(id: number): Promise<StyleApiResponse<void>> {
    // Validate ID
    if (!id || id <= 0) {
      return {
        success: false,
        error: 'Valid style ID is required',
      };
    }

    // Check if style exists
    const existingResult = await this.getStyleById(id);
    if (!existingResult.success || !existingResult.data) {
      return {
        success: false,
        error: 'Style not found',
      };
    }

    return StyleApi.deleteStyle(id);
  }

  /**
   * Delete multiple styles
   */
  static async deleteStyles(ids: number[]): Promise<StyleApiResponse<void>> {
    // Validate IDs
    if (!ids || ids.length === 0) {
      return {
        success: false,
        error: 'At least one style ID is required',
      };
    }

    const invalidIds = ids.filter(id => !id || id <= 0);
    if (invalidIds.length > 0) {
      return {
        success: false,
        error: 'All style IDs must be valid positive numbers',
      };
    }

    return StyleApi.deleteStyles(ids);
  }

  /**
   * Toggle style status
   */
  static async toggleStyleStatus(id: number): Promise<StyleApiResponse<StyleModel>> {
    // Validate ID
    if (!id || id <= 0) {
      return {
        success: false,
        error: 'Valid style ID is required',
      };
    }

    return StyleApi.toggleStyleStatus(id);
  }

  /**
   * Update style status
   */
  static async updateStyleStatus(id: number, status: boolean): Promise<StyleApiResponse<StyleModel>> {
    // Validate ID
    if (!id || id <= 0) {
      return {
        success: false,
        error: 'Valid style ID is required',
      };
    }

    return StyleApi.updateStyleStatus(id, status);
  }

  /**
   * Reorder styles
   */
  static async reorderStyles(styleOrders: { id: number; sort_order: number }[]): Promise<StyleApiResponse<void>> {
    // Validate input
    if (!styleOrders || styleOrders.length === 0) {
      return {
        success: false,
        error: 'Style order data is required',
      };
    }

    // Validate each style order entry
    const invalidEntries = styleOrders.filter(
      entry => !entry.id || entry.id <= 0 || typeof entry.sort_order !== 'number'
    );

    if (invalidEntries.length > 0) {
      return {
        success: false,
        error: 'All style entries must have valid ID and sort_order',
      };
    }

    return StyleApi.reorderStyles(styleOrders);
  }

  /**
   * Get styles count by brand
   */
  static async getStylesCountByBrand(brandId: number, activeOnly = true): Promise<StyleApiResponse<number>> {
    const filters: StyleFilters = {
      material_brand_id: brandId,
    };

    if (activeOnly) {
      filters.status = true;
    }

    const result = await StyleApi.getStyles(filters);
    
    if (result.success) {
      return {
        success: true,
        data: result.count || 0,
      };
    }

    return {
      success: false,
      error: result.error,
    };
  }

  /**
   * Get featured/popular styles (active styles sorted by usage or creation date)
   */
  static async getFeaturedStyles(limit = 10): Promise<StyleApiResponse<StyleModel[]>> {
    const filters: StyleFilters = {
      status: true,
      sort_by: 'created_at',
      sort_order: 'desc',
      limit,
    };

    return StyleApi.getStyles(filters);
  }
}
