import { 
  MaterialSegmentApi, 
  MaterialSegmentResponse, 
} from './materialSegmentApi';
import { 
  MaterialSegmentModel, 
  CreateMaterialSegmentRequest, 
  UpdateMaterialSegmentRequest, 

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
  static async getMaterialSegments(): Promise<MaterialSegmentResponse> {
   
      return await MaterialSegmentApi.getMaterialSegments();

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

 


 


}
