export interface AddMaterialModel {
    id?: string
    title?: string
    basic_price?: number | null
    description?: string | null
    media?: string
    segment_type?: string | null
    category?: string | null
    color?: string | null
    origin_country?: string | null
    finish_type?: string | null
    polished?: boolean
    thickness?: string | null
    size?: string | null
    weight?: number | null
    density?: number | null
}