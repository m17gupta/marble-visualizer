export interface InspirationColorModel {
     id: number;
    code?: string;
    name?: string;
    image?: string;
    dp?:string
    status?: number;
    is_commercial?: number;
    created_at?: string;
}

export interface InspirationImageModel {
      id: number;
    color_family_id?: number;
    code?: number;
    name?: string;
    image?: string;
    dp?: string;
    status?: number;
    is_commercial:number,
    created_at?: string;
}

// export interface ColorFamilyModel {
//     id: number;
//     code?: string;
//     name?: string;
//     image?: string;
//     dp?:string
//     status?: number;
//     is_commercial?: number;
//     created_at?: string;
// }

// export interface InspirationalModel {
//     id: number;
//     color_family_id?: number;
//     code?: number;
//     name?: string;
//     image?: string;
//     dp?: string;
//     status?: number;
//     is_commercial:number,
//     created_at?: string;
// }