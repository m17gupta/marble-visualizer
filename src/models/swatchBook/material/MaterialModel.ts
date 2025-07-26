export interface MaterialModel {
  id: number;
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
