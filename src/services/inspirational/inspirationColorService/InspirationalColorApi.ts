import { supabase } from '@/lib/supabase';
import { InspirationColorModel } from '@/models/inspirational/Inspirational';

export interface InspirationColorFilters {
  search?: string;
  name?: string;
  hex?: string;
  limit?: number;
  offset?: number;
}

export interface PaginatedInspirationColorResponse {
  data: InspirationColorModel[];
  count: number;
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
}

export interface InspirationColorApiResponse {
  success: boolean;
  data?: InspirationColorModel[] ;
  error?: string;
  message?: string;
  count?: number;
}

export class InspirationalColorApi {
  private static readonly TABLE_NAME = 'color_families';

  /**
   * Fetch all inspirational colors with optional filtering and pagination
   */
  static async fetchInspirationColors(): Promise<InspirationColorApiResponse> {
    try {
      const query = supabase
        .from(InspirationalColorApi.TABLE_NAME)
        .select('*')
        .order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching inspiration colors:', error);
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        data: data as InspirationColorModel[],
        count: count || 0,
        message: `Successfully fetched ${data?.length || 0} inspiration colors`
      };

    } catch (error) {
      console.error('Unexpected error in fetchInspirationColors:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  

 

 
  
}

export default InspirationalColorApi;
