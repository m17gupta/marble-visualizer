import { supabase } from '@/lib/supabase';
import { MaterialModel } from '@/models/swatchBook/material/MaterialModel';

export interface CreateMaterialRequest {
  user_id: number;
  role_id: number;
  material_category_id: number;
  material_brand_id: number;
  material_brand_style_id: number;
  material_type_id: string;
  title: string;
  description?: string;
  photo?: string;
  color?: string;
  bucket_path?: string;
  is_admin?: boolean;
  finish_needed?: boolean;
  is_featured?: boolean;
  manufacturer_request?: boolean;
  manufacturer_request_note?: string;
  status?: boolean;
}

export interface UpdateMaterialRequest {
  id: number;
  user_id?: number;
  role_id?: number;
  material_category_id?: number;
  material_brand_id?: number;
  material_brand_style_id?: number;
  material_type_id?: string;
  title?: string;
  description?: string;
  photo?: string;
  color?: string;
  bucket_path?: string;
  is_admin?: boolean;
  finish_needed?: boolean;
  is_featured?: boolean;
  manufacturer_request?: boolean;
  manufacturer_request_note?: string;
  status?: boolean;
}

export interface MaterialFilters {
  search?: string;
  user_id?: number;
  role_id?: number;
  material_category_id?: number;
  material_brand_id?: number;
  material_brand_style_id?: number;
  material_type_id?: string;
  color?: string;
  is_admin?: boolean;
  finish_needed?: boolean;
  is_featured?: boolean;
  manufacturer_request?: boolean;
  status?: boolean;
  sort_by?: 'title' | 'created' | 'modified';
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface MaterialApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
  total?: number;
  page?: number;
  totalPages?: number;
}

