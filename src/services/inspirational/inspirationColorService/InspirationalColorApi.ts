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

  /**
   * Fetch inspiration colors with pagination helper
   */
  static async fetchInspirationColorsPaginated(
    page: number = 1,
    pageSize: number = 20,
    filters: Omit<InspirationColorFilters, 'limit' | 'offset'> = {}
  ): Promise<PaginatedInspirationColorResponse> {
    const offset = (page - 1) * pageSize;
    
    const response = await this.fetchInspirationColors({
      ...filters,
      limit: pageSize,
      offset
    });

    const totalCount = response.count || 0;
    const totalPages = Math.ceil(totalCount / pageSize);
    const hasMore = page < totalPages;

    return {
      data: (response.data as InspirationColorModel[]) || [],
      count: totalCount,
      totalPages,
      currentPage: page,
      hasMore
    };
  }

  /**
   * Fetch inspiration color by ID
   */
  static async fetchInspirationColorById(id: string): Promise<InspirationColorApiResponse> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching inspiration color by ID:', error);
        return {
          success: false,
          error: error.message
        };
      }

      if (!data) {
        return {
          success: false,
          error: 'Inspiration color not found'
        };
      }

      return {
        success: true,
        data: data as InspirationColorModel,
        message: 'Inspiration color fetched successfully'
      };

    } catch (error) {
      console.error('Unexpected error in fetchInspirationColorById:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Search inspiration colors by name
   */
  static async searchInspirationColorsByName(
    searchTerm: string,
    limit: number = 10
  ): Promise<InspirationColorApiResponse> {
    return this.fetchInspirationColors({
      search: searchTerm,
      limit
    });
  }

  /**
   * Fetch inspiration colors by hex color
   */
  static async fetchInspirationColorsByHex(hex: string): Promise<InspirationColorApiResponse> {
    return this.fetchInspirationColors({
      hex
    });
  }
}

export default InspirationalColorApi;
