import { ProductCategory } from "@/AdminPannel/reduxslices/adminMaterialCategorySlice";

import { supabase } from "@/lib/supabase";

export interface ApiResponse {
  data: ProductCategory[] | ProductCategory;
  status: boolean;
}

export class AdminMaterialCategoryService {
  /**
   * get project by user id
   */
  static async getMaterialCategoriesByPagination(
    orderby: string,
    order: string
  ): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from("product_categories")
        .select(
          `*,  product_brand_categories(brand_id(name), material_segment_id(name))
        `
        )
        .order(`${orderby}`, { ascending: order == "asec" ? true : false });
      let final = data!.map((d) => {
        const f = Array.from(
          new Set([
            ...d.product_brand_categories.map(
              (d: any) => d.material_segment_id.name
            ),
          ])
        ).join(", ");

        const t = Array.from(
          new Set([
            ...d.product_brand_categories.map((d: any) => d.brand_id.name),
          ])
        ).join(", ");

        delete d.product_brand_categories;

        return {
          ...d,
          brand_id: t || null,
          material_segment_id: f || null,
        };
      });

      if (!error) {
        return {
          data: final as ProductCategory[],
          status: true,
        } as ApiResponse;
      } else {
        return {
          data: [],
          status: false,
        } as ApiResponse;
      }
    } catch (error) {
      console.error("Error in Admin Projects Services==>>>", error);
      return {
        data: [],
        status: false,
      } as ApiResponse;
    }
  }

  static async addMaterialCategory(
    product: ProductCategory
  ): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from("product_categories")
        .insert(product)
        .select("*")
        .single();

      if (!error) {
        return {
          data: data as ProductCategory,
          status: true,
        } as ApiResponse;
      } else {
        return {
          data: {},
          status: false,
        } as ApiResponse;
      }
    } catch (error) {
      console.error("Error in Admin Projects Services==>>>", error);
      return {
        data: {},
        status: false,
      } as ApiResponse;
    }
  }

  static async updateMaterialCategory({
    product,
    id,
  }: {
    product: ProductCategory;
    id: number;
  }): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from("product_categories")
        .update(product)
        .eq("id", id)
        .select("*")
        .single();

      if (!error) {
        return {
          data: data as ProductCategory,
          status: true,
        } as ApiResponse;
      } else {
        return {
          data: {},
          status: false,
        } as ApiResponse;
      }
    } catch (error) {
      console.error("Error in Admin Projects Services==>>>", error);
      return {
        data: {},
        status: false,
      } as ApiResponse;
    }
  }
}
