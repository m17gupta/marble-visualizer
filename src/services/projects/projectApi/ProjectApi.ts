// Helper function to handle errors
const handleError = (
  error: unknown,
  defaultMessage: string
): ProjectApiResponse | ProjectListResponse => {
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
import { ProjectModel } from "@/models/projectModel/ProjectModel";
import { supabase } from "@/lib/supabase";
import { JobModel } from "@/models";
import { JobService } from "@/services/jobService/JobApi";
import { toast } from "sonner";
import axios from "axios";

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

const BASE_URL =
  import.meta.env.VITE_APP_BACKEND_URL || "https://nexus.dzinly.org/api/v1/";

export class ProjectAPI {
  private static baseUrl = BASE_URL;
  /**
   * Get projects by user ID
   */
  /**
   * Submit a new GenAI request
   * @param request The GenAI request data
   * @returns The response from the GenAI API
   */

  static async getProjectByUserId(userId: string) {
    try {
      const response = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", userId);

      console.log("Response from supabase projects:", response);
      if (response.error) {
        throw response.error;
      }

      if (response.data.length === 0) {
        return {
          success: true,
          data: [],
          message: "No projects found for this user",
        } as ProjectListResponse;
      }
      if (response.data.length > 0) {
        // Use Promise.all to properly handle async operations in mapping
        const projectsWithJobs = await Promise.all(
          response.data.map(async (project: ProjectModel) => {
            // Initialize jobData as an empty array for each project
            const jobData: JobModel[] = [];
            const jobResponse = await JobService.getJobsByProjectId(
              project.id as number
            );

            if (jobResponse.error) {
              toast.error(
                `Failed to fetch jobs for project ${project.id}: ${jobResponse.error}`
              );
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
          message: "Projects fetched successfully",
        } as ProjectListResponse;
      }

      return response;
    } catch (error: unknown) {
      return handleError(
        error,
        "Failed to fetch projects for user"
      ) as ProjectListResponse;
    }
  }

  //  create project
  static async createProject(
    project: ProjectModel
  ): Promise<ProjectApiResponse> {
    try {
      console.log("Creating project with data:", project);
      const { data } = await supabase
        .from("projects")
        .insert(project)
        .select()
        .single();

      return {
        success: true,
        data: data as ProjectModel,
      };
    } catch (error: unknown) {
      return handleError(
        error,
        "Failed to create project"
      ) as ProjectApiResponse;
    }
  }

  // delete project based on projectId
  static async deleteProject(projectId: number): Promise<ProjectApiResponse> {
    try {
      const { data, error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId)
        .select();

      if (error) {
        console.error(`Failed to delete project ${projectId}:`, error);
        throw error;
      }
      console.log(`Project with ID ${projectId} deleted successfully`, data);

      // Check if any rows were deleted
      if (!data || data.length === 0) {
        return {
          success: false,
          data: undefined,
          error: `Project with ID ${projectId} not found`,
        };
      }

      return {
        success: true,
        data: data[0] as ProjectModel,
        message: "Project deleted successfully",
      };
    } catch (error: unknown) {
      return handleError(
        error,
        "Failed to delete project"
      ) as ProjectApiResponse;
    }
  }

  // for creating and updating analysis report
  static async analyseandupdateproject(image_url: string): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseUrl}projects/analyse-house`,
        { image_url },
        {
          headers: {
            Accept: "application/json",
            "X-API-Key": "dorg_sk_ioLOcqR2HTPtXNv44ItBW3RCL4NjLeuWitgP-vJuO3s",
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Analysis Completed:", response);
      if (response.status !== 200) {
        throw new Error(
          response.data.message || "Failed to submit GenAI request"
        );
      }
      return response.data;
    } catch (error: unknown) {
      return handleError(
        error,
        "Failed to update and analyse house"
      ) as ProjectApiResponse;
    }
  }

  static async save_analysed_data(
    projectId: number,
    analysed_data: any
  ): Promise<ProjectApiResponse> {
    try {
      console.log(projectId);
      const { data, error } = await supabase
        .from("projects")
        .select()
        .eq("id", projectId);
      // .update({ analysed_data: analysed_data })
      // .eq("id", projectId)
      // .select()
      // .single();

      if (!data || data.length === 0) {
        return {
          success: false,
          data: undefined,
          error: `Project with ID ${projectId} not found`,
        };
      }
      return {
        success: true,
        data: data[0] as ProjectModel,
        message: "Project deleted successfully",
      };
    } catch (error: unknown) {
      return handleError(
        error,
        "Failed to update and analyse house"
      ) as ProjectApiResponse;
    }
  }
}
