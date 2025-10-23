import { MaterialConnection } from "@/components/swatchBook/interfaces";
import { supabase } from "@/lib/supabase";

export interface ApiResponse {
  data: MaterialConnection[] | MaterialConnection;
  status: boolean;
}

export class AdminMaterialConnectionService {
  /**
   * get project by user id
   */
  static async getMaterialConnectionByPagination(
    orderby: string,
    order: string
  ): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from("product_brand_categories")
        .select(`*,brand_id(*),category_id(*),material_segment_id(*)`)
        .order(`${orderby}`, { ascending: order == "asec" ? true : false });

      if (!error) {
        return {
          data: data as MaterialConnection[],
          status: true,
        } as ApiResponse;
      } else {
        return {
          data: [],
          status: false,
        } as ApiResponse;
      }
    } catch (error) {
      console.error("Error in Admin Material Connection Services==>>>", error);
      return {
        data: [],
        status: false,
      } as ApiResponse;
    }
  }

  static async addMaterialConnection(
    product: MaterialConnection
  ): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from("product_brand_categories")
        .insert(product)
        .select("*")
        .single();

      if (!error) {
        return {
          data: data as MaterialConnection,
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

  static async updateMaterialConnection({
    product,
    id,
  }: {
    product: MaterialConnection;
    id: number;
  }): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from("product_brand_categories")
        .update(product)
        .eq("id", id)
        .select(`*,brand_id,category_id(*),material_segment_id(*)`)
        .single();

      if (error) {
        return {
          data: {},
          status: false,
        } as ApiResponse;
      } else {
        return {
          data: data as MaterialConnection,
          status: true,
        };
      }
    } catch (error) {
      console.error("Error in updateMaterialSegment:", error);
      return {
        data: {},
        status: false,
      } as ApiResponse;
    }
  }
}
