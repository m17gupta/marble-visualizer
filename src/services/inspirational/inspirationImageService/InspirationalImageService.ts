import { 
  InspirationalImageApi, 
  InspirationImageFilters, 
  PaginatedInspirationImageResponse 
} from './InspirationalImageApi';
import { InspirationImageModel } from '@/models/inspirational/Inspirational';

interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export class InspirationalImageService {
  /**
   * Get all inspiration images with optional filtering
   */
  static async getInspirationImages(
    filters: InspirationImageFilters = {}
  ): Promise<ServiceResult<InspirationImageModel[]>> {
    try {
      const response = await InspirationalImageApi.fetchInspirationImages(filters);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error || 'Failed to fetch inspiration images',
        };
      }

      return {
        success: true,
        data: response.data as InspirationImageModel[],
        message: response.message,
      };

    } catch (error) {
      console.error('Error in getInspirationImages:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get inspiration images with pagination
   */
  static async getInspirationImagesPaginated(
    page: number = 1,
    pageSize: number = 20,
    filters: Omit<InspirationImageFilters, 'limit' | 'offset'> = {}
  ): Promise<ServiceResult<PaginatedInspirationImageResponse>> {
    try {
      const response = await InspirationalImageApi.fetchInspirationImagesPaginated(
        page,
        pageSize,
        filters
      );

      return {
        success: true,
        data: response,
        message: `Successfully fetched page ${page} of inspiration images`,
      };

    } catch (error) {
      console.error('Error in getInspirationImagesPaginated:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get inspiration image by ID
   */
  static async getInspirationImageById(id: number): Promise<ServiceResult<InspirationImageModel>> {
    try {
      // Validate input
      if (!id || id <= 0) {
        return {
          success: false,
          error: 'Valid image ID is required',
        };
      }

      const response = await InspirationalImageApi.fetchInspirationImageById(id);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error || 'Failed to fetch inspiration image',
        };
      }

      return {
        success: true,
        data: response.data as InspirationImageModel,
        message: response.message,
      };

    } catch (error) {
      console.error('Error in getInspirationImageById:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get inspiration images by color family
   */
  static async getInspirationImagesByColorFamily(
    colorFamilyId: number,
    limit: number = 20
  ): Promise<ServiceResult<InspirationImageModel[]>> {
    try {
      // Validate input
      if (!colorFamilyId || colorFamilyId <= 0) {
        return {
          success: false,
          error: 'Valid color family ID is required',
        };
      }

      const response = await InspirationalImageApi.fetchInspirationImagesByColorFamily(
        colorFamilyId,
        limit
      );
      
      if (!response.success) {
        return {
          success: false,
          error: response.error || 'Failed to fetch inspiration images by color family',
        };
      }

      return {
        success: true,
        data: response.data as InspirationImageModel[],
        message: `Found ${(response.data as InspirationImageModel[])?.length || 0} images for color family ${colorFamilyId}`,
      };

    } catch (error) {
      console.error('Error in getInspirationImagesByColorFamily:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Search inspiration images by name
   */
  static async searchInspirationImages(
    searchTerm: string,
    limit: number = 10
  ): Promise<ServiceResult<InspirationImageModel[]>> {
    try {
      // Validate input
      if (!searchTerm?.trim()) {
        return {
          success: false,
          error: 'Search term is required',
        };
      }

      if (searchTerm.length < 2) {
        return {
          success: false,
          error: 'Search term must be at least 2 characters long',
        };
      }

      const response = await InspirationalImageApi.searchInspirationImagesByName(
        searchTerm,
        limit
      );
      
      if (!response.success) {
        return {
          success: false,
          error: response.error || 'Failed to search inspiration images',
        };
      }

      return {
        success: true,
        data: response.data as InspirationImageModel[],
        message: `Found ${(response.data as InspirationImageModel[])?.length || 0} images matching "${searchTerm}"`,
      };

    } catch (error) {
      console.error('Error in searchInspirationImages:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get inspiration images by code
   */
  static async getInspirationImagesByCode(code: number): Promise<ServiceResult<InspirationImageModel[]>> {
    try {
      // Validate input
      if (!code || code <= 0) {
        return {
          success: false,
          error: 'Valid code is required',
        };
      }

      const response = await InspirationalImageApi.fetchInspirationImagesByCode(code);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error || 'Failed to fetch inspiration images by code',
        };
      }

      return {
        success: true,
        data: response.data as InspirationImageModel[],
        message: response.message,
      };

    } catch (error) {
      console.error('Error in getInspirationImagesByCode:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get only active inspiration images
   */
  static async getActiveInspirationImages(
    limit: number = 50,
    offset: number = 0
  ): Promise<ServiceResult<InspirationImageModel[]>> {
    try {
      const response = await InspirationalImageApi.fetchActiveInspirationImages(limit, offset);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error || 'Failed to fetch active inspiration images',
        };
      }

      return {
        success: true,
        data: response.data as InspirationImageModel[],
        message: response.message,
      };

    } catch (error) {
      console.error('Error in getActiveInspirationImages:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get inspiration images by status
   */
  static async getInspirationImagesByStatus(
    status: number,
    limit: number = 50
  ): Promise<ServiceResult<InspirationImageModel[]>> {
    try {
      // Validate status (assuming 0 = inactive, 1 = active)
      if (status !== 0 && status !== 1) {
        return {
          success: false,
          error: 'Status must be 0 (inactive) or 1 (active)',
        };
      }

      const response = await InspirationalImageApi.fetchInspirationImagesByStatus(status, limit);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error || 'Failed to fetch inspiration images by status',
        };
      }

      return {
        success: true,
        data: response.data as InspirationImageModel[],
        message: `Found ${(response.data as InspirationImageModel[])?.length || 0} ${status === 1 ? 'active' : 'inactive'} images`,
      };

    } catch (error) {
      console.error('Error in getInspirationImagesByStatus:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get inspiration images count grouped by color family
   */
  static async getInspirationImagesCountByColorFamily(): Promise<ServiceResult<Record<number, number>>> {
    try {
      const response = await InspirationalImageApi.getInspirationImagesCountByColorFamily();
      
      if (!response.success) {
        return {
          success: false,
          error: response.error || 'Failed to get inspiration images count by color family',
        };
      }

      return {
        success: true,
        data: response.data as Record<number, number>,
        message: response.message,
      };

    } catch (error) {
      console.error('Error in getInspirationImagesCountByColorFamily:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get featured inspiration images (helper method)
   */
  static async getFeaturedInspirationImages(limit: number = 10): Promise<ServiceResult<InspirationImageModel[]>> {
    // This could be expanded to include a 'featured' field in the database
    // For now, we'll just return the most recent active images
    return this.getActiveInspirationImages(limit, 0);
  }
}

export default InspirationalImageService;
