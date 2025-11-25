

export interface MaterialModel {
  id: number;
  name?:string;
  brand_id?:number|BrandModel;
  product_category_id?:number | categoryModel;
  material_segment_id?:number | Segment_Model
  gallery:string[]




  user_id: number;
  role_id: number;
  material_category_id: number;
  material_brand_id: number;
  material_brand_style_id: number;
  material_type_id?: string;

  title: string;
  description?: string;
  photo?: string;
  color?: string;
  bucket_path?: string;

  is_admin: boolean;
  finish_needed: boolean;
  is_featured: boolean;
  manufacturer_request: boolean;
  manufacturer_request_note?: string;
  status: boolean;

  created?: string; // ISO timestamp
  modified?: string; // ISO timestamp
}

export interface BrandModel{
  id?:number,
  url:string,
  logo?:string,
  name?:string,
  created_at?:string,
}


export interface categoryModel{
  id?:number,
  icon?:string,
  namme?:string,
  sort_order?:string

}


export interface Segment_Model{
  id?:number;
  icon?:string;
  name?:string;
  color?:string;
  index?:number;
  galllery?:string[];
  icon_svg:string;
  is_active?:boolean;
  categories:string[];
  color_code?:string;
  is_visible:boolean;
  short_code:boolean;
  description:string;


}
export interface SingleMaterialResponse {
  id: number;
  user_id: number;
  role_id: number;
  material_category_id: unknown;
  material_brand_id: number;
  material_brand_style_id: number;
  material_type_id?: number;

  title: string;
  description?: string;
  photo?: string;
  color?: string;
  bucket_path?: string;

  is_admin: boolean;
  finish_needed: boolean;
  is_featured: boolean;
  manufacturer_request: boolean;
  manufacturer_request_note?: string;
  status: boolean;

  created?: string; // ISO timestamp
  modified?: string;
}
