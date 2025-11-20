import { supabase } from '@/lib/supabase';
import { BrandModel } from '@/models/swatchBook/brand/BrandModel';

export interface CreateBrandRequest {
  material_category_id: number;
  title: string;
  description?: string | null;
  photo?: string | null;
  status?: boolean;
  sort_order?: number;
}

export interface UpdateBrandRequest {
  id: number;
  material_category_id?: number;
  title?: string;
  description?: string | null;
  photo?: string | null;
  status?: boolean;
  sort_order?: number;
}

export interface BrandFilters {
  search?: string;
  material_category_id?: number;
  status?: boolean;
  sort_by?: 'title' | 'sort_order' | 'created_at';
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface BrandApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
}

export class BrandApi {
  private static tableName = 'product_brand';

  /**
   * Create a new brand
   */
  static async createBrand(brandData: CreateBrandRequest): Promise<BrandApiResponse<BrandModel>> {
    try {
      // Generate slug from title
      const slug = brandData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      // If sort_order is not provided, get the next available sort order
      let sortOrder = brandData.sort_order;
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
          ...brandData,
          slug,
          sort_order: sortOrder,
          status: brandData.status ?? true,
        })
        .select('*')
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        data: data as BrandModel,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create brand',
      };
    }
  }

  /**
   * Update an existing brand
   */
  static async updateBrand(brandData: UpdateBrandRequest): Promise<BrandApiResponse<BrandModel>> {
    try {
      const updateData: Partial<BrandModel> = { ...brandData };
      delete (updateData as Partial<BrandModel> & { id?: number }).id;

      // Generate new slug if title is being updated
      if (brandData.title) {
        updateData.slug = brandData.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
      }

      const { data, error } = await supabase
        .from(this.tableName)
        .update(updateData)
        .eq('id', brandData.id)
        .select('*')
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        data: data as BrandModel,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update brand',
      };
    }
  }

  /**
   * Get all brands with optional filtering
   */
  static async getBrands(filters: BrandFilters = {}): Promise<BrandApiResponse<BrandModel[]>> {
    try {
      let query = supabase.from(this.tableName).select('*');

      // Apply filters
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters.material_category_id !== undefined) {
        query = query.eq('material_category_id', filters.material_category_id);
      }

      if (filters.status !== undefined) {
        query = query.eq('status', filters.status);
      }

      // // Apply sorting
      // const sortBy = filters.sort_by || 'sort_order';
      // const sortOrder = filters.sort_order || 'asc';
      // query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
      }

      const { data, error, count } = await query;

      if (error) {
                console.log("error on geting brand---", error)
        throw new Error(error.message);
      }

      return {
        success: true,
        data: data as BrandModel[],
        count: count || 0,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch brands',
      };
    }
  }

  /**
   * Get active brands only
   */
  static async getActiveBrands(categoryId?: number): Promise<BrandApiResponse<BrandModel[]>> {
    const filters: BrandFilters = { 
      status: true,
      sort_by: 'sort_order',
      sort_order: 'asc'
    };
    
    if (categoryId !== undefined) {
      filters.material_category_id = categoryId;
    }

    return this.getBrands(filters);
  }

  /**
   * Get brand by ID
   */
  static async getBrandById(id: number): Promise<BrandApiResponse<BrandModel>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        return {
          success: false,
          error: 'Brand not found',
        };
      }

      return {
        success: true,
        data: data as BrandModel,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch brand',
      };
    }
  }

  /**
   * Get brand by title or slug
   */
  static async getBrandByName(
    name: string, 
    field: 'title' | 'slug' = 'title'
  ): Promise<BrandApiResponse<BrandModel>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq(field, name)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        return {
          success: false,
          error: 'Brand not found',
        };
      }

      return {
        success: true,
        data: data as BrandModel,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch brand',
      };
    }
  }

  /**
   * Delete a brand
   */
  static async deleteBrand(id: number): Promise<BrandApiResponse<void>> {
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
        error: error instanceof Error ? error.message : 'Failed to delete brand',
      };
    }
  }

  /**
   * Bulk delete brands
   */
  static async deleteBrands(ids: number[]): Promise<BrandApiResponse<void>> {
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
        error: error instanceof Error ? error.message : 'Failed to delete brands',
      };
    }
  }

  /**
   * Update brand status
   */
  static async updateBrandStatus(id: number, status: boolean): Promise<BrandApiResponse<BrandModel>> {
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
        data: data as BrandModel,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update brand status',
      };
    }
  }

  /**
   * Reorder brands
   */
  static async reorderBrands(brandOrders: { id: number; sort_order: number }[]): Promise<BrandApiResponse<void>> {
    try {
      const updates = brandOrders.map(({ id, sort_order }) =>
        supabase
          .from(this.tableName)
          .update({ sort_order })
          .eq('id', id)
      );

      const results = await Promise.all(updates);
      
      for (const result of results) {
        if (result.error) {
          throw new Error(result.error.message);
        }
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to reorder brands',
      };
    }
  }

  /**
   * Count brands with filters
   */
  static async countBrands(filters: BrandFilters = {}): Promise<BrandApiResponse<number>> {
    try {
      let query = supabase.from(this.tableName).select('id', { count: 'exact', head: true });

      // Apply filters
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters.material_category_id !== undefined) {
        query = query.eq('material_category_id', filters.material_category_id);
      }

      if (filters.status !== undefined) {
        query = query.eq('status', filters.status);
      }

      const { count, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        data: count || 0,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to count brands',
      };
    }
  }
}
