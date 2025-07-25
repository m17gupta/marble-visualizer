
export interface SegmentModal {
  id?: number;
  job_id?: number;
  title?: string;
  short_title?: string;
  group_name?: string;
  group_desc?: string;
  segment_type?: string;
  annotation_points_float?: number[];
  segment_bb_float?: number[];
  annotation_type?: string;
  seg_perimeter?: number;
  seg_area_sqmt?: number;
  seg_skewx?: number;
  seg_skewy?: number;
  created_at?: string;
  updated_at?: string;
  group_label?: string;
}


export interface MsterDataAnnotationResponse {
  annotation: number[];
  bb_annotation_int: number[];
  bb_area_pixel: number;
  bb_area_sqft: number;
  mid2midDistance: number[];
  long_trim_seg_dist: [number, number, number, number, number][];
  perimeter_pixel: number;
  perimeter_feet: number;
  annotation_area_pixel: number;
  annotation_area_sqft: number;
  bb_dimension_pixel: number[];
  bb_dimension_feet: number[];
}