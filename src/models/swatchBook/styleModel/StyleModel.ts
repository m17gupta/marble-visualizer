export interface StyleModel {
   id: number;
  material_brand_id: number;
  title: string;
  slug: string;
  description: string;
  sort_order: number;
  status: boolean;
  photo: string;     
}

export interface SearchStyleModel extends StyleModel {
 material_brand_title?: string;
}