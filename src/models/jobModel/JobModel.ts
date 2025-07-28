import { SegmentModal } from "../jobSegmentsModal/JobSegmentModal";


export interface ISkewModel{
  skew_x?:number;
  skew_y?:number;
}

export interface SegLabelsCount {
  Window?: number;
  Wall?: number;
  Trim?: number;
  Door?: number;
  Roof?: number;

}
export interface Cost {
  area?:number;
  rate?: number;
  unit?: string;
  total?: number;
  currency?: string;
}

export interface Swatch {
  swatch_id?: number;
  swatch_seg_image?: string;
  title?:string,
  photo?:string,
  cost?: Cost;
  isActive?: boolean;
  isApproved?: boolean;
  segGroup?: string[];
  new_bucket?:number;
}
export interface DesignerDetail {
  user_id?: number;
  swatch?: Swatch[];
}
export interface  SegmentDetails {
  group?: string,
  pattern?: string,
  annotation_type?:string,
  seg_type?: string;
  label?: string;
  confidence?: number;
  seg_name?: string;
  seg_short?: string;
  seg_dimension_pixel?: number[];
  perimeter_pixel?: number;
  perimeter_feet?: number;
  top_coordinate?: number[];
  annotation?: number[];
  annotation_area_pixel?: number;
  annotation_area_sqft?: number;
  dimension_seg?: number[];
  long_trim_seg_dist?: number[];
  middle_points?: number[];
  bb_annotation_float?: number[];
  bb_annotation_int?: number[];
  bb_area_pixel?: number;
  bb_area_sqft?: number;
  bb_dimension_pixel?: string[];
  bb_dimension_feet?: string[];
  image?:string
  angle?:[];
  skew_value?:ISkewModel
  svg_path?:string;
//   svg_details?:SVGDetailsModel,
  segmentCount?:SegLabelsCount,
  designer?:DesignerDetail[],
  isActive?:boolean,
  swatch?:Swatch

}
export interface JobSegmentModel {
  [key: string]: SegmentDetails , 
 
}
export interface JobModel{
    id?: number;
    title?: string;
    jobType?: string;
    full_image?: string;
    thumbnail?: string;
    project_id?: number;
    created_at?: string;
    updated_at?: string;
    segments?: JobSegmentModel;
}

export  interface GroupSegmentModel {
[key: string]: JobSegmentModel;
}

// export interface SegmentModal {
//   id?: number;
//   job_id?: number;
//   title?: string;
//   short_title?: string;
//   group_name?: string;
//   group_desc?: string;
//   segment_type?: string;
//   annotation_points_float?: number[];
//   segment_bb_float?: number[];
//   annotation_type?: string;
//   seg_perimeter?: number;
//   seg_area_sqmt?: number;
//   seg_skewx?: number;
//   seg_skewy?: number;
//   created_at?: string;
//   updated_at?: string;
//   group_label?: string;
// }


export interface MasterGroupModel {
 groupName: string;
 segments: SegmentModal[];
}

export interface MasterModel{
  id:number,
  name:string,
  color: string,
  color_code: string,
  short_code: string,
   overAllSwatch: Swatch[];
   categories?: string[];
  allSegments: MasterGroupModel[]  //all walls
}




