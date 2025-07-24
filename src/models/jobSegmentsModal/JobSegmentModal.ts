
export interface JobSegmentModal {
  id: number;
  job_id: number;
  title: string;
  short_title: string;
  group_name: string;
  group_desc: string;
  segment_type: string;
  annotation_points_float: number[];
  segment_bb_float: number[];
  annotation_type: string;
  seg_perimeter: number;
  seg_area_sqmt: number;
  seg_skewx: number;
  seg_skewy: number;
  created_at: string;
  updated_at: string;
  group_label: string;
}
