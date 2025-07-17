import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;
export class SegmentApi {
  // Base URL for the Segment API
  private baseUrl = BASE_URL;

    /**
     * Fetch segments for a specific project
     * @param projectId The ID of the project to fetch segments for
     * @returns The segments for the specified project
     */

   async GetMasterDataThroughApi(segmentationInt:number[], segName:string){
    const data={
        segmentationInt:segmentationInt ,
          className: segName,
          Perfeet: 20
      }
    return axios.post(`${this.baseUrl}/manual-annot-result`,data)
    .then(response => {
       
        return response
    }).catch(error => {
        throw error;
    });
}

}


