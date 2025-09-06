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
export interface DeleteSegmentResponse {
  success: boolean;
  data: number[];
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
    
      return data;
    } catch (error) {
      console.error('Error fetching segments:', error);
      throw error;
    }

  }


  // update jobSegments based on id
  async updateSegmentBasedOnId(segmentData: SegmentModal): Promise<SegmentApiResponse> {
    try {
      const { data, error } = await supabase
        .from('job_segments')
        .update(segmentData)
        .eq('id', segmentData.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error('Error updating segment:', error);
      throw error;
    }
  }

  // update multiple jobSegments
  async updateMultipleSegments(segmentsData: SegmentModal[]): Promise<{ success: boolean; data?: SegmentModal[]; error?: string }> {
    if (!segmentsData || segmentsData.length === 0) {
      throw new Error('No segments data provided');
    }

    try {
      const updatePromises = segmentsData.map(async (segmentData) => {
        const { data, error } = await supabase
          .from('job_segments')
          .update(segmentData)
          .eq('id', segmentData.id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        return data;
      });

      const updatedSegments = await Promise.all(updatePromises);

      return {
        success: true,
        data: updatedSegments,
      };
    } catch (error) {
      console.error('Error updating multiple segments:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }


  // delete jobSegments based on id
  async deleteSegmentById(segmentId: number[]): Promise<DeleteSegmentResponse> {
    if (!segmentId || segmentId.length === 0) {
      throw new Error('Invalid segment ID');
    }

    try {
      const { data, error } = await supabase
        .from('job_segments')
        .delete()
        .in('id', segmentId)
        .select();

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: segmentId
      };
    } catch (error) {
      console.error('Error deleting segment:', error);
      throw error;
    }
  }
}

