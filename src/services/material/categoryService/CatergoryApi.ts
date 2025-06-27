import { CategoryModel } from '@/models/swatchBook/category/CategoryModel';
import { supabase } from '@/lib/supabase';

// Error Type Definition
interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
    message: string;
}

// Category API Request Types
export interface CreateCategoryRequest {
    title: string;
    slug?: string;
    description?: string | null;
    photo?: string | null;
    sort_order?: number;
    status?: boolean;
}

export interface UpdateCategoryRequest {
    title?: string;
    slug?: string;
    description?: string | null;
    photo?: string | null;
    sort_order?: number;
    status?: boolean;
}

// Category API Response Types
export interface CategoryApiResponse {
    success: boolean;
    data?: CategoryModel;
    message?: string;
    error?: string;
}

export interface CategoryListResponse {
    success: boolean;
    data?: CategoryModel[];
    message?: string;
    error?: string;
    meta?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface CategoryQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: boolean;
    sort_by?: 'title' | 'sort_order' | 'created_at';
    sort_order?: 'asc' | 'desc';
}

// Category API Class
export class CategoryApi {
    private static readonly TABLE_NAME = 'material_categories';

    /**
     * Create a new category
     */
    static async create(categoryData: CreateCategoryRequest): Promise<CategoryApiResponse> {
        try {
            const { data, error } = await supabase
                .from(this.TABLE_NAME)
                .insert(categoryData)
                .select()
                .single();
            if (error) {
                console.error('Error creating category:', error);
                return {
                    success: false,
                    error: error.message,
                };
            }

            return {
                data: data as CategoryModel,
                success: true,
            };
        } catch (error: unknown) {
            const apiError = error as ApiError;
            return {
                success: false,
                error: apiError.response?.data?.message || apiError.message || 'Failed to create category'
            };
        }
    }

