export type ImageQuality = 'low' | 'medium' | 'high';

export interface AnnotationValue {
  [key: string]: number[];
}

export interface GenAiRequest {
  houseUrl: string[];
  paletteUrl: string[];
  referenceImageUrl: string[];
  prompt: string[];
  imageQuality: ImageQuality;
  annotationValue: AnnotationValue;
}
export interface GenAiModel {
  houseUrl: string[];
  paletteUrl: string[];
  referenceImageUrl: string[];
  prompt: string[];
  imageQuality: ImageQuality;
  annotationValue: AnnotationValue;
}

export interface GenAiResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GenAiState {
  requests: Record<string, GenAiRequest>;
  responses: Record<string, GenAiResponse>;
  loading: boolean;
  error: string | null;
  currentRequestId: string | null;
}

export interface OpenAIMetadata {
  usage: {
    input_tokens: number;
    input_tokens_details: {
      image_tokens: number;
      text_tokens: number;
    };
    output_tokens: number;
    total_tokens: number;
  };
  background: string;
  output_format: string;
  quality: string;
  size: string;
}

export interface GenAiChat {
  id: string;
  project_id: number
  user_id: number;
  job_id: number;
  master_image_path: string;
  palette_image_path: string;
  reference_img: string;
  user_input_text: string;
  output_Image: string;
  output_urls?: string[];  // Array of output image URLs for multiple variants
  isCompleted: boolean;
  isShow: boolean;
  prompt: string;
  task_id: string;
  created: string;
  updated: string;
  created_at?: string;  // Alternative date format
  openai_metadata?: OpenAIMetadata | string;
}

export interface GenAiChatHistory {
  _id: string;
  projectId: number;
  userId: number;
  chats: GenAiChat[];
  created: string;
  updated: string;
}