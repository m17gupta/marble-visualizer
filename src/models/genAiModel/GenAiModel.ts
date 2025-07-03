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