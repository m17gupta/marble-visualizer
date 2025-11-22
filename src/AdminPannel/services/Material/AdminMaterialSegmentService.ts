import {
  ProductBrand,
  StylesModal,
} from "@/AdminPannel/reduxslices/MaterialBrandSlice";
import { MaterialSegment } from "@/components/swatchBook/interfaces";
import { supabase } from "@/lib/supabase";

export interface ApiResponse {
  data: MaterialSegment[] | MaterialSegment;
  status: boolean;
}

export interface BrandStyleApiResponse {
  data: StylesModal[] | StylesModal;
  status: boolean;
}

export class AdminMaterialSegmentService {
  /**
   * get project by user id
   */
  static async getMaterialSegmentByPagination(
    orderby: string,
    order: string
  ): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from("product_segments")
        .select(
          `id,name,color,color_code,icon,icon_svg,index,is_active,is_visible,description,short_code`
        )
        .order(`${orderby}`, { ascending: order == "asec" ? true : false });

      if (!error) {
        return {
          data: data as MaterialSegment[],
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

  static async addMaterialSegment(
    product: MaterialSegment
  ): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from("product_segments")
        .insert(product)
        .select("*");

      if (!error) {
        return {
          data: data as MaterialSegment,
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

  static async updateMaterialSegment({
    product,
    id,
  }: {
    product: MaterialSegment;
    id: number;
  }): Promise<ApiResponse> {
    try {
      // First, check if the record exists
      const { data: existingRecord, error: checkError } = await supabase
        .from("product_segments")
        .select("id")
        .eq("id", id)
        .single();

      if (checkError) {
        console.error("Record not found:", checkError);
        return {
          data: {},
          status: false,
        } as ApiResponse;
      }

      // Define allowed fields that exist in the database (based on select query)
      const allowedFields = [
        "name",
        "color",
        "color_code",
        "icon",
        "icon_svg",
        "index",
        "is_active",
        "is_visible",
        "description",
        "short_code",
      ];

      // Clean the product data to only include allowed fields and remove undefined/null values
      const cleanedProduct = Object.entries(product).reduce(
        (acc, [key, value]) => {
          if (
            allowedFields.includes(key) &&
            value !== undefined &&
            value !== null
          ) {
            acc[key] = value;
          }
          return acc;
        },
        {} as any
      );

      console.log("Cleaned product data:", cleanedProduct);

      const { data, error } = await supabase
        .from("product_segments")
        .update(cleanedProduct)
        .eq("id", id)
        .select(
          "id,name,color,color_code,icon,icon_svg,index,is_active,is_visible,description,short_code"
        )
        .single();

      if (!error && data) {
        console.log("Update successful:", data);
        return {
          data: data as MaterialSegment,
          status: true,
        } as ApiResponse;
      } else {
        console.error("Update failed:", error);
        return {
          data: {},
          status: false,
        } as ApiResponse;
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
