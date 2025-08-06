import { supabase } from '@/lib/supabase';
import { InspirationImageModel } from '@/models/inspirational/Inspirational';


export interface InspirationImageApiResponse {
  success: boolean;
  data?: InspirationImageModel[];
  error?: string;
  message?: string;
  count?: number;
}

export interface FetchInspirationImagesOptions {
  limit?: number;
  offset?: number;
}

export class InspirationalImageApi {
  private static readonly TABLE_NAME = 'inspirational_houses';

  /**
   * Fetch all inspiration images with optional filtering and pagination
   */
  static async fetchInspirationImages(options?: FetchInspirationImagesOptions): Promise<InspirationImageApiResponse> {
    try {
      let query = supabase
        .from(InspirationalImageApi.TABLE_NAME)
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      // Apply pagination if provided
      if (options?.limit || options?.offset) {
        // Use range for pagination
        const startRange = options?.offset || 0;
        const endRange = startRange + (options?.limit || 1000) - 1;
        query = query.range(startRange, endRange);
      } else {
        // If no pagination options, fetch all records by setting a very high limit
        query = query.limit(50000);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching inspiration images:', error);
        return {
          success: false,
          error: error.message
        };
      }

      console.log('Fetched inspiration images:', data?.length || 0);
      console.log('Fetched inspiration count:', count || 0);
      return {
        success: true,
        data: data as InspirationImageModel[],
        count: count || 0,
        message: `Successfully fetched ${data?.length || 0} inspiration images (Total: ${count || 0})`
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
   * Fetch ALL inspiration images without pagination limits
   */
  static async fetchAllInspirationImages(): Promise<InspirationImageApiResponse> {
    try {
      // First get the total count
      const { count } = await supabase
        .from(InspirationalImageApi.TABLE_NAME)
        .select('*', { count: 'exact', head: true });

      if (!count) {
        return {
          success: true,
          data: [],
          count: 0,
          message: 'No inspiration images found'
        };
      }

      // Fetch all records with a high limit to ensure we get everything
      const { data, error } = await supabase
        .from(InspirationalImageApi.TABLE_NAME)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(count > 10000 ? count : 10000); // Use actual count or a high number

      if (error) {
        console.error('Error fetching all inspiration images:', error);
        return {
          success: false,
          error: error.message
        };
      }

      console.log('Fetched ALL inspiration images:', data?.length || 0);
      console.log('Total count from database:', count);
      return {
        success: true,
        data: data as InspirationImageModel[],
        count: count,
        message: `Successfully fetched all ${data?.length || 0} inspiration images (Expected: ${count})`
      };

    } catch (error) {
      console.error('Unexpected error in fetchAllInspirationImages:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }



}

export default InspirationalImageApi;
