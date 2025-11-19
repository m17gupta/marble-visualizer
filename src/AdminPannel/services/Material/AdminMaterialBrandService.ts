import {
  ProductBrand,
  StylesModal,
} from "@/AdminPannel/reduxslices/MaterialBrandSlice";
import { supabase } from "@/lib/supabase";

export interface ApiResponse {
  data: ProductBrand[] | ProductBrand;
  status: boolean;
}

export interface BrandStyleApiResponse {
  data: StylesModal[] | StylesModal;
  status: boolean;
}

export class AdminMaterialBrandService {
  /**
   * get project by user id
   */
  static async getMaterialBrandByPagination(
    orderby: string,
    order: string
  ): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from("product_brand")
        .select("*")
        .order(orderby, { ascending: order === "asc" });

      const flattened = data?.map((d) => {
        if (d.product_brand_categories.length === 0) {
          return {
            id: d.id,
            name: d.name,
            url: d.url,
            logo: d.logo,
            description: d.description,
            created_at: d.created_at,
            updated_at: d.updated_at,
            category_id: null,
            product_brand_categories: null,
            material_segment_id: null,
          };
        } else {
          return {
            id: d.id,
            name: d.name,
            url: d.url,
            logo: d.logo,
            description: d.description,
            created_at: d.created_at,
            updated_at: d.updated_at,
            product_brand_categories: d.product_brand_categories,
            category_id: Array.from(
              new Set(
                d.product_brand_categories.map((d: any) => d.category_id.name)
              )
            ),
            material_segment_id: Array.from(
              new Set(
                d.product_brand_categories.map(
                  (d: any) => d.material_segment_id.name
                )
              )
            ),
          };
        }
      });

      // const flattened = data!.flatMap((cat: any) => {
      //   if (cat.product_brand_categories.length === 0) {
      //     // If no brand, still keep the category
      //     return [
      //       {
      //         id: cat.id,
      //         name: cat.name,
      //         url: cat.url,
      //         logo: cat.logo,
      //         description: cat.description,
      //         created_at: cat.created_at,
      //         updated_at: cat.updated_at,
      //         category_id: null,
      //         material_segment_id: null,
      //       },
      //     ];
      //   }

      //   return cat.product_brand_categories.map((pb: any) => ({
      //     id: cat.id,
      //     name: cat.name,
      //     url: cat.url,
      //     logo: cat.logo,
      //     description: cat.description,
      //     created_at: cat.created_at,
      //     updated_at: cat.updated_at,
      //     category_id: pb.category_id?.name || null,
      //     material_segment_id: pb.material_segment_id?.name || null,
      //   }));
      // });

      if (!error) {
        return {
          data: flattened as ProductBrand[],
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

  static async getMaterialStyles(product: ProductBrand): Promise<ApiResponse> {
    try {
      // console.log("product-----",product)
      const { data, error } = await supabase
        .from("product_brand_styles")
        .select(`*`)
        .eq("product_brand_id", product.id);

        // console.log("error in bran s stykles",error)

      const brandwithstyles = { ...product, styles: data };

      if (!error) {
        return {
          data: brandwithstyles as ProductBrand,
          status: true,
        } as ApiResponse;
      } else {
        return {
          data: product,
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

  static async addMaterialBrand(product: ProductBrand): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from("product_brand")
        .insert(product)
        .select("*");

      if (!error) {
        return {
          data: data as ProductBrand,
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

  static async updateMaterialBrand({
    product,
    id,
  }: {
    product: ProductBrand;
    id: number;
  }): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from("product_brand")
        .update(product)
        .eq("id", id)
        .select("*")
        .single();

      if (!error) {
        return {
          data: data as ProductBrand,
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

  static async updateMaterialBrandStyle({
    product,
    id,
  }: {
    product: StylesModal;
    id: number;
  }): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from("product_brand_styles")
        .update(product)
        .eq("id", id)
        .select(
          `id,product_brand_id(id,name,url,description,logo),title,slug,description,sort_order,status`
        )
        .single();

      if (!error) {
        return {
          data: data as StylesModal,
          status: true,
        } as BrandStyleApiResponse;
      } else {
        return {
          data: {},
          status: false,
        } as BrandStyleApiResponse;
      }
    } catch (error) {
      console.error("Error in Admin Projects Services==>>>", error);
      return {
        data: {},
        status: false,
      } as BrandStyleApiResponse;
    }
  }

  static async getMaterialBrandStylesByPagination(
    orderby: string,
    order: string
  ): Promise<BrandStyleApiResponse> {
    try {
      const { data, error } = await supabase
        .from("product_brand_styles")
        // .select("*")
        .select(
          `id,product_brand_id(id,name,url,description,logo),title,slug,description,sort_order,status`
        )
        .order(`${orderby}`, { ascending: order == "asec" ? true : false });


        console.group("error in getting ",error)
      if (!error) {
        return {
          data: data as StylesModal[],
          status: true,
        } as BrandStyleApiResponse;
      } else {
        return {
          data: [],
          status: false,
        } as BrandStyleApiResponse;
      }
    } catch (error) {
      console.error("Error in Admin Projects Services==>>>", error);
      return {
        data: [],
        status: false,
      } as BrandStyleApiResponse;
    }
  }

  static async addMaterialBrandStyle(
    product: StylesModal
  ): Promise<BrandStyleApiResponse> {
    try {
      // console.log(product);
      const { data, error } = await supabase
        .from("product_brand_styles")
        .insert(product)
        .select("*");

      if (!error) {
        return {
          data: data as StylesModal,
          status: true,
        } as BrandStyleApiResponse;
      } else {
        return {
          data: {},
          status: false,
        } as BrandStyleApiResponse;
      }
    } catch (error) {
      console.error("Error in Admin Projects Services==>>>", error);
      return {
        data: {},
        status: false,
      } as BrandStyleApiResponse;
    }
  }
}
