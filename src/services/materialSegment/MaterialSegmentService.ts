import { 
  MaterialSegmentApi, 
  PaginatedMaterialSegmentResponse 
} from './materialSegmentApi';
import { 
  MaterialSegmentModel, 
  CreateMaterialSegmentRequest, 
  UpdateMaterialSegmentRequest, 
  MaterialSegmentFilters 
} from '@/models/materialSegment';

interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export class MaterialSegmentService {
  /**
   * Create a new material segment with validation
   */
  static async createMaterialSegment(segmentData: CreateMaterialSegmentRequest): Promise<ServiceResult<MaterialSegmentModel>> {
    try {
      // Validate required fields
      if (!segmentData.name?.trim()) {
        return {
          success: false,
          error: 'Material segment name is required',
        };
      }

      if (!segmentData.color?.trim()) {
        return {
          success: false,
          error: 'Material segment color is required',
        };
      }

      if (!segmentData.color_code?.trim()) {
        return {
          success: false,
          error: 'Material segment color code is required',
        };
      }

      if (!segmentData.short_code?.trim()) {
        return {
          success: false,
          error: 'Material segment short code is required',
        };
      }

      if (segmentData.index === undefined || segmentData.index < 0) {
        return {
          success: false,
          error: 'Valid material segment index is required',
        };
      }

      // Sanitize data
      const sanitizedData = {
        ...segmentData,
        name: segmentData.name.trim(),
        color: segmentData.color.trim(),
        color_code: segmentData.color_code.trim(),
        short_code: segmentData.short_code.trim(),
        description: segmentData.description?.trim() || '',
        icon: segmentData.icon?.trim() || '',
        icon_svg: segmentData.icon_svg?.trim() || '',
        categories: segmentData.categories || [],
        gallery: segmentData.gallery || [],
      };

      const result = await MaterialSegmentApi.createMaterialSegment(sanitizedData);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Material segment created successfully',
        };
      }

      return {
        success: false,
        error: result.error || 'Failed to create material segment',
      };
    } catch (error) {
      console.error('Error in MaterialSegmentService.createMaterialSegment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get material segments with pagination and filtering
   */
  static async getMaterialSegments(filters: MaterialSegmentFilters = {}): Promise<ServiceResult<PaginatedMaterialSegmentResponse>> {
    try {
      const result = await MaterialSegmentApi.getMaterialSegments(filters);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Material segments fetched successfully',
        };
      }

      return {
        success: false,
        error: result.error || 'Failed to fetch material segments',
      };
    } catch (error) {
      console.error('Error in MaterialSegmentService.getMaterialSegments:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get a material segment by ID
   */
  static async getMaterialSegmentById(id: number): Promise<ServiceResult<MaterialSegmentModel>> {
    try {
      if (!id || id <= 0) {
        return {
          success: false,
          error: 'Valid material segment ID is required',
        };
      }

      const result = await MaterialSegmentApi.getMaterialSegmentById(id);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Material segment fetched successfully',
        };
      }

      return {
        success: false,
        error: result.error || 'Failed to fetch material segment',
      };
    } catch (error) {
      console.error('Error in MaterialSegmentService.getMaterialSegmentById:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Update a material segment
   */
  static async updateMaterialSegment(segmentData: UpdateMaterialSegmentRequest): Promise<ServiceResult<MaterialSegmentModel>> {
    try {
      if (!segmentData.id || segmentData.id <= 0) {
        return {
          success: false,
          error: 'Valid material segment ID is required',
        };
      }

      // Validate fields if provided
      if (segmentData.name !== undefined && !segmentData.name.trim()) {
        return {
          success: false,
          error: 'Material segment name cannot be empty',
        };
      }

      if (segmentData.color !== undefined && !segmentData.color.trim()) {
        return {
          success: false,
          error: 'Material segment color cannot be empty',
        };
      }

      if (segmentData.color_code !== undefined && !segmentData.color_code.trim()) {
        return {
          success: false,
          error: 'Material segment color code cannot be empty',
        };
      }

      if (segmentData.short_code !== undefined && !segmentData.short_code.trim()) {
        return {
          success: false,
          error: 'Material segment short code cannot be empty',
        };
      }

      if (segmentData.index !== undefined && segmentData.index < 0) {
        return {
          success: false,
          error: 'Material segment index cannot be negative',
        };
      }

      // Sanitize data
      const sanitizedData: UpdateMaterialSegmentRequest = {
        id: segmentData.id,
      };

      if (segmentData.name !== undefined) sanitizedData.name = segmentData.name.trim();
      if (segmentData.color !== undefined) sanitizedData.color = segmentData.color.trim();
      if (segmentData.color_code !== undefined) sanitizedData.color_code = segmentData.color_code.trim();
      if (segmentData.short_code !== undefined) sanitizedData.short_code = segmentData.short_code.trim();
      if (segmentData.description !== undefined) sanitizedData.description = segmentData.description.trim();
      if (segmentData.icon !== undefined) sanitizedData.icon = segmentData.icon.trim();
      if (segmentData.icon_svg !== undefined) sanitizedData.icon_svg = segmentData.icon_svg.trim();
      if (segmentData.index !== undefined) sanitizedData.index = segmentData.index;
      if (segmentData.is_active !== undefined) sanitizedData.is_active = segmentData.is_active;
      if (segmentData.is_visible !== undefined) sanitizedData.is_visible = segmentData.is_visible;
      if (segmentData.categories !== undefined) sanitizedData.categories = segmentData.categories;
      if (segmentData.gallery !== undefined) sanitizedData.gallery = segmentData.gallery;

      const result = await MaterialSegmentApi.updateMaterialSegment(sanitizedData);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Material segment updated successfully',
        };
      }

      return {
        success: false,
        error: result.error || 'Failed to update material segment',
      };
    } catch (error) {
      console.error('Error in MaterialSegmentService.updateMaterialSegment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Delete a material segment
   */
  static async deleteMaterialSegment(id: number): Promise<ServiceResult<boolean>> {
    try {
      if (!id || id <= 0) {
        return {
          success: false,
          error: 'Valid material segment ID is required',
        };
      }

      const result = await MaterialSegmentApi.deleteMaterialSegment(id);

      if (result.success) {
        return {
          success: true,
          data: true,
          message: 'Material segment deleted successfully',
        };
      }

      return {
        success: false,
        error: result.error || 'Failed to delete material segment',
      };
    } catch (error) {
      console.error('Error in MaterialSegmentService.deleteMaterialSegment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Duplicate a material segment
   */
  static async duplicateMaterialSegment(id: number): Promise<ServiceResult<MaterialSegmentModel>> {
    try {
      if (!id || id <= 0) {
        return {
          success: false,
          error: 'Valid material segment ID is required',
        };
      }

      const result = await MaterialSegmentApi.duplicateMaterialSegment(id);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Material segment duplicated successfully',
        };
      }

      return {
        success: false,
        error: result.error || 'Failed to duplicate material segment',
      };
    } catch (error) {
      console.error('Error in MaterialSegmentService.duplicateMaterialSegment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Toggle material segment visibility
   */
  static async toggleMaterialSegmentVisibility(id: number): Promise<ServiceResult<MaterialSegmentModel>> {
    try {
      if (!id || id <= 0) {
        return {
          success: false,
          error: 'Valid material segment ID is required',
        };
      }

      const result = await MaterialSegmentApi.toggleMaterialSegmentVisibility(id);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Material segment visibility toggled successfully',
        };
      }

      return {
        success: false,
        error: result.error || 'Failed to toggle material segment visibility',
      };
    } catch (error) {
      console.error('Error in MaterialSegmentService.toggleMaterialSegmentVisibility:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Reorder material segments
   */
  static async reorderMaterialSegments(segmentIds: number[]): Promise<ServiceResult<MaterialSegmentModel[]>> {
    try {
      if (!Array.isArray(segmentIds) || segmentIds.length === 0) {
        return {
          success: false,
          error: 'Valid array of material segment IDs is required',
        };
      }

      // Validate all IDs are valid numbers
      if (segmentIds.some(id => !id || id <= 0)) {
        return {
          success: false,
          error: 'All material segment IDs must be valid positive numbers',
        };
      }

      const result = await MaterialSegmentApi.reorderMaterialSegments(segmentIds);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Material segments reordered successfully',
        };
      }

      return {
        success: false,
        error: result.error || 'Failed to reorder material segments',
      };
    } catch (error) {
      console.error('Error in MaterialSegmentService.reorderMaterialSegments:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Add image to material segment gallery
   */
  static async addImageToGallery(id: number, imageUrl: string): Promise<ServiceResult<MaterialSegmentModel>> {
    try {
      if (!id || id <= 0) {
        return {
          success: false,
          error: 'Valid material segment ID is required',
        };
      }

      if (!imageUrl?.trim()) {
        return {
          success: false,
          error: 'Valid image URL is required',
        };
      }

      const result = await MaterialSegmentApi.addToMaterialSegmentGallery(id, imageUrl.trim());

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Image added to gallery successfully',
        };
      }

      return {
        success: false,
        error: result.error || 'Failed to add image to gallery',
      };
    } catch (error) {
      console.error('Error in MaterialSegmentService.addImageToGallery:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Remove image from material segment gallery
   */
  static async removeImageFromGallery(id: number, imageUrl: string): Promise<ServiceResult<MaterialSegmentModel>> {
    try {
      if (!id || id <= 0) {
        return {
          success: false,
          error: 'Valid material segment ID is required',
        };
      }

      if (!imageUrl?.trim()) {
        return {
          success: false,
          error: 'Valid image URL is required',
        };
      }

      const result = await MaterialSegmentApi.removeFromMaterialSegmentGallery(id, imageUrl.trim());

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Image removed from gallery successfully',
        };
      }

      return {
        success: false,
        error: result.error || 'Failed to remove image from gallery',
      };
    } catch (error) {
      console.error('Error in MaterialSegmentService.removeImageFromGallery:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Search material segments
   */
  static async searchMaterialSegments(searchTerm: string, filters: MaterialSegmentFilters = {}): Promise<ServiceResult<PaginatedMaterialSegmentResponse>> {
    try {
      if (!searchTerm?.trim()) {
        return {
          success: false,
          error: 'Search term is required',
        };
      }

      const searchFilters = {
        ...filters,
        search: searchTerm.trim(),
      };

      const result = await MaterialSegmentApi.getMaterialSegments(searchFilters);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Material segments search completed successfully',
        };
      }

      return {
        success: false,
        error: result.error || 'Failed to search material segments',
      };
    } catch (error) {
      console.error('Error in MaterialSegmentService.searchMaterialSegments:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get active material segments
   */
  static async getActiveMaterialSegments(filters: Omit<MaterialSegmentFilters, 'is_active'> = {}): Promise<ServiceResult<PaginatedMaterialSegmentResponse>> {
    try {
      const activeFilters = {
        ...filters,
        is_active: true,
      };

      const result = await MaterialSegmentApi.getMaterialSegments(activeFilters);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Active material segments fetched successfully',
        };
      }

      return {
        success: false,
        error: result.error || 'Failed to fetch active material segments',
      };
    } catch (error) {
      console.error('Error in MaterialSegmentService.getActiveMaterialSegments:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get visible material segments
   */
  static async getVisibleMaterialSegments(filters: Omit<MaterialSegmentFilters, 'is_visible'> = {}): Promise<ServiceResult<PaginatedMaterialSegmentResponse>> {
    try {
      const visibleFilters = {
        ...filters,
        is_visible: true,
      };

      const result = await MaterialSegmentApi.getMaterialSegments(visibleFilters);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Visible material segments fetched successfully',
        };
      }

      return {
        success: false,
        error: result.error || 'Failed to fetch visible material segments',
      };
    } catch (error) {
      console.error('Error in MaterialSegmentService.getVisibleMaterialSegments:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get material segments by category
   */
  static async getMaterialSegmentsByCategory(category: string, filters: MaterialSegmentFilters = {}): Promise<ServiceResult<PaginatedMaterialSegmentResponse>> {
    try {
      if (!category?.trim()) {
        return {
          success: false,
          error: 'Category is required',
        };
      }

      const categoryFilters = {
        ...filters,
        categories: [category.trim()],
      };

      const result = await MaterialSegmentApi.getMaterialSegments(categoryFilters);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Material segments by category fetched successfully',
        };
      }

      return {
        success: false,
        error: result.error || 'Failed to fetch material segments by category',
      };
    } catch (error) {
      console.error('Error in MaterialSegmentService.getMaterialSegmentsByCategory:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Bulk operations for material segments
   */
  static async bulkUpdateMaterialSegments(updates: Array<{ id: number; updates: Partial<MaterialSegmentModel> }>): Promise<ServiceResult<MaterialSegmentModel[]>> {
    try {
      if (!Array.isArray(updates) || updates.length === 0) {
        return {
          success: false,
          error: 'Valid array of updates is required',
        };
      }

      // Validate all updates
      for (const update of updates) {
        if (!update.id || update.id <= 0) {
          return {
            success: false,
            error: 'All update objects must have valid IDs',
          };
        }
      }

      const result = await MaterialSegmentApi.bulkUpdateMaterialSegments(updates);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Material segments bulk updated successfully',
        };
      }

      return {
        success: false,
        error: result.error || 'Failed to bulk update material segments',
      };
    } catch (error) {
      console.error('Error in MaterialSegmentService.bulkUpdateMaterialSegments:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Bulk delete material segments
   */
  static async bulkDeleteMaterialSegments(ids: number[]): Promise<ServiceResult<boolean>> {
    try {
      if (!Array.isArray(ids) || ids.length === 0) {
        return {
          success: false,
          error: 'Valid array of IDs is required',
        };
      }

      // Validate all IDs
      if (ids.some(id => !id || id <= 0)) {
        return {
          success: false,
          error: 'All IDs must be valid positive numbers',
        };
      }

      const result = await MaterialSegmentApi.bulkDeleteMaterialSegments(ids);

      if (result.success) {
        return {
          success: true,
          data: true,
          message: 'Material segments bulk deleted successfully',
        };
      }

      return {
        success: false,
        error: result.error || 'Failed to bulk delete material segments',
      };
    } catch (error) {
      console.error('Error in MaterialSegmentService.bulkDeleteMaterialSegments:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}
