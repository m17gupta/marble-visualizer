import { 
  InspirationalColorApi, 
  InspirationColorFilters, 
  PaginatedInspirationColorResponse 
} from './InspirationalColorApi';
import { InspirationColorModel } from '@/models/inspirational/Inspirational';

interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export class InspirationalColorService {
  /**
   * Get all inspiration colors with optional filtering
   */
  static async getInspirationColors(
    filters: InspirationColorFilters = {}
  ): Promise<ServiceResult<InspirationColorModel[]>> {
    try {
      const response = await InspirationalColorApi.fetchInspirationColors(filters);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error || 'Failed to fetch inspiration colors',
        };
      }

      return {
        success: true,
        data: response.data as InspirationColorModel[],
        message: response.message,
      };

    } catch (error) {
      console.error('Error in getInspirationColors:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get inspiration colors with pagination
   */
  static async getInspirationColorsPaginated(
    page: number = 1,
    pageSize: number = 20,
    filters: Omit<InspirationColorFilters, 'limit' | 'offset'> = {}
  ): Promise<ServiceResult<PaginatedInspirationColorResponse>> {
    try {
      const response = await InspirationalColorApi.fetchInspirationColorsPaginated(
        page,
        pageSize,
        filters
      );

      return {
        success: true,
        data: response,
        message: `Successfully fetched page ${page} of inspiration colors`,
      };

    } catch (error) {
      console.error('Error in getInspirationColorsPaginated:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get inspiration color by ID
   */
  static async getInspirationColorById(id: string): Promise<ServiceResult<InspirationColorModel>> {
    try {
      // Validate input
      if (!id?.trim()) {
        return {
          success: false,
          error: 'Color ID is required',
        };
      }

      const response = await InspirationalColorApi.fetchInspirationColorById(id);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error || 'Failed to fetch inspiration color',
        };
      }

      return {
        success: true,
        data: response.data as InspirationColorModel,
        message: response.message,
      };

    } catch (error) {
      console.error('Error in getInspirationColorById:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Search inspiration colors by name
   */
  static async searchInspirationColors(
    searchTerm: string,
    limit: number = 10
  ): Promise<ServiceResult<InspirationColorModel[]>> {
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

      const response = await InspirationalColorApi.searchInspirationColorsByName(
        searchTerm,
        limit
      );
      
      if (!response.success) {
        return {
          success: false,
          error: response.error || 'Failed to search inspiration colors',
        };
      }

      return {
        success: true,
        data: response.data as InspirationColorModel[],
        message: `Found ${(response.data as InspirationColorModel[])?.length || 0} colors matching "${searchTerm}"`,
      };

    } catch (error) {
      console.error('Error in searchInspirationColors:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get inspiration colors by hex value
   */
  static async getInspirationColorsByHex(hex: string): Promise<ServiceResult<InspirationColorModel[]>> {
    try {
      // Validate hex color format
      if (!hex?.trim()) {
        return {
          success: false,
          error: 'Hex color value is required',
        };
      }

      // Basic hex validation
      const hexPattern = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      if (!hexPattern.test(hex)) {
        return {
          success: false,
          error: 'Invalid hex color format',
        };
      }

      // Ensure hex starts with #
      const normalizedHex = hex.startsWith('#') ? hex : `#${hex}`;

      const response = await InspirationalColorApi.fetchInspirationColorsByHex(normalizedHex);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error || 'Failed to fetch inspiration colors by hex',
        };
      }

      return {
        success: true,
        data: response.data as InspirationColorModel[],
        message: response.message,
      };

    } catch (error) {
      console.error('Error in getInspirationColorsByHex:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get all unique color names (for autocomplete/suggestions)
   */
  static async getColorNames(): Promise<ServiceResult<string[]>> {
    try {
      const response = await InspirationalColorApi.fetchInspirationColors({
        limit: 1000 // Get a large number to get all colors
      });
      
      if (!response.success) {
        return {
          success: false,
          error: response.error || 'Failed to fetch color names',
        };
      }

      const colors = response.data as InspirationColorModel[];
      const uniqueNames = Array.from(new Set(colors.map(color => color.name))).sort();

      return {
        success: true,
        data: uniqueNames,
        message: `Retrieved ${uniqueNames.length} unique color names`,
      };

    } catch (error) {
      console.error('Error in getColorNames:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

export default InspirationalColorService;
