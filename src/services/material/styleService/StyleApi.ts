import { supabase } from '@/lib/supabase';
import { StyleModel } from '@/models/swatchBook/styleModel/StyleModel';

export interface CreateStyleRequest {
  material_brand_id: number;
  title: string;
  description?: string;
  photo?: string;
  status?: boolean;
  sort_order?: number;
}

export interface UpdateStyleRequest {
  id: number;
  material_brand_id?: number;
  title?: string;
  description?: string;
  photo?: string;
  status?: boolean;
  sort_order?: number;
}

export interface StyleFilters {
  search?: string;
  material_brand_id?: number;
  status?: boolean;
  sort_by?: 'title' | 'sort_order' | 'created_at';
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface StyleApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
}

export class StyleApi {
  private static tableName = 'material_brand_styles';

  /**
   * Create a new style
   */
  static async createStyle(styleData: CreateStyleRequest): Promise<StyleApiResponse<StyleModel>> {
    try {
      // Generate slug from title
      const slug = styleData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      // If sort_order is not provided, get the next available sort order
      let sortOrder = styleData.sort_order;
      if (sortOrder === undefined) {
        const { data: maxSortOrder } = await supabase
          .from(this.tableName)
          .select('sort_order')
          .order('sort_order', { ascending: false })
          .limit(1)
          .single();

        sortOrder = maxSortOrder ? maxSortOrder.sort_order + 1 : 1;
      }

      const { data, error } = await supabase
        .from(this.tableName)
        .insert({
          ...styleData,
          slug,
          sort_order: sortOrder,
          status: styleData.status ?? true,
        })
        .select('*')
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        data: data as StyleModel,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create style',
      };
    }
  }

  /**
   * Update an existing style
   */
  static async updateStyle(styleData: UpdateStyleRequest): Promise<StyleApiResponse<StyleModel>> {
    try {
      const updateData: Partial<StyleModel> = { ...styleData };

      // Generate new slug if title is being updated
      if (styleData.title) {
        updateData.slug = styleData.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
      }

      const { data, error } = await supabase
        .from(this.tableName)
        .update(updateData)
        .eq('id', styleData.id)
        .select('*')
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        data: data as StyleModel,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update style',
      };
    }
  }

  /**
   * Delete a style
   */
  static async deleteStyle(id: number): Promise<StyleApiResponse<void>> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete style',
      };
    }
  }

  /**
   * Delete multiple styles
   */
  static async deleteStyles(ids: number[]): Promise<StyleApiResponse<void>> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .in('id', ids);

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete styles',
      };
    }
  }

  /**
   * Get all styles with optional filtering
   */
  static async getStyles(filters: StyleFilters = {}): Promise<StyleApiResponse<StyleModel[]>> {
    try {
      let query = supabase.from(this.tableName).select('*');

      // Apply filters
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters.material_brand_id !== undefined) {
        query = query.eq('material_brand_id', filters.material_brand_id);
      }

      if (filters.status !== undefined) {
        query = query.eq('status', filters.status);
      }

      // Apply sorting
      const sortBy = filters.sort_by || 'sort_order';
      const sortOrder = filters.sort_order || 'asc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      if (filters.limit !== undefined) {
        query = query.limit(filters.limit);
      }

      if (filters.offset !== undefined) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
      }

      const { data, error, count } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        data: data as StyleModel[],
        count: count || data?.length || 0,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch styles',
      };
    }
  }

  /**
   * Get active styles only
   */
  static async getActiveStyles(brandId?: number): Promise<StyleApiResponse<StyleModel[]>> {
    const filters: StyleFilters = {
      status: true,
      sort_by: 'sort_order',
      sort_order: 'asc',
    };

    if (brandId !== undefined) {
      filters.material_brand_id = brandId;
    }

    return this.getStyles(filters);
  }

  /**
   * Get style by ID
   */
  static async getStyleById(id: number): Promise<StyleApiResponse<StyleModel>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        data: data as StyleModel,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch style',
      };
    }
  }

  /**
   * Get style by name (title or slug)
   */
  static async getStyleByName(name: string, field: 'title' | 'slug' = 'title'): Promise<StyleApiResponse<StyleModel>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq(field, name)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        data: data as StyleModel,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch style',
      };
    }
  }

  /**
   * Toggle style status
   */
  static async toggleStyleStatus(id: number): Promise<StyleApiResponse<StyleModel>> {
    try {
      // First get the current status
      const currentResult = await this.getStyleById(id);
      if (!currentResult.success || !currentResult.data) {
        throw new Error('Style not found');
      }

      const newStatus = !currentResult.data.status;

      const { data, error } = await supabase
        .from(this.tableName)
        .update({ status: newStatus })
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        data: data as StyleModel,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to toggle style status',
      };
    }
  }

  /**
   * Update style status
   */
  static async updateStyleStatus(id: number, status: boolean): Promise<StyleApiResponse<StyleModel>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .update({ status })
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        data: data as StyleModel,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update style status',
      };
    }
  }

  /**
   * Reorder styles
   */
  static async reorderStyles(styleOrders: { id: number; sort_order: number }[]): Promise<StyleApiResponse<void>> {
    try {
      // Update each style's sort order
      const updatePromises = styleOrders.map(({ id, sort_order }) =>
        supabase
          .from(this.tableName)
          .update({ sort_order })
          .eq('id', id)
      );

      const results = await Promise.all(updatePromises);

      // Check if any update failed
      const failedUpdate = results.find(result => result.error);
      if (failedUpdate?.error) {
        throw new Error(failedUpdate.error.message);
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to reorder styles',
      };
    }
  }
}