export interface PaginatedMaterialResponse {
  materials: MaterialModel[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class MaterialApi {
  private static tableName = 'materials';

  /**
   * Create a new material
   */
  static async createMaterial(materialData: CreateMaterialRequest): Promise<MaterialApiResponse<MaterialModel>> {
    try {
      // Insert new material
      const { data, error } = await supabase
        .from(this.tableName)
        .insert({
          ...materialData,
          is_admin: materialData.is_admin || false,
          finish_needed: materialData.finish_needed || false,
          is_featured: materialData.is_featured || false,
          manufacturer_request: materialData.manufacturer_request || false,
          status: materialData.status !== undefined ? materialData.status : true,
          created: new Date().toISOString(),
          modified: new Date().toISOString(),
        })
        .select('*')
        .single();

      if (error) {
        console.error('Error creating material:', error);
        return {
          success: false,
          error: error.message || 'Failed to create material',
        };
      }

      return {
        success: true,
        data: data as MaterialModel,
      };
    } catch (error) {
      console.error('Error creating material:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get materials with pagination and filtering
   */
  static async getMaterials(filters: MaterialFilters = {}): Promise<MaterialApiResponse<PaginatedMaterialResponse>> {
    try {
      const {
        search,
        user_id,
        role_id,
        material_category_id,
        material_brand_id,
        material_brand_style_id,
        material_type_id,
        color,
        is_admin,
        finish_needed,
        is_featured,
        manufacturer_request,
        status,
        sort_by = 'created',
        sort_order = 'desc',
        page = 1,
        limit = 20,
      } = filters;

      let query = supabase
        .from(this.tableName)
        .select('*', { count: 'exact' });

      // Apply filters
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }

      if (user_id) {
        query = query.eq('user_id', user_id);
      }

      if (role_id) {
        query = query.eq('role_id', role_id);
      }

      if (material_category_id) {
        query = query.eq('material_category_id', material_category_id);
      }

      if (material_brand_id) {
        query = query.eq('material_brand_id', material_brand_id);
      }

      if (material_brand_style_id) {
        query = query.eq('material_brand_style_id', material_brand_style_id);
      }

      if (material_type_id) {
        query = query.eq('material_type_id', material_type_id);
      }

      if (color) {
        query = query.eq('color', color);
      }

      if (is_admin !== undefined) {
        query = query.eq('is_admin', is_admin);
      }

      if (finish_needed !== undefined) {
        query = query.eq('finish_needed', finish_needed);
      }

      if (is_featured !== undefined) {
        query = query.eq('is_featured', is_featured);
      }

      if (manufacturer_request !== undefined) {
        query = query.eq('manufacturer_request', manufacturer_request);
      }

      if (status !== undefined) {
        query = query.eq('status', status);
      }

      // Apply sorting
      query = query.order(sort_by, { ascending: sort_order === 'asc' });

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching materials:', error);
        return {
          success: false,
          error: error.message || 'Failed to fetch materials',
        };
      }

      const total = count || 0;
      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: {
          materials: data as MaterialModel[],
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
      console.error('Error fetching materials:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get material by ID
   */
  static async getMaterialById(id: number): Promise<MaterialApiResponse<MaterialModel>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching material by ID:', error);
        return {
          success: false,
          error: error.message || 'Material not found',
        };
      }

      return {
        success: true,
        data: data as MaterialModel,
      };
    } catch (error) {
      console.error('Error fetching material by ID:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get materials by role ID
   */
  static async getMaterialsByRoleId(
    roleId: number,
    filters: Omit<MaterialFilters, 'role_id'> = {}
  ): Promise<MaterialApiResponse<PaginatedMaterialResponse>> {
    return this.getMaterials({
      ...filters,
      role_id: roleId,
    });
  }

  /**
   * Get materials by category ID
   */
  static async getMaterialsByCategoryId(
    categoryId: number,
    filters: Omit<MaterialFilters, 'material_category_id'> = {}
  ): Promise<MaterialApiResponse<PaginatedMaterialResponse>> {
    return this.getMaterials({
      ...filters,
      material_category_id: categoryId,
    });
  }

  /**
   * Get materials by brand ID
   */
  static async getMaterialsByBrandId(
    brandId: number,
    filters: Omit<MaterialFilters, 'material_brand_id'> = {}
  ): Promise<MaterialApiResponse<PaginatedMaterialResponse>> {
    return this.getMaterials({
      ...filters,
      material_brand_id: brandId,
    });
  }

  /**
   * Get materials by type ID
   */
  static async getMaterialsByTypeId(
    typeId: string,
    filters: Omit<MaterialFilters, 'material_type_id'> = {}
  ): Promise<MaterialApiResponse<PaginatedMaterialResponse>> {
    return this.getMaterials({
      ...filters,
      material_type_id: typeId,
    });
  }

  /**
   * Update material
   */
  static async updateMaterial(materialData: UpdateMaterialRequest): Promise<MaterialApiResponse<MaterialModel>> {
    try {
      const { id, ...updateData } = materialData;

      // Update the modified timestamp
      const updateDataWithTimestamp = {
        ...updateData,
        modified: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from(this.tableName)
        .update(updateDataWithTimestamp)
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating material:', error);
        return {
          success: false,
          error: error.message || 'Failed to update material',
        };
      }

      return {
        success: true,
        data: data as MaterialModel,
      };
    } catch (error) {
      console.error('Error updating material:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Delete material
   */
  static async deleteMaterial(id: number): Promise<MaterialApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting material:', error);
        return {
          success: false,
          error: error.message || 'Failed to delete material',
        };
      }

      return {
        success: true,
        data: true,
      };
    } catch (error) {
      console.error('Error deleting material:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Toggle material status
   */
  static async toggleMaterialStatus(id: number): Promise<MaterialApiResponse<MaterialModel>> {
    try {
      // First get current status
      const { data: currentMaterial, error: fetchError } = await supabase
        .from(this.tableName)
        .select('status')
        .eq('id', id)
        .single();

      if (fetchError) {
        return {
          success: false,
          error: fetchError.message || 'Material not found',
        };
      }

      // Toggle status
      const newStatus = !currentMaterial.status;

      const { data, error } = await supabase
        .from(this.tableName)
        .update({ status: newStatus })
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        console.error('Error toggling material status:', error);
        return {
          success: false,
          error: error.message || 'Failed to toggle material status',
        };
      }

      return {
        success: true,
        data: data as MaterialModel,
      };
    } catch (error) {
      console.error('Error toggling material status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get material count
   */
  static async getMaterialCount(filters: Omit<MaterialFilters, 'page' | 'limit'> = {}): Promise<MaterialApiResponse<number>> {
    try {
      let query = supabase
        .from(this.tableName)
        .select('*', { count: 'exact', head: true });

      // Apply filters (same as getMaterials but without pagination)
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters.user_id) {
        query = query.eq('user_id', filters.user_id);
      }

      if (filters.role_id) {
        query = query.eq('role_id', filters.role_id);
      }

      if (filters.material_category_id) {
        query = query.eq('material_category_id', filters.material_category_id);
      }

      if (filters.material_brand_id) {
        query = query.eq('material_brand_id', filters.material_brand_id);
      }

      if (filters.material_brand_style_id) {
        query = query.eq('material_brand_style_id', filters.material_brand_style_id);
      }

      if (filters.material_type_id) {
        query = query.eq('material_type_id', filters.material_type_id);
      }

      if (filters.color) {
        query = query.eq('color', filters.color);
      }

      if (filters.is_admin !== undefined) {
        query = query.eq('is_admin', filters.is_admin);
      }

      if (filters.finish_needed !== undefined) {
        query = query.eq('finish_needed', filters.finish_needed);
      }

      if (filters.is_featured !== undefined) {
        query = query.eq('is_featured', filters.is_featured);
      }

      if (filters.manufacturer_request !== undefined) {
        query = query.eq('manufacturer_request', filters.manufacturer_request);
      }

      if (filters.status !== undefined) {
        query = query.eq('status', filters.status);
      }

      const { count, error } = await query;

      if (error) {
        console.error('Error getting material count:', error);
        return {
          success: false,
          error: error.message || 'Failed to get material count',
        };
      }

      return {
        success: true,
        data: count || 0,
      };
    } catch (error) {
      console.error('Error getting material count:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Bulk delete materials
   */
  static async deleteMaterials(ids: number[]): Promise<MaterialApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .in('id', ids);

      if (error) {
        console.error('Error deleting materials:', error);
        return {
          success: false,
          error: error.message || 'Failed to delete materials',
        };
      }

      return {
        success: true,
        data: true,
      };
    } catch (error) {
      console.error('Error deleting materials:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}
