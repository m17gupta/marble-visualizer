import { ProductCategory } from "@/AdminPannel/reduxslices/adminMaterialCategorySlice";
import {
  AttributeId,
  MaterialBrand,
  MaterialCategory,
  MaterialSegment,
  Product,
  ProductAttributeValue,
  Variant,
} from "@/components/swatchBook/interfaces";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export interface ApiResponse {
  data: Product[] | materialBrandCategory[] | Product;
  status: boolean;
  count?: number;
}

export interface materialBrandCategory {
  id?: number;
  brand_id?: MaterialBrand;
  category_id?: MaterialCategory;
  material_segment_id?: MaterialSegment;
}

export interface handleSaveProps {
  product: Product;
  selected: AttributeId[];
  variants: Variant[];
}

export type APIResponseForProductSave = [number | null, string | null];

export interface SaveApiResponse {
  data: APIResponseForProductSave;
  status: boolean;
}

export interface getMaterialByPaginationArgs {
  item_per_page: number;
  current_page: number;
  segment_id?: any[];
  category_id?: any[];
  brand_id?: any[];
}

export class AdminMaterialLibService {
  /**
   * get project by user id
   */
  static async getMaterialByPagination({
    item_per_page = 20,
    current_page,
    segment_id,
    category_id,
    brand_id,
  }: getMaterialByPaginationArgs): Promise<ApiResponse> {
    try {
      let query = supabase.from("products").select(
        `id,
         name,
         brand_id(*),
         product_category_id(*),
         material_segment_id(*),
         description,
         photo,
         bucket_path,
         new_bucket,
         ai_summary,
         base_price,
         product_variants(*)`,
        { count: "exact" }
      );
      if (segment_id?.length! > 0)
        query = query.in("material_segment_id", segment_id!);

      // 2️⃣ then filter further by category if provided
      if (category_id!?.length > 0)
        query = query.in("product_category_id", category_id!);

      if (brand_id!?.length > 0) query = query.in("brand_id", brand_id!);

      const from = (current_page - 1) * item_per_page;

      const to = from + item_per_page - 1;

      query = query.range(from, to);

      const { data, error, count } = await query;

      if (!error) {
        return {
          data: data as Product[],
          status: true,
          count: count!,
        };
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

  static async saveProduct(product: Product): Promise<SaveApiResponse> {
    try {
      const { data, error } = await supabase
        .from("products")
        .insert(product)
        .select("*")
        .single();

      if (error) {
        return {
          data: [null, error?.message],
          status: false,
        } as SaveApiResponse;
      } else {
        return {
          data: [data.id, null],
          status: true,
        } as SaveApiResponse;
      }
    } catch (error) {
      console.error("Error in Admin Projects Services==>>>", error);
      return {
        data: [null, error],
        status: false,
      } as SaveApiResponse;
    }
  }

  static async saveAttributesInDatabase({
    id,
    selected,
  }: {
    id: number;
    selected: AttributeId[];
  }): Promise<[ProductAttributeValue[] | null, string | null]> {
    try {
      const attributeValues: ProductAttributeValue[] = selected
        .flatMap((d: AttributeId) =>
          (d.selected_values ?? []).map((val: string | number) => ({
            product_id: null,
            attribute_id: d.id,
            value: val,
            is_variant_value: d.is_variant_value ?? false,
            visible: d.visible ?? true,
          }))
        )
        .map((d) => {
          return {
            ...d,
            product_id: id,
          };
        });
      const { data, error } = await supabase
        .from("product_attribute_values_duplicate")
        .insert(attributeValues)
        .select("*");

      if (error) {
        this.deleteProduct(id);
        return [null, error.message];
      } else {
        return [data, null];
      }
    } catch (error) {
      throw error;
    }
  }

  static async saveVariant({
    attrvalues,
    varaintwithvariations,
    productid,
  }: {
    attrvalues: any[];
    varaintwithvariations: any[];
    productid: number;
  }) {
    try {
      let variantArray = [];
      const set = new Set();

      const duplicateCheck = [];

      let ids: number[] = [];

      varaintwithvariations.forEach((vary) => {
        if (set.has(vary.sku)) {
          duplicateCheck.push(vary.sku);
        } else {
          set.add(vary.sku);
        }
      });

      if (duplicateCheck.length > 0) {
        return null;
      }

      for (let vary of varaintwithvariations) {
        let toSaveinDb = {
          product_id: productid,
          sku: vary.sku,
          price: vary.price,
          stock: vary.stock,
          image_url: vary.image_url || "",
        };

        let variations = Object.entries(vary.variations) as [
          string,
          ProductAttributeValue
        ][];

        const { data, error } = await supabase
          .from("product_variants")
          .insert(toSaveinDb)
          .select("*")
          .single();

        if (error) {
          toast.error(`Error in Id: ${toSaveinDb.sku}`);
          this.deleteProduct(productid);
          if (ids.length > 0) {
            this.deleteVariant(ids);
          }
          break;
          // Delete attributeValues
        } else {
          ids.push(data.id);
          for (let variation of variations) {
            const getData = attrvalues.find(
              (d) => d.value == variation[1].value
            );

            if (getData?.attribute_id && getData.value) {
              variantArray.push({
                variant_id: data.id,
                attribute_id: getData.attribute_id,
                value: getData.id,
              });
            }
          }
        }
      }
      return variantArray;
    } catch (error) {
      throw error;
    }
  }

  static async handleSave({
    product,
    selected,
    variants,
  }: handleSaveProps): Promise<ApiResponse> {
    try {
      const [id, err] = (await this.saveProduct(product)).data;
      if (err) {
        toast.error(err);
        return {
          data: {},
          status: false,
        } as ApiResponse;
      }

      const [data, attributesaveerror] = await this.saveAttributesInDatabase({
        id: id!,
        selected: selected,
      });

      if (attributesaveerror) {
        toast.error(attributesaveerror);
        return {
          data: {},
          status: false,
        } as ApiResponse;
      }

      let variantinDBS;

      let varaintwithvariations = variants.filter((d: any) => d.checked);

      if (data != null) {
        variantinDBS = (await this.saveVariant({
          attrvalues: data,
          varaintwithvariations: varaintwithvariations,
          productid: id!,
        }))!.map((d) => {
          return {
            ...d,
          };
        });
      }

      const { data: savedVariant, error } = await supabase
        .from("variant_attribute_values")
        .insert(variantinDBS);
      if (error) {
        toast.error("Issue in Saving Variant Attribute Values");
        return {
          data: {},
          status: false,
        } as ApiResponse;
      } else {
        toast.success("Variant Data is Saved in Database");
        const { data: d, error: e } = await supabase
          .from("products")
          .select(
            `id,
         name,
         brand_id(*),
         product_category_id(*),
         material_segment_id(*),
         description,
         photo,
         bucket_path,
         new_bucket,
         ai_summary,
         base_price,
         product_variants(*)`
          )
          .eq("id", id)
          .single();
        return {
          data: data as Product,
          status: true,
        } as ApiResponse;
      }
    } catch (error) {
      throw error;
    }
  }

  static async deleteProduct(id: number): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      throw error;
    }
  }

  static async deleteVariant(id: number[]): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from("product_variants")
        .delete()
        .in("id", id);

      if (error) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      throw error;
    }
  }

  static async SelectCatgeoryBrandSegment({
    name,
    id,
  }: {
    name: string;
    id: number;
  }): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from("product_brand_categories")
        .select(`brand_id(*),category_id(*),material_segment_id(*)`)
        .eq(name, id);

      if (error) {
        return {
          data: [],
          status: false,
        } as ApiResponse;
      } else {
        return {
          data: data as materialBrandCategory[],
          status: true,
        } as ApiResponse;
      }
    } catch (error) {
      throw error;
    }
  }
}
