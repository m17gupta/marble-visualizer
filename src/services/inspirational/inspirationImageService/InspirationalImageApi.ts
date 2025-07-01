import { supabase } from '@/lib/supabase';
import { InspirationImageModel } from '@/models/inspirational/Inspirational';

export interface InspirationImageFilters {
  search?: string;
  color_family_id?: number;
  code?: number;
  name?: string;
  status?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedInspirationImageResponse {
  data: InspirationImageModel[];
  count: number;
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
}

export interface InspirationImageApiResponse {
  success: boolean;
  data?: InspirationImageModel[] | InspirationImageModel | Record<string, unknown>;
  error?: string;
  message?: string;
  count?: number;
}

export class InspirationalImageApi {
  private static readonly TABLE_NAME = 'inspiration_images';

  /**
   * Fetch all inspiration images with optional filtering and pagination
   */
  static async fetchInspirationImages(
    filters: InspirationImageFilters = {}
  ): Promise<InspirationImageApiResponse> {
    try {
      const {
        search,
        color_family_id,
        code,
        name,
        status = 1, // Default to active status
        limit = 50,
        offset = 0
      } = filters;

      let query = supabase
        .from(this.TABLE_NAME)
        .select('*', { count: 'exact' });

      // Apply filters
      if (search) {
        query = query.or(`name.ilike.%${search}%,code.eq.${search}`);
      }

      if (color_family_id !== undefined) {
        query = query.eq('color_family_id', color_family_id);
      }

      if (code !== undefined) {
        query = query.eq('code', code);
      }

      if (name) {
        query = query.ilike('name', `%${name}%`);
      }

      if (status !== undefined) {
        query = query.eq('status', status);
      }

      // Apply pagination
      query = query
        .range(offset, offset + limit - 1)
        .order('id', { ascending: true });

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching inspiration images:', error);
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        data: data as InspirationImageModel[],
        count: count || 0,
        message: `Successfully fetched ${data?.length || 0} inspiration images`
      };

    } catch (error) {
      console.error('Unexpected error in fetchInspirationImages:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Fetch inspiration images with pagination helper
   */
  static async fetchInspirationImagesPaginated(
    page: number = 1,
    pageSize: number = 20,
    filters: Omit<InspirationImageFilters, 'limit' | 'offset'> = {}
  ): Promise<PaginatedInspirationImageResponse> {
    const offset = (page - 1) * pageSize;
    
    const response = await this.fetchInspirationImages({
      ...filters,
      limit: pageSize,
      offset
    });

    const totalCount = response.count || 0;
    const totalPages = Math.ceil(totalCount / pageSize);
    const hasMore = page < totalPages;

    return {
      data: (response.data as InspirationImageModel[]) || [],
      count: totalCount,
      totalPages,
      currentPage: page,
      hasMore
    };
  }

  /**
   * Fetch inspiration image by ID
   */
  static async fetchInspirationImageById(id: number): Promise<InspirationImageApiResponse> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching inspiration image by ID:', error);
        return {
          success: false,
          error: error.message
        };
      }

      if (!data) {
        return {
          success: false,
          error: 'Inspiration image not found'
        };
      }

      return {
        success: true,
        data: data as InspirationImageModel,
        message: 'Inspiration image fetched successfully'
      };

    } catch (error) {
      console.error('Unexpected error in fetchInspirationImageById:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Fetch inspiration images by color family ID
   */
  static async fetchInspirationImagesByColorFamily(
    colorFamilyId: number,
    limit: number = 20
  ): Promise<InspirationImageApiResponse> {
    return this.fetchInspirationImages({
      color_family_id: colorFamilyId,
      limit
    });
  }

  /**
   * Search inspiration images by name
   */
  static async searchInspirationImagesByName(
    searchTerm: string,
    limit: number = 10
  ): Promise<InspirationImageApiResponse> {
    return this.fetchInspirationImages({
      search: searchTerm,
      limit
    });
  }

  /**
   * Fetch inspiration images by code
   */
  static async fetchInspirationImagesByCode(code: number): Promise<InspirationImageApiResponse> {
    return this.fetchInspirationImages({
      code
    });
  }

  /**
   * Fetch active inspiration images only
   */
  static async fetchActiveInspirationImages(
    limit: number = 50,
    offset: number = 0
  ): Promise<InspirationImageApiResponse> {
    return this.fetchInspirationImages({
      status: 1,
      limit,
      offset
    });
  }

  /**
   * Fetch inspiration images by status
   */
  static async fetchInspirationImagesByStatus(
    status: number,
    limit: number = 50
  ): Promise<InspirationImageApiResponse> {
    return this.fetchInspirationImages({
      status,
      limit
    });
  }

  /**
   * Get inspiration images count by color family
   */
  static async getInspirationImagesCountByColorFamily(): Promise<InspirationImageApiResponse> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('color_family_id')
        .eq('status', 1);

      if (error) {
        console.error('Error getting inspiration images count by color family:', error);
        return {
          success: false,
          error: error.message
        };
      }

      // Group by color_family_id and count
      const countByFamily = (data || []).reduce((acc: Record<number, number>, item) => {
        acc[item.color_family_id] = (acc[item.color_family_id] || 0) + 1;
        return acc;
      }, {});

      return {
        success: true,
        data: countByFamily as Record<number, number>,
        message: 'Successfully fetched inspiration images count by color family'
      };

    } catch (error) {
      console.error('Unexpected error in getInspirationImagesCountByColorFamily:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

export default InspirationalImageApi;
