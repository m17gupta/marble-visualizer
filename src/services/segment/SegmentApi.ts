import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";
import axios from "axios";
import { supabase } from "@/lib/supabase";
const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

export interface SegmentApiResponse {
  success: boolean;
  data?: SegmentModal;
  message?: string;
  error?: string;
}
export class SegmentApi {
  // Base URL for the Segment API
  private baseUrl = BASE_URL;

  /**
   * Fetch segments for a specific project
   * @param projectId The ID of the project to fetch segments for
   * @returns The segments for the specified project
   */

  async GetMasterDataThroughApi(segmentationInt: number[], segName: string) {
    const data = {
      segmentationInt: segmentationInt,
      className: segName,
      Perfeet: 20
    }
    return axios.post(`${this.baseUrl}/manual-annot-result`, data)
      .then(response => {

        return response
      }).catch(error => {
        throw error;
      });
  }

  // add segmment data into table
async createSegment(segmentData: SegmentModal): Promise<SegmentApiResponse> {
  try {
    const response = await supabase
      .from('job_segments')
      .insert(segmentData)
      .select()  // Request inserted row data
      .single();

    console.log('Segment created:', response);

    if (!response || !response.data) {
      throw new Error('Failed to create segment');
    }

    return {
      success: true,
      data: response.data,  // Return only the inserted row
    };
  } catch (error) {
    console.error('Error creating segment:', error);
    throw error;
  }
}


  /**
   * Fetch all segments for a specific job
   * @param jobId The ID of the job to fetch segments for
   * @returns The segments for the specified job
   */
  async getSegmentsByJobId(jobId: number): Promise<SegmentModal[]> {
    try {
      const { data, error } = await supabase
        .from('job_segments')
        .select('*')
        .eq('job_id', jobId);

      if (error) {
        throw error;
      }
      console.log('Fetched segments:', data);
      return data;
    } catch (error) {
      console.error('Error fetching segments:', error);
      throw error;
    }

  }

}

