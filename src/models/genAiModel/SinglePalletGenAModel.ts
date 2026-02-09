
export interface SinglePalletGenAiRequestModel {

jobId: string;
imageUrl?: string;
palletUrl?: string;
prompt?: string;
results?: singlePalletAnnotationRequestModel[];
hollow_results:singlePalletAnnotationRequestModel[]
}


export interface singlePalletAnnotationRequestModel{
  id?:number
  label?: string;
  box?:number[];
  polygon?:number[];
} 

export interface SinglePalletGenAiResponseModel {
  status?: string;
  jobID?: string;
  s3_url?: string;
  local_path?: string;
  output_path?: string;
  width?: number;
  height?: number;
}

export interface NewSinglePalletModel{
  house?: string;
  texture?: string;
  house_url?: string;
  texture_url?: string;
  prompt?: string;
  target_segment?: string;
  client_id?:string;
}

export interface SinglePalletModel{
  image: string;
  material: string;
  jobID: string;
  prompt: string;
  results: singlePalletAnnotationRequestModel[];
  hollow_results:singlePalletAnnotationRequestModel[]
}


export interface singlePalletApiModeModel{
image?:string, 
palette_utl:string,
  prompt:string
}
export interface SinglePalletGenAiOutPutModel {
  id?: string;
  status?: string;
  jobID?: string|number;
  s3_url?: string;
  width?: number;
  height?: number;
  name?: string;
  prompt?:string;
  palletImage?:string,
  isShow?:boolean,
  created?:string,
  created_at?:string
  taskId?:string
}


