import {
  MaterialApi,
  CreateMaterialRequest,
  UpdateMaterialRequest,
  MaterialFilters,
  MaterialApiResponse,
  PaginatedMaterialResponse,
} from "./MaterialApi";
import {
  MaterialModel,
  SingleMaterialResponse,
} from "@/models/swatchBook/material/MaterialModel";

interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export class MaterialService {
  // serve for get wall materials
  static async getWallMaterials({
    page = 0,
    limit = 10,
  }: {
    page?: number;
    limit?: number;
  }): Promise<ServiceResult<MaterialModel[]>> {
    try {
      const result = await MaterialApi.getProductWithSegmentName("Wall");
      if (result.success) {
        return {
          success: true,
          data: result.data,
        };
      }
      return {
        success: false,
        error: result.error || "Failed to fetch wall materials",
      };
    } catch (error) {
      console.error("Error in MaterialService.getWallMaterials:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
  
  // serve for get door materials
  static async getDoorMaterials({
    page = 0,
    limit = 10,
  }: {
    page?: number;
    limit?: number;
  }): Promise<ServiceResult<MaterialModel[]>> {
    try {
      const result = await MaterialApi.getAllSegmentMaterials("Door");
      if (result.success) {
        return {
          success: true,
          data: result.data,
        };
      }
      return {
        success: false,
        error: result.error || "Failed to fetch wall materials",
      };
    } catch (error) {
      console.error("Error in MaterialService.getWallMaterials:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  // roof material
  static async getRoofMaterials({
    page = 0,
    limit = 10,
  }: {
    page?: number;
    limit?: number;
  }): Promise<ServiceResult<MaterialModel[]>> {
    try {
      const result = await MaterialApi.getAllSegmentMaterials("Roof");
      if (result.success) {
        return {
          success: true,
          data: result.data,
        };
      }
      return {
        success: false,
        error: result.error || "Failed to fetch roof materials",
      };
    } catch (error) {
      console.error("Error in MaterialService.getRoofMaterials:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  // fetch window materials
  static async getWindowMaterials({
    page = 0,
    limit = 10,
  }: {
    page?: number;
    limit?: number;
  }): Promise<ServiceResult<MaterialModel[]>> {
    try {
      const result = await MaterialApi.getAllSegmentMaterials("Window");
      if (result.success) {
        return {
          success: true,
          data: result.data,
        };
      }
      return {
        success: false,
        error: result.error || "Failed to fetch window materials",
      };
    } catch (error) {
      console.error("Error in MaterialService.getWindowMaterials:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  // fetch trim materials
  static async getTrimMaterials({
    page = 0,
    limit = 10,
  }: {
    page?: number;
    limit?: number;
  }): Promise<ServiceResult<MaterialModel[]>> {
    try {
      const result = await MaterialApi.getAllSegmentMaterials("Trim");
      if (result.success) {
        return {
          success: true,
          data: result.data,
        };
      }
      return {
        success: false,
        error: result.error || "Failed to fetch trim materials",
      };
    } catch (error) {
      console.error("Error in MaterialService.getTrimMaterials:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  // get all maetrial based on category Id
  static async getMaterialsByCategory_Id(
    categoryId: number,
  ): Promise<{status: boolean, data?: MaterialModel[], error?: string}> {
    return await MaterialApi.getMaterialsByCategoryId(categoryId) 
  }

 // get material based on category id and array of brand Id 
  static async getMaterialsByCategoryAndBrand(
    categoryId: number,
    brandIds: number[]
  ): Promise<{status: boolean, data?: MaterialModel[], error?: string}> {
     return await MaterialApi.getMaterialsByCategoryAndBrandIds(categoryId, brandIds)
  }


  // get all materials based on category Id  , array od brand Id and array of style Id
  static async getMaterialsByCategoryBrandAndStyle(
    categoryId: number,
    brandIds: number[],
    styleIds: number[]
  ): Promise<{status: boolean, data?: MaterialModel[], error?: string}> {
    return await MaterialApi.getMaterialsByCategoryBrandAndStyleIds(categoryId, brandIds, styleIds)
  }

  /**
   * Create a new material with validation
   */
  static async createMaterial(
    materialData: CreateMaterialRequest
  ): Promise<ServiceResult<MaterialModel>> {
    try {
      // Validate required fields
      if (!materialData.title?.trim()) {
        return {
          success: false,
          error: "Material title is required",
        };
      }

      if (!materialData.user_id) {
        return {
          success: false,
          error: "User ID is required",
        };
      }

      if (!materialData.role_id) {
        return {
          success: false,
          error: "Role ID is required",
        };
      }

      if (!materialData.material_category_id) {
        return {
          success: false,
          error: "Material category is required",
        };
      }

      if (!materialData.material_brand_id) {
        return {
          success: false,
          error: "Material brand is required",
        };
      }

      if (!materialData.material_brand_style_id) {
        return {
          success: false,
          error: "Material brand style is required",
        };
      }

      if (!materialData.material_type_id?.trim()) {
        return {
          success: false,
          error: "Material type is required",
        };
      }

      // Sanitize data
      const sanitizedData = {
        ...materialData,
        title: materialData.title.trim(),
        description: materialData.description?.trim(),
        manufacturer_request_note:
          materialData.manufacturer_request_note?.trim(),
      };

      const result = await MaterialApi.createMaterial(sanitizedData);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: "Material created successfully",
        };
      }

      return {
        success: false,
        error: result.error || "Failed to create material",
      };
    } catch (error) {
      console.error("Error in MaterialService.createMaterial:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }


  /**
   * Get materials with pagination and filtering
   */
  static async getMaterials(
    filters: MaterialFilters = {}
  ): Promise<ServiceResult<PaginatedMaterialResponse>> {
    try {
      // Validate and sanitize filters
      const sanitizedFilters = {
        ...filters,
        search: filters.search?.trim() || undefined,
        page: Math.max(1, filters.page || 1),
        limit: Math.min(100, Math.max(1, filters.limit || 20)), // Limit max to 100 items per page
      };

      const result = await MaterialApi.getMaterials(sanitizedFilters);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: `Found ${result.data?.materials.length || 0} materials`,
        };
      }

      return {
        success: false,
        error: result.error || "Failed to fetch materials",
      };
    } catch (error) {
      console.error("Error in MaterialService.getMaterials:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
  /**
   * Get material by ID
   */
  static async getMaterialById(
    id: number
  ): Promise<ServiceResult<SingleMaterialResponse>> {
    try {
      if (!id || id <= 0) {
        return {
          success: false,
          error: "Valid material ID is required",
        };
      }

      const result = await MaterialApi.getMaterialById(id);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: "Material found successfully",
        };
      }

      return {
        success: false,
        error: result.error || "Material not found",
      };
    } catch (error) {
      console.error("Error in MaterialService.getMaterialById:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Get materials by category ID with pagination
   */
  // static async getMaterialsByCategoryId(
  //   categoryId: number,
  //   filters: Omit<MaterialFilters, "material_category_id"> = {}
  // ): Promise<ServiceResult<PaginatedMaterialResponse>> {
  //   try {
  //     if (!categoryId || categoryId <= 0) {
  //       return {
  //         success: false,
  //         error: "Valid category ID is required",
  //       };
  //     }

  //     const result = await MaterialApi.getMaterialsByCategoryId(
  //       categoryId,
  //       filters
  //     );

  //     if (result.success) {
  //       return {
  //         success: true,
  //         data: result.data,
  //         message: `Found ${
  //           result.data?.materials.length || 0
  //         } materials in category`,
  //       };
  //     }

  //     return {
  //       success: false,
  //       error: result.error || "Failed to fetch materials by category",
  //     };
  //   } catch (error) {
  //     console.error(
  //       "Error in MaterialService.getMaterialsByCategoryId:",
  //       error
  //     );
  //     return {
  //       success: false,
  //       error:
  //         error instanceof Error ? error.message : "Unknown error occurred",
  //     };
  //   }
  // }

  /**
   * Get materials by brand ID with pagination
   */
  static async getMaterialsByBrandId(
    brandId: number,
    filters: Omit<MaterialFilters, "material_brand_id"> = {}
  ): Promise<ServiceResult<PaginatedMaterialResponse>> {
    try {
      if (!brandId || brandId <= 0) {
        return {
          success: false,
          error: "Valid brand ID is required",
        };
      }

      const result = await MaterialApi.getMaterialsByBrandId(brandId, filters);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: `Found ${
            result.data?.materials.length || 0
          } materials for brand`,
        };
      }

      return {
        success: false,
        error: result.error || "Failed to fetch materials by brand",
      };
    } catch (error) {
      console.error("Error in MaterialService.getMaterialsByBrandId:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Update material with validation
   */
  static async updateMaterial(
    materialData: UpdateMaterialRequest
  ): Promise<ServiceResult<MaterialModel>> {
    try {
      if (!materialData.id || materialData.id <= 0) {
        return {
          success: false,
          error: "Valid material ID is required",
        };
      }

      // Validate fields if they are being updated
      if (materialData.title !== undefined && !materialData.title.trim()) {
        return {
          success: false,
          error: "Material title cannot be empty",
        };
      }

      // Sanitize data
      const sanitizedData = {
        ...materialData,
        title: materialData.title?.trim(),
        description: materialData.description?.trim(),
        manufacturer_request_note:
          materialData.manufacturer_request_note?.trim(),
      };

      const result = await MaterialApi.updateMaterial(sanitizedData);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: "Material updated successfully",
        };
      }

      return {
        success: false,
        error: result.error || "Failed to update material",
      };
    } catch (error) {
      console.error("Error in MaterialService.updateMaterial:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Delete material
   */
  static async deleteMaterial(id: number): Promise<ServiceResult<boolean>> {
    try {
      if (!id || id <= 0) {
        return {
          success: false,
          error: "Valid material ID is required",
        };
      }

      const result = await MaterialApi.deleteMaterial(id);

      if (result.success) {
        return {
          success: true,
          data: true,
          message: "Material deleted successfully",
        };
      }

      return {
        success: false,
        error: result.error || "Failed to delete material",
      };
    } catch (error) {
      console.error("Error in MaterialService.deleteMaterial:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Toggle material status
   */
  static async toggleMaterialStatus(
    id: number
  ): Promise<ServiceResult<MaterialModel>> {
    try {
      if (!id || id <= 0) {
        return {
          success: false,
          error: "Valid material ID is required",
        };
      }

      const result = await MaterialApi.toggleMaterialStatus(id);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: `Material ${
            result.data?.status ? "activated" : "deactivated"
          } successfully`,
        };
      }

      return {
        success: false,
        error: result.error || "Failed to toggle material status",
      };
    } catch (error) {
      console.error("Error in MaterialService.toggleMaterialStatus:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Get materials by type ID
   */
  static async getMaterialsByTypeId(
    typeId: string,
    filters: Omit<MaterialFilters, "material_type_id"> = {}
  ): Promise<ServiceResult<PaginatedMaterialResponse>> {
    try {
      if (!typeId?.trim()) {
        return {
          success: false,
          error: "Valid type ID is required",
        };
      }

      const result = await MaterialApi.getMaterialsByTypeId(typeId, filters);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: `Found ${
            result.data?.materials.length || 0
          } materials with type ${typeId}`,
        };
      }

      return {
        success: false,
        error: result.error || `Failed to fetch materials by type ${typeId}`,
      };
    } catch (error) {
      console.error("Error in MaterialService.getMaterialsByTypeId:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Get material count
   */
  static async getMaterialCount(
    filters: Omit<MaterialFilters, "page" | "limit"> = {}
  ): Promise<ServiceResult<number>> {
    try {
      const result = await MaterialApi.getMaterialCount(filters);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: `Total materials: ${result.data}`,
        };
      }

      return {
        success: false,
        error: result.error || "Failed to get material count",
      };
    } catch (error) {
      console.error("Error in MaterialService.getMaterialCount:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Bulk delete materials
   */
  static async deleteMaterials(ids: number[]): Promise<ServiceResult<boolean>> {
    try {
      if (!ids || ids.length === 0) {
        return {
          success: false,
          error: "Material IDs are required",
        };
      }

      // Validate all IDs
      const validIds = ids.filter((id) => id > 0);
      if (validIds.length !== ids.length) {
        return {
          success: false,
          error: "All material IDs must be valid positive numbers",
        };
      }

      const result = await MaterialApi.deleteMaterials(validIds);

      if (result.success) {
        return {
          success: true,
          data: true,
          message: `${validIds.length} materials deleted successfully`,
        };
      }

      return {
        success: false,
        error: result.error || "Failed to delete materials",
      };
    } catch (error) {
      console.error("Error in MaterialService.deleteMaterials:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Update materials order
   */
  //   static async updateMaterialsOrder(materials: { id: number; sort_order: number }[]): Promise<ServiceResult<boolean>> {
  //     try {
  //       if (!materials || materials.length === 0) {
  //         return {
  //           success: false,
  //           error: 'Materials data is required',
  //         };
  //       }

  //       // Validate materials data
  //       const validMaterials = materials.filter(
  //         material => material.id > 0 && typeof material.sort_order === 'number'
  //       );

  //       if (validMaterials.length !== materials.length) {
  //         return {
  //           success: false,
  //           error: 'All materials must have valid ID and sort order',
  //         };
  //       }

  //       const result = await MaterialApi.updateMaterialsOrder(validMaterials);

  //       if (result.success) {
  //         return {
  //           success: true,
  //           data: true,
  //           message: 'Materials order updated successfully',
  //         };
  //       }

  //       return {
  //         success: false,
  //         error: result.error || 'Failed to update materials order',
  //       };
  //     } catch (error) {
  //       console.error('Error in MaterialService.updateMaterialsOrder:', error);
  //       return {
  //         success: false,
  //         error: error instanceof Error ? error.message : 'Unknown error occurred',
  //       };
  //     }
  //   }

  /**
   * Get active materials only
   */
  static async getActiveMaterials(
    filters: Omit<MaterialFilters, "status"> = {}
  ): Promise<ServiceResult<PaginatedMaterialResponse>> {
    return this.getMaterials({
      ...filters,
      status: true,
    });
  }

  /**
   * Search materials with advanced filters
   */
  static async searchMaterials(
    searchQuery: string,
    filters: Omit<MaterialFilters, "search"> = {}
  ): Promise<ServiceResult<PaginatedMaterialResponse>> {
    try {
      if (!searchQuery?.trim()) {
        return {
          success: false,
          error: "Search query is required",
        };
      }

      return this.getMaterials({
        ...filters,
        search: searchQuery.trim(),
      });
    } catch (error) {
      console.error("Error in MaterialService.searchMaterials:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
}

// Export types for external use
export type {
  CreateMaterialRequest,
  UpdateMaterialRequest,
  MaterialFilters,
  MaterialApiResponse,
  PaginatedMaterialResponse,
};
export { MaterialApi };
