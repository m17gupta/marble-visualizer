
import { 
  ProjectModel, 
  
} from "@/models/projectModel/ProjectModel";
import { supabase } from "@/lib/supabase";

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

export class ProjectAPI {

  /**
   * Get projects by user ID
   */

  static async getProjectByUserId(userId: string) {
    try {
      const response = await supabase.from("projects").select("*").eq("user_id", userId);
      console.log("response by supabase", response);
      return response;
    } catch (error: unknown) {
      return handleError(error, 'Failed to fetch projects for user') as ProjectListResponse;
    }
  }
 

 



  
}


