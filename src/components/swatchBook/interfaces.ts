export interface AttributeId {
  id?: number;
  name?: string;
  unit?: string | null;
  data_type: "text" | "number" | "enum" | "boolean";
  possible_values?: (string | number)[] | null;
  selected_values?: (string | number)[];
  visible?: boolean;
  is_variant_value?: boolean;
}

export interface Attribute {
  id: number;
  attribute_group_id: number;
  attribute_id: AttributeId;
  sort_order: number;
}

export interface AttributeGroup {
  attribute_group_id: number;
  attributes: Attribute[];
}

export interface Group {
  id: number;
  name: string;
  attribute_set_id: number;
}

export interface AttributeSet {
  id: number;
  name: string;
}

export interface AttributeValues {
  [key: number]:
    | string
    | number
    | readonly string[]
    | boolean
    | undefined
    | null;
}

export interface SearchTerms {
  [key: number]: string;
}

export interface ShowDropdowns {
  [key: number]: boolean;
}

export interface ProductData {
  product_category_id: number | null;
  brand_id: null | number;
  description: string;
  name: string;
  product_attribute_set_id: number | null;
}

export interface Brand {
  id: number;
  url: string | null;
  name: string;
  description: string;
  logo: string | null;
}

export type StockStatus = "in_stock" | "out_of_stock" | "on_backorder";
export type shippingclasss = "in_stock" | "out_of_stock" | "on_backorder";
export type backorders = "Allow" | "Dont Allow" | "Allow, but Notify";

export interface Variant {
  id?: number;
  product_id?: number | null;
  sku?: string;
  stock?: number | null;
  price?: number | null;
  sale_price?: number | null;
  identifier?: string;
  stock_status?: StockStatus;
  shipping_class?: shippingclasss;
  dimensions?: {
    L: number;
    W: number;
    H: number;
  };
  description?: string;
  image_url?: string;
  allow_backorder?: backorders;
  threshold?: number;
  variations?: Variations;
  checked?: boolean;
}

export interface Variations {
  [key: number]: ProductAttributeValue;
}

export interface VariantAttributeValues {
  [key: number]: string | number | boolean | string[] | undefined | null;
}

export interface ProductAttributeValue {
  id?: number | null;
  product_id?: number | null;
  attribute_id?: number | null;
  value?: string | number;
  is_variant_value?: boolean;
  visible?: boolean;
}

// New One:

export type SortField =
  | "name"
  | "brand_id"
  | "product_category_id"
  | "created_at"
  | "base_price";
export type SortOrder = "asc" | "desc" | null;

export interface MaterialBrand {
  id?: number;
  url?: string;
  name?: string;
  description?: string;
  logo?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MaterialCategory {
  id?: number;
  name?: string;
  icon?: string;
  sort_order?: number;
}

export interface MaterialSegment {
  id?: number | null;
  name?: string;
  color?: string;
  color_code?: string;
  icon?: string;
  icon_svg?: string;
  index?: number;
  is_active?: boolean;
  is_visible?: boolean;
  description?: string;
  short_code?: string;
  categories?: string;
  gallery?: string;
}

export interface ProductVariant {
  id: number;
  product_id?: number;
  sku?: string;
  stock?: number;
  created_at?: string;
  updated_at?: string;
  image_url?: string;
  price?: number;
}

export interface Product {
  id?: number;
  name?: string;
  brand_id?: MaterialBrand | null | number;
  product_category_id?: MaterialCategory | null | number;
  created_at?: string;
  description?: string;
  photo?: string;
  bucket_path?: string;
  new_bucket?: number;
  ai_summary?: string | null;
  base_price?: number | null;
  material_segment_id?: MaterialSegment | null | number;
  product_variants?: ProductVariant[];
  gallery?: string[];
}
export interface ActiveFilter {
  type: "category" | "brand";
  id: number;
  name: string;
}

export interface MaterialConnection {
  id?: number;
  brand_id: MaterialBrand | number;
  category_id: MaterialCategory | number;
  material_segment_id: MaterialSegment | number;
}

type Data_Type = "enum" | "number" | "text";

export interface MaterialAttributes {
  id?: number;
  name?: string;
  data_type?: Data_Type;
  unit?: string;
  possible_values?: (string | number)[] | null;
  type?: string;
  category_id?: number | null | MaterialCategory | undefined;
}
