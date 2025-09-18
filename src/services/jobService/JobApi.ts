
import { supabase } from "@/lib/supabase";
import { DistanceRefModal, DistanceRefResponse, JobApiResponse, JobModel, UpdateJobRequest } from "@/models/jobModel/JobModel";
import { MsterDataAnnotationResponse } from "@/models/jobSegmentsModal/JobSegmentModal";
import axios from "axios";



export class JobApi {
  private static readonly TABLE_NAME = 'job';


  // get master Data based of annotation points
  static async getMasterData(segmentationInt:number[], segName:string):Promise<MsterDataAnnotationResponse>  {
    const value = {
      segmentationInt: segmentationInt,
      className: segName,
      Perfeet: 20
    };
    try {
      const response = await axios.post(`https://api.dzinly.org/manual-annot-result`, value);
      if (response && response.status === 200) {
        console.log('Master Data Response:', response);
        return response.data as MsterDataAnnotationResponse;
      } else {
        throw new Error(response.data?.error || 'Failed to fetch master data');
      }
    } catch (error) {
      console.error('Error in getMasterData:', error);
      throw error;
    }
  }
  /**
   * Create a new job
   */
  static async createJob(jobData: JobModel): Promise<JobApiResponse<JobModel>> {
    try {
      const newJob: JobModel = {
        title: jobData.title,
        jobType: jobData.jobType,
        full_image: jobData.full_image,
        thumbnail: jobData.thumbnail,
        project_id: jobData.project_id,
        // segements: jobData.segements || '{}',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log("New Job Data to insert:", newJob);
      const { data, error } = await supabase
        .from("job")
        .insert( newJob )
        .select()
        .single();

        console.log("Supabase insert response:", { data, error });  
      if (error) {
        console.error('Error creating job:', error);
        return {
          data: null,
          error: error.message,
          success: false,
        };
      }

      return {
        data: data as JobModel,
        error: null,
        success: true,
      };
    } catch (error) {
      console.error('Error in createJob:', error);
      return {
        data: null,
        error: (error as Error).message || 'Failed to create job',
        success: false,
      };
    }
  }

  /**
   * Get jobs by project ID
   */
  static async getJobsByProjectId(projectId: number): Promise<JobApiResponse<JobModel[]>> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('*')
        .eq('project_id', projectId)
      
        
      if (error) {
        console.error('Error fetching jobs by project ID:', error);
        return {
          data: null,
          error: error.message,
          success: false,
        };
      }

      return {
        data: data as JobModel[],
        error: null,
        success: true,
      };
    } catch (error) {
      console.error('Error in getJobsByProjectId:', error);
      return {
        data: null,
        error: (error as Error).message || 'Failed to fetch jobs',
        success: false,
      };
    }
  }

  /**
   * Get a single job by ID
   */
  static async getJobById(id: number): Promise<JobApiResponse<JobModel>> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching job by ID:', error);
        return {
          data: null,
          error: error.message,
          success: false,
        };
      }

      return {
        data: data as JobModel,
        error: null,
        success: true,
      };
    } catch (error) {
      console.error('Error in getJobById:', error);
      return {
        data: null,
        error: (error as Error).message || 'Failed to fetch job',
        success: false,
      };
    }
  }

  /**
   * Update an existing job
   */
  static async updateJob(id: number, updates: UpdateJobRequest): Promise<JobApiResponse<JobModel>> {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating job:', error);
        return {
          data: null,
          error: error.message,
          success: false,
        };
      }

      return {
        data: data as JobModel,
        error: null,
        success: true,
      };
    } catch (error) {
      console.error('Error in updateJob:', error);
      return {
        data: null,
        error: (error as Error).message || 'Failed to update job',
        success: false,
      };
    }
  }


  
  /**
   * Delete a job
   */
  static async deleteJob(id: number): Promise<JobApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from(this.TABLE_NAME)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting job:', error);
        return {
          data: null,
          error: error.message,
          success: false,
        };
      }

      return {
        data: true,
        error: null,
        success: true,
      };
    } catch (error) {
      console.error('Error in deleteJob:', error);
      return {
        data: null,
        error: (error as Error).message || 'Failed to delete job',
        success: false,
      };
    }
  }

  //update distance ref based on job Id

  static async updateDistanceRef(id: number, distanceRef: DistanceRefModal): Promise<DistanceRefResponse> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .update({
          distance_ref: distanceRef,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating distance reference:', error);
        return {
          data: null,
          error: error.message,
          success: false,
        };
      }

      return {
        data: {
          id: id,
          distance_ref: data,
        },
        error: null,
        success: true,
      };
    } catch (error) {
      console.error('Error in updateDistanceRef:', error);
      return {
        data: null,
        error: (error as Error).message || 'Failed to update distance reference',
        success: false,
      };
    }
  }
  /**
   * Update job segments specifically
   */
  static async updateJobSegments(id: number, segments: string): Promise<JobApiResponse<JobModel>> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .update({
          segements: segments,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating job segments:', error);
        return {
          data: null,
          error: error.message,
          success: false,
        };
      }

      return {
        data: data as JobModel,
        error: null,
        success: true,
      };
    } catch (error) {
      console.error('Error in updateJobSegments:', error);
      return {
        data: null,
        error: (error as Error).message || 'Failed to update job segments',
        success: false,
      };
    }
  }

  /**
   * Get all jobs (for admin purposes)
   */
  static async getAllJobs(): Promise<JobApiResponse<JobModel[]>> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all jobs:', error);
        return {
          data: null,
          error: error.message,
          success: false,
        };
      }

      return {
        data: data as JobModel[],
        error: null,
        success: true,
      };
    } catch (error) {
      console.error('Error in getAllJobs:', error);
      return {
        data: null,
        error: (error as Error).message || 'Failed to fetch jobs',
        success: false,
      };
    }
  }

  /**
   * Get jobs by job type
   */
  static async getJobsByType(jobType: string): Promise<JobApiResponse<JobModel[]>> {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('*')
        .eq('jobType', jobType)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs by type:', error);
        return {
          data: null,
          error: error.message,
          success: false,
        };
      }

      return {
        data: data as JobModel[],
        error: null,
        success: true,
      };
    } catch (error) {
      console.error('Error in getJobsByType:', error);
      return {
        data: null,
        error: (error as Error).message || 'Failed to fetch jobs by type',
        success: false,
      };
    }
  }

  /**
   * Search jobs by title
   */
  static async searchJobsByTitle(searchTerm: string, projectId?: number): Promise<JobApiResponse<JobModel[]>> {
    try {
      let query = supabase
        .from(this.TABLE_NAME)
        .select('*')
        .ilike('title', `%${searchTerm}%`);

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error searching jobs:', error);
        return {
          data: null,
          error: error.message,
          success: false,
        };
      }

      return {
        data: data as JobModel[],
        error: null,
        success: true,
      };
    } catch (error) {
      console.error('Error in searchJobsByTitle:', error);
      return {
        data: null,
        error: (error as Error).message || 'Failed to search jobs',
        success: false,
      };
    }
  }
}

