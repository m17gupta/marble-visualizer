import { JobModel } from "../jobModel/JobModel";

export interface ProjectModel {
  id?: number;
  name?: string;
  description?: string;
  visibility?: "public" | "private";
  status?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  progress?: number;
  thumbnail?: string;
  jobData?: JobModel[];
  analysed_data?: AnalyseImageModel;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  visibility?: "public" | "private";
  status?: "active" | "pending" | "completed";
  thumbnail?: string;
  user_id?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  visibility?: "public" | "private";
  user_id?: string;
}

export interface HouseSegmentModel {
  home_url: string;
  segment_prompt: string [];
}
export interface AnalyseImageModel {
  structure: {
    stories: number;
    roof_type: string;
    architectural_style: string;
  };
  segments_detected: {
    walls?: SegmentDetail<WallVariant>;
    windows?: SegmentDetail<WindowVariant>;
    roof?: SegmentDetail<RoofVariant>;
    gutters?: SegmentDetail<GutterVariant>;
    trim?: SegmentDetail<TrimVariant>;
    shutters?: SegmentDetail<ShutterVariant>;
    columns?: SegmentDetail<any>;
    railing?: SegmentDetail<any>;
  };
  summary: string;
  style_suggestions: StyleSuggestions[];
}

interface SegmentDetail<T> {
  types_detected: number;
  variants: T[];
}

interface WallVariant {
  material: string;
  color: string;
  texture: string;
  position: string;
  units_count: number;
}

interface WindowVariant {
  type: string;
  frame_color: string;
  shutter_color: string;
  position: string;
  units_count: number;
}

interface RoofVariant {
  type: string;
  material: string;
  color: string;
  position: string;
  units_count: number;
}

interface GutterVariant {
  type: string;
  material: string;
  color: string;
  placement: string;
  units_count: number;
}

interface TrimVariant {
  category: string;
  material: string;
  color: string;
  units_count: number;
}

interface ShutterVariant {
  material: string;
  color: string;
  position: string;
  style: string;
  units_count: number;
}

interface StyleSuggestions {
  title: string;
  prompt: string;
  target_region: string[];
}
