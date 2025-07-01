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
  data?: InspirationColorModel[] | InspirationColorModel;
  error?: string;
  message?: string;
  count?: number;
}

export class InspirationalColorApi {
  private static readonly TABLE_NAME = 'inspirational_color';

  /**
   * Fetch all inspirational colors with optional filtering and pagination
   */
  static async fetchInspirationColors(
    filters: InspirationColorFilters = {}
  ): Promise<InspirationColorApiResponse> {
    try {
      const {
        search,
        name,
        hex,
        limit = 50,
        offset = 0
      } = filters;

      let query = supabase
        .from(this.TABLE_NAME)
        .select('*', { count: 'exact' });

      // Apply filters
      if (search) {
        query = query.or(`name.ilike.%${search}%,hex.ilike.%${search}%`);
      }

      if (name) {
        query = query.ilike('name', `%${name}%`);
      }

      if (hex) {
        query = query.eq('hex', hex);
      }

      // Apply pagination
      query = query
        .range(offset, offset + limit - 1)
        .order('name', { ascending: true });

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
