export interface InspirationColorModel {
    id: string;
    name: string;
    hex: string;
}

export interface InspirationImageModel {
    id: number;
    color_family_id: number;
    code: number;
    name: string;
    image: string;
    status: number;
}