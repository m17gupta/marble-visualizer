import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";
import { DeleteSegmentResponse, SegmentApi, SegmentApiResponse } from "./SegmentApi";


export class SegmentService{
  private segmentApi: SegmentApi;

  constructor() {
    this.segmentApi = new SegmentApi();
  }

// get Manual Annotation Result
async GetManualThroughApi(segmentationInt:number[], segName:string){
  return this.segmentApi.GetMasterDataThroughApi(segmentationInt, segName);
}

async createSegment(segmentData: SegmentModal) {
  return this.segmentApi.createSegment(segmentData);
}

async getSegmentsByJobId(jobId: number): Promise<SegmentModal[]> {
  return this.segmentApi.getSegmentsByJobId(jobId);
}

async updateSegmentById(segmentData: SegmentModal): Promise<SegmentApiResponse> {
  return this.segmentApi.updateSegmentBasedOnId(segmentData);
}

async updateMultipleSegment(segmentData: SegmentModal[]): Promise<{ success: boolean; data?: SegmentModal[]; error?: string }> {
  return this.segmentApi.updateMultipleSegments(segmentData);
}

async deleteSegmentById(segmentId: number[]): Promise<DeleteSegmentResponse> {
  return this.segmentApi.deleteSegmentById(segmentId);
}

async deleteSegmentId(segmentId: number): Promise<{status:boolean}> {
  return this.segmentApi.deleteSegmentBySegId(segmentId)
}
}