    /**
     * Update an existing category
     */
    static async update(id: number, categoryData: UpdateCategoryRequest): Promise<CategoryApiResponse> {
        try {
            const { data, error } = await supabase
                .from(this.TABLE_NAME)
                .update(categoryData)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('Error updating category:', error);
                return {
                    success: false,
                    error: error.message,
                };
            }

            return {
                data: data as CategoryModel,
                success: true,
            };
        } catch (error: unknown) {
            const apiError = error as ApiError;
            return {
                success: false,
                error: apiError.response?.data?.message || apiError.message || 'Failed to update category'
            };
        }
    }

    /**
     * Get all categories with optional filtering and pagination
     */
    static async getAll(params?: CategoryQueryParams): Promise<CategoryListResponse> {
        try {
            let query = supabase.from(this.TABLE_NAME).select('*', { count: 'exact' });

            // Apply filters
            if (params?.search) {
                query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`);
            }

            if (params?.status !== undefined) {
                query = query.eq('status', params.status);
            }

            // Apply sorting
            if (params?.sort_by) {
                const ascending = params.sort_order === 'asc';
                query = query.order(params.sort_by, { ascending });
            } else {
                query = query.order('sort_order', { ascending: true });
            }

            // Apply pagination
            if (params?.page && params?.limit) {
                const from = (params.page - 1) * params.limit;
                const to = from + params.limit - 1;
                query = query.range(from, to);
            }

            const { data, error, count } = await query;

            if (error) {
                console.error('Error fetching categories:', error);
                return {
                    success: false,
                    error: error.message,
                };
            }

            // Calculate pagination meta
            const meta = params?.page && params?.limit && count !== null ? {
                total: count,
                page: params.page,
                limit: params.limit,
                totalPages: Math.ceil(count / params.limit)
            } : undefined;

            return {
                data: data as CategoryModel[],
                success: true,
                meta
            };
        } catch (error: unknown) {
            const apiError = error as ApiError;
            return {
                success: false,
                error: apiError.response?.data?.message || apiError.message || 'Failed to fetch categories'
            };
        }
    }

    /**
     * Get category by ID
     */
    static async findById(id: number): Promise<CategoryApiResponse> {
        try {
            const { data, error } = await supabase
                .from(this.TABLE_NAME)
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching category:', error);
                return {
                    success: false,
                    error: error.message,
                };
            }

            return {
                data: data as CategoryModel,
                success: true,
            };
        } catch (error: unknown) {
            const apiError = error as ApiError;
            return {
                success: false,
                error: apiError.response?.data?.message || apiError.message || 'Failed to fetch category'
            };
        }
    }

    /**
     * Get category by slug or title
     */
    static async findByName(identifier: string, searchBy: 'slug' | 'title' = 'slug'): Promise<CategoryApiResponse> {
        try {
            const { data, error } = await supabase
                .from(this.TABLE_NAME)
                .select('*')
                .eq(searchBy, identifier)
                .single();

            if (error) {
                console.error('Error fetching category:', error);
                return {
                    success: false,
                    error: error.message,
                };
            }

            return {
                data: data as CategoryModel,
                success: true,
            };
        } catch (error: unknown) {
            const apiError = error as ApiError;
            return {
                success: false,
                error: apiError.response?.data?.message || apiError.message || 'Failed to fetch category'
            };
        }
    }

    /**
     * Delete a category
     */
    static async delete(id: number): Promise<CategoryApiResponse> {
        try {
            const { data, error } = await supabase
                .from(this.TABLE_NAME)
                .delete()
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('Error deleting category:', error);
                return {
                    success: false,
                    error: error.message,
                };
            }

            return {
                data: data as CategoryModel,
                success: true,
            };
        } catch (error: unknown) {
            const apiError = error as ApiError;
            return {
                success: false,
                error: apiError.response?.data?.message || apiError.message || 'Failed to delete category'
            };
        }
    }

    /**
     * Bulk delete categories
     */
    static async bulkDelete(ids: number[]): Promise<CategoryApiResponse> {
        try {
            const { data, error } = await supabase
                .from(this.TABLE_NAME)
                .delete()
                .in('id', ids)
                .select();

            if (error) {
                console.error('Error bulk deleting categories:', error);
                return {
                    success: false,
                    error: error.message,
                };
            }

            return {
                success: true,
                message: `${data?.length || 0} categories deleted successfully`
            };
        } catch (error: unknown) {
            const apiError = error as ApiError;
            return {
                success: false,
                error: apiError.response?.data?.message || apiError.message || 'Failed to delete categories'
            };
        }
    }

    /**
     * Update category status (enable/disable)
     */
    static async updateStatus(id: number, status: boolean): Promise<CategoryApiResponse> {
        try {
            const { data, error } = await supabase
                .from(this.TABLE_NAME)
                .update({ status })
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('Error updating category status:', error);
                return {
                    success: false,
                    error: error.message,
                };
            }

            return {
                data: data as CategoryModel,
                success: true,
            };
        } catch (error: unknown) {
            const apiError = error as ApiError;
            return {
                success: false,
                error: apiError.response?.data?.message || apiError.message || 'Failed to update category status'
            };
        }
    }

    /**
     * Reorder categories
     */
    static async reorder(categoryOrders: Array<{ id: number; sort_order: number }>): Promise<CategoryApiResponse> {
        try {
            // Update each category's sort order
            const updatePromises = categoryOrders.map(async ({ id, sort_order }) => {
                const { error } = await supabase
                    .from(this.TABLE_NAME)
                    .update({ sort_order })
                    .eq('id', id);
                
                if (error) {
                    throw error;
                }
            });

            await Promise.all(updatePromises);

            return {
                success: true,
                message: 'Categories reordered successfully'
            };
        } catch (error: unknown) {
            const apiError = error as ApiError;
            return {
                success: false,
                error: apiError.response?.data?.message || apiError.message || 'Failed to reorder categories'
            };
        }
    }
}