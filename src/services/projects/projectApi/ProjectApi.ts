// Helper function to handle errors
const handleError = (error: unknown, defaultMessage: string): ProjectApiResponse | ProjectListResponse => {
  if (error instanceof Error) {
    return {
      success: false,
      error: error.message,
    };
  }
  return {
    success: false,
    error: defaultMessage,
  };
};
import {
  ProjectModel,

} from "@/models/projectModel/ProjectModel";
import { supabase } from "@/lib/supabase";
import { JobModel } from "@/models";
import { JobService } from "@/services/jobService/JobApi";
import { toast } from "sonner";

// Project API Response Types
export interface ProjectApiResponse {
  success: boolean;
  data?: ProjectModel;
  message?: string;
  error?: string;
}

export interface ProjectListResponse {
  success: boolean;
  data?: ProjectModel[];
  message?: string;
  error?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}



export class ProjectAPI {

  /**
   * Get projects by user ID
   */

  static async getProjectByUserId(userId: string) {
    try {
      const response = await supabase.from("projects").select("*").eq("user_id", userId);

      console.log("Response from supabase projects:", response);
      if (response.error) {
        throw response.error;
      }
    
      if( response.data.length === 0) {
        return {
          success: true,
          data: [],
          message: 'No projects found for this user',
        } as ProjectListResponse;
      }
      if( response.data.length > 0) {
        // Use Promise.all to properly handle async operations in mapping
        const projectsWithJobs = await Promise.all(
          response.data.map(async (project: ProjectModel) => {
            // Initialize jobData as an empty array for each project
            const jobData: JobModel[] = [];
            const jobResponse = await JobService.getJobsByProjectId(project.id as number);
          
            if (jobResponse.error) {
             
              toast.error(`Failed to fetch jobs for project ${project.id}: ${jobResponse.error}`);
              // Don't throw here, just log the error and continue with empty jobs array
            } else if (jobResponse.data) {
              jobData.push(...jobResponse.data);
            }
            
            return {
              ...project,
              jobData,
            };
          })
        );
        
        
        return {
          success: true,
          data: projectsWithJobs,
          message: 'Projects fetched successfully',
        } as ProjectListResponse;
      }
     
      return response;
    } catch (error: unknown) {
      return handleError(error, 'Failed to fetch projects for user') as ProjectListResponse;
    }
  }


  //  create project 
  static async createProject(project: ProjectModel): Promise<ProjectApiResponse> {
    try {
      console.log("Creating project with data:", project);
      const { data } = await supabase
        .from("projects")
        .insert(project)
        .select()   
        .single();
      console.log("data from supabase", data);
    
      console.log("Project created successfully:", data);
      return {
        success: true,
        data: data as ProjectModel,
      };
    } catch (error: unknown) {
      return handleError(error, 'Failed to create project') as ProjectApiResponse;
    }
  }
}

