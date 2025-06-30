export interface MaterialSegmentModel {
  id: number;
  name: string;
  color: string;
  color_code: string;
  icon: string;
  icon_svg: string;
  index: number;
  is_active: boolean;
  is_visible: boolean;
  description: string;
  short_code: string;
  categories: string[];
  gallery: string[];
}

export interface CreateMaterialSegmentRequest {
  name: string;
  color: string;
  color_code: string;
  icon?: string;
  icon_svg?: string;
  index: number;
  is_active?: boolean;
  is_visible?: boolean;
  description?: string;
  short_code: string;
  categories?: string[];
  gallery?: string[];
}

export interface UpdateMaterialSegmentRequest {
  id: number;
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
  categories?: string[];
  gallery?: string[];
}

export interface MaterialSegmentResponse {
  data: MaterialSegmentModel[];
  message: string;
  success: boolean;
}

export interface SingleMaterialSegmentResponse {
  data: MaterialSegmentModel;
  message: string;
  success: boolean;
}

export interface MaterialSegmentFilters {
  is_active?: boolean;
  is_visible?: boolean;
  categories?: string[];
  color?: string;
  search?: string;
  page?: number;
  limit?: number;
}
