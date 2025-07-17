import { SegmentApi } from "./SegmentApi";


export class SegmentService{
  private segmentApi: SegmentApi;

  constructor() {
    this.segmentApi = new SegmentApi();
  }

// get Manual Annotation Result
async GetManualThroughApi(segmentationInt:number[], segName:string){
  return this.segmentApi.GetMasterDataThroughApi(segmentationInt, segName);
}
}