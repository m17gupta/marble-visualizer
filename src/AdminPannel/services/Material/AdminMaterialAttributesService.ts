import { MaterialAttributes } from "@/components/swatchBook/interfaces";
import { supabase } from "@/lib/supabase";

export interface ApiResponse {
  data: MaterialAttributes[] | MaterialAttributes;
  status: boolean;
}

export class AdminMaterialAttributesService {
  /**
   * get project by user id
   */
  static async getMaterialAttributesByPagination(
    orderby: string,
    order: string
  ): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from("product_attributes")
        .select(`id,name,unit,possible_values,category_id(*)`)
        .order(`${orderby}`, { ascending: order == "asec" ? true : false });

      if (!error) {
        return {
          data: data as MaterialAttributes[],
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

  static async addMaterialAttributes(
    product: MaterialAttributes
  ): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from("product_attributes")
        .insert(product)
        .select("*")
        .single();

      if (!error) {
        return {
          data: data as MaterialAttributes,
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

  static async updateMaterialAttributes({
    product,
    id,
  }: {
    product: MaterialAttributes;
    id: number;
  }): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from("product_attributes")
        .update(product)
        .eq("id", id)
        .select(`id,name,unit,possible_values,category_id(id,name)`)
        .single();

      if (error) {
        return {
          data: {},
          status: false,
        } as ApiResponse;
      } else {
        return {
          data: data as MaterialAttributes,
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
