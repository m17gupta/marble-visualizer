export interface CategoryModel {
  id: number;
  title: string;
  slug: string;
    description: string | null;
    photo: string | null;
    sort_order: number;
    status: boolean;
}
