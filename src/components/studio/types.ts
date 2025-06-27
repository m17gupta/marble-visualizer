export interface DesignSettings {
  style: string;
  level: number;
  preserve: string[];
  tone: string;
  intensity: number;
}

export interface Job {
  id?: string | number;
  title?: string;
  jobType?: string;
  full_image?: string;
  thumbnail?: string;
  project_id?: number;
  segements?: string;
  status?: string;
}
