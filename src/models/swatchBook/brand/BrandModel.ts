export interface BrandModel {
    id: number;
    material_category_id: number;
    title: string;
    slug: string;
    description: string | null;
    photo: string | null;
    status: boolean;
    sort_order: number;
}