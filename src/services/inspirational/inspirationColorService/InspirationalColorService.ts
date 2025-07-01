import { 
  InspirationalColorApi, 
  InspirationColorFilters, 

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

 
  
 
}

export default InspirationalColorService;
