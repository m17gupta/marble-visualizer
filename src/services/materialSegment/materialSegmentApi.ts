import { supabase } from '@/lib/supabase';
import { 
  MaterialSegmentModel, 
  CreateMaterialSegmentRequest, 
  UpdateMaterialSegmentRequest, 
  MaterialSegmentFilters 
} from '@/models/materialSegment';

export interface MaterialSegmentApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
  total?: number;
  page?: number;
  totalPages?: number;
}

export interface PaginatedMaterialSegmentResponse {
  segments: MaterialSegmentModel[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class MaterialSegmentApi {
  private static tableName = 'material_segments';

    /**
   * Get material segments by category
   */
  static async getMaterialSegmentsByCategory(category: string): Promise<MaterialSegmentApiResponse<MaterialSegmentModel[]>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .contains('categories', [category])
        .order('index', { ascending: true });

      if (error) {
        console.error('Error fetching segments by category:', error);
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data: data as MaterialSegmentModel[],
      };
    } catch (error) {
      console.error('Error fetching segments by category:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Create a new material segment
   */
  static async createMaterialSegment(segmentData: CreateMaterialSegmentRequest): Promise<MaterialSegmentApiResponse<MaterialSegmentModel>> {
    try {
      // Insert new material segment
      const { data, error } = await supabase
        .from(this.tableName)
        .insert({
          ...segmentData,
          is_active: segmentData.is_active !== undefined ? segmentData.is_active : true,
          is_visible: segmentData.is_visible !== undefined ? segmentData.is_visible : true,
          categories: segmentData.categories || [],
          gallery: segmentData.gallery || [],
        })
        .select('*')
        .single();

      if (error) {
        console.error('Error creating material segment:', error);
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data: data as MaterialSegmentModel,
      };
    } catch (error) {
      console.error('Error creating material segment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get material segments with pagination and filtering
   */
  static async getMaterialSegments(filters: MaterialSegmentFilters = {}): Promise<MaterialSegmentApiResponse<PaginatedMaterialSegmentResponse>> {
    try {
      const {
        search,
        is_active,
        is_visible,
        categories,
        color,
        page = 1,
        limit = 20,
      } = filters;

      let query = supabase
        .from(this.tableName)
        .select('*', { count: 'exact' });

      // Apply filters
      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,short_code.ilike.%${search}%`);
      }

      if (is_active !== undefined) {
        query = query.eq('is_active', is_active);
      }

      if (is_visible !== undefined) {
        query = query.eq('is_visible', is_visible);
      }

      if (color) {
        query = query.or(`color.ilike.%${color}%,color_code.ilike.%${color}%`);
      }

      if (categories && categories.length > 0) {
        query = query.overlaps('categories', categories);
      }

      // Apply sorting
      query = query.order('index', { ascending: true });

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching material segments:', error);
        return {
          success: false,
          error: error.message,
        };
      }

      const total = count || 0;
      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: {
          segments: data as MaterialSegmentModel[],
          pagination: {
            page,
            limit,
            total,
            totalPages,
          },
        },
        total,
        page,
        totalPages,
      };
    } catch (error) {
      console.error('Error fetching material segments:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get material segment by ID
   */
  static async getMaterialSegmentById(id: number): Promise<MaterialSegmentApiResponse<MaterialSegmentModel>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching material segment by ID:', error);
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data: data as MaterialSegmentModel,
      };
    } catch (error) {
      console.error('Error fetching material segment by ID:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Update material segment
   */
  static async updateMaterialSegment(segmentData: UpdateMaterialSegmentRequest): Promise<MaterialSegmentApiResponse<MaterialSegmentModel>> {
    try {
      const { id, ...updateData } = segmentData;

      const { data, error } = await supabase
        .from(this.tableName)
        .update(updateData)
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating material segment:', error);
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data: data as MaterialSegmentModel,
      };
    } catch (error) {
      console.error('Error updating material segment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Delete material segment
   */
  static async deleteMaterialSegment(id: number): Promise<MaterialSegmentApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting material segment:', error);
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data: true,
      };
    } catch (error) {
      console.error('Error deleting material segment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Duplicate material segment
   */
  static async duplicateMaterialSegment(segmentId: number): Promise<MaterialSegmentApiResponse<MaterialSegmentModel>> {
    try {
      // First get the original segment
      const { data: originalSegment, error: fetchError } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', segmentId)
        .single();

      if (fetchError) {
        console.error('Error fetching original segment:', fetchError);
        return {
          success: false,
          error: fetchError.message,
        };
      }

      // Create duplicate with modified name and new index
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...segmentData } = originalSegment;
      const duplicateData = {
        ...segmentData,
        name: `${segmentData.name} (Copy)`,
        index: segmentData.index + 1,
      };

      const { data, error } = await supabase
        .from(this.tableName)
        .insert(duplicateData)
        .select('*')
        .single();

      if (error) {
        console.error('Error duplicating material segment:', error);
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data: data as MaterialSegmentModel,
      };
    } catch (error) {
      console.error('Error duplicating material segment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Toggle visibility of material segment
   */
  static async toggleMaterialSegmentVisibility(id: number): Promise<MaterialSegmentApiResponse<MaterialSegmentModel>> {
    try {
      // First get current visibility
      const { data: currentSegment, error: fetchError } = await supabase
        .from(this.tableName)
        .select('is_visible')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching current segment:', fetchError);
        return {
          success: false,
          error: fetchError.message,
        };
      }

      // Toggle visibility
      const newVisibility = !currentSegment.is_visible;

      const { data, error } = await supabase
        .from(this.tableName)
        .update({ is_visible: newVisibility })
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        console.error('Error toggling segment visibility:', error);
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data: data as MaterialSegmentModel,
      };
    } catch (error) {
      console.error('Error toggling segment visibility:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Toggle active status of material segment
   */
  static async toggleMaterialSegmentActive(id: number): Promise<MaterialSegmentApiResponse<MaterialSegmentModel>> {
    try {
      // First get current active status
      const { data: currentSegment, error: fetchError } = await supabase
        .from(this.tableName)
        .select('is_active')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching current segment:', fetchError);
        return {
          success: false,
          error: fetchError.message,
        };
      }

      // Toggle active status
      const newActiveStatus = !currentSegment.is_active;

      const { data, error } = await supabase
        .from(this.tableName)
        .update({ is_active: newActiveStatus })
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        console.error('Error toggling segment active status:', error);
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data: data as MaterialSegmentModel,
      };
    } catch (error) {
      console.error('Error toggling segment active status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Reorder material segments
   */
  static async reorderMaterialSegments(segmentIds: number[]): Promise<MaterialSegmentApiResponse<MaterialSegmentModel[]>> {
    try {
      const updates = segmentIds.map((id, index) => ({
        id,
        index: index,
      }));

      const updatePromises = updates.map(({ id, index }) =>
        supabase
          .from(this.tableName)
          .update({ index })
          .eq('id', id)
          .select('*')
          .single()
      );

      const results = await Promise.all(updatePromises);
      
      // Check for errors
      for (const result of results) {
        if (result.error) {
          console.error('Error reordering segments:', result.error);
          return {
            success: false,
            error: result.error.message,
          };
        }
      }

      const reorderedSegments = results.map(result => result.data as MaterialSegmentModel);

      return {
        success: true,
        data: reorderedSegments,
      };
    } catch (error) {
      console.error('Error reordering material segments:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Add image to material segment gallery
   */
  static async addToMaterialSegmentGallery(id: number, imageUrl: string): Promise<MaterialSegmentApiResponse<MaterialSegmentModel>> {
    try {
      // First get current gallery
      const { data: currentSegment, error: fetchError } = await supabase
        .from(this.tableName)
        .select('gallery')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching current segment:', fetchError);
        return {
          success: false,
          error: fetchError.message,
        };
      }

      // Add new image to gallery
      const updatedGallery = [...(currentSegment.gallery || []), imageUrl];

      const { data, error } = await supabase
        .from(this.tableName)
        .update({ gallery: updatedGallery })
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        console.error('Error adding to gallery:', error);
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data: data as MaterialSegmentModel,
      };
    } catch (error) {
      console.error('Error adding to gallery:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Remove image from material segment gallery
   */
  static async removeFromMaterialSegmentGallery(id: number, imageUrl: string): Promise<MaterialSegmentApiResponse<MaterialSegmentModel>> {
    try {
      // First get current gallery
      const { data: currentSegment, error: fetchError } = await supabase
        .from(this.tableName)
        .select('gallery')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching current segment:', fetchError);
        return {
          success: false,
          error: fetchError.message,
        };
      }

      // Remove image from gallery
      const updatedGallery = (currentSegment.gallery || []).filter((url: string) => url !== imageUrl);

      const { data, error } = await supabase
        .from(this.tableName)
        .update({ gallery: updatedGallery })
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        console.error('Error removing from gallery:', error);
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data: data as MaterialSegmentModel,
      };
    } catch (error) {
      console.error('Error removing from gallery:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Search material segments
   */
  static async searchMaterialSegments(query: string): Promise<MaterialSegmentApiResponse<MaterialSegmentModel[]>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,short_code.ilike.%${query}%`)
        .order('index', { ascending: true });

      if (error) {
        console.error('Error searching material segments:', error);
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data: data as MaterialSegmentModel[],
      };
    } catch (error) {
      console.error('Error searching material segments:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }


  /**
   * Get all available categories
   */
  static async getMaterialSegmentCategories(): Promise<MaterialSegmentApiResponse<string[]>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('categories')
        .not('categories', 'is', null);

      if (error) {
        console.error('Error fetching categories:', error);
        return {
          success: false,
          error: error.message,
        };
      }

      // Extract unique categories
      const allCategories = data.flatMap(item => item.categories || []);
      const uniqueCategories = [...new Set(allCategories)];

      return {
        success: true,
        data: uniqueCategories,
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Bulk update material segments
   */
  static async bulkUpdateMaterialSegments(updates: Array<{ id: number; updates: Partial<MaterialSegmentModel> }>): Promise<MaterialSegmentApiResponse<MaterialSegmentModel[]>> {
    try {
      const updatePromises = updates.map(({ id, updates: updateData }) =>
        supabase
          .from(this.tableName)
          .update(updateData)
          .eq('id', id)
          .select('*')
          .single()
      );

      const results = await Promise.all(updatePromises);
      
      // Check for errors
      for (const result of results) {
        if (result.error) {
          console.error('Error in bulk update:', result.error);
          return {
            success: false,
            error: result.error.message,
          };
        }
      }

      const updatedSegments = results.map(result => result.data as MaterialSegmentModel);

      return {
        success: true,
        data: updatedSegments,
      };
    } catch (error) {
      console.error('Error bulk updating material segments:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Bulk delete material segments
   */
  static async bulkDeleteMaterialSegments(ids: number[]): Promise<MaterialSegmentApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .in('id', ids);

      if (error) {
        console.error('Error bulk deleting material segments:', error);
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data: true,
      };
    } catch (error) {
      console.error('Error bulk deleting material segments:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get material segment count
   */
  static async getMaterialSegmentCount(filters: Omit<MaterialSegmentFilters, 'page' | 'limit'> = {}): Promise<MaterialSegmentApiResponse<number>> {
    try {
      let query = supabase
        .from(this.tableName)
        .select('*', { count: 'exact', head: true });

      // Apply filters (same as getMaterialSegments but without pagination)
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,short_code.ilike.%${filters.search}%`);
      }

      if (filters.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
      }

      if (filters.is_visible !== undefined) {
        query = query.eq('is_visible', filters.is_visible);
      }

      if (filters.color) {
        query = query.or(`color.ilike.%${filters.color}%,color_code.ilike.%${filters.color}%`);
      }

      if (filters.categories && filters.categories.length > 0) {
        query = query.overlaps('categories', filters.categories);
      }

      const { count, error } = await query;

      if (error) {
        console.error('Error getting material segment count:', error);
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data: count || 0,
      };
    } catch (error) {
      console.error('Error getting material segment count:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}
