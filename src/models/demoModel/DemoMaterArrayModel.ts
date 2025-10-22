import { MaterialModel } from "@/services/material/materialService";
import { SegmentModal } from "../jobSegmentsModal/JobSegmentModal";

export interface                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    DemoSwatch{
   pallette?:MaterialModel[],
    
}

export interface DemoMasterModel {
    id?: number,
     name?: string,
     icon?: string,
     color: string,
     color_code: string,
     short_code: string,
     overAllSwatch: MaterialModel[];
     categories?: string[];
     allSegments?: SegmentModal[];  
}
