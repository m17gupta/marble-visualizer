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
  house_segments?: string ;
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
    columns?: SegmentDetail<TrimVariant>;
    railing?: SegmentDetail<TrimVariant>;
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

export interface StyleSuggestions {
  title: string;
  prompt: string;
  target_region: string[];
}


 export interface HouseSegmentResponse {
  status: string;
  results: DetectionResult[];
}

interface DetectionResult {
  label: string;           // e.g. "Door.", "Window."
  score: number;           // confidence score, e.g. 0.83
  box: [number, number, number, number]; // bounding box: [x1, y1, x2, y2]
  polygon: [number, number][]; // polygon shape: array of [x, y] points
}
